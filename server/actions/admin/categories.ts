"use server";

import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createCategorySchema = z.object({
  nameRu: z.string().min(1, "Name RU is required"),
  nameEn: z.string().min(1, "Name EN is required"),
  nameKk: z.string().min(1, "Name KK is required"),
  imageUrl: z.string().url("Invalid image URL"),
  filterTag: z.string().min(1, "Filter tag is required"),
});

const updateCategorySchema = z.object({
  nameRu: z.string().min(1).optional(),
  nameEn: z.string().min(1).optional(),
  nameKk: z.string().min(1).optional(),
  imageUrl: z.string().url().optional(),
  filterTag: z.string().min(1).optional(),
});

export async function createCategoryAction(formData: FormData) {
  try {
    await requireAdmin();

    const data = {
      nameRu: formData.get("nameRu") as string,
      nameEn: formData.get("nameEn") as string,
      nameKk: formData.get("nameKk") as string,
      imageUrl: formData.get("imageUrl") as string,
      filterTag: formData.get("filterTag") as string,
    };

    const validated = createCategorySchema.parse(data);

    const category = await db.category.create({
      data: validated,
      include: {
        _count: {
          select: {
            anketa: true,
          },
        },
      },
    });

    revalidatePath("/admin/categories");
    return { success: true, data: category };
  } catch (error) {
    console.error("createCategoryAction error:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: "Failed to create category" };
  }
}

export async function updateCategoryAction(
  id: string,
  formData: FormData
) {
  try {
    await requireAdmin();

    const data: Record<string, string> = {};
    if (formData.get("nameRu")) data.nameRu = formData.get("nameRu") as string;
    if (formData.get("nameEn")) data.nameEn = formData.get("nameEn") as string;
    if (formData.get("nameKk")) data.nameKk = formData.get("nameKk") as string;
    if (formData.get("imageUrl")) data.imageUrl = formData.get("imageUrl") as string;
    if (formData.get("filterTag")) data.filterTag = formData.get("filterTag") as string;

    const validated = updateCategorySchema.parse(data);

    const category = await db.category.update({
      where: { id },
      data: validated,
      include: {
        _count: {
          select: {
            anketa: true,
          },
        },
      },
    });

    revalidatePath("/admin/categories");
    return { success: true, data: category };
  } catch (error) {
    console.error("updateCategoryAction error:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: "Failed to update category" };
  }
}

export async function deleteCategoryAction(id: string) {
  try {
    await requireAdmin();

    await db.category.delete({
      where: { id },
    });

    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error) {
    console.error("deleteCategoryAction error:", error);
    return { success: false, error: "Failed to delete category" };
  }
}




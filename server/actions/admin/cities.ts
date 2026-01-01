"use server";

import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createCitySchema = z.object({
  nameRu: z.string().min(1, "Name RU is required"),
  nameEn: z.string().min(1, "Name EN is required"),
  nameKk: z.string().min(1, "Name KK is required"),
  isActive: z.boolean().default(true),
});

const updateCitySchema = z.object({
  nameRu: z.string().min(1).optional(),
  nameEn: z.string().min(1).optional(),
  nameKk: z.string().min(1).optional(),
  isActive: z.boolean().optional(),
});

export async function createCityAction(formData: FormData) {
  try {
    await requireAdmin();

    const data = {
      nameRu: formData.get("nameRu") as string,
      nameEn: formData.get("nameEn") as string,
      nameKk: formData.get("nameKk") as string,
      isActive: formData.get("isActive") === "true",
    };

    const validated = createCitySchema.parse(data);

    const city = await db.city.create({
      data: validated,
      include: {
        _count: {
          select: {
            anketa: true,
          },
        },
      },
    });

    revalidatePath("/admin/cities");
    return { success: true, data: city };
  } catch (error) {
    console.error("createCityAction error:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: "Failed to create city" };
  }
}

export async function updateCityAction(id: string, formData: FormData) {
  try {
    await requireAdmin();

    const data: Record<string, any> = {};
    if (formData.get("nameRu")) data.nameRu = formData.get("nameRu") as string;
    if (formData.get("nameEn")) data.nameEn = formData.get("nameEn") as string;
    if (formData.get("nameKk")) data.nameKk = formData.get("nameKk") as string;
    if (formData.get("isActive") !== null) {
      data.isActive = formData.get("isActive") === "true";
    }

    const validated = updateCitySchema.parse(data);

    const city = await db.city.update({
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

    revalidatePath("/admin/cities");
    return { success: true, data: city };
  } catch (error) {
    console.error("updateCityAction error:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: "Failed to update city" };
  }
}

export async function deleteCityAction(id: string) {
  try {
    await requireAdmin();

    await db.city.delete({
      where: { id },
    });

    revalidatePath("/admin/cities");
    return { success: true };
  } catch (error) {
    console.error("deleteCityAction error:", error);
    return { success: false, error: "Failed to delete city" };
  }
}




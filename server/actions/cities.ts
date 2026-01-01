"use server";

import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const citySchema = z.object({
  nameRu: z.string().min(1),
  nameEn: z.string().min(1),
  nameKk: z.string().min(1),
  isActive: z.boolean().default(true),
});

export async function createCity(data: z.infer<typeof citySchema>) {
  await requireAdmin();

  const validated = citySchema.parse(data);

  const city = await db.city.create({
    data: validated,
  });

  revalidatePath("/admin/cities");
  revalidatePath("/anketas");

  return { success: true, city };
}

export async function updateCity(
  id: string,
  data: Partial<z.infer<typeof citySchema>>
) {
  await requireAdmin();

  const validated = citySchema.partial().parse(data);

  const city = await db.city.update({
    where: { id },
    data: validated,
  });

  revalidatePath("/admin/cities");
  revalidatePath("/anketas");

  return { success: true, city };
}

export async function deleteCity(id: string) {
  await requireAdmin();

  await db.city.delete({
    where: { id },
  });

  revalidatePath("/admin/cities");
  revalidatePath("/anketas");

  return { success: true };
}



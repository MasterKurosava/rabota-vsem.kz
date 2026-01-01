"use server";

import { db } from "@/lib/db";
import { requireAuth, requireAdmin } from "@/lib/auth";
import { anketaSchema, type AnketaInput } from "@/lib/validators/anketa";
import { getUserAnketaCount } from "@/server/queries/anketas";
import { revalidatePath } from "next/cache";

const MAX_ANKETA_PER_USER = 3;

/** ------------------------
 *   UNIFIED FORM PARSER
 * ------------------------ */
function parseFormData(formData: FormData): AnketaInput {
  return {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    categoryId: formData.get("categoryId") as string,
    cityId: formData.get("cityId") as string,
    address: (formData.get("address") as string) || undefined,

    latitude: formData.get("latitude")
      ? Number(formData.get("latitude"))
      : undefined,

    longitude: formData.get("longitude")
      ? Number(formData.get("longitude"))
      : undefined,

    showLocation: formData.get("showLocation") === "true",
    isActive: formData.get("isActive") !== "false",
  };
}

/** ------------------------
 *   CREATE
 * ------------------------ */
export async function createAnketa(formData: FormData) {
  const session = await requireAuth();

  const parsed = parseFormData(formData);
  const validated = anketaSchema.parse(parsed);

  // Limit per user
  const count = await getUserAnketaCount(session.userId);
  if (count >= MAX_ANKETA_PER_USER) {
    return {
      error: `Maximum ${MAX_ANKETA_PER_USER} profiles allowed per user`,
    };
  }

  const anketa = await db.anketa.create({
    data: {
      ...validated,
      userId: session.userId,
    },
  });

  revalidatePath("/anketas");
  revalidatePath("/account/anketa");
  revalidatePath("/admin/anketas");

  return { success: true, anketa };
}

/** ------------------------
 *   UPDATE (strict validation)
 * ------------------------ */
export async function updateAnketa(id: string, formData: FormData) {
  const session = await requireAuth();

  const existing = await db.anketa.findUnique({ where: { id } });
  if (!existing) return { error: "Anketa not found" };

  // Only owner or admin
  if (existing.userId !== session.userId) {
    await requireAdmin();
  }

  const parsed = parseFormData(formData);

  // Validate merged state to avoid partial-validation bugs
  const validated = anketaSchema.parse({
    ...existing,
    ...parsed,
  });

  const anketa = await db.anketa.update({
    where: { id },
    data: validated,
  });

  revalidatePath("/anketas");
  revalidatePath("/account/anketa");
  revalidatePath(`/account/anketa/${id}/edit`);
  revalidatePath("/admin/anketas");

  return { success: true, anketa };
}

/** ------------------------
 *   DELETE
 * ------------------------ */
export async function deleteAnketa(id: string) {
  const session = await requireAuth();

  const existing = await db.anketa.findUnique({ where: { id } });
  if (!existing) return { error: "Anketa not found" };

  if (existing.userId !== session.userId) {
    await requireAdmin();
  }

  await db.anketa.delete({ where: { id } });

  revalidatePath("/anketas");
  revalidatePath("/account/anketa");
  revalidatePath("/admin/anketas");

  return { success: true };
}
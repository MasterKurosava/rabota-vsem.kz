"use server";

import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateAnketaStatusAction(
  id: string,
  formData: FormData
) {
  try {
    await requireAdmin();

    const isActive = formData.get("isActive");
    const active = isActive === "true";

    await db.anketa.update({
      where: { id },
      data: { isActive: active },
    });

    revalidatePath("/admin/anketas");
    return { success: true };
  } catch (error) {
    console.error("updateAnketaStatusAction error:", error);
    return { success: false, error: "Failed to update anketa" };
  }
}

export async function deleteAnketaAction(id: string) {
  try {
    await requireAdmin();

    await db.anketa.delete({
      where: { id },
    });

    revalidatePath("/admin/anketas");
    return { success: true };
  } catch (error) {
    console.error("deleteAnketaAction error:", error);
    return { success: false, error: "Failed to delete anketa" };
  }
}




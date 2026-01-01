"use server";

import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateUserVerificationAction(
  id: string,
  formData: FormData
) {
  try {
    await requireAdmin();

    const phoneVerified = formData.get("phoneVerified");
    const emailVerified = formData.get("emailVerified");

    const data: { phoneVerified?: boolean; emailVerified?: boolean } = {};

    if (phoneVerified !== null) {
      data.phoneVerified = phoneVerified === "true";
    }
    if (emailVerified !== null) {
      data.emailVerified = emailVerified === "true";
    }

    await db.user.update({
      where: { id },
      data,
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("updateUserVerificationAction error:", error);
    return { success: false, error: "Failed to update user" };
  }
}

export async function deleteUserAction(id: string) {
  try {
    await requireAdmin();

    await db.user.delete({
      where: { id },
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("deleteUserAction error:", error);
    return { success: false, error: "Failed to delete user" };
  }
}




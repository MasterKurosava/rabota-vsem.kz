"use server";

import { getSession } from "@/lib/auth";
import { updateUserPhone } from "@/server/services/user";

export async function updateProfile(formData: FormData) {
  const session = await getSession();
  if (!session) return { success: false, error: "UNAUTHORIZED" };

  const phoneValue = formData.get("phone");
  const phone = phoneValue && typeof phoneValue === "string" && phoneValue.trim() !== "" 
    ? phoneValue.trim() 
    : null;

  try {
    await updateUserPhone(session.userId, phone);
    return { success: true };
  } catch (error: any) {
    console.error("Error updating phone:", error);
    if (error.message === "PHONE_LOCKED") {
      return { success: false, error: "Номер подтвержден и не может быть изменен" };
    }
    return { success: false, error: "Ошибка при сохранении" };
  }
}

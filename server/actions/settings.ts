"use server";

import { revalidatePath } from "next/cache";
import { updateSettingsService } from "../services/settings";

export async function updateSettingsAction(formData: FormData) {
  try {
    const data = {
      phone: formData.get("phone") || null,
      whatsappNumber: formData.get("whatsappNumber") || null,
      address: formData.get("address") || null,
      mapEmbedUrl: formData.get("mapEmbedUrl") || null,
      officeLat: formData.get("officeLat") ? parseFloat(formData.get("officeLat") as string) : null,
      officeLng: formData.get("officeLng") ? parseFloat(formData.get("officeLng") as string) : null,
    };

    await updateSettingsService(data);
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (error) {
    console.error("updateSettingsAction error:", error);
    return { success: false, error: "Failed to update settings" };
  }
}


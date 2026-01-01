import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export interface AdminSettings {
  id: string;
  phone: string | null;
  whatsappNumber: string | null;
  address: string | null;
  mapEmbedUrl: string | null;
  officeLat: number | null;
  officeLng: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export async function getAdminSettings(): Promise<AdminSettings | null> {
  await requireAdmin();

  const settings = await db.siteSettings.findUnique({
    where: { id: 'singleton' },
  });

  if (!settings) {
    // Create default settings if they don't exist
    return db.siteSettings.create({
      data: {
        id: 'singleton',
      },
    });
  }

  return settings;
}




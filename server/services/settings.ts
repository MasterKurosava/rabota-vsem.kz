import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export const settingsSchema = z.object({
  phone: z.string().nullable(),
  whatsappNumber: z.string().nullable(),
  address: z.string().nullable(),
  officeLat: z.number().nullable(),
  officeLng: z.number().nullable(),
  mapEmbedUrl: z.string().nullable(),
});

export async function updateSettingsService(input: unknown) {
  await requireAdmin();
  const data = settingsSchema.parse(input);

  return db.siteSettings.upsert({
    where: { id: 'singleton' },
    update: data,
    create: {
      id: 'singleton',
      ...data,
    },
  });
}

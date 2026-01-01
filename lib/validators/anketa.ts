import { z } from "zod";

export function getAnketaSchema(t: (key: string) => string) {
  return z.object({
    title: z.string().min(1, t("validation.titleRequired")).max(200, t("validation.titleMaxLength")),
    description: z.string().min(10, t("validation.descriptionMinLength")),
    categoryId: z.string().min(1, t("validation.categoryRequired")),
    cityId: z.string().min(1, t("validation.cityRequired")),
    address: z.string().optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    showLocation: z.boolean().default(false),
    isActive: z.boolean().default(true),
  });
}

// Default schema for server-side validation (English)
export const anketaSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().min(10, "Description must be at least 10 characters"),
  categoryId: z.string().min(1, "Category is required"),
  cityId: z.string().min(1, "City is required"),
  address: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  showLocation: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export type AnketaInput = z.infer<typeof anketaSchema>;


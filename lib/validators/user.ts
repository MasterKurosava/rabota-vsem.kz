import { z } from "zod";

export const userProfileSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.union([
    z.string().email(),
    z.literal(""),
    z.null(),
    z.undefined(),
  ]).optional(),
  phone: z.union([
    z.string(),
    z.literal(""),
    z.null(),
    z.undefined(),
  ]).optional(),
  preferredCityId: z.string().optional(),
});

export type UserProfileInput = z.infer<typeof userProfileSchema>;



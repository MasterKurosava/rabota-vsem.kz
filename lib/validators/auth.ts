// lib/validators/auth.ts
import { z } from "zod";

export const loginSchema = z.object({
  identifier: z.string().min(1, "Введите email или телефон"),
  password: z.string().min(1, "Введите пароль"),
});

export type LoginInput = z.infer<typeof loginSchema>;

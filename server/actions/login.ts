// server/actions/auth/login.ts
"use server";

import { loginSchema } from "@/lib/validators/auth";
import { loginService } from "@/server/services/login";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function loginAction(formData: FormData) {
  const parsed = loginSchema.safeParse({
    identifier: formData.get("identifier"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }

  const result = await loginService(parsed.data);

  if (!result.success) {
    return result;
  }

  revalidatePath("/", "layout");
  redirect("/account/anketa");
}

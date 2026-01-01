// server/services/auth/login.ts
import { createSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { LoginInput } from "@/lib/validators/auth";
import * as bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function verifyPassword(raw: string, hash: string) {
    return bcrypt.compare(raw, hash);
  }

export async function loginService(input: LoginInput) {
  const { identifier, password } = input;

  const user = await db.user.findFirst({
    where: {
      OR: [
        { email: identifier },
        { phone: identifier },
      ],
    },
      select: {
        id: true,
        email: true,
        phone: true,
        role: true,
        password: true,
      },
  });

  if (!user || !user.password) {
    return { success: false, error: "auth.invalidLoginOrPassword" };
  }

  const ok = await verifyPassword(password, user.password);

  if (!ok) {
    return { success: false, error: "auth.invalidLoginOrPassword" };
  }

  await createSession(user.id);

  return {success: true}
}

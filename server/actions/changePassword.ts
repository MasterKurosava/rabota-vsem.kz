"use server";

import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function changePasswordAction(
  currentPassword: string,
  newPassword: string
) {
  const session = await requireAuth();

  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: { password: true },
  });

  if (!user?.password)
    return { error: "Пароль не задан. Войдите через email-вход и задайте пароль." };

  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) return { error: "Текущий пароль указан неверно" };

  // Не разрешаем тот же пароль
  const same = await bcrypt.compare(newPassword, user.password);
  if (same) return { error: "Новый пароль не должен совпадать со старым" };

  const hash = await bcrypt.hash(newPassword, 12);

  await db.user.update({
    where: { id: session.userId },
    data: { password: hash },
  });

  revalidatePath("/account/security");

  return { success: true };
}

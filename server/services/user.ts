import { db } from "@/lib/db";

export async function isEmailTaken(email: string): Promise<boolean> {
  const user = await db.user.findUnique({
    where: { email },
    select: { id: true },
  });
  return !!user;
}

export async function updateUserPhone(userId: string, phone: string | null) {
  // Проверяем текущий статус пользователя
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { phoneVerified: true, phone: true },
  });

  // Если телефон подтвержден и номер меняется - запрещаем изменение
  if (user?.phoneVerified && user.phone && phone && phone !== user.phone) {
    throw new Error("PHONE_LOCKED");
  }

  const phoneToSave = phone && phone.trim() !== "" ? phone.trim() : null;
  
  // При сохранении номера всегда сбрасываем подтверждение
  await db.user.update({
    where: { id: userId },
    data: {
      phone: phoneToSave,
      phoneVerified: false, // Всегда сбрасываем подтверждение при сохранении
    },
  });
}

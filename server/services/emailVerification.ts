// server/services/verification-code.service.ts

import { db } from "@/lib/db";
import { z } from "zod";
import { generateCode } from "@/lib/utils/email_code";
import { addMinutes } from "@/lib/utils/time";
import { sendEmailCode } from "./email";

const TTL_MINUTES = 10;

const RequestSchema = z.object({
  email: z.string().email(),
});

const VerifySchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
});

export async function requestVerificationCode(input: z.infer<typeof RequestSchema>) {
  const data = RequestSchema.parse(input);

  const code = generateCode();

  await db.verificationCode.deleteMany({
    where: { email: data.email },
  });

  await db.verificationCode.create({
    data: {
      email: data.email,
      code,
      expiresAt: addMinutes(new Date(), TTL_MINUTES),
    },
  });

  await sendEmailCode(data.email, code);

  return { success: true };
}

export async function verifyVerificationCode(input: z.infer<typeof VerifySchema>) {
  const data = VerifySchema.parse(input);
  const now = new Date();

  const rec = await db.verificationCode.findFirst({
    where: { email: data.email },
  });

  if (!rec) return { success: false, state: "NO_CODE", error: "Код не найден" };
  if (rec.expiresAt < now) return { success: false, state: "EXPIRED", error: "Код истёк" };
  if (rec.code !== data.code) return { success: false, state: "INVALID", error: "Неверный код" };

  await db.verificationCode.delete({ where: { id: rec.id } });

  await db.user.update({
    where: { email: data.email },
    data: { emailVerified: true },
  });

  return { success: true, state: "VERIFIED" };
}

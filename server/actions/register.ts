"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import {
  startRegistrationAttempt,
  resendRegistrationCode,
  verifyRegistrationAttempt,
  getRegistrationAttemptStatus,
} from "@/server/services/registrationAttempts";
import { createSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Role } from "@prisma/client";

//
// ─── SCHEMAS ────────────────────────────────────────────────────────────────
//

const StartFormSchema = z.object({
  email: z.string().email(),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  password: z.string().min(8),
  confirm_password: z.string().min(8),
});

const ResendSchema = z.object({
  email: z.string().email(),
});

const VerifyFormSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
});

//
// ─── STEP 3 — START REGISTRATION + SEND CODE ───────────────────────────────
//

export async function startRegistrationAction(formData: FormData) {
  const obj = Object.fromEntries(formData.entries());

  const parsed = StartFormSchema.safeParse({
    email: obj.email,
    first_name: obj.firstName,
    last_name: obj.lastName,
    password: obj.password,
    confirm_password: obj.confirmPassword,
  });

  if (!parsed.success) {
    return { success: false, error: "auth.invalidData" };
  }

  const { email, first_name, last_name, password, confirm_password } = parsed.data;

  if (password !== confirm_password) {
    return { success: false, error: "auth.passwordsNotMatch" };
  }

  const res = await startRegistrationAttempt({
    email,
    payload: { first_name, last_name, password },
  });

  // прокидываем состояние (BLOCKED / EMAIL_TAKEN / etc.)
  if (!res.success) {
    return {
      success: false,
      error: res.error ?? "auth.failedToSendCode",
      state: res.state,
      blockedUntil: res.blockedUntil,
    };
  }

  return { success: true };
}

//
// ─── RESEND CODE ───────────────────────────────────────────────────────────
//

export async function resendRegistrationCodeAction(formData: FormData) {
  const obj = Object.fromEntries(formData.entries());

  const parsed = ResendSchema.safeParse({
    email: obj.email,
  });

  if (!parsed.success) {
    return { success: false, error: "auth.invalidEmail" };
  }

  const res = await resendRegistrationCode({ email: parsed.data.email });

  if (!res.success) {
    return {
      success: false,
      error: res.error ?? "auth.failedToSendCode",
      state: res.state,
      blockedUntil: res.blockedUntil,
    };
  }

  return { success: true };
}

//
// ─── STEP 4 — VERIFY CODE → CREATE USER → AUTO LOGIN ───────────────────────
//

export async function completeRegistrationAction(formData: FormData) {
  const obj = Object.fromEntries(formData.entries());

  const parsed = VerifyFormSchema.safeParse({
    email: obj.email,
    code: obj.code,
  });

  if (!parsed.success) {
    return { success: false, error: "auth.invalidData" };
  }

  const { email, code } = parsed.data;

  const res = await verifyRegistrationAttempt({ email, code });

  if (!res.success || !res.payload) {
    return {
      success: false,
      error: res.error ?? "auth.invalidOrExpiredCode",
      state: res.state,
      blockedUntil: res.blockedUntil,
      attemptsLeft: res.attemptsLeft,
    };
  }

  const { first_name, last_name, password_hash } = res.payload;

  // безопасная транзакция — юзер создаётся только 1 раз
  const user = await db.$transaction(async tx => {
    const existing = await tx.user.findUnique({ where: { email } });
    if (existing) return existing;

    return tx.user.create({
      data: {
        name: `${first_name} ${last_name}`,
        email,
        password: password_hash,
        emailVerified: true,
        role: Role.USER,
      },
    });
  });

  // удаляем временную попытку
  await db.registrationAttempt.delete({ where: { email } });

  await createSession(user.id);

  revalidatePath("/", "layout");
  redirect("/account/anketa");
}


export async function checkRegistrationStatusAction(formData: FormData) {
    const email = formData.get("email") as string;
  
    const res = await getRegistrationAttemptStatus(email);
  
    return res;
  } 
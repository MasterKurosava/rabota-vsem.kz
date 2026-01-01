"use server";

import { db } from "@/lib/db";
import { z } from "zod";
import { hash, compare } from "bcryptjs";
import { generateCode } from "@/lib/utils/email_code";
import { addMinutes } from "@/lib/utils/time";
import { isEmailTaken } from "./user";
import { sendEmailCode } from "./email";

const EXP_MINUTES = 10;
const MAX_ATTEMPTS = 5;
const BLOCK_MINUTES = 15;

const StartSchema = z.object({
  email: z.string().email(),
  payload: z.object({
    first_name: z.string().min(1),
    last_name: z.string().min(1),
    password: z.string().min(8),
  }),
});

const ResendSchema = z.object({
  email: z.string().email(),
});

const VerifySchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
});

export type RegistrationState =
  | "CODE_SENT"
  | "CODE_RESENT"
  | "EMAIL_TAKEN"
  | "BLOCKED"
  | "NO_ATTEMPT"
  | "EXPIRED"
  | "INVALID"
  | "VERIFIED";

export interface RegistrationResult<T = unknown> {
  success: boolean;
  state: RegistrationState;
  error?: string;
  blockedUntil?: string;
  attemptsLeft?: number;
  payload?: T;
}

/**
 * Старт регистрации
 */
export async function startRegistrationAttempt(
  input: z.infer<typeof StartSchema>
): Promise<RegistrationResult> {
  const data = StartSchema.parse(input);
  const now = new Date();

  if (await isEmailTaken(data.email)) {
    return {
      success: false,
      state: "EMAIL_TAKEN",
      error: "Этот email уже зарегистрирован",
    };
  }

  const existing = await db.registrationAttempt.findUnique({
    where: { email: data.email },
  });

  if (existing?.blockedUntil && existing.blockedUntil > now) {
    return {
      success: false,
      state: "BLOCKED",
      error: "Слишком много неверных попыток",
      blockedUntil: existing.blockedUntil.toISOString(),
    };
  }

  await db.registrationAttempt.deleteMany({ where: { email: data.email } });

  const code = generateCode();
  const codeHash = await hash(code, 10);
  const password_hash = await hash(data.payload.password, 10);

  await db.registrationAttempt.create({
    data: {
      email: data.email,
      codeHash,
      expiresAt: addMinutes(now, EXP_MINUTES),
      attemptsLeft: MAX_ATTEMPTS,
      blockedUntil: null,
      payload: {
        first_name: data.payload.first_name,
        last_name: data.payload.last_name,
        password_hash,
      },
    },
  });

  await sendEmailCode(data.email, code);

  return { success: true, state: "CODE_SENT" };
}

/**
 * Resend кода (не сбрасывает попытки)
 */
export async function resendRegistrationCode(
  input: z.infer<typeof ResendSchema>
): Promise<RegistrationResult> {
  const data = ResendSchema.parse(input);
  const now = new Date();

  const attempt = await db.registrationAttempt.findUnique({
    where: { email: data.email },
  });

  if (!attempt)
    return { success: false, state: "NO_ATTEMPT", error: "Попытка регистрации не найдена" };

  if (attempt.blockedUntil && attempt.blockedUntil > now)
    return {
      success: false,
      state: "BLOCKED",
      error: "Слишком много неверных попыток",
      blockedUntil: attempt.blockedUntil.toISOString(),
    };

  const code = generateCode();
  const codeHash = await hash(code, 10);

  await db.registrationAttempt.update({
    where: { id: attempt.id },
    data: {
      codeHash,
      expiresAt: addMinutes(now, EXP_MINUTES),
    },
  });

  await sendEmailCode(data.email, code);

  return { success: true, state: "CODE_RESENT" };
}

/**
 * Проверка кода
 */
export async function verifyRegistrationAttempt(
  input: z.infer<typeof VerifySchema>
): Promise<
  RegistrationResult<{ first_name: string; last_name: string; password_hash: string }>
> {
  const data = VerifySchema.parse(input);
  const now = new Date();

  const rec = await db.registrationAttempt.findUnique({
    where: { email: data.email },
  });

  if (!rec)
    return { success: false, state: "NO_ATTEMPT", error: "Попытка регистрации не найдена" };

  if (rec.blockedUntil && rec.blockedUntil > now)
    return {
      success: false,
      state: "BLOCKED",
      error: "Слишком много неверных попыток. Попробуйте позже",
      blockedUntil: rec.blockedUntil.toISOString(),
    };

  if (rec.expiresAt < now)
    return { success: false, state: "EXPIRED", error: "Код истёк, запросите новый" };

  const ok = await compare(data.code, rec.codeHash);

  if (!ok) {
    const attempts = rec.attemptsLeft - 1;
    const shouldBlock = attempts <= 0;
    const blockedUntil = shouldBlock ? addMinutes(now, BLOCK_MINUTES) : null;

    await db.registrationAttempt.update({
      where: { id: rec.id },
      data: { attemptsLeft: attempts, blockedUntil },
    });

    return {
      success: false,
      state: shouldBlock ? "BLOCKED" : "INVALID",
      error: shouldBlock
        ? "Слишком много неверных попыток. Попробуйте позже"
        : "Неверный код",
      attemptsLeft: Math.max(attempts, 0),
      blockedUntil: blockedUntil?.toISOString(),
    };
  }

  const payload = rec.payload as {
    first_name: string;
    last_name: string;
    password_hash: string;
  };

  return {
    success: true,
    state: "VERIFIED",
    payload,
  };
}

export async function getRegistrationAttemptStatus(email: string) {
  const now = new Date();

  const rec = await db.registrationAttempt.findUnique({
    where: { email },
  });

  if (!rec) return { blocked: false };

  if (rec.blockedUntil && rec.blockedUntil > now) {
    return {
      blocked: true,
      blockedUntil: rec.blockedUntil.toISOString(),
      attemptsLeft: rec.attemptsLeft,
    };
  }

  return { blocked: false };
}
"use client";

import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/auth/FloatingInput";
import { Eye, EyeOff, Lock, Save, CheckCircle2 } from "lucide-react";

import { calculatePasswordStrength, getPasswordStrengthText } from "@/lib/utils/password";
import { cn } from "@/lib/utils";
import { usePasswordVisibility } from "@/hooks/usePasswordVisibility";

import { changePasswordAction } from "@/server/actions/changePassword";

const schema = z
  .object({
    currentPassword: z.string().min(1, "Введите текущий пароль"),
    newPassword: z
      .string()
      .min(8, "Минимум 8 символов")
      .regex(/[A-Za-z]/, "Хотя бы одна буква")
      .regex(/[0-9]/, "Хотя бы одна цифра"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

type Input = z.infer<typeof schema>;

export function SecurityForm() {
  const t = useTranslations("account");

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const v1 = usePasswordVisibility();
  const v2 = usePasswordVisibility();
  const v3 = usePasswordVisibility();

  const {
    watch,
    setValue,
    clearErrors,
    trigger,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Input>({
    resolver: zodResolver(schema),
  });

  const newPassword = watch("newPassword") || "";
  const strength = calculatePasswordStrength(newPassword);

  const onSubmit = async (data: Input) => {
    setLoading(true);
    setServerError(null);
    setSuccess(false);

    const res = await changePasswordAction(
      data.currentPassword,
      data.newPassword
    );

    if (res.error) {
      setServerError(res.error);
      setLoading(false);
      return;
    }

    setSuccess(true);
    reset();
    setLoading(false);

    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="rounded-xl border bg-surface p-6 shadow-sm max-w-md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        {/* CURRENT */}
        <FloatingInput
          id="currentPassword"
          type={v1.isVisible ? "text" : "password"}
          label={t("currentPassword")}
          placeholder={t("currentPassword")}
          value={watch("currentPassword") || ""}
          onChange={(e) => {
            setValue("currentPassword", e.target.value);
            clearErrors("currentPassword");
          }}
          onBlur={() => trigger("currentPassword")}
          icon={Lock}
          rightElement={
            <PasswordToggle visible={v1.isVisible} toggle={v1.toggle} />
          }
          error={errors.currentPassword?.message}
          required
        />

        {/* NEW */}
        <FloatingInput
          id="newPassword"
          type={v2.isVisible ? "text" : "password"}
          label={t("newPassword")}
          placeholder={t("newPassword")}
          value={newPassword}
          onChange={(e) => {
            setValue("newPassword", e.target.value);
            clearErrors("newPassword");
          }}
          onBlur={() => trigger("newPassword")}
          icon={Lock}
          rightElement={
            <PasswordToggle visible={v2.isVisible} toggle={v2.toggle} />
          }
          error={errors.newPassword?.message}
          required
        />

        {!!newPassword && (
          <PasswordStrengthHint strength={strength} t={t} />
        )}

        {/* CONFIRM */}
        <FloatingInput
          id="confirmPassword"
          type={v3.isVisible ? "text" : "password"}
          label={t("confirmNewPassword")}
          placeholder={t("confirmNewPassword")}
          value={watch("confirmPassword") || ""}
          onChange={(e) => {
            setValue("confirmPassword", e.target.value);
            clearErrors("confirmPassword");
          }}
          onBlur={() => trigger("confirmPassword")}
          icon={Lock}
          rightElement={
            <PasswordToggle visible={v3.isVisible} toggle={v3.toggle} />
          }
          error={errors.confirmPassword?.message}
          required
        />

        {serverError && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {serverError}
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 rounded-lg border border-green-300 bg-green-50 p-3 text-sm text-green-700">
            <CheckCircle2 className="h-4 w-4" />
            {t("passwordChanged")}
          </div>
        )}

        <Button disabled={loading} className="gap-2">
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              {t("saving")}
            </span>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {t("saveNewPassword")}
            </>
          )}
        </Button>
      </form>
    </div>
  );
}

/* --- small UI helpers --- */

function PasswordToggle({ visible, toggle }: any) {
  return (
    <button
      type="button"
      onClick={toggle}
      className="flex h-5 w-5 items-center justify-center text-foreground-muted hover:text-foreground transition"
    >
      {visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
    </button>
  );
}

function PasswordStrengthHint({ strength, t }: any) {
  return (
    <div className="space-y-1">
      <div className="flex gap-1">
        <Bar active />
        <Bar active={strength !== "weak"} />
        <Bar active={strength === "strong"} />
      </div>
      <p
        className={cn(
          "text-xs font-medium",
          strength === "weak" && "text-destructive",
          strength === "medium" && "text-yellow-600",
          strength === "strong" && "text-green-600"
        )}
      >
        {getPasswordStrengthText(strength, t)}
      </p>
      <p className="text-xs text-foreground-secondary">
        {t("passwordRequirements")}
      </p>
    </div>
  );
}

function Bar({ active }: { active?: boolean }) {
  return (
    <div
      className={cn(
        "h-1 flex-1 rounded-full bg-border",
        active && "bg-green-500"
      )}
    />
  );
}

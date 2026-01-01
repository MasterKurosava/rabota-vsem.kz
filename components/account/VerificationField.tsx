"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerificationFieldProps {
  value: string;
  label: string;
  placeholder?: string;
  type: "email" | "phone";
  verified: boolean;
  onSendCode: () => void;
  sending?: boolean;
  cooldown?: number;
  disabled?: boolean;
  error?: string | null;
  readOnly?: boolean;
}

export function VerificationField({
  value,
  label,
  placeholder,
  type,
  verified,
  onSendCode,
  sending = false,
  cooldown = 0,
  disabled = false,
  error,
  readOnly = false,
}: VerificationFieldProps) {
  const t = useTranslations("account");

  const typeLabel = type === "email" ? t("email") : t("phone");
  const notVerifiedText = verified 
    ? `${typeLabel} ${t("verified")}`
    : `${typeLabel} ${t("notVerified")}. ${t("clickToVerify")}`;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <Input
        type={type === "email" ? "email" : "tel"}
        value={value}
        readOnly={readOnly || (type === "email" && verified)}
        disabled={disabled}
        placeholder={placeholder}
        className={cn(
          "h-11",
          error && "border-destructive"
        )}
      />
      {!verified && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onSendCode}
          disabled={sending || cooldown > 0 || disabled}
          className={cn(
            "w-full",
            "border-0 bg-transparent text-warning hover:bg-transparent hover:text-warning/80",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {sending ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              <span className="ml-2">{t("sending")}</span>
            </>
          ) : cooldown > 0 ? (
            <span className="text-xs">{t("resendCodeIn", { seconds: cooldown })}</span>
          ) : (
            <span>{notVerifiedText}</span>
          )}
        </Button>
      )}
      {error && (
        <p className="text-sm text-destructive flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          {error}
        </p>
      )}
    </div>
  );
}


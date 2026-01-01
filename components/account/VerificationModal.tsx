"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { VerificationCodeInput } from "@/components/auth/VerificationCodeInput";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface VerificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "email" | "phone";
  identifier: string;
  code: string;
  onCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCodePaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  onVerify: () => void;
  onResend?: () => void;
  verifying?: boolean;
  error?: string | null;
  cooldown?: number;
  codeInputRef?: React.RefObject<HTMLInputElement>;
}

export function VerificationModal({
  open,
  onOpenChange,
  type,
  identifier,
  code,
  onCodeChange,
  onCodePaste,
  onVerify,
  onResend,
  verifying = false,
  error,
  cooldown = 0,
  codeInputRef,
}: VerificationModalProps) {
  const t = useTranslations("account");
  const typeLabel = type === "email" ? t("email") : t("phone");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {t("emailVerification")} {typeLabel}
          </DialogTitle>
          <DialogDescription>
            {t("codeSentTo")} {identifier}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t("verificationCode")}
            </label>
            <VerificationCodeInput
              ref={codeInputRef}
              value={code}
              onChange={onCodeChange}
              onPaste={onCodePaste}
              error={error}
              disabled={verifying}
              autoFocus
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              onClick={onVerify}
              disabled={verifying || code.length !== 6}
              className="flex-1 gap-2"
            >
              {verifying ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  {t("verifying")}
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  {t("verify")}
                </>
              )}
            </Button>
            {cooldown > 0 ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={true}
                className="shrink-0"
              >
                {t("resendCodeIn", { seconds: cooldown })}
              </Button>
            ) : onResend ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onResend}
                disabled={verifying}
                className="shrink-0"
              >
                {t("resendCode")}
              </Button>
            ) : null}
          </div>

          {error && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive flex items-center gap-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}


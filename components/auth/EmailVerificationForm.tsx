"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { VerificationCodeInput } from "@/components/auth/VerificationCodeInput";
import { Mail, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import { normalizeVerificationCode, extractCodeFromPaste } from "@/lib/utils/verification";
import Link from "next/link";

interface EmailVerificationFormProps {
  email: string;
}

export function EmailVerificationForm({ email }: EmailVerificationFormProps) {
  const t = useTranslations("auth");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = normalizeVerificationCode(e.target.value);
    setCode(value);
    setError(null);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const value = extractCodeFromPaste(e);
    setCode(value);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // No backend logic - UI only
    if (code.length !== 6) {
      setError(t("codeInvalid"));
      return;
    }
    setLoading(true);
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleResend = async () => {
    // No backend logic - UI only
    setSending(true);
    setTimeout(() => {
      setSending(false);
    }, 1000);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Mail className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">{t("verifyEmail")}</h2>
        <p className="text-foreground-muted">
          {t("codeSentTo")} <span className="font-medium text-foreground">{email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">
            {t("verificationCode")}
          </label>
          <VerificationCodeInput
            ref={inputRef}
            value={code}
            onChange={handleCodeChange}
            onPaste={handlePaste}
            error={error}
            disabled={loading}
            autoFocus
          />
        </div>

        {error && (
          <div className="rounded-xl border-2 border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive flex items-start gap-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <Button
          type="submit"
          className="w-full h-14 gap-2 rounded-xl font-semibold shadow-lg"
          size="lg"
          disabled={loading || code.length !== 6}
        >
          {loading ? (
            <>
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
              {t("verifying")}
            </>
          ) : (
            <>
              {t("verify")}
              <CheckCircle2 className="h-5 w-5" />
            </>
          )}
        </Button>

        <div className="text-center space-y-2">
          <p className="text-sm text-foreground-muted">{t("didntReceiveCode")}</p>
          <Button
            type="button"
            variant="ghost"
            onClick={handleResend}
            disabled={sending}
            className="text-sm"
          >
            {sending ? t("sending") : t("resendCode")}
          </Button>
        </div>
      </form>

      <div className="text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-foreground-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("backToLogin")}
        </Link>
      </div>
    </div>
  );
}

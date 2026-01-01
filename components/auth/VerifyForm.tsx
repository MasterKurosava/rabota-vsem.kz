"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { VerificationCodeInput } from "@/components/auth/VerificationCodeInput";
import { normalizeVerificationCode, extractCodeFromPaste } from "@/lib/utils/verification";

export function VerifyForm() {
  const t = useTranslations("auth");
  const searchParams = useSearchParams();
  const identifier = searchParams.get("identifier") || "";
  const method = (searchParams.get("method") || "email") as "email" | "phone";
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <Card className="border-border shadow-md">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="code" className="text-sm font-medium">
              {t("code")}
            </Label>
            <VerificationCodeInput
              value={code}
              onChange={handleCodeChange}
              onPaste={handlePaste}
              error={error}
              disabled={loading}
              autoFocus
            />
            <p className="text-xs text-foreground-secondary">
              {t("codeSentTo")} <span className="font-medium">{identifier}</span>
            </p>
          </div>

          <Button
            type="submit"
            className="w-full gap-2 shadow-sm transition-all hover:shadow-md"
            size="lg"
            disabled={loading || code.length !== 6}
          >
            {loading ? t("verifying") : t("verify")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

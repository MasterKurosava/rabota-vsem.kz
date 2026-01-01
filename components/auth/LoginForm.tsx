"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/auth/FloatingInput";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePasswordVisibility } from "@/hooks/usePasswordVisibility";
import { useState } from "react";
import { loginAction } from "@/server/actions/login";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const t = useTranslations("auth");
  const [identifier, setIdentifier] = useState("");
  const [password, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const passwordVisibility = usePasswordVisibility();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("identifier", identifier);
      fd.append("password", password);

      const res = await loginAction(fd);

      if (res && !res.success) {
        const errorKey = res.error?.startsWith("auth.") ? res.error.replace("auth.", "") : res.error;
        setError(errorKey ? t(errorKey as any) : t("loginError"));
        return;
      }
      // If res is undefined, redirect happened (success)
    } catch (error) {
      // Redirect throws an error in Next.js, this is expected
      if (error && typeof error === 'object' && 'digest' in error) {
        throw error;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <div
        className={cn(
          "relative rounded-2xl border border-border/50 bg-background/80 backdrop-blur-xl shadow-2xl",
          "p-8 md:p-10"
        )}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
        <FloatingInput
            id="identifier"
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            label={t("emailOrPhone")}
            placeholder={t("identifierPlaceholder")}
            icon={Mail}
            required
            autoComplete="username"
          />

          <FloatingInput
            id="password"
            type={passwordVisibility.isVisible ? "text" : "password"}
            value={password}
            onChange={(e) => setPass(e.target.value)}
            label={t("password")}
            placeholder={t("passwordPlaceholder")}
            icon={Lock}
            rightElement={
              <button
                type="button"
                onClick={passwordVisibility.toggle}
                className="h-5 w-5 text-foreground-muted hover:text-foreground transition-colors flex items-center justify-center"
                aria-label={passwordVisibility.isVisible ? t("hide") : t("show")}
              >
                {passwordVisibility.isVisible ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            }
            required
            autoComplete="current-password"
          />

          {error && (
            <div className="rounded-xl border-2 border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive font-medium">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-14 gap-2 rounded-xl font-semibold text-base shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.02] disabled:opacity-50"
            size="lg"
          >
            {loading ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                {t("loggingIn")}
              </>
            ) : (
              <>
                {t("login")}
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-foreground-secondary">
            {t("noAccount")}{" "}
            <Link
              href="/register"
              className="font-semibold text-primary hover:text-primary/80 transition-colors underline underline-offset-4"
            >
              {t("register")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

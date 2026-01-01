// components/auth/RegisterForm.tsx

"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/auth/FloatingInput";
import { VerificationCodeInput } from "@/components/auth/VerificationCodeInput";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ChevronRight,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { calculatePasswordStrength, getPasswordStrengthText } from "@/lib/utils/password";
import { usePasswordVisibility } from "@/hooks/usePasswordVisibility";
import {
  startRegistrationAction,
  resendRegistrationCodeAction,
  completeRegistrationAction,
} from "@/server/actions/register";
import { checkRegistrationStatusAction } from "@/server/actions/register";
import { useEffect } from "react";


const STEP_ORDER = ["EMAIL_INPUT", "NAME_INPUT", "PASSWORD_INPUT", "CODE_VERIFICATION"] as const;

function formatRemaining(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function getStepNumber(step: string): number {
  const index = STEP_ORDER.indexOf(step as any);
  return index >= 0 ? index + 1 : 1;
}

export function RegisterForm() {
  const t = useTranslations("auth");

  const [currentStep, setCurrentStep] = useState<(typeof STEP_ORDER)[number]>("EMAIL_INPUT");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [blockedUntil, setBlockedUntil] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState<string | null>(null);

  const passwordVisibility = usePasswordVisibility();
  const confirmPasswordVisibility = usePasswordVisibility();

  const stepNumber = getStepNumber(currentStep);
  const totalSteps = STEP_ORDER.length;
  const progress = (stepNumber / totalSteps) * 100;

  const passwordStrength = calculatePasswordStrength(password);

  const handleNextEmail = async () => {
    setError(null);

    if (!email || !email.includes("@")) {
      setError(t("enterValidEmail"));
      return;
    }

    const fd = new FormData();
    fd.append("email", email);

    const status = await checkRegistrationStatusAction(fd);
    if (status.blocked && status.blockedUntil) {
      setBlockedUntil(new Date(status.blockedUntil));
      return;
    }

    setCurrentStep("NAME_INPUT");
  };

  const handleNextName = () => {
    setError(null);
    if (!firstName.trim() || !lastName.trim()) {
      setError(t("enterNameAndLastname"));
      return;
    }
    setCurrentStep("PASSWORD_INPUT");
  };

  const handleNextPassword = async () => {
    setError(null);
    if (password.length < 8) {
      setError(t("passwordMin8"));
      return;
    }
    if (password !== confirmPassword) {
      setError(t("passwordsNotMatch"));
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("password", password);
      formData.append("confirmPassword", confirmPassword);

      const res = await startRegistrationAction(formData);

      if (!res?.success) {
        const errorKey = res?.error?.startsWith("auth.") ? res.error.replace("auth.", "") : res?.error;
        setError(errorKey ? t(errorKey as any) : t("failedToSendCode"));
        return;
      }

      setCurrentStep("CODE_VERIFICATION");
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    setError(null);
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(STEP_ORDER[currentIndex - 1]);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value.replace(/\D/g, "").slice(0, 6));
  };

  const handleCodePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    setCode(pasted);
  };

  const handleResend = async () => {
    setError(null);
    setResendLoading(true);
    try {
      const fd = new FormData();
      fd.append("email", email);
      const res = await resendRegistrationCodeAction(fd);
      if (!res?.success) {
        const errorKey = res?.error?.startsWith("auth.") ? res.error.replace("auth.", "") : res?.error;
        setError(errorKey ? t(errorKey as any) : t("failedToSendCode"));
      }
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (currentStep !== "CODE_VERIFICATION") return;

    if (code.length !== 6) {
      setError(t("enterCode6Digits"));
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("email", email);
      fd.append("code", code);

      const res = await completeRegistrationAction(fd);

      if (res && !res?.success) {
        const errorKey = res?.error?.startsWith("auth.") ? res.error.replace("auth.", "") : res?.error;
        setError(errorKey ? t(errorKey as any) : t("failedToCompleteRegistration"));
      }
    } catch (error) {
      if (error && typeof error === 'object' && 'digest' in error) {
        throw error;
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!blockedUntil) {
      return;
    }
  
    const unblockTs = new Date(blockedUntil).getTime();
  
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = unblockTs - now;
  
      if (diff <= 0) {
        setBlockedUntil(null);
        setCountdown(null);
        clearInterval(interval);
        return;
      }
  
      const value = formatRemaining(diff);
      setCountdown(value);
    }, 1000);
  
    return () => clearInterval(interval);
  }, [blockedUntil]);

  useEffect(() => {
    console.log("COUNTDOWN UPDATED:", countdown);
  }, [countdown]);

  return (
    <div className="relative">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground-muted">
            {t("step")} {stepNumber} {t("of")} {totalSteps}
          </span>
          <span className="text-sm font-medium text-foreground-muted">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-2 w-full bg-surface-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div
        className={cn(
          "relative rounded-2xl border border-border/50 bg-background/80 backdrop-blur-xl shadow-2xl",
          "p-8 md:p-10"
        )}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Email */}
          {currentStep === "EMAIL_INPUT" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <FloatingInput
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                label={t("email")}
                placeholder="user@example.com"
                icon={Mail}
                required
                autoComplete="email"
              />

              {error && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              {blockedUntil && (
                <div className="rounded-xl border border-red-400/40 bg-red-400/10 p-3 text-sm text-red-500">
                  {t("toManyAttemps")}<br />
                  {t("tryAgainIn")} <b>{countdown}</b>
                </div>
              )}

              <Button
                type="button"
                onClick={handleNextEmail}
                className="w-full h-14 gap-2 rounded-xl font-semibold text-base shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.02]"
                size="lg"
              >
                {t("continue")}
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          )}

          {/* Step 2: Name */}
          {currentStep === "NAME_INPUT" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <FloatingInput
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                label={t("firstName")}
                placeholder={t("firstNamePlaceholder")}
                icon={User}
                required
                autoComplete="given-name"
              />

              <FloatingInput
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                label={t("lastName")}
                placeholder={t("lastNamePlaceholder")}
                icon={User}
                required
                autoComplete="family-name"
              />

              {error && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  className="flex-1 h-14 rounded-xl"
                >
                  {t("back")}
                </Button>
                <Button
                  type="button"
                  onClick={handleNextName}
                  className="flex-1 h-14 gap-2 rounded-xl font-semibold shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.02]"
                  size="lg"
                >
                  {t("continue")}
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Password */}
          {currentStep === "PASSWORD_INPUT" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <FloatingInput
                  id="password"
                  type={passwordVisibility.isVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                  autoComplete="new-password"
                />

                {password.length > 0 && (
                  <div className="mt-3 animate-in fade-in slide-in-from-top-1">
                    <p
                      className={cn(
                        "text-xs font-medium",
                        passwordStrength === "weak" && "text-destructive",
                        passwordStrength === "medium" && "text-yellow-500",
                        passwordStrength === "strong" && "text-green-500"
                      )}
                    >
                      {getPasswordStrengthText(passwordStrength, t)}
                    </p>
                  </div>
                )}
              </div>

              <FloatingInput
                id="confirmPassword"
                type={confirmPasswordVisibility.isVisible ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                label={t("confirmPassword")}
                placeholder={t("confirmPasswordPlaceholder")}
                icon={Lock}
                rightElement={
                  <button
                    type="button"
                    onClick={confirmPasswordVisibility.toggle}
                    className="h-5 w-5 text-foreground-muted hover:text-foreground transition-colors flex items-center justify-center"
                    aria-label={
                      confirmPasswordVisibility.isVisible ? t("hide") : t("show")
                    }
                  >
                    {confirmPasswordVisibility.isVisible ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                }
                required
                autoComplete="new-password"
              />

              {error && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  className="flex-1 h-14 rounded-xl"
                >
                  {t("back")}
                </Button>
                <Button
                  type="button"
                  onClick={handleNextPassword}
                  disabled={loading}
                  className="flex-1 h-14 gap-2 rounded-xl font-semibold shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.02] disabled:opacity-50"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      {t("sending")}
                    </>
                  ) : (
                    <>
                      {t("continue")}
                      <ChevronRight className="h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Verification Code */}
          {currentStep === "CODE_VERIFICATION" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">
                  {t("verificationCode")}
                </label>
                <VerificationCodeInput
                  value={code}
                  onChange={handleCodeChange}
                  onPaste={handleCodePaste}
                  disabled={loading}
                  autoFocus
                />
                <p className="text-xs text-foreground-muted">
                  {t("codeSentTo")} <span className="font-medium">{email}</span>
                </p>
              </div>

              {error && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  className="flex-1 h-14 rounded-xl"
                >
                  {t("back")}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResend}
                  disabled={resendLoading || !!blockedUntil}
                  className="flex-1 h-14 gap-2 rounded-xl"
                >
                  {resendLoading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border border-current border-t-transparent" />
                      {t("resending") ?? "Отправка..."}
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      {t("resendCode") ?? "Отправить код ещё раз"}
                    </>
                  )}
                </Button>
              </div>

              <Button
                type="submit"
                className="w-full h-14 gap-2 rounded-xl font-semibold shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.02] disabled:opacity-50"
                size="lg"
                disabled={loading || !!blockedUntil}
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
            </div>
          )}
        </form>

        {/* Link to login */}
        <div className="mt-6 text-center">
          <p className="text-sm text-foreground-secondary">
            {t("hasAccount")}{" "}
            <Link
              href="/login"
              className="font-semibold text-primary hover:text-primary/80 transition-colors underline underline-offset-4"
            >
              {t("login")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

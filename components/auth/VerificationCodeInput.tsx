"use client";

import { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface VerificationCodeInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  error?: string | null;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

export const VerificationCodeInput = forwardRef<
  HTMLInputElement,
  VerificationCodeInputProps
>(
  (
    {
      value,
      onChange,
      onPaste,
      error,
      disabled = false,
      placeholder = "000000",
      className,
      autoFocus = false,
    },
    ref
  ) => {
    const safeValue = value ?? "";
    const isValid = safeValue.length === 6;

    return (
      <div className="space-y-2">
        <div className="relative">
          <Input
            ref={ref}
            type="text"
            inputMode="numeric"
            value={value}
            onChange={onChange}
            onPaste={onPaste}
            maxLength={6}
            disabled={disabled}
            autoFocus={autoFocus}
            placeholder={placeholder}
            className={cn(
              "text-center text-2xl tracking-[0.3em] font-semibold h-14",
              error && "border-destructive",
              className
            )}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {isValid ? (
              <CheckCircle2 className="h-5 w-5 text-success" />
            ) : (
              <AlertCircle className="h-5 w-5 text-foreground-muted" />
            )}
          </div>
        </div>
        {error && (
          <p className="text-sm text-destructive flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {error}
          </p>
        )}
      </div>
    );
  }
);

VerificationCodeInput.displayName = "VerificationCodeInput";


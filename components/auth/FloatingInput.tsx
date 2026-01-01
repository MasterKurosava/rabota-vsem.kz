"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface FloatingInputProps {
  id: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  label: string;
  placeholder?: string;
  icon?: LucideIcon;
  rightElement?: ReactNode;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  autoComplete?: string;
}

export function FloatingInput({
  id,
  type = "text",
  value,
  onChange,
  onBlur,
  label,
  placeholder,
  icon: Icon,
  rightElement,
  error,
  required,
  disabled,
  className,
  autoComplete,
}: FloatingInputProps) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasValue = value.length > 0;
  const isFloating = focused || hasValue;

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground-muted/60 pointer-events-none transition-colors z-10" />
        )}
        <Input
          ref={inputRef}
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          required={required}
          disabled={disabled}
          readOnly={disabled}
          autoComplete={autoComplete}
          className={cn(
            "h-14 pl-11 rounded-xl border-2 text-base transition-all duration-200",
            "bg-background/50 backdrop-blur-sm pt-4",
            rightElement ? "pr-12" : "pr-4",
            "focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-background",
            error
              ? "border-destructive focus:border-destructive focus:ring-destructive/20"
              : "border-border/50",
            disabled && "opacity-60 cursor-not-allowed",
            className
          )}
          placeholder={isFloating ? placeholder : ""}
        />
        {rightElement && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20">
            {rightElement}
          </div>
        )}
        <label
          htmlFor={id}
          className={cn(
            "absolute left-11 transition-all duration-200 pointer-events-none",
            isFloating
              ? "top-3 text-xs font-medium text-foreground-muted"
              : "top-1/2 -translate-y-1/2 text-base text-foreground-muted",
            error && "text-destructive"
          )}
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-destructive animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
}


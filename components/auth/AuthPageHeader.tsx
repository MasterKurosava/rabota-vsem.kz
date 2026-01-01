"use client";

import { useTranslations } from "next-intl";
import { Shield } from "lucide-react";

interface AuthPageHeaderProps {
  titleKey: string;
  descriptionKey: string;
}

export function AuthPageHeader({ titleKey, descriptionKey }: AuthPageHeaderProps) {
  const t = useTranslations("auth");

  return (
    <div 
      className="text-center space-y-4 animate-in fade-in slide-in-from-top-4 duration-500"
      suppressHydrationWarning
    >
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 ring-4 ring-primary/20 shadow-lg">
        <Shield className="h-10 w-10 text-primary" />
      </div>
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">{t(titleKey)}</h1>
        <p className="text-lg text-foreground-secondary leading-relaxed">
          {t(descriptionKey)}
        </p>
      </div>
    </div>
  );
}


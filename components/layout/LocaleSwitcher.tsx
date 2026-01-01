"use client";

import * as React from "react";
import { useLocaleContext } from "@/contexts/LocaleContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { locales } from "@/i18n";
import type { Locale } from "@/i18n";

const localeLabels: Record<string, string> = {
  ru: "Рус",
  en: "Eng",
  kk: "Қаз",
};

export function LocaleSwitcher() {
  const { locale, setLocale } = useLocaleContext();

  return (
    <div className="flex gap-1 rounded-lg border border-border bg-surface p-1">
      {locales.map((loc) => {
        const isActive = locale === loc;
        return (
        <Button
          key={loc}
            variant={isActive ? "default" : "ghost"}
          size="sm"
          onClick={() => setLocale(loc as Locale)}
            className={cn(
              "h-7 px-2.5 text-xs font-medium transition-all",
              isActive && "hover:!bg-primary/90 hover:!text-white"
            )}
        >
          {localeLabels[loc]}
        </Button>
        );
      })}
    </div>
  );
}

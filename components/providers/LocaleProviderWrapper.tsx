"use client";

import { NextIntlClientProvider } from "next-intl";
import { useLocaleContext } from "@/contexts/LocaleContext";
import type { Locale } from "@/i18n";

interface LocaleProviderWrapperProps {
  messagesMap: Record<Locale, any>;
  children: React.ReactNode;
}

export function LocaleProviderWrapper({ messagesMap, children }: LocaleProviderWrapperProps) {
  const { locale } = useLocaleContext();
  
  return (
    <NextIntlClientProvider 
      key={locale} 
      locale={locale} 
      messages={messagesMap[locale]}
    >
      {children}
    </NextIntlClientProvider>
  );
}


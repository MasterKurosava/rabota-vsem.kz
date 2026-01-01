"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useLocale as useNextIntlLocale } from "next-intl";
import { locales, defaultLocale, type Locale } from "@/i18n";
import { setCookie } from "@/lib/utils/cookies";

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ 
  children,
  initialLocale 
}: { 
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  // Always use initialLocale for SSR to match server and client
  // Then sync with localStorage after mount
  const [locale, setLocaleState] = useState<Locale>(() => {
    // Always use initialLocale on first render (server and client)
    // This ensures SSR and client hydration match
    return initialLocale || defaultLocale;
  });
  const [isMounted, setIsMounted] = useState(false);

  // Load from localStorage and sync with cookie on mount (client-side only)
  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("locale") as Locale | null;
      if (saved && locales.includes(saved) && saved !== locale) {
        setLocaleState(saved);
        // Also set cookie for next request
        setCookie("NEXT_LOCALE", saved, 365);
      } else {
        // Save current locale to localStorage and cookie
        localStorage.setItem("locale", locale);
        setCookie("NEXT_LOCALE", locale, 365);
      }
    }
  }, []); // Only run on mount

  // Save to localStorage and cookie when locale changes (but only after mount)
  useEffect(() => {
    if (isMounted && typeof window !== "undefined") {
      localStorage.setItem("locale", locale);
      setCookie("NEXT_LOCALE", locale, 365);
    }
  }, [locale, isMounted]);

  const setLocale = useCallback((newLocale: Locale) => {
    if (newLocale === locale) return;
    setLocaleState(newLocale);
    // Save to cookie for server-side detection (next-intl uses NEXT_LOCALE cookie)
    if (typeof window !== "undefined") {
      setCookie("NEXT_LOCALE", newLocale, 365);
    }
  }, [locale]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocaleContext() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error("useLocaleContext must be used within a LocaleProvider");
  }
  return context;
}


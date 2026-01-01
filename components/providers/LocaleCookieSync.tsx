"use client";

import { useEffect } from "react";
import { getCookie } from "@/lib/utils/cookies";
import { locales, defaultLocale, type Locale } from "@/i18n";

/**
 * Syncs localStorage locale with cookie before first render
 * This ensures middleware can read the correct locale on server
 */
export function LocaleCookieSync() {
  useEffect(() => {
    // Check if cookie exists, if not - sync from localStorage
    const cookieLocale = getCookie("NEXT_LOCALE") as Locale | null;
    const savedLocale = localStorage.getItem("locale") as Locale | null;
    
    if (savedLocale && locales.includes(savedLocale)) {
      // If localStorage has a saved locale but cookie doesn't match, update cookie
      if (!cookieLocale || cookieLocale !== savedLocale) {
        document.cookie = `NEXT_LOCALE=${savedLocale}; path=/; max-age=31536000; SameSite=Lax`;
      }
    }
  }, []);

  return null;
}









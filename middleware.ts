import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./i18n";
import { NextRequest } from "next/server";

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "never", // Don't show locale in URL
  localeDetection: true, // Enable locale detection from cookies/headers
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};



import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ReduxProvider } from "@/components/providers/ReduxProvider";
import { ReactQueryProvider } from "@/components/providers/ReactQueryProvider";
import { SettingsInitializer } from "@/components/providers/SettingsInitializer";
import { LocaleProvider } from "@/contexts/LocaleContext";
import { LocaleProviderWrapper } from "@/components/providers/LocaleProviderWrapper";
import { LocaleCookieSync } from "@/components/providers/LocaleCookieSync";
import { ConditionalHeader } from "@/components/layout/ConditionalHeader";
import { ConditionalFooter } from "@/components/layout/ConditionalFooter";
import { DynamicBackground } from "@/components/layout/DynamicBackground";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { getSiteSettings } from "@/server/queries/settings";
import { locales } from "@/i18n";
import type { Locale } from "@/i18n";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Load all messages for all locales
  const allMessages = await Promise.all(
    locales.map(async (loc) => ({
      locale: loc,
      messages: (await import(`@/messages/${loc}.json`)).default,
    }))
  );

  const messagesMap = Object.fromEntries(
    allMessages.map(({ locale, messages }) => [locale, messages])
  ) as Record<Locale, any>;

  const settings = await getSiteSettings();

  return (
    <ReactQueryProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <ReduxProvider>
          <LocaleProvider initialLocale={locale as Locale}>
            <LocaleCookieSync />
            <LocaleProviderWrapper messagesMap={messagesMap}>
              <SettingsInitializer settings={settings} />
              <DynamicBackground />
              <div className="relative flex min-h-screen flex-col">
                <ConditionalHeader />
                <main className="flex-1">{children}</main>
                <ConditionalFooter settings={settings} />
                <ScrollToTop />
              </div>
            </LocaleProviderWrapper>
          </LocaleProvider>
        </ReduxProvider>
      </ThemeProvider>
    </ReactQueryProvider>
  );
}

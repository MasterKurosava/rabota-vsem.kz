import { getTranslations } from "next-intl/server";
import { getLocalizedMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal.privacy" });

  return getLocalizedMetadata(locale, t("title"), "", "/privacy");
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal.privacy" });

  return (
    <div className="container py-12 md:py-20">
      <div className="mx-auto max-w-4xl">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="mb-3 text-4xl font-bold tracking-tight md:text-5xl">
            {t("title")}
          </h1>
          {t("lastUpdated") && (
            <p className="text-sm text-foreground-secondary">
              {t("lastUpdated")}: {t("lastUpdatedDate")}
            </p>
          )}
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {t.raw("sections") && Array.isArray(t.raw("sections")) && (
            <>
              {t.raw("sections").map((section: any, index: number) => (
                <section key={index} className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">
                    {section.title}
                  </h2>
                  {section.content && (
                    <div className="space-y-3 text-base leading-relaxed text-foreground-secondary">
                      {Array.isArray(section.content) ? (
                        section.content.map((paragraph: string, pIndex: number) => (
                          <p key={pIndex}>{paragraph}</p>
                        ))
                      ) : (
                        <p>{section.content}</p>
                      )}
                    </div>
                  )}
                  {section.items && Array.isArray(section.items) && (
                    <ul className="ml-6 space-y-2 text-base leading-relaxed text-foreground-secondary">
                      {section.items.map((item: string, itemIndex: number) => (
                        <li key={itemIndex} className="list-disc">
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                  {index < t.raw("sections").length - 1 && (
                    <div className="border-t border-border/50 pt-8" />
                  )}
                </section>
              ))}
            </>
          )}

          {/* Fallback for simple content */}
          {!t.raw("sections") && t("content") && (
            <div className="space-y-4 text-base leading-relaxed text-foreground-secondary">
              <p className="whitespace-pre-wrap">{t("content")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

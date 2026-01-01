import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { getSiteSettings } from "@/server/queries/settings";
import { getCategoriesWithCounts } from "@/server/queries/categories";
import { Hero } from "@/components/blocks/Hero";
import { HeroSkeleton } from "@/components/blocks/HeroSkeleton";
import { Categories } from "@/components/blocks/Categories";
import { CategoriesSkeleton } from "@/components/blocks/CategoriesSkeleton";
import { WhyJoin } from "@/components/blocks/WhyJoin";
import { TrustSafety } from "@/components/blocks/TrustSafety";
import { FAQ } from "@/components/blocks/FAQ";
import { WhyOfficial } from "@/components/blocks/WhyOfficial";
import { CTASection } from "@/components/blocks/CTASection";
import { MobileCTA } from "@/components/blocks/MobileCTA";
import { getLocalizedMetadata } from "@/lib/seo";
import { parseHomepageTexts, parseFAQItems } from "@/lib/utils/settings";
import type { Locale } from "@/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });

  return getLocalizedMetadata(
    locale,
    t("title"),
    t("subtitle"),
    ""
  );
}

async function HomeContent({ locale }: { locale: Locale }) {
  const settings = await getSiteSettings();
  const homepageTexts = parseHomepageTexts(settings?.homepageTexts || null, locale);
  const faqItems = parseFAQItems(settings?.faq || null, locale);
  const categoriesWithCounts = await getCategoriesWithCounts();

  return (
    <>
      <Hero
        whatsappNumber={settings?.whatsappNumber}
        homepageTexts={homepageTexts}
      />
      <Categories categories={categoriesWithCounts} />
      <WhyJoin />
      <TrustSafety />
      <FAQ items={faqItems} whatsappNumber={settings?.whatsappNumber} />
      <WhyOfficial />
      <CTASection whatsappNumber={settings?.whatsappNumber} />
      <MobileCTA whatsappNumber={settings?.whatsappNumber} />
    </>
  );
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  return (
    <Suspense
      fallback={
        <>
          <HeroSkeleton />
          <CategoriesSkeleton />
        </>
      }
    >
      <HomeContent locale={locale} />
    </Suspense>
  );
}

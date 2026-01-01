import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { getAnketas, getAnketasCount } from "@/server/queries/anketas";
import { getSiteSettings } from "@/server/queries/settings";
import { getCities } from "@/server/queries/cities";
import { getCategories } from "@/server/queries/categories";
import { AnketaFilters } from "@/components/anketa/AnketaFilters";
import { AnketaFiltersSkeleton } from "@/components/anketa/AnketaFiltersSkeleton";
import { AnketaCardSkeleton } from "@/components/anketa/AnketaCardSkeleton";
import { AnketasContentClient } from "./AnketasContentClient";
import { AnketaFiltersProvider } from "@/contexts/AnketaFiltersContext";
import { Button } from "@/components/ui/button";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { MessageCircle, Search } from "lucide-react";
import { getLocalizedMetadata } from "@/lib/seo";
import { buildAnketaFilters } from "@/lib/utils/anketa";
import { Skeleton } from "@/components/ui/skeleton";
import type { Locale } from "@/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "anketas" });

  return getLocalizedMetadata(
    locale,
    t("title"),
    t("description"),
    "/anketas"
  );
}

async function AnketasContent({
  locale,
  filtersAndOptions,
}: {
  locale: Locale;
  filtersAndOptions: ReturnType<typeof buildAnketaFilters>;
}) {
  const t = await getTranslations({ locale, namespace: "anketas" });

  const { filters, options } = filtersAndOptions;

  const [anketas, total, cities, categories, settings] = await Promise.all([
    getAnketas(filters, { ...options, take: 10 }),
    getAnketasCount(filters),
    getCities(),
    getCategories(),
    getSiteSettings(),
  ]);

  const whatsappLink = settings?.whatsappNumber
    ? buildWhatsAppLink({
        phone: settings.whatsappNumber,
        text: t("whatsappMessage"),
        locale,
      })
    : "#";

  return (
    <>
      {/* Header */}
      <div className="mb-8 space-y-4 md:mb-12">
        <div>
          <h1 className="mb-3 text-3xl font-bold md:text-4xl">{t("title")}</h1>
          <p className="text-lg text-foreground-secondary md:text-xl">
            {t("description")}
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
        {/* Filters sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-28">
            <AnketaFilters cities={cities} categories={categories} />
          </div>
        </aside>

        {/* Results */}
        <div>
          {anketas.length === 0 ? (
            <div className="rounded-xl border border-border bg-surface p-12 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-muted">
                <Search className="h-8 w-8 text-foreground-muted" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">{t("noResults")}</h3>
              <p className="mb-6 text-foreground-secondary">
                {t("noResultsDescription")}
              </p>
              {settings?.whatsappNumber && (
                <Button asChild size="lg" className="gap-2">
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="h-5 w-5" />
                    {t("contactWhatsApp")}
                  </a>
                </Button>
              )}
            </div>
          ) : (
            <AnketasContentClient
              initialAnketas={anketas}
              totalCount={total}
              filters={{
                cityId: filters.cityId,
                category: filters.categoryFilterTag,
                search: filters.search,
                minRating: filters.minRating?.toString(),
                onlyWithReviews: filters.onlyWithReviews ? "true" : undefined,
                sortBy: options.sortBy,
              }}
              whatsappNumber={settings?.whatsappNumber}
              cities={cities}
              categories={categories}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default async function AnketasPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{
    cityId?: string;
    category?: string;
    search?: string;
    minRating?: string;
    onlyWithReviews?: string;
    sortBy?: string;
  }>;
}) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  const filtersAndOptions = buildAnketaFilters(resolvedSearchParams);

  return (
    <AnketaFiltersProvider>
      <div className="container py-8 md:py-12">
        <Suspense
          fallback={
            <>
              <div className="mb-8 space-y-4 md:mb-12">
                <div>
                  <Skeleton className="h-10 w-64 mb-3" />
                  <Skeleton className="h-6 w-96" />
                </div>
                <Skeleton className="h-12 w-48" />
              </div>
              <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
                <aside className="hidden lg:block">
                  <div className="sticky top-28">
                    <AnketaFiltersSkeleton />
                  </div>
                </aside>
                <div>
                  <Skeleton className="h-6 w-32 mb-8" />
                  <div className="grid gap-8 md:grid-cols-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <AnketaCardSkeleton key={i} />
                    ))}
                  </div>
                </div>
              </div>
            </>
          }
        >
          <AnketasContent locale={locale} filtersAndOptions={filtersAndOptions} />
        </Suspense>
      </div>
    </AnketaFiltersProvider>
  );
}


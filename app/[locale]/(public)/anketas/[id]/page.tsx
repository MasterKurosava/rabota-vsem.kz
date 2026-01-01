import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getAnketaById, getAnketas } from "@/server/queries/anketas";
import { getSiteSettings } from "@/server/queries/settings";
import { AnketaCard } from "@/components/anketa/AnketaCard";
import { AnketaDetailSkeleton } from "@/components/anketa/AnketaDetailSkeleton";
import { ContactSidebar } from "@/components/anketa/ContactSidebar";
import { ReviewItem } from "@/components/anketa/ReviewItem";
import { CommentForm } from "@/components/anketa/CommentForm";
import { LoginPrompt } from "@/components/anketa/LoginPrompt";
import { isAuthenticated } from "@/lib/access";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, ArrowLeft, User, Star, CheckCircle2, Shield } from "lucide-react";
import { getLocalizedMetadata } from "@/lib/seo";
import {
  filterSimilarAnketas,
  getCityName,
  getCategoryName,
  formatRating,
} from "@/lib/utils/anketa";
import { pluralizeReviews } from "@/lib/utils/reviews";
import type { Locale } from "@/i18n";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; id: string }>;
}) {
  const { locale, id } = await params;
  const anketa = await getAnketaById(id);

  if (!anketa || !anketa.user.phoneVerified) {
    return getLocalizedMetadata(locale, "Not Found", "", "");
  }

  return getLocalizedMetadata(
    locale,
    anketa.title,
    anketa.description.slice(0, 160),
    `/anketas/${id}`
  );
}

async function AnketaDetailContent({
  locale,
  id,
}: {
  locale: Locale;
  id: string;
}) {
  const t = await getTranslations({ locale, namespace: "anketas" });

  const anketa = await getAnketaById(id);
  if (!anketa || !anketa.isActive || !anketa.user.phoneVerified) {
    notFound();
  }

  const [settings, similarAnketas] = await Promise.all([
    getSiteSettings(),
    getAnketas({
      categoryId: anketa.categoryId,
      cityId: anketa.cityId,
      isActive: true,
    }),
  ]);

  const cityName = getCityName(anketa.city, locale);

  const filteredSimilar = filterSimilarAnketas(
    similarAnketas,
    anketa.id,
    3
  );

  const isAuth = await isAuthenticated();

  return (
    <div className="container py-8 md:py-12">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="gap-2">
          <Link href="/anketas">
            <ArrowLeft className="h-4 w-4" />
            {t("backToAnketas")}
          </Link>
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_600px]">
        <div className="space-y-6">
          {/* PROFILE HERO / HEADER */}
          <Card className="border-2 border-border/50 shadow-lg bg-gradient-to-br from-surface to-surface-muted/30">
            <CardHeader className="pb-6">
              <div className="flex items-start gap-6">
                {/* Avatar */}
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/30 to-violet-500/30 ring-4 ring-primary/20 shadow-lg">
                  <User className="h-12 w-12 text-primary" />
                </div>
                
                {/* Name, Rating, Trust Indicators */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold text-foreground">
                          {anketa.user.name}
                        </h1>
                        {/* Rating with stars - right after name */}
                        {anketa.user.rating && (
                          <div className="flex items-center gap-2 shrink-0">
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-5 w-5 ${
                                    i < Math.floor(anketa.user.rating!)
                                      ? "fill-yellow-500 text-yellow-500"
                                      : i < anketa.user.rating!
                                      ? "fill-yellow-500/50 text-yellow-500/50"
                                      : "fill-transparent text-gray-300 dark:text-gray-600"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className={`text-lg font-bold ${
                              anketa.user.rating >= 4.5 
                                ? "text-green-600 dark:text-green-400" 
                                : anketa.user.rating >= 4.0 
                                ? "text-yellow-600 dark:text-yellow-400"
                                : "text-foreground"
                            }`}>
                              {formatRating(anketa.user.rating)}
                            </span>
                          </div>
                        )}
                      </div>
                      {/* Trust Indicators */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <Badge 
                          variant="outline" 
                          className="h-6 px-2.5 text-xs bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800 font-semibold"
                        >
                          <Shield className="h-3 w-3 mr-1" />
                          {t("officialEmploymentBadge")}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className="h-6 px-2.5 text-xs bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800 font-semibold"
                        >
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          {t("verifiedBadge")}
                        </Badge>
                        {anketa.comments && anketa.comments.length > 0 ? (
                          <span className="text-sm text-foreground-secondary lowercase">
                            {anketa.comments.length} {pluralizeReviews(anketa.comments.length, locale)}
                          </span>
                        ) : (
                          <span className="text-sm text-foreground-secondary lowercase">
                            отзывов нет
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Category and Location */}
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge
                      variant="outline"
                      className="h-7 px-3 text-sm bg-surface border-border/50"
                    >
                      {getCategoryName(anketa.category, locale)}
                    </Badge>
                    <div className="flex items-center gap-1.5 text-sm text-foreground-secondary">
                      <MapPin className="h-4 w-4" />
                      <span className="font-medium">{cityName}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Title / Main Specialization */}
              <div className="pt-4 border-t border-border/50">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {anketa.title}
                </h2>
              </div>
            </CardHeader>
          </Card>

          {/* SECTION: О специалисте */}
          <Card className="border-2 border-border/50 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                {t("bio")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground-secondary leading-relaxed whitespace-pre-line">
                {anketa.description}
              </p>
            </CardContent>
          </Card>

          {/* SECTION: Отзывы */}
          <Card className="border-2 border-border/50 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                {t("reviews")}
                {anketa.comments && anketa.comments.length > 0 && (
                  <Badge variant="outline" className="ml-2 h-6 px-2 text-xs bg-primary/10 text-primary border-primary/30">
                    {anketa.comments.length}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {anketa.comments && anketa.comments.length > 0 ? (
                <div className="space-y-4">
                  {anketa.comments.map((comment: {
                    id: string;
                    rating: number;
                    text: string;
                    createdAt?: string | Date;
                  }) => (
                    <ReviewItem
                      key={comment.id}
                      rating={comment.rating}
                      text={comment.text}
                      createdAt={comment.createdAt}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Star className="h-12 w-12 text-foreground-muted mx-auto mb-3 opacity-50" />
                  <p className="text-base font-medium text-foreground-secondary mb-1">
                    {t("noReviews")}
                  </p>
                  <p className="text-sm text-foreground-muted">
                    Будьте первым, кто оставит отзыв!
                  </p>
                </div>
              )}

              {/* Comment Form or Login Prompt */}
              <div className="pt-6 border-t border-border/50">
                {isAuth ? (
                  <CommentForm
                    anketaId={anketa.id}
                    recipientId={anketa.userId}
                  />
                ) : (
                  <LoginPrompt />
                )}
              </div>
            </CardContent>
          </Card>

          {filteredSimilar.length > 0 && (
            <div>
              <h2 className="mb-4 text-2xl font-bold">{t("similarAnketas")}</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {filteredSimilar.map((s: typeof filteredSimilar[0]) => (
                  <AnketaCard
                    key={s.id}
                    anketa={s}
                    whatsappNumber={settings?.whatsappNumber}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-6">
          <ContactSidebar
            name={anketa.user.name}
            rating={anketa.user.rating}
            categoryName={getCategoryName(anketa.category, locale)}
            phone={anketa.user.phone}
            email={anketa.user.email}
            whatsappNumber={settings?.whatsappNumber}
            address={anketa.address}
            latitude={anketa.latitude}
            longitude={anketa.longitude}
            showLocation={anketa.showLocation}
            cityName={cityName}
            locale={locale}
          />
        </aside>
      </div>
    </div>
  );
}

export default async function AnketaDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; id: string }>;
}) {
  const { locale, id } = await params;

  return (
    <Suspense fallback={<AnketaDetailSkeleton />}>
      <AnketaDetailContent locale={locale} id={id} />
    </Suspense>
  );
}


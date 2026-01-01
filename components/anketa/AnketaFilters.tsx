"use client";

import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Star, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAnketaFiltersContext } from "@/contexts/AnketaFiltersContext";
import { getCategoryName } from "@/lib/utils/anketa";
import type { City } from "@prisma/client";
import type { Category } from "@/lib/types/category";

interface AnketaFiltersProps {
  cities: City[];
  categories: Category[];
}

export function AnketaFilters({ cities, categories }: AnketaFiltersProps) {
  const t = useTranslations("anketas");
  const locale = useLocale() as "ru" | "en" | "kk";
  const {
    filters,
    updateFilter,
    clearFilters,
    getCityNameLocalized,
    activeFiltersCount,
  } = useAnketaFiltersContext();

  const { minRating, onlyWithReviews, cityId, category } = filters;

  // Check which filters are active
  const hasActiveCategory = category !== null;
  const hasActiveCity = cityId !== null;
  const hasActiveRating = minRating !== null;
  const hasActiveReviews = onlyWithReviews;

  return (
    <Card className="border-2 border-border/50 shadow-md bg-surface">
      <CardHeader className="pb-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-semibold">{t("filters")}</CardTitle>
            {activeFiltersCount > 0 && (
              <Badge variant="outline" className="h-5 px-2 text-xs font-medium bg-primary/10 text-primary border-primary/30">
                {activeFiltersCount}
              </Badge>
            )}
          </div>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-7 gap-1.5 text-xs text-foreground-secondary hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
              {t("clear")}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* Основные фильтры */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px flex-1 bg-border/50" />
            <span className="text-xs font-semibold text-foreground-muted uppercase tracking-wide">
              {t("mainFilters")}
            </span>
            <div className="h-px flex-1 bg-border/50" />
          </div>

          {/* Category filter - FIRST */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">{t("category")}</Label>
              {hasActiveCategory && (
                <Badge variant="outline" className="h-4 px-1.5 text-xs bg-primary/10 text-primary border-primary/30">
                  {(() => {
                    const found = categories.find(c => c.filterTag === category);
                    return found ? getCategoryName(found, locale) : "";
                  })()}
                </Badge>
              )}
            </div>
            <Select
              value={category || "all"}
              onValueChange={(value) => updateFilter("category", value === "all" ? null : value)}
            >
              <SelectTrigger className={`rounded-lg border-2 ${hasActiveCategory ? "border-primary/30 bg-primary/5" : ""}`}>
                <SelectValue placeholder={t("allCategories")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allCategories")}</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.filterTag}>
                    {getCategoryName(cat, locale)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* City filter - SECOND */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">{t("city")}</Label>
              {hasActiveCity && (
                <Badge variant="outline" className="h-4 px-1.5 text-xs bg-primary/10 text-primary border-primary/30">
                  {getCityNameLocalized(cities.find(c => c.id === cityId)!)}
                </Badge>
              )}
            </div>
            <Select
              value={cityId || "all"}
              onValueChange={(value) => updateFilter("cityId", value === "all" ? null : value)}
            >
              <SelectTrigger className={`rounded-lg border-2 ${hasActiveCity ? "border-primary/30 bg-primary/5" : ""}`}>
                <SelectValue placeholder={t("allCities")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allCities")}</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city.id} value={city.id}>
                    {getCityNameLocalized(city)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Дополнительные фильтры */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px flex-1 bg-border/50" />
            <span className="text-xs font-semibold text-foreground-muted uppercase tracking-wide">
              {t("additionalFilters")}
            </span>
            <div className="h-px flex-1 bg-border/50" />
          </div>

          {/* Only with reviews checkbox */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <Checkbox
                id="onlyWithReviews"
                checked={onlyWithReviews}
                onChange={() => {
                  updateFilter("onlyWithReviews", !onlyWithReviews);
                }}
                label={t("onlyWithReviews")}
              />
              {hasActiveReviews && (
                <Badge variant="outline" className="h-4 px-1.5 text-xs bg-primary/10 text-primary border-primary/30">
                  ✓
                </Badge>
              )}
            </div>
          </div>

        {/* Rating filter - LAST with stars like in reviews */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">{t("rating")}</Label>
            {hasActiveRating && (
              <Badge variant="outline" className="h-4 px-1.5 text-xs bg-primary/10 text-primary border-primary/30">
                {minRating}+
              </Badge>
            )}
          </div>
          <div className="space-y-2">
            <label
              htmlFor="rating-all"
              className="flex items-center space-x-3 cursor-pointer group p-2 rounded-lg hover:bg-surface-muted/50 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                updateFilter("minRating", null);
              }}
            >
              <div className="relative flex items-center justify-center">
                <input
                  type="radio"
                  id="rating-all"
                  name="rating"
                  checked={!minRating}
                  readOnly
                  className="h-5 w-5 cursor-pointer border-2 border-border/60 appearance-none rounded-full bg-surface transition-all duration-200 hover:border-primary/50 checked:border-primary checked:bg-primary/10 focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 focus:outline-none"
                />
                {!minRating && (
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-primary shadow-sm" />
                )}
              </div>
              <span className="text-sm font-medium select-none text-foreground group-hover:text-foreground transition-colors">{t("allRatings")}</span>
            </label>
            <label
              htmlFor="rating-5"
              className="flex items-center space-x-3 cursor-pointer group p-2 rounded-lg hover:bg-surface-muted/50 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                updateFilter("minRating", 5);
              }}
            >
              <div className="relative flex items-center justify-center">
                <input
                  type="radio"
                  id="rating-5"
                  name="rating"
                  checked={minRating === 5}
                  readOnly
                  className="h-5 w-5 cursor-pointer border-2 border-border/60 appearance-none rounded-full bg-surface transition-all duration-200 hover:border-primary/50 checked:border-primary checked:bg-primary/10 focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 focus:outline-none"
                />
                {minRating === 5 && (
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-primary shadow-sm" />
                )}
              </div>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 transition-colors ${
                      i < 5
                        ? "fill-yellow-500 text-yellow-500"
                        : "fill-transparent text-gray-300 dark:text-gray-600"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium select-none text-foreground group-hover:text-foreground transition-colors">{t("rating5Stars")}</span>
            </label>
            <label
              htmlFor="rating-4"
              className="flex items-center space-x-3 cursor-pointer group p-2 rounded-lg hover:bg-surface-muted/50 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                updateFilter("minRating", 4);
              }}
            >
              <div className="relative flex items-center justify-center">
                <input
                  type="radio"
                  id="rating-4"
                  name="rating"
                  checked={minRating === 4}
                  readOnly
                  className="h-5 w-5 cursor-pointer border-2 border-border/60 appearance-none rounded-full bg-surface transition-all duration-200 hover:border-primary/50 checked:border-primary checked:bg-primary/10 focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 focus:outline-none"
                />
                {minRating === 4 && (
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-primary shadow-sm" />
                )}
              </div>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 transition-colors ${
                      i < 4
                        ? "fill-yellow-500 text-yellow-500"
                        : "fill-transparent text-gray-300 dark:text-gray-600"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium select-none text-foreground group-hover:text-foreground transition-colors">{t("rating4Plus")}</span>
            </label>
            <label
              htmlFor="rating-3"
              className="flex items-center space-x-3 cursor-pointer group p-2 rounded-lg hover:bg-surface-muted/50 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                updateFilter("minRating", 3);
              }}
            >
              <div className="relative flex items-center justify-center">
                <input
                  type="radio"
                  id="rating-3"
                  name="rating"
                  checked={minRating === 3}
                  readOnly
                  className="h-5 w-5 cursor-pointer border-2 border-border/60 appearance-none rounded-full bg-surface transition-all duration-200 hover:border-primary/50 checked:border-primary checked:bg-primary/10 focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 focus:outline-none"
                />
                {minRating === 3 && (
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-primary shadow-sm" />
                )}
              </div>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 transition-colors ${
                      i < 3
                        ? "fill-yellow-500 text-yellow-500"
                        : "fill-transparent text-gray-300 dark:text-gray-600"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium select-none text-foreground group-hover:text-foreground transition-colors">{t("rating3Plus")}</span>
            </label>
          </div>
        </div>
        </div>
      </CardContent>
    </Card>
  );
}


import type { City } from "@prisma/client";
import type { Locale } from "@/i18n";

/**
 * Get localized city name
 */
export function getCityName(
  city: { nameRu: string; nameEn: string; nameKk: string },
  locale: Locale
): string {
  switch (locale) {
    case "ru":
      return city.nameRu;
    case "en":
      return city.nameEn;
    case "kk":
      return city.nameKk;
    default:
      return city.nameRu;
  }
}

/**
 * Get localized category name
 */
export function getCategoryName(
  category: { nameRu: string; nameEn: string; nameKk: string },
  locale: Locale
): string {
  switch (locale) {
    case "ru":
      return category.nameRu;
    case "en":
      return category.nameEn;
    case "kk":
      return category.nameKk;
    default:
      return category.nameRu;
  }
}

/**
 * Truncate title to be more human-readable
 */
export function truncateTitle(title: string, maxLength: number = 60): string {
  if (title.length <= maxLength) {
    return title;
  }
  return title.substring(0, maxLength - 3) + "...";
}

/**
 * Format rating for display
 */
export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

/**
 * Build filters object from search params
 * Возвращает объект с filters и options для передачи в getAnketas
 */
export function buildAnketaFilters(searchParams: {
  cityId?: string;
  category?: string;
  search?: string;
  minRating?: string;
  onlyWithReviews?: string;
  sortBy?: string;
}) {
  const minRating = searchParams.minRating
    ? Number.parseFloat(searchParams.minRating)
    : undefined;

  // Normalize search - empty string becomes undefined
  const search = searchParams.search?.trim() || undefined;

  const sortBy = searchParams.sortBy as
    | "rating"
    | "reviews"
    | "newest"
    | "oldest"
    | undefined;

  return {
    filters: {
      cityId: searchParams.cityId || undefined,
      categoryFilterTag: searchParams.category || undefined,
      search,
      minRating: minRating && !Number.isNaN(minRating) ? minRating : undefined,
      onlyWithReviews: searchParams.onlyWithReviews === "true",
      isActive: true,
    },
    options: {
      sortBy: sortBy || "newest",
    },
  };
}

/**
 * Filter similar anketas (exclude current, limit count)
 */
export function filterSimilarAnketas<T extends { id: string }>(
  anketas: T[],
  excludeId: string,
  limit: number = 3
): T[] {
  return anketas.filter((s) => s.id !== excludeId).slice(0, limit);
}

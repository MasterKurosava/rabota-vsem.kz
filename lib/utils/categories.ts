import type { Locale } from "@/i18n";
import { pluralize } from "./pluralize";

interface CategoryData {
  id: string;
  nameRu: string;
  nameEn: string;
  nameKk: string;
  filterTag: string;
  imageUrl: string;
  count: number;
}

/**
 * Get localized category name
 */
export function getCategoryName(
  category: CategoryData,
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
 * Filter categories with count > 0
 */
export function filterCategoriesWithCounts(
  categories: CategoryData[]
): CategoryData[] {
  return categories.filter((c) => c.count > 0);
}

/**
 * Build category link href
 */
export function buildCategoryHref(filterTag: string): string {
  return `/anketas?category=${filterTag}`;
}

/**
 * Get pluralized vacancies text
 */
export function getVacanciesText(count: number, locale: Locale): string {
  return pluralize(count, locale);
}


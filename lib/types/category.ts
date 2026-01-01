/**
 * Category type definition
 * Used when Prisma types are not available
 */
export interface Category {
  id: string;
  nameRu: string;
  nameEn: string;
  nameKk: string;
  imageUrl: string;
  filterTag: string;
  createdAt: Date;
}

/**
 * Get localized category name
 */
export function getCategoryName(category: Category, locale: "ru" | "en" | "kk"): string {
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


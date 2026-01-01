import type { Locale } from "@/i18n";

/**
 * Get pluralized form of "отзыв" (review) in Russian
 * 1 отзыв, 2-4 отзыва, 5+ отзывов
 */
export function pluralizeReviews(count: number, locale: Locale): string {
  if (locale === "ru") {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;
    
    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
      return "отзывов";
    }
    
    if (lastDigit === 1) {
      return "отзыв";
    }
    
    if (lastDigit >= 2 && lastDigit <= 4) {
      return "отзыва";
    }
    
    return "отзывов";
  }
  
  if (locale === "kk") {
    return "пікір";
  }
  
  return count === 1 ? "review" : "reviews";
}









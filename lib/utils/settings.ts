import type { Locale } from "@/i18n";

interface HomepageTexts {
  title?: string;
  subtitle?: string;
  benefits?: string[];
  ctaText?: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

/**
 * Parse homepage texts from JSON string
 */
export function parseHomepageTexts(
  homepageTextsJson: string | null,
  locale: Locale
): HomepageTexts | null {
  if (!homepageTextsJson) {
    return null;
  }

  try {
    const parsed = JSON.parse(homepageTextsJson);
    return parsed[locale] || null;
  } catch {
    return null;
  }
}

/**
 * Parse FAQ items from JSON string
 */
export function parseFAQItems(
  faqJson: string | null,
  locale: Locale
): FAQItem[] {
  if (!faqJson) {
    return [];
  }

  try {
    const parsed = JSON.parse(faqJson);
    return parsed[locale] || [];
  } catch {
    return [];
  }
}


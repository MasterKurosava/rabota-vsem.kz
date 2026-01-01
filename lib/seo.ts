import type { Metadata } from "next";
import type { Locale } from "@/i18n";

export function getLocalizedMetadata(
  locale: Locale,
  title: string,
  description: string,
  path: string = ""
): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const url = `${baseUrl}/${locale}${path}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}



import { db } from "@/lib/db";
import { unstable_cache } from "next/cache";
import { cache } from "react";

const getSiteSettingsUncached = async () => {
  return db.siteSettings.findFirst();
};

// React cache для deduplication в рамках одного запроса
export const getSiteSettings = cache(getSiteSettingsUncached);

// Next.js cache для кеширования между запросами
export const getCachedSiteSettings = unstable_cache(
  getSiteSettingsUncached,
  ["site-settings"],
  { revalidate: 3600 } // 1 час
);



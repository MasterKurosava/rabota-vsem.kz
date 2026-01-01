import { db } from "@/lib/db";
import { unstable_cache } from "next/cache";
import { cache } from "react";

const getCitiesUncached = async () => {
  return db.city.findMany({
    where: { isActive: true },
    orderBy: { nameRu: "asc" },
  });
};

// React cache для deduplication
export const getCities = cache(getCitiesUncached);

// Next.js cache для кеширования между запросами
export const getCachedCities = unstable_cache(
  getCitiesUncached,
  ["cities"],
  { revalidate: 3600 } // 1 час
);


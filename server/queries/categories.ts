import { db } from "@/lib/db";
import { unstable_cache } from "next/cache";
import type { Locale } from "@/i18n";

const getCategoriesUncached = async () => {
  return db.category.findMany({
    orderBy: {
      nameRu: "asc",
    },
  });
};

export const getCategories = unstable_cache(
  getCategoriesUncached,
  ["categories"],
  { revalidate: 1800 } // 30 минут
);

const getCategoriesWithCountsUncached = async () => {
  const categories = await db.category.findMany({
    orderBy: {
      nameRu: "asc",
    },
    include: {
      _count: {
        select: {
          anketa: {
            where: {
              isActive: true,
            },
          },
        },
      },
    },
  });

  return categories.map((category) => ({
    id: category.id,
    nameRu: category.nameRu,
    nameEn: category.nameEn,
    nameKk: category.nameKk,
    filterTag: category.filterTag,
    imageUrl: category.imageUrl,
    count: category._count.anketa,
  }));
};

export const getCategoriesWithCounts = unstable_cache(
  getCategoriesWithCountsUncached,
  ["categories-with-counts"],
  { revalidate: 1800 } // 30 минут
);

export async function getCategoryByFilterTag(filterTag: string) {
  return db.category.findUnique({
    where: {
      filterTag,
    },
  });
}

export async function getCategoryById(id: string) {
  return db.category.findUnique({
    where: {
      id,
    },
  });
}


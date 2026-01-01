"use client";

import { useTranslations, useLocale } from "next-intl";
import { CategoryCard } from "./Categories/CategoryCard";
import {
  filterCategoriesWithCounts,
  buildCategoryHref,
  getVacanciesText,
  getCategoryName,
} from "@/lib/utils/categories";

interface CategoryData {
  id: string;
  nameRu: string;
  nameEn: string;
  nameKk: string;
  filterTag: string;
  imageUrl: string;
  count: number;
}

interface CategoriesProps {
  categories: CategoryData[];
}

export function Categories({ categories }: CategoriesProps) {
  const t = useTranslations("home");
  const locale = useLocale() as "ru" | "en" | "kk";

  const categoriesWithCounts = filterCategoriesWithCounts(categories);

  if (categoriesWithCounts.length === 0) {
    return null;
  }

  return (
    <section className="section-spacing">
      <div className="container">
        <h2 className="mb-8 text-center text-3xl font-bold md:text-4xl">
          {t("categories")}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {categoriesWithCounts.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              count={category.count}
              label={getCategoryName(category, locale)}
              vacanciesText={getVacanciesText(category.count, locale)}
              href={buildCategoryHref(category.filterTag)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

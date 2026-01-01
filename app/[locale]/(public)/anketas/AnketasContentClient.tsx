"use client";

import { useState, useEffect, useTransition } from "react";
import { useTranslations } from "next-intl";
import { AnketasList } from "@/components/anketa/AnketasList";
import { AnketaCardSkeleton } from "@/components/anketa/AnketaCardSkeleton";
import { SearchAndSortBar } from "@/components/anketa/SearchAndSortBar";
import { MobileFiltersCollapsible } from "@/components/anketa/MobileFiltersCollapsible";
import { useAnketaFiltersContext } from "@/contexts/AnketaFiltersContext";
import type { Anketa as AnketaProfile, City, Category } from "@prisma/client";

interface Anketa extends AnketaProfile {
  city: City;
  category: Category;
  user: {
    id: string;
    name: string;
    phone?: string | null;
    email?: string | null;
    rating?: number | null;
  };
}

interface AnketasContentClientProps {
  initialAnketas: Anketa[];
  totalCount: number;
  filters: {
    cityId?: string;
    category?: string;
    search?: string;
    minRating?: string;
    onlyWithReviews?: string;
    sortBy?: string;
  };
  whatsappNumber?: string | null;
  cities: City[];
  categories: Category[];
}

export function AnketasContentClient({
  initialAnketas,
  totalCount,
  filters: initialFilters,
  whatsappNumber,
  cities,
  categories,
}: AnketasContentClientProps) {
  const t = useTranslations("anketas");
  const { filters } = useAnketaFiltersContext();
  const [isPending, startTransition] = useTransition();
  const [isSearchDebouncing, setIsSearchDebouncing] = useState(false);
  const [displayCount, setDisplayCount] = useState(totalCount);

  // Update display count when total changes
  useEffect(() => {
    setDisplayCount(totalCount);
  }, [totalCount]);

  // Show loading when filters change (except search which has its own debounce)
  useEffect(() => {
    startTransition(() => {
      // This will trigger a re-render when filters change
    });
  }, [
    filters.cityId,
    filters.category,
    filters.minRating,
    filters.onlyWithReviews,
    filters.sortBy,
  ]);

  const isLoading = isPending || isSearchDebouncing;

  return (
    <>
      <SearchAndSortBar />
      <MobileFiltersCollapsible cities={cities} categories={categories} />
      <div className="mb-4 text-sm text-foreground-secondary">
        {t("foundResults", { count: displayCount })}
      </div>
      {isLoading ? (
        <div className="grid gap-8 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <AnketaCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <AnketasList
          initialAnketas={initialAnketas}
          totalCount={displayCount}
          filters={initialFilters}
          whatsappNumber={whatsappNumber}
          isLoading={false}
        />
      )}
    </>
  );
}


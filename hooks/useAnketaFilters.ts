import { useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { useCallback, useMemo } from "react";
import { getCityName } from "@/lib/utils/anketa";
import type { City } from "@prisma/client";
import type { Locale } from "@/i18n";

export function useAnketaFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale() as Locale;

  const updateFilter = useCallback(
    (key: string, value: string | null | boolean) => {
      const params = new URLSearchParams(searchParams.toString());
      
      // Remove page param when filters change
      params.delete("page");
      
      if (value === null || value === false || value === "") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
      
      // Use replace to avoid adding to history and reduce re-renders
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const clearFilters = useCallback(() => {
    router.replace("/anketas", { scroll: false });
  }, [router]);

  const getCityNameLocalized = useCallback(
    (city: City) => getCityName(city, locale),
    [locale]
  );

  const activeFiltersCount = useMemo(
    () =>
      Array.from(searchParams.entries()).filter(
        ([key]) => key !== "page" && key !== "sortBy"
      ).length,
    [searchParams]
  );

  const getFilterValue = useCallback(
    (key: string): string | null => {
      return searchParams.get(key);
    },
    [searchParams]
  );

  const getFilterValueAsBoolean = useCallback(
    (key: string): boolean => {
      return searchParams.get(key) === "true";
    },
    [searchParams]
  );

  const getFilterValueAsNumber = useCallback(
    (key: string): number | null => {
      const value = searchParams.get(key);
      return value ? Number(value) : null;
    },
    [searchParams]
  );

  return {
    updateFilter,
    clearFilters,
    getCityNameLocalized,
    activeFiltersCount,
    getFilterValue,
    getFilterValueAsBoolean,
    getFilterValueAsNumber,
  };
}


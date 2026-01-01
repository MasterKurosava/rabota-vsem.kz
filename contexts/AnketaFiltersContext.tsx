"use client";

import React, { createContext, useContext, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { getCityName } from "@/lib/utils/anketa";
import type { City } from "@prisma/client";
import type { Locale } from "@/i18n";

// ─────────────────────────────────────────────────────────────────────────────
// ТИПЫ
// ─────────────────────────────────────────────────────────────────────────────

export interface AnketaFiltersState {
  search: string;
  cityId: string | null;
  category: string | null;
  minRating: number | null;
  onlyWithReviews: boolean;
  sortBy: "rating" | "reviews" | "newest" | "oldest";
}

interface AnketaFiltersContextValue {
  filters: AnketaFiltersState;
  updateFilter: <K extends keyof AnketaFiltersState>(
    key: K,
    value: AnketaFiltersState[K]
  ) => void;
  clearFilters: () => void;
  getCityNameLocalized: (city: City) => string;
  activeFiltersCount: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT
// ─────────────────────────────────────────────────────────────────────────────

const defaultFilters: AnketaFiltersState = {
  search: "",
  cityId: null,
  category: null,
  minRating: null,
  onlyWithReviews: false,
  sortBy: "newest",
};

// ─────────────────────────────────────────────────────────────────────────────
// CONTEXT
// ─────────────────────────────────────────────────────────────────────────────

const AnketaFiltersContext = createContext<
  AnketaFiltersContextValue | undefined
>(undefined);

// ─────────────────────────────────────────────────────────────────────────────
// PROVIDER
// ─────────────────────────────────────────────────────────────────────────────

export function AnketaFiltersProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale() as Locale;

  // ═══════════════════════════════════════════════════════════════════════════
  // ИНИЦИАЛИЗАЦИЯ ИЗ URL (один раз при монтировании)
  // ═══════════════════════════════════════════════════════════════════════════

  const [filters, setFilters] = useState<AnketaFiltersState>(() => {
    const search = searchParams.get("search") || "";
    const cityId = searchParams.get("cityId") || null;
    const category = searchParams.get("category") || null;
    const minRatingParam = searchParams.get("minRating");
    const minRating = minRatingParam ? Number(minRatingParam) : null;
    const onlyWithReviews = searchParams.get("onlyWithReviews") === "true";
    const sortByParam = searchParams.get("sortBy");
    const sortBy =
      sortByParam === "rating" ||
      sortByParam === "reviews" ||
      sortByParam === "oldest"
        ? sortByParam
        : "newest";

    return {
      search,
      cityId,
      category,
      minRating,
      onlyWithReviews,
      sortBy,
    };
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // HELPER: BUILD URL
  // ═══════════════════════════════════════════════════════════════════════════

  function buildURL(newFilters: AnketaFiltersState): string {
    const params = new URLSearchParams();

    // Добавляем только непустые значения
    if (newFilters.search) params.set("search", newFilters.search);
    if (newFilters.cityId) params.set("cityId", newFilters.cityId);
    if (newFilters.category) params.set("category", newFilters.category);
    if (newFilters.minRating !== null)
      params.set("minRating", String(newFilters.minRating));
    if (newFilters.onlyWithReviews) params.set("onlyWithReviews", "true");
    if (newFilters.sortBy !== "newest") params.set("sortBy", newFilters.sortBy);

    const queryString = params.toString();
    return queryString ? `${pathname}?${queryString}` : pathname;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // UPDATE FILTER
  // ═══════════════════════════════════════════════════════════════════════════

  function updateFilter<K extends keyof AnketaFiltersState>(
    key: K,
    value: AnketaFiltersState[K]
  ) {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    // Обновляем URL
    const url = buildURL(newFilters);
    router.replace(url, { scroll: false });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CLEAR FILTERS
  // ═══════════════════════════════════════════════════════════════════════════

  function clearFilters() {
    setFilters(defaultFilters);
    router.replace(pathname, { scroll: false });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CITY NAME LOCALIZED
  // ═══════════════════════════════════════════════════════════════════════════

  function getCityNameLocalized(city: City): string {
    return getCityName(city, locale);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ACTIVE FILTERS COUNT
  // ═══════════════════════════════════════════════════════════════════════════

  const activeFiltersCount = [
    filters.search !== "",
    filters.cityId !== null,
    filters.category !== null,
    filters.minRating !== null,
    filters.onlyWithReviews === true,
  ].filter(Boolean).length;

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <AnketaFiltersContext.Provider
      value={{
        filters,
        updateFilter,
        clearFilters,
        getCityNameLocalized,
        activeFiltersCount,
      }}
    >
      {children}
    </AnketaFiltersContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────────────────────────────────────

export function useAnketaFiltersContext() {
  const ctx = useContext(AnketaFiltersContext);
  if (!ctx) {
    throw new Error(
      "useAnketaFiltersContext must be used within AnketaFiltersProvider"
    );
  }
  return ctx;
}

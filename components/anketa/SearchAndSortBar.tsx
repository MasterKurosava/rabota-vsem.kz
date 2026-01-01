"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAnketaFiltersContext } from "@/contexts/AnketaFiltersContext";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// КОМПОНЕНТ УПРОЩЁН:
// - Убрали useSearchWithDebounce (лишний хук)
// - Встроили debounce прямо здесь (проще понять)
// - Убрали пропс onSearchChange (не используется)
// ─────────────────────────────────────────────────────────────────────────────

export function SearchAndSortBar() {
  const t = useTranslations("anketas");
  const { filters, updateFilter } = useAnketaFiltersContext();

  // Локальное состояние для input (для debounce)
  const [searchInput, setSearchInput] = useState(filters.search);

  // Синхронизация с контекстом при изменении filters.search извне (например, при очистке фильтров)
  useEffect(() => {
    setSearchInput(filters.search);
  }, [filters.search]);

  // Debounce: обновляем фильтр через 350мс после последнего изменения
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        updateFilter("search", searchInput);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchInput]); // Зависимость только от searchInput

  return (
    <div className="mb-8 space-y-2">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {/* Search */}
        <div className="flex-1 w-full">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground-muted pointer-events-none" />
            <Input
              placeholder={t("searchPlaceholder")}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full rounded-xl h-14 pl-12 pr-4 text-base border-2 border-border bg-surface shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
          <label className="text-sm font-medium text-foreground-secondary whitespace-nowrap">
            {t("sortBy")}:
          </label>
          <Select
            value={filters.sortBy}
            onValueChange={(value) => {
              updateFilter(
                "sortBy",
                value as "rating" | "reviews" | "newest" | "oldest"
              );
            }}
          >
            <SelectTrigger className="w-[180px] rounded-lg border-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">{t("sortByRating")}</SelectItem>
              <SelectItem value="reviews">{t("sortByReviews")}</SelectItem>
              <SelectItem value="newest">{t("sortByNewest")}</SelectItem>
              <SelectItem value="oldest">{t("sortByOldest")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

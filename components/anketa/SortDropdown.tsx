"use client";

import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAnketaFilters } from "@/hooks/useAnketaFilters";

interface SortDropdownProps {
  currentSort: "rating" | "newest" | "alphabetical";
}

export function SortDropdown({ currentSort }: SortDropdownProps) {
  const t = useTranslations("anketas");
  const { updateFilter } = useAnketaFilters();

  return (
    <div className="mb-6 flex items-center justify-end">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-foreground-secondary">
          {t("sortBy")}:
        </label>
        <Select
          value={currentSort}
          onValueChange={(value) => {
            updateFilter("sortBy", value as "rating" | "newest" | "alphabetical");
          }}
        >
          <SelectTrigger className="w-[180px] rounded-lg">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">{t("sortByRating")}</SelectItem>
            <SelectItem value="newest">{t("sortByNewest")}</SelectItem>
            <SelectItem value="alphabetical">{t("sortByAlphabetical")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}









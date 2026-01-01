"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ChevronDown, Filter } from "lucide-react";
import { AnketaFilters } from "./AnketaFilters";
import { useAnketaFiltersContext } from "@/contexts/AnketaFiltersContext";
import type { City } from "@prisma/client";
import type { Category } from "@/lib/types/category";
import { cn } from "@/lib/utils";

interface MobileFiltersCollapsibleProps {
  cities: City[];
  categories: Category[];
}

export function MobileFiltersCollapsible({
  cities,
  categories,
}: MobileFiltersCollapsibleProps) {
  const t = useTranslations("anketas");
  const [isOpen, setIsOpen] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const { activeFiltersCount } = useAnketaFiltersContext();

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  return (
    <div className="lg:hidden mb-6">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        className="w-full justify-between h-12 border-2"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span className="font-medium">{t("filters")}</span>
          {activeFiltersCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
              {activeFiltersCount}
            </span>
          )}
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </Button>

      <div
        className="overflow-hidden transition-all duration-300 ease-out"
        style={{
          height: `${contentHeight}px`,
          opacity: isOpen ? 1 : 0,
        }}
        aria-hidden={!isOpen}
      >
        <div ref={contentRef} className="pt-4">
          <AnketaFilters cities={cities} categories={categories} />
        </div>
      </div>
    </div>
  );
}









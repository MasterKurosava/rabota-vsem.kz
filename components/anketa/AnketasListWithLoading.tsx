"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { AnketasList } from "./AnketasList";
import { AnketaCardSkeleton } from "./AnketaCardSkeleton";
import type { AnketaWithRelations } from "@/hooks/useInfiniteAnketas";

interface AnketasListWithLoadingProps {
  initialAnketas: AnketaWithRelations[];
  totalCount?: number;
  filters: {
    cityId?: string;
    category?: string;
    search?: string;
    minRating?: string;
    onlyWithReviews?: string;
    sortBy?: string;
  };
  whatsappNumber?: string | null;
}

export function AnketasListWithLoading({
  initialAnketas,
  totalCount,
  filters,
  whatsappNumber,
}: AnketasListWithLoadingProps) {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isDebouncing, setIsDebouncing] = useState(false);

  // Track when filters change
  useEffect(() => {
    setIsLoading(true);
    // Reset loading after a short delay to allow for navigation
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, [
    searchParams.get("search"),
    searchParams.get("cityId"),
    searchParams.get("category"),
    searchParams.get("minRating"),
    searchParams.get("onlyWithReviews"),
    searchParams.get("sortBy"),
  ]);

  // Check if search is being debounced
  useEffect(() => {
    const searchValue = searchParams.get("search");
    // This is a simple check - in a real app you'd track debounce state more precisely
    setIsDebouncing(false);
  }, [searchParams]);

  if (isLoading || isDebouncing) {
    return (
      <div className="grid gap-8 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <AnketaCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <AnketasList
      initialAnketas={initialAnketas}
      totalCount={totalCount}
      filters={filters}
      whatsappNumber={whatsappNumber}
      isLoading={false}
    />
  );
}









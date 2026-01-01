"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { Anketa as AnketaProfile, City, Category } from "@prisma/client";
import { useParams } from "next/navigation";

export interface AnketaWithRelations extends AnketaProfile {
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

interface UseInfiniteAnketasProps {
  initialFilters: {
    cityId?: string;
    category?: string;
    search?: string;
    minRating?: string;
    onlyWithReviews?: string;
    sortBy?: string;
  };
  initialData: AnketaWithRelations[];
}

export function useInfiniteAnketas({
  initialFilters,
  initialData,
}: UseInfiniteAnketasProps) {
  const params = useParams();
  const locale = params.locale as string;
  const [anketas, setAnketas] = useState<AnketaWithRelations[]>(initialData);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialData.length >= 10);
  const [page, setPage] = useState(1);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Reset data when filters change - use JSON stringify for deep comparison
  const filtersKey = JSON.stringify(initialFilters);
  const prevFiltersKeyRef = useRef<string>(filtersKey);

  useEffect(() => {
    // Only reset if filters actually changed
    if (prevFiltersKeyRef.current !== filtersKey) {
      setAnketas(initialData);
      setPage(1);
      setHasMore(initialData.length >= 10);
      prevFiltersKeyRef.current = filtersKey;
    }
  }, [filtersKey, initialData]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: (page + 1).toString(),
        limit: "10",
        ...(initialFilters.cityId && { cityId: initialFilters.cityId }),
        ...(initialFilters.category && { category: initialFilters.category }),
        ...(initialFilters.search && { search: initialFilters.search }),
        ...(initialFilters.minRating && { minRating: initialFilters.minRating }),
        ...(initialFilters.onlyWithReviews && { onlyWithReviews: initialFilters.onlyWithReviews }),
        ...(initialFilters.sortBy && { sortBy: initialFilters.sortBy }),
      });

      const response = await fetch(`/api/anketas?${params.toString()}`);
      const result = await response.json();

      if (result.data && result.data.length > 0) {
        setAnketas((prev) => [...prev, ...result.data]);
        setHasMore(result.hasMore);
        setPage((prev) => prev + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more anketas:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, initialFilters]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loadMore, hasMore, loading]);

  return {
    anketas,
    loading,
    hasMore,
    observerTarget,
  };
}


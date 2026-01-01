"use client";

import { AnketaCard } from "./AnketaCard";
import { AnketaCardSkeleton } from "./AnketaCardSkeleton";
import { useInfiniteAnketas, type AnketaWithRelations } from "@/hooks/useInfiniteAnketas";

interface AnketasListProps {
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
  isLoading?: boolean;
}

export function AnketasList({
  initialAnketas,
  totalCount,
  filters,
  whatsappNumber,
  isLoading = false,
}: AnketasListProps) {
  const { anketas, loading, hasMore, observerTarget } =
    useInfiniteAnketas({
      initialFilters: filters,
      initialData: initialAnketas,
    });

  // Show skeletons when loading
  if (isLoading) {
    return (
      <div className="grid gap-8 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <AnketaCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (anketas.length === 0) {
    return null;
  }

  return (
    <>
      <div className="grid gap-8 md:grid-cols-2">
        {anketas.map((anketa) => (
          <AnketaCard
            key={anketa.id}
            anketa={anketa}
            whatsappNumber={whatsappNumber}
          />
        ))}
      </div>

      {/* Infinite scroll trigger */}
      {hasMore && (
        <div ref={observerTarget} className="mt-8">
          {loading && (
            <div className="grid gap-8 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <AnketaCardSkeleton key={i} />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}


import { AnketaCardSkeleton } from "@/components/anketa/AnketaCardSkeleton";
import { AnketaFiltersSkeleton } from "@/components/anketa/AnketaFiltersSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function AnketasLoading() {
  return (
    <div className="container py-8 md:py-12">
      {/* Header */}
      <div className="mb-8 space-y-4 md:mb-12">
        <div>
          <Skeleton className="h-10 w-64 mb-3" />
          <Skeleton className="h-6 w-96" />
        </div>
        <Skeleton className="h-12 w-48" />
      </div>

      {/* Search and Sort Bar Skeleton */}
      <div className="mb-8 space-y-4">
        {/* Search input skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-14 w-full rounded-xl" />
          <Skeleton className="h-4 w-64" />
        </div>
        {/* Sort dropdown skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-10 w-[180px] rounded-lg" />
          </div>
        </div>
      </div>

      {/* Results count skeleton */}
      <div className="mb-4">
        <Skeleton className="h-5 w-32" />
      </div>

      <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
        {/* Filters sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-28">
            <AnketaFiltersSkeleton />
          </div>
        </aside>

        {/* Results */}
        <div>
          <div className="grid gap-8 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <AnketaCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile filters */}
      <div className="mt-8 lg:hidden">
        <AnketaFiltersSkeleton />
      </div>
    </div>
  );
}


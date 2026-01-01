import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container py-8 md:py-12">
      {/* Search bar skeleton */}
      <div className="mb-8 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-14 w-full rounded-xl" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-48" />
        </div>
      </div>
      <div className="mb-8 space-y-4 md:mb-12">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-6 w-96" />
        <Skeleton className="h-12 w-48" />
      </div>
      <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-28">
            <Skeleton className="h-[400px] w-full rounded-lg" />
          </div>
        </aside>
        <div>
          <Skeleton className="h-6 w-32 mb-8" />
          <div className="grid gap-8 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-[400px] w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


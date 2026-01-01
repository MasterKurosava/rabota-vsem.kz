import { Skeleton } from "@/components/ui/skeleton";

export function CategoriesSkeleton() {
  return (
    <section className="section-spacing">
      <div className="container">
        <Skeleton className="mx-auto mb-8 h-10 w-64" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="relative overflow-hidden rounded-lg">
              <Skeleton className="aspect-[4/3] w-full" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <Skeleton className="h-5 w-24 mb-2 bg-white/20" />
                <Skeleton className="h-4 w-16 bg-white/20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


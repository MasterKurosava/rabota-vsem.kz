import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export function HeroSkeleton() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-violet-500/10 py-16 md:py-24">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <Skeleton className="mx-auto mb-4 h-12 w-64" />
          <Skeleton className="mx-auto mb-8 h-6 w-96" />
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Skeleton className="h-12 w-48" />
            <Skeleton className="h-12 w-48" />
          </div>
        </div>
      </div>
    </section>
  );
}


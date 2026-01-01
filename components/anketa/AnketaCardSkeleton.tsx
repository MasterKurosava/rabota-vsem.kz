import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function AnketaCardSkeleton() {
  return (
    <Card className="flex h-full flex-col border-2 border-border/50 bg-surface shadow-sm">
      <CardHeader className="pb-4 pt-6">
        {/* Avatar and Name */}
        <div className="mb-4 flex items-start gap-4">
          <Skeleton className="h-14 w-14 shrink-0 rounded-full" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>

        {/* Title */}
        <Skeleton className="h-5 w-full" />
      </CardHeader>

      <CardContent className="flex-1 space-y-4 pb-6">
        {/* Description */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        {/* Location */}
        <Skeleton className="h-4 w-32" />
      </CardContent>

      <CardFooter className="flex gap-3 border-t border-border/50 pt-5 pb-6">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 flex-1" />
      </CardFooter>
    </Card>
  );
}


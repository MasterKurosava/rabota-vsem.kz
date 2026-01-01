"use client";

import { Star } from "lucide-react";

interface ReviewItemProps {
  rating: number;
  text: string;
  createdAt?: string | Date;
}

export function ReviewItem({ rating, text, createdAt }: ReviewItemProps) {
  const formatDate = (date?: string | Date) => {
    if (!date) return null;
    const d = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(d);
  };

  const dateStr = formatDate(createdAt);

  return (
    <div className="rounded-lg border-2 border-border/50 bg-surface-muted/30 p-5 shadow-sm hover:shadow-md transition-shadow">
      {/* Author + Date hierarchy */}
      <div className="mb-3 flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {dateStr && (
              <span className="text-xs text-foreground-muted">•</span>
            )}
            {dateStr && (
              <span className="text-xs text-foreground-muted">{dateStr}</span>
            )}
          </div>
        </div>
        {/* Rating - clearly visible */}
        <div className="flex items-center gap-1 shrink-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < Math.floor(rating)
                  ? "fill-yellow-500 text-yellow-500"
                  : i < rating
                  ? "fill-yellow-500/50 text-yellow-500/50"
                  : "fill-transparent text-gray-300 dark:text-gray-600"
              }`}
            />
          ))}
          <span className="ml-1 text-sm font-bold text-foreground">
            {rating.toFixed(1)}
          </span>
        </div>
      </div>
      {/* Review text */}
      <p className="text-sm leading-relaxed text-foreground-secondary whitespace-pre-line">
        {text}
      </p>
    </div>
  );
}


"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { Sparkles } from "lucide-react";

interface CategoryCardProps {
  category: {
    id: string;
    nameRu: string;
    nameEn: string;
    nameKk: string;
    filterTag: string;
    imageUrl: string;
  };
  count: number;
  label: string;
  vacanciesText: string;
  href: string;
}

export function CategoryCard({
  category,
  count,
  label,
  vacanciesText,
  href,
}: CategoryCardProps) {
  const [imageError, setImageError] = useState(false);
  const imageUrl = category.imageUrl;
  const Icon = Sparkles; // Default icon, can be enhanced later

  return (
    <Link href={href} className="group block h-full">
      <Card
        className="card-hover relative h-full overflow-hidden border-0 bg-gradient-to-br from-primary/20 via-violet-500/20 to-primary/30 shadow-md transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-xl"
        style={{
          minHeight: "200px",
          transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {!imageError && (
          <img
            src={imageUrl}
            alt={label}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-200 ease-out group-hover:scale-105"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        )}
        
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-transparent transition-opacity duration-200 group-hover:from-black/85 group-hover:via-black/50"
        />
        
        <div className="absolute right-4 top-4 z-10 transition-all duration-200 group-hover:scale-110">
          <Icon 
            className="h-7 w-7 text-white transition-all duration-200"
            style={{
              filter: `drop-shadow(0 0 8px currentColor) drop-shadow(0 0 16px currentColor)`,
              opacity: 0.8,
            }}
            strokeWidth={2}
          />
        </div>
        
        <CardContent className="relative flex h-full flex-col justify-end p-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white drop-shadow-lg">
              {label}
            </h3>
            <div className="flex items-center gap-1.5 text-sm text-white/90">
              <span>{count}</span>
              <span>{vacanciesText}</span>
              <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}


"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import {
  Card, CardContent, CardFooter, CardHeader
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin, ArrowRight, Star, User, MessageCircle, CheckCircle2
} from "lucide-react";

import { useAnketaCard } from "@/hooks/useAnketaCard";
import { formatRating, getCategoryName } from "@/lib/utils/anketa";
import { ContactModal } from "./ContactModal";
import type { Anketa, City, Category } from "@prisma/client";

interface AnketaCardProps {
  anketa: Anketa & {
    city: City;
    category: Category;
    user: {
      id: string;
      name: string;
      phone?: string | null;
      email?: string | null;
      rating?: number | null;
    };
  };
  whatsappNumber?: string | null;
}

export function AnketaCard({ anketa, whatsappNumber }: AnketaCardProps) {
  const t = useTranslations("anketas");
  const locale = useLocale() as "ru" | "en" | "kk";
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

  const { cityName, shortTitle, hasContact } = useAnketaCard({
    anketa,
    whatsappNumber,
  });

  const rating = anketa.user.rating;

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target instanceof HTMLElement && e.target.closest("button, a")) return;
    router.push(`/anketas/${anketa.id}`);
  };

  return (
    <>
      <Card
        onClick={handleCardClick}
        className="group flex h-full flex-col cursor-pointer
        border border-border/60 bg-surface shadow-sm
        hover:border-primary/40 hover:shadow-lg
        transition-all duration-300 rounded-2xl"
      >
        {/* HEADER */}
        <CardHeader className="pb-3 pt-5">
          <div className="flex items-start gap-4">
            
            {/* Avatar */}
            <div className="flex h-14 w-14 shrink-0 items-center justify-center
            rounded-full bg-gradient-to-br from-primary/15 to-violet-500/20
            ring-1 ring-primary/30 group-hover:ring-primary/50 transition-all">
              <User className="h-7 w-7 text-primary" />
            </div>

            <div className="flex flex-col gap-1.5 min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-lg font-bold truncate leading-tight">
                  {anketa.user.name}
                </h3>

                <Badge
                  variant="outline"
                  className="text-xs px-2 py-0.5 flex items-center gap-1
                  bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700
                  text-green-700 dark:text-green-300"
                >
                  <CheckCircle2 className="h-3 w-3" /> {t("verified")}
                </Badge>
              </div>

              {/* Rating */}
              {rating && (
                <div className="flex items-center gap-1.5">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(rating)
                            ? "fill-yellow-500 text-yellow-500"
                            : i < rating
                            ? "fill-yellow-500/50 text-yellow-500/50"
                            : "fill-none text-gray-300 dark:text-gray-600"
                        }`}
                      />
                    ))}
                  </div>

                  <span className="text-sm font-semibold text-foreground/90">
                    {formatRating(rating)}
                  </span>
                </div>
              )}

              <Badge
                variant="outline"
                className="w-fit text-xs mt-0.5
                bg-surface-muted border-border/60"
              >
                {getCategoryName(anketa.category, locale)}
              </Badge>
            </div>
          </div>
        </CardHeader>

        {/* CONTENT */}
        <CardContent className="flex-1 space-y-2.5">
          <h4 className="text-base font-semibold leading-snug line-clamp-2">
            {shortTitle}
          </h4>

          <p className="text-sm text-foreground-secondary line-clamp-3 whitespace-pre-line">
            {anketa.description}
          </p>
        </CardContent>

        {/* FOOTER */}
        <CardFooter className="flex flex-col gap-3 border-t border-border/60 py-4">
          <div className="flex items-center gap-2 text-sm text-foreground-secondary w-full">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="font-medium truncate">{cityName}</span>

            {anketa.address && (
              <>
                <span>•</span>
                <span className="truncate text-xs">{anketa.address}</span>
              </>
            )}
          </div>

          <div className="flex gap-3 w-full">
            {hasContact && (
              <Button
                className="flex-1 gap-2 bg-[#25D366] hover:bg-[#1FB058]
                font-semibold text-white shadow-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setModalOpen(true);
                }}
              >
                <MessageCircle className="h-4 w-4" />
                {t("contact")}
              </Button>
            )}

            <Button
              asChild
              variant="outline"
              className="flex-1 border-2 hover:border-primary/50"
              onClick={(e) => e.stopPropagation()}
            >
              <a href={`/anketas/${anketa.id}`} className="flex gap-2 items-center justify-center">
                {t("viewDetails")}
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </CardFooter>
      </Card>

      <ContactModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        name={anketa.user.name}
        phone={anketa.user.phone}
        email={anketa.user.email}
        whatsappNumber={whatsappNumber}
        profileUrl={`/anketas/${anketa.id}`}
      />
    </>
  );
}

"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import { Edit, Eye, Trash2, Star, MapPin, Tag, Calendar, FileText, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getCategoryName, getCityName } from "@/lib/utils/anketa";
import type { City } from "@prisma/client";
import type { Locale } from "@/i18n";

interface AnketaListProps {
  anketa: any[];
  onDelete?: (id: string) => void;
}

export function AnketaList({ anketa, onDelete }: AnketaListProps) {
  const t = useTranslations("anketa");
  const locale = useLocale() as Locale;

  const Status = ({ active }: { active: boolean }) => (
    <Badge
      className={cn(
        "rounded-full px-2 py-0.5 text-xs",
        active
          ? "bg-emerald-100 text-emerald-700 border-emerald-200"
          : "bg-amber-100 text-amber-700 border-amber-200"
      )}
    >
      {active ? t("published") : t("draft")}
    </Badge>
  );

  if (!anketa || anketa.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="rounded-full bg-primary/10 p-6 mb-6">
          <FileText className="h-12 w-12 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-2">{t("noAnketas")}</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          {t("noAnketasDescription")}
        </p>
        <Button asChild size="lg" className="gap-2">
          <Link href="/account/anketa/new">
            <Plus className="h-5 w-5" />
            {t("createFirstAnketa")}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {anketa.map((item) => (
        <div
          key={item.id}
          className="rounded-2xl border bg-card shadow-sm hover:shadow-md transition p-5"
        >
          {/* HEADER */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-semibold text-xl truncate">
                {item.title}
              </h3>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Status active={item.isActive} />

                {item.user?.rating > 0 && (
                  <Badge variant="outline" className="gap-1 text-amber-600 border-amber-300/60">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    {item.user.rating.toFixed(1)}
                  </Badge>
                )}

                <Badge variant="secondary" className="gap-1">
                  <MapPin className="h-3 w-3" />
                  {getCityName(item.city, locale)}
                </Badge>

                <Badge variant="secondary" className="gap-1">
                  <Tag className="h-3 w-3" />
                  {getCategoryName(item.category, locale as "ru" | "en" | "kk")}
                </Badge>
              </div>

<p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
  <Calendar className="h-3 w-3" />
  {formatDistanceToNow(new Date(item.updatedAt), {
    addSuffix: true,
    locale: locale === "ru" ? ru : undefined,
  })}
</p>

            </div>
          </div>

          {/* DESCRIPTION */}
          {item.description && (
            <p className="text-sm text-muted-foreground whitespace-pre-line">
              {item.description}
            </p>
          
          )}

          {/* ACTIONS */}
          <div className="mt-5 flex flex-col sm:flex-row gap-2">
            <Button asChild className="flex-1">
              <Link href={`/anketas/${item.id}`}>
                <Eye className="h-4 w-4 mr-1" />
                {t("view")}
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="flex-1"
            >
              <Link href={`/account/anketa/${item.id}/edit`}>
                <Edit className="h-4 w-4 mr-1" />
                {t("edit")}
              </Link>
            </Button>

            <Button
              variant="destructive"
              className="flex-1 gap-2"
              onClick={() => onDelete?.(item.id)}
            >
              <Trash2 className="h-4 w-4" />
              {t("delete")}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

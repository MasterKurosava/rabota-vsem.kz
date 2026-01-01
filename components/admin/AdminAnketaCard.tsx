"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCategoryName } from "@/lib/utils/anketa";
import {
  Eye,
  EyeOff,
  Trash2,
  ExternalLink,
  User,
  MapPin,
  Briefcase,
  Calendar,
  MessageSquare,
  Star,
} from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import Link from "next/link";
import {
  useUpdateAnketaStatus,
  useDeleteAnketa,
  type AdminAnketa,
} from "@/hooks/useAdminAnketas";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AdminAnketaCardProps {
  anketa: AdminAnketa;
}

export function AdminAnketaCard({ anketa }: AdminAnketaCardProps) {
  const t = useTranslations("admin.anketas");
  const locale = useLocale() as "ru" | "en" | "kk";
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const updateStatus = useUpdateAnketaStatus();
  const deleteAnketa = useDeleteAnketa();

  const handleToggleStatus = () => {
    updateStatus.mutate({
      id: anketa.id,
      isActive: !anketa.isActive,
    });
  };

  const handleDelete = () => {
    deleteAnketa.mutate(anketa.id, {
      onSuccess: () => {
        setShowDeleteDialog(false);
      },
    });
  };

  const reviewsCount = anketa._count.comments;
  const userReviewsCount = anketa.user._count.commentsRecv;
  const showRating = userReviewsCount >= 3;

  return (
    <>
      <Card className="overflow-hidden border-2 border-border/50 shadow-sm transition-all hover:shadow-md hover:border-border">
        <CardHeader className="pb-4 space-y-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className="text-lg font-bold truncate">
                  {anketa.title}
                </CardTitle>
                <Badge
                  variant={anketa.isActive ? "default" : "secondary"}
                  className="shrink-0"
                >
                  {anketa.isActive ? t("published") : t("draft")}
                </Badge>
              </div>
              <p className="text-sm text-foreground-secondary line-clamp-2">
                {anketa.description}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Info Grid */}
          <div className="grid gap-3 text-sm">
            {/* User */}
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-foreground-muted shrink-0" />
              <span className="font-medium truncate">{anketa.user.name}</span>
              {showRating && anketa.user.rating && (
                <div className="flex items-center gap-1 ml-auto">
                  <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                  <span className="text-xs font-medium">
                    {anketa.user.rating.toFixed(1)}
                  </span>
                </div>
              )}
            </div>

            {/* Category */}
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-foreground-muted shrink-0" />
              <span className="truncate">
                {getCategoryName(anketa.category, locale)}
              </span>
            </div>

            {/* City */}
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-foreground-muted shrink-0" />
              <span className="truncate">{anketa.city.nameRu}</span>
            </div>

            {/* Date */}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-foreground-muted shrink-0" />
              <span className="text-xs text-foreground-secondary">
                {format(new Date(anketa.createdAt), "d MMMM yyyy", {
                  locale: ru,
                })}
              </span>
            </div>

            {/* Reviews count */}
            {reviewsCount > 0 && (
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-foreground-muted shrink-0" />
                <span className="text-xs text-foreground-secondary">
                  {reviewsCount} {t("reviews", { count: reviewsCount })}
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-border/50">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 gap-2"
              onClick={handleToggleStatus}
              disabled={updateStatus.isPending}
            >
              {anketa.isActive ? (
                <>
                  <EyeOff className="h-4 w-4" />
                  {t("hide")}
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  {t("publish")}
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              asChild
              className="flex-1 gap-2"
            >
              <Link href={`/anketas/${anketa.id}`} target="_blank">
                <ExternalLink className="h-4 w-4" />
                {t("view")}
              </Link>
            </Button>

            <Button
              variant="destructive"
              size="sm"
              className="gap-2"
              onClick={() => setShowDeleteDialog(true)}
              disabled={deleteAnketa.isPending}
            >
              <Trash2 className="h-4 w-4" />
              {t("delete")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("deleteConfirm")}</DialogTitle>
            <DialogDescription>{t("deleteWarning")}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="font-medium">{anketa.title}</p>
            <p className="text-sm text-foreground-secondary">
              {anketa.user.name}
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              {t("cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteAnketa.isPending}
            >
              {deleteAnketa.isPending ? t("deleting") : t("delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

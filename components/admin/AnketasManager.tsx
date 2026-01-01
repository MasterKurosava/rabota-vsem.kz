"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Eye, EyeOff, Search, ExternalLink } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { ru, enUS, kk } from "date-fns/locale";
import Link from "next/link";
import {
  updateAnketaStatusAction,
  deleteAnketaAction,
} from "@/server/actions/admin/anketas";
import { getCategoryName, getCityName } from "@/lib/utils/anketa";
import type { AdminAnketa } from "@/server/queries/admin/anketas";

const localeMap = {
  ru: ru,
  en: enUS,
  kk: kk,
};

interface AnketasManagerProps {
  anketas: AdminAnketa[];
}

export function AnketasManager({ anketas: initialAnketas }: AnketasManagerProps) {
  const t = useTranslations("admin.anketas");
  const locale = useLocale() as "ru" | "en" | "kk";
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [anketas, setAnketas] = useState(initialAnketas);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [anketaToDelete, setAnketaToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const handleDeleteClick = (anketaId: string) => {
    setAnketaToDelete(anketaId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!anketaToDelete) return;

    startTransition(async () => {
      const result = await deleteAnketaAction(anketaToDelete);
      if (result.success) {
        setAnketas(anketas.filter((a) => a.id !== anketaToDelete));
        setDeleteDialogOpen(false);
        setAnketaToDelete(null);
        router.refresh();
      }
    });
  };

  const handleToggleStatus = (anketaId: string, currentStatus: boolean) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("isActive", (!currentStatus).toString());
      const result = await updateAnketaStatusAction(anketaId, formData);
      if (result.success) {
        setAnketas(
          anketas.map((a) =>
            a.id === anketaId ? { ...a, isActive: !currentStatus } : a
          )
        );
        router.refresh();
      }
    });
  };

  const categories = useMemo(() => {
    const uniqueCategories = new Map();
    anketas.forEach((anketa) => {
      if (!uniqueCategories.has(anketa.category.id)) {
        uniqueCategories.set(anketa.category.id, anketa.category);
      }
    });
    return Array.from(uniqueCategories.values());
  }, [anketas]);

  const filteredAnketas = anketas.filter((anketa) => {
    const matchesSearch =
      searchQuery === "" ||
      anketa.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      anketa.user.name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "published" && anketa.isActive) ||
      (statusFilter === "draft" && !anketa.isActive);

    const matchesCategory =
      categoryFilter === "all" || anketa.category.id === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold md:text-4xl">{t("title")}</h1>
        <p className="text-foreground-secondary">{t("subtitle")}</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("searchPlaceholder") || "Поиск по названию или пользователю..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder={t("statusFilter") || "Статус"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allStatuses") || "Все статусы"}</SelectItem>
            <SelectItem value="published">{t("published")}</SelectItem>
            <SelectItem value="draft">{t("draft")}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder={t("categoryFilter") || "Категория"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allCategories") || "Все категории"}</SelectItem>
            {categories.map((category: any) => (
              <SelectItem key={category.id} value={category.id}>
                {getCategoryName(category, locale)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("table.title")}</TableHead>
              <TableHead>{t("table.user")}</TableHead>
              <TableHead>{t("table.category")}</TableHead>
              <TableHead>{t("table.city")}</TableHead>
              <TableHead>{t("table.comments")}</TableHead>
              <TableHead>{t("table.rating")}</TableHead>
              <TableHead>{t("table.status")}</TableHead>
              <TableHead>{t("table.created")}</TableHead>
              <TableHead className="text-right">{t("table.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAnketas && filteredAnketas.length > 0 ? (
              filteredAnketas.map((anketa) => (
                <TableRow key={anketa.id}>
                  <TableCell className="font-medium max-w-xs truncate">
                    {anketa.title}
                  </TableCell>
                  <TableCell>{anketa.user.name}</TableCell>
                  <TableCell>{getCategoryName(anketa.category, locale)}</TableCell>
                  <TableCell>{getCityName(anketa.city, locale)}</TableCell>
                  <TableCell>{anketa._count.comments}</TableCell>
                  <TableCell>{(anketa.user.rating || 0).toFixed(1)}</TableCell>
                  <TableCell>
                    <Badge variant={anketa.isActive ? "default" : "secondary"}>
                      {anketa.isActive ? t("published") : t("draft")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(anketa.createdAt), "dd MMM yyyy", {
                      locale: localeMap[locale],
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="border-green-200 hover:bg-green-50"
                      >
                        <Link href={`/${locale}/anketas/${anketa.id}`} target="_blank">
                          <ExternalLink className="h-4 w-4 text-green-600" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(anketa.id, anketa.isActive)}
                        disabled={isPending}
                        className={anketa.isActive ? "border-blue-200 hover:bg-blue-50" : "border-gray-300 hover:bg-gray-50"}
                      >
                        {anketa.isActive ? (
                          <EyeOff className="h-4 w-4 text-blue-600" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-600" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClick(anketa.id)}
                        disabled={isPending}
                        className="border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                  {searchQuery || statusFilter !== "all" || categoryFilter !== "all"
                    ? t("noResults") || "Анкеты не найдены"
                    : t("noAnketas")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteDialog.title")}</AlertDialogTitle>
            <AlertDialogDescription>{t("deleteDialog.description")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("deleteDialog.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} disabled={isPending}>
              {t("deleteDialog.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}




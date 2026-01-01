"use client";

import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2 } from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from "@/server/actions/admin/categories";
import type { AdminCategory } from "@/server/queries/admin/categories";

interface CategoriesManagerProps {
  categories: AdminCategory[];
}

export function CategoriesManager({ categories: initialCategories }: CategoriesManagerProps) {
  const t = useTranslations("admin.categories");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [categories, setCategories] = useState(initialCategories);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{
    id?: string;
    nameRu: string;
    nameEn: string;
    nameKk: string;
    imageUrl: string;
    filterTag: string;
  } | null>(null);

  const handleDeleteClick = (categoryId: string) => {
    setCategoryToDelete(categoryId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!categoryToDelete) return;

    startTransition(async () => {
      const result = await deleteCategoryAction(categoryToDelete);
      if (result.success) {
        setCategories(categories.filter((c) => c.id !== categoryToDelete));
        setDeleteDialogOpen(false);
        setCategoryToDelete(null);
        router.refresh();
      }
    });
  };

  const handleCreateClick = () => {
    setEditingCategory({
      nameRu: "",
      nameEn: "",
      nameKk: "",
      imageUrl: "",
      filterTag: "",
    });
    setEditDialogOpen(true);
  };

  const handleEditClick = (category: AdminCategory) => {
    setEditingCategory({
      id: category.id,
      nameRu: category.nameRu,
      nameEn: category.nameEn,
      nameKk: category.nameKk,
      imageUrl: category.imageUrl,
      filterTag: category.filterTag,
    });
    setEditDialogOpen(true);
  };

  const handleSaveCategory = () => {
    if (!editingCategory) return;

    startTransition(async () => {
      const formData = new FormData();
      formData.append("nameRu", editingCategory.nameRu);
      formData.append("nameEn", editingCategory.nameEn);
      formData.append("nameKk", editingCategory.nameKk);
      formData.append("imageUrl", editingCategory.imageUrl);
      formData.append("filterTag", editingCategory.filterTag);

      if (editingCategory.id) {
        const result = await updateCategoryAction(editingCategory.id, formData);
        if (result.success) {
          setCategories(
            categories.map((c) =>
              c.id === editingCategory.id ? result.data! : c
            )
          );
          setEditDialogOpen(false);
          setEditingCategory(null);
          router.refresh();
        }
      } else {
        const result = await createCategoryAction(formData);
        if (result.success) {
          setCategories([...categories, result.data!]);
          setEditDialogOpen(false);
          setEditingCategory(null);
          router.refresh();
        }
      }
    });
  };

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold md:text-4xl">{t("title")}</h1>
          <p className="text-foreground-secondary">{t("subtitle")}</p>
        </div>
        <Button onClick={handleCreateClick} disabled={isPending}>
          <Plus className="mr-2 h-4 w-4" />
          {t("createButton")}
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("table.nameRu")}</TableHead>
              <TableHead>{t("table.nameEn")}</TableHead>
              <TableHead>{t("table.nameKk")}</TableHead>
              <TableHead>{t("table.filterTag")}</TableHead>
              <TableHead>{t("table.imageUrl")}</TableHead>
              <TableHead>{t("table.anketas")}</TableHead>
              <TableHead className="text-right">{t("table.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories && categories.length > 0 ? (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.nameRu}</TableCell>
                  <TableCell>{category.nameEn}</TableCell>
                  <TableCell>{category.nameKk}</TableCell>
                  <TableCell className="font-mono text-sm">{category.filterTag}</TableCell>
                  <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                    {category.imageUrl}
                  </TableCell>
                  <TableCell>{category._count.anketa}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditClick(category)}
                        className="border-blue-200 hover:bg-blue-50"
                      >
                        <Edit2 className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClick(category.id)}
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
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                  {t("noCategories")}
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

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingCategory?.id ? t("editDialog.title") : t("createDialog.title")}
            </DialogTitle>
            <DialogDescription>
              {editingCategory?.id ? t("editDialog.description") : t("createDialog.description")}
            </DialogDescription>
          </DialogHeader>
          {editingCategory && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="nameRu">{t("form.nameRu")}</Label>
                <Input
                  id="nameRu"
                  value={editingCategory.nameRu}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, nameRu: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="nameEn">{t("form.nameEn")}</Label>
                <Input
                  id="nameEn"
                  value={editingCategory.nameEn}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, nameEn: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="nameKk">{t("form.nameKk")}</Label>
                <Input
                  id="nameKk"
                  value={editingCategory.nameKk}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, nameKk: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="filterTag">{t("form.filterTag")}</Label>
                <Input
                  id="filterTag"
                  value={editingCategory.filterTag}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, filterTag: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="imageUrl">{t("form.imageUrl")}</Label>
                <Input
                  id="imageUrl"
                  value={editingCategory.imageUrl}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, imageUrl: e.target.value })
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              {t("form.cancel")}
            </Button>
            <Button onClick={handleSaveCategory} disabled={isPending}>
              {t("form.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}




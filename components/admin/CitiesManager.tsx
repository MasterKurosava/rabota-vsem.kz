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
import { Badge } from "@/components/ui/badge";
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
import { Switch } from "@/components/ui/switch";
import {
  createCityAction,
  updateCityAction,
  deleteCityAction,
} from "@/server/actions/admin/cities";
import type { AdminCity } from "@/server/queries/admin/cities";

interface CitiesManagerProps {
  cities: AdminCity[];
}

export function CitiesManager({ cities: initialCities }: CitiesManagerProps) {
  const t = useTranslations("admin.cities");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [cities, setCities] = useState(initialCities);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cityToDelete, setCityToDelete] = useState<string | null>(null);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<{
    id?: string;
    nameRu: string;
    nameEn: string;
    nameKk: string;
    isActive: boolean;
  } | null>(null);

  const handleDeleteClick = (cityId: string) => {
    setCityToDelete(cityId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!cityToDelete) return;

    startTransition(async () => {
      const result = await deleteCityAction(cityToDelete);
      if (result.success) {
        setCities(cities.filter((c) => c.id !== cityToDelete));
        setDeleteDialogOpen(false);
        setCityToDelete(null);
        router.refresh();
      }
    });
  };

  const handleCreateClick = () => {
    setEditingCity({
      nameRu: "",
      nameEn: "",
      nameKk: "",
      isActive: true,
    });
    setEditDialogOpen(true);
  };

  const handleEditClick = (city: AdminCity) => {
    setEditingCity({
      id: city.id,
      nameRu: city.nameRu,
      nameEn: city.nameEn,
      nameKk: city.nameKk,
      isActive: city.isActive,
    });
    setEditDialogOpen(true);
  };

  const handleSaveCity = () => {
    if (!editingCity) return;

    startTransition(async () => {
      const formData = new FormData();
      formData.append("nameRu", editingCity.nameRu);
      formData.append("nameEn", editingCity.nameEn);
      formData.append("nameKk", editingCity.nameKk);
      formData.append("isActive", editingCity.isActive.toString());

      if (editingCity.id) {
        const result = await updateCityAction(editingCity.id, formData);
        if (result.success) {
          setCities(
            cities.map((c) =>
              c.id === editingCity.id ? result.data! : c
            )
          );
          setEditDialogOpen(false);
          setEditingCity(null);
          router.refresh();
        }
      } else {
        const result = await createCityAction(formData);
        if (result.success) {
          setCities([...cities, result.data!]);
          setEditDialogOpen(false);
          setEditingCity(null);
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
              <TableHead>{t("table.anketas")}</TableHead>
              <TableHead>{t("table.status")}</TableHead>
              <TableHead className="text-right">{t("table.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cities && cities.length > 0 ? (
              cities.map((city) => (
                <TableRow key={city.id}>
                  <TableCell className="font-medium">{city.nameRu}</TableCell>
                  <TableCell>{city.nameEn}</TableCell>
                  <TableCell>{city.nameKk}</TableCell>
                  <TableCell>{city._count.anketa}</TableCell>
                  <TableCell>
                    <Badge variant={city.isActive ? "default" : "secondary"}>
                      {city.isActive ? t("active") : t("inactive")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditClick(city)}
                        className="border-blue-200 hover:bg-blue-50"
                      >
                        <Edit2 className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClick(city.id)}
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
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                  {t("noCities")}
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
              {editingCity?.id ? t("editDialog.title") : t("createDialog.title")}
            </DialogTitle>
            <DialogDescription>
              {editingCity?.id ? t("editDialog.description") : t("createDialog.description")}
            </DialogDescription>
          </DialogHeader>
          {editingCity && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="nameRu">{t("form.nameRu")}</Label>
                <Input
                  id="nameRu"
                  value={editingCity.nameRu}
                  onChange={(e) => setEditingCity({ ...editingCity, nameRu: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="nameEn">{t("form.nameEn")}</Label>
                <Input
                  id="nameEn"
                  value={editingCity.nameEn}
                  onChange={(e) => setEditingCity({ ...editingCity, nameEn: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="nameKk">{t("form.nameKk")}</Label>
                <Input
                  id="nameKk"
                  value={editingCity.nameKk}
                  onChange={(e) => setEditingCity({ ...editingCity, nameKk: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="isActive"
                  checked={editingCity.isActive}
                  onCheckedChange={(checked) =>
                    setEditingCity({ ...editingCity, isActive: checked })
                  }
                />
                <Label htmlFor="isActive">{t("form.isActive")}</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              {t("form.cancel")}
            </Button>
            <Button onClick={handleSaveCity} disabled={isPending}>
              {t("form.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}




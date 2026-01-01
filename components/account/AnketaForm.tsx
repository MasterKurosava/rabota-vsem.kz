"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import type { City, Category, Anketa } from "@prisma/client";
import { getCategoryName } from "@/lib/utils/anketa";
import type { Locale } from "@/i18n";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Trash2, MapPin } from "lucide-react";
import { useAnketaForm } from "@/hooks/useAnketaForm";
import { MapPicker } from "@/components/account/MapPicker";

interface AnketaFormProps {
  cities: City[];
  categories: Category[];
  profile?: Anketa & { city: City; category: Category };
}

export function AnketaForm({
  cities,
  categories,
  profile,
}: AnketaFormProps) {
  const t = useTranslations("anketa");
  const tCommon = useTranslations("common");
  const locale = useLocale() as Locale;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    errors,
    showLocation,
    loading,
    error,
    deleteDialogOpen,
    setDeleteDialogOpen,
    handleDelete,
  } = useAnketaForm({ anketa: profile });

  const cityName = (city: City) =>
    locale === "ru" ? city.nameRu : locale === "en" ? city.nameEn : city.nameKk;

  const categoryId = watch("categoryId") ?? "";
  const cityId = watch("cityId") ?? "";

  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl">
          {profile ? t("edit") : t("new")}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* TITLE */}
          <div className="space-y-2">
            <Label htmlFor="title">
              {t("title")} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              {...register("title")}
              placeholder={t("titlePlaceholder")}
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-2">
            <Label htmlFor="description">
              {t("description")} <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              rows={7}
              {...register("description")}
              placeholder={t("descriptionPlaceholder")}
            />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>

          {/* CATEGORY */}
          <div className="space-y-2">
            <Label>{t("category")} <span className="text-destructive">*</span></Label>
            <Select value={categoryId} onValueChange={(v) => setValue("categoryId", v)}>
              <SelectTrigger>
                <SelectValue placeholder={t("selectCategory")} />
              </SelectTrigger>
              <SelectContent>
                {categories.map(c => (
                  <SelectItem key={c.id} value={c.id}>{getCategoryName(c, locale)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoryId && <p className="text-sm text-destructive">{errors.categoryId.message}</p>}
          </div>

          {/* CITY */}
          <div className="space-y-2">
            <Label>{t("city")} <span className="text-destructive">*</span></Label>
            <Select value={cityId} onValueChange={(v) => setValue("cityId", v)}>
              <SelectTrigger>
                <SelectValue placeholder={t("selectCity")} />
              </SelectTrigger>
              <SelectContent>
                {cities.map(c => (
                  <SelectItem key={c.id} value={c.id}>{cityName(c)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.cityId && <p className="text-sm text-destructive">{errors.cityId.message}</p>}
          </div>

          {/* ADDRESS FIELD */}
          <div className="space-y-2">
            <Label>
              {t("address")} <span className="text-foreground-muted">({t("optional")})</span>
            </Label>
            <Input
              id="address"
              {...register("address")}
              placeholder={t("addressPlaceholder")}
            />
          </div>

          {/* MAP SWITCH */}
          <div className="flex items-center gap-3 rounded-lg border bg-surface-muted p-4">
            <input type="checkbox" id="showLocation" {...register("showLocation")} />
            <Label htmlFor="showLocation" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" /> {t("showLocation")}
            </Label>
          </div>

          {/* MAP PICKER */}
          {showLocation && (
            <div className="space-y-2">
              <Label>{t("locationOnMap")} ({t("optional")})</Label>

              <MapPicker
                value={{
                  lat: watch("latitude") ?? undefined,
                  lng: watch("longitude") ?? undefined,
                }}
                onChange={({ lat, lng }) => {
                  setValue("latitude", lat);
                  setValue("longitude", lng);
                }}
              />

              <p className="text-xs text-foreground-secondary">
                {t("mapHint")}
              </p>
            </div>
          )}

          {/* ACTIVE */}
          <div className="flex items-center gap-3 rounded-lg border bg-surface-muted p-4">
            <input type="checkbox" id="isActive" {...register("isActive")} />
            <Label htmlFor="isActive">{t("isActive")}</Label>
          </div>

          {/* FORM ERROR */}
          {error && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? tCommon("loading") : t("save")}
            </Button>

            <Button asChild variant="outline">
              <Link href="/account/anketa">{tCommon("cancel")}</Link>
            </Button>

            {profile && (
              <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    {t("delete")}
                  </Button>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t("deleteConfirm")}</DialogTitle>
                    <DialogDescription>
                      {t("deleteConfirmDescription")}
                    </DialogDescription>
                  </DialogHeader>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                      {tCommon("cancel")}
                    </Button>
                    <Button variant="destructive" onClick={handleDelete}>
                      <Trash2 className="h-4 w-4 mr-2" /> {t("delete")}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

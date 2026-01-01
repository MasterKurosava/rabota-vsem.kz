"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { updateSettingsAction } from "@/server/actions/settings";
import { toast } from "sonner";
import type { AdminSettings } from "@/server/queries/admin/settings";

// Dynamically import MapPicker to avoid SSR issues
const OfficeMapPicker = dynamic(
  () => import("./OfficeMapPicker").then((mod) => ({ default: mod.OfficeMapPicker })),
  { ssr: false }
);

interface SettingsManagerProps {
  settings: AdminSettings;
}

export function SettingsManager({ settings: initialSettings }: SettingsManagerProps) {
  const t = useTranslations("admin.settings");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [settings] = useState(initialSettings);

  const [formData, setFormData] = useState({
    phone: "",
    whatsappNumber: "",
    addressRu: "",
    addressEn: "",
    addressKk: "",
    mapEmbedUrl: "",
    officeLat: "",
    officeLng: "",
  });

  useEffect(() => {
    if (!settings) return;

    let ru = "", en = "", kk = "";

    if (settings.address) {
      try {
        const parsed = JSON.parse(settings.address);
        ru = parsed.ru || "";
        en = parsed.en || "";
        kk = parsed.kk || "";
      } catch {
        ru = settings.address;
      }
    }

    setFormData({
      phone: settings.phone || "",
      whatsappNumber: settings.whatsappNumber || "",
      addressRu: ru,
      addressEn: en,
      addressKk: kk,
      mapEmbedUrl: settings.mapEmbedUrl || "",
      officeLat: settings.officeLat?.toString() || "",
      officeLng: settings.officeLng?.toString() || "",
    });
  }, [settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const formDataObj = new FormData();
      formDataObj.append("phone", formData.phone || "");
      formDataObj.append("whatsappNumber", formData.whatsappNumber || "");
      formDataObj.append(
        "address",
        JSON.stringify({
          ru: formData.addressRu || "",
          en: formData.addressEn || "",
          kk: formData.addressKk || "",
        })
      );
      formDataObj.append("mapEmbedUrl", formData.mapEmbedUrl || "");
      formDataObj.append("officeLat", formData.officeLat || "");
      formDataObj.append("officeLng", formData.officeLng || "");

      const result = await updateSettingsAction(formDataObj);
      if (result.success) {
        toast.success(t("saveSuccess"));
        router.refresh();
      } else {
        toast.error(t("saveError") || "Ошибка при сохранении");
      }
    });
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-foreground-secondary">{t("subtitle")}</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        {/* CONTACT */}
        <Card>
          <CardHeader>
            <CardTitle>{t("contactInfo.title")}</CardTitle>
            <CardDescription>{t("contactInfo.description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>{t("form.phone")}</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>{t("form.whatsapp")}</Label>
              <Input
                value={formData.whatsappNumber}
                onChange={(e) =>
                  setFormData({ ...formData, whatsappNumber: e.target.value })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* ADDRESS (3 languages) */}
        <Card>
          <CardHeader>
            <CardTitle>{t("address.title")}</CardTitle>
            <CardDescription>{t("address.multiLangDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Адрес (RU)</Label>
              <Input
                value={formData.addressRu}
                onChange={(e) =>
                  setFormData({ ...formData, addressRu: e.target.value })
                }
                placeholder="ул. Абая 10, Алматы"
              />
            </div>
            <div className="grid gap-2">
              <Label>Address (EN)</Label>
              <Input
                value={formData.addressEn}
                onChange={(e) =>
                  setFormData({ ...formData, addressEn: e.target.value })
                }
                placeholder="10 Abay St, Almaty"
              />
            </div>
            <div className="grid gap-2">
              <Label>Мекен-жай (KK)</Label>
              <Input
                value={formData.addressKk}
                onChange={(e) =>
                  setFormData({ ...formData, addressKk: e.target.value })
                }
                placeholder="Абая 10, Алматы"
              />
            </div>
          </CardContent>
        </Card>

        {/* MAP */}
        <Card>
          <CardHeader>
            <CardTitle>{t("mapSettings.title")}</CardTitle>
            <CardDescription>{t("mapSettings.description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Выбор местоположения на карте</Label>
              <OfficeMapPicker
                lat={formData.officeLat ? parseFloat(formData.officeLat) : null}
                lng={formData.officeLng ? parseFloat(formData.officeLng) : null}
                onCoordsChange={(lat, lng) => {
                  setFormData({
                    ...formData,
                    officeLat: lat.toString(),
                    officeLng: lng.toString(),
                  });
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Latitude</Label>
                <Input
                  type="number"
                  step="any"
                  value={formData.officeLat}
                  onChange={(e) =>
                    setFormData({ ...formData, officeLat: e.target.value })
                  }
                  placeholder="43.238949"
                />
              </div>
              <div className="grid gap-2">
                <Label>Longitude</Label>
                <Input
                  type="number"
                  step="any"
                  value={formData.officeLng}
                  onChange={(e) =>
                    setFormData({ ...formData, officeLng: e.target.value })
                  }
                  placeholder="76.889709"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Map Embed URL (опционально)</Label>
              <Input
                value={formData.mapEmbedUrl}
                onChange={(e) =>
                  setFormData({ ...formData, mapEmbedUrl: e.target.value })
                }
                placeholder="https://www.google.com/maps/embed?pb=..."
              />
              <p className="text-xs text-foreground-muted">
                Если указан, будет использоваться вместо интерактивной карты
              </p>
            </div>
          </CardContent>
        </Card>

        {/* ACTIONS */}
        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            type="button"
            onClick={() => router.refresh()}
          >
            {t("form.reset")}
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? t("form.saving") : t("form.save")}
          </Button>
        </div>
      </form>
    </>
  );
}


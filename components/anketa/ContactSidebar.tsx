"use client";

import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Phone, Copy, Shield, CheckCircle2, Mail, MapPin } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { formatRating } from "@/lib/utils/anketa";
import { formatPhone } from "@/lib/utils/phone";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { Check } from "lucide-react";
import { MapViewer } from "./MapViewer";
import type { Locale } from "@/i18n";

interface ContactSidebarProps {
  name: string;
  rating?: number | null;
  categoryName: string;
  phone?: string | null;
  email?: string | null;
  whatsappNumber?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  showLocation?: boolean;
  cityName?: string;
  locale: Locale;
}

export function ContactSidebar({
  name,
  rating,
  categoryName,
  phone,
  email,
  whatsappNumber,
  address,
  latitude,
  longitude,
  showLocation,
  cityName,
  locale,
}: ContactSidebarProps) {
  const t = useTranslations("anketas");
  const { copy, copiedField } = useCopyToClipboard();

  const contactPhone = whatsappNumber || phone;
  const whatsappLink = contactPhone
    ? buildWhatsAppLink({
        phone: contactPhone,
        text: t("whatsappMessage"),
        locale,
      })
    : "#";

  return (
    <Card className="sticky top-24 border-2 border-primary/20 shadow-xl bg-gradient-to-br from-surface to-surface-muted/50">
      <CardHeader className="pb-4 border-b border-border/50">
        <CardTitle className="text-xl font-bold">{name}</CardTitle>
        {rating && (
          <p className="text-base font-semibold text-foreground mt-1">
            {formatRating(rating)} ⭐
          </p>
        )}
        <Badge
          variant="outline"
          className="w-fit text-xs text-foreground-secondary mt-2"
        >
          {categoryName}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-5 pt-6">
        {/* PRIMARY CTA: WhatsApp - Strongest element */}
        {contactPhone && (
          <div className="space-y-3">
            <Button
              asChild
              size="lg"
              className="w-full gap-3 h-14 bg-gradient-to-r from-[#25D366] to-[#20BA5A] font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] text-base"
            >
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center"
              >
                <MessageCircle className="h-6 w-6" />
                {t("contactWhatsApp")}
              </a>
            </Button>
            
            {/* Reassurance text */}
            <div className="flex items-center gap-2 text-xs text-foreground-muted justify-center">
              <Shield className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
              <span>{t("safeBadge")} {t("officialEmploymentBadge")}</span>
            </div>
          </div>
        )}

        {/* SECONDARY: Phone */}
        {contactPhone && (
          <div className="pt-2 border-t border-border/50">
            <a
              href={`tel:${contactPhone.replace(/\s/g, "")}`}
              className="group flex items-center gap-4 p-4 rounded-xl bg-surface-muted/50 hover:bg-surface-muted transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2"
            >
              {/* Icon */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              
              {/* Label + Value */}
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-foreground-muted mb-1">
                  {t("phone")}
                </div>
                <div className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {formatPhone(contactPhone)}
                </div>
              </div>
              
              {/* Action Button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  copy(contactPhone, "phone");
                }}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border/50 bg-surface hover:bg-surface-muted hover:border-primary/30 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2"
                title={copiedField === "phone" ? t("copied") : t("copy")}
              >
                {copiedField === "phone" ? (
                  <Check className="h-5 w-5 text-green-600 animate-in fade-in zoom-in duration-200" />
                ) : (
                  <Copy className="h-4 w-4 text-foreground-secondary group-hover:text-foreground transition-colors" />
                )}
              </button>
            </a>
          </div>
        )}

        {/* SECONDARY: Email */}
        {email && (
          <div className="pt-2 border-t border-border/50">
            <a
              href={`mailto:${email}`}
              className="group flex items-center gap-4 p-4 rounded-xl bg-surface-muted/50 hover:bg-surface-muted transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2"
            >
              {/* Icon */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              
              {/* Label + Value */}
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-foreground-muted mb-1">
                  {t("email")}
                </div>
                <div className="text-base font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                  {email}
                </div>
              </div>
              
              {/* Action Button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  copy(email, "email");
                }}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border/50 bg-surface hover:bg-surface-muted hover:border-primary/30 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2"
                title={copiedField === "email" ? t("copied") : t("copy")}
              >
                {copiedField === "email" ? (
                  <Check className="h-5 w-5 text-green-600 animate-in fade-in zoom-in duration-200" />
                ) : (
                  <Copy className="h-4 w-4 text-foreground-secondary group-hover:text-foreground transition-colors" />
                )}
              </button>
            </a>
          </div>
        )}

        {!contactPhone && !email && (
          <div className="text-center py-4">
            <p className="text-sm text-foreground-secondary">
              {t("contactNotAvailable")}
            </p>
          </div>
        )}

        {/* Address and Map */}
        {(address || (showLocation && latitude && longitude)) && (
          <div className="pt-4 border-t border-border/50 space-y-4">
            {/* Address */}
            {address && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-surface-muted/50">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-foreground-muted mb-1">
                    Адрес
                  </div>
                  <div className="text-sm font-medium text-foreground">
                    {cityName && <span className="font-semibold">{cityName}, </span>}
                    {address}
                  </div>
                </div>
              </div>
            )}

            {/* Map */}
            {showLocation && latitude && longitude && (
              <div className="rounded-xl overflow-hidden border border-border/50 shadow-sm">
                <MapViewer
                  latitude={latitude}
                  longitude={longitude}
                  className="w-full h-[240px] rounded-xl"
                />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}


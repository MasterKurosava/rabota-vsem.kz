"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { formatPhone } from "@/lib/utils/phone";
import { MessageCircle, MapPin, Phone } from "lucide-react";

interface FooterProps {
  settings?: {
    phone?: string | null;
    address?: string | null;
    whatsappNumber?: string | null;
    mapEmbedUrl?: string | null;
  } | null;
}

export function Footer({ settings }: FooterProps) {
  const t = useTranslations("footer");
  const locale = useLocale() as "ru" | "en" | "kk";

  const whatsappLink = settings?.whatsappNumber
    ? buildWhatsAppLink({
        phone: settings.whatsappNumber,
        text: t("whatsappMessage"),
        locale,
      })
    : "#";

  // Parse address if it's JSON
  let addressText: string | null = null;
  if (settings?.address) {
    try {
      const parsed = JSON.parse(settings.address);
      addressText =
        parsed[locale] || parsed.ru || parsed.en || parsed.kk || settings.address;
    } catch {
      addressText = settings.address;
    }
  }

  return (
    <footer className="relative mt-auto border-t border-border/40 bg-gradient-to-b from-surface to-surface-muted/30">
      <div className="container">
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">

  {/* LEFT — Brand + Links */}
  <div className="space-y-6">
    {/* Brand */}
    <Link href="/" className="inline-flex items-center gap-2 group">
      <Image
        src="/img/logo.png"
        alt="RabotaVsem"
        width={20}
        height={20}
        className="h-5 w-5 object-contain group-hover:scale-110 transition"
      />
      <span className="text-lg font-bold text-foreground">
        {t("companyName")}
      </span>
    </Link>

    {/* Links */}
    <div>
      <h3 className="text-sm font-semibold text-foreground">
        {t("links")}
      </h3>

      <ul className="mt-3 space-y-2">
        <li><Link href="/about" className="text-sm text-foreground-secondary hover:text-foreground">{t("about")}</Link></li>
        <li><Link href="/contact" className="text-sm text-foreground-secondary hover:text-foreground">{t("contact")}</Link></li>
        <li><Link href={`/${locale}/privacy`} className="text-sm text-foreground-secondary hover:text-foreground">{t("privacy")}</Link></li>
        <li><Link href={`/${locale}/terms`} className="text-sm text-foreground-secondary hover:text-foreground">{t("terms")}</Link></li>
      </ul>
    </div>
  </div>

  {/* CENTER — Contact Card */}
  <div className="space-y-4">
    <h3 className="text-base font-semibold text-foreground">
      {t("contactUs")}
    </h3>

      {/* Phone */}
      {settings?.phone && (
        <a
          href={`tel:${settings.phone.replace(/\s/g, "")}`}
          className="flex items-center gap-3 group"
        >
          <div className="h-9 w-9 flex items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition">
            <Phone className="h-4 w-4 text-primary" />
          </div>
          <span className="text-sm font-medium group-hover:text-primary">
            {formatPhone(settings.phone)}
          </span>
        </a>
      )}

      {/* WhatsApp */}
      {settings?.whatsappNumber && (
        <div className="space-y-1">
          <Button
            asChild
            className="w-fit gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 shadow-sm"
          >
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4" />
              {t("writeWhatsApp")}
            </a>
          </Button>
        </div>
      )}
    </div>

  {/* RIGHT — Address + Map */}
  <div className="space-y-4">
    {addressText && (
      <>
        <h4 className="text-sm font-semibold text-foreground">
          {t("addressTitle", { defaultValue: "Адрес" })}
        </h4>

        <div className="flex items-start gap-2.5 text-sm text-foreground-secondary">
          <MapPin className="h-4 w-4 text-primary mt-0.5" />
          <span className="leading-relaxed">{addressText}</span>
        </div>
      </>
    )}

    {settings?.mapEmbedUrl && (
      <div className="relative rounded-lg border border-border/60 shadow-sm overflow-hidden">
        <iframe
          src={settings.mapEmbedUrl}
          className="w-full h-48"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Location Map"
        />
      </div>
    )}
  </div>
</div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/40 py-6 text-center">
          <p className="text-xs text-foreground-secondary/70">
            © {new Date().getFullYear()} {t("projectName")}. {t("allRightsReserved")}
          </p>
        </div>
      </div>
    </footer>
  );
}

import { getTranslations } from "next-intl/server";
import { getLocalizedMetadata } from "@/lib/seo";
import { getSiteSettings } from "@/server/queries/settings";
import type { Locale } from "@/i18n";
import { MessageCircle, Mail, Phone, Clock, MapPin } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { formatPhone } from "@/lib/utils/phone";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });

  return getLocalizedMetadata(locale, t("title"), t("description"), "/contact");
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  const settings = await getSiteSettings();

  // Parse address if it's JSON
  let addressText: string | null = null;
  if (settings?.address) {
    try {
      const parsed = JSON.parse(settings.address);
      addressText = parsed[locale] || parsed.ru || parsed.en || parsed.kk || settings.address;
    } catch {
      addressText = settings.address;
    }
  }

  return (
    <div className="container max-w-6xl py-12 md:py-20">
      {/* HERO — кратко и по делу */}
      <section className="mb-14 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {t("hero.title")}
        </h1>
        <p className="text-lg text-foreground-secondary max-w-2xl mx-auto leading-relaxed">
          {t("hero.subtitle")}
        </p>
      </section>

      {/* CONTACT METHODS — три главных способа связи */}
      <section className="mb-16">
        <div className="grid md:grid-cols-3 gap-6">
          {/* WhatsApp */}
          {settings?.whatsappNumber && (
            <div className="p-6 rounded-2xl border bg-surface hover:border-primary/40 transition">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">WhatsApp</h3>
                  <p className="text-sm text-foreground-secondary mb-2">
                    {t("methods.whatsapp.description")}
                  </p>
                  <a
                    href={buildWhatsAppLink({
                      phone: settings.whatsappNumber,
                      text: t("methods.whatsapp.message", { defaultValue: "Здравствуйте! Я хочу связаться с вами." }),
                      locale,
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm font-medium"
                  >
                    {formatPhone(settings.whatsappNumber)}
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Email */}
          <div className="p-6 rounded-2xl border bg-surface hover:border-primary/40 transition">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">{t("methods.email.title")}</h3>
                <p className="text-sm text-foreground-secondary mb-2">
                  {t("methods.email.description")}
                </p>
                <a
                  href={`mailto:${t("methods.email.address")}`}
                  className="text-primary hover:underline text-sm font-medium"
                >
                  {t("methods.email.address")}
                </a>
              </div>
            </div>
          </div>

          {/* Phone */}
          {settings?.phone && (
            <div className="p-6 rounded-2xl border bg-surface hover:border-primary/40 transition">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <Phone className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{t("methods.phone.title")}</h3>
                  <p className="text-sm text-foreground-secondary mb-2">
                    {t("methods.phone.description")}
                  </p>
                  <a
                    href={`tel:${settings.phone.replace(/\s/g, "")}`}
                    className="text-primary hover:underline text-sm font-medium"
                  >
                    {formatPhone(settings.phone)}
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FORM + LOCATION */}
      <div className="grid lg:grid-cols-2 gap-12">
        {/* FORM */}
        <div>
          <h2 className="text-3xl font-bold mb-3">{t("form.title")}</h2>
          <p className="text-foreground-secondary mb-6">
            {t("form.subtitle")}
          </p>
          <ContactForm locale={locale} />
        </div>

        {/* LOCATION / HOURS */}
        <div className="space-y-6">
          {/* Working hours */}
          <div className="p-6 rounded-2xl border bg-surface">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">{t("workingHours.title")}</h3>
            </div>
            <p className="text-sm text-foreground-secondary">
              {t("workingHours.schedule")}
            </p>
          </div>

          {/* Office */}
          <div className="p-6 rounded-2xl border bg-surface">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">{t("location.title")}</h3>
            </div>
            <p className="text-sm text-foreground-secondary mb-4">
              {addressText || t("location.address")}
            </p>

            {/* Google Maps */}
            {settings?.mapEmbedUrl ? (
              <div className="h-64 rounded-xl border bg-surface-muted overflow-hidden">
                <iframe
                  src={settings.mapEmbedUrl}
                  className="w-full h-full"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Office Location"
                />
              </div>
            ) : (
              <div className="h-64 rounded-xl border bg-surface-muted flex items-center justify-center">
                <span className="text-foreground-muted text-sm">
                  {t("location.mapPlaceholder")}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

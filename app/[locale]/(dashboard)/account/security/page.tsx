import { getTranslations } from "next-intl/server";
import { getLocalizedMetadata } from "@/lib/seo";
import { SecurityForm } from "@/components/account/SecurityForm";
import type { Locale } from "@/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "account" });

  return getLocalizedMetadata(locale, t("security"), "", "/account/security");
}

export default async function SecurityPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "account" });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-1 text-2xl font-semibold">{t("security")}</h1>
        <p className="text-sm text-foreground-secondary">
          {t("securityDescription")}
        </p>
      </div>
      <SecurityForm />
    </div>
  );
}


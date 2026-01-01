import { getTranslations } from "next-intl/server";
import { requireAdmin } from "@/lib/auth";
import { getLocalizedMetadata } from "@/lib/seo";
import { getAdminSettings } from "@/server/queries/admin/settings";
import { SettingsManager } from "@/components/admin/SettingsManager";
import { AdminLayout } from "@/components/admin/AdminLayout";
import type { Locale } from "@/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin.settings" });

  return getLocalizedMetadata(locale, t("title"), "", "/admin/settings");
}

export default async function AdminSettingsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  await requireAdmin();
  const settings = await getAdminSettings();

  if (!settings) {
    return (
      <AdminLayout>
        <div>Settings not found</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <SettingsManager settings={settings} />
    </AdminLayout>
  );
}

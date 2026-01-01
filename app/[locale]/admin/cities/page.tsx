import { getTranslations } from "next-intl/server";
import { requireAdmin } from "@/lib/auth";
import { getLocalizedMetadata } from "@/lib/seo";
import { getAdminCities } from "@/server/queries/admin/cities";
import { CitiesManager } from "@/components/admin/CitiesManager";
import { AdminLayout } from "@/components/admin/AdminLayout";
import type { Locale } from "@/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin.cities" });

  return getLocalizedMetadata(locale, t("title"), "", "/admin/cities");
}

export default async function AdminCitiesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  await requireAdmin();
  const cities = await getAdminCities();

  return (
    <AdminLayout>
      <CitiesManager cities={cities} />
    </AdminLayout>
  );
}

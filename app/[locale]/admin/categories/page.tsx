import { getTranslations } from "next-intl/server";
import { requireAdmin } from "@/lib/auth";
import { getLocalizedMetadata } from "@/lib/seo";
import { getAdminCategories } from "@/server/queries/admin/categories";
import { CategoriesManager } from "@/components/admin/CategoriesManager";
import { AdminLayout } from "@/components/admin/AdminLayout";
import type { Locale } from "@/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin.categories" });

  return getLocalizedMetadata(locale, t("title"), "", "/admin/categories");
}

export default async function AdminCategoriesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  await requireAdmin();
  const categories = await getAdminCategories();

  return (
    <AdminLayout>
      <CategoriesManager categories={categories} />
    </AdminLayout>
  );
}

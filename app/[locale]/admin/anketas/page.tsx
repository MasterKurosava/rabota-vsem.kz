import { getTranslations } from "next-intl/server";
import { requireAdmin } from "@/lib/auth";
import { getLocalizedMetadata } from "@/lib/seo";
import { getAdminAnketas } from "@/server/queries/admin/anketas";
import { AnketasManager } from "@/components/admin/AnketasManager";
import { AdminLayout } from "@/components/admin/AdminLayout";
import type { Locale } from "@/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin.anketas" });

  return getLocalizedMetadata(locale, t("title"), "", "/admin/anketas");
}

export default async function AdminAnketasPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{
    search?: string;
    status?: string;
    categoryId?: string;
    cityId?: string;
  }>;
}) {
  await requireAdmin();
  const filters = await searchParams;
  
  const anketas = await getAdminAnketas({
    search: filters.search,
    status: filters.status as "published" | "draft" | "all" | undefined,
    categoryId: filters.categoryId,
    cityId: filters.cityId,
  });

  return (
    <AdminLayout>
      <AnketasManager anketas={anketas} />
    </AdminLayout>
  );
}

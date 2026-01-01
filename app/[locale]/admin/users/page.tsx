import { getTranslations } from "next-intl/server";
import { requireAdmin } from "@/lib/auth";
import { getLocalizedMetadata } from "@/lib/seo";
import { getAdminUsers } from "@/server/queries/admin/users";
import { UsersManager } from "@/components/admin/UsersManager";
import { AdminLayout } from "@/components/admin/AdminLayout";
import type { Locale } from "@/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin.users" });

  return getLocalizedMetadata(locale, t("title"), "", "/admin/users");
}

export default async function AdminUsersPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{
    search?: string;
    role?: string;
    verification?: string;
  }>;
}) {
  await requireAdmin();
  const { locale } = await params;
  const filters = await searchParams;
  
  const users = await getAdminUsers({
    search: filters.search,
    role: filters.role as "USER" | "ADMIN" | "all" | undefined,
    verification: filters.verification as "verified" | "unverified" | "all" | undefined,
  });

  return (
    <AdminLayout>
      <UsersManager users={users} />
    </AdminLayout>
  );
}

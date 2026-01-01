import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getLocalizedMetadata } from "@/lib/seo";
import { Briefcase, FileText, Users, MapPin, Plus, Settings } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import type { Locale } from "@/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });

  return getLocalizedMetadata(locale, t("title"), "", "/admin");
}

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  await requireAdmin();
  const t = await getTranslations({ locale, namespace: "admin.overview" });

  const [
    publishedAnketas,
    draftAnketas,
    totalAnketas,
    totalUsers,
    cities,
    categories,
  ] = await Promise.all([
    db.anketa.count({ where: { isActive: true } }),
    db.anketa.count({ where: { isActive: false } }),
    db.anketa.count(),
    db.user.count(),
    db.city.count({ where: { isActive: true } }),
    db.category.count(),
  ]);

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold md:text-4xl">{t("title")}</h1>
        <p className="text-foreground-secondary">{t("subtitle")}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {/* Пользователи */}
        <Card className="card-hover border-border shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-foreground-secondary">
                {t("users")}
              </CardTitle>
              <Users className="h-5 w-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{totalUsers}</div>
            <Button asChild variant="ghost" size="sm" className="h-8 p-0 text-xs">
              <Link href={`/${locale}/admin/users`}>{t("manage")}</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Анкеты - Опубликованные */}
        <Card className="card-hover border-border shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-foreground-secondary">
                {t("publishedAnketas")}
              </CardTitle>
              <Briefcase className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{publishedAnketas}</div>
            <Button asChild variant="ghost" size="sm" className="h-8 p-0 text-xs">
              <Link href={`/${locale}/admin/anketas`}>{t("manage")}</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Анкеты - Черновики */}
        <Card className="card-hover border-border shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-foreground-secondary">
                {t("draftAnketas")}
              </CardTitle>
              <FileText className="h-5 w-5 text-warning" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{draftAnketas}</div>
            <Button asChild variant="ghost" size="sm" className="h-8 p-0 text-xs">
              <Link href={`/${locale}/admin/anketas`}>{t("manage")}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Вторая строка статистики */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        {/* Всего анкет */}
        <Card className="card-hover border-border shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-foreground-secondary">
                {t("totalAnketas")}
              </CardTitle>
              <Briefcase className="h-5 w-5 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{totalAnketas}</div>
            <Button asChild variant="ghost" size="sm" className="h-8 p-0 text-xs">
              <Link href="/admin/anketas">{t("manage")}</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Категории */}
        <Card className="card-hover border-border shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-foreground-secondary">
                {t("categories")}
              </CardTitle>
              <Briefcase className="h-5 w-5 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{categories}</div>
            <Button asChild variant="ghost" size="sm" className="h-8 p-0 text-xs">
              <Link href="/admin/categories">{t("manage")}</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Города */}
        <Card className="card-hover border-border shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-foreground-secondary">
                {t("cities")}
              </CardTitle>
              <MapPin className="h-5 w-5 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{cities}</div>
            <Button asChild variant="ghost" size="sm" className="h-8 p-0 text-xs">
              <Link href="/admin/cities">{t("manage")}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">{t("quickActions")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              asChild
              variant="outline"
              className="w-full justify-start gap-2 border-2"
              size="lg"
            >
              <Link href="/admin/users">
                <Users className="h-4 w-4" />
                {t("manageUsers")}
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full justify-start gap-2 border-2"
              size="lg"
            >
              <Link href="/admin/categories">
                <Briefcase className="h-4 w-4" />
                {t("manageCategories")}
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full justify-start gap-2 border-2"
              size="lg"
            >
              <Link href="/admin/cities">
                <MapPin className="h-4 w-4" />
                {t("manageCities")}
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full justify-start gap-2 border-2"
              size="lg"
            >
              <Link href="/admin/settings">
                <Settings className="h-4 w-4" />
                {t("siteSettings")}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

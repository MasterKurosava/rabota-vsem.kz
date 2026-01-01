import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import { AnketaForm } from "@/components/account/AnketaForm";
import { getUserAnketaCount } from "@/server/queries/anketas";
import { getLocalizedMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "anketa" });

  return getLocalizedMetadata(locale, t("new"), "", "/account/anketa/new");
}

export default async function NewAnketaPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const session = await requireAuth();
  const count = await getUserAnketaCount(session.userId);
  if (count >= 3) {
    redirect("/account/anketa");
  }

  const [cities, categories] = await Promise.all([
    db.city.findMany({
      where: { isActive: true },
      orderBy: { nameRu: "asc" },
    }),
    db.category.findMany({
      orderBy: { nameRu: "asc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <AnketaForm cities={cities} categories={categories} />
    </div>
  );
}


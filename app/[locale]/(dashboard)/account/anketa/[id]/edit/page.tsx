import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import { AnketaForm } from "@/components/account/AnketaForm";
import { getLocalizedMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; id: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "anketa" });

  return getLocalizedMetadata(locale, t("edit"), "", "");
}

export default async function EditAnketaPage({
  params,
}: {
  params: Promise<{ locale: Locale; id: string }>;
}) {
  const { locale, id } = await params;
  const session = await requireAuth();
  const t = await getTranslations({ locale, namespace: "anketa" });

  const profile = await db.anketa.findUnique({
    where: { id },
    include: { city: true, category: true },
  });

  if (!profile) {
    notFound();
  }

  if (profile.userId !== session.userId) {
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
      <AnketaForm cities={cities} categories={categories} profile={profile} />
    </div>
  );
}


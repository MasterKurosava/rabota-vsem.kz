import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ProfileForm } from "@/components/account/ProfileForm";
import { getLocalizedMetadata } from "@/lib/seo";
import { getSiteSettings } from "@/server/queries/settings";
import type { Locale } from "@/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "account" });

  return getLocalizedMetadata(locale, t("profile"), "", "/account/profile");
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const session = await requireAuth();
  const t = await getTranslations({ locale, namespace: "account" });

  const [user, settings] = await Promise.all([
    db.user.findUnique({
    where: { id: session.userId },
    }),
    getSiteSettings(),
  ]);

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-1 text-2xl font-semibold">{t("profile")}</h1>
        <p className="text-sm text-foreground-secondary">
          {t("profileDescription")}
        </p>
      </div>
      <ProfileForm user={user} whatsappNumber={settings?.whatsappNumber} />
    </div>
  );
}
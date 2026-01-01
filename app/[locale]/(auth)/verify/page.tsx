import { getTranslations } from "next-intl/server";
import { VerifyForm } from "@/components/auth/VerifyForm";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getLocalizedMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n";
import { ShieldCheck } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth" });

  return getLocalizedMetadata(locale, t("verify"), "", "/verify");
}

export default async function VerifyPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth" });
  const session = await getSession();

  // If already logged in, redirect to account
  if (session) {
    redirect("/account/anketa");
  }

  return (
    <div className="container flex min-h-[calc(100vh-12rem)] items-center justify-center py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-light">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">{t("verify")}</h1>
          <p className="text-foreground-secondary leading-relaxed">
            {t("verifyDescription")}
          </p>
        </div>
        <VerifyForm />
      </div>
    </div>
  );
}

import { getTranslations } from "next-intl/server";
import { EmailVerificationForm } from "@/components/auth/EmailVerificationForm";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getLocalizedMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n";
import { Mail } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth" });

  return getLocalizedMetadata(locale, t("emailVerification"), "", "/verify-email");
}

export default async function VerifyEmailPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ email?: string }>;
}) {
  const { locale } = await params;
  const { email } = await searchParams;
  const t = await getTranslations({ locale, namespace: "auth" });

  if (!email) {
    redirect("/register");
  }

  const { db } = await import("@/lib/db");
  const user = await db.user.findUnique({
    where: { email },
    select: { id: true, emailVerified: true },
  });

  if (!user) {
    redirect("/register");
  }

  if (user.emailVerified) {
    const { createSession } = await import("@/lib/auth");
    await createSession(user.id);
    redirect("/account/anketa");
  }

  return (
    <div className="container flex min-h-[calc(100vh-12rem)] items-center justify-center py-12">
      <div className="w-full max-w-md space-y-6">
        <EmailVerificationForm email={email} />
      </div>
    </div>
  );
}


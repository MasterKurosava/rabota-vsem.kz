import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { AuthPageHeader } from "@/components/auth/AuthPageHeader";
import { getLocalizedMetadata } from "@/lib/seo";
import { getSession } from "@/lib/auth";
import type { Locale } from "@/i18n";
import { RegisterForm } from "@/components/auth/RegisterForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth" });

  return getLocalizedMetadata(locale, t("register"), "", "/register");
}

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const session = await getSession();
  
  // Redirect authenticated users to account page
  if (session) {
    redirect("/account/anketa");
  }

  return (
    <div className="container flex min-h-[calc(100vh-8rem)] items-center justify-center py-8 md:py-12 px-4">
      <div className="w-full max-w-[460px] space-y-8">
        <AuthPageHeader titleKey="register" descriptionKey="registerDescription" />
        <RegisterForm />
      </div>
    </div>
  );
}


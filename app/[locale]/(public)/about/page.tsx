import { getTranslations } from "next-intl/server";
import { getLocalizedMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n";
import {
  Heart,
  Users,
  Shield,
  Sparkles,
  Target,
  Rocket,
  CheckCircle2,
  ArrowRight,
  Quote,
  Zap,
  Eye,
  Handshake
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });

  return getLocalizedMetadata(
    locale,
    t("title"),
    t("description"),
    "/about"
  );
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });

  return (
    <div className="container max-w-5xl py-12 md:py-20">
      {/* Hero Block - Эмоциональный манифест */}
      <section className="mb-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
          <Heart className="h-4 w-4" />
          <span className="text-sm font-medium">{t("hero.badge")}</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
          {t("hero.title")}
        </h1>
        <p className="text-xl md:text-2xl text-foreground-secondary max-w-3xl mx-auto leading-relaxed">
          {t("hero.subtitle")}
        </p>
      </section>

      {/* История рождения проекта */}
      <section className="mb-20">
        <div className="relative">
          <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/50 to-primary/10 rounded-full" />
          <div className="pl-8">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-primary" />
              {t("story.title")}
            </h2>
            <div className="space-y-4 text-lg text-foreground-secondary leading-relaxed">
              <p>{t("story.paragraph1")}</p>
              <p>{t("story.paragraph2")}</p>
              <p className="text-foreground font-medium">{t("story.paragraph3")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Что нас отличает */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold mb-10 text-center">
          {t("difference.title")}
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="group p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/20 transition-all duration-300 border border-primary/20">
            <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">{t("difference.item1.title")}</h3>
            <p className="text-foreground-secondary leading-relaxed">
              {t("difference.item1.description")}
            </p>
          </div>

          <div className="group p-8 rounded-2xl bg-gradient-to-br from-emerald-500/5 to-emerald-500/10 hover:from-emerald-500/10 hover:to-emerald-500/20 transition-all duration-300 border border-emerald-500/20">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Heart className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">{t("difference.item2.title")}</h3>
            <p className="text-foreground-secondary leading-relaxed">
              {t("difference.item2.description")}
            </p>
          </div>

          <div className="group p-8 rounded-2xl bg-gradient-to-br from-blue-500/5 to-blue-500/10 hover:from-blue-500/10 hover:to-blue-500/20 transition-all duration-300 border border-blue-500/20">
            <div className="h-12 w-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">{t("difference.item3.title")}</h3>
            <p className="text-foreground-secondary leading-relaxed">
              {t("difference.item3.description")}
            </p>
          </div>

          <div className="group p-8 rounded-2xl bg-gradient-to-br from-amber-500/5 to-amber-500/10 hover:from-amber-500/10 hover:to-amber-500/20 transition-all duration-300 border border-amber-500/20">
            <div className="h-12 w-12 rounded-xl bg-amber-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Users className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">{t("difference.item4.title")}</h3>
            <p className="text-foreground-secondary leading-relaxed">
              {t("difference.item4.description")}
            </p>
          </div>
        </div>
      </section>

      {/* Команда / Сообщество */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold mb-10 text-center">
          {t("team.title")}
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { num: 1, gradient: "from-blue-500 to-blue-600" },
            { num: 2, gradient: "from-emerald-500 to-emerald-600" },
            { num: 3, gradient: "from-amber-500 to-amber-600" }
          ].map(({ num, gradient }) => (
            <div
              key={num}
              className="group rounded-2xl overflow-hidden border bg-surface shadow-sm hover:shadow-lg transition-all"
            >
              <div className={`relative h-52 overflow-hidden bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                <div className="text-8xl font-bold text-white/20">
                  {t(`team.member${num}.name`).charAt(0)}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2">
                  {t(`team.member${num}.name`)}
                </h3>
                <p className="text-sm text-foreground-secondary mb-3">
                  {t(`team.member${num}.role`)}
                </p>

                <p className="text-sm leading-relaxed">
                  {t(`team.member${num}.quote`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* Ценности через истории */}
      <section className="mb-20 bg-surface-muted rounded-3xl p-8 md:p-12">
        <h2 className="text-3xl font-bold mb-10 text-center">
          {t("values.title")}
        </h2>
        <div className="space-y-8">
          {[
            { num: 1, icon: Zap, color: "from-blue-500/20 to-blue-600/20", iconColor: "text-blue-600" },
            { num: 2, icon: Eye, color: "from-emerald-500/20 to-emerald-600/20", iconColor: "text-emerald-600" },
            { num: 3, icon: Handshake, color: "from-amber-500/20 to-amber-600/20", iconColor: "text-amber-600" }
          ].map(({ num, icon: Icon, color, iconColor }) => (
            <div key={num} className="flex gap-4">
              <div className="flex-shrink-0">
                <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${color} flex items-center justify-center`}>
                  <Icon className={`h-5 w-5 ${iconColor}`} />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  {t(`values.value${num}.title`)}
                </h3>
                <p className="text-foreground-secondary leading-relaxed">
                  {t(`values.value${num}.story`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Кому мы помогаем */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold mb-6 text-center">
          {t("impact.title")}
        </h2>
        <p className="text-xl text-foreground-secondary text-center mb-12 max-w-3xl mx-auto">
          {t("impact.subtitle")}
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((num) => (
            <div key={num} className="text-center p-6 rounded-xl hover:bg-surface-muted transition-colors">
              <div className="text-5xl font-bold text-primary mb-2">
                {t(`impact.stat${num}.number`)}
              </div>
              <div className="text-sm font-medium text-foreground-muted mb-2">
                {t(`impact.stat${num}.label`)}
              </div>
              <p className="text-foreground-secondary text-sm">
                {t(`impact.stat${num}.description`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Социальные доказательства */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold mb-10 text-center">
          {t("trust.title")}
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {[1, 2].map((num) => (
            <div key={num} className="relative p-8 rounded-2xl bg-surface border border-border shadow-sm">
              <Quote className="h-10 w-10 text-primary/20 mb-4" />
              <p className="text-lg mb-6 leading-relaxed italic">
                &ldquo;{t(`trust.testimonial${num}.text`)}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">
                    {t(`trust.testimonial${num}.name`).charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-semibold">{t(`trust.testimonial${num}.name`)}</div>
                  <div className="text-sm text-foreground-muted">
                    {t(`trust.testimonial${num}.role`)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Будущее */}
      <section className="mb-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-12 border border-primary/20">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <Rocket className="h-10 w-10 text-primary" />
              <h2 className="text-3xl font-bold">{t("future.title")}</h2>
            </div>
            <p className="text-xl text-foreground-secondary mb-6 leading-relaxed max-w-2xl">
              {t("future.vision")}
            </p>
            <ul className="space-y-3 max-w-2xl">
              {[1, 2, 3].map((num) => (
                <li key={num} className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground-secondary">
                    {t(`future.goal${num}`)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center">
        <div className="inline-block p-12 rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
          <h2 className="text-3xl font-bold mb-4">{t("cta.title")}</h2>
          <p className="text-xl text-foreground-secondary mb-8 max-w-2xl">
            {t("cta.description")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="gap-2 shadow-lg">
              <Link href="/anketas">
                {t("cta.button1")}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link href="/register">
                {t("cta.button2")}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

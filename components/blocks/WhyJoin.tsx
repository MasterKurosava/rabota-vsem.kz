"use client";

import { useTranslations } from "next-intl";
import { CheckCircle2, Briefcase, TrendingUp, DollarSign, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function WhyJoin() {
  const t = useTranslations("home.whyJoin");

  const features = [
    {
      icon: Briefcase,
      titleKey: "feature1.title",
      descriptionKey: "feature1.description",
    },
    {
      icon: TrendingUp,
      titleKey: "feature2.title",
      descriptionKey: "feature2.description",
    },
    {
      icon: DollarSign,
      titleKey: "feature3.title",
      descriptionKey: "feature3.description",
    },
    {
      icon: Smartphone,
      titleKey: "feature4.title",
      descriptionKey: "feature4.description",
    },
  ];

  return (
    <section className="section-spacing bg-gradient-to-br from-primary/5 via-transparent to-accent/5">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left: Text Content */}
          <div>
            <div className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
              {t("badge")}
            </div>
            <h2 className="mb-4 text-4xl font-bold md:text-5xl">
              {t("title")}
            </h2>
            <p className="mb-8 text-xl text-foreground-secondary">
              {t("subtitle")}
            </p>

            <div className="grid gap-6 sm:grid-cols-2">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="mb-2 text-lg font-semibold">
                        {t(feature.titleKey)}
                      </h3>
                      <p className="text-sm leading-relaxed text-foreground-secondary">
                        {t(feature.descriptionKey)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex justify-center sm:justify-start">
              <Button asChild size="lg" className="h-14 gap-2 px-8 text-base font-semibold">
                <Link href="/login">
                  <Briefcase className="h-5 w-5" />
                  {t("cta")}
                </Link>
              </Button>
            </div>
          </div>

          {/* Right: Image */}
          <div className="relative hidden lg:block">
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-2xl">
              {/* Placeholder for image - можно заменить на реальное изображение */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Briefcase className="mx-auto h-24 w-24 text-primary/30" />
                  <p className="mt-4 text-sm text-foreground-secondary">
                    {t("imagePlaceholder")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


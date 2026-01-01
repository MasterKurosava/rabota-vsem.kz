"use client";

import { useTranslations } from "next-intl";
import { Shield, FileCheck, Handshake, Eye, CheckCircle2 } from "lucide-react";

export function WhyOfficial() {
  const t = useTranslations("home.whyOfficial");

  const benefits = [
    {
      icon: Shield,
      titleKey: "benefit1.title",
      descriptionKey: "benefit1.description",
      highlightKey: "benefit1.highlight",
    },
    {
      icon: FileCheck,
      titleKey: "benefit2.title",
      descriptionKey: "benefit2.description",
      highlightKey: "benefit2.highlight",
    },
    {
      icon: Handshake,
      titleKey: "benefit3.title",
      descriptionKey: "benefit3.description",
      highlightKey: "benefit3.highlight",
    },
    {
      icon: Eye,
      titleKey: "benefit4.title",
      descriptionKey: "benefit4.description",
      highlightKey: "benefit4.highlight",
    },
  ];

  return (
    <section className="section-spacing bg-gradient-to-b from-transparent via-primary/5 to-transparent">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            {t("title")}
          </h2>
          <p className="text-lg leading-relaxed text-foreground-secondary md:text-xl">
            {t("subtitle")}
          </p>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-xl border-2 border-border bg-surface p-6 shadow-md transition-all duration-300 hover:border-primary/50 hover:shadow-lg"
              >
                <div className="absolute right-0 top-0 h-20 w-20 rounded-bl-full bg-primary/5 transition-transform duration-300 group-hover:scale-110" />
                <div className="relative">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold">{t(benefit.titleKey)}</h3>
                  <p className="mb-4 text-sm leading-relaxed text-foreground-secondary">
                    {t(benefit.descriptionKey)}
                  </p>
                  {benefit.highlightKey && (
                    <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>{t(benefit.highlightKey)}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

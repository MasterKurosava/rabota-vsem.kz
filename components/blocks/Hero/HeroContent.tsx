"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageCircle, Briefcase, TrendingUp, Sparkles } from "lucide-react";
import { TrustSignals } from "./TrustSignals";
import { BenefitCard } from "./BenefitCard";
import { useTranslations } from "next-intl";

interface HeroContentProps {
  title: string;
  subtitle: string;
  benefits: string[];
  ctaText: string;
  whatsappLink: string;
  trustSignals: Array<{
    icon: typeof MessageCircle;
    text: string;
  }>;
}

export function HeroContent({
  title,
  subtitle,
  benefits,
  ctaText,
  whatsappLink,
  trustSignals,
}: HeroContentProps) {
  const t = useTranslations("home");

  return (
    <div className="container relative z-10">
      <div className="mx-auto max-w-4xl text-center">
        <TrustSignals signals={trustSignals} />

        <h1
          className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl"
          style={{
            textShadow: "0 2px 20px rgb(var(--primary) / 0.1)",
          }}
        >
          {title}
        </h1>
        <p className="mb-10 text-lg text-foreground-secondary md:text-xl lg:text-2xl">
          {subtitle}
        </p>

        {benefits.length > 0 && (
          <div className="mb-16">
            <h2 className="mb-8 text-2xl font-semibold text-foreground md:text-3xl">
              {t("whyTrustUs") || "Почему нам доверяют"}
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
              {benefits.map((benefit, index) => (
                <BenefitCard key={index} benefit={benefit} index={index} />
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button
            asChild
            size="lg"
            className="group relative h-14 gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-primary to-violet-600 px-8 text-base font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-[0.98]"
          >
            <Link href="/login">
              <div className="absolute inset-0 animate-border-pulse rounded-xl"></div>
              <Briefcase className="relative z-10 h-5 w-5 transition-transform group-hover:scale-110 group-hover:rotate-12" />
              <span className="relative z-10">{t("becomeAnketa")}</span>
              <Sparkles className="absolute right-2 top-2 h-3 w-3 text-white/50" style={{ animation: "iconBounce 2s ease-in-out infinite" }} />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="group h-14 rounded-xl border-2 border-primary/30 bg-surface/80 backdrop-blur-sm px-8 text-base font-semibold transition-all hover:border-primary/60 hover:bg-surface hover:shadow-lg active:scale-[0.98]"
          >
            <Link href="/anketas">
              <Briefcase className="mr-2 h-5 w-5 transition-transform group-hover:scale-110 group-hover:rotate-12" />
              {t("browseAnketas")}
            </Link>
          </Button>
        </div>

        <div className="mt-12 flex items-center justify-center gap-8 opacity-40">
          <TrendingUp className="h-6 w-6 text-primary" style={{ animation: "float 6s ease-in-out infinite", animationDelay: "0s" }} />
          <Briefcase className="h-6 w-6 text-violet-500" style={{ animation: "floatReverse 8s ease-in-out infinite", animationDelay: "1s" }} />
          <Sparkles className="h-6 w-6 text-primary" style={{ animation: "float 6s ease-in-out infinite", animationDelay: "2s" }} />
        </div>
      </div>
    </div>
  );
}


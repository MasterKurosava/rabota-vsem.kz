"use client";

import { AnimatedBackground } from "./AnimatedBackground";
import { HeroContent } from "./HeroContent";
import { useHero } from "@/hooks/useHero";

interface HeroProps {
  whatsappNumber?: string | null;
  homepageTexts?: {
    title?: string;
    subtitle?: string;
    benefits?: string[];
    ctaText?: string;
  } | null;
}

export function Hero({ whatsappNumber, homepageTexts }: HeroProps) {
  const {
    title,
    subtitle,
    benefits,
    ctaText,
    whatsappLink,
    trustSignals,
    jobCards,
  } = useHero({ whatsappNumber, homepageTexts });

  return (
    <section className="relative w-full overflow-hidden py-16 md:py-24">
      <AnimatedBackground jobCards={jobCards} />
      <HeroContent
        title={title}
        subtitle={subtitle}
        benefits={benefits}
        ctaText={ctaText}
        whatsappLink={whatsappLink}
        trustSignals={trustSignals}
      />
    </section>
  );
}


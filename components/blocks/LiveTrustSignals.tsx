"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { CheckCircle2, Star, MessageSquare } from "lucide-react";

export function LiveTrustSignals() {
  const t = useTranslations("home.liveSignals");
  const [counts, setCounts] = useState({ anketas: 0, rating: 0, reviews: 0 });

  useEffect(() => {
    const targetCounts = {
      anketas: 100,
      rating: 4.8,
      reviews: 500,
    };

    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setCounts({
        anketas: Math.floor(targetCounts.anketas * progress),
        rating: Number((targetCounts.rating * progress).toFixed(1)),
        reviews: Math.floor(targetCounts.reviews * progress),
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setCounts(targetCounts);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const signals = [
    {
      icon: CheckCircle2,
      value: `${counts.anketas}+`,
      labelKey: "verifiedLabel",
    },
    {
      icon: Star,
      value: counts.rating.toFixed(1),
      labelKey: "ratingLabel",
    },
    {
      icon: MessageSquare,
      value: `${counts.reviews}+`,
      labelKey: "reviewsLabel",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {signals.map((signal, index) => {
        const Icon = signal.icon;
        return (
          <div
            key={index}
            className="group flex items-center gap-3 rounded-xl border border-border/50 bg-surface/80 backdrop-blur-sm px-5 py-4 shadow-sm transition-all hover:border-primary/30 hover:bg-surface hover:shadow-md"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors duration-200 group-hover:bg-primary/20">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{signal.value}</div>
              <div className="text-xs text-foreground-secondary">{t(signal.labelKey)}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}


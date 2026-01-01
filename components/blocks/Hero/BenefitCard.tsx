"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Shield, Zap, Heart, Star, Clock } from "lucide-react";
import { useMemo } from "react";

interface BenefitCardProps {
  benefit: string;
  index: number;
}

const accentColors = [
  {
    iconBg: "from-blue-500/20 via-blue-400/15 to-cyan-500/20",
    iconRing: "ring-blue-500/30",
    iconColor: "text-blue-500",
    glow: "shadow-blue-500/20",
    hoverGlow: "group-hover:shadow-blue-500/40",
  },
  {
    iconBg: "from-purple-500/20 via-violet-400/15 to-indigo-500/20",
    iconRing: "ring-purple-500/30",
    iconColor: "text-purple-500",
    glow: "shadow-purple-500/20",
    hoverGlow: "group-hover:shadow-purple-500/40",
  },
  {
    iconBg: "from-green-500/20 via-emerald-400/15 to-teal-500/20",
    iconRing: "ring-green-500/30",
    iconColor: "text-green-500",
    glow: "shadow-green-500/20",
    hoverGlow: "group-hover:shadow-green-500/40",
  },
  {
    iconBg: "from-teal-500/20 via-cyan-400/15 to-blue-500/20",
    iconRing: "ring-teal-500/30",
    iconColor: "text-teal-500",
    glow: "shadow-teal-500/20",
    hoverGlow: "group-hover:shadow-teal-500/40",
  },
];

const getIconForBenefit = (benefit: string, index: number) => {
  const lower = benefit.toLowerCase();
  if (
    lower.includes("проверен") || lower.includes("официальн") || lower.includes("надежн") ||
    lower.includes("verified") || lower.includes("official") || lower.includes("trust") || lower.includes("reliable")
  ) {
    return Shield;
  }
  if (
    lower.includes("быстр") || lower.includes("скорост") || lower.includes("мгновенн") ||
    lower.includes("fast") || lower.includes("quick") || lower.includes("speed") || lower.includes("instant")
  ) {
    return Zap;
  }
  if (
    lower.includes("поддержк") || lower.includes("помощь") || lower.includes("забот") ||
    lower.includes("support") || lower.includes("help") || lower.includes("care")
  ) {
    return Heart;
  }
  if (
    lower.includes("качеств") || lower.includes("лучш") || lower.includes("топ") ||
    lower.includes("quality") || lower.includes("best") || lower.includes("top") || lower.includes("premium")
  ) {
    return Star;
  }
  if (
    lower.includes("гибк") || lower.includes("график") || lower.includes("время") ||
    lower.includes("flexible") || lower.includes("schedule") || lower.includes("time")
  ) {
    return Clock;
  }
  return CheckCircle2;
};

export function BenefitCard({ benefit, index }: BenefitCardProps) {
  const accent = useMemo(
    () => accentColors[index % accentColors.length],
    [index]
  );
  
  const Icon = useMemo(
    () => getIconForBenefit(benefit, index),
    [benefit, index]
  );

  return (
    <Card
      className="group relative cursor-pointer overflow-hidden rounded-2xl border-0 bg-gradient-to-br from-surface/90 via-surface/80 to-surface/90 backdrop-blur-sm shadow-md transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary/20"
      style={{
        transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${accent.iconBg} opacity-0 transition-opacity duration-200 group-hover:opacity-100`}
      />
      
      <CardContent className="relative flex flex-col items-center gap-4 p-6 text-center sm:p-8">
        <div
          className={`relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${accent.iconBg} ring-2 ${accent.iconRing} shadow-lg ${accent.glow} transition-all duration-200 group-hover:scale-110 group-hover:shadow-xl ${accent.hoverGlow}`}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent opacity-50" />
          <Icon
            className={`relative z-10 h-7 w-7 ${accent.iconColor} transition-transform duration-200 group-hover:scale-110`}
            strokeWidth={2.5}
          />
        </div>
        
        <span className="relative z-10 text-base font-semibold leading-snug text-foreground transition-colors duration-200 group-hover:text-foreground">
          {benefit}
        </span>
      </CardContent>
    </Card>
  );
}


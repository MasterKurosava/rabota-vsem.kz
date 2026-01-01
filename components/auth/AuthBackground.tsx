"use client";

import { useMemo } from "react";
import { TypingCard } from "@/components/blocks/Hero/TypingCard";

export function AuthBackground() {
  const dots = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      delay: i * 0.4,
      size: 4 + (i % 3) * 2,
      x: (i % 4) * 25,
      y: Math.floor(i / 4) * 20,
    }));
  }, []);

  const jobCards = useMemo(() => {
    const texts = [
      "Уборка квартир",
      "Ремонт техники",
      "Доставка еды",
      "Репетиторство",
      "Дизайн интерьера",
      "Фотография",
    ];
    
    return Array.from({ length: 6 }, (_, i) => ({
      id: i,
      delay: i * 2,
      duration: 20 + (i % 3) * 5,
      size: 120 + (i % 3) * 30,
      x: 10 + (i % 3) * 30,
      y: 15 + Math.floor(i / 3) * 35,
      text: texts[i] || `Услуга ${i + 1}`,
      name: `Анкета ${i + 1}`,
      avatar: "",
      speed: 80 + (i % 3) * 20,
    }));
  }, []);

  return (
    <div className="fixed inset-0 -z-10 w-full overflow-hidden" style={{ contain: "layout style paint" }}>
      {jobCards.map((card) => (
        <TypingCard key={card.id} card={card} />
      ))}

      {dots.map((dot) => (
        <div
          key={dot.id}
          className="absolute rounded-full bg-primary/20"
          style={{
            width: `${dot.size}px`,
            height: `${dot.size}px`,
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            animation: `pulse 3s ease-in-out infinite`,
            animationDelay: `${dot.delay}s`,
            willChange: "opacity, transform",
            transform: "translateZ(0)",
          }}
        />
      ))}

      <svg
        className="absolute inset-0 h-full w-full opacity-20"
        style={{
          zIndex: 0,
          willChange: "opacity",
          transform: "translateZ(0)",
        }}
      >
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgb(var(--primary))" stopOpacity="0.3" />
            <stop offset="100%" stopColor="rgb(139, 92, 246)" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <line
          x1="10%"
          y1="20%"
          x2="90%"
          y2="80%"
          stroke="url(#lineGradient)"
          strokeWidth="2"
          className="animate-fade-in-out"
          style={{ animationDelay: "0s", willChange: "opacity" }}
        />
        <line
          x1="20%"
          y1="80%"
          x2="80%"
          y2="20%"
          stroke="url(#lineGradient)"
          strokeWidth="2"
          className="animate-fade-in-out"
          style={{ animationDelay: "1.5s", willChange: "opacity" }}
        />
      </svg>

      <div
        className="absolute -left-1/4 -top-1/4 h-96 w-96 rounded-full bg-gradient-to-br from-primary/20 to-violet-500/20 blur-3xl"
        style={{
          animation: "driftSlow 25s ease-in-out infinite",
          willChange: "transform",
          transform: "translateZ(0)",
        }}
      />
      <div
        className="absolute -bottom-1/4 -right-1/4 h-96 w-96 rounded-full bg-gradient-to-br from-violet-500/20 to-primary/20 blur-3xl"
        style={{
          animation: "driftSlow 30s ease-in-out infinite reverse",
          willChange: "transform",
          transform: "translateZ(0)",
        }}
      />
    </div>
  );
}


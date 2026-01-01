"use client";

import { useMemo } from "react";
import { TypingCard } from "./TypingCard";

interface JobCard {
  id: number;
  delay: number;
  duration: number;
  size: number;
  x: number;
  y: number;
  text: string;
  name: string;
  avatar: string;
  speed: number;
}

interface AnimatedBackgroundProps {
  jobCards: JobCard[];
}

export function AnimatedBackground({ jobCards }: AnimatedBackgroundProps) {
  const dots = useMemo(() => Array.from({ length: 12 }, (_, i) => ({
    id: i,
    delay: i * 0.4,
    size: 4 + (i % 3) * 2,
    x: (i % 4) * 25,
    y: Math.floor(i / 4) * 20,
  })), []);

  return (
    <div className="absolute inset-0 w-full overflow-hidden" style={{ contain: "layout style paint" }}>
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


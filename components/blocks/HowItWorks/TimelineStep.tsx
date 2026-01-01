"use client";

import { LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface TimelineStepProps {
  stepNumber: number;
  icon: LucideIcon;
  title: string;
  description: string;
  isLast: boolean;
  align: "left" | "right";
}

export function TimelineStep({
  stepNumber,
  icon: Icon,
  title,
  description,
  isLast,
  align,
}: TimelineStepProps) {
  const [isVisible, setIsVisible] = useState(false);
  const stepRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (stepRef.current) {
      observer.observe(stepRef.current);
    }

    return () => {
      if (stepRef.current) {
        observer.unobserve(stepRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={stepRef}
      className="group relative grid grid-cols-[auto_1fr] items-start gap-3 md:grid-cols-[1fr_auto_1fr] md:gap-12"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(30px)",
        transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
        transitionDelay: `${stepNumber * 150}ms`,
      }}
    >
      {align === "left" && (
        <div className="hidden flex-col pt-2 md:flex md:pr-8">
          <h3 className="mb-2 text-right text-xl font-semibold text-foreground transition-colors duration-200 group-hover:text-primary md:text-2xl">
            {title}
          </h3>
          <p className="text-right text-sm leading-relaxed text-foreground-secondary md:text-base">
            {description}
          </p>
        </div>
      )}

      {align === "right" && (
        <div className="hidden md:block" />
      )}

      <div
        className={cn(
          "relative flex flex-col items-center",
          align === "left" ? "md:-translate-x-16 md:translate-y-5" : "md:translate-x-16 md:translate-y-5"
        )}
      >
        <div
          className={cn(
            "relative flex h-16 w-16 items-center justify-center rounded-full border-4 border-background bg-gradient-to-br from-primary/30 via-primary/20 to-violet-500/30 shadow-lg transition-all duration-200",
            isLast
              ? "scale-110 ring-4 ring-primary/40 ring-offset-2 ring-offset-background"
              : "group-hover:scale-105"
          )}
          style={{
            boxShadow: isLast
              ? "0 0 20px rgba(var(--primary), 0.4), 0 0 40px rgba(var(--primary), 0.2)"
              : undefined,
          }}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/40 to-violet-500/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
          <Icon
            className={cn(
              "relative z-10 h-7 w-7 text-primary transition-all duration-200",
              isLast && "scale-110"
            )}
            strokeWidth={2.5}
          />
        </div>
        <div
          className={cn(
            "absolute top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary backdrop-blur-sm md:h-7 md:w-7 md:text-sm",
            align === "left" ? "-right-2 md:-right-3" : "-left-2 md:-left-3"
          )}
        >
          {String(stepNumber).padStart(2, "0")}
        </div>
      </div>

      {align === "right" && (
        <div className="flex flex-col pt-2 md:pl-8">
          <h3 className="mb-2 text-left text-xl font-semibold text-foreground transition-colors duration-200 group-hover:text-primary md:text-2xl">
            {title}
          </h3>
          <p className="text-left text-sm leading-relaxed text-foreground-secondary md:text-base">
            {description}
          </p>
        </div>
      )}

      {align === "left" && (
        <div className="hidden md:block" />
      )}
    </div>
  );
}


"use client";

import { Shield, Clock, Users } from "lucide-react";

interface TrustSignalsProps {
  signals: Array<{
    icon: typeof Shield;
    text: string;
  }>;
}

export function TrustSignals({ signals }: TrustSignalsProps) {
  return (
    <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
      {signals.map((signal, index) => {
        const Icon = signal.icon;
        return (
          <div
            key={index}
            className="group flex items-center gap-2 rounded-full bg-surface/80 backdrop-blur-sm px-4 py-2 text-sm font-medium text-foreground-secondary shadow-lg transition-all hover:scale-105 hover:shadow-xl"
          >
            <Icon className="h-4 w-4 text-primary transition-transform group-hover:scale-110 group-hover:rotate-12" />
            <span>{signal.text}</span>
          </div>
        );
      })}
    </div>
  );
}


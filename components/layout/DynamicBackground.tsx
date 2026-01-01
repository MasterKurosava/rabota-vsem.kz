"use client";

import { useEffect, useState } from "react";

export function DynamicBackground() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const maxScroll = Math.max(documentHeight - windowHeight, 1);
      const progress = Math.min(scrollTop / maxScroll, 1);
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const primaryHue = 250;
  const violetHue = 270;
  
  const currentHue = primaryHue + (violetHue - primaryHue) * scrollProgress;
  const topOpacity = 0.08 - scrollProgress * 0.05;
  const bottomOpacity = 0.03 + scrollProgress * 0.08;

  return (
    <div
      className="fixed inset-0 -z-10 transition-all duration-700 ease-out"
      style={{
        background: `linear-gradient(to bottom, 
          hsl(${primaryHue}, 55%, 50%) / ${Math.max(topOpacity, 0.02)}, 
          hsl(var(--background)), 
          hsl(${currentHue}, 55%, 50%) / ${Math.min(bottomOpacity, 0.12)}
        )`,
      }}
    />
  );
}


import { useState, useEffect } from "react";

export function useCooldown(initialSeconds: number = 0) {
  const [cooldown, setCooldown] = useState(initialSeconds);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const start = (seconds: number) => {
    setCooldown(seconds);
  };

  const reset = () => {
    setCooldown(0);
  };

  const isActive = cooldown > 0;

  return {
    cooldown,
    isActive,
    start,
    reset,
  };
}


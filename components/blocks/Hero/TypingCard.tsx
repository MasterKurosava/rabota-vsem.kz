"use client";

import { useState, useEffect, memo } from "react";
import { User } from "lucide-react";

interface TypingCardProps {
  card: {
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
  };
}

export const TypingCard = memo(function TypingCard({ card }: TypingCardProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    let restartTimeoutId: NodeJS.Timeout | null = null;
    let currentIndex = 0;
    let isMounted = true;
    
    const totalEraseTime = 800;
    const eraseSpeed = Math.max(5, Math.floor(totalEraseTime / card.text.length));

    const typeText = () => {
      if (!isMounted) return;
      
      if (currentIndex < card.text.length) {
        setDisplayedText(card.text.slice(0, currentIndex + 1));
        currentIndex++;
        timeoutId = setTimeout(typeText, card.speed);
      } else {
        setIsTyping(false);
        restartTimeoutId = setTimeout(() => {
          if (isMounted) eraseText();
        }, 1000);
      }
    };

    const eraseText = () => {
      if (!isMounted) return;
      
      if (currentIndex > 0) {
        currentIndex--;
        setDisplayedText(card.text.slice(0, currentIndex));
        timeoutId = setTimeout(eraseText, eraseSpeed);
      } else {
        restartTimeoutId = setTimeout(() => {
          if (isMounted) {
            currentIndex = 0;
            setIsTyping(true);
            typeText();
          }
        }, 500);
      }
    };

    timeoutId = setTimeout(() => {
      if (isMounted) typeText();
    }, card.delay * 1000);

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
      if (restartTimeoutId) clearTimeout(restartTimeoutId);
    };
  }, [card.text, card.speed, card.delay]);

  return (
    <div
      className="absolute rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 to-violet-500/10 backdrop-blur-sm"
      style={{
        width: `${card.size}px`,
        height: `${card.size * 0.7}px`,
        left: `${card.x}%`,
        top: `${card.y}%`,
        animation: `drift ${card.duration}s ease-in-out infinite`,
        animationDelay: `${card.delay}s`,
        opacity: 0.3,
        willChange: "transform, opacity",
        transform: "translateZ(0)",
      }}
    >
      <div className="absolute inset-2 rounded-lg bg-primary/5"></div>
      
      <div className="absolute left-2 top-2 flex items-center gap-1.5">
        <div 
          className="flex items-center justify-center rounded-full bg-gradient-to-br from-primary/30 to-violet-500/30 text-primary/80 shadow-sm" 
          style={{ 
            width: `20px`,
            height: `20px`,
          }}
        >
          <User 
            className="text-primary/70" 
            style={{ 
              width: `10px`,
              height: `10px`,
            }}
          />
        </div>
        <span 
          className="font-medium text-primary/50 blur-[2px] truncate max-w-[60px]" 
          style={{ fontSize: `${Math.max(5, card.size / 18)}px` }}
        >
          ********** ********
        </span>
      </div>
      
      <div className="absolute inset-x-0 bottom-2 top-8 flex items-start justify-center px-1.5 py-1">
        <span 
          className="font-mono font-normal text-primary/50 leading-tight overflow-hidden text-center break-words" 
          style={{ 
            fontSize: `${Math.max(4, card.size / 22)}px`,
            textShadow: "0 1px 2px rgba(0,0,0,0.1)",
            lineHeight: "1.3",
            wordBreak: "break-word",
            hyphens: "auto",
            willChange: "contents",
          }}
        >
          {displayedText}
          {isTyping && displayedText.length < card.text.length && (
            <span className="animate-pulse text-primary">|</span>
          )}
        </span>
      </div>
    </div>
  );
});


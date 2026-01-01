"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItemProps {
  question: string;
  answer: string;
  index: number;
}

export function FAQItem({ question, answer, index }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border/50 bg-surface/80 backdrop-blur-sm transition-all duration-200 ease-out",
        "hover:border-primary/30 hover:bg-surface hover:shadow-md",
        isOpen && "border-primary/40 bg-surface shadow-lg ring-1 ring-primary/20"
      )}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${index}`}
      >
        <div className="flex items-start gap-4">
          <div className="mt-1 shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 transition-colors duration-200 group-hover:bg-primary/20">
              <HelpCircle className="h-4 w-4 text-primary transition-transform duration-200 group-hover:scale-110" />
            </div>
          </div>
          
          <div className="flex-1">
            <h3
              className={cn(
                "text-lg font-semibold leading-snug transition-colors duration-200 md:text-xl",
                isOpen ? "text-foreground" : "text-foreground group-hover:text-primary"
              )}
            >
              {question}
            </h3>
          </div>

          <div className="shrink-0 pt-1">
            <ChevronDown
              className={cn(
                "h-5 w-5 text-foreground-secondary transition-all duration-250 ease-out",
                isOpen && "rotate-180 text-primary"
              )}
            />
          </div>
        </div>
      </button>

      <div
        id={`faq-answer-${index}`}
        className="overflow-hidden transition-all duration-250 ease-out"
        style={{
          height: `${contentHeight}px`,
          opacity: isOpen ? 1 : 0,
        }}
        aria-hidden={!isOpen}
      >
        <div ref={contentRef} className="px-6 pb-6 pl-14 md:pl-16">
          <div className="border-l-2 border-primary/20 pl-4">
            <p className="text-sm leading-relaxed text-foreground-secondary md:text-base md:leading-relaxed">
              {answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


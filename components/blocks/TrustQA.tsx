"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function TrustQA() {
  const t = useTranslations("home.trustQA");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const questions = [
    {
      questionKey: "question1",
      answerKey: "answer1",
    },
    {
      questionKey: "question2",
      answerKey: "answer2",
    },
    {
      questionKey: "question3",
      answerKey: "answer3",
    },
    {
      questionKey: "question4",
      answerKey: "answer4",
    },
  ];

  return (
    <div className="space-y-3">
      {questions.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className={cn(
              "group relative overflow-hidden rounded-xl border border-border/50 bg-surface/80 backdrop-blur-sm transition-all duration-200 ease-out",
              "hover:border-primary/30 hover:bg-surface hover:shadow-md",
              isOpen && "border-primary/40 bg-surface shadow-lg ring-1 ring-primary/20"
            )}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full px-5 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
              aria-expanded={isOpen}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 transition-colors duration-200 group-hover:bg-primary/20">
                    <HelpCircle className="h-3.5 w-3.5 text-primary transition-transform duration-200 group-hover:scale-110" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <h4
                    className={cn(
                      "text-base font-semibold leading-snug transition-colors duration-200",
                      isOpen ? "text-foreground" : "text-foreground group-hover:text-primary"
                    )}
                  >
                    {t(item.questionKey)}
                  </h4>
                </div>

                <div className="shrink-0 pt-0.5">
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-foreground-secondary transition-all duration-250 ease-out",
                      isOpen && "rotate-180 text-primary"
                    )}
                  />
                </div>
              </div>
            </button>

            {isOpen && (
              <div className="px-5 pb-4 pl-12">
                <div className="border-l-2 border-primary/20 pl-4">
                  <p className="text-sm leading-relaxed text-foreground-secondary">
                    {t(item.answerKey)}
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}


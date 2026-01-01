"use client";

import { useTranslations } from "next-intl";
import { Search, FileText, MessageCircle, CheckCircle } from "lucide-react";
import { TimelineStep } from "./TimelineStep";
import { Button } from "@/components/ui/button";
import { useWhatsAppLink } from "@/hooks/useWhatsAppLink";

const steps = [
  {
    icon: Search,
    titleKey: "step1Title",
    descriptionKey: "step1Description",
  },
  {
    icon: FileText,
    titleKey: "step2Title",
    descriptionKey: "step2Description",
  },
  {
    icon: MessageCircle,
    titleKey: "step3Title",
    descriptionKey: "step3Description",
  },
  {
    icon: CheckCircle,
    titleKey: "step4Title",
    descriptionKey: "step4Description",
  },
];

interface HowItWorksProps {
  whatsappNumber?: string | null;
}

export function HowItWorks({ whatsappNumber }: HowItWorksProps) {
  const t = useTranslations("home.howItWorks");
  const tHome = useTranslations("home");
  const whatsappLink = useWhatsAppLink({
    phone: whatsappNumber,
    messageKey: "whatsappMessage",
    namespace: "home",
  });

  return (
    <section className="relative section-spacing overflow-hidden">
      <div className="container relative z-10">
        <h2 className="mb-16 text-center text-3xl font-bold md:text-4xl">
          {t("title")}
        </h2>

        <div className="relative mx-auto max-w-4xl">
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/40 via-primary/60 to-primary/40 md:left-1/2 md:-translate-x-1/2" />
            
            <div className="space-y-4 md:space-y-6 pl-12 md:pl-0">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isLast = index === steps.length - 1;
                const align = index % 2 === 0 ? "right" : "left";
                return (
                  <TimelineStep
                    key={index}
                    stepNumber={index + 1}
                    icon={Icon}
                    title={t(step.titleKey)}
                    description={t(step.descriptionKey)}
                    isLast={isLast}
                    align={align}
                  />
                );
              })}
            </div>
          </div>

          <div className="mt-16 flex justify-center">
            <Button
              asChild
              size="lg"
              className="group relative h-14 gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-primary to-violet-600 px-8 text-base font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-[0.98]"
            >
              <a href="/anketas">
                <Search className="h-5 w-5 transition-transform group-hover:scale-110" />
                {tHome("browseAnketas")}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}


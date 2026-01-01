"use client";

import { useTranslations } from "next-intl";
import { HelpCircle, MessageCircle } from "lucide-react";
import { FAQItem } from "./FAQ/FAQItem";
import { Button } from "@/components/ui/button";
import { useWhatsAppLink } from "@/hooks/useWhatsAppLink";

interface FAQItemType {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItemType[];
  whatsappNumber?: string | null;
}

export function FAQ({ items, whatsappNumber }: FAQProps) {
  const t = useTranslations("home");
  const whatsappLink = useWhatsAppLink({
    phone: whatsappNumber,
    messageKey: "whatsappMessage",
    namespace: "home",
  });

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="section-spacing">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <HelpCircle className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold md:text-4xl">
              {t("faq")}
            </h2>
          </div>
          <p className="mb-12 text-base text-foreground-secondary md:text-lg">
            {t("faqSubtitle") || "Ответы на самые популярные вопросы"}
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          <div className="grid gap-4">
          {items.map((item, index) => (
            <FAQItem
              key={index}
              question={item.question}
              answer={item.answer}
              index={index}
            />
          ))}
          </div>
        </div>

        {whatsappNumber && (
          <div className="mx-auto mt-16 max-w-2xl text-center">
            <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-surface to-violet-500/5 p-8 backdrop-blur-sm">
              <h3 className="mb-3 text-xl font-semibold text-foreground md:text-2xl">
                {t("faqCtaTitle") || "Не нашли ответ?"}
              </h3>
              <p className="mb-6 text-sm leading-relaxed text-foreground-secondary md:text-base">
                {t("faqCtaDescription") || "Напишите нам в WhatsApp, и мы поможем вам"}
              </p>
              <Button
                asChild
                size="lg"
                className="group h-12 gap-2 rounded-xl bg-gradient-to-r from-primary to-violet-600 px-6 text-base font-semibold text-white shadow-md transition-all hover:scale-105 hover:shadow-lg active:scale-[0.98]"
              >
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5 transition-transform group-hover:scale-110 group-hover:rotate-12" />
                  {t("contactWhatsApp")}
                </a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

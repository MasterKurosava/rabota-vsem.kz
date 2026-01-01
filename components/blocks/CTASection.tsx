"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useWhatsAppLink } from "@/hooks/useWhatsAppLink";
import { MessageCircle } from "lucide-react";

interface CTASectionProps {
  whatsappNumber?: string | null;
}

export function CTASection({ whatsappNumber }: CTASectionProps) {
  const t = useTranslations("home");
  const whatsappLink = useWhatsAppLink({
    phone: whatsappNumber,
    messageKey: "whatsappMessage",
    namespace: "home",
  });

  if (!whatsappNumber) {
    return null;
  }

  return (
    <section className="section-spacing">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            {t("ctaTitle")}
          </h2>
          <p className="mb-8 text-lg leading-relaxed text-foreground-secondary md:text-xl">
            {t("ctaDescription")}
          </p>
          <Button
            asChild
            size="lg"
            className="group h-14 gap-2 rounded-xl px-8 text-base font-semibold shadow-md transition-all hover:shadow-lg active:scale-[0.98]"
          >
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-5 w-5 transition-transform group-hover:scale-110" />
              {t("contactWhatsApp")}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

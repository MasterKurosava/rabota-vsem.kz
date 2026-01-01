"use client";

import { useTranslations } from "next-intl";
import { useWhatsAppLink } from "@/hooks/useWhatsAppLink";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileCTAProps {
  whatsappNumber?: string | null;
}

export function MobileCTA({ whatsappNumber }: MobileCTAProps) {
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
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-surface/95 backdrop-blur-sm p-4 shadow-lg md:hidden">
      <Button
        asChild
        className="w-full h-12 gap-2 rounded-xl text-base font-semibold shadow-md transition-all active:scale-[0.98]"
      >
        <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
          <MessageCircle className="h-5 w-5" />
          {t("contactWhatsApp")}
        </a>
      </Button>
    </div>
  );
}

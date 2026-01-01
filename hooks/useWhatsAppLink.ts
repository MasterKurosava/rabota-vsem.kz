import { useTranslations, useLocale } from "next-intl";
import { useMemo } from "react";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import type { Locale } from "@/i18n";

interface UseWhatsAppLinkProps {
  phone?: string | null;
  messageKey?: string;
  namespace?: string;
}

export function useWhatsAppLink({
  phone,
  messageKey = "whatsappMessage",
  namespace = "home",
}: UseWhatsAppLinkProps = {}) {
  const t = useTranslations(namespace);
  const locale = useLocale() as Locale;

  const link = useMemo(
    () =>
      phone
        ? buildWhatsAppLink({
            phone,
            text: t(messageKey),
            locale,
          })
        : "#",
    [phone, t, messageKey, locale]
  );

  return link;
}


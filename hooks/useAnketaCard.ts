import { useTranslations, useLocale } from "next-intl";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { getCityName, truncateTitle } from "@/lib/utils/anketa";
import type { Anketa, City } from "@prisma/client";
import type { Locale } from "@/i18n";

interface UseAnketaCardProps {
  anketa: Anketa & {
    city: City;
    user: {
      id: string;
      name: string;
      phone?: string | null;
      email?: string | null;
      rating?: number | null;
    };
  };
  whatsappNumber?: string | null;
}

export function useAnketaCard({ anketa, whatsappNumber }: UseAnketaCardProps) {
  const t = useTranslations("anketas");
  const locale = useLocale() as Locale;

  const cityName = getCityName(anketa.city, locale);
  const shortTitle = truncateTitle(anketa.title);
  
  const whatsappLink = whatsappNumber || anketa.user.phone
    ? buildWhatsAppLink({
        phone: whatsappNumber || anketa.user.phone || "",
        text: t("whatsappMessage"),
        locale,
      })
    : "#";

  const hasContact = !!(whatsappNumber || anketa.user.phone);

  return {
    cityName,
    shortTitle,
    whatsappLink,
    hasContact,
  };
}


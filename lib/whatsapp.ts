import type { Locale } from "@/i18n";

export interface WhatsAppLinkParams {
  phone: string;
  text: string;
  locale?: Locale;
}

export function buildWhatsAppLink({ phone, text, locale = "ru" }: WhatsAppLinkParams): string {
  const cleanPhone = phone.replace(/\D/g, "");
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}




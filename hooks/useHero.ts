import { useTranslations, useLocale } from "next-intl";
import { useMemo } from "react";
import { Shield, Clock, Users } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import type { Locale } from "@/i18n";

interface UseHeroProps {
  whatsappNumber?: string | null;
  homepageTexts?: {
    title?: string;
    subtitle?: string;
    benefits?: string[];
    ctaText?: string;
  } | null;
}

export function useHero({ whatsappNumber, homepageTexts }: UseHeroProps) {
  const t = useTranslations("home");
  const locale = useLocale() as Locale;

  const title = homepageTexts?.title || t("title");
  const subtitle = homepageTexts?.subtitle || t("subtitle");
  const benefits = homepageTexts?.benefits || [];
  const ctaText = homepageTexts?.ctaText || t("contactWhatsApp");

  const whatsappLink = useMemo(
    () =>
      whatsappNumber
        ? buildWhatsAppLink({
            phone: whatsappNumber,
            text: t("whatsappMessage"),
            locale,
          })
        : "#",
    [whatsappNumber, t, locale]
  );

  const trustSignals = useMemo(
    () => [
      { icon: Shield, text: t("trustOfficial") },
      { icon: Clock, text: t("trustFlexible") },
      { icon: Users, text: t("trustStudents") },
    ],
    [t]
  );

  const jobCards = useMemo(() => {
    const jobCardData = [
      {
        text: "Предлагаю услуги курьера для доставки заказов. Гибкий график работы, можно совмещать с учебой. Официальное трудоустройство.",
        name: "Алексей К.",
        avatar: "АК",
      },
      {
        text: "Опытный официант, работаю в ресторанах на вечерние смены. Официальное трудоустройство, обучение персонала.",
        name: "Мария П.",
        avatar: "МП",
      },
      {
        text: "Продавец-консультант с опытом работы в магазинах. Работа в выходные дни, удобно для студентов и мам. Официально.",
        name: "Дмитрий С.",
        avatar: "ДС",
      },
      {
        text: "Удаленная подработка на дому. Набор текста, обработка данных, ввод информации. Свободный график, официально.",
        name: "Елена В.",
        avatar: "ЕВ",
      },
      {
        text: "Водитель такси на своем автомобиле. Гибкий график, можно работать когда удобно. Официальное трудоустройство.",
        name: "Иван М.",
        avatar: "ИМ",
      },
    ];

    const baseSpeeds = [80, 100, 90, 110, 95];
    const positions = [
      { x: 5, y: 10 },
      { x: 20, y: 35 },
      { x: 30, y: 60 },
      { x: 70, y: 20 },
      { x: 90, y: 45 },
    ];

    return Array.from({ length: 5 }, (_, i) => ({
      id: i,
      delay: i * 0.8,
      duration: 15 + i * 2,
      size: 150 + i * 40,
      x: positions[i].x,
      y: positions[i].y,
      text: jobCardData[i].text,
      name: jobCardData[i].name,
      avatar: jobCardData[i].avatar,
      speed: baseSpeeds[i] || 80,
    }));
  }, []);

  return {
    title,
    subtitle,
    benefits,
    ctaText,
    whatsappLink,
    trustSignals,
    jobCards,
  };
}


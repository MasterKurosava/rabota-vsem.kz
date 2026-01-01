"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "./ThemeToggle";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { AccountButton } from "./AccountButton";

export function Header() {
  const t = useTranslations("nav");

  return (
    <header 
      className="sticky top-0 z-50 w-full border-b border-border bg-surface/95 backdrop-blur-sm supports-[backdrop-filter]:bg-surface/80"
      suppressHydrationWarning
    >
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl transition-colors hover:text-primary"
          >
            <Image
              src="/img/logo.png"
              alt="RabotaVsem"
              width={24}
              height={24}
              className="h-6 w-6 object-contain"
            />
            <span>RabotaVsem</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm md:flex">
            <Link
              href="/"
              className="font-medium text-foreground-secondary transition-colors hover:text-foreground"
            >
              {t("home")}
            </Link>
            <Link
              href="/anketas"
              className="font-medium text-foreground-secondary transition-colors hover:text-foreground"
            >
              {t("anketas")}
            </Link>
            <Link
              href="/about"
              className="font-medium text-foreground-secondary transition-colors hover:text-foreground"
            >
              {t("about")}
            </Link>
            <Link
              href="/contact"
              className="font-medium text-foreground-secondary transition-colors hover:text-foreground"
            >
              {t("contact")}
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end gap-3">
          <LocaleSwitcher />
          <ThemeToggle />
          <AccountButton />
        </div>
      </div>
    </header>
  );
}

"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

export function AccountButton() {
  const t = useTranslations("nav");
  const [auth, setAuth] = useState<boolean | null>(null);

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/check", {
        credentials: "include",
        cache: "no-store",
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
      });

      const data = res.ok ? await res.json() : { authenticated: false };
      setAuth(Boolean(data.authenticated));
    } catch {
      setAuth(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();

    const onVisible = () => {
      if (document.visibilityState === "visible") checkAuth();
    };

    const onFocus = () => checkAuth();
    const onPop = () => checkAuth();

    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onFocus);
    window.addEventListener("popstate", onPop);

    // Check auth when returning to the page
    const interval = setInterval(checkAuth, 2000);

    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("popstate", onPop);
      clearInterval(interval);
    };
  }, [checkAuth]);

  // загрузка
  if (auth === null) {
    return (
      <Button variant="outline" size="sm" className="hidden md:inline-flex" disabled>
        {t("login")}
      </Button>
    );
  }

  // авторизован
  if (auth) {
    return (
      <Button
        asChild
        variant="outline"
        size="sm"
        className="hidden md:inline-flex gap-2"
      >
        <Link href="/account/anketa">
          <User className="h-4 w-4" />
          {t("account")}
        </Link>
      </Button>
    );
  }

  // не авторизован
  return (
    <Button
      asChild
      variant="outline"
      size="sm"
      className="hidden md:inline-flex"
    >
      <Link href="/login">{t("login")}</Link>
    </Button>
  );
}

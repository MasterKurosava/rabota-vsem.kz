"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, MessageSquare } from "lucide-react";

export function LoginPrompt() {
  const t = useTranslations("anketas");

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-violet-500/5">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <MessageSquare className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">{t("loginToComment")}</CardTitle>
            <p className="text-sm text-foreground-secondary mt-1">
              {t("loginToCommentDescription")}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Button asChild className="w-full gap-2" size="lg">
          <Link href="/login">
            <LogIn className="h-4 w-4" />
            {t("login")}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}


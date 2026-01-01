"use client";

import { useTranslations, useLocale } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  MessageCircle,
  Phone,
  Copy,
  Check,
  Share2,
  Mail,
} from "lucide-react";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { formatPhone } from "@/lib/utils/phone";
import { cn } from "@/lib/utils";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { useShare } from "@/hooks/useShare";
import type { Locale } from "@/i18n";

interface ContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  phone?: string | null;
  email?: string | null;
  whatsappNumber?: string | null;
  profileUrl: string;
}

export function ContactModal({
  open,
  onOpenChange,
  name,
  phone,
  email,
  whatsappNumber,
  profileUrl,
}: ContactModalProps) {
  const t = useTranslations("anketas");
  const locale = useLocale() as Locale;
  const { copy, copiedField } = useCopyToClipboard();
  const { share } = useShare();

  const contactPhone = whatsappNumber || phone;
  const whatsappLink = contactPhone
    ? buildWhatsAppLink({
        phone: contactPhone,
        text: t("whatsappMessage"),
        locale,
      })
    : "#";

  const handleShare = async () => {
    await share({
          title: name,
          text: t("shareProfileText"),
          url: profileUrl,
        });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            {name}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleShare}
              title={t("share")}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {contactPhone && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground-secondary">
                {t("phone")}
              </label>
              <div className="flex gap-2 items-center">
                <a
                  href={`tel:${contactPhone.replace(/\s/g, "")}`}
                  className="flex-1 text-lg font-semibold text-foreground hover:text-primary transition-colors cursor-pointer"
                >
                  {formatPhone(contactPhone)}
                </a>
                <Button
                  variant="outline"
                  className="gap-2 shrink-0"
                  size="default"
                  onClick={() => copy(contactPhone, "phone")}
                  title={copiedField === "phone" ? t("copied") : t("copy")}
                >
                  {copiedField === "phone" ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          )}

          {email && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground-secondary">
                {t("email")}
              </label>
              <div className="flex gap-2">
                <div className="flex-1 rounded-lg border border-border bg-surface-muted px-3 py-2 text-sm">
                  {email}
                </div>
                <Button
                  variant="outline"
                  className="gap-2"
                  size="default"
                  onClick={() => copy(email, "email")}
                >
                  {copiedField === "email" ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          )}

          {contactPhone && (
            <Button
              asChild
              size="lg"
              className={cn(
                "w-full gap-2 bg-[#25D366] font-semibold text-white shadow-md transition-all hover:bg-[#20BA5A] hover:shadow-lg active:scale-[0.98]"
              )}
            >
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center"
              >
                <MessageCircle className="h-5 w-5" />
                {t("contactWhatsApp")}
              </a>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

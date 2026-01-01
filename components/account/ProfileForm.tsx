"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { toast } from "sonner";

import { updateProfile } from "@/server/actions/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPhoneNumber, getPhoneDigits, validatePhoneFormat, PHONE_PLACEHOLDER } from "@/lib/utils/phone";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { User, Mail, Edit2, CheckCircle2 } from "lucide-react";
import type { User as PrismaUser } from "@prisma/client";
import type { Locale } from "@/i18n";
import { PhoneVerificationBanner } from "./PhoneVerificationBanner";

interface ProfileFormProps {
  user: PrismaUser;
  whatsappNumber?: string | null;
}

export function ProfileForm({ user, whatsappNumber }: ProfileFormProps) {
  const t = useTranslations("account");
  const locale = useLocale() as Locale;
  const router = useRouter();

  const phoneVerified = (user as any).phoneVerified === true;
  const [phone, setPhone] = useState(user.phone || "");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const handleSave = async () => {
    setPhoneError(null);
    
    const digits = getPhoneDigits(phone);
    
    // Проверка на пустой номер
    if (!digits || digits.trim() === "") {
      setPhoneError("Введите номер телефона");
      return;
    }
    
    // Проверка на полный номер (11 цифр, начинается с 7)
    if (!validatePhoneFormat(phone)) {
      setPhoneError("Введите полный номер телефона (11 цифр)");
      return;
    }
    
    setIsSaving(true);
    const formData = new FormData();
    formData.append("phone", digits);

    const result = await updateProfile(formData);

    if (result.success) {
      toast.success(t("changesSaved") || "Изменения сохранены");
      setIsEditing(false);
      setPhoneError(null);
      router.refresh();
    } else {
      toast.error(result.error || "Ошибка при сохранении");
    }
    setIsSaving(false);
  };

  // Плашка показывается только если телефон сохранен в БД (user.phone) и не подтвержден
  const phoneNeedsVerification = Boolean(user.phone) && !phoneVerified;
  const whatsappLink = whatsappNumber
    ? buildWhatsAppLink({
        phone: whatsappNumber,
        text: t("phoneVerificationWhatsAppMessage", { phone: user.phone || "" }),
        locale,
      })
    : "#";

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-surface p-6 space-y-5">
        {/* Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium">{t("name")}</label>
          <div className="flex items-center gap-3 h-11 px-4 rounded-lg border bg-background/50">
            <User className="h-5 w-5 text-foreground-muted" />
            <span>{user.name}</span>
          </div>
        </div>

        {/* Email */}
        {user.email && (
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("email")}</label>
            <div className="flex items-center gap-3 h-11 px-4 rounded-lg border bg-muted/30">
              <Mail className="h-5 w-5 text-foreground-muted" />
              <span>{user.email}</span>
              {user.emailVerified && (
                <CheckCircle2 className="h-5 w-5 text-success ml-auto" />
              )}
            </div>
          </div>
        )}

        {/* Phone */}
        <div className="space-y-2">
          <label className="text-sm font-medium">{t("phone")}</label>
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                type="tel"
                value={isEditing ? phone : formatPhoneNumber(phone)}
                onChange={(e) => {
                  const formatted = formatPhoneNumber(e.target.value);
                  setPhone(formatted);
                  if (phoneError) {
                    setPhoneError(null);
                  }
                }}
                readOnly={!isEditing || phoneVerified}
                placeholder={PHONE_PLACEHOLDER}
                className={phoneVerified ? "bg-muted/30 cursor-not-allowed" : phoneError ? "border-destructive" : ""}
              />
              {phoneError && (
                <p className="text-sm text-destructive mt-1">{phoneError}</p>
              )}
            </div>

            {!isEditing && !phoneVerified && (
              <Button type="button" variant="secondary" onClick={() => setIsEditing(true)}>
                <Edit2 className="h-4 w-4 mr-1" />
                {phone ? t("edit") : t("addPhone") || "Добавить телефон"}
              </Button>
            )}

            {isEditing && (
              <>
                <Button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? "Сохранение..." : "Сохранить"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setPhone(user.phone || "");
                    setIsEditing(false);
                    setPhoneError(null);
                  }}
                >
                  Отменить
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Verification Banner */}
        {phoneNeedsVerification && <PhoneVerificationBanner whatsappLink={whatsappLink} />}

        {/* Verified State */}
        {phoneVerified && user.phone && (
          <div className="rounded-lg border border-success/20 bg-success/10 p-3">
            <p className="text-sm text-success flex gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Номер подтверждён администратором — изменить нельзя
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

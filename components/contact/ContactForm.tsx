"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, CheckCircle2 } from "lucide-react";

interface ContactFormProps {
  locale: string;
}

export function ContactForm({ locale }: ContactFormProps) {
  const t = useTranslations("contact.form");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      // Success
      setSuccess(true);
      setFormData({
        name: "",
        contact: "",
        subject: "",
        message: "",
      });

      // Reset success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(t("error"));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (success) {
    return (
      <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
        <CheckCircle2 className="h-16 w-16 text-emerald-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-emerald-900 mb-2">
          {t("successTitle")}
        </h3>
        <p className="text-emerald-700">
          {t("successMessage")}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2">
          {t("nameLabel")} <span className="text-red-500">*</span>
        </label>
        <Input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder={t("namePlaceholder")}
          required
          className="w-full"
        />
      </div>

      {/* Email or Phone */}
      <div>
        <label htmlFor="contact" className="block text-sm font-medium mb-2">
          {t("contactLabel")} <span className="text-red-500">*</span>
        </label>
        <Input
          id="contact"
          name="contact"
          type="text"
          value={formData.contact}
          onChange={handleChange}
          placeholder={t("contactPlaceholder")}
          required
          className="w-full"
        />
        <p className="text-xs text-foreground-muted mt-1">
          {t("contactHint")}
        </p>
      </div>

      {/* Subject */}
      <div>
        <label htmlFor="subject" className="block text-sm font-medium mb-2">
          {t("subjectLabel")} <span className="text-red-500">*</span>
        </label>
        <Input
          id="subject"
          name="subject"
          type="text"
          value={formData.subject}
          onChange={handleChange}
          placeholder={t("subjectPlaceholder")}
          required
          className="w-full"
        />
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-2">
          {t("messageLabel")} <span className="text-red-500">*</span>
        </label>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder={t("messagePlaceholder")}
          required
          rows={6}
          className="w-full resize-none"
        />
        <p className="text-xs text-foreground-muted mt-1">
          {t("messageHint")}
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={loading}
        size="lg"
        className="w-full gap-2"
      >
        {loading ? (
          <>
            <span className="animate-pulse">{t("sending")}</span>
          </>
        ) : (
          <>
            <Send className="h-5 w-5" />
            {t("submit")}
          </>
        )}
      </Button>

      <p className="text-xs text-center text-foreground-muted">
        {t("privacyNote")}
      </p>
    </form>
  );
}

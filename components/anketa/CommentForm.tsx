"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { createComment } from "@/server/actions/comments";
import { cn } from "@/lib/utils";
import { useRatingInput } from "@/hooks/useRatingInput";
import { useFormSubmission } from "@/hooks/useFormSubmission";

interface CommentFormProps {
  anketaId: string;
  recipientId: string;
}

export function CommentForm({ anketaId, recipientId }: CommentFormProps) {
  const t = useTranslations("anketas");
  const router = useRouter();
  const [text, setText] = useState("");
  const rating = useRatingInput(5);

  const submitComment = async (formData: FormData) => {
    const result = await createComment(formData);
    if (result.error) {
      return { error: result.error };
    }
    setText("");
    rating.reset();
    router.refresh();
    return { success: true };
  };

  const { submit, loading, error } = useFormSubmission(submitComment);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    const formData = new FormData();
    formData.append("anketaId", anketaId);
    formData.append("recipientId", recipientId);
    formData.append("rating", rating.rating.toString());
    formData.append("text", text);

    await submit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>{t("rating")}</Label>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => rating.setRating(i + 1)}
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-sm"
            >
              <Star
                className={cn(
                  "h-5 w-5 transition-colors",
                  i < rating.rating
                    ? "fill-yellow-500 text-yellow-500"
                    : "fill-transparent text-gray-300 hover:text-yellow-400"
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="comment-text">{t("yourComment")}</Label>
        <Textarea
          id="comment-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t("commentPlaceholder")}
          rows={4}
          required
          className="resize-none"
        />
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <Button
        type="submit"
        disabled={loading || !text.trim()}
        className="w-full"
      >
        {loading ? t("submitting") : t("submitComment")}
      </Button>
    </form>
  );
}

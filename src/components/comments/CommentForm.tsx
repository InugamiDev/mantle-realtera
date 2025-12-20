"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { CommentRating } from "./CommentRating";

interface CommentFormProps {
  targetType: "PROJECT" | "DEVELOPER";
  targetId: string;
  allowRating?: boolean;
  placeholder?: string;
  onSubmit?: (comment: { content: string; rating?: number }) => void;
  onSuccess?: () => void;
  className?: string;
}

export function CommentForm({
  targetType,
  targetId,
  allowRating = true,
  placeholder,
  onSubmit,
  onSuccess,
  className,
}: CommentFormProps) {
  const t = useTranslations("comments");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (content.trim().length < 10) {
      setError(t("errors.minLength"));
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/v1/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: content.trim(),
          targetType,
          targetId,
          ...(rating > 0 && { rating }),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to post comment");
      }

      const { data } = await res.json();

      // Call custom handlers
      onSubmit?.({ content: content.trim(), rating: rating > 0 ? rating : undefined });
      onSuccess?.();

      // Reset form
      setContent("");
      setRating(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.postFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const charCount = content.length;
  const isValid = charCount >= 10 && charCount <= 2000;

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-4", className)}>
      {/* Rating */}
      {allowRating && (
        <div className="flex items-center gap-3">
          <span className="text-sm text-white/60">{t("rating")}:</span>
          <CommentRating value={rating} onChange={setRating} />
          {rating > 0 && (
            <button
              type="button"
              onClick={() => setRating(0)}
              className="text-xs text-white/40 hover:text-white/60"
            >
              {t("clear")}
            </button>
          )}
        </div>
      )}

      {/* Textarea */}
      <div className="relative">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder || t("defaultPlaceholder")}
          rows={3}
          maxLength={2000}
          className={cn(
            "w-full rounded-lg border bg-white/5 px-4 py-3 text-white placeholder-white/40",
            "focus:outline-none focus:ring-2",
            error
              ? "border-red-500/50 focus:ring-red-500/30"
              : "border-white/10 focus:ring-amber-500/30"
          )}
        />
        <div className="mt-1 flex items-center justify-between text-xs">
          <span className={cn(
            charCount > 2000 ? "text-red-400" : "text-white/40"
          )}>
            {charCount}/2000
          </span>
          {charCount > 0 && charCount < 10 && (
            <span className="text-amber-400">{t("minChars")}</span>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className={cn(
            "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
            isValid && !isSubmitting
              ? "bg-amber-500 text-black hover:bg-amber-400"
              : "bg-white/10 text-white/40 cursor-not-allowed"
          )}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {t("submitting")}
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              {t("submit")}
            </>
          )}
        </button>
      </div>
    </form>
  );
}

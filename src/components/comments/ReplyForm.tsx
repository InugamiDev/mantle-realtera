"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Send, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReplyFormProps {
  commentId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  className?: string;
}

export function ReplyForm({
  commentId,
  onSuccess,
  onCancel,
  className,
}: ReplyFormProps) {
  const t = useTranslations("comments");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (content.trim().length < 5) {
      setError(t("errors.replyMinLength"));
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/v1/comments/${commentId}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: content.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to post reply");
      }

      setContent("");
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.replyFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const charCount = content.length;
  const isValid = charCount >= 5 && charCount <= 1000;

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-2", className)}>
      <div className="relative">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={t("replyPlaceholder")}
          rows={2}
          maxLength={1000}
          autoFocus
          className={cn(
            "w-full rounded-lg border bg-white/5 px-3 py-2 text-sm text-white placeholder-white/40",
            "focus:outline-none focus:ring-2",
            error
              ? "border-red-500/50 focus:ring-red-500/30"
              : "border-white/10 focus:ring-amber-500/30"
          )}
        />
      </div>

      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}

      <div className="flex items-center justify-between">
        <span className={cn(
          "text-xs",
          charCount > 1000 ? "text-red-400" : "text-white/40"
        )}>
          {charCount}/1000
        </span>
        <div className="flex gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs text-white/60 hover:text-white/80"
            >
              <X className="h-3 w-3" />
              {t("cancel")}
            </button>
          )}
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className={cn(
              "inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
              isValid && !isSubmitting
                ? "bg-amber-500 text-black hover:bg-amber-400"
                : "bg-white/10 text-white/40 cursor-not-allowed"
            )}
          >
            {isSubmitting ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Send className="h-3 w-3" />
            )}
            {t("send")}
          </button>
        </div>
      </div>
    </form>
  );
}

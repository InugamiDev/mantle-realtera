"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface CommentRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: "sm" | "md" | "lg";
  readonly?: boolean;
  showValue?: boolean;
}

export function CommentRating({
  value,
  onChange,
  size = "md",
  readonly = false,
  showValue = false,
}: CommentRatingProps) {
  const sizeClasses = {
    sm: "h-3.5 w-3.5",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const handleClick = (rating: number) => {
    if (!readonly && onChange) {
      onChange(rating === value ? 0 : rating);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleClick(star)}
          disabled={readonly}
          className={cn(
            "transition-colors",
            readonly ? "cursor-default" : "cursor-pointer hover:scale-110"
          )}
        >
          <Star
            className={cn(
              sizeClasses[size],
              star <= value
                ? "fill-amber-400 text-amber-400"
                : "fill-transparent text-white/30"
            )}
          />
        </button>
      ))}
      {showValue && value > 0 && (
        <span className="ml-1 text-sm text-white/60">{value.toFixed(1)}</span>
      )}
    </div>
  );
}

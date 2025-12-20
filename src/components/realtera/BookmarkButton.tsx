"use client";

import { Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookmarkButtonProps {
  isBookmarked: boolean;
  onToggle: () => void;
  className?: string;
  size?: "sm" | "default";
}

export function BookmarkButton({
  isBookmarked,
  onToggle,
  className = "",
  size = "default",
}: BookmarkButtonProps) {
  const sizeClasses = {
    sm: "h-7 w-7",
    default: "h-8 w-8",
  };

  const iconSizes = {
    sm: "h-3.5 w-3.5",
    default: "h-4 w-4",
  };

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
      className={cn(
        "flex items-center justify-center rounded-full transition-colors duration-200",
        sizeClasses[size],
        isBookmarked
          ? "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
          : "bg-white/5 text-white/40 hover:bg-amber-500/10 hover:text-amber-300",
        className
      )}
      aria-label={isBookmarked ? "Bỏ lưu" : "Lưu dự án"}
      aria-pressed={isBookmarked}
    >
      <Bookmark
        className={cn(
          iconSizes[size],
          isBookmarked && "fill-current"
        )}
      />
    </button>
  );
}

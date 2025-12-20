"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ThumbsUp, ThumbsDown, MoreHorizontal, Flag, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Author {
  id: string;
  displayName: string | null;
  profileImageUrl: string | null;
}

interface CommentReplyProps {
  id: string;
  content: string;
  authorId: string;
  author: Author;
  createdAt: string;
  upvoteCount: number;
  downvoteCount: number;
  userVote?: number | null;
  currentUserId?: string;
  onDelete?: () => void;
  className?: string;
}

export function CommentReply({
  id,
  content,
  authorId,
  author,
  createdAt,
  upvoteCount,
  downvoteCount,
  userVote,
  currentUserId,
  onDelete,
  className,
}: CommentReplyProps) {
  const t = useTranslations("comments");
  const [showMenu, setShowMenu] = useState(false);
  const [optimisticVote, setOptimisticVote] = useState<number | null>(userVote || null);
  const [optimisticUp, setOptimisticUp] = useState(upvoteCount);
  const [optimisticDown, setOptimisticDown] = useState(downvoteCount);

  const isOwner = currentUserId === authorId;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return t("time.justNow");
    if (diffMins < 60) return t("time.minutesAgo", { count: diffMins });
    if (diffHours < 24) return t("time.hoursAgo", { count: diffHours });
    if (diffDays < 7) return t("time.daysAgo", { count: diffDays });
    return date.toLocaleDateString();
  };

  const handleDelete = async () => {
    if (!confirm(t("confirmDeleteReply"))) return;
    // TODO: Implement delete reply API
    onDelete?.();
    setShowMenu(false);
  };

  return (
    <div className={cn("rounded-lg border border-white/5 bg-white/[0.02] p-3", className)}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          {/* Avatar */}
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 flex items-center justify-center text-xs text-white font-medium">
            {author.profileImageUrl ? (
              <img
                src={author.profileImageUrl}
                alt={author.displayName || "User"}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              (author.displayName?.[0] || "U").toUpperCase()
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-white">
              {author.displayName || t("anonymousUser")}
            </span>
            <span className="text-xs text-white/40">{formatDate(createdAt)}</span>
          </div>
        </div>

        {/* Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 text-white/30 hover:text-white/50 rounded"
          >
            <MoreHorizontal className="h-3 w-3" />
          </button>
          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-full z-20 mt-1 w-28 rounded-lg border border-white/10 bg-zinc-900 py-1 shadow-lg">
                {isOwner ? (
                  <button
                    onClick={handleDelete}
                    className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-red-400 hover:bg-white/5"
                  >
                    <Trash2 className="h-3 w-3" />
                    {t("delete")}
                  </button>
                ) : (
                  <button
                    onClick={() => setShowMenu(false)}
                    className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-white/60 hover:bg-white/5"
                  >
                    <Flag className="h-3 w-3" />
                    {t("report")}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <p className="mt-2 text-sm text-white/70 whitespace-pre-wrap">{content}</p>

      {/* Actions */}
      <div className="mt-2 flex items-center gap-3">
        <button
          className={cn(
            "flex items-center gap-1 text-xs transition-colors",
            optimisticVote === 1
              ? "text-emerald-400"
              : "text-white/40 hover:text-white/60"
          )}
        >
          <ThumbsUp className={cn("h-3 w-3", optimisticVote === 1 && "fill-current")} />
          <span>{optimisticUp}</span>
        </button>
        <button
          className={cn(
            "flex items-center gap-1 text-xs transition-colors",
            optimisticVote === -1
              ? "text-red-400"
              : "text-white/40 hover:text-white/60"
          )}
        >
          <ThumbsDown className={cn("h-3 w-3", optimisticVote === -1 && "fill-current")} />
          <span>{optimisticDown}</span>
        </button>
      </div>
    </div>
  );
}

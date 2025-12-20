"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { MessageCircle, MoreHorizontal, Flag, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { CommentRating } from "./CommentRating";
import { CommentVoteButtons } from "./CommentVoteButtons";
import { ReplyForm } from "./ReplyForm";
import { CommentReply } from "./CommentReply";

interface Author {
  id: string;
  displayName: string | null;
  profileImageUrl: string | null;
}

interface Reply {
  id: string;
  content: string;
  authorId: string;
  author: Author;
  createdAt: string;
  upvoteCount: number;
  downvoteCount: number;
  userVote?: number | null;
}

interface CommentCardProps {
  id: string;
  content: string;
  rating: number | null;
  authorId: string;
  author: Author;
  createdAt: string;
  upvoteCount: number;
  downvoteCount: number;
  replyCount: number;
  userVote: number | null;
  replies?: Reply[];
  currentUserId?: string;
  onDelete?: () => void;
  onUpdate?: () => void;
  className?: string;
}

export function CommentCard({
  id,
  content,
  rating,
  authorId,
  author,
  createdAt,
  upvoteCount,
  downvoteCount,
  replyCount,
  userVote,
  replies = [],
  currentUserId,
  onDelete,
  onUpdate,
  className,
}: CommentCardProps) {
  const t = useTranslations("comments");
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showAllReplies, setShowAllReplies] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [localReplies, setLocalReplies] = useState(replies);
  const [localReplyCount, setLocalReplyCount] = useState(replyCount);

  const isOwner = currentUserId === authorId;
  const displayedReplies = showAllReplies ? localReplies : localReplies.slice(0, 3);
  const hasMoreReplies = localReplyCount > 3;

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

  const handleReplySuccess = () => {
    setShowReplyForm(false);
    setLocalReplyCount((c) => c + 1);
    // Refetch replies
    onUpdate?.();
  };

  const handleDelete = async () => {
    if (!confirm(t("confirmDelete"))) return;

    try {
      const res = await fetch(`/api/v1/comments/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        onDelete?.();
      }
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
    setShowMenu(false);
  };

  const handleReport = async () => {
    const reason = prompt(t("reportReason"));
    if (!reason) return;

    try {
      await fetch(`/api/v1/comments/${id}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "OTHER", details: reason }),
      });
      alert(t("reportSent"));
    } catch (err) {
      console.error("Failed to report:", err);
    }
    setShowMenu(false);
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="rounded-lg border border-white/10 bg-white/5 p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-600/20 flex items-center justify-center text-white font-medium">
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
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-white">
                  {author.displayName || t("anonymousUser")}
                </span>
                {rating && rating > 0 && (
                  <CommentRating value={rating} size="sm" readonly />
                )}
              </div>
              <span className="text-xs text-white/40">{formatDate(createdAt)}</span>
            </div>
          </div>

          {/* Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 text-white/40 hover:text-white/60 rounded"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-full z-20 mt-1 w-36 rounded-lg border border-white/10 bg-zinc-900 py-1 shadow-lg">
                  {isOwner && (
                    <>
                      <button
                        onClick={handleDelete}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-white/5"
                      >
                        <Trash2 className="h-4 w-4" />
                        {t("delete")}
                      </button>
                    </>
                  )}
                  {!isOwner && (
                    <button
                      onClick={handleReport}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-white/60 hover:bg-white/5"
                    >
                      <Flag className="h-4 w-4" />
                      {t("report")}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <p className="mt-3 text-white/80 whitespace-pre-wrap">{content}</p>

        {/* Actions */}
        <div className="mt-4 flex items-center gap-4">
          <CommentVoteButtons
            commentId={id}
            upvoteCount={upvoteCount}
            downvoteCount={downvoteCount}
            userVote={userVote}
            disabled={!currentUserId}
          />
          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white/80"
          >
            <MessageCircle className="h-4 w-4" />
            <span>{t("reply")} ({localReplyCount})</span>
          </button>
        </div>

        {/* Reply Form */}
        {showReplyForm && currentUserId && (
          <div className="mt-4 pl-4 border-l-2 border-white/10">
            <ReplyForm
              commentId={id}
              onSuccess={handleReplySuccess}
              onCancel={() => setShowReplyForm(false)}
            />
          </div>
        )}
      </div>

      {/* Replies */}
      {displayedReplies.length > 0 && (
        <div className="ml-6 space-y-2">
          {displayedReplies.map((reply) => (
            <CommentReply
              key={reply.id}
              {...reply}
              currentUserId={currentUserId}
            />
          ))}
          {hasMoreReplies && !showAllReplies && (
            <button
              onClick={() => setShowAllReplies(true)}
              className="text-sm text-amber-400 hover:text-amber-300"
            >
              {t("showMoreReplies", { count: localReplyCount - 3 })}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

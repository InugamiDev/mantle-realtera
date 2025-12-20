"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface CommentVoteButtonsProps {
  commentId: string;
  upvoteCount: number;
  downvoteCount: number;
  userVote: number | null;
  onVote?: (value: number | null) => void;
  disabled?: boolean;
}

export function CommentVoteButtons({
  commentId,
  upvoteCount,
  downvoteCount,
  userVote,
  onVote,
  disabled = false,
}: CommentVoteButtonsProps) {
  const [isVoting, setIsVoting] = useState(false);
  const [optimisticVote, setOptimisticVote] = useState<number | null>(userVote);
  const [optimisticUp, setOptimisticUp] = useState(upvoteCount);
  const [optimisticDown, setOptimisticDown] = useState(downvoteCount);

  const handleVote = async (value: 1 | -1) => {
    if (disabled || isVoting) return;

    setIsVoting(true);

    // Calculate new counts optimistically
    const wasUpvote = optimisticVote === 1;
    const wasDownvote = optimisticVote === -1;
    const isSameVote = optimisticVote === value;

    let newUp = optimisticUp;
    let newDown = optimisticDown;
    let newVote: number | null = value;

    if (isSameVote) {
      // Toggle off
      newVote = null;
      if (value === 1) newUp--;
      else newDown--;
    } else {
      // New vote or change
      if (value === 1) {
        newUp++;
        if (wasDownvote) newDown--;
      } else {
        newDown++;
        if (wasUpvote) newUp--;
      }
    }

    // Optimistic update
    setOptimisticVote(newVote);
    setOptimisticUp(newUp);
    setOptimisticDown(newDown);

    try {
      const res = await fetch(`/api/v1/comments/${commentId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value }),
      });

      if (!res.ok) {
        // Revert on error
        setOptimisticVote(userVote);
        setOptimisticUp(upvoteCount);
        setOptimisticDown(downvoteCount);
      } else {
        onVote?.(newVote);
      }
    } catch {
      // Revert on error
      setOptimisticVote(userVote);
      setOptimisticUp(upvoteCount);
      setOptimisticDown(downvoteCount);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => handleVote(1)}
        disabled={disabled || isVoting}
        className={cn(
          "flex items-center gap-1.5 text-sm transition-colors",
          optimisticVote === 1
            ? "text-emerald-400"
            : "text-white/50 hover:text-white/80",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <ThumbsUp className={cn("h-4 w-4", optimisticVote === 1 && "fill-current")} />
        <span>{optimisticUp}</span>
      </button>
      <button
        type="button"
        onClick={() => handleVote(-1)}
        disabled={disabled || isVoting}
        className={cn(
          "flex items-center gap-1.5 text-sm transition-colors",
          optimisticVote === -1
            ? "text-red-400"
            : "text-white/50 hover:text-white/80",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <ThumbsDown className={cn("h-4 w-4", optimisticVote === -1 && "fill-current")} />
        <span>{optimisticDown}</span>
      </button>
    </div>
  );
}

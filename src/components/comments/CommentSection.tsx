"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@stackframe/stack";
import { useTranslations } from "next-intl";
import { Loader2, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { CommentForm } from "./CommentForm";
import { CommentCard } from "./CommentCard";
import { CommentSkeleton } from "./CommentSkeleton";
import { CommentEmpty } from "./CommentEmpty";

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

interface Comment {
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
  replies: Reply[];
}

interface CommentSectionProps {
  targetType: "PROJECT" | "DEVELOPER";
  targetId: string;
  targetName: string;
  allowRating?: boolean;
  className?: string;
}

export function CommentSection({
  targetType,
  targetId,
  targetName,
  allowRating = true,
  className,
}: CommentSectionProps) {
  const t = useTranslations("comments");
  const user = useUser();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [sortBy, setSortBy] = useState<"createdAt" | "upvoteCount" | "rating">("createdAt");

  const fetchComments = useCallback(async (pageNum: number, append: boolean = false) => {
    try {
      const params = new URLSearchParams({
        targetType,
        targetId,
        page: pageNum.toString(),
        limit: "10",
        sortBy,
        sortOrder: sortBy === "createdAt" ? "desc" : "desc",
      });

      const res = await fetch(`/api/v1/comments?${params}`);
      if (!res.ok) throw new Error("Failed to fetch comments");

      const data = await res.json();

      if (append) {
        setComments((prev) => [...prev, ...data.data]);
      } else {
        setComments(data.data);
      }
      setHasMore(data.pagination.hasNextPage);
      setTotalCount(data.pagination.totalCount);
    } catch (err) {
      setError(t("errors.loadFailed"));
    }
  }, [targetType, targetId, sortBy, t]);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    setPage(1);
    fetchComments(1).finally(() => setIsLoading(false));
  }, [fetchComments]);

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    const nextPage = page + 1;
    await fetchComments(nextPage, true);
    setPage(nextPage);
    setIsLoadingMore(false);
  };

  const handleNewComment = () => {
    setPage(1);
    fetchComments(1);
  };

  const handleDeleteComment = (commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
    setTotalCount((prev) => prev - 1);
  };

  const currentUserId = user?.id;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          {t("title")} {totalCount > 0 && <span className="text-white/60">({totalCount})</span>}
        </h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30"
        >
          <option value="createdAt">{t("sort.newest")}</option>
          <option value="upvoteCount">{t("sort.mostHelpful")}</option>
          {allowRating && <option value="rating">{t("sort.highestRated")}</option>}
        </select>
      </div>

      {/* Comment Form */}
      {user ? (
        <CommentForm
          targetType={targetType}
          targetId={targetId}
          allowRating={allowRating}
          placeholder={t("placeholder", { name: targetName })}
          onSuccess={handleNewComment}
        />
      ) : (
        <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-center">
          <p className="text-white/60">
            <a href="/handler/sign-in" className="text-amber-400 hover:text-amber-300">
              {t("signIn")}
            </a>
            {" "}{t("toComment")}
          </p>
        </div>
      )}

      {/* Comments List */}
      {isLoading ? (
        <CommentSkeleton count={3} />
      ) : error ? (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-center">
          <p className="text-red-400">{error}</p>
          <button
            onClick={() => fetchComments(1)}
            className="mt-2 text-sm text-red-300 hover:text-red-200"
          >
            {t("retry")}
          </button>
        </div>
      ) : comments.length === 0 ? (
        <CommentEmpty />
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentCard
              key={comment.id}
              {...comment}
              currentUserId={currentUserId}
              onDelete={() => handleDeleteComment(comment.id)}
              onUpdate={handleNewComment}
            />
          ))}

          {/* Load More */}
          {hasMore && (
            <div className="text-center pt-4">
              <button
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10 disabled:opacity-50"
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t("loading")}
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    {t("loadMore")}
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

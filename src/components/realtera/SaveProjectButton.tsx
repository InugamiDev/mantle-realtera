"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useWatchlist } from "@/contexts/WatchlistContext";

interface SaveProjectButtonProps {
  projectSlug: string;
}

export function SaveProjectButton({ projectSlug }: SaveProjectButtonProps) {
  const t = useTranslations("saveButton");
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const isSaved = isInWatchlist(projectSlug);

  return (
    <button
      type="button"
      onClick={() => toggleWatchlist(projectSlug)}
      className={`btn w-full ${isSaved ? "btn-primary" : "btn-secondary"}`}
    >
      {isSaved ? (
        <>
          <BookmarkCheck className="h-4 w-4" aria-hidden="true" />
          {t("saved")}
        </>
      ) : (
        <>
          <Bookmark className="h-4 w-4" aria-hidden="true" />
          {t("save")}
        </>
      )}
    </button>
  );
}

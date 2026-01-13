"use client";

import { createContext, useContext, ReactNode } from "react";
import { useBookmarks } from "@/hooks/useBookmarks";

interface BookmarkContextType {
  bookmarks: string[];
  isLoaded: boolean;
  addBookmark: (slug: string) => void;
  removeBookmark: (slug: string) => void;
  toggleBookmark: (slug: string) => void;
  isBookmarked: (slug: string) => boolean;
  clearBookmarks: () => void;
  count: number;
}

const BookmarkContext = createContext<BookmarkContextType | null>(null);

export function BookmarkProvider({ children }: { children: ReactNode }) {
  const bookmarkState = useBookmarks();

  return (
    <BookmarkContext.Provider value={bookmarkState}>
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarkContext() {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error("useBookmarkContext must be used within a BookmarkProvider");
  }
  return context;
}

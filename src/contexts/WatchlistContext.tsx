"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";

import { useSafeStackUser } from "@/stack/safe-hooks";

interface WatchlistItem {
  projectSlug: string;
  addedAt: string;
  notes?: string;
  alertEnabled: boolean;
  targetPrice?: number;
}

interface WatchlistContextType {
  items: WatchlistItem[];
  isLoaded: boolean;
  isSyncing: boolean;
  isAuthenticated: boolean;
  addToWatchlist: (projectSlug: string, options?: Partial<WatchlistItem>) => void;
  removeFromWatchlist: (projectSlug: string) => void;
  isInWatchlist: (projectSlug: string) => boolean;
  toggleWatchlist: (projectSlug: string) => void;
  updateItem: (projectSlug: string, updates: Partial<WatchlistItem>) => void;
  toggleAlert: (projectSlug: string) => void;
  clearWatchlist: () => void;
  syncWithServer: () => Promise<void>;
  count: number;
}

const WatchlistContext = createContext<WatchlistContextType | null>(null);

const STORAGE_KEY = "realtera_watchlist";

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const user = useSafeStackUser();
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const hasSyncedRef = useRef(false);

  // Load watchlist from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Migrate old bookmark format to watchlist format
        if (Array.isArray(parsed) && parsed.length > 0) {
          if (typeof parsed[0] === "string") {
            // Old format: string[]
            setItems(
              parsed.map((slug: string) => ({
                projectSlug: slug,
                addedAt: new Date().toISOString(),
                alertEnabled: false,
              }))
            );
          } else {
            // New format: WatchlistItem[]
            setItems(parsed);
          }
        }
      }
    } catch (error) {
      console.error("Failed to load watchlist:", error);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      } catch (error) {
        console.error("Failed to save watchlist:", error);
      }
    }
  }, [items, isLoaded]);

  // Sync with server when user logs in
  const syncWithServer = useCallback(async () => {
    if (!user || isSyncing) return;

    setIsSyncing(true);
    try {
      // Get local items to merge
      const localItems = items;

      // Sync with server (PUT merges local with server)
      const res = await fetch("/api/v1/watchlist", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: localItems }),
      });

      if (res.ok) {
        const data = await res.json();
        // Update local state with merged server data
        setItems(
          data.items.map((item: {
            projectSlug: string;
            addedAt: string;
            notes?: string;
            alertEnabled: boolean;
            targetPrice?: number;
          }) => ({
            projectSlug: item.projectSlug,
            addedAt: item.addedAt,
            notes: item.notes,
            alertEnabled: item.alertEnabled,
            targetPrice: item.targetPrice,
          }))
        );
        console.log(`Watchlist synced: ${data.merged} new items merged`);
      }
    } catch (error) {
      console.error("Failed to sync watchlist:", error);
    } finally {
      setIsSyncing(false);
    }
  }, [user, items, isSyncing]);

  // Auto-sync when user logs in (only once per session)
  useEffect(() => {
    if (user && isLoaded && !hasSyncedRef.current) {
      hasSyncedRef.current = true;
      syncWithServer();
    }
  }, [user, isLoaded, syncWithServer]);

  // Server-synced add
  const addToWatchlist = useCallback(
    async (projectSlug: string, options?: Partial<WatchlistItem>) => {
      // Optimistic update
      setItems((prev) => {
        if (prev.some((item) => item.projectSlug === projectSlug)) {
          return prev;
        }
        return [
          ...prev,
          {
            projectSlug,
            addedAt: new Date().toISOString(),
            alertEnabled: false,
            ...options,
          },
        ];
      });

      // Sync to server if logged in
      if (user) {
        try {
          await fetch("/api/v1/watchlist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              projectSlug,
              ...options,
            }),
          });
        } catch (error) {
          console.error("Failed to sync add to server:", error);
        }
      }
    },
    [user]
  );

  // Server-synced remove
  const removeFromWatchlist = useCallback(
    async (projectSlug: string) => {
      // Optimistic update
      setItems((prev) => prev.filter((item) => item.projectSlug !== projectSlug));

      // Sync to server if logged in
      if (user) {
        try {
          await fetch(`/api/v1/watchlist/${projectSlug}`, {
            method: "DELETE",
          });
        } catch (error) {
          console.error("Failed to sync remove to server:", error);
        }
      }
    },
    [user]
  );

  const isInWatchlist = useCallback(
    (projectSlug: string) => {
      return items.some((item) => item.projectSlug === projectSlug);
    },
    [items]
  );

  // Server-synced update
  const updateItem = useCallback(
    async (projectSlug: string, updates: Partial<WatchlistItem>) => {
      // Optimistic update
      setItems((prev) =>
        prev.map((item) =>
          item.projectSlug === projectSlug ? { ...item, ...updates } : item
        )
      );

      // Sync to server if logged in
      if (user) {
        try {
          await fetch(`/api/v1/watchlist/${projectSlug}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updates),
          });
        } catch (error) {
          console.error("Failed to sync update to server:", error);
        }
      }
    },
    [user]
  );

  // Server-synced toggle alert
  const toggleAlert = useCallback(
    async (projectSlug: string) => {
      const item = items.find((i) => i.projectSlug === projectSlug);
      if (!item) return;

      const newAlertEnabled = !item.alertEnabled;

      // Optimistic update
      setItems((prev) =>
        prev.map((i) =>
          i.projectSlug === projectSlug
            ? { ...i, alertEnabled: newAlertEnabled }
            : i
        )
      );

      // Sync to server if logged in
      if (user) {
        try {
          await fetch(`/api/v1/watchlist/${projectSlug}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ alertEnabled: newAlertEnabled }),
          });
        } catch (error) {
          console.error("Failed to sync toggle alert to server:", error);
        }
      }
    },
    [user, items]
  );

  // Server-synced toggle
  const toggleWatchlist = useCallback(
    async (projectSlug: string) => {
      const exists = items.some((item) => item.projectSlug === projectSlug);

      if (exists) {
        await removeFromWatchlist(projectSlug);
      } else {
        await addToWatchlist(projectSlug);
      }
    },
    [items, removeFromWatchlist, addToWatchlist]
  );

  // Server-synced clear
  const clearWatchlist = useCallback(async () => {
    // Optimistic update
    setItems([]);

    // Sync to server if logged in
    if (user) {
      try {
        await fetch("/api/v1/watchlist", {
          method: "DELETE",
        });
      } catch (error) {
        console.error("Failed to sync clear to server:", error);
      }
    }
  }, [user]);

  return (
    <WatchlistContext.Provider
      value={{
        items,
        isLoaded,
        isSyncing,
        isAuthenticated: !!user,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        toggleWatchlist,
        updateItem,
        toggleAlert,
        clearWatchlist,
        syncWithServer,
        count: items.length,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error("useWatchlist must be used within a WatchlistProvider");
  }
  return context;
}

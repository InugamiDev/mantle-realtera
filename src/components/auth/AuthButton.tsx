"use client";

import { Suspense, useState, useRef, useEffect } from "react";
import { useSafeStackUser } from "@/stack/safe-hooks";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, Bookmark, Loader2, User, Settings, LogOut, Briefcase, ChevronDown, Wallet } from "lucide-react";
import { useWatchlist } from "@/contexts/WatchlistContext";
import { useAuth } from "@/providers/UnifiedAuthProvider";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function UserMenu({ user }: { user: any }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const t = useTranslations("userMenu");

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await user.signOut?.();
    router.push("/");
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg bg-white/5 px-2 py-1.5 transition-colors hover:bg-white/10"
      >
        <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-amber-500 to-orange-500">
          {user.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt={user.displayName || "Avatar"}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-sm font-bold text-amber-900">
              {(user.displayName || user.primaryEmail || "U")[0].toUpperCase()}
            </span>
          )}
        </div>
        <ChevronDown className={`h-4 w-4 text-white/60 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-white/10 bg-slate-900/95 shadow-xl backdrop-blur-xl">
          {/* User info */}
          <div className="border-b border-white/10 px-4 py-3">
            <p className="truncate font-medium text-white">
              {user.displayName || t("user")}
            </p>
            <p className="truncate text-sm text-white/50">{user.primaryEmail}</p>
          </div>

          {/* Menu items */}
          <div className="p-2">
            <Link
              href="/account"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <User className="h-4 w-4" />
              <span className="truncate">{t("account")}</span>
            </Link>
            <Link
              href="/portfolio"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Briefcase className="h-4 w-4" />
              <span className="truncate">{t("portfolio")}</span>
            </Link>
            <Link
              href="/account"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Settings className="h-4 w-4" />
              <span className="truncate">{t("settings")}</span>
            </Link>
          </div>

          {/* Sign out */}
          <div className="border-t border-white/10 p-2">
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-400 transition-colors hover:bg-red-500/10"
            >
              <LogOut className="h-4 w-4" />
              <span className="truncate">{t("signOut")}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function AuthButtonInner() {
  const user = useSafeStackUser();
  const { count } = useWatchlist();
  const { openAuthModal, walletAddress } = useAuth();
  const t = useTranslations("auth");

  if (user) {
    return (
      <div className="flex items-center gap-2">
        {/* Wallet indicator (if linked) */}
        {walletAddress && (
          <div className="hidden sm:flex items-center gap-1.5 rounded-lg bg-purple-500/10 px-2.5 py-1.5 text-xs font-medium text-purple-300">
            <Wallet className="h-3.5 w-3.5" />
            <span>{walletAddress.slice(0, 4)}...{walletAddress.slice(-3)}</span>
          </div>
        )}

        {/* Saved projects link */}
        <Link
          href="/saved"
          className="relative flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-amber-500/10 hover:text-amber-300"
        >
          <Bookmark className="h-4 w-4" />
          <span className="hidden sm:inline">{t("saved")}</span>
          {count > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1.5 text-xs font-bold text-amber-900">
              {count}
            </span>
          )}
        </Link>

        {/* Custom user menu */}
        <UserMenu user={user} />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {/* Saved projects link (for anonymous users too) */}
      <Link
        href="/saved"
        className="relative flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-amber-500/10 hover:text-amber-300"
      >
        <Bookmark className="h-4 w-4" />
        <span className="hidden sm:inline">{t("saved")}</span>
        {count > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1.5 text-xs font-bold text-amber-900">
            {count}
          </span>
        )}
      </Link>

      {/* Sign in button - opens unified auth modal */}
      <button
        onClick={openAuthModal}
        className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-sm font-semibold text-amber-900 shadow-lg shadow-amber-500/20 transition-all hover:shadow-amber-500/40 hover:scale-105"
      >
        <LogIn className="h-4 w-4" />
        <span>{t("login")}</span>
      </button>
    </div>
  );
}

function AuthButtonFallback() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-9 w-20 items-center justify-center rounded-lg bg-white/5">
        <Loader2 className="h-4 w-4 animate-spin text-white/40" />
      </div>
    </div>
  );
}

export function AuthButton() {
  return (
    <Suspense fallback={<AuthButtonFallback />}>
      <AuthButtonInner />
    </Suspense>
  );
}

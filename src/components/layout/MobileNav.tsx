"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Home, Building2, Calculator, GitCompare, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWatchlist } from "@/contexts/WatchlistContext";

const navItems = [
  { href: "/", labelKey: "ranking", icon: Home },
  { href: "/developers", labelKey: "developers", icon: Building2 },
  { href: "/calculator", labelKey: "calculator", icon: Calculator },
  { href: "/compare", labelKey: "compare", icon: GitCompare },
  { href: "/saved", labelKey: "saved", icon: Bookmark, showBadge: true },
];

export function MobileNav() {
  const pathname = usePathname();
  const { count } = useWatchlist();
  const t = useTranslations("mobileNav");

  return (
    <nav className="fixed bottom-0 left-0 z-50 w-full overflow-hidden border-t border-white/10 bg-background/80 backdrop-blur-xl lg:hidden">
      <div className="flex w-full items-center justify-evenly overflow-hidden">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center gap-0.5 px-2 py-2 text-[10px] font-medium transition-colors duration-200",
                isActive
                  ? "text-amber-400"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span className="relative">
                <Icon className={cn("h-5 w-5", isActive && "text-amber-400")} />
                {item.showBadge && count > 0 && (
                  <span className="absolute -right-1.5 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[9px] font-bold text-amber-950">
                    {count > 9 ? "9+" : count}
                  </span>
                )}
              </span>
              <span className="whitespace-nowrap">{t(item.labelKey)}</span>
              {isActive && (
                <span className="absolute -top-px left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-amber-400" />
              )}
            </Link>
          );
        })}
      </div>
      {/* Safe area padding for iOS */}
      <div className="pb-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}

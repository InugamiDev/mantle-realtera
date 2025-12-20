"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Menu, X, Sparkles, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { AuthButton } from "@/components/auth/AuthButton";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

interface NavItem {
  href: string;
  labelKey: string;
  disabled?: boolean;
}

// Core navigation - always visible
const navItems: NavItem[] = [
  { href: "/", labelKey: "ranking" },
  { href: "/developers", labelKey: "developers" },
  { href: "/compare", labelKey: "compare" },
];

// Additional features in dropdown
const moreItems: NavItem[] = [
  { href: "/calculator", labelKey: "calculator" },
  { href: "/methodology", labelKey: "methodology" },
  { href: "/market", labelKey: "market" },
  { href: "/advisor", labelKey: "advisor" },
  { href: "/valuation", labelKey: "valuation" },
  { href: "/awards", labelKey: "awards" },
];

// B2B / Pro features - consolidated
const proItems: NavItem[] = [
  { href: "/agency", labelKey: "agency" },
  { href: "/developer/console", labelKey: "developerConsole" },
  { href: "/developer/api", labelKey: "api" },
  { href: "/governance", labelKey: "governance" },
];

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isProOpen, setIsProOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const proRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("nav");

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
      if (proRef.current && !proRef.current.contains(event.target as Node)) {
        setIsProOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const isMoreActive = moreItems.some((item) => pathname === item.href);
  const isProActive = proItems.some((item) => pathname === item.href || pathname.startsWith(item.href + "/"));

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="glass border-b border-white/5">
        <nav className="container-app" aria-label="Main navigation">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="group flex items-center gap-2 text-xl font-bold tracking-tight focus:outline-none shrink-0"
            >
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 shadow-lg shadow-amber-500/20 transition-all duration-200 group-hover:shadow-amber-500/40 group-hover:scale-105">
                <Sparkles className="h-4 w-4 text-amber-900" />
              </div>
              <span className="hidden sm:block bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 bg-clip-text text-transparent">
                RealTera
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn("nav-link", isActive && "nav-link-active")}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {t(item.labelKey)}
                  </Link>
                );
              })}

              {/* More Dropdown */}
              <div className="relative" ref={moreRef}>
                <button
                  onClick={() => setIsMoreOpen(!isMoreOpen)}
                  className={cn(
                    "nav-link flex items-center gap-1",
                    isMoreActive && "nav-link-active"
                  )}
                  aria-expanded={isMoreOpen}
                >
                  {t("more")}
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 transition-transform",
                      isMoreOpen && "rotate-180"
                    )}
                  />
                </button>
                {isMoreOpen && (
                  <div className="absolute left-0 top-full mt-2 w-48 rounded-xl border border-white/10 bg-background/95 backdrop-blur-xl shadow-xl py-1">
                    {moreItems.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "block px-4 py-2 text-sm text-foreground/80 hover:bg-white/10",
                            isActive && "bg-amber-500/10 text-amber-400"
                          )}
                          onClick={() => setIsMoreOpen(false)}
                        >
                          {t(item.labelKey)}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Pro/B2B Dropdown */}
              <div className="relative" ref={proRef}>
                <button
                  onClick={() => setIsProOpen(!isProOpen)}
                  className={cn(
                    "nav-link flex items-center gap-1",
                    isProActive && "nav-link-active"
                  )}
                  aria-expanded={isProOpen}
                >
                  <span className="bg-gradient-to-r from-cyan-400 to-amber-400 bg-clip-text text-transparent font-medium">
                    {t("pro")}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 transition-transform text-cyan-400",
                      isProOpen && "rotate-180"
                    )}
                  />
                </button>
                {isProOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-cyan-500/20 bg-background/95 backdrop-blur-xl shadow-xl py-1">
                    {proItems.map((item) => {
                      const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "block px-4 py-2 text-sm text-foreground/80 hover:bg-cyan-500/10",
                            isActive && "bg-cyan-500/10 text-cyan-400"
                          )}
                          onClick={() => setIsProOpen(false)}
                        >
                          {t(item.labelKey)}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right side - Auth & Language */}
            <div className="flex items-center gap-2">
              <div className="hidden sm:block">
                <LanguageSwitcher />
              </div>
              <AuthButton />

              {/* Mobile menu button */}
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-xl p-2 text-white/80 hover:bg-amber-500/10 focus:outline-none lg:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-expanded={isMobileMenuOpen}
                aria-label={isMobileMenuOpen ? t("closeMenu") : t("openMenu")}
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="border-t border-white/5 pb-4 pt-2 lg:hidden">
              <div className="flex flex-col gap-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn("nav-link block w-full", isActive && "nav-link-active")}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {t(item.labelKey)}
                    </Link>
                  );
                })}

                {/* More Items - Mobile */}
                <div className="mt-2 pt-2 border-t border-white/5">
                  <span className="px-3 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {t("more")}
                  </span>
                  {moreItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn("nav-link block w-full", isActive && "nav-link-active")}
                      >
                        {t(item.labelKey)}
                      </Link>
                    );
                  })}
                </div>

                {/* Pro Items - Mobile */}
                <div className="mt-2 pt-2 border-t border-cyan-500/20">
                  <span className="px-3 py-1 text-xs font-medium uppercase tracking-wider bg-gradient-to-r from-cyan-400 to-amber-400 bg-clip-text text-transparent">
                    {t("pro")}
                  </span>
                  {proItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "nav-link block w-full",
                          isActive && "text-cyan-400 bg-cyan-500/10"
                        )}
                      >
                        {t(item.labelKey)}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Language switcher - mobile */}
              <div className="mt-4 pt-4 border-t border-white/5 sm:hidden">
                <LanguageSwitcher />
              </div>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

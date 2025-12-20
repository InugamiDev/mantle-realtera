"use client";

import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Info } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export interface DisclosureTooltipProps {
  className?: string;
}

export function DisclosureTooltip({ className }: DisclosureTooltipProps) {
  const t = useTranslations("sponsoredDisclosure");
  const [isOpen, setIsOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Close on escape
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen]);

  return (
    <span className={cn("relative inline-flex items-center", className)}>
      <span className="sponsored-badge">
        {t("badge")}
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setIsOpen(false)}
          className="ml-1 rounded-full p-0.5 hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={t("ariaLabel")}
          aria-expanded={isOpen}
          aria-describedby="sponsored-tooltip"
        >
          <Info className="h-3 w-3" aria-hidden="true" />
        </button>
      </span>

      {isOpen && (
        <div
          ref={tooltipRef}
          id="sponsored-tooltip"
          role="tooltip"
          className="absolute left-full top-1/2 z-50 ml-2 w-64 -translate-y-1/2 rounded-lg bg-foreground p-3 text-xs text-background shadow-lg"
        >
          <p className="font-medium">{t("tooltipTitle")}</p>
          <p className="mt-1 opacity-80">{t("tooltipDescription")}</p>
          <div className="absolute -left-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rotate-45 bg-foreground" />
        </div>
      )}
    </span>
  );
}

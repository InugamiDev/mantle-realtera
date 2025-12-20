"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { EvidenceLink } from "@/lib/types";
import { GlassCard } from "./GlassCard";

export interface EvidenceListProps {
  links: EvidenceLink[];
  className?: string;
}

export function EvidenceList({ links, className }: EvidenceListProps) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("evidenceList");

  if (links.length === 0) {
    return null;
  }

  return (
    <GlassCard nested className={cn("p-4", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-left"
        aria-expanded={isOpen}
      >
        <div>
          <h3 className="font-semibold text-foreground">{t("title")}</h3>
          <p className="text-sm text-muted-foreground">{t("count", { count: links.length })}</p>
        </div>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
        )}
      </button>

      {isOpen && (
        <ul className="mt-4 space-y-2 border-t border-border/50 pt-4">
          {links.map((link, index) => (
            <li key={index}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-2 rounded-lg p-2 text-sm transition-colors hover:bg-background/50"
              >
                <ExternalLink className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground group-hover:text-primary" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <span className="block truncate font-medium text-foreground group-hover:text-primary">
                    {link.title}
                  </span>
                  <span className="block text-xs text-muted-foreground">{link.domain}</span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </GlassCard>
  );
}

"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { formatDate } from "@/lib/format";
import type { HistoryEvent } from "@/lib/types";
import { GlassCard } from "./GlassCard";

export interface HistoryTimelineProps {
  events: HistoryEvent[];
  className?: string;
}

export function HistoryTimeline({ events, className }: HistoryTimelineProps) {
  const t = useTranslations("historyTimeline");
  const [isOpen, setIsOpen] = useState(false);

  if (events.length === 0) {
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
          <p className="text-sm text-muted-foreground">{t("eventCount", { count: events.length })}</p>
        </div>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
        )}
      </button>

      {isOpen && (
        <div className="mt-4 border-t border-border/50 pt-4">
          <ol className="relative border-l border-border/50 pl-4">
            {events.map((event, index) => (
              <li key={index} className="mb-4 last:mb-0">
                <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border-2 border-background bg-muted-foreground" />
                <time className="text-xs text-muted-foreground">{formatDate(event.date)}</time>
                <p className="mt-1 text-sm font-medium text-foreground">{event.event}</p>
                {event.tierChange && (
                  <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {event.tierChange.split("→")[0]?.trim()}
                    <ArrowRight className="h-3 w-3" aria-hidden="true" />
                    {event.tierChange.split("→")[1]?.trim()}
                  </p>
                )}
                {event.scoreChange && (
                  <p className="mt-1 text-xs text-muted-foreground">{t("score")}: {event.scoreChange}</p>
                )}
              </li>
            ))}
          </ol>
        </div>
      )}
    </GlassCard>
  );
}

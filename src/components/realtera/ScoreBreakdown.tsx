"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ScoreCategory } from "@/lib/types";
import { GlassCard } from "./GlassCard";
import { useTranslations } from "next-intl";

export interface ScoreBreakdownProps {
  totalScore: number;
  categories: ScoreCategory[];
  className?: string;
}

export function ScoreBreakdown({ totalScore, categories, className }: ScoreBreakdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("scoreBreakdown");

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
          <p className="text-sm text-muted-foreground">
            {t("totalScore")}: <span className="font-bold text-foreground">{totalScore}/100</span>
          </p>
        </div>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
        )}
      </button>

      {isOpen && (
        <div className="mt-4 space-y-3 border-t border-border/50 pt-4">
          {categories.map((category) => {
            const percentage = (category.score / category.maxScore) * 100;
            const getColorClass = () => {
              if (percentage >= 80) return "bg-emerald-500";
              if (percentage >= 60) return "bg-amber-500";
              return "bg-red-500";
            };

            return (
              <div key={category.category}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{category.category}</span>
                  <span className="font-medium text-foreground">
                    {category.score}/{category.maxScore}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn("h-full rounded-full transition-all", getColorClass())}
                    style={{ width: `${percentage}%` }}
                    role="progressbar"
                    aria-valuenow={category.score}
                    aria-valuemin={0}
                    aria-valuemax={category.maxScore}
                    aria-label={`${category.category}: ${category.score} ${t("of")} ${category.maxScore}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </GlassCard>
  );
}

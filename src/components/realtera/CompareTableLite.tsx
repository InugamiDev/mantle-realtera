"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import type { Project } from "@/lib/types";
import type { AttestationSummary } from "@/lib/attestation-registry";
import { TierBadge } from "./TierBadge";
import { SignalChip } from "./SignalChip";
import { AttestationBadge } from "./AttestationBadge";
import { GlassCard } from "./GlassCard";
import { ArrowRight } from "lucide-react";

export interface CompareTableLiteProps {
  projectA: Project;
  projectB: Project;
  attestationA?: AttestationSummary | null;
  attestationB?: AttestationSummary | null;
  className?: string;
}

interface CompareRowProps {
  label: string;
  valueA: React.ReactNode;
  valueB: React.ReactNode;
  highlight?: "a" | "b" | "equal" | "none";
}

function CompareRow({ label, valueA, valueB, highlight = "none" }: CompareRowProps) {
  return (
    <div className="grid grid-cols-3 gap-4 border-b border-border/50 py-3 last:border-0">
      <div className="text-sm font-medium text-muted-foreground">{label}</div>
      <div
        className={cn(
          "text-sm",
          highlight === "a" && "font-semibold text-emerald-600",
          highlight !== "a" && "text-foreground"
        )}
      >
        {valueA}
      </div>
      <div
        className={cn(
          "text-sm",
          highlight === "b" && "font-semibold text-emerald-600",
          highlight !== "b" && "text-foreground"
        )}
      >
        {valueB}
      </div>
    </div>
  );
}

export function CompareTableLite({ projectA, projectB, attestationA, attestationB, className }: CompareTableLiteProps) {
  const t = useTranslations("compareTable");
  const tCard = useTranslations("projectCard");

  const getScoreHighlight = (a: number, b: number): "a" | "b" | "equal" => {
    if (a > b) return "a";
    if (b > a) return "b";
    return "equal";
  };

  // Map ROI labels to translation keys
  const getRoiKey = (roi: string): "strong" | "medium" | "weak" => {
    if (roi === "Strong" || roi === "Mạnh") return "strong";
    if (roi === "Average" || roi === "Trung bình" || roi === "Medium") return "medium";
    return "weak";
  };

  const roiColorClass = (roi: string) => {
    const key = getRoiKey(roi);
    const classes = {
      strong: "bg-emerald-500/10 text-emerald-700",
      medium: "bg-amber-500/10 text-amber-700",
      weak: "bg-red-500/10 text-red-700",
    };
    return classes[key] || "";
  };

  return (
    <GlassCard className={cn("p-6", className)}>
      {/* Header with project names and tier badges */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div />
        <div className="flex flex-col items-center gap-2">
          <TierBadge tier={projectA.tier} />
          <span className="text-center text-sm font-semibold text-foreground">{projectA.name}</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <TierBadge tier={projectB.tier} />
          <span className="text-center text-sm font-semibold text-foreground">{projectB.name}</span>
        </div>
      </div>

      {/* Comparison rows */}
      <div className="space-y-0">
        <CompareRow
          label={t("verdict")}
          valueA={<span className="line-clamp-2">{projectA.verdict}</span>}
          valueB={<span className="line-clamp-2">{projectB.verdict}</span>}
        />

        <CompareRow
          label={t("score")}
          valueA={`${projectA.score}/100`}
          valueB={`${projectB.score}/100`}
          highlight={getScoreHighlight(projectA.score, projectB.score)}
        />

        <CompareRow
          label={t("attestation")}
          valueA={
            attestationA ? (
              <AttestationBadge attestation={attestationA} size="sm" locale="vi" />
            ) : (
              <span className="text-xs text-muted-foreground">{t("unverified")}</span>
            )
          }
          valueB={
            attestationB ? (
              <AttestationBadge attestation={attestationB} size="sm" locale="vi" />
            ) : (
              <span className="text-xs text-muted-foreground">{t("unverified")}</span>
            )
          }
          highlight={
            attestationA && attestationB
              ? getScoreHighlight(attestationA.tier, attestationB.tier)
              : attestationA
                ? "a"
                : attestationB
                  ? "b"
                  : "none"
          }
        />

        <CompareRow
          label={t("legal")}
          valueA={<SignalChip type="legal" value={projectA.signals.legal} quality={projectA.signals.legal} />}
          valueB={<SignalChip type="legal" value={projectB.signals.legal} quality={projectB.signals.legal} />}
        />

        <CompareRow
          label={t("price")}
          valueA={<SignalChip type="price" value={projectA.signals.price} />}
          valueB={<SignalChip type="price" value={projectB.signals.price} />}
        />

        <CompareRow
          label={t("liquidity")}
          valueA={<SignalChip type="liquidity" value={projectA.signals.liquidity} quality={projectA.signals.liquidity} />}
          valueB={<SignalChip type="liquidity" value={projectB.signals.liquidity} quality={projectB.signals.liquidity} />}
        />

        <CompareRow
          label={t("roi")}
          valueA={
            <span className={cn("inline-block rounded-full px-2 py-0.5 text-xs font-medium", roiColorClass(projectA.roiLabel))}>
              {tCard(getRoiKey(projectA.roiLabel))}
            </span>
          }
          valueB={
            <span className={cn("inline-block rounded-full px-2 py-0.5 text-xs font-medium", roiColorClass(projectB.roiLabel))}>
              {tCard(getRoiKey(projectB.roiLabel))}
            </span>
          }
        />

        <CompareRow
          label={t("sources")}
          valueA={t("sourceCount", { count: projectA.sourceCount })}
          valueB={t("sourceCount", { count: projectB.sourceCount })}
          highlight={getScoreHighlight(projectA.sourceCount, projectB.sourceCount)}
        />

        {/* Best for bullets */}
        <div className="grid grid-cols-3 gap-4 border-b border-border/50 py-3">
          <div className="text-sm font-medium text-muted-foreground">{t("bestFor")}</div>
          <div className="text-sm text-foreground">
            {projectA.bestForBullets?.length ? (
              <ul className="list-inside list-disc space-y-1">
                {projectA.bestForBullets.slice(0, 2).map((b, i) => (
                  <li key={i} className="text-xs text-muted-foreground">{b}</li>
                ))}
              </ul>
            ) : (
              <span className="text-muted-foreground">—</span>
            )}
          </div>
          <div className="text-sm text-foreground">
            {projectB.bestForBullets?.length ? (
              <ul className="list-inside list-disc space-y-1">
                {projectB.bestForBullets.slice(0, 2).map((b, i) => (
                  <li key={i} className="text-xs text-muted-foreground">{b}</li>
                ))}
              </ul>
            ) : (
              <span className="text-muted-foreground">—</span>
            )}
          </div>
        </div>
      </div>

      {/* CTA row */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div />
        <Link
          href={`/project/${projectA.slug}`}
          className="btn btn-secondary text-sm"
        >
          {t("viewDetails")}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        <Link
          href={`/project/${projectB.slug}`}
          className="btn btn-secondary text-sm"
        >
          {t("viewDetails")}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </GlassCard>
  );
}

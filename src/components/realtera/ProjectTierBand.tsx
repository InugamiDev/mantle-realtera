"use client";

import { cn } from "@/lib/utils";
import { TIERS, getTierDisplayName } from "@/lib/tier";
import type { TierLevel, Project } from "@/lib/types";
import type { AttestationSummary } from "@/lib/attestation-registry";
import { ProjectCard } from "./ProjectCard";
import { TierBadge } from "./TierBadge";
import { useWatchlist } from "@/contexts/WatchlistContext";

export interface ProjectTierBandProps {
  tier: TierLevel;
  projects: Project[];
  attestations?: Record<string, AttestationSummary | null>;
  className?: string;
}

export function ProjectTierBand({ tier, projects, attestations, className }: ProjectTierBandProps) {
  const tierInfo = TIERS[tier];
  const projectCount = projects.length;
  const { isInWatchlist, toggleWatchlist } = useWatchlist();

  if (projectCount === 0) {
    return null;
  }

  return (
    <section className={cn("mb-8", className)} aria-labelledby={`tier-${tier}-heading`}>
      {/* Tier band header */}
      <header className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <TierBadge tier={tier} size="lg" />
          <div>
            <h2
              id={`tier-${tier}-heading`}
              className="text-lg font-bold text-foreground"
            >
              {getTierDisplayName(tier)} ({projectCount})
            </h2>
            <p className="text-sm text-muted-foreground">{tierInfo.description}</p>
          </div>
        </div>
      </header>

      {/* Cards container - responsive grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {projects.map((project) => (
          <ProjectCard
            key={project.slug}
            project={project}
            isBookmarked={isInWatchlist(project.slug)}
            onToggleBookmark={() => toggleWatchlist(project.slug)}
            attestation={attestations?.[project.slug] ?? null}
          />
        ))}
      </div>
    </section>
  );
}

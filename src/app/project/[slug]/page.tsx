import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ArrowLeft, MapPin, GitCompare } from "lucide-react";
import { getProjectBySlug } from "@/lib/data";
import { getAttestationBySlug } from "@/lib/attestation-service";
import { formatDate } from "@/lib/format";
import { TIERS } from "@/lib/tier";
import { GlassCard } from "@/components/realtera/GlassCard";
import { TierBadge } from "@/components/realtera/TierBadge";
import { VerificationBadge } from "@/components/realtera/VerificationBadge";
import { AttestationBadge } from "@/components/realtera/AttestationBadge";
import { AttestationDetails } from "@/components/realtera/AttestationDetails";
import { SignalChip } from "@/components/realtera/SignalChip";
import { DisclosureTooltip } from "@/components/realtera/DisclosureTooltip";
import { ScoreBreakdown } from "@/components/realtera/ScoreBreakdown";
import { EvidenceList } from "@/components/realtera/EvidenceList";
import { HistoryTimeline } from "@/components/realtera/HistoryTimeline";
import { LegalStageBadge } from "@/components/realtera/LegalStageBadge";
import { DataQualityIndicator } from "@/components/realtera/DataQualityIndicator";
import { SaveProjectButton } from "@/components/realtera/SaveProjectButton";
import { QualityOfLifeCard } from "@/components/realtera/QualityOfLifeCard";
import { CommentSection } from "@/components/comments";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const [project, attestation, t] = await Promise.all([
    getProjectBySlug(slug),
    getAttestationBySlug(slug),
    getTranslations("projectPage"),
  ]);

  if (!project) {
    notFound();
  }

  const tierInfo = TIERS[project.tier];

  const roiColorClass = {
    "Strong": "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    "Average": "bg-amber-500/15 text-amber-400 border-amber-500/30",
    "Weak": "bg-red-500/15 text-red-400 border-red-500/30",
    Fail: "bg-red-600/15 text-red-400 border-red-600/30",
  }[project.roiLabel];

  // Get ROI percentage from investmentMetrics
  const roiPercentage = project.investmentMetrics
    ? `${project.investmentMetrics.estimatedRoiMin}% - ${project.investmentMetrics.estimatedRoiMax}%`
    : null;

  return (
    <div className="container-app py-8">
      {/* Back link */}
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {t("backToRankings")}
      </Link>

      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <TierBadge tier={project.tier} size="lg" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{project.name}</h1>
                {project.sponsored && <DisclosureTooltip />}
              </div>
              <p className="mt-1 flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                {project.district}, {project.city}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start gap-2 sm:items-end">
            <div className="flex items-center gap-2">
              <VerificationBadge status={project.verificationStatus} />
              {attestation && (
                <AttestationBadge attestation={attestation} size="md" locale="vi" />
              )}
            </div>
            <span className="text-sm text-muted-foreground">
              {t("updated")}: {formatDate(project.updatedAt)} • {t("sources")}: {project.sourceCount}
            </span>
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content (2 columns on large screens) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Layer 1: Always visible, high signal */}
          <GlassCard className="p-6">
            <p className="mb-4 text-lg font-medium text-foreground">{project.verdict}</p>

            <div className="mb-4 flex flex-wrap gap-2">
              <SignalChip type="legal" value={project.signals.legal} quality={project.signals.legal} />
              <SignalChip type="price" value={project.signals.price} />
              <SignalChip type="liquidity" value={project.signals.liquidity} quality={project.signals.liquidity} />
            </div>

            <div className="grid grid-cols-3 gap-4 border-t border-border/50 pt-4">
              <div>
                <span className="mb-1.5 block text-sm text-muted-foreground">{t("score")}</span>
                <p className="text-2xl font-bold leading-none text-foreground">{project.score}/100</p>
              </div>
              <div>
                <span className="mb-1.5 block text-sm text-muted-foreground">{t("potentialRoi")}</span>
                {roiPercentage ? (
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-semibold ${
                    project.investmentMetrics && project.investmentMetrics.estimatedRoiMin >= 0
                      ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                      : "border-red-500/50 bg-red-500/10 text-red-400"
                  }`}>
                    {project.investmentMetrics && project.investmentMetrics.estimatedRoiMin >= 0 ? "+" : ""}{roiPercentage}
                  </span>
                ) : (
                  <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold ${roiColorClass}`}>
                    {project.roiLabel}
                  </span>
                )}
              </div>
              <div>
                <span className="mb-1.5 block text-sm text-muted-foreground">{t("ranking")}</span>
                <p className="text-lg font-medium leading-none text-foreground">{tierInfo.label}</p>
              </div>
            </div>
          </GlassCard>

          {/* Layer 2: Visible, actionable */}
          {/* Why this tier */}
          {project.whyBullets.length > 0 && (
            <GlassCard className="p-6">
              <h2 className="mb-4 text-lg font-bold text-foreground">{t("whyThisTier")}</h2>
              <ul className="space-y-3">
                {project.whyBullets.map((bullet, index) => (
                  <li key={index} className="flex gap-3 text-muted-foreground leading-relaxed">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          )}

          {/* Key risks */}
          {project.keyRisks.length > 0 && (
            <GlassCard nested variant="warning" className="p-6">
              <h2 className="mb-4 text-lg font-bold text-foreground">{t("keyRisks")}</h2>
              <ul className="space-y-3">
                {project.keyRisks.map((risk, index) => (
                  <li key={index} className="flex gap-3 text-amber-200 leading-relaxed">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden="true" />
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          )}

          {/* Best for */}
          {project.bestForBullets && project.bestForBullets.length > 0 && (
            <GlassCard className="p-6">
              <h2 className="mb-4 text-lg font-bold text-foreground">{t("suitableFor")}</h2>
              <ul className="space-y-3">
                {project.bestForBullets.map((bullet, index) => (
                  <li key={index} className="flex gap-3 text-muted-foreground leading-relaxed">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" aria-hidden="true" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          )}

          {/* Quality of Life */}
          {project.qualityOfLife && (
            <GlassCard className="p-6">
              <h2 className="mb-4 text-lg font-bold text-foreground">{t("qualityOfLife")}</h2>
              <QualityOfLifeCard metrics={project.qualityOfLife} />
            </GlassCard>
          )}

          {/* Project Details - Researched Data */}
          {project.projectDetails && (
            <GlassCard className="p-6">
              <h2 className="mb-4 text-lg font-bold text-foreground">{t("projectDetails")}</h2>

              {/* Key Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {project.projectDetails.totalUnits && (
                  <div className="text-center p-3 rounded-lg bg-white/5">
                    <div className="text-2xl font-bold text-primary">{project.projectDetails.totalUnits.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">{t("totalUnits")}</div>
                  </div>
                )}
                {project.projectDetails.towers !== undefined && project.projectDetails.towers > 0 && (
                  <div className="text-center p-3 rounded-lg bg-white/5">
                    <div className="text-2xl font-bold text-primary">{project.projectDetails.towers}</div>
                    <div className="text-xs text-muted-foreground">{t("towers")}</div>
                  </div>
                )}
                {project.projectDetails.floors && (
                  <div className="text-center p-3 rounded-lg bg-white/5">
                    <div className="text-2xl font-bold text-primary">{project.projectDetails.floors}</div>
                    <div className="text-xs text-muted-foreground">{t("floors")}</div>
                  </div>
                )}
                {project.projectDetails.completionYear && (
                  <div className="text-center p-3 rounded-lg bg-white/5">
                    <div className="text-2xl font-bold text-primary">{project.projectDetails.completionYear}</div>
                    <div className="text-xs text-muted-foreground">{t("completionYear")}</div>
                  </div>
                )}
              </div>

              {/* Unit Info */}
              {(project.projectDetails.unitSizes || project.projectDetails.bedrooms) && (
                <div className="mb-6 p-4 rounded-lg bg-white/5">
                  <h3 className="text-sm font-semibold text-foreground mb-2">{t("unitTypes")}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {project.projectDetails.unitSizes && (
                      <span>{t("area")}: {project.projectDetails.unitSizes.min} - {project.projectDetails.unitSizes.max} m²</span>
                    )}
                    {project.projectDetails.bedrooms && (
                      <span>{t("bedrooms")}: {project.projectDetails.bedrooms}</span>
                    )}
                  </div>
                </div>
              )}

              {/* Status */}
              {project.projectDetails.status && (
                <div className="mb-6">
                  <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold ${
                    project.projectDetails.status === "Đã bàn giao"
                      ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                      : project.projectDetails.status === "Đang bán" || project.projectDetails.status === "Đang xây dựng"
                      ? "border-amber-500/50 bg-amber-500/10 text-amber-400"
                      : "border-blue-500/50 bg-blue-500/10 text-blue-400"
                  }`}>
                    {project.projectDetails.status}
                  </span>
                </div>
              )}

              {/* Amenities */}
              {project.projectDetails.amenities && project.projectDetails.amenities.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-foreground mb-3">{t("amenities")}</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.projectDetails.amenities.map((amenity, index) => (
                      <span key={index} className="inline-flex items-center rounded-full bg-primary/10 border border-primary/30 px-3 py-1 text-xs text-primary">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Highlights */}
              {project.projectDetails.highlights && project.projectDetails.highlights.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3">{t("highlights")}</h3>
                  <ul className="space-y-2">
                    {project.projectDetails.highlights.map((highlight, index) => (
                      <li key={index} className="flex gap-2 text-sm text-muted-foreground">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" aria-hidden="true" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </GlassCard>
          )}

          {/* Layer 3: Detailed breakdowns */}
          <div className="space-y-4">
            {project.scoreBreakdown && (
              <ScoreBreakdown totalScore={project.score} categories={project.scoreBreakdown} />
            )}
            {project.evidenceLinks && <EvidenceList links={project.evidenceLinks} />}
            {project.history && <HistoryTimeline events={project.history} />}
          </div>
        </div>

        {/* Sidebar (1 column on large screens) */}
        <div className="space-y-6">
          {/* Actions */}
          <GlassCard className="p-5">
            <h2 className="mb-4 font-bold text-foreground">{t("actions")}</h2>
            <div className="space-y-3">
              <Link
                href={`/compare?a=${project.slug}`}
                className="btn btn-primary w-full"
              >
                <GitCompare className="h-4 w-4" aria-hidden="true" />
                {t("compare")}
              </Link>
              <SaveProjectButton projectSlug={project.slug} />
            </div>
          </GlassCard>

          {/* Blockchain Attestation */}
          {attestation && (
            <AttestationDetails
              attestation={attestation}
              projectName={project.name}
              locale="vi"
            />
          )}

          {/* Quick info */}
          <GlassCard className="p-5">
            <h2 className="mb-4 font-bold text-foreground">{t("quickInfo")}</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">{t("district")}</dt>
                <dd className="font-medium text-foreground">{project.district}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">{t("city")}</dt>
                <dd className="font-medium text-foreground">{project.city}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">{t("price")}</dt>
                <dd className="font-medium text-foreground">{project.signals.price}</dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="text-muted-foreground">{t("legal")}</dt>
                <dd>{project.legalStage ? <LegalStageBadge stage={project.legalStage} /> : <span className="font-medium text-foreground">{project.signals.legal}</span>}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">{t("liquidity")}</dt>
                <dd className="font-medium text-foreground">{project.signals.liquidity}</dd>
              </div>
              {project.dataQuality && (
                <div className="flex justify-between items-center">
                  <dt className="text-muted-foreground">{t("dataQuality")}</dt>
                  <dd><DataQualityIndicator quality={project.dataQuality} /></dd>
                </div>
              )}
            </dl>
          </GlassCard>
        </div>
      </div>

      {/* Comments Section */}
      <section className="mt-12">
        <GlassCard className="p-6">
          <h2 className="mb-6 text-xl font-bold text-foreground">
            {t("reviewsAndComments")}
          </h2>
          <CommentSection
            targetType="PROJECT"
            targetId={project.slug}
            targetName={project.name}
            allowRating={true}
          />
        </GlassCard>
      </section>
    </div>
  );
}

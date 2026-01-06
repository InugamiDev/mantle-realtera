import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowLeft, Shield, Scale, Eye, AlertTriangle, Clock, Users } from "lucide-react";
import { GlassCard } from "@/components/realtera/GlassCard";
import { SCORE_COMPONENTS, SCORE_COMPONENT_ORDER, SCORING_METHODOLOGY_VERSION } from "@/lib/tier";

export async function generateMetadata() {
  const t = await getTranslations("governance");
  return {
    title: `${t("title")} | RealTera`,
    description: t("subtitle"),
  };
}

export default async function GovernancePage() {
  const t = await getTranslations("governance");

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

      {/* Page Header */}
      <header className="page-header">
        <h1 className="page-title">{t("title")}</h1>
        <p className="page-subtitle">{t("subtitle")}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("methodologyVersion")}: {SCORING_METHODOLOGY_VERSION}
        </p>
      </header>

      {/* Main content */}
      <div className="space-y-8">
        {/* Core Principles */}
        <GlassCard className="p-6">
          <div className="mb-4 flex items-center gap-3">
            <Shield className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-bold text-foreground">
              {t("corePrinciples.title")}
            </h2>
          </div>
          <div className="space-y-4">
            <div className="rounded-lg bg-muted/50 p-4">
              <h3 className="font-semibold text-foreground">
                {t("corePrinciples.ratingsFirst.title")}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("corePrinciples.ratingsFirst.description")}
              </p>
            </div>
            <div className="rounded-lg bg-muted/50 p-4">
              <h3 className="font-semibold text-foreground">
                {t("corePrinciples.noInvestmentPromises.title")}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("corePrinciples.noInvestmentPromises.description")}
              </p>
            </div>
            <div className="rounded-lg bg-muted/50 p-4">
              <h3 className="font-semibold text-foreground">
                {t("corePrinciples.commercialIsolation.title")}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("corePrinciples.commercialIsolation.description")}
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Scoring Methodology */}
        <GlassCard className="p-6">
          <div className="mb-4 flex items-center gap-3">
            <Scale className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-bold text-foreground">
              {t("scoringMethodology.title")}
            </h2>
          </div>
          <p className="mb-4 text-muted-foreground">
            {t("scoringMethodology.description")}
          </p>
          <div className="space-y-3">
            {SCORE_COMPONENT_ORDER.map((name) => {
              const component = SCORE_COMPONENTS[name];
              return (
                <div key={name} className="flex items-start gap-4 rounded-lg bg-muted/50 p-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-sm font-bold text-primary">
                      {Math.round(component.weight * 100)}%
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {component.displayName} ({component.displayNameEn})
                    </h3>
                    <p className="text-sm text-muted-foreground">{component.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-500" />
              <div>
                <p className="font-medium text-amber-500">
                  {t("scoringMethodology.roiRemoved.title")}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("scoringMethodology.roiRemoved.description")}
                </p>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Conflict of Interest Policy */}
        <GlassCard className="p-6">
          <div className="mb-4 flex items-center gap-3">
            <Eye className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-bold text-foreground">
              {t("conflictOfInterest.title")}
            </h2>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-foreground">
                {t("conflictOfInterest.dataIsolation.title")}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("conflictOfInterest.dataIsolation.description")}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                {t("conflictOfInterest.noRankingInfluence.title")}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("conflictOfInterest.noRankingInfluence.description")}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                {t("conflictOfInterest.disclosureRequirements.title")}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("conflictOfInterest.disclosureRequirements.description")}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                {t("conflictOfInterest.awardsTransparency.title")}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("conflictOfInterest.awardsTransparency.description")}
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Audit Trail */}
        <GlassCard className="p-6">
          <div className="mb-4 flex items-center gap-3">
            <Clock className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-bold text-foreground">
              {t("auditTrail.title")}
            </h2>
          </div>
          <p className="mb-4 text-muted-foreground">
            {t("auditTrail.description")}
          </p>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                1
              </div>
              <div>
                <h4 className="font-medium text-foreground">
                  {t("auditTrail.scoreRunRecords.title")}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {t("auditTrail.scoreRunRecords.description")}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                2
              </div>
              <div>
                <h4 className="font-medium text-foreground">
                  {t("auditTrail.evidenceMapping.title")}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {t("auditTrail.evidenceMapping.description")}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                3
              </div>
              <div>
                <h4 className="font-medium text-foreground">
                  {t("auditTrail.scoreDiffs.title")}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {t("auditTrail.scoreDiffs.description")}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                4
              </div>
              <div>
                <h4 className="font-medium text-foreground">
                  {t("auditTrail.onChainAnchoring.title")}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {t("auditTrail.onChainAnchoring.description")}
                </p>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Issuer Verification */}
        <GlassCard className="p-6">
          <div className="mb-4 flex items-center gap-3">
            <Users className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-bold text-foreground">
              {t("issuerVerification.title")}
            </h2>
          </div>
          <p className="mb-4 text-muted-foreground">
            {t("issuerVerification.description")}
          </p>
          <div className="space-y-3">
            <div className="rounded-lg bg-muted/50 p-4">
              <h4 className="font-medium text-foreground">
                {t("issuerVerification.issuerRegistry.title")}
              </h4>
              <p className="text-sm text-muted-foreground">
                {t("issuerVerification.issuerRegistry.description")}
              </p>
            </div>
            <div className="rounded-lg bg-muted/50 p-4">
              <h4 className="font-medium text-foreground">
                {t("issuerVerification.scopedAuthority.title")}
              </h4>
              <p className="text-sm text-muted-foreground">
                {t("issuerVerification.scopedAuthority.description")}
              </p>
            </div>
            <div className="rounded-lg bg-muted/50 p-4">
              <h4 className="font-medium text-foreground">
                {t("issuerVerification.dualControl.title")}
              </h4>
              <p className="text-sm text-muted-foreground">
                {t("issuerVerification.dualControl.description")}
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Dispute Process */}
        <GlassCard className="p-6">
          <h2 className="mb-4 text-xl font-bold text-foreground">
            {t("disputeProcess.title")}
          </h2>
          <p className="mb-4 text-muted-foreground">
            {t("disputeProcess.description")}
          </p>
          <ol className="list-inside list-decimal space-y-2 text-muted-foreground">
            {(t.raw("disputeProcess.steps") as string[]).map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
          <div className="mt-4">
            <Link
              href="/submit-data"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              {t("disputeProcess.submitLink")}
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Link>
          </div>
        </GlassCard>

        {/* Update Cadence */}
        <GlassCard className="p-6">
          <h2 className="mb-4 text-xl font-bold text-foreground">
            {t("updateCadence.title")}
          </h2>
          <div className="space-y-3 text-muted-foreground">
            <p>
              <strong className="text-foreground">{t("updateCadence.daily.label")}:</strong>{" "}
              {t("updateCadence.daily.description")}
            </p>
            <p>
              <strong className="text-foreground">{t("updateCadence.weekly.label")}:</strong>{" "}
              {t("updateCadence.weekly.description")}
            </p>
            <p>
              <strong className="text-foreground">{t("updateCadence.quarterly.label")}:</strong>{" "}
              {t("updateCadence.quarterly.description")}
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

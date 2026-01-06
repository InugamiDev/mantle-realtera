import Link from "next/link";
import { ArrowLeft, CheckCircle, Clock, AlertCircle, HelpCircle } from "lucide-react";
import { GlassCard } from "@/components/realtera/GlassCard";
import { getTranslations } from "next-intl/server";

export default async function VerificationPage() {
  const t = await getTranslations("verification");

  const verificationSteps = [
    {
      step: 1,
      title: t("fiveSteps.step1.title"),
      description: t("fiveSteps.step1.description"),
    },
    {
      step: 2,
      title: t("fiveSteps.step2.title"),
      description: t("fiveSteps.step2.description"),
    },
    {
      step: 3,
      title: t("fiveSteps.step3.title"),
      description: t("fiveSteps.step3.description"),
    },
    {
      step: 4,
      title: t("fiveSteps.step4.title"),
      description: t("fiveSteps.step4.description"),
    },
    {
      step: 5,
      title: t("fiveSteps.step5.title"),
      description: t("fiveSteps.step5.description"),
    },
  ];

  const statusExplanations = [
    {
      icon: CheckCircle,
      label: t("statusMeaning.verified.label"),
      className: "text-emerald-600 bg-emerald-500/10",
      description: t("statusMeaning.verified.description"),
    },
    {
      icon: Clock,
      label: t("statusMeaning.pending.label"),
      className: "text-amber-600 bg-amber-500/10",
      description: t("statusMeaning.pending.description"),
    },
    {
      icon: AlertCircle,
      label: t("statusMeaning.notVerified.label"),
      className: "text-slate-600 bg-slate-500/10",
      description: t("statusMeaning.notVerified.description"),
    },
    {
      icon: HelpCircle,
      label: t("statusMeaning.notRated.label"),
      className: "text-slate-500 bg-slate-400/10",
      description: t("statusMeaning.notRated.description"),
    },
  ];

  const checklistItems = [
    t("checklist.items.0"),
    t("checklist.items.1"),
    t("checklist.items.2"),
    t("checklist.items.3"),
    t("checklist.items.4"),
    t("checklist.items.5"),
  ];

  return (
    <div className="container-app py-8">
      {/* Back link */}
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {t("backToRanking")}
      </Link>

      {/* Page Header */}
      <header className="page-header">
        <h1 className="page-title">{t("pageTitle")}</h1>
        <p className="page-subtitle">
          {t("pageSubtitle")}
        </p>
      </header>

      {/* Main content */}
      <div className="space-y-8">
        {/* Verification process */}
        <GlassCard className="p-6">
          <h2 className="mb-6 text-xl font-bold text-foreground">{t("fiveSteps.title")}</h2>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 hidden h-full w-0.5 bg-border sm:block" />

            <div className="space-y-6">
              {verificationSteps.map((item, index) => (
                <div key={item.step} className="relative flex gap-4 sm:gap-6">
                  {/* Step number */}
                  <div className="relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <span className="text-lg font-bold">{item.step}</span>
                  </div>
                  {/* Content */}
                  <div className={`flex-1 pb-6 ${index === verificationSteps.length - 1 ? "pb-0" : ""}`}>
                    <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                    <p className="mt-1 text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Status explanations */}
        <GlassCard className="p-6">
          <h2 className="mb-6 text-xl font-bold text-foreground">{t("statusMeaning.title")}</h2>
          <div className="space-y-4">
            {statusExplanations.map((status) => {
              const Icon = status.icon;
              return (
                <div
                  key={status.label}
                  className="rounded-xl border border-border/50 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className={`rounded-full p-2 ${status.className}`}>
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h3 className="font-semibold text-foreground">{status.label}</h3>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{status.description}</p>
                </div>
              );
            })}
          </div>
        </GlassCard>

        {/* Checklist */}
        <GlassCard className="p-6">
          <h2 className="mb-4 text-xl font-bold text-foreground">{t("checklist.title")}</h2>
          <p className="mb-4 text-muted-foreground">
            {t("checklist.intro")}
          </p>
          <ul className="space-y-2">
            {checklistItems.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" aria-hidden="true" />
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </GlassCard>

        {/* Appeal process */}
        <GlassCard className="p-6">
          <h2 className="mb-4 text-xl font-bold text-foreground">{t("appeal.title")}</h2>
          <p className="mb-4 text-muted-foreground">
            {t("appeal.description")}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/submit-data"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {t("appeal.submitButton")}
            </Link>
            <a
              href="mailto:contact@lethanhdanh.id.vn"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-transparent px-5 py-2.5 font-medium text-foreground transition-colors hover:bg-accent"
            >
              {t("appeal.email")}: contact@lethanhdanh.id.vn
            </a>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

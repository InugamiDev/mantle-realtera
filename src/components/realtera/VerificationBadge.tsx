"use client";

import { cn } from "@/lib/utils";
import { CheckCircle, Clock, AlertCircle, HelpCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import type { VerificationStatus } from "@/lib/types";

export interface VerificationBadgeProps {
  status: VerificationStatus;
  className?: string;
}

const statusConfig: Record<
  VerificationStatus,
  {
    labelKey: string;
    className: string;
    Icon: typeof CheckCircle;
  }
> = {
  Verified: {
    labelKey: "verified",
    className: "verification-verified",
    Icon: CheckCircle,
  },
  "Under review": {
    labelKey: "pending",
    className: "verification-review",
    Icon: Clock,
  },
  Unverified: {
    labelKey: "notVerified",
    className: "verification-unverified",
    Icon: AlertCircle,
  },
  Unrated: {
    labelKey: "notRated",
    className: "verification-unrated",
    Icon: HelpCircle,
  },
};

export function VerificationBadge({ status, className }: VerificationBadgeProps) {
  const t = useTranslations("home");
  const config = statusConfig[status];
  const { Icon, labelKey, className: statusClass } = config;
  const label = t(labelKey);

  return (
    <span
      className={cn("verification-badge shrink-0 whitespace-nowrap", statusClass, className)}
      role="status"
      aria-label={label}
    >
      <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
      <span className="truncate">{label}</span>
    </span>
  );
}

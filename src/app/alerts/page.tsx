"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSafeStackUser } from "@/stack/safe-hooks";
import { useTranslations } from "next-intl";
import {
  ArrowLeft,
  Bell,
  BellOff,
  Rocket,
  TrendingUp,
  TrendingDown,
  Shield,
  Building2,
  Check,
  CheckCheck,
  Filter,
} from "lucide-react";
import { GlassCard } from "@/components/realtera/GlassCard";

type AlertType = "new_launch" | "price_change" | "tier_change" | "verification" | "developer_news";

interface Alert {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  projectSlug?: string;
  developerSlug?: string;
  createdAt: string;
  read: boolean;
}

export default function AlertsPage() {
  const user = useSafeStackUser();
  const t = useTranslations("alerts");
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const alertTypeConfig: Record<AlertType, { icon: typeof Bell; color: string; labelKey: string }> = {
    new_launch: { icon: Rocket, color: "text-emerald-400", labelKey: "filter.newLaunch" },
    price_change: { icon: TrendingUp, color: "text-amber-400", labelKey: "filter.priceChange" },
    tier_change: { icon: TrendingDown, color: "text-cyan-400", labelKey: "filter.tierChange" },
    verification: { icon: Shield, color: "text-purple-400", labelKey: "filter.verification" },
    developer_news: { icon: Building2, color: "text-blue-400", labelKey: "filter.developerNews" },
  };

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return t("timeAgo.minutesAgo", { count: diffMins });
    if (diffHours < 24) return t("timeAgo.hoursAgo", { count: diffHours });
    if (diffDays < 7) return t("timeAgo.daysAgo", { count: diffDays });
    return date.toLocaleDateString("vi-VN");
  };
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<AlertType | "all">("all");

  useEffect(() => {
    if (user) {
      fetchAlerts();
    } else {
      setLoading(false);
    }
  }, [user, filter]);

  const fetchAlerts = async () => {
    try {
      const params = new URLSearchParams();
      if (filter !== "all") params.set("type", filter);

      const res = await fetch(`/api/v1/alerts?${params}`);
      const data = await res.json();

      if (res.ok) {
        setAlerts(data.alerts);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error("Failed to fetch alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    try {
      await fetch("/api/v1/alerts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true }),
      });
      setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all read:", error);
    }
  };

  const markAsRead = async (alertId: string) => {
    try {
      await fetch("/api/v1/alerts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alertIds: [alertId] }),
      });
      setAlerts((prev) =>
        prev.map((a) => (a.id === alertId ? { ...a, read: true } : a))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  if (!user) {
    return (
      <div className="container-app py-8">
        <GlassCard className="p-12 text-center">
          <BellOff className="mx-auto h-16 w-16 text-muted-foreground/50" />
          <h2 className="mt-6 text-xl font-bold text-foreground">{t("loginTitle")}</h2>
          <p className="mt-2 text-muted-foreground">
            {t("loginSubtitle")}
          </p>
          <Link href="/handler/sign-in" className="btn btn-primary mt-6">
            {t("signIn")}
          </Link>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="container-app py-8">
      {/* Back link */}
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("backToRanking")}
      </Link>

      {/* Header */}
      <header className="page-header">
        <div className="mb-4 flex items-center justify-center gap-2">
          <Bell className="h-5 w-5 text-cyan-400" />
          <span className="text-sm font-medium uppercase tracking-wider text-cyan-400">
            {t("badge")}
          </span>
        </div>
        <h1 className="page-title">{t("title")}</h1>
        <p className="page-subtitle">
          {t("subtitle")}
        </p>
      </header>

      {/* Actions bar */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        {/* Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as AlertType | "all")}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground"
          >
            <option value="all">{t("filter.all")}</option>
            <option value="new_launch">{t("filter.newLaunch")}</option>
            <option value="price_change">{t("filter.priceChange")}</option>
            <option value="tier_change">{t("filter.tierChange")}</option>
            <option value="verification">{t("filter.verification")}</option>
            <option value="developer_news">{t("filter.developerNews")}</option>
          </select>
        </div>

        {/* Mark all read */}
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 rounded-lg bg-cyan-500/20 px-4 py-2 text-sm font-medium text-cyan-400 transition-all hover:bg-cyan-500/30"
          >
            <CheckCheck className="h-4 w-4" />
            {t("markAllRead")} ({unreadCount})
          </button>
        )}
      </div>

      {/* Alerts list */}
      <div className="mt-6 space-y-3">
        {loading ? (
          <GlassCard className="p-8 text-center">
            <div className="animate-pulse text-muted-foreground">{t("loading")}</div>
          </GlassCard>
        ) : alerts.length === 0 ? (
          <GlassCard className="p-8 text-center">
            <Bell className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">{t("noAlerts")}</p>
          </GlassCard>
        ) : (
          alerts.map((alert) => {
            const config = alertTypeConfig[alert.type];
            const Icon = config.icon;

            return (
              <GlassCard
                key={alert.id}
                className={`p-4 transition-all ${!alert.read ? "border-l-2 border-l-cyan-500" : ""}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`rounded-lg bg-white/10 p-2.5 ${config.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-foreground">{alert.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{alert.message}</p>
                      </div>
                      {!alert.read && (
                        <button
                          onClick={() => markAsRead(alert.id)}
                          className="rounded-lg p-2 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                          title={t("markAsRead")}
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className={config.color}>{t(config.labelKey)}</span>
                      <span>•</span>
                      <span>{formatTimeAgo(alert.createdAt)}</span>
                      {alert.projectSlug && (
                        <>
                          <span>•</span>
                          <Link
                            href={`/project/${alert.projectSlug}`}
                            className="text-cyan-400 hover:underline"
                          >
                            {t("viewProject")}
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </GlassCard>
            );
          })
        )}
      </div>

      {/* Alert settings */}
      <GlassCard className="mt-8 p-6">
        <h2 className="mb-4 text-lg font-bold text-foreground">{t("settings.title")}</h2>
        <div className="space-y-4">
          {Object.entries(alertTypeConfig).map(([type, config]) => {
            const Icon = config.icon;
            return (
              <label key={type} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon className={`h-5 w-5 ${config.color}`} />
                  <span className="text-foreground">{t(config.labelKey)}</span>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-5 w-5 rounded border-white/20 bg-white/5 text-cyan-500 focus:ring-cyan-500"
                />
              </label>
            );
          })}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          {t("settings.description")}
        </p>
      </GlassCard>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useSafeStackUser } from "@/stack/safe-hooks";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { GlassCard } from "@/components/realtera/GlassCard";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Building2,
  Bell,
  Shield,
  LogOut,
  Camera,
  Check,
  Loader2,
  BadgeCheck,
  Home,
  TrendingUp,
  Briefcase,
} from "lucide-react";
import { LinkedAccounts } from "@/components/auth/account";
import { useAuth } from "@/providers/UnifiedAuthProvider";

type AccountType = "investor" | "developer" | "agent" | "buyer" | "other";

interface UserPreferences {
  accountType: AccountType;
  phone: string;
  company: string;
  notifications: {
    email: boolean;
    priceAlerts: boolean;
    newProjects: boolean;
    weeklyDigest: boolean;
  };
}

export default function AccountPage() {
  const user = useSafeStackUser();
  const router = useRouter();
  const t = useTranslations("account");
  const { walletAddress } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const ACCOUNT_TYPES: { value: AccountType; labelKey: string; icon: typeof User; descKey: string }[] = [
    { value: "investor", labelKey: "whoAreYou.investor", icon: TrendingUp, descKey: "whoAreYou.investorDesc" },
    { value: "developer", labelKey: "whoAreYou.developer", icon: Building2, descKey: "whoAreYou.developerDesc" },
    { value: "agent", labelKey: "whoAreYou.agent", icon: Briefcase, descKey: "whoAreYou.agentDesc" },
    { value: "buyer", labelKey: "whoAreYou.buyer", icon: Home, descKey: "whoAreYou.buyerDesc" },
    { value: "other", labelKey: "whoAreYou.other", icon: User, descKey: "whoAreYou.otherDesc" },
  ];

  // User preferences state
  const [preferences, setPreferences] = useState<UserPreferences>({
    accountType: "investor",
    phone: "",
    company: "",
    notifications: {
      email: true,
      priceAlerts: true,
      newProjects: false,
      weeklyDigest: true,
    },
  });

  // Redirect if not logged in
  if (!user) {
    return (
      <div className="container-app flex min-h-[60vh] items-center justify-center py-8">
        <GlassCard className="max-w-md p-8 text-center">
          <User className="mx-auto mb-4 h-12 w-12 text-white/40" />
          <h2 className="mb-2 text-xl font-bold text-white">{t("notLoggedIn")}</h2>
          <p className="mb-6 text-white/60">
            {t("pleaseLogin")}
          </p>
          <Link
            href="/handler/sign-in"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 font-semibold text-amber-900 transition-all hover:scale-105"
          >
            {t("signIn")}
          </Link>
        </GlassCard>
      </div>
    );
  }

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call - in real app, save to user metadata
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSignOut = async () => {
    await user.signOut?.();
    router.push("/");
  };

  return (
    <div className="container-app py-8">
      {/* Back link */}
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {t("backToHome")}
      </Link>

      {/* Page Header */}
      <header className="page-header">
        <h1 className="page-title">{t("title")}</h1>
        <p className="page-subtitle">
          {t("subtitle")}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card - Left Column */}
        <div className="lg:col-span-1">
          <GlassCard className="p-6">
            {/* Avatar */}
            <div className="mb-6 flex flex-col items-center">
              <div className="group relative mb-4">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-amber-500 to-orange-500">
                  {user.profileImageUrl ? (
                    <img
                      src={user.profileImageUrl}
                      alt={user.displayName || "Avatar"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-amber-900">
                      {(user.displayName || user.primaryEmail || "U")[0].toUpperCase()}
                    </span>
                  )}
                </div>
                <button className="absolute bottom-0 right-0 rounded-full bg-white/10 p-2 text-white/60 opacity-0 backdrop-blur-sm transition-all hover:bg-white/20 hover:text-white group-hover:opacity-100">
                  <Camera className="h-4 w-4" />
                </button>
              </div>

              <h2 className="mb-1 text-xl font-bold text-white">
                {user.displayName || "Người dùng"}
              </h2>
              <p className="mb-2 text-sm text-white/60">{user.primaryEmail}</p>

              {user.primaryEmailVerified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-400">
                  <BadgeCheck className="h-3 w-3" />
                  {t("emailVerified")}
                </span>
              )}
            </div>

            {/* Quick Stats */}
            <div className="space-y-3 border-t border-white/10 pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">{t("joinDate")}</span>
                <span className="text-white">
                  {user.signedUpAt
                    ? new Date(user.signedUpAt).toLocaleDateString("vi-VN")
                    : "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">{t("accountType")}</span>
                <span className="text-amber-400">{t("free")}</span>
              </div>
            </div>

            {/* Sign Out Button */}
            <button
              onClick={handleSignOut}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20"
            >
              <LogOut className="h-4 w-4" />
              {t("signOut")}
            </button>
          </GlassCard>
        </div>

        {/* Settings - Right Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Personal Info */}
          <GlassCard className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-amber-400" />
              <h3 className="text-lg font-bold text-white">{t("personalInfo.title")}</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/80">
                  {t("personalInfo.displayName")}
                </label>
                <input
                  type="text"
                  defaultValue={user.displayName || ""}
                  placeholder={t("personalInfo.displayNamePlaceholder")}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-white/30 outline-none transition-colors focus:border-amber-500/50 focus:bg-white/10"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/80">
                  <Mail className="mr-1.5 inline h-4 w-4" />
                  {t("personalInfo.email")}
                </label>
                <input
                  type="email"
                  value={user.primaryEmail || ""}
                  disabled
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white/60 outline-none"
                />
                <p className="mt-1 text-xs text-white/40">
                  {t("personalInfo.emailCannotChange")}
                </p>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/80">
                  <Phone className="mr-1.5 inline h-4 w-4" />
                  {t("personalInfo.phone")}
                </label>
                <input
                  type="tel"
                  value={preferences.phone}
                  onChange={(e) =>
                    setPreferences({ ...preferences, phone: e.target.value })
                  }
                  placeholder={t("personalInfo.phonePlaceholder")}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-white/30 outline-none transition-colors focus:border-amber-500/50 focus:bg-white/10"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/80">
                  <Building2 className="mr-1.5 inline h-4 w-4" />
                  {t("personalInfo.company")}
                </label>
                <input
                  type="text"
                  value={preferences.company}
                  onChange={(e) =>
                    setPreferences({ ...preferences, company: e.target.value })
                  }
                  placeholder={t("personalInfo.companyPlaceholder")}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-white/30 outline-none transition-colors focus:border-amber-500/50 focus:bg-white/10"
                />
              </div>
            </div>
          </GlassCard>

          {/* Account Type */}
          <GlassCard className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-amber-400" />
              <h3 className="text-lg font-bold text-white">{t("whoAreYou.title")}</h3>
            </div>
            <p className="mb-4 text-sm text-white/60">
              {t("whoAreYou.subtitle")}
            </p>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {ACCOUNT_TYPES.map((type) => {
                const Icon = type.icon;
                const isSelected = preferences.accountType === type.value;
                return (
                  <button
                    key={type.value}
                    onClick={() =>
                      setPreferences({ ...preferences, accountType: type.value })
                    }
                    className={`flex flex-col items-center rounded-lg border p-4 text-center transition-all ${
                      isSelected
                        ? "border-amber-500/50 bg-amber-500/10"
                        : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                    }`}
                  >
                    <Icon
                      className={`mb-2 h-6 w-6 ${
                        isSelected ? "text-amber-400" : "text-white/60"
                      }`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        isSelected ? "text-amber-400" : "text-white"
                      }`}
                    >
                      {t(type.labelKey)}
                    </span>
                    <span className="mt-1 text-xs text-white/40">
                      {t(type.descKey)}
                    </span>
                  </button>
                );
              })}
            </div>
          </GlassCard>

          {/* Notifications */}
          <GlassCard className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <Bell className="h-5 w-5 text-amber-400" />
              <h3 className="text-lg font-bold text-white">{t("notifications.title")}</h3>
            </div>

            <div className="space-y-4">
              {[
                {
                  key: "email" as const,
                  labelKey: "notifications.email",
                  descKey: "notifications.emailDesc",
                },
                {
                  key: "priceAlerts" as const,
                  labelKey: "notifications.priceAlerts",
                  descKey: "notifications.priceAlertsDesc",
                },
                {
                  key: "newProjects" as const,
                  labelKey: "notifications.newProjects",
                  descKey: "notifications.newProjectsDesc",
                },
                {
                  key: "weeklyDigest" as const,
                  labelKey: "notifications.weeklyDigest",
                  descKey: "notifications.weeklyDigestDesc",
                },
              ].map((item) => (
                <label
                  key={item.key}
                  className="flex cursor-pointer items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10"
                >
                  <div>
                    <span className="font-medium text-white">{t(item.labelKey)}</span>
                    <p className="text-sm text-white/40">{t(item.descKey)}</p>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={preferences.notifications[item.key]}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          notifications: {
                            ...preferences.notifications,
                            [item.key]: e.target.checked,
                          },
                        })
                      }
                      className="peer sr-only"
                    />
                    <div className="h-6 w-11 rounded-full bg-white/10 peer-checked:bg-amber-500 transition-colors" />
                    <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
                  </div>
                </label>
              ))}
            </div>
          </GlassCard>

          {/* Security */}
          <GlassCard className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-amber-400" />
              <h3 className="text-lg font-bold text-white">{t("security.title")}</h3>
            </div>

            <div className="space-y-3">
              <Link
                href="/handler/account-settings"
                className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10"
              >
                <div>
                  <span className="font-medium text-white">{t("security.changePassword")}</span>
                  <p className="text-sm text-white/40">
                    {t("security.changePasswordDesc")}
                  </p>
                </div>
                <ArrowLeft className="h-4 w-4 rotate-180 text-white/40" />
              </Link>

              <Link
                href="/handler/account-settings"
                className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10"
              >
                <div>
                  <span className="font-medium text-white">
                    {t("security.twoFactor")}
                  </span>
                  <p className="text-sm text-white/40">
                    {t("security.twoFactorDesc")}
                  </p>
                </div>
                <ArrowLeft className="h-4 w-4 rotate-180 text-white/40" />
              </Link>
            </div>
          </GlassCard>

          {/* Linked Accounts */}
          <LinkedAccounts
            email={user.primaryEmail || null}
            walletAddress={walletAddress}
          />

          {/* Save Button */}
          <div className="flex justify-end gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 font-semibold text-amber-900 shadow-lg shadow-amber-500/20 transition-all hover:shadow-amber-500/40 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("saving")}
                </>
              ) : saved ? (
                <>
                  <Check className="h-4 w-4" />
                  {t("saved")}
                </>
              ) : (
                t("saveChanges")
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

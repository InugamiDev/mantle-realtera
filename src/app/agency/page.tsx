"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { GlassCard } from "@/components/realtera/GlassCard";
import {
  Building2,
  Users,
  FolderOpen,
  TrendingUp,
  Plus,
  Share2,
  Clock,
  ArrowRight,
  Briefcase,
  Shield,
  BarChart3,
  FileCheck,
} from "lucide-react";
import {
  DEMO_AGENCY,
  getCollectionsByAgency,
  getActivitiesByAgency,
  type Agency,
  type AgencyCollection,
  type AgencyActivity,
} from "@/lib/mock/agency-data";

function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  color = "amber",
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  trend?: string;
  color?: string;
}) {
  const colorClasses = {
    amber: "bg-amber-500/20 text-amber-400",
    blue: "bg-blue-500/20 text-blue-400",
    emerald: "bg-emerald-500/20 text-emerald-400",
    purple: "bg-purple-500/20 text-purple-400",
  };

  return (
    <GlassCard className="p-5">
      <div className="flex items-start justify-between">
        <div className={`rounded-xl p-3 ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon className="h-6 w-6" />
        </div>
        {trend && (
          <span className="flex items-center gap-1 text-xs text-emerald-400">
            <TrendingUp className="h-3 w-3" />
            {trend}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="mt-1 text-sm text-white/60">{label}</p>
      </div>
    </GlassCard>
  );
}

function ActivityItem({ activity }: { activity: AgencyActivity }) {
  const iconMap = {
    collection_created: FolderOpen,
    collection_shared: Share2,
    client_added: Users,
    project_added: Building2,
    report_generated: FileCheck,
  };
  const Icon = iconMap[activity.type];

  return (
    <div className="flex items-start gap-3 py-3">
      <div className="rounded-lg bg-white/10 p-2">
        <Icon className="h-4 w-4 text-white/60" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white/80">{activity.descriptionVi}</p>
        <p className="mt-0.5 text-xs text-white/40">
          {new Date(activity.createdAt).toLocaleString("vi-VN")}
        </p>
      </div>
    </div>
  );
}

function CollectionCard({ collection }: { collection: AgencyCollection }) {
  return (
    <Link href={`/agency/collections?id=${collection.id}`}>
      <GlassCard className="p-4 transition-all hover:bg-white/10 cursor-pointer">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-white truncate">{collection.name}</h3>
            {collection.clientName && (
              <p className="mt-1 text-sm text-white/60 truncate">
                Khách hàng: {collection.clientName}
              </p>
            )}
          </div>
          <span className="flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-1 text-xs text-amber-400">
            {collection.projects.length} dự án
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-white/40">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {new Date(collection.updatedAt).toLocaleDateString("vi-VN")}
          </span>
          {collection.isPublic && collection.shareLink && (
            <span className="flex items-center gap-1 text-cyan-400">
              <Share2 className="h-3 w-3" />
              Đã chia sẻ
            </span>
          )}
        </div>
      </GlassCard>
    </Link>
  );
}

export default function AgencyDashboardPage() {
  const [agency, setAgency] = useState<Agency | null>(null);
  const [collections, setCollections] = useState<AgencyCollection[]>([]);
  const [activities, setActivities] = useState<AgencyActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load demo data on mount - this pattern is correct for client-side data fetching
  // In production, replace with API call or server component
  useEffect(() => {
    // Simulate API call delay for realistic UX
    const loadData = () => {
      setAgency(DEMO_AGENCY);
      setCollections(getCollectionsByAgency(DEMO_AGENCY.id));
      setActivities(getActivitiesByAgency(DEMO_AGENCY.id, 5));
      setIsLoading(false);
    };
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="container-app py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 rounded bg-white/10" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 rounded-xl bg-white/5" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!agency) {
    return (
      <div className="container-app py-12">
        <GlassCard className="mx-auto max-w-lg p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20">
            <Briefcase className="h-8 w-8 text-amber-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Agency Workspace</h1>
          <p className="mt-2 text-white/60">
            Đăng nhập để truy cập không gian làm việc của đại lý
          </p>
          <Link
            href="/handler/sign-in?after_auth_return_to=/agency"
            className="mt-6 inline-block rounded-lg bg-amber-500 px-6 py-3 font-medium text-black transition-colors hover:bg-amber-400"
          >
            Đăng nhập
          </Link>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="container-app py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">{agency.name}</h1>
            <span className="rounded-full bg-cyan-500/20 px-2.5 py-0.5 text-xs font-medium text-cyan-400 uppercase">
              {agency.tier}
            </span>
          </div>
          <p className="mt-1 text-white/60">Agency Workspace</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/agency/collections?new=true"
            className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/20"
          >
            <Plus className="h-4 w-4" />
            Tạo Collection
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Users}
          label="Khách hàng"
          value={agency.stats.clients}
          trend="+12%"
          color="blue"
        />
        <StatCard
          icon={FolderOpen}
          label="Collections"
          value={agency.stats.collections}
          color="purple"
        />
        <StatCard
          icon={Building2}
          label="Dự án theo dõi"
          value={agency.stats.projectsTracked}
          trend="+8%"
          color="amber"
        />
        <StatCard
          icon={BarChart3}
          label="Giao dịch năm nay"
          value={agency.stats.transactionsThisYear}
          color="emerald"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Collections */}
        <div className="lg:col-span-2">
          <GlassCard className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Collections gần đây</h2>
              <Link
                href="/agency/collections"
                className="flex items-center gap-1 text-sm text-amber-400 hover:underline"
              >
                Xem tất cả
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {collections.slice(0, 4).map((collection) => (
                <CollectionCard key={collection.id} collection={collection} />
              ))}
            </div>
            {collections.length === 0 && (
              <div className="py-12 text-center">
                <FolderOpen className="mx-auto h-12 w-12 text-white/20" />
                <p className="mt-4 text-white/60">Chưa có collection nào</p>
                <Link
                  href="/agency/collections?new=true"
                  className="mt-4 inline-flex items-center gap-2 text-amber-400 hover:underline"
                >
                  <Plus className="h-4 w-4" />
                  Tạo collection đầu tiên
                </Link>
              </div>
            )}
          </GlassCard>
        </div>

        {/* Activity Feed */}
        <div>
          <GlassCard className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">Hoạt động gần đây</h2>
            <div className="divide-y divide-white/5">
              {activities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
            {activities.length === 0 && (
              <p className="py-8 text-center text-white/40">Chưa có hoạt động nào</p>
            )}
          </GlassCard>

          {/* Subscription Info */}
          <GlassCard className="mt-6 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-5 w-5 text-cyan-400" />
              <h2 className="font-semibold text-white">Subscription</h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Gói</span>
                <span className="font-medium text-white">{agency.subscription.plan}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Hết hạn</span>
                <span className="text-white">
                  {new Date(agency.subscription.expiresAt).toLocaleDateString("vi-VN")}
                </span>
              </div>
              <div className="pt-3 border-t border-white/10">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/60">Credits tháng này</span>
                  <span className="text-white">
                    {agency.subscription.usedCredits} / {agency.subscription.monthlyCredits}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                    style={{
                      width: `${(agency.subscription.usedCredits / agency.subscription.monthlyCredits) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Link href="/agency/collections?new=true">
          <GlassCard className="p-5 transition-all hover:bg-white/10 cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-amber-500/20 p-3 group-hover:bg-amber-500/30 transition-colors">
                <Plus className="h-6 w-6 text-amber-400" />
              </div>
              <div>
                <h3 className="font-medium text-white">Tạo Collection</h3>
                <p className="text-sm text-white/60">Tổng hợp dự án cho khách hàng</p>
              </div>
            </div>
          </GlassCard>
        </Link>
        <Link href="/">
          <GlassCard className="p-5 transition-all hover:bg-white/10 cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-blue-500/20 p-3 group-hover:bg-blue-500/30 transition-colors">
                <Building2 className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium text-white">Khám phá dự án</h3>
                <p className="text-sm text-white/60">Tìm kiếm dự án mới</p>
              </div>
            </div>
          </GlassCard>
        </Link>
        <Link href="/verify">
          <GlassCard className="p-5 transition-all hover:bg-white/10 cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-cyan-500/20 p-3 group-hover:bg-cyan-500/30 transition-colors">
                <Shield className="h-6 w-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="font-medium text-white">Xác minh dự án</h3>
                <p className="text-sm text-white/60">Kiểm tra attestation</p>
              </div>
            </div>
          </GlassCard>
        </Link>
      </div>
    </div>
  );
}

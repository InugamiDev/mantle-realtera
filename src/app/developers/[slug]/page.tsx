import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Building2, MapPin, Globe, TrendingUp, Calendar, ExternalLink } from "lucide-react";
import { getDeveloperBySlug, getProjectsByDeveloper } from "@/lib/data";
import { GlassCard } from "@/components/realtera/GlassCard";
import { TierBadge } from "@/components/realtera/TierBadge";
import { ProjectCard } from "@/components/realtera/ProjectCard";
import { DeveloperScorecard } from "@/components/realtera/DeveloperScorecard";
import { CommentSection } from "@/components/comments";

interface DeveloperPageProps {
  params: Promise<{ slug: string }>;
}

export default async function DeveloperPage({ params }: DeveloperPageProps) {
  const { slug } = await params;

  const [developer, projects] = await Promise.all([
    getDeveloperBySlug(slug),
    getProjectsByDeveloper(slug),
  ]);

  if (!developer) {
    notFound();
  }

  // Calculate stats
  const totalProjects = projects.length;
  const verifiedProjects = projects.filter((p) => p.verificationStatus === "Verified").length;
  const avgScore = totalProjects > 0
    ? Math.round(projects.reduce((sum, p) => sum + p.score, 0) / totalProjects)
    : 0;

  // Group projects by tier
  const projectsByTier = projects.reduce((acc, project) => {
    if (!acc[project.tier]) {
      acc[project.tier] = [];
    }
    acc[project.tier].push(project);
    return acc;
  }, {} as Record<string, typeof projects>);

  const tierOrder = ["SSS", "S+", "S", "A", "B", "C", "D", "F"];

  return (
    <div className="container-app py-8">
      {/* Back link */}
      <Link
        href="/developers"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Quay lại danh sách Chủ đầu tư
      </Link>

      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 border border-cyan-500/30">
              <Building2 className="h-8 w-8 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{developer.name}</h1>
                <TierBadge tier={developer.tier} size="lg" />
              </div>
              {developer.stockCode && (
                <p className="mt-1 text-sm font-medium text-cyan-400">
                  Mã CK: {developer.stockCode}
                </p>
              )}
              {developer.headquarters && (
                <p className="mt-1 flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  {developer.headquarters}
                </p>
              )}
            </div>
          </div>

          {developer.website && (
            <a
              href={developer.website}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              <Globe className="h-4 w-4" aria-hidden="true" />
              Website
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
          )}
        </div>
      </header>

      {/* Stats */}
      <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <GlassCard className="p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{developer.projectCount}</p>
          <p className="text-sm text-muted-foreground">Tổng dự án</p>
        </GlassCard>
        <GlassCard className="p-4 text-center">
          <p className="text-2xl font-bold text-cyan-400">{totalProjects}</p>
          <p className="text-sm text-muted-foreground">Đã đánh giá</p>
        </GlassCard>
        <GlassCard className="p-4 text-center">
          <p className="text-2xl font-bold text-emerald-400">{verifiedProjects}</p>
          <p className="text-sm text-muted-foreground">Đã xác minh</p>
        </GlassCard>
        <GlassCard className="p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{avgScore}/100</p>
          <p className="text-sm text-muted-foreground">Điểm TB</p>
        </GlassCard>
      </div>

      {/* Developer Info */}
      <GlassCard className="mb-10 p-6">
        <h2 className="mb-4 text-lg font-bold text-foreground">Thông tin chủ đầu tư</h2>
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {developer.foundedYear && (
            <div>
              <dt className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                Năm thành lập
              </dt>
              <dd className="mt-1 font-semibold text-foreground">{developer.foundedYear}</dd>
            </div>
          )}
          <div>
            <dt className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <TrendingUp className="h-3.5 w-3.5" />
              Xếp hạng RealTera
            </dt>
            <dd className="mt-1">
              <TierBadge tier={developer.tier} showLabel />
            </dd>
          </div>
          <div>
            <dt className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Building2 className="h-3.5 w-3.5" />
              Số dự án
            </dt>
            <dd className="mt-1 font-semibold text-foreground">{developer.projectCount} dự án</dd>
          </div>
          {developer.headquarters && (
            <div>
              <dt className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                Trụ sở
              </dt>
              <dd className="mt-1 font-semibold text-foreground">{developer.headquarters}</dd>
            </div>
          )}
        </dl>
        {developer.description && (
          <p className="mt-4 text-muted-foreground leading-relaxed">{developer.description}</p>
        )}
      </GlassCard>

      {/* Projects list */}
      {totalProjects > 0 ? (
        <div className="space-y-10">
          <h2 className="text-xl font-bold text-foreground">
            Các dự án của {developer.name} ({totalProjects} dự án)
          </h2>

          {tierOrder.map((tier) => {
            const tierProjects = projectsByTier[tier];
            if (!tierProjects || tierProjects.length === 0) return null;

            return (
              <section key={tier}>
                <div className="mb-4 flex items-center gap-3">
                  <TierBadge tier={tier as "SSS" | "S+" | "S" | "A" | "B" | "C" | "D" | "F"} size="lg" />
                  <span className="text-lg font-semibold text-foreground">
                    {tierProjects.length} dự án
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {tierProjects.map((project) => (
                    <ProjectCard key={project.slug} project={project} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <GlassCard className="p-8 text-center">
          <Building2 className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <p className="mt-4 text-muted-foreground">
            Chưa có dự án nào được đánh giá từ chủ đầu tư này.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            RealTera sẽ cập nhật thông tin khi có dữ liệu.
          </p>
        </GlassCard>
      )}

      {/* Methodology note */}
      <GlassCard className="mt-12 p-6">
        <h2 className="mb-3 text-lg font-bold text-foreground">Về xếp hạng chủ đầu tư</h2>
        <p className="text-muted-foreground leading-relaxed">
          Xếp hạng chủ đầu tư được tính toán dựa trên: số lượng dự án đã hoàn thành thành công,
          chất lượng bàn giao và phản hồi cư dân, tình hình tài chính và uy tín thương hiệu,
          cùng với lịch sử xử lý vấn đề pháp lý. Điểm trung bình của các dự án cũng ảnh hưởng
          đến xếp hạng tổng thể.
        </p>
        <Link
          href="/methodology"
          className="mt-4 inline-block text-sm font-medium text-cyan-400 hover:text-cyan-300"
        >
          Xem chi tiết phương pháp →
        </Link>
      </GlassCard>

      {/* Comments Section */}
      <section className="mt-12">
        <GlassCard className="p-6">
          <h2 className="mb-6 text-xl font-bold text-foreground">
            Đánh giá Chủ đầu tư
          </h2>
          <CommentSection
            targetType="DEVELOPER"
            targetId={slug}
            targetName={developer.name}
            allowRating={true}
          />
        </GlassCard>
      </section>
    </div>
  );
}

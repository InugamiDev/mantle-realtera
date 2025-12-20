"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { LucideIcon, Inbox, Search, FileX, FolderOpen, Plus } from "lucide-react";

interface EmptyStateProps {
  /** Icon to display */
  icon?: LucideIcon;
  /** Main title text */
  title: string;
  /** Description text */
  description?: string;
  /** Primary action button */
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  /** Secondary action link */
  secondaryAction?: {
    label: string;
    href: string;
  };
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Additional className */
  className?: string;
}

/**
 * Reusable EmptyState component for various empty/no-data scenarios
 */
export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  secondaryAction,
  size = "md",
  className,
}: EmptyStateProps) {
  const sizeClasses = {
    sm: {
      container: "py-8",
      icon: "h-10 w-10",
      iconWrapper: "h-16 w-16",
      title: "text-base",
      description: "text-sm",
      button: "px-4 py-2 text-sm",
    },
    md: {
      container: "py-12",
      icon: "h-12 w-12",
      iconWrapper: "h-20 w-20",
      title: "text-lg",
      description: "text-sm",
      button: "px-5 py-2.5",
    },
    lg: {
      container: "py-16",
      icon: "h-16 w-16",
      iconWrapper: "h-24 w-24",
      title: "text-xl",
      description: "text-base",
      button: "px-6 py-3",
    },
  };

  const sizes = sizeClasses[size];

  const buttonClassName = cn(
    "inline-flex items-center gap-2 rounded-lg bg-amber-500 font-medium text-black transition-colors hover:bg-amber-400",
    sizes.button
  );

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        sizes.container,
        className
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          "mb-4 flex items-center justify-center rounded-full bg-white/5",
          sizes.iconWrapper
        )}
      >
        <Icon className={cn("text-white/40", sizes.icon)} />
      </div>

      {/* Title */}
      <h3 className={cn("font-semibold text-white", sizes.title)}>
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className={cn("mt-2 max-w-sm text-white/60", sizes.description)}>
          {description}
        </p>
      )}

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row">
          {action && action.href ? (
            <Link href={action.href} className={buttonClassName}>
              <Plus className="h-4 w-4" />
              {action.label}
            </Link>
          ) : action && action.onClick ? (
            <button
              type="button"
              onClick={action.onClick}
              className={buttonClassName}
            >
              <Plus className="h-4 w-4" />
              {action.label}
            </button>
          ) : null}
          {secondaryAction && (
            <Link
              href={secondaryAction.href}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg bg-white/10 font-medium text-white transition-colors hover:bg-white/20",
                sizes.button
              )}
            >
              {secondaryAction.label}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

// Pre-configured empty state variants

/**
 * Empty state for search results
 */
export function SearchEmptyState({
  query,
  onClear,
}: {
  query?: string;
  onClear?: () => void;
}) {
  return (
    <EmptyState
      icon={Search}
      title="Không tìm thấy kết quả"
      description={
        query
          ? `Không có kết quả phù hợp với "${query}". Hãy thử từ khóa khác.`
          : "Không có kết quả phù hợp với tìm kiếm của bạn."
      }
      action={
        onClear
          ? { label: "Xóa bộ lọc", onClick: onClear }
          : undefined
      }
    />
  );
}

/**
 * Empty state for lists/collections
 */
export function ListEmptyState({
  entityName = "mục",
  createHref,
  createLabel,
}: {
  entityName?: string;
  createHref?: string;
  createLabel?: string;
}) {
  return (
    <EmptyState
      icon={FolderOpen}
      title={`Chưa có ${entityName} nào`}
      description={`Bắt đầu bằng cách tạo ${entityName} đầu tiên của bạn.`}
      action={
        createHref
          ? { label: createLabel || `Tạo ${entityName}`, href: createHref }
          : undefined
      }
    />
  );
}

/**
 * Empty state for no data available
 */
export function NoDataEmptyState({
  title = "Không có dữ liệu",
  description = "Dữ liệu chưa sẵn sàng. Vui lòng thử lại sau.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <EmptyState
      icon={FileX}
      title={title}
      description={description}
    />
  );
}

/**
 * Empty state for watchlist/favorites
 */
export function WatchlistEmptyState() {
  return (
    <EmptyState
      icon={Inbox}
      title="Watchlist trống"
      description="Thêm dự án vào watchlist để theo dõi và so sánh."
      action={{ label: "Khám phá dự án", href: "/" }}
    />
  );
}

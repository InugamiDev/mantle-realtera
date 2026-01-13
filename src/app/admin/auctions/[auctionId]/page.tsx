import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";

function formatCurrency(amount: bigint | number): string {
  const num = typeof amount === "bigint" ? Number(amount) : amount;
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(num);
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(date);
}

function getStatusBadge(status: string, endTime: Date) {
  const isExpired = endTime < new Date();

  if (isExpired && status === "ACTIVE") {
    return (
      <span className="inline-flex items-center rounded-full bg-gray-500/20 px-3 py-1 text-sm text-gray-400">
        Ended
      </span>
    );
  }

  switch (status) {
    case "ACTIVE":
      return (
        <span className="inline-flex items-center rounded-full bg-emerald-500/20 px-3 py-1 text-sm text-emerald-400">
          Active
        </span>
      );
    case "PENDING":
      return (
        <span className="inline-flex items-center rounded-full bg-amber-500/20 px-3 py-1 text-sm text-amber-400">
          Pending
        </span>
      );
    case "COMPLETED":
      return (
        <span className="inline-flex items-center rounded-full bg-blue-500/20 px-3 py-1 text-sm text-blue-400">
          Completed
        </span>
      );
    case "CANCELLED":
      return (
        <span className="inline-flex items-center rounded-full bg-red-500/20 px-3 py-1 text-sm text-red-400">
          Cancelled
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center rounded-full bg-gray-500/20 px-3 py-1 text-sm text-gray-400">
          {status}
        </span>
      );
  }
}

export default async function AuctionDetailPage({
  params,
}: {
  params: Promise<{ auctionId: string }>;
}) {
  const { auctionId } = await params;

  const auction = await db.sponsoredAuction.findUnique({
    where: { id: auctionId },
    include: {
      slot: true,
      bids: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!auction) {
    notFound();
  }

  // Collect all project IDs (soft references) to fetch separately
  const projectIds = new Set<string>();
  auction.bids.forEach((bid) => projectIds.add(bid.projectId));
  if (auction.winningProjectId) projectIds.add(auction.winningProjectId);

  // Fetch projects separately (soft reference lookup)
  const projects = await db.project.findMany({
    where: { id: { in: Array.from(projectIds) } },
    select: { id: true, name: true, slug: true },
  });
  const projectMap = new Map(projects.map((p) => [p.id, p]));

  // Add project data to bids
  const bidsWithProject = auction.bids.map((bid) => ({
    ...bid,
    project: projectMap.get(bid.projectId) || { name: "Unknown Project", slug: "" },
  }));

  // Get winning project
  const winningProject = auction.winningProjectId
    ? projectMap.get(auction.winningProjectId)
    : null;

  const confirmedBids = bidsWithProject.filter((b) => b.status === "CONFIRMED");
  const pendingBids = bidsWithProject.filter((b) => b.status === "PENDING");
  const highestBid = confirmedBids.sort(
    (a, b) => Number(b.bidAmount) - Number(a.bidAmount)
  )[0];

  // Server Component - Date.now() is computed once per request, which is acceptable
  // eslint-disable-next-line react-hooks/purity
  const timeRemaining = auction.endTime.getTime() - Date.now();
  const isEnded = timeRemaining <= 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/admin/auctions"
          className="text-sm text-gray-400 hover:text-white"
        >
          &larr; Back to Auctions
        </Link>
        <div className="mt-4 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {auction.slotName || auction.slotType}
            </h1>
            {auction.description && (
              <p className="mt-1 text-gray-400">{auction.description}</p>
            )}
          </div>
          {getStatusBadge(auction.status, auction.endTime)}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-gray-400">Minimum Bid</p>
          <p className="mt-2 text-xl font-bold text-white">
            {formatCurrency(auction.minBid)}
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-gray-400">Current Highest Bid</p>
          <p className="mt-2 text-xl font-bold text-emerald-400">
            {highestBid ? formatCurrency(highestBid.bidAmount) : "No bids"}
          </p>
          {highestBid && (
            <p className="mt-1 text-xs text-gray-400">
              by {highestBid.project.name}
            </p>
          )}
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-gray-400">Total Bids</p>
          <p className="mt-2 text-xl font-bold text-white">
            {confirmedBids.length}
          </p>
          {pendingBids.length > 0 && (
            <p className="mt-1 text-xs text-amber-400">
              +{pendingBids.length} pending
            </p>
          )}
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-gray-400">
            {isEnded ? "Ended" : "Time Remaining"}
          </p>
          <p className="mt-2 text-xl font-bold text-white">
            {isEnded
              ? formatDate(auction.endTime)
              : `${Math.floor(timeRemaining / (1000 * 60 * 60 * 24))} days`}
          </p>
        </div>
      </div>

      {/* Auction Details */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Info Panel */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white">Auction Details</h2>
          <dl className="mt-4 space-y-4">
            <div>
              <dt className="text-sm text-gray-400">Slot Type</dt>
              <dd className="mt-1 text-white">{auction.slotType}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-400">Start Time</dt>
              <dd className="mt-1 text-white">{formatDate(auction.startTime)}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-400">End Time</dt>
              <dd className="mt-1 text-white">{formatDate(auction.endTime)}</dd>
            </div>
            {winningProject && (
              <div>
                <dt className="text-sm text-gray-400">Current Winner</dt>
                <dd className="mt-1">
                  <Link
                    href={`/project/${winningProject.slug}`}
                    className="text-amber-400 hover:underline"
                  >
                    {winningProject.name}
                  </Link>
                </dd>
              </div>
            )}
            <div>
              <dt className="text-sm text-gray-400">Auction ID</dt>
              <dd className="mt-1 font-mono text-xs text-gray-500">
                {auction.id}
              </dd>
            </div>
          </dl>
        </div>

        {/* Actions Panel */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white">Actions</h2>
          <div className="mt-4 space-y-3">
            {!isEnded && auction.status === "ACTIVE" && (
              <button className="w-full rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/20">
                End Auction Early
              </button>
            )}
            {isEnded && auction.status === "ACTIVE" && highestBid && (
              <button className="w-full rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-emerald-400">
                Finalize Winner
              </button>
            )}
            <button className="w-full rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-300 transition-colors hover:border-white/20 hover:text-white">
              Export Bid History
            </button>
          </div>
        </div>
      </div>

      {/* Bid History */}
      <div className="rounded-xl border border-white/10 bg-white/5">
        <div className="border-b border-white/10 px-6 py-4">
          <h2 className="text-lg font-semibold text-white">Bid History</h2>
        </div>
        <div className="divide-y divide-white/5">
          {bidsWithProject.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-400">
              No bids yet for this auction.
            </div>
          ) : (
            bidsWithProject.map((bid, index) => (
              <div
                key={bid.id}
                className={`flex items-center justify-between px-6 py-4 ${
                  bid.status === "PENDING" ? "opacity-50" : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                      index === 0 && bid.status === "CONFIRMED"
                        ? "bg-amber-500 text-black"
                        : "bg-white/10 text-gray-400"
                    }`}
                  >
                    {bidsWithProject.length - index}
                  </div>
                  <div>
                    <Link
                      href={`/project/${bid.project.slug}`}
                      className="font-medium text-white hover:text-amber-400"
                    >
                      {bid.project.name}
                    </Link>
                    <p className="text-xs text-gray-400">
                      {new Intl.DateTimeFormat("vi-VN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(bid.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-semibold ${
                      index === 0 && bid.status === "CONFIRMED"
                        ? "text-emerald-400"
                        : "text-white"
                    }`}
                  >
                    {formatCurrency(bid.bidAmount)}
                  </p>
                  <p
                    className={`text-xs ${
                      bid.status === "CONFIRMED"
                        ? "text-emerald-400"
                        : bid.status === "PENDING"
                        ? "text-amber-400"
                        : "text-red-400"
                    }`}
                  >
                    {bid.status === "CONFIRMED"
                      ? "Confirmed"
                      : bid.status === "PENDING"
                      ? "Pending Payment"
                      : "Failed"}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

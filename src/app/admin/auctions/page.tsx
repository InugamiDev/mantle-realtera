import Link from "next/link";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

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
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getStatusBadge(status: string, endTime: Date) {
  const isExpired = endTime < new Date();

  if (isExpired && status === "ACTIVE") {
    return (
      <span className="inline-flex items-center rounded-full bg-gray-500/20 px-2 py-1 text-xs text-gray-400">
        Ended
      </span>
    );
  }

  switch (status) {
    case "ACTIVE":
      return (
        <span className="inline-flex items-center rounded-full bg-emerald-500/20 px-2 py-1 text-xs text-emerald-400">
          Active
        </span>
      );
    case "PENDING":
      return (
        <span className="inline-flex items-center rounded-full bg-amber-500/20 px-2 py-1 text-xs text-amber-400">
          Pending
        </span>
      );
    case "COMPLETED":
      return (
        <span className="inline-flex items-center rounded-full bg-blue-500/20 px-2 py-1 text-xs text-blue-400">
          Completed
        </span>
      );
    case "CANCELLED":
      return (
        <span className="inline-flex items-center rounded-full bg-red-500/20 px-2 py-1 text-xs text-red-400">
          Cancelled
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center rounded-full bg-gray-500/20 px-2 py-1 text-xs text-gray-400">
          {status}
        </span>
      );
  }
}

export default async function AuctionsPage() {
  const auctionsRaw = await db.sponsoredAuction.findMany({
    include: {
      bids: {
        where: { status: "CONFIRMED" },
        orderBy: { bidAmount: "desc" },
        take: 1,
      },
      _count: {
        select: { bids: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Collect all project IDs from highest bids (soft references)
  const projectIds = new Set<string>();
  auctionsRaw.forEach((auction) => {
    auction.bids.forEach((bid) => projectIds.add(bid.projectId));
    if (auction.winningProjectId) projectIds.add(auction.winningProjectId);
  });

  // Fetch projects separately (soft reference lookup)
  const projects = await db.project.findMany({
    where: { id: { in: Array.from(projectIds) } },
    select: { id: true, name: true, slug: true },
  });
  const projectMap = new Map(projects.map((p) => [p.id, p]));

  // Enrich auctions with project data
  const auctions = auctionsRaw.map((auction) => ({
    ...auction,
    bids: auction.bids.map((bid) => ({
      ...bid,
      project: projectMap.get(bid.projectId) || { name: "Unknown", slug: "" },
    })),
    winningProject: auction.winningProjectId
      ? projectMap.get(auction.winningProjectId)
      : null,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Auctions</h1>
          <p className="mt-1 text-gray-400">
            Manage sponsored tag auctions for developers.
          </p>
        </div>
        <Link
          href="/admin/auctions/new"
          className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-amber-400"
        >
          Create Auction
        </Link>
      </div>

      {/* Auctions Table */}
      <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 text-left text-sm text-gray-400">
              <th className="px-6 py-4 font-medium">Slot</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Min Bid</th>
              <th className="px-6 py-4 font-medium">Current Bid</th>
              <th className="px-6 py-4 font-medium">Bids</th>
              <th className="px-6 py-4 font-medium">End Time</th>
              <th className="px-6 py-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {auctions.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                  No auctions yet.{" "}
                  <Link href="/admin/auctions/new" className="text-amber-400 hover:underline">
                    Create your first auction
                  </Link>
                </td>
              </tr>
            ) : (
              auctions.map((auction) => (
                <tr key={auction.id} className="hover:bg-white/5">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-white">
                        {auction.slotName || auction.slotType}
                      </p>
                      {auction.description && (
                        <p className="mt-0.5 text-xs text-gray-400 line-clamp-1">
                          {auction.description}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(auction.status, auction.endTime)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {formatCurrency(auction.minBid)}
                  </td>
                  <td className="px-6 py-4">
                    {auction.bids[0] ? (
                      <div>
                        <p className="text-sm font-medium text-emerald-400">
                          {formatCurrency(auction.bids[0].bidAmount)}
                        </p>
                        <p className="text-xs text-gray-400">
                          by {auction.bids[0].project.name}
                        </p>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">No bids</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {auction._count.bids}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {formatDate(auction.endTime)}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/auctions/${auction.id}`}
                      className="text-sm text-amber-400 hover:text-amber-300"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

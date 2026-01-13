import Link from "next/link";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  // Get stats
  const [auctionCount, activeAuctions, totalBids] = await Promise.all([
    db.sponsoredAuction.count(),
    db.sponsoredAuction.count({
      where: {
        status: "ACTIVE",
        endTime: { gt: new Date() },
      },
    }),
    db.sponsoredBid.count({
      where: { status: "CONFIRMED" },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="mt-1 text-gray-400">
          Manage auctions, view analytics, and configure platform settings.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-gray-400">Total Auctions</p>
          <p className="mt-2 text-3xl font-bold text-white">{auctionCount}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-gray-400">Active Auctions</p>
          <p className="mt-2 text-3xl font-bold text-amber-400">{activeAuctions}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-gray-400">Total Confirmed Bids</p>
          <p className="mt-2 text-3xl font-bold text-white">{totalBids}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-gray-400">Revenue</p>
          <p className="mt-2 text-3xl font-bold text-emerald-400">--</p>
          <p className="mt-1 text-xs text-gray-500">Coming soon</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/admin/auctions"
            className="group rounded-xl border border-white/10 bg-white/5 p-6 transition-colors hover:border-amber-500/50 hover:bg-amber-500/5"
          >
            <h3 className="font-semibold text-white group-hover:text-amber-400">
              Manage Auctions
            </h3>
            <p className="mt-1 text-sm text-gray-400">
              View, create, and manage sponsored tag auctions.
            </p>
          </Link>
          <Link
            href="/admin/auctions/new"
            className="group rounded-xl border border-white/10 bg-white/5 p-6 transition-colors hover:border-emerald-500/50 hover:bg-emerald-500/5"
          >
            <h3 className="font-semibold text-white group-hover:text-emerald-400">
              Create Auction
            </h3>
            <p className="mt-1 text-sm text-gray-400">
              Start a new sponsored tag auction.
            </p>
          </Link>
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 opacity-50">
            <h3 className="font-semibold text-white">Analytics</h3>
            <p className="mt-1 text-sm text-gray-400">Coming in Phase 3</p>
          </div>
        </div>
      </div>
    </div>
  );
}

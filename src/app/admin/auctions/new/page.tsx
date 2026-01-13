"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SLOT_TYPES = [
  { value: "HOMEPAGE_HERO", label: "Homepage Hero", description: "Main spotlight on homepage" },
  { value: "HOMEPAGE_FEATURED", label: "Homepage Featured", description: "Featured projects section" },
  { value: "SEARCH_TOP", label: "Search Top", description: "Top of search results" },
  { value: "CATEGORY_BANNER", label: "Category Banner", description: "Category page banner" },
  { value: "PROJECT_SIDEBAR", label: "Project Sidebar", description: "Sidebar on project pages" },
];

export default function NewAuctionPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    slotType: "HOMEPAGE_HERO",
    slotName: "",
    description: "",
    minBid: "",
    startTime: "",
    endTime: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/v1/auctions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slotType: formData.slotType,
          slotName: formData.slotName || formData.slotType,
          description: formData.description,
          minBid: parseInt(formData.minBid),
          startTime: new Date(formData.startTime).toISOString(),
          endTime: new Date(formData.endTime).toISOString(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create auction");
      }

      router.push("/admin/auctions");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Set default dates
  const getDefaultStartTime = () => {
    const now = new Date();
    now.setMinutes(0, 0, 0);
    return now.toISOString().slice(0, 16);
  };

  const getDefaultEndTime = () => {
    const end = new Date();
    end.setDate(end.getDate() + 7);
    end.setMinutes(0, 0, 0);
    return end.toISOString().slice(0, 16);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link
          href="/admin/auctions"
          className="text-sm text-gray-400 hover:text-white"
        >
          &larr; Back to Auctions
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-white">Create New Auction</h1>
        <p className="mt-1 text-gray-400">
          Set up a new sponsored tag auction for developers to bid on.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Slot Type */}
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Slot Type
          </label>
          <select
            value={formData.slotType}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, slotType: e.target.value }))
            }
            className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            {SLOT_TYPES.map((slot) => (
              <option key={slot.value} value={slot.value} className="bg-gray-900">
                {slot.label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-400">
            {SLOT_TYPES.find((s) => s.value === formData.slotType)?.description}
          </p>
        </div>

        {/* Slot Name */}
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Display Name
          </label>
          <input
            type="text"
            value={formData.slotName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, slotName: e.target.value }))
            }
            placeholder="e.g., Trang chủ - Spotlight"
            className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            rows={3}
            placeholder="Describe the benefits of this sponsored slot..."
            className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        {/* Minimum Bid */}
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Minimum Bid (VND)
          </label>
          <input
            type="number"
            required
            value={formData.minBid}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, minBid: e.target.value }))
            }
            placeholder="10000000"
            min="1000000"
            step="1000000"
            className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
          <p className="mt-1 text-xs text-gray-400">
            Minimum: 1,000,000 VND
          </p>
        </div>

        {/* Start Time */}
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Start Time
          </label>
          <input
            type="datetime-local"
            required
            value={formData.startTime || getDefaultStartTime()}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, startTime: e.target.value }))
            }
            className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        {/* End Time */}
        <div>
          <label className="block text-sm font-medium text-gray-300">
            End Time
          </label>
          <input
            type="datetime-local"
            required
            value={formData.endTime || getDefaultEndTime()}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, endTime: e.target.value }))
            }
            className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 rounded-lg bg-amber-500 px-4 py-3 font-medium text-black transition-colors hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Create Auction"}
          </button>
          <Link
            href="/admin/auctions"
            className="rounded-lg border border-white/10 px-4 py-3 text-center text-gray-300 transition-colors hover:border-white/20 hover:text-white"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

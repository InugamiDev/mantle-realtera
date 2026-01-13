import { redirect } from "next/navigation";
import { stackServerApp } from "@/stack/server";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await stackServerApp.getUser();

  if (!user) {
    redirect("/handler/sign-in?after_auth_return_to=/admin");
  }

  const metadata = user.clientReadOnlyMetadata as { role?: string } | null;
  if (metadata?.role !== "admin") {
    redirect("/?error=forbidden");
  }

  return (
    <div className="min-h-screen">
      {/* Admin Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/admin" className="text-lg font-semibold text-amber-400">
                Admin Dashboard
              </Link>
              <nav className="flex gap-4">
                <Link
                  href="/admin/auctions"
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Auctions
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-400">
                {user.primaryEmail}
              </span>
              <Link
                href="/"
                className="text-xs text-gray-400 hover:text-white transition-colors"
              >
                Exit Admin
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Content */}
      <div className="mx-auto max-w-7xl px-4 py-8">{children}</div>
    </div>
  );
}

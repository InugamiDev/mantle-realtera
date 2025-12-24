import type { Metadata } from "next";
import { Suspense } from "react";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackClientApp } from "@/stack/client";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { TrustBar } from "@/components/layout/TrustBar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { WatchlistProvider } from "@/contexts/WatchlistContext";
import { CursorGlow } from "@/components/effects/CursorGlow";
import { Web3Provider } from "@/providers/Web3Provider";
import { UnifiedAuthProvider } from "@/providers/UnifiedAuthProvider";
import { Toaster } from "@/components/ui/Toast";

// Conditional wrapper for StackProvider - only wraps if Stack Auth is configured
function ConditionalStackProvider({ children }: { children: React.ReactNode }) {
  if (stackClientApp) {
    return (
      <StackProvider app={stackClientApp}>
        <StackTheme>{children}</StackTheme>
      </StackProvider>
    );
  }
  return <>{children}</>;
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RealTera - Xếp hạng Bất động sản Minh bạch",
  description:
    "Xếp hạng trước. Minh bạch luôn hiển thị. Không quảng cáo trá hình. Xếp hạng dự án bất động sản Việt Nam đáng tin cậy.",
  keywords: ["bất động sản", "xếp hạng", "tier", "Việt Nam", "đầu tư", "mua nhà"],
  authors: [{ name: "RealTera" }],
  openGraph: {
    title: "RealTera - Xếp hạng Bất động sản Minh bạch",
    description: "Xếp hạng trước. Minh bạch luôn hiển thị. Không quảng cáo trá hình.",
    type: "website",
    locale: "vi_VN",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <ConditionalStackProvider>
            <Web3Provider>
              <Suspense fallback={null}>
                <UnifiedAuthProvider>
                  <WatchlistProvider>
                    {/* Animated background with mesh gradient and orbs */}
                    <div className="app-background" aria-hidden="true">
                      <div className="orb orb-1" />
                      <div className="orb orb-2" />
                      <div className="orb orb-3" />
                      <div className="orb orb-4" />
                      <div className="noise" />
                    </div>

                    {/* Floating particles - reduced for performance */}
                    <div className="particles" aria-hidden="true">
                      <div className="particle" />
                      <div className="particle" />
                      <div className="particle" />
                      <div className="particle" />
                      <div className="particle" />
                    </div>

                    {/* Sticky header */}
                    <Header />

                    {/* Trust bar */}
                    <TrustBar />

                    {/* Main content */}
                    <main className="relative flex-1 pb-20 lg:pb-0">{children}</main>

                    {/* Footer */}
                    <Footer />

                    {/* Mobile bottom navigation */}
                    <MobileNav />

                    {/* Cursor glow effect (desktop only) */}
                    <CursorGlow />

                    {/* Toast notifications */}
                    <Toaster />
                  </WatchlistProvider>
                </UnifiedAuthProvider>
              </Suspense>
            </Web3Provider>
          </ConditionalStackProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

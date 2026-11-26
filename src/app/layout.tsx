import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Coral Fanatics · Corals, marine life & reef essentials in Singapore", template: "%s · Coral Fanatics" },
  description: "Discover exceptional corals, marine life and everything you need to build your own reef.",
  // Phase 1 prototype: keep out of search engines.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#09212C",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-SG">
      <body className="min-h-dvh">
        {children}
        <div className="pointer-events-none fixed top-[62px] left-3 z-[70] lg:top-auto lg:bottom-3 rounded-full border border-amber-600/40 bg-amber-100/95 px-3 py-1 text-[11px] font-semibold tracking-wide text-amber-600 shadow-sm">
          PROTOTYPE<span className="hidden sm:inline"> · SAMPLE DATA · PLACEHOLDERS</span>
        </div>
      </body>
    </html>
  );
}

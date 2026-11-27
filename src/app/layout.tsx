import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Coral Fanatics · Corals, marine life and reef essentials in Singapore", template: "%s · Coral Fanatics" },
  description: "Discover exceptional corals, marine life and everything you need to build your own reef.",
  // Phase 1 prototype: keep out of search engines.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-SG" data-scroll-behavior="smooth">
      <body className="min-h-dvh">
        <noscript>
          <style>{`.img-fade{opacity:1}`}</style>
        </noscript>
        {children}
        {/* Prototype marker: placeholders.md requires placeholders to be identifiable outside production. */}
        <div className="pointer-events-none fixed right-3 bottom-3 z-[70] rounded-full bg-black/75 px-3 py-1.5 text-[11px] font-medium text-white/90 backdrop-blur max-lg:bottom-20">
          Prototype · sample data
        </div>
      </body>
    </html>
  );
}

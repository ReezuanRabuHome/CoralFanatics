import { BagProvider } from "@/components/store/bag";
import { Header } from "@/components/store/Header";
import { Footer } from "@/components/store/Footer";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <BagProvider>
      <a href="#main" className="sr-only z-[80] rounded bg-pearl-50 px-4 py-2 focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
        Skip to content
      </a>
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </BagProvider>
  );
}

import type { Metadata } from "next";
import { SpecimenCard, ProductCard } from "@/components/store/cards";
import { products, specimens } from "@/data/sample";

export const metadata: Metadata = { title: "New arrivals" };

export default function NewArrivalsPage() {
  const available = specimens.filter((s) => s.status === "AVAILABLE" || s.status === "RESERVED");
  const groups = [
    { title: "Today.", items: available.filter((s) => s.listedDaysAgo === 0) },
    { title: "This week.", items: available.filter((s) => s.listedDaysAgo > 0 && s.listedDaysAgo <= 6) },
    { title: "Earlier.", items: available.filter((s) => s.listedDaysAgo > 6) },
  ].filter((g) => g.items.length);
  const livestock = products.filter((p) => p.isLivestock).slice(0, 4);

  return (
    <div className="bg-mist">
      <div className="container-wide pt-24 pb-24 lg:pt-28">
        <header className="mb-14">
          <h1 className="t-section">New arrivals.</h1>
          <p className="t-sub mt-3 max-w-[46ch] text-ink-2">The newest corals and marine life in the shop. Every coral is the exact piece you&rsquo;ll receive.</p>
        </header>
        {groups.map((g) => (
          <section key={g.title} className="mb-16">
            <h2 className="t-h3 mb-6 md:text-[24px]">{g.title} <span className="tabular font-normal text-ink-2">{g.items.length} pieces</span></h2>
            <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 xl:grid-cols-4">
              {g.items.map((s) => <li key={s.code}><SpecimenCard s={s} className="h-full" /></li>)}
            </ul>
          </section>
        ))}
        <section>
          <h2 className="t-h3 mb-6 md:text-[24px]">Fish and invertebrates.</h2>
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 xl:grid-cols-4">
            {livestock.map((p) => <li key={p.slug}><ProductCard p={p} className="h-full" /></li>)}
          </ul>
        </section>
      </div>
    </div>
  );
}

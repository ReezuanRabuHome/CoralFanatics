import type { Metadata } from "next";
import { SpecimenCard, ProductCard } from "@/components/store/cards";
import { products, specimens } from "@/data/sample";

export const metadata: Metadata = { title: "New arrivals" };

export default function NewArrivalsPage() {
  const available = specimens.filter((s) => s.status === "AVAILABLE" || s.status === "RESERVED");
  const groups = [
    { title: "Today", items: available.filter((s) => s.listedDaysAgo === 0) },
    { title: "This week", items: available.filter((s) => s.listedDaysAgo > 0 && s.listedDaysAgo <= 6) },
    { title: "Earlier", items: available.filter((s) => s.listedDaysAgo > 6) },
  ].filter((g) => g.items.length);
  const livestock = products.filter((p) => p.isLivestock).slice(0, 4);

  return (
    <div className="container-wide pt-24 pb-24 lg:pt-32">
      <header className="mb-12 max-w-3xl">
        <p className="t-eyebrow text-gold-700">Just landed</p>
        <h1 className="t-h1 mt-3">New arrivals.</h1>
        <p className="mt-3 text-lg text-ink-600">The newest corals and marine life in the shop. Every coral is the exact piece you&rsquo;ll receive.</p>
      </header>
      {groups.map((g) => (
        <section key={g.title} className="mb-16">
          <h2 className="t-h2 mb-6 flex items-baseline gap-3">
            {g.title} <span className="tabular text-base font-normal text-ink-600">{g.items.length}</span>
          </h2>
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4 xl:grid-cols-5">
            {g.items.map((s) => <SpecimenCard key={s.code} s={s} />)}
          </div>
        </section>
      ))}
      <section>
        <h2 className="t-h2 mb-6">Fish &amp; invertebrates</h2>
        <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4 xl:grid-cols-5">
          {livestock.map((p) => <ProductCard key={p.slug} p={p} />)}
        </div>
      </section>
    </div>
  );
}

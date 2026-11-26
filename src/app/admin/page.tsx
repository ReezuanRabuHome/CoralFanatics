import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { products, sampleOrders, specimens, totalStock } from "@/data/sample";
import { formatPrice } from "@/lib/money";
import { PaymentPill } from "./pills";

export default function AdminOverview() {
  const lowStock = products.filter((p) => !p.isLivestock && totalStock(p) <= p.lowStockThreshold);
  const avail = specimens.filter((s) => s.status === "AVAILABLE").length;
  const reserved = specimens.filter((s) => s.status === "RESERVED").length;
  const sold = specimens.filter((s) => s.status === "SOLD").length;
  // Sample daily sales for the bar chart (layout only)
  const daily = [8, 12, 6, 14, 9, 18, 11, 7, 15, 13, 10, 16, 21, 12];

  return (
    <div className="mx-auto max-w-[1280px]">
      <h1 className="font-display text-2xl font-semibold">Good afternoon</h1>
      <p className="mt-1 text-ink-600">Thursday 26 November · sample data</p>

      <section className="mt-6 rounded-lg border border-pearl-300 bg-pearl-50">
        <h2 className="border-b border-pearl-300 px-5 py-3 font-semibold">Needs attention</h2>
        <ul className="divide-y divide-pearl-300">
          {[
            ["3 orders to fulfil", "1 collection today · 2 deliveries Sat", "/admin/orders/CF-10042"],
            [`${reserved} specimens reserved in checkout`, "Auto-release after 15 minutes if unpaid", "/admin/livestock"],
            [`${lowStock.length} low-stock products`, lowStock.map((p) => p.name).join(", "), "/admin#inventory"],
            ["All specimens have photos", "Placeholder report: 0 published items missing photos (prototype uses placeholders throughout)", "/admin/livestock"],
          ].map(([t, d, href]) => (
            <li key={t}>
              <Link href={href!} className="flex items-center gap-4 px-5 py-3 hover:bg-pearl-100">
                <div className="flex-1">
                  <p className="font-semibold">{t}</p>
                  <p className="text-[13px] text-ink-600">{d}</p>
                </div>
                <ChevronRight className="size-4 text-ink-600" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          ["Today's sales", formatPrice(124000), "+18% vs 30-day avg"],
          ["Orders today", "9", "3 collection · 6 delivery"],
          ["Awaiting payment", "1", "In HitPay checkout"],
          ["To fulfil", "3", "Oldest: 1 day"],
        ].map(([k, v, d]) => (
          <div key={k} className="rounded-lg border border-pearl-300 bg-pearl-50 p-4">
            <p className="text-[13px] text-ink-600">{k}</p>
            <p className="tabular mt-1 font-display text-2xl font-semibold">{v}</p>
            <p className="mt-1 text-xs text-ink-600">{d}</p>
          </div>
        ))}
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <section className="rounded-lg border border-pearl-300 bg-pearl-50 p-5 lg:col-span-3">
          <h2 className="font-semibold">Sales, last 14 days</h2>
          <p className="text-xs text-ink-600">Sample values (S$ hundreds)</p>
          <div className="mt-6 flex h-40 items-end gap-1.5" role="img" aria-label="Bar chart of sample daily sales">
            {daily.map((v, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div className={`w-full rounded-t-[3px] ${i === daily.length - 1 ? "bg-ocean-900" : "bg-ocean-300"}`} style={{ height: `${(v / 21) * 100}%` }} />
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[11px] text-ink-600"><span>13 Nov</span><span>Today</span></div>
        </section>
        <section className="rounded-lg border border-pearl-300 bg-pearl-50 lg:col-span-2">
          <h2 className="border-b border-pearl-300 px-5 py-3 font-semibold">Recent orders</h2>
          <ul className="divide-y divide-pearl-300">
            {sampleOrders.slice(0, 4).map((o) => (
              <li key={o.number}>
                <Link href={`/admin/orders/${o.number}`} className="flex items-center gap-3 px-5 py-2.5 hover:bg-pearl-100">
                  <span className="tabular w-20 font-semibold">{o.number}</span>
                  <span className="flex-1"><PaymentPill v={o.payment} /></span>
                  <span className="tabular">{formatPrice(o.totalCents)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-lg border border-pearl-300 bg-pearl-50 px-5 py-4">
        <span className="font-semibold">Livestock</span>
        <span className="tabular text-ink-600"><span className="font-semibold text-green-600">{avail}</span> available</span>
        <span className="tabular text-ink-600"><span className="font-semibold text-amber-600">{reserved}</span> reserved</span>
        <span className="tabular text-ink-600"><span className="font-semibold text-red-600">{sold}</span> sold (7d)</span>
        <Link href="/admin/livestock" className="ml-auto font-semibold hover:underline">Open livestock board →</Link>
      </section>
    </div>
  );
}

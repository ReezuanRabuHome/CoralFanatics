"use client";

/**
 * Coral listing with limited filters (Deliverable 4 §3).
 * Prototype filters in memory; production reads filters from URL params on the server.
 */
import { useMemo, useState } from "react";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { SpecimenCard } from "@/components/store/cards";
import type { Specimen } from "@/data/sample";

const priceBands = [
  { id: "u50", label: "Under S$50", test: (c: number) => c < 5000 },
  { id: "50-100", label: "S$50 – 100", test: (c: number) => c >= 5000 && c <= 10000 },
  { id: "100-250", label: "S$100 – 250", test: (c: number) => c > 10000 && c <= 25000 },
  { id: "250", label: "S$250+", test: (c: number) => c > 25000 },
];

type Filters = { sub: string[]; colour: string[]; price: string[]; lighting: string[]; flow: string[]; care: string[] };
const empty: Filters = { sub: [], colour: [], price: [], lighting: [], flow: [], care: [] };

const sorts = {
  newest: { label: "Newest", fn: (a: Specimen, b: Specimen) => a.listedDaysAgo - b.listedDaysAgo },
  priceAsc: { label: "Price: low to high", fn: (a: Specimen, b: Specimen) => a.priceCents - b.priceCents },
  priceDesc: { label: "Price: high to low", fn: (a: Specimen, b: Specimen) => b.priceCents - a.priceCents },
} as const;

const flowMatches = (flow: string, want: string) => flow.includes(want);

export function CoralListing({ items }: { items: Specimen[] }) {
  const [f, setF] = useState<Filters>(empty);
  const [inStock, setInStock] = useState(true);
  const [sort, setSort] = useState<keyof typeof sorts>("newest");
  const [sheet, setSheet] = useState(false);

  const groups = useMemo(() => {
    const uniq = (xs: string[]) => [...new Set(xs)].sort();
    return [
      { key: "sub" as const, label: "Type", options: uniq(items.map((s) => s.subType)).map((v) => ({ id: v, label: v })) },
      { key: "colour" as const, label: "Colour", options: uniq(items.flatMap((s) => s.colours)).map((v) => ({ id: v, label: v })) },
      { key: "price" as const, label: "Price", options: priceBands.map((p) => ({ id: p.id, label: p.label })) },
      { key: "lighting" as const, label: "Lighting", options: ["Low", "Medium", "High"].map((v) => ({ id: v, label: v })) },
      { key: "flow" as const, label: "Flow", options: ["Low", "Medium", "High"].map((v) => ({ id: v, label: v })) },
      { key: "care" as const, label: "Care level", options: ["Beginner", "Intermediate", "Expert"].map((v) => ({ id: v, label: v })) },
    ];
  }, [items]);

  const match = (s: Specimen, skip?: keyof Filters) =>
    (!inStock || s.status === "AVAILABLE" || s.status === "RESERVED") &&
    (skip === "sub" || !f.sub.length || f.sub.includes(s.subType)) &&
    (skip === "colour" || !f.colour.length || f.colour.some((c) => s.colours.includes(c))) &&
    (skip === "price" || !f.price.length || f.price.some((id) => priceBands.find((p) => p.id === id)!.test(s.priceCents))) &&
    (skip === "lighting" || !f.lighting.length || f.lighting.includes(s.lighting)) &&
    (skip === "flow" || !f.flow.length || f.flow.some((w) => flowMatches(s.flow, w))) &&
    (skip === "care" || !f.care.length || f.care.includes(s.care));

  const results = items.filter((s) => match(s)).sort(sorts[sort].fn);

  const count = (key: keyof Filters, id: string) =>
    items.filter((s) => {
      if (!match(s, key)) return false;
      switch (key) {
        case "sub": return s.subType === id;
        case "colour": return s.colours.includes(id);
        case "price": return priceBands.find((p) => p.id === id)!.test(s.priceCents);
        case "lighting": return s.lighting === id;
        case "flow": return flowMatches(s.flow, id);
        case "care": return s.care === id;
      }
    }).length;

  const toggle = (key: keyof Filters, id: string) =>
    setF((prev) => ({ ...prev, [key]: prev[key].includes(id) ? prev[key].filter((x) => x !== id) : [...prev[key], id] }));
  const active = groups.flatMap((g) => f[g.key].map((id) => ({ key: g.key, id, label: g.options.find((o) => o.id === id)?.label ?? id })));

  const FilterPanel = (
    <div className="divide-y divide-pearl-300">
      {groups.map((g) => (
        <details key={g.key} open={g.key !== "care"} className="group py-4">
          <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold">
            {g.label}
            <ChevronDown className="size-4 transition-transform group-open:rotate-180" />
          </summary>
          <ul className="mt-3 space-y-1">
            {g.options.map((o) => {
              const n = count(g.key, o.id);
              const checked = f[g.key].includes(o.id);
              if (n === 0 && !checked) return null; // hide zero-result options
              return (
                <li key={o.id}>
                  <label className="flex min-h-9 cursor-pointer items-center gap-3 text-[15px]">
                    <input type="checkbox" className="size-[18px] accent-ocean-900" checked={checked} onChange={() => toggle(g.key, o.id)} />
                    <span className="flex-1">{o.label}</span>
                    <span className="tabular text-xs text-ink-600">{n}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </details>
      ))}
    </div>
  );

  return (
    <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-10">
      <aside className="hidden lg:block" aria-label="Filters">
        <div className="sticky top-24">{FilterPanel}</div>
      </aside>

      <div>
        {/* Toolbar */}
        <div className="sticky top-14 z-20 -mx-4 mb-6 flex items-center gap-3 border-b border-pearl-300 bg-pearl-100/95 px-4 py-3 backdrop-blur lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:px-0 lg:py-0">
          <button className="btn btn-sm btn-secondary lg:hidden" onClick={() => setSheet(true)}>
            <SlidersHorizontal className="size-4" /> Filter{active.length ? ` (${active.length})` : ""}
          </button>
          <p className="tabular hidden text-sm text-ink-600 lg:block">{results.length} specimens</p>
          <label className="ml-auto flex items-center gap-2 text-sm lg:ml-6">
            <input type="checkbox" className="size-4 accent-ocean-900" checked={inStock} onChange={(e) => setInStock(e.target.checked)} />
            In stock only
          </label>
          <label className="flex items-center gap-2 text-sm lg:ml-auto">
            <span className="hidden sm:inline text-ink-600">Sort</span>
            <select className="h-9 rounded-full border border-pearl-300 bg-pearl-50 px-3 text-sm font-medium" value={sort} onChange={(e) => setSort(e.target.value as keyof typeof sorts)}>
              {Object.entries(sorts).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </label>
        </div>

        {active.length > 0 && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            {active.map((a) => (
              <button key={`${a.key}-${a.id}`} onClick={() => toggle(a.key, a.id)} className="inline-flex h-8 items-center gap-1.5 rounded-full bg-ink-900 px-3 text-sm text-pearl-50">
                {a.label} <X className="size-3.5" aria-label="remove" />
              </button>
            ))}
            <button onClick={() => setF(empty)} className="ml-1 text-sm font-semibold underline-offset-4 hover:underline">Clear all</button>
          </div>
        )}

        {results.length === 0 ? (
          <div className="rounded-xl border border-pearl-300 bg-pearl-50 px-6 py-16 text-center">
            <p className="t-h3">No corals match these filters.</p>
            <button className="btn btn-secondary mt-6" onClick={() => setF(empty)}>Clear filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-6 xl:grid-cols-4 lg:gap-y-12">
            {results.map((s) => <SpecimenCard key={s.code} s={s} />)}
          </div>
        )}
        <p className="tabular mt-12 text-center text-sm text-ink-600">Showing {results.length} of {results.length}</p>
      </div>

      {/* Mobile filter bottom sheet */}
      <div className={`fixed inset-0 z-[60] lg:hidden ${sheet ? "" : "pointer-events-none"}`} aria-hidden={!sheet}>
        <div className={`absolute inset-0 bg-ocean-950/50 transition-opacity ${sheet ? "opacity-100" : "opacity-0"}`} onClick={() => setSheet(false)} />
        <div role="dialog" aria-modal="true" aria-label="Filters" className={`absolute inset-x-0 bottom-0 flex h-[85dvh] flex-col rounded-t-2xl bg-pearl-50 transition-transform duration-250 ${sheet ? "translate-y-0" : "translate-y-full"}`}>
          <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-pearl-300" />
          <div className="flex items-center justify-between px-5 pt-3 pb-2">
            <h2 className="t-h3">Filter</h2>
            <button className="text-sm font-semibold" onClick={() => setF(empty)}>Clear all</button>
          </div>
          <div className="flex-1 overflow-y-auto px-5">{FilterPanel}</div>
          <div className="border-t border-pearl-300 p-4">
            <button className="btn btn-primary btn-lg w-full" onClick={() => setSheet(false)}>Show {results.length} results</button>
          </div>
        </div>
      </div>
    </div>
  );
}

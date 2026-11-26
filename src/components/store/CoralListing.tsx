"use client";

/**
 * Coral listing (Deliverable 4). Filters live behind one "Filter" control so the
 * page stays about the corals. Prototype filters in memory; production reads
 * filters from URL params on the server.
 */
import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { SpecimenCard } from "@/components/store/cards";
import type { Specimen } from "@/data/sample";

const priceBands = [
  { id: "u50", label: "Under S$50", test: (c: number) => c < 5000 },
  { id: "50-100", label: "S$50 – S$100", test: (c: number) => c >= 5000 && c <= 10000 },
  { id: "100-250", label: "S$100 – S$250", test: (c: number) => c > 10000 && c <= 25000 },
  { id: "250", label: "Over S$250", test: (c: number) => c > 25000 },
];

type Key = "sub" | "colour" | "price" | "lighting" | "flow" | "care";
type Filters = Record<Key, string[]>;
const empty: Filters = { sub: [], colour: [], price: [], lighting: [], flow: [], care: [] };

const sorts = {
  newest: { label: "Newest", fn: (a: Specimen, b: Specimen) => a.listedDaysAgo - b.listedDaysAgo },
  priceAsc: { label: "Price: Low to High", fn: (a: Specimen, b: Specimen) => a.priceCents - b.priceCents },
  priceDesc: { label: "Price: High to Low", fn: (a: Specimen, b: Specimen) => b.priceCents - a.priceCents },
} as const;

function test(s: Specimen, key: Key, id: string) {
  switch (key) {
    case "sub": return s.subType === id;
    case "colour": return s.colours.includes(id);
    case "price": return priceBands.find((p) => p.id === id)!.test(s.priceCents);
    case "lighting": return s.lighting === id;
    case "flow": return s.flow.includes(id);
    case "care": return s.care === id;
  }
}

export function CoralListing({ items }: { items: Specimen[] }) {
  const [f, setF] = useState<Filters>(empty);
  const [showSold, setShowSold] = useState(false);
  const [sort, setSort] = useState<keyof typeof sorts>("newest");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

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

  const match = (s: Specimen, skip?: Key) =>
    (showSold || s.status === "AVAILABLE" || s.status === "RESERVED") &&
    (Object.keys(f) as Key[]).every((k) => k === skip || !f[k].length || f[k].some((id) => test(s, k, id)));

  const results = items.filter((s) => match(s)).sort(sorts[sort].fn);
  const count = (key: Key, id: string) => items.filter((s) => match(s, key) && test(s, key, id)).length;
  const toggle = (key: Key, id: string) =>
    setF((prev) => ({ ...prev, [key]: prev[key].includes(id) ? prev[key].filter((x) => x !== id) : [...prev[key], id] }));
  const active = groups.flatMap((g) => f[g.key].map((id) => ({ key: g.key, id, label: g.options.find((o) => o.id === id)?.label ?? id })));

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center gap-x-3 gap-y-3">
        <button onClick={() => setOpen(true)} className="btn btn-sm btn-light shadow-[0_1px_2px_rgb(0_0_0/0.06)]">
          Filter{active.length ? ` (${active.length})` : ""}
        </button>
        {active.map((a) => (
          <button key={`${a.key}-${a.id}`} onClick={() => toggle(a.key, a.id)} className="btn btn-sm btn-quiet gap-1 bg-white ring-1 ring-hairline">
            {a.label} <X className="size-3.5" aria-label="Remove filter" />
          </button>
        ))}
        {active.length > 0 && (
          <button onClick={() => setF(empty)} className="link t-small">Clear all</button>
        )}
        <div className="ml-auto flex items-center gap-5">
          <span className="tabular t-small hidden text-ink-2 sm:inline">{results.length} pieces</span>
          <label className="t-small flex items-center gap-1.5 text-ink-2">
            Sort by
            <select className="cursor-pointer bg-transparent font-medium text-ink" value={sort} onChange={(e) => setSort(e.target.value as keyof typeof sorts)}>
              {Object.entries(sorts).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </label>
        </div>
      </div>

      {results.length === 0 ? (
        <div className="py-24 text-center">
          <p className="t-h3">No corals match these filters.</p>
          <button className="link mt-3" onClick={() => setF(empty)}>Clear filters</button>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 xl:grid-cols-4">
          {results.map((s) => <li key={s.code}><SpecimenCard s={s} className="h-full" /></li>)}
        </ul>
      )}

      {/* Filter panel: side sheet on desktop, bottom sheet on mobile */}
      <div className={`fixed inset-0 z-[60] ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
        <div className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`} onClick={() => setOpen(false)} />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Filter corals"
          className={`absolute flex flex-col bg-white transition-transform duration-300 ease-[var(--ease-reef-slow)] max-md:inset-x-0 max-md:bottom-0 max-md:h-[88dvh] max-md:rounded-t-3xl md:inset-y-0 md:right-0 md:w-[400px] ${
            open ? "translate-x-0 translate-y-0" : "max-md:translate-y-full md:translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-6 pt-6 pb-2">
            <h2 className="t-h3">Filter</h2>
            <button onClick={() => setOpen(false)} className="grid size-9 place-items-center rounded-full bg-mist" aria-label="Close"><X className="size-4" /></button>
          </div>
          <div className="flex-1 overflow-y-auto px-6">
            {groups.map((g) => (
              <fieldset key={g.key} className="border-b border-hairline py-5 last:border-0">
                <legend className="mb-3 text-[15px] font-semibold">{g.label}</legend>
                <div className="flex flex-wrap gap-2">
                  {g.options.map((o) => {
                    const on = f[g.key].includes(o.id);
                    const n = count(g.key, o.id);
                    if (n === 0 && !on) return null;
                    return (
                      <button
                        key={o.id}
                        type="button"
                        aria-pressed={on}
                        onClick={() => toggle(g.key, o.id)}
                        className={`h-9 rounded-full px-4 text-[14px] transition-colors ${on ? "bg-ink text-white" : "bg-mist text-ink hover:bg-mist-2"}`}
                      >
                        {o.label} <span className={`tabular ${on ? "text-white/60" : "text-ink-3"}`}>{n}</span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            ))}
            <label className="flex items-center justify-between py-5 text-[15px]">
              Show sold pieces
              <input type="checkbox" className="size-5 accent-[var(--color-reef)]" checked={showSold} onChange={(e) => setShowSold(e.target.checked)} />
            </label>
          </div>
          <div className="flex gap-3 border-t border-hairline p-5">
            <button className="btn btn-quiet flex-1" onClick={() => setF(empty)}>Clear</button>
            <button className="btn btn-primary flex-[2]" onClick={() => setOpen(false)}>Show {results.length} results</button>
          </div>
        </div>
      </div>
    </>
  );
}

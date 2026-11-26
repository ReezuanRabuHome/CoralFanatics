"use client";

/**
 * Livestock board (Deliverable 6 §4). Prototype: actions change local state only.
 * Production: each action is a permission-checked server action with an
 * atomic conditional update and an audit-log entry.
 */
import { useMemo, useState } from "react";
import { Camera, LayoutGrid, MoreVertical, Printer, Rows3, X } from "lucide-react";
import { specimens as seed, type Specimen, type SpecimenStatus } from "@/data/sample";
import { SpecimenStatusPill, specimenStatusMeta } from "@/components/StatusBadge";
import { PhotoPlaceholder } from "@/components/PhotoPlaceholder";
import { formatPrice } from "@/lib/money";

const tabs: SpecimenStatus[] = ["AVAILABLE", "RESERVED", "SOLD", "UNAVAILABLE", "DRAFT"];

export default function LivestockBoard() {
  const [items, setItems] = useState<Specimen[]>(seed);
  const [tab, setTab] = useState<SpecimenStatus | "ALL">("AVAILABLE");
  const [view, setView] = useState<"board" | "table">("board");
  const [q, setQ] = useState("");
  const [menu, setMenu] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const counts = useMemo(() => Object.fromEntries(tabs.map((t) => [t, items.filter((s) => s.status === t).length])), [items]);
  const shown = items.filter(
    (s) => (tab === "ALL" || s.status === tab) && (!q || `${s.code} ${s.species}`.toLowerCase().includes(q.toLowerCase())),
  );

  const act = (code: string, to: SpecimenStatus, msg: string) => {
    const s = items.find((x) => x.code === code);
    if (to === "SOLD" && s?.status === "RESERVED") {
      flash(`${code} is in a customer's checkout. Wait for it to expire or ask the owner.`);
      setMenu(null);
      return;
    }
    setItems((prev) => prev.map((x) => (x.code === code ? { ...x, status: to } : x)));
    setMenu(null);
    flash(msg);
  };
  const flash = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(null), 2800);
  };

  return (
    <div className="mx-auto max-w-[1400px]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold">Livestock</h1>
          <p className="mt-1 text-ink-600">Unique specimens. Each one is a single physical piece.</p>
        </div>
        <div className="flex items-center gap-2">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ID or species" className="h-9 w-44 rounded-md border border-pearl-300 bg-pearl-50 px-3 text-sm" />
          <div className="flex rounded-md border border-pearl-300 bg-pearl-50 p-0.5" role="group" aria-label="View">
            <button aria-pressed={view === "board"} onClick={() => setView("board")} className={`grid size-8 place-items-center rounded ${view === "board" ? "bg-pearl-200" : ""}`} aria-label="Board view"><LayoutGrid className="size-4" /></button>
            <button aria-pressed={view === "table"} onClick={() => setView("table")} className={`grid size-8 place-items-center rounded ${view === "table" ? "bg-pearl-200" : ""}`} aria-label="Table view"><Rows3 className="size-4" /></button>
          </div>
        </div>
      </div>

      <div className="no-scrollbar mt-5 flex gap-1.5 overflow-x-auto border-b border-pearl-300" role="tablist">
        {[...tabs, "ALL" as const].map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`-mb-px flex h-10 items-center gap-2 border-b-2 px-3 font-medium whitespace-nowrap ${tab === t ? "border-ink-900" : "border-transparent text-ink-600 hover:text-ink-900"}`}
          >
            {t === "ALL" ? "All" : specimenStatusMeta[t].admin}
            <span className="tabular rounded-full bg-pearl-200 px-1.5 text-xs">{t === "ALL" ? items.length : counts[t]}</span>
          </button>
        ))}
      </div>

      {shown.length === 0 && <p className="py-16 text-center text-ink-600">No specimens here.</p>}

      {view === "board" ? (
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {shown.map((s) => (
            <article key={s.code} className="relative overflow-hidden rounded-lg border border-pearl-300 bg-pearl-50">
              <PhotoPlaceholder label={s.code} tone="specimen" compact rounded={false} />
              <div className="space-y-1 p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="t-id font-semibold">{s.code}</span>
                  <button className="-mr-1 grid size-7 place-items-center rounded hover:bg-pearl-100" aria-label={`Actions for ${s.code}`} onClick={() => setMenu(menu === s.code ? null : s.code)}>
                    <MoreVertical className="size-4" />
                  </button>
                </div>
                <p className="truncate text-[13px]">{s.species}</p>
                <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 pt-1">
                  <span className="tabular font-semibold">{formatPrice(s.priceCents)}</span>
                  <SpecimenStatusPill status={s.status} variant="admin" />
                </div>
                {s.status === "RESERVED" && <p className="text-[11px] text-amber-600">Checkout #CHK-sample · expires in 9 min</p>}
              </div>
              {menu === s.code && <ActionMenu s={s} act={act} onClose={() => setMenu(null)} />}
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-5 overflow-x-auto rounded-lg border border-pearl-300 bg-pearl-50">
          <table className="w-full min-w-[760px] text-left">
            <thead className="sticky top-0 bg-pearl-50 text-xs text-ink-600">
              <tr className="border-b border-pearl-300">
                {["ID", "Species", "Price", "Status", "Location", "Listed", ""].map((h) => <th key={h} className={`px-4 py-2.5 font-medium ${h === "Price" ? "text-right" : ""}`}>{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-pearl-300">
              {shown.map((s) => (
                <tr key={s.code} className="h-11 hover:bg-pearl-100">
                  <td className="t-id px-4 font-semibold">{s.code}</td>
                  <td className="px-4">{s.species}</td>
                  <td className="tabular px-4 text-right">{formatPrice(s.priceCents)}</td>
                  <td className="px-4"><SpecimenStatusPill status={s.status} variant="admin" /></td>
                  <td className="px-4 text-ink-600">{s.tank}</td>
                  <td className="tabular px-4 text-ink-600">{s.listedDaysAgo === 0 ? "Today" : `${s.listedDaysAgo}d ago`}</td>
                  <td className="relative px-2 text-right">
                    <button className="grid size-8 place-items-center rounded hover:bg-pearl-200" aria-label={`Actions for ${s.code}`} onClick={() => setMenu(menu === s.code ? null : s.code)}><MoreVertical className="size-4" /></button>
                    {menu === s.code && <ActionMenu s={s} act={act} onClose={() => setMenu(null)} />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <NewSpecimenPanel />

      {toast && (
        <div role="status" className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-ink-900 px-4 py-2.5 text-sm text-pearl-50 shadow-lg lg:bottom-6">{toast}</div>
      )}
    </div>
  );
}

function ActionMenu({ s, act, onClose }: { s: Specimen; act: (code: string, to: SpecimenStatus, msg: string) => void; onClose: () => void }) {
  const item = "flex w-full items-center px-3 py-2 text-left text-[13px] hover:bg-pearl-100";
  return (
    <div className="absolute top-10 right-2 z-20 w-56 overflow-hidden rounded-lg border border-pearl-300 bg-pearl-50 py-1 text-left shadow-lg" role="menu">
      {s.status === "AVAILABLE" && (
        <>
          <button role="menuitem" className={`${item} font-semibold`} onClick={() => act(s.code, "SOLD", `${s.code} marked sold in store`)}>Mark sold in store</button>
          <button role="menuitem" className={item} onClick={() => act(s.code, "UNAVAILABLE", `${s.code} on hold`)}>Hold for customer</button>
          <button role="menuitem" className={item} onClick={() => act(s.code, "UNAVAILABLE", `${s.code} marked lost`)}>Mark lost</button>
        </>
      )}
      {s.status === "RESERVED" && <button role="menuitem" className={item} onClick={() => act(s.code, "SOLD", "")}>Mark sold in store</button>}
      {(s.status === "UNAVAILABLE" || s.status === "DRAFT") && (
        <button role="menuitem" className={`${item} font-semibold`} onClick={() => act(s.code, "AVAILABLE", `${s.code} published`)}>Make available</button>
      )}
      <div className="my-1 border-t border-pearl-300" />
      <button role="menuitem" className={item} onClick={onClose}>Edit price & photos</button>
      <button role="menuitem" className={item} onClick={onClose}>Duplicate as new specimen</button>
      <button role="menuitem" className={`${item} gap-2`} onClick={() => { onClose(); window.print(); }}><Printer className="size-3.5" />Print label</button>
    </div>
  );
}

function NewSpecimenPanel() {
  return (
    <section id="new" className="mt-10 scroll-mt-20 rounded-lg border border-pearl-300 bg-pearl-50 p-5 lg:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold">New specimen</h2>
          <p className="text-ink-600">Phone-friendly flow: photo, species, price, publish.</p>
        </div>
        <a href="#" className="grid size-8 place-items-center rounded hover:bg-pearl-100" aria-label="Close"><X className="size-4" /></a>
      </div>
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-pearl-300 bg-pearl-100 text-ink-600 hover:border-ink-600">
          <Camera className="size-7" strokeWidth={1.5} />
          <span className="font-semibold text-ink-900">Take or upload photos</span>
          <span className="text-xs">Top-down first · 1–5 images</span>
          <input type="file" accept="image/*" capture="environment" multiple className="sr-only" />
        </label>
        <form className="grid content-start gap-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="species">Species</label>
            <input id="species" list="species-list" className="field h-10" placeholder="Search e.g. “fox flame”" />
            <datalist id="species-list">{[...new Set(seed.map((s) => s.species))].map((s) => <option key={s} value={s} />)}</datalist>
            <p className="mt-1 text-xs text-ink-600">Name, category, care profile and description are inherited from the species.</p>
          </div>
          <div>
            <label className="label" htmlFor="price">Price (S$)</label>
            <input id="price" inputMode="decimal" className="field tabular h-10" placeholder="85.00" />
          </div>
          <div>
            <label className="label" htmlFor="size">Approx. size</label>
            <input id="size" className="field h-10" placeholder="~3 cm" />
          </div>
          <div>
            <label className="label" htmlFor="loc">Tank / rack location</label>
            <input id="loc" className="field h-10" placeholder="Rack B2" />
          </div>
          <div>
            <p className="label">Specimen ID</p>
            <p className="t-id flex h-10 items-center rounded-[10px] bg-pearl-100 px-3 text-ink-600">Auto-assigned on save (e.g. CF-SPS-0144)</p>
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="notes">Specimen notes <span className="font-normal text-ink-600">(optional)</span></label>
            <input id="notes" className="field h-10" placeholder="e.g. Two growth tips, green base" />
          </div>
          <div className="flex gap-2 sm:col-span-2">
            <button className="inline-flex h-10 items-center rounded-md border border-pearl-300 px-4 font-semibold hover:bg-pearl-100">Save draft</button>
            <button className="inline-flex h-10 items-center rounded-md bg-ocean-900 px-4 font-semibold text-pearl-50 hover:bg-ocean-700">Publish now</button>
            <p className="ml-auto self-center text-xs text-ink-600">Publishing requires a real photo.</p>
          </div>
        </form>
      </div>
    </section>
  );
}

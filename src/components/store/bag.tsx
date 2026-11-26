"use client";

/**
 * PROTOTYPE bag: client-side state persisted to localStorage, for layout only.
 * The real cart (Phase 5) is server-side, cookie-token based, with
 * server-authoritative prices and stock (Deliverables 8 & 9).
 */
import Link from "next/link";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { X, Minus, Plus, Check } from "lucide-react";
import { getProduct, getSpecimen, productHref, specimenHref } from "@/data/sample";
import { formatPrice } from "@/lib/money";
import { Photo } from "@/components/Photo";

export type BagLine =
  | { kind: "specimen"; code: string }
  | { kind: "variant"; slug: string; variantId: string; qty: number };

interface ResolvedLine {
  key: string;
  line: BagLine;
  title: string;
  subtitle: string;
  href: string;
  unitCents: number;
  qty: number;
  maxQty: number;
  isLivestock: boolean;
  photoLabel: string;
  photo?: string;
}

interface BagCtx {
  lines: ResolvedLine[];
  count: number;
  subtotalCents: number;
  containsLivestock: boolean;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (line: BagLine) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  has: (key: string) => boolean;
}

const Ctx = createContext<BagCtx | null>(null);
const STORAGE_KEY = "cf-prototype-bag";

export function lineKey(l: BagLine): string {
  return l.kind === "specimen" ? `s:${l.code}` : `v:${l.slug}:${l.variantId}`;
}

function resolve(l: BagLine): ResolvedLine | null {
  if (l.kind === "specimen") {
    const s = getSpecimen(l.code);
    if (!s) return null;
    return {
      key: lineKey(l), line: l, title: s.species, subtitle: s.code, href: specimenHref(s),
      unitCents: s.priceCents, qty: 1, maxQty: 1, isLivestock: true, photoLabel: `${s.species} ${s.code}`, photo: s.photo,
    };
  }
  const p = getProduct(l.slug);
  const v = p?.variants.find((x) => x.id === l.variantId);
  if (!p || !v) return null;
  return {
    key: lineKey(l), line: l, title: p.name, subtitle: p.variants.length > 1 ? v.name : (p.brand ?? v.name),
    href: productHref(p), unitCents: v.priceCents, qty: Math.min(l.qty, v.stock), maxQty: v.stock,
    isLivestock: p.isLivestock, photoLabel: p.name, photo: p.photo,
  };
}

export function BagProvider({ children }: { children: React.ReactNode }) {
  const [raw, setRaw] = useState<BagLine[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      if (v) setRaw(JSON.parse(v) as BagLine[]);
    } catch {
      /* storage unavailable: bag simply starts empty */
    }
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(raw));
    } catch {
      /* ignore */
    }
  }, [raw]);

  const add = useCallback((line: BagLine) => {
    setRaw((prev) => {
      const k = lineKey(line);
      const existing = prev.find((p) => lineKey(p) === k);
      if (existing) {
        if (existing.kind === "variant" && line.kind === "variant") {
          return prev.map((p) => (lineKey(p) === k && p.kind === "variant" ? { ...p, qty: p.qty + line.qty } : p));
        }
        return prev; // a unique specimen can only be in the bag once
      }
      return [...prev, line];
    });
    setOpen(true);
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setRaw((prev) => prev.map((p) => (lineKey(p) === key && p.kind === "variant" ? { ...p, qty: Math.max(1, qty) } : p)));
  }, []);
  const remove = useCallback((key: string) => setRaw((prev) => prev.filter((p) => lineKey(p) !== key)), []);

  const value = useMemo<BagCtx>(() => {
    const lines = raw.map(resolve).filter((x): x is ResolvedLine => x !== null && x.qty > 0);
    return {
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      subtotalCents: lines.reduce((n, l) => n + l.unitCents * l.qty, 0),
      containsLivestock: lines.some((l) => l.isLivestock),
      open, setOpen, add, setQty, remove,
      has: (key) => raw.some((p) => lineKey(p) === key),
    };
  }, [raw, open, add, setQty, remove]);

  return (
    <Ctx.Provider value={value}>
      {children}
      <BagDrawer />
    </Ctx.Provider>
  );
}

export function useBag(): BagCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("useBag must be used inside BagProvider");
  return c;
}

export function QtyStepper({ value, max, onChange, size = "md" }: { value: number; max: number; onChange: (n: number) => void; size?: "sm" | "md" }) {
  const h = size === "sm" ? "h-8" : "h-11";
  return (
    <div className={`inline-flex ${h} items-center rounded-full border border-pearl-300 bg-pearl-50`}>
      <button type="button" aria-label="Decrease quantity" className={`grid ${h} aspect-square place-items-center rounded-full hover:bg-pearl-100 disabled:opacity-30`} disabled={value <= 1} onClick={() => onChange(value - 1)}>
        <Minus className="size-3.5" />
      </button>
      <span className="tabular min-w-6 text-center text-sm font-semibold" aria-live="polite">{value}</span>
      <button type="button" aria-label="Increase quantity" className={`grid ${h} aspect-square place-items-center rounded-full hover:bg-pearl-100 disabled:opacity-30`} disabled={value >= max} onClick={() => onChange(value + 1)}>
        <Plus className="size-3.5" />
      </button>
    </div>
  );
}

function BagDrawer() {
  const { lines, open, setOpen, subtotalCents, setQty, remove } = useBag();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, setOpen]);

  return (
    <div className={`fixed inset-0 z-[60] ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div
        className={`absolute inset-0 bg-ocean-950/50 transition-opacity duration-250 ${open ? "opacity-100" : "opacity-0"}`}
        onClick={() => setOpen(false)}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Your bag"
        className={`absolute top-0 right-0 flex h-full w-full max-w-[420px] flex-col bg-pearl-50 shadow-2xl transition-transform duration-250 ease-[var(--ease-reef)] ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <header className="flex h-16 items-center justify-between border-b border-pearl-300 px-5">
          <h2 className="t-h3">Your bag</h2>
          <button className="grid size-10 place-items-center rounded-full hover:bg-pearl-100" onClick={() => setOpen(false)} aria-label="Close bag">
            <X className="size-5" />
          </button>
        </header>
        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <p className="text-ink-600">Your bag is empty.</p>
            <Link href="/new-arrivals" className="btn btn-primary" onClick={() => setOpen(false)}>See new arrivals</Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-pearl-300 overflow-y-auto px-5">
              {lines.map((l) => (
                <li key={l.key} className="flex gap-4 py-4">
                  <Link href={l.href} className="w-20 shrink-0" onClick={() => setOpen(false)}>
                    <Photo src={l.photo} alt={l.photoLabel} tone={l.line.kind === "specimen" ? "specimen" : "light"} compact rounded sizes="80px" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <div className="flex justify-between gap-3">
                      <Link href={l.href} className="truncate font-semibold hover:underline" onClick={() => setOpen(false)}>{l.title}</Link>
                      <span className="tabular font-semibold">{formatPrice(l.unitCents * l.qty)}</span>
                    </div>
                    <span className={l.line.kind === "specimen" ? "t-id text-ink-600" : "text-sm text-ink-600"}>{l.subtitle}</span>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      {l.line.kind === "variant" ? (
                        <QtyStepper size="sm" value={l.qty} max={l.maxQty} onChange={(n) => setQty(l.key, n)} />
                      ) : (
                        <span className="text-xs text-ink-600">Unique specimen · qty 1</span>
                      )}
                      <button className="text-sm text-ink-600 underline-offset-4 hover:underline" onClick={() => remove(l.key)}>Remove</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <footer className="border-t border-pearl-300 p-5">
              <div className="mb-1 flex justify-between text-base font-semibold">
                <span>Subtotal</span>
                <span className="tabular">{formatPrice(subtotalCents)}</span>
              </div>
              <p className="mb-4 text-sm text-ink-600">Delivery or collection is chosen at checkout.</p>
              <Link href="/checkout" className="btn btn-primary btn-lg w-full" onClick={() => setOpen(false)}>Checkout</Link>
              <button className="mt-2 h-11 w-full text-sm font-semibold hover:underline" onClick={() => setOpen(false)}>Continue shopping</button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}

/** Add-to-bag button with "Added" feedback. */
export function AddToBagButton({
  line,
  disabled,
  label = "Add to bag",
  className = "btn btn-primary btn-lg w-full",
}: {
  line: BagLine;
  disabled?: boolean;
  label?: string;
  className?: string;
}) {
  const { add, has } = useBag();
  const [justAdded, setJustAdded] = useState(false);
  const inBag = line.kind === "specimen" && has(lineKey(line));
  return (
    <button
      type="button"
      className={className}
      disabled={disabled || inBag}
      onClick={() => {
        add(line);
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 1600);
      }}
    >
      {justAdded || inBag ? (
        <>
          <Check className="size-4" /> {inBag ? "In your bag" : "Added"}
        </>
      ) : (
        label
      )}
    </button>
  );
}

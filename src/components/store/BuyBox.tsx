"use client";

import { useState } from "react";
import type { Product } from "@/data/sample";
import { formatPrice } from "@/lib/money";
import { StockPill } from "@/components/StatusBadge";
import { AddToBagButton, QtyStepper } from "@/components/store/bag";
import { policies } from "@/config/placeholders";

/** Variant selector + quantity + add to bag, for quantity-based products. */
export function BuyBox({ p }: { p: Product }) {
  const firstInStock = p.variants.find((v) => v.stock > 0) ?? p.variants[0]!;
  const [variantId, setVariantId] = useState(firstInStock.id);
  const [qty, setQty] = useState(1);
  const v = p.variants.find((x) => x.id === variantId)!;
  const optionName = p.isLivestock ? "Size" : "Option";

  const cta = v.stock > 0
    ? <AddToBagButton line={{ kind: "variant", slug: p.slug, variantId: v.id, qty }} />
    : <button className="btn btn-secondary btn-lg w-full" disabled>Sold out</button>;

  return (
    <div>
      <div className="flex items-end justify-between gap-4 border-t border-pearl-300 pt-6">
        <div>
          <p className="tabular text-3xl font-semibold tracking-tight">{formatPrice(v.priceCents)}</p>
          <p className="mt-1 text-xs text-ink-600">{policies.gstNote}</p>
        </div>
        <StockPill stock={v.stock} low={p.lowStockThreshold} />
      </div>

      {p.variants.length > 1 && (
        <fieldset className="mt-6">
          <legend className="label">{optionName}: <span className="font-normal text-ink-600">{v.name}</span></legend>
          <div className="flex flex-wrap gap-2">
            {p.variants.map((x) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={x.id === variantId}
                onClick={() => { setVariantId(x.id); setQty(1); }}
                className={`h-11 rounded-full border px-5 text-sm font-medium ${
                  x.id === variantId ? "border-ink-900 bg-ink-900 text-pearl-50" : "border-pearl-300 bg-pearl-50 hover:border-ink-900"
                } ${x.stock <= 0 ? "line-through opacity-60" : ""}`}
              >
                {x.name}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      <div className="mt-6 hidden items-center gap-3 lg:flex">
        {v.stock > 0 && <QtyStepper value={qty} max={v.stock} onChange={setQty} />}
        <div className="flex-1">{cta}</div>
      </div>

      {/* Mobile sticky bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-pearl-300 bg-pearl-50/95 px-4 py-3 backdrop-blur lg:hidden">
        {v.stock > 0 && <QtyStepper value={qty} max={v.stock} onChange={setQty} />}
        <div className="flex-1">
          {v.stock > 0
            ? <AddToBagButton line={{ kind: "variant", slug: p.slug, variantId: v.id, qty }} className="btn btn-primary w-full" label={`Add · ${formatPrice(v.priceCents * qty)}`} />
            : <button className="btn btn-secondary w-full" disabled>Sold out</button>}
        </div>
      </div>
    </div>
  );
}

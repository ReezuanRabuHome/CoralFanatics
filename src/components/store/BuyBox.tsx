"use client";

import { useState } from "react";
import type { Product } from "@/data/sample";
import { formatPrice } from "@/lib/money";
import { AddToBagButton, QtyStepper } from "@/components/store/bag";

/** Price, option tiles, quantity and add to bag for quantity-based products. */
export function BuyBox({ p }: { p: Product }) {
  const firstInStock = p.variants.find((v) => v.stock > 0) ?? p.variants[0]!;
  const [variantId, setVariantId] = useState(firstInStock.id);
  const [qty, setQty] = useState(1);
  const v = p.variants.find((x) => x.id === variantId)!;
  const availability = v.stock <= 0 ? "Currently sold out." : v.stock <= p.lowStockThreshold ? `Only ${v.stock} left.` : "In stock.";

  return (
    <div>
      <p className="tabular text-[28px] font-semibold tracking-[-0.02em]">{formatPrice(v.priceCents)}</p>
      <p className="t-small mt-1 text-ink-2">{availability}</p>

      {p.variants.length > 1 && (
        <fieldset className="mt-8">
          <legend className="mb-3 text-[17px] font-semibold">{p.isLivestock ? "Size." : "Choose an option."}</legend>
          <div className="grid gap-3">
            {p.variants.map((x) => {
              const on = x.id === variantId;
              return (
                <button
                  key={x.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => { setVariantId(x.id); setQty(1); }}
                  className={`flex items-center justify-between rounded-xl border px-5 py-4 text-left transition-colors ${on ? "border-reef ring-1 ring-reef" : "border-hairline hover:border-ink-3"}`}
                >
                  <span className="text-[17px] font-medium">{x.name}</span>
                  <span className="tabular text-[15px] text-ink-2">{x.stock > 0 ? formatPrice(x.priceCents) : "Sold out"}</span>
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      <div className="mt-8 hidden items-center gap-3 lg:flex">
        {v.stock > 0 && <QtyStepper value={qty} max={v.stock} onChange={setQty} />}
        <div className="flex-1">
          {v.stock > 0
            ? <AddToBagButton line={{ kind: "variant", slug: p.slug, variantId: v.id, qty }} className="btn btn-primary btn-lg w-full" />
            : <button className="btn btn-quiet btn-lg w-full" disabled>Sold out</button>}
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 bg-white/85 px-5 py-3 backdrop-blur-xl lg:hidden">
        {v.stock > 0 && <QtyStepper value={qty} max={v.stock} onChange={setQty} />}
        <div className="flex-1">
          {v.stock > 0
            ? <AddToBagButton line={{ kind: "variant", slug: p.slug, variantId: v.id, qty }} className="btn btn-primary w-full" />
            : <button className="btn btn-quiet w-full" disabled>Sold out</button>}
        </div>
      </div>
    </div>
  );
}

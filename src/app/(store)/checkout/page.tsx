"use client";

/**
 * Checkout UI (prototype). No order is created and no payment is taken.
 * Phase 5 implements: server re-validation, atomic reservation, HitPay payment
 * request and webhook confirmation (Deliverables 7–9).
 */
import Link from "next/link";
import { useEffect, useState } from "react";
import { Lock, MapPin, Store, Truck } from "lucide-react";
import { useBag } from "@/components/store/bag";
import { PhotoPlaceholder } from "@/components/PhotoPlaceholder";
import { formatPrice } from "@/lib/money";
import { fulfilment, policies, store } from "@/config/placeholders";

type Method = "COLLECTION" | "DELIVERY";

function nextDays(n: number) {
  const out: { value: string; label: string }[] = [];
  const d = new Date();
  for (let i = 1; i <= n; i++) {
    const x = new Date(d.getFullYear(), d.getMonth(), d.getDate() + i);
    out.push({ value: x.toISOString().slice(0, 10), label: x.toLocaleDateString("en-SG", { weekday: "short", day: "numeric", month: "short" }) });
  }
  return out;
}

function Section({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-pearl-300 bg-pearl-50 p-5 md:p-7">
      <h2 className="t-h3 mb-5 flex items-center gap-3">
        <span className="tabular grid size-7 place-items-center rounded-full bg-ink-900 text-sm text-pearl-50">{n}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function CheckoutPage() {
  const { lines, subtotalCents, containsLivestock } = useBag();
  const [method, setMethod] = useState<Method>("COLLECTION");
  const [days, setDays] = useState<{ value: string; label: string }[]>([]);
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  useEffect(() => setDays(nextDays(6)), []);

  const deliveryCents = method === "DELIVERY" ? fulfilment.deliveryFeeCents : 0;
  const total = subtotalCents + deliveryCents;
  const canPay = lines.length > 0 && (!containsLivestock || agreed);

  if (lines.length === 0) {
    return (
      <div className="container-content flex min-h-[70vh] flex-col items-center justify-center pt-24 text-center">
        <h1 className="t-h1">Your bag is empty.</h1>
        <p className="mt-3 text-ink-600">Add a coral or two, then come back to check out.</p>
        <Link href="/new-arrivals" className="btn btn-primary btn-lg mt-8">See new arrivals</Link>
      </div>
    );
  }

  return (
    <div className="container-content pt-24 pb-24 lg:pt-32">
      <h1 className="t-h1 mb-2">Checkout</h1>
      <p className="mb-10 flex items-center gap-2 text-sm text-ink-600"><Lock className="size-4" /> Guest checkout. No account needed.</p>

      <form
        className="grid gap-8 lg:grid-cols-12 lg:gap-12"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
      >
        <div className="space-y-6 lg:col-span-7">
          <Section n={1} title="Contact">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label htmlFor="email" className="label">Email</label>
                <input id="email" type="email" required autoComplete="email" className="field" />
                <p className="mt-1.5 text-xs text-ink-600">Your order confirmation and updates are sent here.</p>
              </div>
              <div>
                <label htmlFor="name" className="label">Full name</label>
                <input id="name" required autoComplete="name" className="field" />
              </div>
              <div>
                <label htmlFor="phone" className="label">Mobile number</label>
                <div className="flex">
                  <span className="grid h-12 place-items-center rounded-l-[10px] border border-r-0 border-pearl-300 bg-pearl-100 px-3 text-[15px] text-ink-600">+65</span>
                  <input id="phone" required inputMode="tel" autoComplete="tel-national" pattern="[689][0-9]{7}" className="field rounded-l-none" placeholder="8123 4567" />
                </div>
              </div>
            </div>
          </Section>

          <Section n={2} title="Collection or delivery">
            <div className="grid gap-3 md:grid-cols-2" role="radiogroup" aria-label="Fulfilment method">
              {([
                { id: "COLLECTION", icon: Store, title: "Collect from our shop", desc: store.address, price: "Free" },
                { id: "DELIVERY", icon: Truck, title: "Deliver to me", desc: "Singapore addresses only", price: `${formatPrice(fulfilment.deliveryFeeCents)} [TBC]` },
              ] as const).map((o) => (
                <label key={o.id} className={`flex cursor-pointer gap-3 rounded-xl border p-4 transition-colors ${method === o.id ? "border-ink-900 bg-pearl-100 ring-1 ring-ink-900" : "border-pearl-300 hover:border-ink-600"}`}>
                  <input type="radio" name="method" className="mt-1 size-[18px] accent-ocean-900" checked={method === o.id} onChange={() => setMethod(o.id)} />
                  <span className="flex-1">
                    <span className="flex items-center gap-2 font-semibold"><o.icon className="size-4 shrink-0" />{o.title}</span>
                    <span className="mt-1 block text-sm text-ink-600">{o.desc}</span>
                    <span className="tabular mt-2 block text-sm font-semibold">{o.price}</span>
                  </span>
                </label>
              ))}
            </div>

            {method === "DELIVERY" && (
              <div className="mt-6 grid gap-5 md:grid-cols-6">
                <div className="md:col-span-2">
                  <label htmlFor="postal" className="label">Postal code</label>
                  <input id="postal" required inputMode="numeric" pattern="[0-9]{6}" maxLength={6} className="field tabular" placeholder="6 digits" />
                </div>
                <div className="md:col-span-4">
                  <label htmlFor="street" className="label">Block and street</label>
                  <input id="street" required autoComplete="address-line1" className="field" placeholder="Filled in from your postal code" />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="unit" className="label">Unit number</label>
                  <input id="unit" autoComplete="address-line2" className="field" placeholder="#12-345" />
                </div>
                <div className="md:col-span-4">
                  <label htmlFor="building" className="label">Building name <span className="font-normal text-ink-600">(optional)</span></label>
                  <input id="building" className="field" />
                </div>
                <p className="flex items-center gap-2 text-xs text-ink-600 md:col-span-6"><MapPin className="size-3.5" /> Address lookup via OneMap (Phase 5).</p>
              </div>
            )}

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="date" className="label">{method === "COLLECTION" ? "Collection date" : "Delivery date"}</label>
                <select id="date" required className="field">
                  {days.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="slot" className="label">Time window</label>
                <select id="slot" required className="field">
                  {fulfilment.collectionSlots.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <p className="mt-3 text-xs text-amber-600">[Available days, windows and cut-off times to be confirmed by the shop.]</p>
          </Section>

          {containsLivestock && (
            <Section n={3} title="Livestock terms">
              <div className="rounded-xl border border-dashed border-amber-600/50 bg-amber-100/40 p-4 text-sm text-ink-600">{policies.livestockTerms}</div>
              <label className="mt-4 flex cursor-pointer items-start gap-3 text-[15px]">
                <input type="checkbox" required className="mt-0.5 size-[18px] accent-ocean-900" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                I have read and accept the livestock terms, and I am ready to receive live animals on the selected date.
              </label>
            </Section>
          )}
        </div>

        {/* Order summary */}
        <aside className="lg:col-span-5">
          <div className="rounded-2xl border border-pearl-300 bg-pearl-50 p-5 md:p-7 lg:sticky lg:top-24">
            <h2 className="t-h3 mb-5">Order summary</h2>
            <ul className="divide-y divide-pearl-300">
              {lines.map((l) => (
                <li key={l.key} className="flex gap-3 py-3">
                  <div className="w-14 shrink-0"><PhotoPlaceholder label={l.photoLabel} tone={l.line.kind === "specimen" ? "specimen" : "light"} compact /></div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{l.title}</p>
                    <p className={l.line.kind === "specimen" ? "t-id text-ink-600" : "text-xs text-ink-600"}>{l.subtitle} · qty {l.qty}</p>
                  </div>
                  <span className="tabular text-sm font-semibold">{formatPrice(l.unitCents * l.qty)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-2 border-t border-pearl-300 pt-4 text-[15px]">
              <div className="flex justify-between"><dt className="text-ink-600">Subtotal</dt><dd className="tabular">{formatPrice(subtotalCents)}</dd></div>
              <div className="flex justify-between">
                <dt className="text-ink-600">{method === "COLLECTION" ? "Collection" : "Delivery"}</dt>
                <dd className="tabular">{deliveryCents ? <>{formatPrice(deliveryCents)} <span className="text-xs text-amber-600">[TBC]</span></> : "Free"}</dd>
              </div>
              <div className="flex justify-between text-xs text-ink-600"><dt>{policies.gstNote}</dt></div>
              <div className="flex justify-between border-t border-pearl-300 pt-3 text-lg font-semibold"><dt>Total</dt><dd className="tabular">{formatPrice(total)}</dd></div>
            </dl>
            <button type="submit" className="btn btn-primary btn-lg mt-6 w-full" disabled={!canPay}>
              <Lock className="size-4" /> Pay {formatPrice(total)}
            </button>
            <p className="mt-3 text-center text-xs text-ink-600">You&rsquo;ll pay securely on HitPay with PayNow or card. We never see your card details.</p>
            {submitted && (
              <p role="status" className="mt-4 rounded-lg bg-amber-100 p-3 text-sm text-amber-600">
                Prototype: payment is not connected. In the real site this reserves your items for 15 minutes and redirects you to HitPay.
              </p>
            )}
          </div>
        </aside>
      </form>
    </div>
  );
}

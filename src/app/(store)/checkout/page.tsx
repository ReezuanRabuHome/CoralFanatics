"use client";

/**
 * Checkout UI (prototype). No order is created and no payment is taken.
 * Phase 5 implements: server re-validation, atomic reservation, HitPay payment
 * request and webhook confirmation (Deliverables 7–9).
 */
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock, Store, Truck } from "lucide-react";
import { useBag } from "@/components/store/bag";
import { Photo } from "@/components/Photo";
import { formatPrice } from "@/lib/money";
import { fulfilment, policies, store } from "@/config/placeholders";

type Method = "COLLECTION" | "DELIVERY";

function nextDays(n: number) {
  const out: { value: string; label: string }[] = [];
  const d = new Date();
  for (let i = 1; i <= n; i++) {
    const x = new Date(d.getFullYear(), d.getMonth(), d.getDate() + i);
    out.push({ value: x.toISOString().slice(0, 10), label: x.toLocaleDateString("en-SG", { weekday: "long", day: "numeric", month: "long" }) });
  }
  return out;
}

function Step({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-hairline py-10 first:border-t-0 first:pt-0">
      <h2 className="t-h3 mb-6 md:text-[28px] md:tracking-[-0.025em]">{title}</h2>
      {children}
    </section>
  );
}

export default function CheckoutPage() {
  const { lines, subtotalCents, containsLivestock } = useBag();
  const router = useRouter();
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [method, setMethod] = useState<Method>("COLLECTION");
  const [days, setDays] = useState<{ value: string; label: string }[]>([]);
  const [agreed, setAgreed] = useState(false);
  useEffect(() => setDays(nextDays(6)), []);

  const deliveryCents = method === "DELIVERY" ? fulfilment.deliveryFeeCents : 0;
  const total = subtotalCents + deliveryCents;

  if (lines.length === 0) {
    return (
      <div className="container-content flex min-h-[75vh] flex-col items-center justify-center pt-12 text-center">
        <h1 className="t-section">Your bag is empty.</h1>
        <p className="t-sub mt-4 text-ink-2">Add a coral or two, then come back to check out.</p>
        <Link href="/new-arrivals" className="btn btn-primary mt-8">See new arrivals</Link>
      </div>
    );
  }

  return (
    <div className="container-wide pt-24 pb-24 lg:pt-28">
      <h1 className="t-section">Checkout.</h1>
      <p className="t-sub mt-3 text-ink-2">No account needed.</p>

      <form
        className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-16"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.currentTarget;
          if (!form.checkValidity()) {
            // Take the shopper straight to the first missing detail.
            setError("Please complete the highlighted details.");
            const first = form.querySelector<HTMLElement>(":invalid");
            first?.scrollIntoView({ behavior: "smooth", block: "center" });
            first?.focus({ preventScroll: true });
            form.reportValidity();
            return;
          }
          setError(null);
          setPaying(true);
          const data = new FormData(form);
          const dateLabel = days.find((d) => d.value === data.get("date"))?.label ?? "";
          const order = {
            number: `CF-${10043 + Math.floor(Math.random() * 900)}`,
            email: String(data.get("email") ?? ""),
            name: String(data.get("name") ?? ""),
            method,
            when: `${dateLabel}, ${String(data.get("slot") ?? "")}`,
            items: lines.map((l) => ({ title: l.title, subtitle: l.subtitle, qty: l.qty, unitCents: l.unitCents, photo: l.photo, specimen: l.line.kind === "specimen" })),
            subtotalCents,
            deliveryCents,
            totalCents: total,
          };
          // Prototype stand-in for the HitPay redirect and webhook confirmation.
          setTimeout(() => {
            try {
              sessionStorage.setItem("cf-last-order", JSON.stringify(order));
            } catch {
              /* storage unavailable: confirmation page shows a generic message */
            }
            router.push("/checkout/confirmation"); // the confirmation page empties the bag
          }, 1400);
        }}
      >
        <div className="lg:col-span-7">
          <Step title="How would you like to get your order?">
            <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Collection or delivery">
              {([
                { id: "COLLECTION", icon: Store, title: "Collect in store", desc: store.address, price: "Free" },
                { id: "DELIVERY", icon: Truck, title: "Deliver to me", desc: "Singapore addresses only", price: `${formatPrice(fulfilment.deliveryFeeCents)} (to be confirmed)` },
              ] as const).map((o) => {
                const on = method === o.id;
                return (
                  <label key={o.id} className={`flex cursor-pointer flex-col rounded-2xl border p-5 transition-colors ${on ? "border-reef ring-1 ring-reef" : "border-hairline hover:border-ink-3"}`}>
                    <input type="radio" name="method" className="sr-only" checked={on} onChange={() => setMethod(o.id)} />
                    <o.icon className="size-6" strokeWidth={1.4} aria-hidden />
                    <span className="mt-4 text-[17px] font-semibold">{o.title}</span>
                    <span className="t-small mt-1 text-ink-2">{o.desc}</span>
                    <span className="t-small mt-3">{o.price}</span>
                  </label>
                );
              })}
            </div>
          </Step>

          <Step title={method === "COLLECTION" ? "When would you like to collect?" : "Where should we deliver?"}>
            {method === "DELIVERY" && (
              <div className="mb-5 grid gap-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="postal" className="label">Postal code</label>
                  <input id="postal" name="postal" required inputMode="numeric" pattern="[0-9]{6}" maxLength={6} title="A 6-digit Singapore postal code" className="field tabular" />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="street" className="label">Block and street</label>
                  <input id="street" name="street" required autoComplete="address-line1" className="field" placeholder="Filled in from your postal code" />
                </div>
                <div>
                  <label htmlFor="unit" className="label">Unit</label>
                  <input id="unit" name="unit" autoComplete="address-line2" className="field" placeholder="#12-345" />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="building" className="label">Building name (optional)</label>
                  <input id="building" name="building" className="field" />
                </div>
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="date" className="label">Date</label>
                <select id="date" name="date" required className="field">
                  {days.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="slot" className="label">Time</label>
                <select id="slot" name="slot" required className="field">
                  {fulfilment.collectionSlots.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <p className="t-small mt-3 text-ink-2">Available days and times are still to be confirmed by the shop.</p>
          </Step>

          <Step title="How can we reach you?">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="email" className="label">Email</label>
                <input id="email" name="email" type="email" required autoComplete="email" className="field" />
                <p className="t-small mt-2 text-ink-2">We&rsquo;ll send your confirmation and updates here.</p>
              </div>
              <div>
                <label htmlFor="name" className="label">Full name</label>
                <input id="name" name="name" required autoComplete="name" className="field" />
              </div>
              <div>
                <label htmlFor="phone" className="label">Mobile number</label>
                <div className="relative">
                  <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[17px] text-ink-2">+65</span>
                  <input id="phone" name="phone" required inputMode="tel" autoComplete="tel-national" pattern="[689][0-9]{3}\s?[0-9]{4}" title="An 8-digit Singapore mobile or phone number, e.g. 8123 4567" placeholder="8123 4567" className="field pl-14" />
                </div>
              </div>
            </div>
          </Step>

          {containsLivestock && (
            <Step title="Livestock terms.">
              <p className="text-[17px] text-ink-2">{policies.livestockTerms}</p>
              <label className="mt-6 flex cursor-pointer items-start gap-3 text-[17px]">
                <input type="checkbox" required className="mt-1 size-5 shrink-0 accent-[var(--color-reef)]" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                I accept the livestock terms and will be ready to receive live animals on the date I chose.
              </label>
            </Step>
          )}
        </div>

        <aside className="lg:col-span-5">
          <div className="rounded-[28px] bg-mist p-6 md:p-8 lg:sticky lg:top-20">
            <h2 className="t-h3">Your bag</h2>
            <ul className="mt-4">
              {lines.map((l) => (
                <li key={l.key} className="flex items-center gap-4 border-b border-hairline py-4">
                  <div className="w-16 shrink-0 overflow-hidden rounded-xl"><Photo src={l.photo} alt={l.photoLabel} tone={l.line.kind === "specimen" ? "specimen" : "white"} compact sizes="64px" /></div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-semibold">{l.title}</p>
                    <p className="t-small text-ink-2">{l.subtitle}{l.qty > 1 ? ` × ${l.qty}` : ""}</p>
                  </div>
                  <span className="tabular text-[15px]">{formatPrice(l.unitCents * l.qty)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-2 text-[15px]">
              <div className="flex justify-between"><dt className="text-ink-2">Subtotal</dt><dd className="tabular">{formatPrice(subtotalCents)}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-2">{method === "COLLECTION" ? "Collection" : "Delivery"}</dt><dd className="tabular">{deliveryCents ? formatPrice(deliveryCents) : "Free"}</dd></div>
              <div className="flex justify-between text-[13px] text-ink-2"><dt>GST</dt><dd>{policies.gstNote}</dd></div>
              <div className="flex justify-between border-t border-hairline pt-4 text-[21px] font-semibold tracking-[-0.02em]"><dt>Total</dt><dd className="tabular">{formatPrice(total)}</dd></div>
            </dl>
            <button type="submit" className="btn btn-primary btn-lg mt-8 w-full" disabled={paying} aria-live="polite">
              {paying ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Securing your order…
                </>
              ) : (
                <>Pay {formatPrice(total)}</>
              )}
            </button>
            {error && <p role="alert" className="t-small mt-3 text-center text-red-600">{error}</p>}
            <p className="t-small mt-4 flex items-start justify-center gap-1.5 text-center text-ink-2">
              <Lock className="mt-0.5 size-3.5 shrink-0" /> Pay securely with PayNow or card on HitPay. We never see your card details.
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}

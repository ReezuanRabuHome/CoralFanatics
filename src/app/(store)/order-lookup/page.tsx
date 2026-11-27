"use client";

/**
 * Order status lookup for guest customers (prototype: checks the order placed
 * in this browser session). Production verifies order number + email on the
 * server, rate-limited, and also offers the tokenised link from the email.
 */
import Link from "next/link";
import { useState } from "react";
import { Check } from "lucide-react";
import { readLastOrder, type SavedOrder } from "@/lib/order";

export default function OrderLookupPage() {
  const [found, setFound] = useState<SavedOrder | null>(null);
  const [miss, setMiss] = useState(false);

  return (
    <div className="container-content flex min-h-[80vh] flex-col items-center pt-28 pb-24 lg:pt-36">
      <h1 className="t-section text-center">Check your order.</h1>
      <p className="t-sub mt-4 max-w-[34ch] text-center text-ink-2">Enter your order number and the email you used at checkout.</p>

      {!found ? (
        <form
          className="mt-12 w-full max-w-[420px] space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget);
            const order = readLastOrder();
            const ok =
              order &&
              order.number.toLowerCase() === String(data.get("number")).trim().toLowerCase() &&
              order.email.toLowerCase() === String(data.get("email")).trim().toLowerCase();
            setFound(ok ? order : null);
            setMiss(!ok);
          }}
        >
          <div>
            <label htmlFor="number" className="label">Order number</label>
            <input id="number" name="number" required placeholder="CF-10042" className="field tabular" />
          </div>
          <div>
            <label htmlFor="email" className="label">Email</label>
            <input id="email" name="email" type="email" required autoComplete="email" className="field" />
          </div>
          {miss && <p role="alert" className="t-small text-red-600">We couldn&rsquo;t find an order with those details. Check the number in your confirmation email.</p>}
          <button className="btn btn-primary btn-lg w-full">Check order</button>
          <p className="t-small text-center text-ink-2">Prototype: only orders placed in this browser can be found.</p>
        </form>
      ) : (
        <div className="mt-12 w-full max-w-[520px] rounded-[28px] bg-mist p-6 md:p-8">
          <p className="tabular text-[13px] text-ink-2">Order {found.number}</p>
          <ol className="mt-6 space-y-5">
            {[
              ["Order placed", true],
              ["Payment confirmed", true],
              [found.method === "COLLECTION" ? "Ready to collect" : "Out for delivery", false],
              [found.method === "COLLECTION" ? "Collected" : "Delivered", false],
            ].map(([label, done], i) => (
              <li key={String(label)} className="flex items-center gap-4">
                <span className={`grid size-8 shrink-0 place-items-center rounded-full text-[13px] font-semibold ${done ? "bg-green-600 text-white" : "bg-white text-ink-3 ring-1 ring-hairline"}`}>
                  {done ? <Check className="size-4" strokeWidth={2.5} /> : i + 1}
                </span>
                <span className={done ? "font-medium" : "text-ink-2"}>{label}</span>
              </li>
            ))}
          </ol>
          <p className="t-small mt-6 text-ink-2">{found.method === "COLLECTION" ? "Collection" : "Delivery"}: {found.when}</p>
          <div className="mt-6 flex gap-4">
            <button className="link" onClick={() => setFound(null)}>Check another order</button>
            <Link href="/new-arrivals" className="link">Continue shopping</Link>
          </div>
        </div>
      )}
    </div>
  );
}

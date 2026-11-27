"use client";

/**
 * Order confirmation (prototype). In production this page reads the order from
 * the server and only shows "confirmed" once the HitPay webhook has verified
 * payment (Deliverable 9 §5); here it shows the order saved by checkout.
 */
import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, ChevronRight } from "lucide-react";
import { useBag } from "@/components/store/bag";
import { Photo } from "@/components/Photo";
import { formatPrice } from "@/lib/money";
import { store } from "@/config/placeholders";
import { readLastOrder, type SavedOrder } from "@/lib/order";

export default function ConfirmationPage() {
  const { clear } = useBag();
  const [order, setOrder] = useState<SavedOrder | null | undefined>(undefined);

  useEffect(() => {
    setOrder(readLastOrder());
    clear();
  }, [clear]);

  if (order === undefined) return <div className="min-h-[70vh]" />;

  if (!order) {
    return (
      <div className="container-content flex min-h-[75vh] flex-col items-center justify-center pt-12 text-center">
        <h1 className="t-section">No recent order.</h1>
        <p className="t-sub mt-4 text-ink-2">If you&rsquo;ve just paid, check your email for your confirmation.</p>
        <Link href="/order-lookup" className="btn btn-primary mt-8">Look up an order</Link>
      </div>
    );
  }

  return (
    <div className="container-content pt-28 pb-24 lg:pt-36">
      <div className="flex flex-col items-center text-center">
        <span className="grid size-14 place-items-center rounded-full bg-green-100 text-green-600">
          <Check className="size-7" strokeWidth={2.25} />
        </span>
        <h1 className="t-section mt-6">Thank you{order.name ? `, ${order.name.split(" ")[0]}` : ""}.</h1>
        <p className="t-sub mt-4 max-w-[36ch] text-ink-2">
          Your order <span data-order-number className="font-semibold whitespace-nowrap text-ink">{order.number}</span> is confirmed. We&rsquo;ve sent the details to {order.email}.
        </p>
        <p className="mt-4 rounded-full bg-mist px-4 py-1.5 text-[13px] text-ink-2">Prototype: no payment was taken and no email was sent.</p>
      </div>

      <div className="mx-auto mt-14 max-w-[640px] rounded-[28px] bg-mist p-6 md:p-8">
        <div className="grid gap-6 border-b border-hairline pb-6 sm:grid-cols-2">
          <div>
            <p className="text-[13px] text-ink-2">{order.method === "COLLECTION" ? "Collection" : "Delivery"}</p>
            <p className="mt-1 font-semibold">{order.when}</p>
            {order.method === "COLLECTION" && <p className="t-small mt-1 text-ink-2">{store.address}</p>}
          </div>
          <div>
            <p className="text-[13px] text-ink-2">What happens next</p>
            <p className="t-small mt-1">
              {order.method === "COLLECTION"
                ? "We'll email you when your order is ready to collect."
                : "We'll email you when your order is out for delivery."}
            </p>
          </div>
        </div>
        <ul className="mt-2">
          {order.items.map((it) => (
            <li key={it.title + it.subtitle} className="flex items-center gap-4 border-b border-hairline py-4 last:border-0">
              <div className="w-14 shrink-0 overflow-hidden rounded-xl">
                <Photo src={it.photo} alt={it.title} tone={it.specimen ? "specimen" : "white"} compact sizes="56px" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-semibold">{it.title}</p>
                <p className="t-small text-ink-2">{it.subtitle}{it.qty > 1 ? ` × ${it.qty}` : ""}</p>
              </div>
              <span className="tabular text-[15px]">{formatPrice(it.unitCents * it.qty)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-2 space-y-2 border-t border-hairline pt-4 text-[15px]">
          <div className="flex justify-between"><dt className="text-ink-2">Subtotal</dt><dd className="tabular">{formatPrice(order.subtotalCents)}</dd></div>
          <div className="flex justify-between"><dt className="text-ink-2">{order.method === "COLLECTION" ? "Collection" : "Delivery"}</dt><dd className="tabular">{order.deliveryCents ? formatPrice(order.deliveryCents) : "Free"}</dd></div>
          <div className="flex justify-between pt-2 text-[19px] font-semibold"><dt>Total paid</dt><dd className="tabular">{formatPrice(order.totalCents)}</dd></div>
        </dl>
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
        <Link href="/new-arrivals" className="btn btn-primary">Continue shopping</Link>
        <Link href="/order-lookup" className="link text-[17px]">Track this order <ChevronRight className="size-4" strokeWidth={2} /></Link>
      </div>
    </div>
  );
}

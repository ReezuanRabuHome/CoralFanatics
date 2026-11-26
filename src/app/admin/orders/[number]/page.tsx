import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, MessageCircle, Printer } from "lucide-react";
import { getProduct, getSpecimen, sampleOrders } from "@/data/sample";
import { formatPrice } from "@/lib/money";
import { PhotoPlaceholder } from "@/components/PhotoPlaceholder";
import { FulfilmentPill, PaymentPill } from "../../pills";
import { fulfilment } from "@/config/placeholders";

export function generateStaticParams() {
  return sampleOrders.map((o) => ({ number: o.number }));
}

export default async function OrderDetail({ params }: { params: Promise<{ number: string }> }) {
  const { number } = await params;
  const order = sampleOrders.find((o) => o.number === number);
  if (!order) notFound();

  // Sample line items for the detail layout
  const coral = getSpecimen("CF-SPS-0142")!;
  const salt = getProduct("reef-salt-mix")!;
  const lines = [
    { title: coral.species, sub: coral.code, unit: coral.priceCents, qty: 1, livestock: true },
    { title: salt.name, sub: salt.variants[0]!.name, unit: salt.variants[0]!.priceCents, qty: 1, livestock: false },
  ];
  const subtotal = lines.reduce((n, l) => n + l.unit * l.qty, 0);
  const delivery = fulfilment.deliveryFeeCents;

  const timeline: [string, string, string][] = [
    ["14:22", "Checkout created · 1 specimen + 1 item reserved", "System"],
    ["14:24", "Payment confirmed via HitPay webhook (PayNow)", "Webhook"],
    ["14:24", "Stock committed · CF-SPS-0142 marked sold", "System"],
    ["14:24", "Confirmation email sent to customer", "System"],
    ["15:10", "Fulfilment → Preparing", "Staff (sample)"],
  ];

  return (
    <div className="mx-auto max-w-[1200px]">
      <Link href="/admin" className="inline-flex items-center gap-1 text-ink-600 hover:text-ink-900"><ChevronLeft className="size-4" />Orders</Link>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="tabular font-display text-2xl font-semibold">#{order.number}</h1>
          <p className="mt-1 text-ink-600">{order.date} · {order.method}</p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex h-9 items-center gap-2 rounded-md border border-pearl-300 bg-pearl-50 px-3 font-semibold hover:bg-pearl-100"><Printer className="size-4" />Packing slip</button>
          <button className="inline-flex h-9 items-center rounded-md bg-ocean-900 px-3 font-semibold text-pearl-50 hover:bg-ocean-700">Mark out for delivery</button>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3 rounded-lg border border-pearl-300 bg-pearl-50 px-5 py-4">
        <div><p className="text-xs text-ink-600">Payment</p><div className="mt-1 flex items-center gap-2"><PaymentPill v={order.payment} /><span className="text-xs text-ink-600">Set by HitPay only</span></div></div>
        <div><p className="text-xs text-ink-600">Fulfilment</p><div className="mt-1"><FulfilmentPill v={order.fulfilment} /></div></div>
        <div><p className="text-xs text-ink-600">Scheduled</p><p className="mt-1 font-semibold">{order.scheduled} · PM [window TBC]</p></div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-lg border border-pearl-300 bg-pearl-50">
            <h2 className="border-b border-pearl-300 px-5 py-3 font-semibold">Items</h2>
            <ul className="divide-y divide-pearl-300">
              {lines.map((l) => (
                <li key={l.sub} className="flex items-center gap-4 px-5 py-3">
                  <div className="w-12 shrink-0"><PhotoPlaceholder label={l.title} tone={l.livestock ? "specimen" : "light"} compact rounded={false} /></div>
                  <div className="flex-1">
                    <p className="font-semibold">{l.livestock && <span className="mr-1 text-gold-700" title="Livestock">◆</span>}{l.title}</p>
                    <p className={l.livestock ? "t-id text-ink-600" : "text-[13px] text-ink-600"}>{l.sub}</p>
                  </div>
                  <span className="tabular text-ink-600">{formatPrice(l.unit)} × {l.qty}</span>
                  <span className="tabular w-24 text-right font-semibold">{formatPrice(l.unit * l.qty)}</span>
                </li>
              ))}
            </ul>
            <dl className="space-y-1.5 border-t border-pearl-300 px-5 py-4">
              <div className="flex justify-between"><dt className="text-ink-600">Subtotal</dt><dd className="tabular">{formatPrice(subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-600">Delivery</dt><dd className="tabular">{formatPrice(delivery)}</dd></div>
              <div className="flex justify-between pt-1 text-base font-semibold"><dt>Total</dt><dd className="tabular">{formatPrice(subtotal + delivery)}</dd></div>
            </dl>
          </section>

          <section className="rounded-lg border border-pearl-300 bg-pearl-50">
            <h2 className="border-b border-pearl-300 px-5 py-3 font-semibold">Timeline</h2>
            <ol className="space-y-3 px-5 py-4">
              {timeline.map(([t, e, who]) => (
                <li key={t + e} className="flex gap-4">
                  <span className="tabular w-12 shrink-0 text-ink-600">{t}</span>
                  <span className="flex-1">{e}</span>
                  <span className="text-xs text-ink-600">{who}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-lg border border-pearl-300 bg-pearl-50 p-5">
            <h2 className="font-semibold">Customer</h2>
            <p className="mt-3">{order.customer}</p>
            <p className="text-ink-600">customer@example.com</p>
            <p className="text-ink-600">+65 8XXX XXXX</p>
            <button className="mt-3 inline-flex items-center gap-1.5 font-semibold hover:underline"><MessageCircle className="size-4" />WhatsApp customer</button>
          </section>
          <section className="rounded-lg border border-pearl-300 bg-pearl-50 p-5">
            <h2 className="font-semibold">{order.method}</h2>
            <p className="mt-3 text-ink-600">[Sample address] Blk 123 Sample Street 45, #12-345, Singapore 123456</p>
            <p className="mt-2">{order.scheduled}, [window TBC]</p>
          </section>
          <section className="rounded-lg border border-pearl-300 bg-pearl-50 p-5">
            <h2 className="font-semibold">Internal notes</h2>
            <p className="mt-3 rounded-md bg-pearl-100 p-3 text-[13px]">Customer prefers WhatsApp updates. (sample)</p>
            <textarea className="mt-3 w-full rounded-md border border-pearl-300 p-2.5 text-[13px]" rows={2} placeholder="Add a note (staff only)" />
          </section>
        </div>
      </div>
    </div>
  );
}

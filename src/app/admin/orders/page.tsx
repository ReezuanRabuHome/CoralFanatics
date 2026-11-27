import Link from "next/link";
import { sampleOrders } from "@/data/sample";
import { formatPrice } from "@/lib/money";
import { FulfilmentPill, PaymentPill } from "../pills";

export default function OrdersList() {
  return (
    <div className="mx-auto max-w-[1280px]">
      <h1 className="font-display text-2xl font-semibold">Orders</h1>
      <p className="mt-1 text-ink-600">Sample orders. Payment status is set only by HitPay; fulfilment is advanced by staff.</p>
      <div className="mt-6 overflow-x-auto rounded-lg border border-pearl-300 bg-pearl-50">
        <table className="w-full min-w-[820px] text-left">
          <thead className="text-xs text-ink-600">
            <tr className="border-b border-pearl-300">
              {["Order", "Date", "Customer", "Items", "Total", "Payment", "Fulfilment", "Method", "Scheduled"].map((h) => (
                <th key={h} className={`px-4 py-2.5 font-medium ${h === "Total" ? "text-right" : ""}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-pearl-300">
            {sampleOrders.map((o) => (
              <tr key={o.number} className="h-12 hover:bg-pearl-100">
                <td className="px-4"><Link href={`/admin/orders/${o.number}`} className="tabular font-semibold hover:underline">{o.number}</Link></td>
                <td className="px-4 text-ink-600">{o.date}</td>
                <td className="px-4">{o.customer}</td>
                <td className="tabular px-4">{o.items}</td>
                <td className="tabular px-4 text-right">{formatPrice(o.totalCents)}</td>
                <td className="px-4"><PaymentPill v={o.payment} /></td>
                <td className="px-4"><FulfilmentPill v={o.fulfilment} /></td>
                <td className="px-4">{o.method}</td>
                <td className="px-4 text-ink-600">{o.scheduled}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

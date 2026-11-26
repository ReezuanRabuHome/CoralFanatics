import { Store, Truck } from "lucide-react";
import { fulfilment } from "@/config/placeholders";

/** Key facts as simple rows: label left, value right. */
export function FactsGrid({ facts }: { facts: [string, string][] }) {
  return (
    <dl className="border-t border-hairline">
      {facts.map(([k, v]) => (
        <div key={k} className="flex justify-between gap-4 border-b border-hairline py-3 text-[15px]">
          <dt className="text-ink-2">{k}</dt>
          <dd className="text-right font-medium">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function FulfilmentSummary({ livestock }: { livestock: boolean; lines?: string[] }) {
  const rows = [
    { icon: Store, ...fulfilment.collection },
    { icon: Truck, ...(livestock ? fulfilment.delivery : fulfilment.deliveryDryGoods) },
  ];
  return (
    <ul className="space-y-4">
      {rows.map((r) => (
        <li key={r.title} className="flex gap-3.5">
          <r.icon className="mt-0.5 size-5 shrink-0" strokeWidth={1.5} aria-hidden />
          <div>
            <p className="text-[15px] font-semibold">{r.title}</p>
            <p className="t-small text-ink-2">{r.detail}</p>
          </div>
        </li>
      ))}
      {livestock && (
        <li className="t-small pl-[34px]">
          <a href="/policies/livestock" className="link">Livestock policy</a>
        </li>
      )}
    </ul>
  );
}

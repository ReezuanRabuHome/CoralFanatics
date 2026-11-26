import Link from "next/link";
import { store } from "@/config/placeholders";

const cols = [
  {
    title: "Shop",
    links: [
      ["New Arrivals", "/new-arrivals"],
      ["SPS Corals", "/corals/sps"],
      ["LPS Corals", "/corals/lps"],
      ["Mushrooms", "/corals/mushrooms"],
    ],
  },
  {
    title: "Marine Life",
    links: [
      ["Marine Fish", "/marine-life/fish"],
      ["Invertebrates", "/marine-life/invertebrates"],
    ],
  },
  {
    title: "Equipment",
    links: [
      ["Equipment", "/equipment"],
      ["Additives", "/additives"],
    ],
  },
  {
    title: "Help",
    links: [
      ["Collection & Delivery", "/policies/delivery"],
      ["Livestock Policy", "/policies/livestock"],
      ["Order Status", "/order-lookup"],
      ["Contact Us", "/#visit"],
    ],
  },
] as const;

/** Light, compact footer: small type, hairline dividers. */
export function Footer() {
  return (
    <footer className="bg-mist text-[12px] leading-[1.35] text-ink-2">
      <div className="container-wide py-10">
        <p className="border-b border-hairline pb-4">
          Livestock photographs show the actual specimen unless marked as representative. Colours vary with lighting.
        </p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 py-8 md:grid-cols-5">
          {cols.map((c) => (
            <div key={c.title}>
              <h2 className="mb-3 font-semibold text-ink">{c.title}</h2>
              <ul className="space-y-2.5">
                {c.links.map(([label, href]) => (
                  <li key={href}><Link href={href} className="hover:text-ink hover:underline">{label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
          <div className="col-span-2 md:col-span-1">
            <h2 className="mb-3 font-semibold text-ink">Visit</h2>
            <address className="space-y-2.5 not-italic">
              <p>{store.address}</p>
              <p>{store.hours}</p>
              <p>{store.phone}</p>
            </address>
          </div>
        </div>
        <div className="flex flex-col gap-3 border-t border-hairline pt-4 md:flex-row md:items-center md:justify-between">
          <p>Copyright © {new Date().getFullYear()} Coral Fanatics. All rights reserved.</p>
          <ul className="flex flex-wrap divide-x divide-hairline">
            {[["Terms of Sale", "/policies/terms"], ["Privacy Policy", "/policies/privacy"], ["Livestock Terms", "/policies/livestock"], ["Returns", "/policies/returns"]].map(([l, h]) => (
              <li key={h} className="px-2.5 first:pl-0"><Link href={h!} className="hover:text-ink hover:underline">{l}</Link></li>
            ))}
          </ul>
          <p>Singapore</p>
        </div>
      </div>
    </footer>
  );
}

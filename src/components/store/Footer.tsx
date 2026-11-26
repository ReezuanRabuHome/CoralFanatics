import Link from "next/link";
import { Badge } from "@/components/brand/Badge";
import { store } from "@/config/placeholders";

const cols = [
  {
    title: "Shop",
    links: [
      ["New arrivals", "/new-arrivals"],
      ["SPS corals", "/corals/sps"],
      ["LPS corals", "/corals/lps"],
      ["Mushrooms", "/corals/mushrooms"],
      ["Marine fish", "/marine-life/fish"],
      ["Invertebrates", "/marine-life/invertebrates"],
      ["Equipment", "/equipment"],
      ["Additives", "/additives"],
    ],
  },
  {
    title: "Help",
    links: [
      ["Collection & delivery", "/policies/delivery"],
      ["Livestock policy", "/policies/livestock"],
      ["Order lookup", "/order-lookup"],
      ["Contact", "/#visit"],
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="mode-ocean bg-ocean-950 text-pearl-100">
      <div className="container-wide grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1.2fr] lg:py-24">
        <div className="flex flex-col items-start gap-5">
          <Badge size={132} />
          <p className="max-w-xs text-sm text-ocean-300">Exceptional corals, marine life and reef essentials, in Singapore.</p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h2 className="t-eyebrow mb-5 text-gold-500">{c.title}</h2>
            <ul className="space-y-3 text-[15px]">
              {c.links.map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-pearl-100/85 hover:text-pearl-50 hover:underline">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <h2 className="t-eyebrow mb-5 text-gold-500">Visit</h2>
          <address className="space-y-3 text-[15px] not-italic text-pearl-100/85">
            <p>{store.address}</p>
            <p>{store.hours}</p>
            <p>{store.phone}</p>
            <p>{store.email}</p>
          </address>
          {store.social.length > 0 && (
            <ul className="mt-6 flex gap-4">
              {store.social.map((s) => (
                <li key={s.href}><a href={s.href} className="hover:underline">{s.label}</a></li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="border-t border-ocean-700">
        <div className="container-wide flex flex-col gap-3 py-6 text-xs text-ocean-300 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Coral Fanatics · {store.legalName}</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            <li><Link href="/policies/terms" className="hover:underline">Terms</Link></li>
            <li><Link href="/policies/privacy" className="hover:underline">Privacy (PDPA)</Link></li>
            <li><Link href="/policies/livestock" className="hover:underline">Livestock terms</Link></li>
            <li><Link href="/policies/returns" className="hover:underline">Returns</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

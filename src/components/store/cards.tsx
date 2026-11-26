import Link from "next/link";
import { PhotoPlaceholder } from "@/components/PhotoPlaceholder";
import { OneOfAKind, Pill, SpecimenStatusPill } from "@/components/StatusBadge";
import { fromPrice, productHref, specimenHref, totalStock, type Product, type Specimen } from "@/data/sample";
import { formatPriceShort } from "@/lib/money";

/** Unique livestock card: one physical specimen (Design System §7.1). */
export function SpecimenCard({ s, tone = "light" }: { s: Specimen; tone?: "light" | "dark" }) {
  const sold = s.status === "SOLD";
  return (
    <Link href={specimenHref(s)} className="group block focus-visible:outline-offset-4">
      <div className={`relative overflow-hidden rounded-xl ${sold ? "opacity-60 grayscale-[40%]" : ""}`}>
        <PhotoPlaceholder label={`${s.species}, specimen ${s.code}, top view`} tone="specimen" />
        <span className="absolute top-3 left-3 rounded-full bg-pearl-50/95 px-2.5 py-1">
          <OneOfAKind />
        </span>
        {s.listedDaysAgo <= 1 && !sold && (
          <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-pearl-50/95 px-2.5 py-1 text-xs font-semibold text-ink-900">
            <span className="size-1.5 rounded-full bg-orange-500" aria-hidden />New
          </span>
        )}
      </div>
      <div className="mt-3 space-y-1">
        <h3 className={`text-base leading-snug font-semibold group-hover:underline ${tone === "dark" ? "text-pearl-50" : ""}`}>{s.species}</h3>
        <p className={`t-id ${tone === "dark" ? "text-ocean-300" : "text-ink-600"}`}>{s.code}</p>
        <div className="flex items-center justify-between gap-2 pt-1">
          <span className={`tabular text-lg font-semibold ${tone === "dark" ? "text-pearl-50" : ""}`}>{formatPriceShort(s.priceCents)}</span>
          <SpecimenStatusPill status={s.status} />
        </div>
      </div>
    </Link>
  );
}

/** Quantity product card: fish, inverts and dry goods (Design System §7.2). */
export function ProductCard({ p, tone = "light" }: { p: Product; tone?: "light" | "dark" }) {
  const stock = totalStock(p);
  const multi = p.variants.length > 1;
  return (
    <Link href={productHref(p)} className="group block">
      <div className="relative">
        <PhotoPlaceholder label={p.isLivestock ? `${p.name} (representative photo)` : `${p.name} on white seamless`} tone={p.isLivestock ? "dark" : "light"} className={p.isLivestock ? "" : "bg-pearl-50"} />
        {p.representativePhoto && (
          <span className="absolute bottom-3 left-3 rounded-full bg-pearl-50/95 px-2.5 py-1 text-[11px] font-medium text-ink-600">Representative photo</span>
        )}
      </div>
      <div className="mt-3 space-y-1">
        {p.brand && <p className={`t-eyebrow ${tone === "dark" ? "text-ocean-300" : "text-ink-600"}`}>{p.brand}</p>}
        <h3 className={`text-base leading-snug font-semibold group-hover:underline ${tone === "dark" ? "text-pearl-50" : ""}`}>{p.name}</h3>
        {p.scientificName && <p className={`text-sm italic ${tone === "dark" ? "text-ocean-300" : "text-ink-600"}`}>{p.scientificName}</p>}
        <div className="flex items-center justify-between gap-2 pt-1">
          <span className={`tabular text-lg font-semibold ${tone === "dark" ? "text-pearl-50" : ""}`}>
            {multi ? "From " : ""}
            {formatPriceShort(fromPrice(p))}
          </span>
          {stock <= 0 ? <Pill tone="danger">Sold out</Pill> : stock <= p.lowStockThreshold ? <Pill tone="warning">Only {stock} left</Pill> : null}
        </div>
      </div>
    </Link>
  );
}

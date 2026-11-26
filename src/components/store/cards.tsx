import Link from "next/link";
import { PhotoPlaceholder } from "@/components/PhotoPlaceholder";
import { Photo } from "@/components/Photo";
import { fromPrice, productHref, specimenHref, totalStock, type Product, type Specimen } from "@/data/sample";
import { formatPriceShort } from "@/lib/money";

/**
 * Store cards: photo first, three lines of text, nothing else.
 * Availability is only mentioned when it changes what the customer can do.
 */

function Availability({ text }: { text: string | null }) {
  return text ? <p className="t-small mt-1 text-ink-2">{text}</p> : null;
}

export function SpecimenCard({ s, className = "" }: { s: Specimen; className?: string }) {
  const sold = s.status === "SOLD";
  const note = s.status === "RESERVED" ? "Reserved in checkout" : sold ? "Sold" : null;
  return (
    <Link href={specimenHref(s)} className={`card group block overflow-hidden ${className}`}>
      <div className={`overflow-hidden ${sold ? "opacity-50" : ""}`}>
        <Photo
          src={s.photo}
          alt={`${s.species}, specimen ${s.code}`}
          sizes="(min-width: 1024px) 24vw, (min-width: 640px) 40vw, 72vw"
          imgClassName="transition-transform duration-700 ease-[var(--ease-reef-slow)] group-hover:scale-[1.03]"
        />
      </div>
      <div className="px-5 pt-4 pb-5">
        {s.listedDaysAgo <= 1 && !sold && <p className="mb-1 text-[12px] font-medium text-coral-ink">New</p>}
        <h3 className="text-[17px] leading-snug font-semibold tracking-[-0.02em]">{s.species}</h3>
        <p className="t-id mt-0.5 text-ink-2">{s.code}</p>
        <p className="tabular mt-3 text-[17px]">{formatPriceShort(s.priceCents)}</p>
        <Availability text={note} />
      </div>
    </Link>
  );
}

export function ProductCard({ p, className = "" }: { p: Product; className?: string }) {
  const stock = totalStock(p);
  const multi = p.variants.length > 1;
  const note = stock <= 0 ? "Sold out" : stock <= p.lowStockThreshold ? `Only ${stock} left` : null;
  return (
    <Link href={productHref(p)} className={`card group block overflow-hidden ${className}`}>
      <PhotoPlaceholder
        label={p.isLivestock ? `${p.name}, representative photo` : `${p.name} on white seamless`}
        tone={p.isLivestock ? "specimen" : "white"}
      />
      <div className="px-5 pt-4 pb-5">
        {p.brand && <p className="mb-1 text-[12px] text-ink-2">{p.brand}</p>}
        <h3 className="text-[17px] leading-snug font-semibold tracking-[-0.02em]">{p.name}</h3>
        {p.scientificName && <p className="t-small mt-0.5 text-ink-2 italic">{p.scientificName}</p>}
        <p className="tabular mt-3 text-[17px]">{multi ? "From " : ""}{formatPriceShort(fromPrice(p))}</p>
        <Availability text={note} />
      </div>
    </Link>
  );
}

/** Horizontal scrolling shelf with a two-tone heading. */
export function Shelf({ title, tagline, children, action }: { title: string; tagline?: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section className="py-14 lg:py-20">
      <div className="container-wide mb-6 flex items-end justify-between gap-6">
        <h2 className="t-title max-w-3xl">
          {title}
          {tagline && <span className="text-ink-2"> {tagline}</span>}
        </h2>
        {action && <div className="hidden shrink-0 pb-1 md:block">{action}</div>}
      </div>
      <div className="no-scrollbar overflow-x-auto scroll-smooth">
        <ul className="container-wide flex snap-x snap-mandatory gap-5 pb-10 [&>li]:w-[72%] [&>li]:shrink-0 [&>li]:snap-start [&>li>a]:h-full sm:[&>li]:w-[40%] lg:[&>li]:w-[23.5%]">
          {children}
        </ul>
      </div>
      {action && <div className="container-wide -mt-4 md:hidden">{action}</div>}
    </section>
  );
}

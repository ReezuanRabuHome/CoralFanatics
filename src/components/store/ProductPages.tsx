import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getProduct, products, sectionHref, type Product } from "@/data/sample";
import { ProductCard, Shelf } from "@/components/store/cards";
import { BuyBox } from "@/components/store/BuyBox";
import { DetailTabs, Gallery } from "@/components/store/pdp";
import { FactsGrid, FulfilmentSummary } from "@/components/store/FactsGrid";
import { SubNav } from "@/components/store/SubNav";
import { fulfilment, policies } from "@/config/placeholders";

export const sectionMeta: Record<Product["section"], { title: string; blurb: string; crumb: string }> = {
  fish: { title: "Marine fish.", blurb: "Reef fish from beginner-friendly gobies to tangs.", crumb: "Marine Fish" },
  invertebrates: { title: "Invertebrates.", blurb: "Hermit crabs, shrimp, snails and urchins for your clean-up crew.", crumb: "Invertebrates" },
  equipment: { title: "Equipment.", blurb: "Skimmers, lighting, pumps, salt and testing.", crumb: "Equipment" },
  additives: { title: "Additives.", blurb: "Supplements and care products for stable parameters.", crumb: "Additives" },
};

const siblings: Record<Product["section"], Product["section"][]> = {
  fish: ["fish", "invertebrates"],
  invertebrates: ["fish", "invertebrates"],
  equipment: ["equipment", "additives"],
  additives: ["equipment", "additives"],
};

export function ProductListingPage({ section, sub }: { section: Product["section"]; sub?: string }) {
  const meta = sectionMeta[section];
  const all = products.filter((p) => p.section === section);
  const subs = [...new Set(all.map((p) => p.subCategory))].sort();
  const active = sub && subs.includes(sub) ? sub : undefined;
  const items = active ? all.filter((p) => p.subCategory === active) : all;
  const chip = (on: boolean) =>
    `inline-flex h-9 items-center rounded-full px-4 text-[14px] whitespace-nowrap transition-colors ${on ? "bg-ink text-white" : "bg-white text-ink shadow-[0_1px_2px_rgb(0_0_0/0.06)] hover:bg-mist-2"}`;
  return (
    <div className="bg-mist">
      <div className="container-wide pt-24 pb-24 lg:pt-28">
        <header className="mb-8 lg:mb-10">
          <h1 className="t-section">{meta.title}</h1>
          <p className="t-sub mt-3 max-w-[46ch] text-ink-2">{meta.blurb}</p>
        </header>
        <div className="mb-6 border-b border-hairline">
          <SubNav current={sectionHref[section]} items={siblings[section].map((s) => ({ label: sectionMeta[s].crumb, href: sectionHref[s] }))} />
        </div>
        {subs.length > 1 && (
          <nav aria-label="Filter by type" className="no-scrollbar -mx-5 mb-8 overflow-x-auto px-5 md:mx-0 md:px-0">
            <ul className="flex gap-2">
              <li><Link href={sectionHref[section]} scroll={false} aria-current={!active ? "page" : undefined} className={chip(!active)}>All</Link></li>
              {subs.map((s) => (
                <li key={s}>
                  <Link href={`${sectionHref[section]}?sub=${encodeURIComponent(s)}`} scroll={false} aria-current={active === s ? "page" : undefined} className={chip(active === s)}>{s}</Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
        {items.length === 0 ? (
          <p className="py-20 text-center text-ink-2">Nothing here at the moment. <Link href={sectionHref[section]} className="link">See everything</Link></p>
        ) : (
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 xl:grid-cols-4">
            {items.map((p) => <li key={p.slug}><ProductCard p={p} className="h-full" /></li>)}
          </ul>
        )}
      </div>
    </div>
  );
}

export function ProductDetailPage({ slug, section }: { slug: string; section: Product["section"] }) {
  const p = getProduct(slug);
  if (!p || p.section !== section) notFound();
  const meta = sectionMeta[section];
  const related = products.filter((x) => x.section === section && x.slug !== p.slug);

  const tabs = p.isLivestock
    ? [
        { id: "about", label: "About", content: <p>{p.description}</p> },
        { id: "care", label: "Care and compatibility", content: <p className="text-ink-2">Care, tankmate and feeding notes for {p.name} will be written by the shop.</p> },
        { id: "fulfilment", label: "Collection and delivery", content: <div className="space-y-3"><p>{fulfilment.collection.detail}</p><p>{fulfilment.delivery.detail}</p><p className="text-ink-2">{policies.livestockTerms}</p></div> },
      ]
    : [
        { id: "desc", label: "Overview", content: <p>{p.description}</p> },
        { id: "specs", label: "Tech specs", content: <FactsGrid facts={p.specs ?? []} /> },
        { id: "fulfilment", label: "Collection and delivery", content: <div className="space-y-3"><p>{fulfilment.collection.detail}</p><p>{fulfilment.deliveryDryGoods.detail}</p></div> },
      ];

  return (
    <>
      <div className="container-wide pt-20 pb-16 lg:pt-24">
        <nav aria-label="Breadcrumb" className="t-small mb-6 flex items-center gap-1 text-ink-2">
          <Link href={sectionHref[section]} className="hover:text-ink hover:underline">{meta.crumb}</Link>
          <ChevronRight className="size-3.5" aria-hidden />
          <span>{p.subCategory}</span>
        </nav>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Gallery
              tone={p.isLivestock ? "specimen" : "white"}
              note={p.representativePhoto ? "Representative photo" : undefined}
              photos={p.photo ? [p.photo] : []}
              labels={p.isLivestock ? [`${p.name}, side profile`, `${p.name}, detail`] : [`${p.name}, front`, `${p.name}, label`, `${p.name}, in use`]}
            />
          </div>
          <div className="lg:col-span-5 lg:pt-4">
            {p.brand && <p className="mb-2 text-[15px] text-ink-2">{p.brand}</p>}
            <h1 className="t-title">{p.name}</h1>
            {p.scientificName && <p className="mt-2 text-[17px] text-ink-2 italic">{p.scientificName}</p>}
            {p.highlights && <p className="mt-4 text-[17px] text-ink-2">{p.highlights.join(". ")}.</p>}
            <div className="mt-8"><BuyBox p={p} /></div>
            <div className="mt-10 rounded-2xl bg-mist p-6"><FulfilmentSummary livestock={p.isLivestock} /></div>
            {p.facts && (
              <div className="mt-10">
                <h2 className="mb-3 text-[15px] font-semibold">At a glance</h2>
                <FactsGrid facts={p.facts} />
              </div>
            )}
          </div>
        </div>
        <div className="mt-20 lg:mt-28"><DetailTabs tabs={tabs} /></div>
      </div>
      {related.length > 0 && (
        <div className="bg-mist">
          <Shelf title="You may also like.">
            {related.map((x) => <li key={x.slug}><ProductCard p={x} /></li>)}
          </Shelf>
        </div>
      )}
    </>
  );
}

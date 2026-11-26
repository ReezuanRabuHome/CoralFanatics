import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, products, sectionHref, type Product } from "@/data/sample";
import { ProductCard } from "@/components/store/cards";
import { BuyBox } from "@/components/store/BuyBox";
import { DetailTabs, Gallery } from "@/components/store/pdp";
import { FactsGrid, FulfilmentSummary } from "@/components/store/FactsGrid";
import { fulfilment, policies } from "@/config/placeholders";

export const sectionMeta: Record<Product["section"], { title: string; eyebrow: string; blurb: string; crumb: string }> = {
  fish: { title: "Marine fish.", eyebrow: "Marine life", blurb: "Reef-suitable fish, chosen with care.", crumb: "Marine fish" },
  invertebrates: { title: "Invertebrates.", eyebrow: "Marine life", blurb: "Shrimp, snails, crabs and urchins: your reef's clean-up crew and characters.", crumb: "Invertebrates" },
  equipment: { title: "Equipment.", eyebrow: "Equipment & essentials", blurb: "Lighting, pumps, salt and testing, from brands we use ourselves.", crumb: "Equipment" },
  additives: { title: "Additives.", eyebrow: "Equipment & essentials", blurb: "Supplements and maintenance products for stable parameters.", crumb: "Additives" },
};

export function ProductListingPage({ section }: { section: Product["section"] }) {
  const meta = sectionMeta[section];
  const items = products.filter((p) => p.section === section);
  const subs = [...new Set(items.map((p) => p.subCategory))];
  return (
    <div className="container-wide pt-24 pb-24 lg:pt-32">
      <header className="mb-8 max-w-3xl">
        <p className="t-eyebrow text-gold-700">{meta.eyebrow}</p>
        <h1 className="t-h1 mt-3">{meta.title}</h1>
        <p className="mt-3 text-lg text-ink-600">{meta.blurb}</p>
      </header>
      <ul className="no-scrollbar -mx-4 mb-10 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:px-0">
        <li><span className="inline-flex h-10 items-center rounded-full border border-ink-900 bg-ink-900 px-4 text-sm font-medium text-pearl-50">All</span></li>
        {subs.map((s) => (
          <li key={s}><span className="inline-flex h-10 items-center rounded-full border border-pearl-300 bg-pearl-50 px-4 text-sm font-medium whitespace-nowrap">{s}</span></li>
        ))}
      </ul>
      <div className="mb-6 flex items-center justify-between text-sm text-ink-600">
        <span className="tabular">{items.length} products</span>
        <span>Sort: {section === "equipment" || section === "additives" ? "Featured" : "Newest"}</span>
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4 lg:gap-y-12">
        {items.map((p) => <ProductCard key={p.slug} p={p} />)}
      </div>
    </div>
  );
}

export function ProductDetailPage({ slug, section }: { slug: string; section: Product["section"] }) {
  const p = getProduct(slug);
  if (!p || p.section !== section) notFound();
  const meta = sectionMeta[section];
  const related = products.filter((x) => x.section === section && x.slug !== p.slug).slice(0, 4);

  const tabs = p.isLivestock
    ? [
        { id: "about", label: "About", content: <p>{p.description}</p> },
        {
          id: "care",
          label: "Care & compatibility",
          content: <p className="text-ink-600">[Care, tankmates and feeding notes for {p.name}, to be written by the shop.]</p>,
        },
        { id: "fulfilment", label: "Collection & delivery", content: <div className="space-y-3"><p>{fulfilment.collectionSummary}</p><p>{fulfilment.deliverySummary}</p><p className="text-ink-600">{policies.livestockTerms}</p></div> },
      ]
    : [
        { id: "desc", label: "Description", content: <p>{p.description}</p> },
        {
          id: "specs",
          label: "Specifications",
          content: (
            <table className="w-full text-left text-[15px]">
              <tbody className="divide-y divide-pearl-300">
                {p.specs?.map(([k, v]) => (
                  <tr key={k}><th scope="row" className="w-48 py-3 font-normal text-ink-600">{k}</th><td className="py-3">{v}</td></tr>
                ))}
              </tbody>
            </table>
          ),
        },
        { id: "fulfilment", label: "Collection & delivery", content: <div className="space-y-3"><p>{fulfilment.collectionSummary}</p><p>{fulfilment.deliverySummary}</p></div> },
      ];

  return (
    <div className="container-wide pt-20 pb-28 lg:pt-28 lg:pb-24">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-ink-600">
        <Link href={sectionHref[section]} className="hover:underline">{meta.crumb}</Link> <span aria-hidden>/</span>{" "}
        <span className="text-ink-900">{p.subCategory}</span>
      </nav>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-7">
          <Gallery
            tone={p.isLivestock ? "dark" : "light"}
            chip={p.representativePhoto ? "Representative photo" : undefined}
            labels={
              p.isLivestock
                ? [`${p.name}: side profile`, `${p.name}: detail`]
                : [`${p.name}: front, white seamless`, `${p.name}: back / label`, `${p.name}: in use`, `${p.name}: size reference`]
            }
          />
        </div>
        <div className="lg:col-span-5">
          <p className="t-eyebrow text-ink-600">{p.brand ?? `${meta.crumb} · ${p.subCategory}`}</p>
          <h1 className="t-h1 mt-3">{p.name}</h1>
          {p.scientificName && <p className="mt-2 text-lg text-ink-600 italic">{p.scientificName}</p>}
          {p.highlights && (
            <ul className="mt-5 space-y-1.5 text-[15px] text-ink-600">
              {p.highlights.map((h) => <li key={h} className="flex gap-2"><span aria-hidden>–</span>{h}</li>)}
            </ul>
          )}
          <div className="mt-8"><BuyBox p={p} /></div>
          {p.facts && <div className="mt-6"><FactsGrid facts={p.facts} /></div>}
          <div className="mt-6">
            <FulfilmentSummary livestock={p.isLivestock} lines={[fulfilment.collectionSummary, fulfilment.deliverySummary]} />
          </div>
        </div>
      </div>
      <section className="mt-16 lg:mt-24" aria-label="Details"><DetailTabs tabs={tabs} /></section>
      {related.length > 0 && (
        <section className="mt-16 lg:mt-20">
          <h2 className="t-h2 mb-8">You may also like</h2>
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
            {related.map((x) => <ProductCard key={x.slug} p={x} />)}
          </div>
        </section>
      )}
    </div>
  );
}

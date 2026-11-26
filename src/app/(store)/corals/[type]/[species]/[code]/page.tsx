import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import { coralTypes, getSpecimen, specimens } from "@/data/sample";
import { formatPrice } from "@/lib/money";
import { AddToBagButton } from "@/components/store/bag";
import { CopyId, DetailTabs, Gallery } from "@/components/store/pdp";
import { FactsGrid, FulfilmentSummary } from "@/components/store/FactsGrid";
import { Shelf, SpecimenCard } from "@/components/store/cards";
import { fulfilment, policies } from "@/config/placeholders";

type Params = Promise<{ type: string; species: string; code: string }>;

export function generateStaticParams() {
  return specimens.map((s) => ({ type: s.type, species: s.speciesSlug, code: s.code.toLowerCase() }));
}

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const s = getSpecimen((await params).code);
  return s ? { title: `${s.species} ${s.code}`, description: `${s.species} (${s.scientificName}). Unique specimen ${s.code}.` } : {};
}

const statusCopy = {
  AVAILABLE: "This exact piece is available.",
  RESERVED: "Someone is checking out with this piece. If they don't complete payment, it becomes available again within 15 minutes.",
  SOLD: "This piece has found a new home.",
  UNAVAILABLE: "This piece is currently unavailable.",
  DRAFT: "",
} as const;

export default async function SpecimenPage({ params }: { params: Params }) {
  const { code } = await params;
  const s = getSpecimen(code);
  if (!s) notFound();
  const type = coralTypes[s.type];
  const siblings = specimens.filter((x) => x.speciesSlug === s.speciesSlug && x.code !== s.code && x.status === "AVAILABLE");
  const more = specimens.filter((x) => x.type === s.type && x.speciesSlug !== s.speciesSlug && x.status === "AVAILABLE").slice(0, 8);
  const canBuy = s.status === "AVAILABLE";

  return (
    <>
      <div className="container-wide pt-20 pb-16 lg:pt-24">
        <nav aria-label="Breadcrumb" className="t-small mb-6 flex items-center gap-1 text-ink-2">
          <Link href={`/corals/${s.type}`} className="hover:text-ink hover:underline">{s.type === "mushrooms" ? "Mushrooms" : `${type.label} Corals`}</Link>
          <ChevronRight className="size-3.5" aria-hidden />
          <span>{s.subType}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Gallery
              tone="specimen"
              note="Actual specimen"
              photos={s.photo ? [s.photo] : []}
              labels={[`${s.code}, top-down at the photo station`, `${s.code}, angled side view`, `${s.code}, with scale reference`]}
            />
          </div>

          <div className="lg:col-span-5 lg:pt-4">
            {s.listedDaysAgo <= 1 && <p className="mb-2 text-[15px] font-medium text-coral-ink">New</p>}
            <h1 className="t-title">{s.species}</h1>
            <p className="mt-2 text-[17px] text-ink-2 italic">{s.scientificName}</p>
            <div className="mt-2"><CopyId id={s.code} /></div>

            <p className="tabular mt-8 text-[28px] font-semibold tracking-[-0.02em]">{formatPrice(s.priceCents)}</p>
            <p className="t-small mt-1 text-ink-2">One of a kind. {statusCopy[s.status]}</p>

            <div className="mt-8">
              {canBuy ? (
                <AddToBagButton line={{ kind: "specimen", code: s.code }} className="btn btn-primary btn-lg w-full" />
              ) : siblings.length ? (
                <a href="#siblings" className="btn btn-quiet btn-lg w-full">See other {s.species} pieces</a>
              ) : (
                <button className="btn btn-primary btn-lg w-full" disabled>Not available</button>
              )}
            </div>

            <div className="mt-10 rounded-2xl bg-mist p-6">
              <FulfilmentSummary livestock />
            </div>

            <div className="mt-10">
              <h2 className="mb-3 text-[15px] font-semibold">At a glance</h2>
              <FactsGrid
                facts={[
                  ["Approximate size", `~${s.sizeCm} cm`],
                  ["Lighting", s.lighting],
                  ["Flow", s.flow],
                  ["Placement", s.placement],
                  ["Care level", s.care],
                  ["Growth", s.growth],
                ]}
              />
            </div>
            <p className="t-small mt-4 text-ink-2">Photographed under reef lighting. Colours vary with your lighting and display.</p>
          </div>
        </div>

        <div className="mt-20 lg:mt-28">
          <DetailTabs
            tabs={[
              {
                id: "about",
                label: "About this coral",
                content: (
                  <div className="space-y-4">
                    <p>{s.notes}</p>
                    <p className="text-ink-2">The species description for {s.species} will be written by the shop and shared by every piece of this species.</p>
                  </div>
                ),
              },
              {
                id: "care",
                label: "Care",
                content: (
                  <p>
                    {s.lighting} lighting, {s.flow.toLowerCase()} flow, best placed in the {s.placement.toLowerCase()} part of the reef.
                    Suited to {s.care.toLowerCase()} reef keepers. <span className="text-ink-2">Water parameters will be added if provided by the shop.</span>
                  </p>
                ),
              },
              {
                id: "fulfilment",
                label: "Collection and delivery",
                content: (
                  <div className="space-y-3">
                    <p>{fulfilment.collection.detail}</p>
                    <p>{fulfilment.delivery.detail}</p>
                    <p className="text-ink-2">{policies.livestockTerms}</p>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </div>

      {siblings.length > 0 && (
        <div id="siblings" className="scroll-mt-12 bg-mist">
          <Shelf title={`More ${s.species}.`} tagline="Other pieces of the same coral.">
            {siblings.map((x) => <li key={x.code}><SpecimenCard s={x} /></li>)}
          </Shelf>
        </div>
      )}
      <div className={siblings.length ? "bg-white" : "bg-mist"}>
        <Shelf title={`More ${type.label}.`} tagline="You may also like.">
          {more.map((x) => <li key={x.code}><SpecimenCard s={x} /></li>)}
        </Shelf>
      </div>

      {/* Mobile purchase bar */}
      {canBuy && (
        <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-4 bg-white/85 px-5 py-3 backdrop-blur-xl lg:hidden">
          <p className="tabular text-[17px] font-semibold">{formatPrice(s.priceCents)}</p>
          <div className="ml-auto w-1/2">
            <AddToBagButton line={{ kind: "specimen", code: s.code }} className="btn btn-primary w-full" />
          </div>
        </div>
      )}
    </>
  );
}

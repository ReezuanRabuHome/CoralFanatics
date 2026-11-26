import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { coralTypes, getSpecimen, specimens, specimenHref } from "@/data/sample";
import { formatPrice } from "@/lib/money";
import { OneOfAKind, SpecimenStatusPill } from "@/components/StatusBadge";
import { AddToBagButton } from "@/components/store/bag";
import { CopyId, DetailTabs, Gallery } from "@/components/store/pdp";
import { FactsGrid, FulfilmentSummary } from "@/components/store/FactsGrid";
import { SpecimenCard } from "@/components/store/cards";
import { fulfilment, policies } from "@/config/placeholders";

type Params = Promise<{ type: string; species: string; code: string }>;

export function generateStaticParams() {
  return specimens.map((s) => ({ type: s.type, species: s.speciesSlug, code: s.code.toLowerCase() }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const s = getSpecimen((await params).code);
  return s ? { title: `${s.species} ${s.code}`, description: `${s.species} (${s.scientificName}). Unique specimen ${s.code}.` } : {};
}

const statusCopy = {
  AVAILABLE: "This exact piece is available.",
  RESERVED: "Someone is checking out with this piece. It may become available again within 15 minutes.",
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
  const more = specimens.filter((x) => x.type === s.type && x.speciesSlug !== s.speciesSlug && x.status === "AVAILABLE").slice(0, 4);
  const canBuy = s.status === "AVAILABLE";

  return (
    <>
      <div className="container-wide pt-20 pb-28 lg:pt-28 lg:pb-24">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-ink-600">
          <Link href="/corals/sps" className="hover:underline">Corals</Link> <span aria-hidden>/</span>{" "}
          <Link href={`/corals/${s.type}`} className="hover:underline">{type.label}</Link> <span aria-hidden>/</span>{" "}
          <span className="text-ink-900">{s.subType}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <Gallery
              tone="specimen"
              chip="Actual specimen"
              labels={[
                `${s.code}: top-down, photo station lighting`,
                `${s.code}: angled side view`,
                `${s.code}: scale reference`,
              ]}
            />
          </div>

          <div className="lg:col-span-5">
            <p className="t-eyebrow text-ink-600">{type.label} · {s.subType}</p>
            <h1 className="t-h1 mt-3">{s.species}</h1>
            <p className="mt-2 text-lg text-ink-600 italic">{s.scientificName}</p>
            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
              <OneOfAKind />
              <span className="text-ink-400" aria-hidden>·</span>
              <span className="text-ink-600">Specimen</span>
              <CopyId id={s.code} />
            </div>

            <div className="mt-8 flex items-end justify-between gap-4 border-t border-pearl-300 pt-6">
              <div>
                <p className="tabular text-3xl font-semibold tracking-tight">{formatPrice(s.priceCents)}</p>
                <p className="mt-1 text-xs text-ink-600">{policies.gstNote}</p>
              </div>
              <SpecimenStatusPill status={s.status} />
            </div>
            <p className="mt-3 text-sm text-ink-600">{statusCopy[s.status]}</p>

            <div className="mt-6">
              <FactsGrid
                facts={[
                  ["Size", `~${s.sizeCm} cm`],
                  ["Lighting", s.lighting],
                  ["Flow", s.flow],
                  ["Placement", s.placement],
                  ["Care", s.care],
                  ["Growth", s.growth],
                ]}
              />
            </div>

            <div className="mt-6 hidden lg:block">
              {canBuy ? (
                <AddToBagButton line={{ kind: "specimen", code: s.code }} />
              ) : siblings.length ? (
                <a href="#siblings" className="btn btn-secondary btn-lg w-full">See other {s.species} pieces</a>
              ) : (
                <button className="btn btn-primary btn-lg w-full" disabled>Not available</button>
              )}
            </div>

            <div className="mt-6">
              <FulfilmentSummary livestock lines={[fulfilment.collectionSummary, fulfilment.deliverySummary]} />
            </div>
            <p className="mt-4 text-xs text-ink-600">Photographed under reef lighting. Colours may vary with your lighting and display.</p>
          </div>
        </div>

        <section className="mt-16 lg:mt-24" aria-label="Details">
          <DetailTabs
            tabs={[
              {
                id: "about",
                label: "About this coral",
                content: (
                  <div className="space-y-4">
                    <p><strong>This specimen:</strong> {s.notes}</p>
                    <p className="text-ink-600">[Species description for {s.species}, shared by every specimen of this species and written by the shop.]</p>
                  </div>
                ),
              },
              {
                id: "care",
                label: "Care",
                content: (
                  <dl className="grid grid-cols-[140px_1fr] gap-y-3">
                    <dt className="text-ink-600">Lighting</dt><dd>{s.lighting}</dd>
                    <dt className="text-ink-600">Flow</dt><dd>{s.flow}</dd>
                    <dt className="text-ink-600">Placement</dt><dd>{s.placement}</dd>
                    <dt className="text-ink-600">Difficulty</dt><dd>{s.care}</dd>
                    <dt className="text-ink-600">Parameters</dt><dd className="text-ink-600">[Alk / Ca / Mg ranges: only if supplied by the shop]</dd>
                  </dl>
                ),
              },
              {
                id: "fulfilment",
                label: "Collection & delivery",
                content: (
                  <div className="space-y-3">
                    <p>{fulfilment.collectionSummary}</p>
                    <p>{fulfilment.deliverySummary}</p>
                    <p className="text-ink-600">{policies.livestockTerms}</p>
                  </div>
                ),
              },
            ]}
          />
        </section>

        {siblings.length > 0 && (
          <section id="siblings" className="mt-16 scroll-mt-24 lg:mt-20">
            <h2 className="t-h2 mb-8">Other {s.species} pieces</h2>
            <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
              {siblings.map((x) => <SpecimenCard key={x.code} s={x} />)}
            </div>
          </section>
        )}

        <section className="mt-16 lg:mt-20">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="t-h2">More {type.label} you may like</h2>
            <Link href={`/corals/${s.type}`} className="link-arrow hidden sm:inline-flex">View all <ArrowRight className="size-4" /></Link>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
            {more.map((x) => <SpecimenCard key={x.code} s={x} />)}
          </div>
        </section>
      </div>

      {/* Mobile sticky purchase bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-4 border-t border-pearl-300 bg-pearl-50/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="min-w-0">
          <p className="tabular text-lg font-semibold">{formatPrice(s.priceCents)}</p>
          <p className="t-id truncate text-ink-600">{s.code}</p>
        </div>
        <div className="ml-auto w-1/2">
          {canBuy ? (
            <AddToBagButton line={{ kind: "specimen", code: s.code }} className="btn btn-primary w-full" />
          ) : (
            <a href={siblings.length ? "#siblings" : specimenHref(s)} className="btn btn-secondary w-full">{s.status === "SOLD" ? "See similar" : "Unavailable"}</a>
          )}
        </div>
      </div>
    </>
  );
}

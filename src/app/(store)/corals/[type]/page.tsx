import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CoralListing } from "@/components/store/CoralListing";
import { SubNav } from "@/components/store/SubNav";
import { coralTypes, specimens, type CoralType } from "@/data/sample";

export function generateStaticParams() {
  return Object.keys(coralTypes).map((type) => ({ type }));
}

export async function generateMetadata({ params }: { params: Promise<{ type: string }> }): Promise<Metadata> {
  const { type } = await params;
  const t = coralTypes[type as CoralType];
  return t ? { title: `${t.label} corals`, description: t.blurb } : {};
}

export default async function CoralTypePage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const meta = coralTypes[type as CoralType];
  if (!meta) notFound();
  const items = specimens.filter((s) => s.type === type);

  return (
    <div className="bg-mist">
      <div className="container-wide pt-24 pb-24 lg:pt-28">
        <header className="mb-8 lg:mb-10">
          <h1 className="t-section">{meta.title}</h1>
          <p className="t-sub mt-3 max-w-[46ch] text-ink-2">{meta.blurb}</p>
        </header>
        <div className="mb-8 border-b border-hairline">
          <SubNav
            current={`/corals/${type}`}
            items={(Object.keys(coralTypes) as CoralType[]).map((t) => ({ label: `${coralTypes[t].label} Corals`.replace("Mushrooms Corals", "Mushrooms"), href: `/corals/${t}` }))}
          />
        </div>
        <CoralListing items={items} />
      </div>
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CoralListing } from "@/components/store/CoralListing";
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
    <div className="container-wide pt-24 pb-24 lg:pt-32">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-ink-600">
        <Link href="/" className="hover:underline">Home</Link> <span aria-hidden>/</span> <span>Corals</span> <span aria-hidden>/</span>{" "}
        <span className="text-ink-900">{meta.label}</span>
      </nav>
      <header className="mb-8 max-w-3xl">
        <p className="t-eyebrow text-gold-700">{meta.eyebrow}</p>
        <h1 className="t-h1 mt-3">{meta.title}</h1>
        <p className="mt-3 text-lg text-ink-600">{meta.blurb}</p>
      </header>
      <ul className="no-scrollbar -mx-4 mb-10 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:px-0">
        {(Object.keys(coralTypes) as CoralType[]).map((t) => (
          <li key={t}>
            <Link
              href={`/corals/${t}`}
              aria-current={t === type ? "page" : undefined}
              className={`inline-flex h-10 items-center rounded-full border px-4 text-sm font-medium whitespace-nowrap ${
                t === type ? "border-ink-900 bg-ink-900 text-pearl-50" : "border-pearl-300 bg-pearl-50 hover:border-ink-900"
              }`}
            >
              {coralTypes[t].label}
            </Link>
          </li>
        ))}
      </ul>
      <CoralListing items={items} />
    </div>
  );
}

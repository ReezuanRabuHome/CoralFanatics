import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { fulfilment, policies, store } from "@/config/placeholders";

/**
 * Policy pages. The shop supplies the final wording before launch
 * (placeholders.md Q3–Q5, Q11); until then each page states what it will cover.
 */
const pages: Record<string, { title: string; intro: string; covers: string[]; body?: React.ReactNode }> = {
  delivery: {
    title: "Collection and delivery.",
    intro: "How to collect your order from the shop or have it delivered in Singapore.",
    covers: ["Collection hours and same-day cut-off", "Delivery days, time windows and fees", "How livestock is packed and delivered"],
    body: (
      <ul className="space-y-3">
        <li><strong>{fulfilment.collection.title}.</strong> {fulfilment.collection.detail}</li>
        <li><strong>{fulfilment.delivery.title}.</strong> {fulfilment.delivery.detail}</li>
      </ul>
    ),
  },
  livestock: {
    title: "Livestock policy.",
    intro: "What to expect when you buy corals, fish and invertebrates from us.",
    covers: ["Live-arrival guarantee and how to report a problem", "Acclimatisation guidance", "How long uncollected livestock is held"],
    body: <p>{policies.livestockTerms}</p>,
  },
  terms: {
    title: "Terms of sale.",
    intro: "The terms that apply when you order from Coral Fanatics.",
    covers: ["Pricing and payment", "Order acceptance and cancellation", "Product photos and colour variation"],
  },
  privacy: {
    title: "Privacy policy.",
    intro: "How we collect, use and protect your personal data under Singapore's PDPA.",
    covers: ["What we collect at checkout and why", "How long we keep it", "How to request access, correction or deletion"],
  },
  returns: {
    title: "Returns.",
    intro: "Returns and refunds for equipment and livestock.",
    covers: ["Equipment returns and conditions", "Livestock claims", "How refunds are paid"],
  },
};

export function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = pages[(await params).slug];
  return p ? { title: p.title.replace(/\.$/, "") } : {};
}

export default async function PolicyPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = pages[(await params).slug];
  if (!p) notFound();
  return (
    <div className="container-content max-w-[760px] pt-28 pb-24 lg:pt-36">
      <h1 className="t-section">{p.title}</h1>
      <p className="t-sub mt-4 text-ink-2">{p.intro}</p>
      {p.body && <div className="mt-10 text-[17px] leading-relaxed">{p.body}</div>}
      <div className="mt-10 rounded-[24px] bg-mist p-6 md:p-8">
        <p className="font-semibold">The full policy will be published here before launch.</p>
        <p className="t-small mt-1 text-ink-2">It will cover:</p>
        <ul className="mt-4 space-y-2 text-[15px]">
          {p.covers.map((c) => <li key={c} className="flex gap-3"><span aria-hidden className="text-ink-3">–</span>{c}</li>)}
        </ul>
      </div>
      <p className="t-small mt-10 text-ink-2">
        Questions? Contact us on {store.phone}. <Link href="/policies/terms" className="link">Terms</Link> · <Link href="/policies/privacy" className="link">Privacy</Link> · <Link href="/policies/livestock" className="link">Livestock</Link>
      </p>
    </div>
  );
}

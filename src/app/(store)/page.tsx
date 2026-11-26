import Link from "next/link";
import { ArrowRight, ChevronDown, HeartHandshake, ShieldCheck, Store, Truck } from "lucide-react";
import { PhotoPlaceholder } from "@/components/PhotoPlaceholder";
import { SpecimenCard, ProductCard } from "@/components/store/cards";
import { Badge } from "@/components/brand/Badge";
import { coralTypes, products, specimens, type CoralType } from "@/data/sample";
import { serviceStrip, store } from "@/config/placeholders";

const stripIcons = { truck: Truck, store: Store, shield: ShieldCheck, heart: HeartHandshake } as const;

export default function HomePage() {
  const newest = specimens
    .filter((s) => s.status === "AVAILABLE")
    .sort((a, b) => a.listedDaysAgo - b.listedDaysAgo)
    .slice(0, 8);
  const counts = (t: CoralType) => specimens.filter((s) => s.type === t && s.status === "AVAILABLE").length;
  const marine = products.filter((p) => p.section === "fish" || p.section === "invertebrates").slice(0, 4);
  const gear = products.filter((p) => !p.isLivestock).slice(0, 8);

  return (
    <>
      {/* B. Cinematic hero */}
      <section className="mode-ocean relative isolate flex h-[88svh] min-h-[560px] items-end overflow-hidden bg-ocean-900 text-pearl-50 lg:h-screen lg:max-h-[960px] lg:min-h-[640px]">
        <div className="absolute inset-0 -z-10">
          <PhotoPlaceholder
            tone="dark"
            rounded={false}
            labelAt="top"
            ratio="auto"
            className="h-full"
            label="Hero: real display-tank photo or 10–20 s video (16:9 desktop · 4:5 mobile)"
          />
          {/* Localised scrim behind the text block only (legibility, not decoration) */}
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ocean-950/85 via-ocean-950/40 to-transparent" />
        </div>
        <div className="container-wide pb-16 lg:pb-24">
          <p className="t-eyebrow text-gold-500">Coral Fanatics · Singapore</p>
          <h1 className="t-display-xl mt-5 max-w-[12ch]">A world beneath the surface.</h1>
          <p className="mt-6 max-w-[40ch] text-lg text-pearl-100/85 lg:text-xl">
            Discover exceptional corals, marine life and everything you need to build your own reef.
          </p>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <Link href="/corals/sps" className="btn btn-lg btn-primary-ocean w-full sm:w-auto">Explore the collection</Link>
            <Link href="/new-arrivals" className="link-arrow text-pearl-50">See new arrivals <ArrowRight className="size-4" /></Link>
          </div>
        </div>
        <ChevronDown aria-hidden className="absolute bottom-6 left-1/2 hidden size-5 -translate-x-1/2 text-pearl-100/60 lg:block" />
      </section>

      {/* B2. Service strip */}
      <section aria-label="Shop services" className="border-b border-pearl-300 bg-pearl-100">
        <ul className="container-wide no-scrollbar flex h-16 items-center gap-8 overflow-x-auto text-sm whitespace-nowrap text-ink-600 lg:justify-center lg:gap-12">
          {serviceStrip.map((s) => {
            const Icon = stripIcons[s.icon];
            return (
              <li key={s.text} className="flex items-center gap-2.5">
                <Icon className="size-4 text-ink-900" strokeWidth={1.75} aria-hidden />
                {s.text}
              </li>
            );
          })}
        </ul>
      </section>

      {/* C. Coral collections */}
      <section className="mode-ocean bg-ocean-900 py-24 text-pearl-50 lg:py-40">
        <div className="container-wide">
          <div className="reveal mb-12 flex flex-col gap-6 lg:mb-16 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="t-eyebrow text-gold-500">Corals</p>
              <h2 className="t-display-l mt-4 max-w-[14ch]">Nature&rsquo;s finest details.</h2>
            </div>
            <Link href="/corals/sps" className="link-arrow text-pearl-100">Shop all corals <ArrowRight className="size-4" /></Link>
          </div>
          <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0">
            {(Object.keys(coralTypes) as CoralType[]).map((t) => (
              <Link key={t} href={`/corals/${t}`} className="group relative w-[85%] shrink-0 snap-start overflow-hidden rounded-xl md:w-auto">
                <div className="transition-transform duration-500 ease-[var(--ease-reef-slow)] group-hover:scale-[1.02]">
                  <PhotoPlaceholder tone="dark" ratio="4 / 5" label={`Collection panel: one strong real ${coralTypes[t].label} coral (4:5)`} />
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ocean-950/90 to-transparent p-6 pt-24 lg:p-8 lg:pt-32">
                  <p className="t-eyebrow text-gold-500">{coralTypes[t].eyebrow}</p>
                  <h3 className="t-h1 mt-2">{coralTypes[t].label}</h3>
                  <p className="mt-2 flex items-center justify-between text-sm text-pearl-100/80">
                    <span className="tabular">{counts(t)} available</span>
                    <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* D. One of a kind */}
      <section className="bg-pearl-100 py-20 lg:py-32">
        <div className="container-wide">
          <div className="reveal mb-10 flex flex-col gap-4 lg:mb-14 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="t-eyebrow text-gold-700">Just in</p>
              <h2 className="t-display-l mt-4">One of a kind.</h2>
              <p className="mt-4 max-w-[52ch] text-lg text-ink-600">Every coral below is the exact piece you&rsquo;ll receive.</p>
            </div>
            <Link href="/new-arrivals" className="link-arrow">View all new arrivals <ArrowRight className="size-4" /></Link>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4 lg:gap-y-12">
            {newest.map((s, i) => (
              <div key={s.code} className={i >= 4 ? "hidden md:block" : ""}>
                <SpecimenCard s={s} />
              </div>
            ))}
          </div>
          <div className="mt-10 md:hidden">
            <Link href="/new-arrivals" className="btn btn-secondary w-full">View all new arrivals</Link>
          </div>
        </div>
      </section>

      {/* E. Marine life */}
      <section className="mode-ocean bg-ocean-900 py-24 text-pearl-50 lg:py-40">
        <div className="container-wide">
          <div className="reveal mb-12 lg:mb-16">
            <p className="t-eyebrow text-gold-500">Marine life</p>
            <h2 className="t-display-l mt-4">Bring your reef to life.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-12 md:gap-6">
            <Link href="/marine-life/fish" className="group relative overflow-hidden rounded-xl md:col-span-7">
              <PhotoPlaceholder tone="dark" ratio="4 / 3" className="max-md:[aspect-ratio:4/5]" label="Real marine fish photograph from the shop" />
              <div className="absolute bottom-0 left-0 p-6 lg:p-8">
                <h3 className="t-h1">Marine fish</h3>
                <span className="link-arrow mt-3 text-pearl-100">Shop marine fish <ArrowRight className="size-4" /></span>
              </div>
            </Link>
            <Link href="/marine-life/invertebrates" className="group relative overflow-hidden rounded-xl md:col-span-5">
              <PhotoPlaceholder tone="dark" ratio="auto" className="aspect-[4/5] md:h-full md:aspect-auto" label="Real invertebrate photograph from the shop" />
              <div className="absolute bottom-0 left-0 p-6 lg:p-8">
                <h3 className="t-h1">Invertebrates</h3>
                <span className="link-arrow mt-3 text-pearl-100">Shop invertebrates <ArrowRight className="size-4" /></span>
              </div>
            </Link>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-x-3 gap-y-8 md:gap-x-6 lg:grid-cols-4">
            {marine.map((p) => <ProductCard key={p.slug} p={p} tone="dark" />)}
          </div>
        </div>
      </section>

      {/* F. Equipment */}
      <section className="bg-pearl-100 py-20 lg:py-32">
        <div className="container-wide">
          <div className="reveal mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="t-eyebrow text-gold-700">Equipment &amp; essentials</p>
              <h2 className="t-display-l mt-4">Everything your reef needs.</h2>
            </div>
            <div className="flex gap-6">
              <Link href="/equipment" className="link-arrow">Shop equipment <ArrowRight className="size-4" /></Link>
              <Link href="/additives" className="link-arrow">Shop additives <ArrowRight className="size-4" /></Link>
            </div>
          </div>
          <ul className="no-scrollbar -mx-4 mb-10 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
            {["Lighting", "Filtration", "Pumps", "Salt & Testing", "Additives", "Food"].map((c) => (
              <li key={c}>
                <Link href="/equipment" className="inline-flex h-10 items-center rounded-full border border-pearl-300 bg-pearl-50 px-4 text-sm font-medium whitespace-nowrap hover:border-ink-900">{c}</Link>
              </li>
            ))}
          </ul>
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4 lg:gap-y-12">
            {gear.map((p, i) => (
              <div key={p.slug} className={i >= 4 ? "hidden lg:block" : ""}>
                <ProductCard p={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* G. Brand story + Visit */}
      <section id="story" className="mode-ocean scroll-mt-20 bg-ocean-900 py-24 text-pearl-50 lg:py-40">
        <div className="container-wide">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <PhotoPlaceholder tone="dark" ratio="3 / 2" label="Real photograph of the shop interior and/or team" />
            </div>
            <div className="reveal lg:col-span-5">
              <p className="t-eyebrow text-gold-500">Our story</p>
              <h2 className="t-display-l mt-4">Driven by a passion for the reef.</h2>
              <div className="mt-6 space-y-4 text-lg text-pearl-100/80">
                <p className="rounded-lg border border-dashed border-amber-600/60 p-4 text-base text-amber-100/90">
                  [DRAFT COPY: two or three short paragraphs about how Coral Fanatics started, what the team cares about and how corals are
                  selected, to be written with the owner.]
                </p>
              </div>
              <Link href="/our-story" className="link-arrow mt-8 text-pearl-100">Our story <ArrowRight className="size-4" /></Link>
            </div>
          </div>
          <div id="visit" className="mt-16 grid scroll-mt-24 gap-8 border-t border-ocean-700 pt-10 md:grid-cols-3 lg:mt-24">
            {[
              ["Visit", store.address],
              ["Opening hours", store.hours],
              ["Contact", `${store.phone} · ${store.email}`],
            ].map(([h, v]) => (
              <div key={h}>
                <p className="t-eyebrow text-gold-500">{h}</p>
                <p className="mt-3 text-pearl-100/85">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* H. Final CTA */}
      <section className="mode-ocean flex min-h-[70svh] items-center bg-ocean-950 py-24 text-center text-pearl-50 lg:min-h-[60vh]">
        <div className="container-content reveal flex flex-col items-center">
          <Badge size={88} href={null} />
          <h2 className="t-display-l mt-10 max-w-[16ch]">Your next reef begins here.</h2>
          <p className="mt-5 max-w-[44ch] text-lg text-pearl-100/75">New corals and marine life arrive every week.</p>
          <div className="mt-10 flex w-full flex-col items-center gap-5 sm:w-auto sm:flex-row">
            <Link href="/corals/sps" className="btn btn-lg btn-accent w-full sm:w-auto">Explore the collection</Link>
            <Link href="/#visit" className="link-arrow text-pearl-100">Visit the shop <ArrowRight className="size-4" /></Link>
          </div>
        </div>
      </section>
    </>
  );
}

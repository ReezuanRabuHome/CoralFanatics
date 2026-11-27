import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Photo } from "@/components/Photo";
import { Shelf } from "@/components/store/Shelf";
import { SpecimenCard } from "@/components/store/cards";
import { Badge } from "@/components/brand/Badge";
import { coralTypes, getProduct, productHref, specimens, type CoralType } from "@/data/sample";
import { formatPriceShort } from "@/lib/money";
import { store } from "@/config/placeholders";

function More({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link href={href} className={`link text-[17px] ${className}`}>
      {children}
      <ChevronRight className="size-4" strokeWidth={2} aria-hidden />
    </Link>
  );
}

const coralTiles: Record<CoralType, { photo: string; line: string }> = {
  sps: { photo: "/photos/acropora-green-yellow-polyps.jpg", line: "Acropora, Montipora and more." },
  lps: { photo: "/photos/hammer-green.jpg", line: "Hammers, chalices, acans and more." },
  mushrooms: { photo: "/photos/ricordea-yuma-orange.jpg", line: "Ricordea, Rhodactis and more." },
};

/** Staggers scroll reveals for items that enter the viewport together. */
const stagger = (i: number) => ({ animationRange: `entry ${i * 6}% entry ${32 + i * 6}%` }) as React.CSSProperties;

export default function HomePage() {
  // Homepage only features pieces with real photographs.
  const featured = specimens
    .filter((s) => s.status === "AVAILABLE" && s.photo)
    .sort((a, b) => a.listedDaysAgo - b.listedDaysAgo);
  const skimmer = getProduct("nyos-quantum-protein-skimmer");

  return (
    <>
      {/* Hero */}
      <section data-dark-hero className="on-ocean relative isolate flex h-[100svh] max-h-[960px] min-h-[640px] flex-col overflow-hidden bg-ocean-deep text-white">
        {/* Photo sits below the headline and fades up into the water, so text never sits on bright coral */}
        <div className="hero-parallax absolute inset-x-0 top-[58%] bottom-0 -z-10 lg:top-[46%]">
          <div className="hero-photo h-full">
            <Photo
              src="/photos/acropora-lime.jpg"
              alt="Lime Acropora photographed in the Coral Fanatics shop"
              ratio="auto"
              className="h-full !bg-ocean-deep"
              sizes="100vw"
              priority
              position="50% 35%"
            />
          </div>
          <div className="absolute inset-x-0 top-0 h-[45%] bg-gradient-to-b from-ocean-deep to-transparent" />
        </div>
        <div className="container-content flex flex-col items-center pt-32 text-center lg:pt-40">
          <h1 className="t-hero hero-line max-w-[14ch]" style={{ "--i": 0 } as React.CSSProperties}>A world beneath the surface.</h1>
          <p className="t-sub hero-line mt-5 max-w-[34ch] text-white/75" style={{ "--i": 1 } as React.CSSProperties}>
            Discover exceptional corals, marine life and everything you need to build your own reef.
          </p>
          <div className="hero-line mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-4" style={{ "--i": 2 } as React.CSSProperties}>
            <Link href="/corals/sps" className="btn btn-primary">Explore the collection</Link>
            <More href="/new-arrivals" className="font-medium !text-white">See new arrivals</More>
          </div>
        </div>
      </section>

      {/* Corals */}
      <section className="bg-white py-20 lg:py-28">
        <div className="container-content reveal mb-12 text-center lg:mb-16">
          <h2 className="t-section">Nature&rsquo;s finest details.</h2>
          <p className="t-sub mx-auto mt-4 max-w-[36ch] text-ink-2">SPS, LPS and mushroom corals, each photographed in our shop.</p>
        </div>
        <div className="container-wide grid gap-3 md:grid-cols-3 md:gap-4">
          {(Object.keys(coralTypes) as CoralType[]).map((t, i) => {
            const n = specimens.filter((s) => s.type === t && s.status === "AVAILABLE").length;
            return (
              <Link
                key={t}
                href={`/corals/${t}`}
                style={stagger(i)}
                className="on-ocean reveal group relative flex aspect-[4/5] flex-col items-center overflow-hidden rounded-[28px] bg-[#06090b] pt-10 text-center text-white"
              >
                <div className="absolute inset-0">
                  <Photo
                    src={coralTiles[t].photo}
                    alt={`${coralTypes[t].label} coral from the shop`}
                    ratio="auto"
                    className="h-full"
                    sizes="(min-width: 768px) 33vw, 100vw"
                    imgClassName="group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-x-0 top-0 h-[62%] bg-gradient-to-b from-black/90 via-black/60 to-transparent" />
                </div>
                <div className="relative px-6">
                  <h3 className="t-tile">{coralTypes[t].label}</h3>
                  <p className="mt-2 text-[17px] text-white/80">{coralTiles[t].line}</p>
                  <p className="mt-4 inline-flex items-center gap-0.5 text-[17px] font-medium text-white group-hover:underline">
                    Shop {n} pieces <ChevronRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={2} />
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* One of a kind */}
      <div className="bg-mist">
        <Shelf title="One of a kind." tagline="The piece in the photo is the one you take home." action={<More href="/new-arrivals">View all new arrivals</More>}>
          {featured.map((s) => (
            <li key={s.code}>
              <SpecimenCard s={s} />
            </li>
          ))}
        </Shelf>
      </div>

      {/* Marine life */}
      <section className="bg-white py-20 lg:py-28">
        <div className="container-content reveal mb-12 text-center lg:mb-16">
          <h2 className="t-section">Bring your reef to life.</h2>
          <p className="t-sub mx-auto mt-4 max-w-[36ch] text-ink-2">Marine fish and invertebrates for every kind of reef.</p>
        </div>
        <div className="container-wide grid gap-3 md:grid-cols-2 md:gap-4">
          {[
            { title: "Marine fish", line: "Tangs, gobies, clownfish and more.", href: "/marine-life/fish", photo: "/photos/blue-tangs.jpg", pos: "50% 60%" },
            { title: "Invertebrates", line: "Hermit crabs, shrimp, snails and urchins.", href: "/marine-life/invertebrates", photo: "/photos/electric-blue-hermit-crabs.jpg", pos: "50% 65%" },
          ].map((t, i) => (
            <Link
              key={t.title}
              href={t.href}
              style={stagger(i)}
              className="on-ocean reveal group relative flex aspect-[4/5] flex-col items-center overflow-hidden rounded-[28px] bg-ocean-deep pt-10 text-center text-white md:aspect-[5/6]"
            >
              <div className="absolute inset-0">
                <Photo
                  src={t.photo}
                  alt={`${t.title} at Coral Fanatics`}
                  ratio="auto"
                  className="h-full"
                  sizes="(min-width: 768px) 50vw, 100vw"
                  position={t.pos}
                  imgClassName="group-hover:scale-[1.04]"
                />
                <div className="absolute inset-x-0 top-0 h-[55%] bg-gradient-to-b from-black/85 via-black/50 to-transparent" />
              </div>
              <div className="relative px-6">
                <h3 className="t-tile">{t.title}</h3>
                <p className="mt-2 text-[17px] text-white/80">{t.line}</p>
                <p className="mt-4 inline-flex items-center gap-0.5 text-[17px] font-medium text-white group-hover:underline">
                  Shop {t.title.toLowerCase()} <ChevronRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={2} />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Equipment: one featured product plus plain category links */}
      <section className="bg-mist py-20 lg:py-28">
        <div className="container-wide grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
          {skimmer && (
            <Link href={productHref(skimmer)} className="reveal group block overflow-hidden rounded-[28px] bg-white">
              <Photo
                src={skimmer.photo}
                alt={`${skimmer.brand} ${skimmer.name}`}
                tone="white"
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="!bg-white"
                imgClassName="!object-contain p-6 group-hover:scale-[1.03]"
              />
            </Link>
          )}
          <div className="reveal">
            <h2 className="t-section">Everything your reef needs.</h2>
            <p className="t-sub mt-4 max-w-[34ch] text-ink-2">Skimmers, lighting, pumps, salt, testing and additives.</p>
            <ul className="mt-10 border-t border-hairline">
              {[
                ["Filtration", "/equipment?sub=Filtration"],
                ["Lighting", "/equipment?sub=Lighting"],
                ["Pumps", "/equipment?sub=Pumps"],
                ["Salt & Testing", "/equipment?sub=Salt+%26+Testing"],
                ["Additives", "/additives"],
              ].map(([label, href]) => (
                <li key={label} className="border-b border-hairline">
                  <Link href={href!} className="group flex items-center justify-between py-4 text-[19px] font-medium tracking-[-0.015em]">
                    {label}
                    <ChevronRight className="size-5 text-ink-3 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-ink" strokeWidth={1.75} />
                  </Link>
                </li>
              ))}
            </ul>
            {skimmer && (
              <p className="mt-8 text-[15px] text-ink-2">
                Featured: <Link href={productHref(skimmer)} className="link">{skimmer.brand} {skimmer.name}, {formatPriceShort(skimmer.variants[0]!.priceCents)}</Link>
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Story + visit */}
      <section id="story" className="on-ocean scroll-mt-12 bg-ocean-deep py-24 text-white lg:py-36">
        <div className="container-content reveal text-center">
          <h2 className="t-section mx-auto max-w-[16ch]">Driven by a passion for the reef.</h2>
          <p className="t-sub mx-auto mt-6 max-w-[40ch] text-white/70">
            A specialist reef shop in Singapore, for hobbyists who care about every piece in their tank.
          </p>
          <More href="/our-story" className="mt-8">Our story</More>
        </div>
        <div id="visit" className="container-content mt-20 grid scroll-mt-20 gap-10 border-t border-white/10 pt-14 text-center md:grid-cols-3">
          {[
            ["Visit", store.address],
            ["Opening hours", store.hours],
            ["Contact", store.phone],
          ].map(([h, v], i) => (
            <div key={h} className="reveal" style={stagger(i)}>
              <p className="text-[17px] font-semibold">{h}</p>
              <p className="mt-1 text-[17px] text-white/60">{v}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Closing */}
      <section className="bg-white py-24 text-center lg:py-32">
        <div className="container-content reveal flex flex-col items-center">
          <Badge size={96} href={null} />
          <h2 className="t-section mt-8 max-w-[16ch]">Your next reef begins here.</h2>
          <p className="t-sub mt-4 text-ink-2">New corals and marine life arrive regularly.</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
            <Link href="/corals/sps" className="btn btn-primary">Explore the collection</Link>
            <More href="/#visit">Visit the shop</More>
          </div>
        </div>
      </section>
    </>
  );
}

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { PhotoPlaceholder } from "@/components/PhotoPlaceholder";
import { Photo } from "@/components/Photo";
import { ProductCard, Shelf, SpecimenCard } from "@/components/store/cards";
import { Badge } from "@/components/brand/Badge";
import { coralTypes, products, specimens, type CoralType } from "@/data/sample";
import { store } from "@/config/placeholders";

function More({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link href={href} className={`link text-[17px] ${className}`}>
      {children}
      <ChevronRight className="size-4" strokeWidth={2} aria-hidden />
    </Link>
  );
}

const coralPhotos: Record<CoralType, string> = {
  sps: "/photos/acropora-green-yellow-polyps.jpg",
  lps: "/photos/hammer-green.jpg",
  mushrooms: "/photos/ricordea-yuma-orange.jpg",
};

const coralLines: Record<CoralType, string> = {
  sps: "Colour and structure, piece by piece.",
  lps: "Fleshy, flowing, full of movement.",
  mushrooms: "Hardy, vivid and full of character.",
};

export default function HomePage() {
  const newest = specimens
    .filter((s) => s.status === "AVAILABLE")
    // Featured selection: photographed pieces first, then newest.
    .sort((a, b) => Number(!a.photo) - Number(!b.photo) || a.listedDaysAgo - b.listedDaysAgo)
    .slice(0, 8);
  const gear = products.filter((p) => !p.isLivestock);

  return (
    <>
      {/* Hero */}
      <section className="on-ocean relative isolate flex h-[100svh] max-h-[960px] min-h-[640px] flex-col bg-ocean-deep text-white">
        {/* Photo sits below the headline and fades up into the water, so text never sits on bright coral */}
        <div className="absolute inset-x-0 top-[58%] bottom-0 -z-10 lg:top-[46%]">
          <Photo
            src="/photos/acropora-lime.jpg"
            alt="Lime Acropora photographed in the Coral Fanatics shop"
            ratio="auto"
            className="h-full !bg-ocean-deep"
            sizes="100vw"
            priority
            position="50% 35%"
          />
          <div className="absolute inset-x-0 top-0 h-[45%] bg-gradient-to-b from-ocean-deep to-transparent" />
        </div>
        <div className="container-content flex flex-col items-center pt-32 text-center lg:pt-40">
          <h1 className="t-hero max-w-[14ch]">A world beneath the surface.</h1>
          <p className="t-sub mt-5 max-w-[34ch] text-white/75">
            Discover exceptional corals, marine life and everything you need to build your own reef.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
            <Link href="/corals/sps" className="btn btn-primary">Explore the collection</Link>
            <More href="/new-arrivals" className="!text-white font-medium">See new arrivals</More>
          </div>
        </div>
      </section>

      {/* Corals */}
      <section className="bg-white py-20 lg:py-28">
        <div className="container-content reveal mb-12 text-center lg:mb-16">
          <h2 className="t-section">Nature&rsquo;s finest details.</h2>
          <p className="t-sub mx-auto mt-4 max-w-[38ch] text-ink-2">
            Every coral is photographed in our shop and sold as the exact piece you see.
          </p>
        </div>
        <div className="container-wide grid gap-3 md:grid-cols-3 md:gap-4">
          {(Object.keys(coralTypes) as CoralType[]).map((t) => {
            const n = specimens.filter((s) => s.type === t && s.status === "AVAILABLE").length;
            return (
              <Link key={t} href={`/corals/${t}`} className="on-ocean group relative flex aspect-[4/5] flex-col items-center overflow-hidden rounded-[28px] bg-[#06090b] pt-10 text-center text-white">
                <div className="absolute inset-0">
                  <Photo
                    src={coralPhotos[t]}
                    alt={`${coralTypes[t].label} coral from the shop`}
                    ratio="auto"
                    className="h-full"
                    sizes="(min-width: 768px) 33vw, 100vw"
                    imgClassName="transition-transform duration-700 ease-[var(--ease-reef-slow)] group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-x-0 top-0 h-[62%] bg-gradient-to-b from-black/90 via-black/60 to-transparent" />
                </div>
                <div className="relative px-6">
                  <h3 className="t-tile">{coralTypes[t].label}</h3>
                  <p className="mt-2 text-[17px] text-white/70">{coralLines[t]}</p>
                  <p className="mt-4 inline-flex items-center gap-0.5 text-[17px] font-medium text-white group-hover:underline">
                    Shop {n} pieces <ChevronRight className="size-4" strokeWidth={2} />
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* One of a kind */}
      <div className="bg-mist">
        <Shelf title="One of a kind." tagline="The newest pieces, each one unique." action={<More href="/new-arrivals">View all new arrivals</More>}>
          {newest.map((s) => (
            <li key={s.code}><SpecimenCard s={s} /></li>
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
          ].map((t) => (
            <Link
              key={t.title}
              href={t.href}
              className="on-ocean group relative flex aspect-[4/5] flex-col items-center overflow-hidden rounded-[28px] bg-ocean-deep pt-10 text-center text-white md:aspect-[5/6]"
            >
              <div className="absolute inset-0">
                <Photo
                  src={t.photo}
                  alt={`${t.title} at Coral Fanatics`}
                  ratio="auto"
                  className="h-full"
                  sizes="(min-width: 768px) 50vw, 100vw"
                  position={t.pos}
                  imgClassName="transition-transform duration-700 ease-[var(--ease-reef-slow)] group-hover:scale-[1.03]"
                />
                <div className="absolute inset-x-0 top-0 h-[55%] bg-gradient-to-b from-black/85 via-black/50 to-transparent" />
              </div>
              <div className="relative px-6">
                <h3 className="t-tile">{t.title}</h3>
                <p className="mt-2 text-[17px] text-white/80">{t.line}</p>
                <p className="mt-4 inline-flex items-center gap-0.5 text-[17px] font-medium text-white group-hover:underline">
                  Shop {t.title.toLowerCase()} <ChevronRight className="size-4" strokeWidth={2} />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Equipment */}
      <div className="bg-mist">
        <Shelf title="Everything your reef needs." tagline="Lighting, salt, testing and care." action={<More href="/equipment">Shop equipment</More>}>
          {gear.map((p) => (
            <li key={p.slug}><ProductCard p={p} /></li>
          ))}
        </Shelf>
      </div>

      {/* Story + visit */}
      <section id="story" className="on-ocean scroll-mt-12 bg-ocean-deep py-24 text-white lg:py-36">
        <div className="container-content reveal text-center">
          <h2 className="t-section mx-auto max-w-[16ch]">Driven by a passion for the reef.</h2>
          <p className="t-sub mx-auto mt-6 max-w-[40ch] text-white/70">
            A specialist reef shop in Singapore, for hobbyists who care about every piece in their tank.
          </p>
          <p className="mt-3 text-[13px] text-white/40">Draft copy. The full story will be written with the owner.</p>
          <More href="/our-story" className="mt-8">Our story</More>
        </div>
        <div className="container-wide mt-16 lg:mt-20">
          <PhotoPlaceholder tone="dark" ratio="21 / 9" rounded className="max-md:[aspect-ratio:4/3]" label="Shop interior and team, natural light" />
        </div>
        <div id="visit" className="container-content mt-16 grid scroll-mt-20 gap-10 text-center md:grid-cols-3">
          {[
            ["Visit", store.address],
            ["Opening hours", store.hours],
            ["Contact", store.phone],
          ].map(([h, v]) => (
            <div key={h}>
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

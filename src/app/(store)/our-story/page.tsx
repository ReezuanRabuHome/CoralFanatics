import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Photo } from "@/components/Photo";
import { store } from "@/config/placeholders";

export const metadata: Metadata = { title: "Our story" };

export default function OurStoryPage() {
  return (
    <>
      <section data-dark-hero className="on-ocean bg-ocean-deep pt-32 pb-20 text-center text-white lg:pt-40 lg:pb-28">
        <div className="container-content">
          <h1 className="t-hero hero-line mx-auto max-w-[14ch]">Driven by a passion for the reef.</h1>
          <p className="t-sub hero-line mx-auto mt-6 max-w-[40ch] text-white/70" style={{ "--i": 1 } as React.CSSProperties}>
            A specialist reef shop in Singapore, for hobbyists who care about every piece in their tank.
          </p>
        </div>
      </section>
      <section className="bg-white py-20 lg:py-28">
        <div className="container-wide grid gap-3 md:grid-cols-3 md:gap-4">
          {[
            ["/photos/hammer-green.jpg", "Hammer coral"],
            ["/photos/blue-tangs.jpg", "Regal blue tangs"],
            ["/photos/ricordea-yuma-orange.jpg", "Ricordea yuma"],
          ].map(([src, alt]) => (
            <div key={src} className="reveal overflow-hidden rounded-[28px]">
              <Photo src={src} alt={`${alt} at Coral Fanatics`} ratio="4 / 5" sizes="(min-width: 768px) 33vw, 100vw" />
            </div>
          ))}
        </div>
        <div className="container-content reveal mt-16 max-w-[680px] space-y-5 text-[19px] leading-relaxed">
          <p>Every coral in our shop is photographed as it is and sold as that exact piece, so what you see is what you take home.</p>
          <p className="text-ink-2">The full story of Coral Fanatics, how it started and who&rsquo;s behind it, is being written with the owner and will appear here.</p>
        </div>
      </section>
      <section className="bg-mist py-20 text-center">
        <div className="container-content reveal">
          <h2 className="t-title">Visit the shop.</h2>
          <p className="t-sub mt-3 text-ink-2">{store.address} · {store.hours}</p>
          <Link href="/new-arrivals" className="link mt-6 text-[17px]">See what&rsquo;s new <ChevronRight className="size-4" strokeWidth={2} /></Link>
        </div>
      </section>
    </>
  );
}

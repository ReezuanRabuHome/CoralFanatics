"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Horizontal shelf of cards with a two-tone heading.
 * Touch: native swipe with snap. Desktop: arrow buttons (a mouse can't easily
 * scroll sideways), disabled at either end.
 */
export function Shelf({ title, tagline, children, action }: { title: string; tagline?: string; children: React.ReactNode; action?: React.ReactNode }) {
  const track = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    update();
    const el = track.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const page = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  const arrow = "grid size-9 place-items-center rounded-full bg-mist-2/80 text-ink transition-opacity hover:bg-hairline disabled:cursor-default disabled:opacity-30";

  return (
    <section className="py-14 lg:py-20">
      <div className="container-wide mb-6 flex items-end justify-between gap-6">
        <h2 className="t-title reveal max-w-3xl">
          {title}
          {tagline && <span className="text-ink-2"> {tagline}</span>}
        </h2>
        {action && <div className="hidden shrink-0 pb-1 md:block">{action}</div>}
      </div>
      <ul
        ref={track}
        className="no-scrollbar container-wide flex snap-x snap-mandatory scroll-px-5 gap-5 overflow-x-auto scroll-smooth pb-8 md:scroll-px-8 lg:scroll-px-12 [&>li]:w-[72%] [&>li]:shrink-0 [&>li]:snap-start [&>li>a]:h-full sm:[&>li]:w-[40%] lg:[&>li]:w-[23.5%]"
      >
        {children}
      </ul>
      <div className="container-wide flex items-center justify-between">
        <div>{action && <div className="md:hidden">{action}</div>}</div>
        <div className="hidden gap-3 md:flex">
          <button type="button" className={arrow} onClick={() => page(-1)} disabled={atStart} aria-label="Scroll back">
            <ChevronLeft className="size-4" strokeWidth={2} />
          </button>
          <button type="button" className={arrow} onClick={() => page(1)} disabled={atEnd} aria-label="Scroll forward">
            <ChevronRight className="size-4" strokeWidth={2} />
          </button>
        </div>
      </div>
    </section>
  );
}

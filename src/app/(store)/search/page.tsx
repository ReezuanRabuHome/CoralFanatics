"use client";

/**
 * Search (prototype: in-memory over sample data). Production uses PostgreSQL
 * full-text + trigram search (Deliverable 4 §7). Matches common names,
 * scientific names, brands and specimen IDs (typing "0146" finds CF-SPS-0146).
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { products, specimens } from "@/data/sample";
import { ProductCard, SpecimenCard } from "@/components/store/cards";

const suggestions = ["Acropora", "Hammer", "Tang", "Hermit crab", "Skimmer", "Ricordea"];

export default function SearchPage() {
  const [q, setQ] = useState("");
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get("q");
    if (initial) setQ(initial);
    input.current?.focus();
  }, []);

  useEffect(() => {
    const url = q ? `/search?q=${encodeURIComponent(q)}` : "/search";
    window.history.replaceState(null, "", url);
  }, [q]);

  const term = q.trim().toLowerCase();
  const results = useMemo(() => {
    if (term.length < 2) return { corals: [], other: [] };
    const words = term.split(/\s+/);
    const hit = (text: string) => words.every((w) => text.toLowerCase().includes(w));
    return {
      corals: specimens.filter((s) => s.status !== "UNAVAILABLE" && s.status !== "DRAFT" && hit(`${s.species} ${s.scientificName} ${s.code} ${s.subType} ${s.colours.join(" ")}`)),
      other: products.filter((p) => hit(`${p.name} ${p.scientificName ?? ""} ${p.brand ?? ""} ${p.subCategory}`)),
    };
  }, [term]);
  const total = results.corals.length + results.other.length;

  return (
    <div className="bg-mist">
      <div className="container-wide min-h-[80vh] pt-24 pb-24 lg:pt-28">
        <label className="relative mx-auto block max-w-[720px]">
          <span className="sr-only">Search the shop</span>
          <Search className="pointer-events-none absolute top-1/2 left-5 size-5 -translate-y-1/2 text-ink-2" strokeWidth={1.75} />
          <input
            ref={input}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search corals, fish, equipment or a specimen ID"
            className="h-16 w-full rounded-2xl bg-white pr-14 pl-14 text-[19px] shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_30px_rgb(0_0_0/0.06)] outline-none placeholder:text-ink-3 focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-reef)_18%,transparent)]"
          />
          {q && (
            <button onClick={() => { setQ(""); input.current?.focus(); }} className="absolute top-1/2 right-4 grid size-8 -translate-y-1/2 place-items-center rounded-full bg-mist" aria-label="Clear search">
              <X className="size-4" />
            </button>
          )}
        </label>

        {term.length < 2 ? (
          <div className="mx-auto mt-10 max-w-[720px]">
            <p className="text-[13px] text-ink-2">Popular searches</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {suggestions.map((sug) => (
                <button key={sug} onClick={() => setQ(sug)} className="h-9 rounded-full bg-white px-4 text-[14px] shadow-[0_1px_2px_rgb(0_0_0/0.06)] hover:bg-mist-2">{sug}</button>
              ))}
            </div>
          </div>
        ) : total === 0 ? (
          <div className="py-24 text-center">
            <p className="t-h3">No results for &ldquo;{q}&rdquo;.</p>
            <p className="mt-2 text-ink-2">Try a common name like &ldquo;hammer&rdquo; or a specimen ID like &ldquo;0146&rdquo;.</p>
          </div>
        ) : (
          <div className="mt-12" aria-live="polite">
            <p className="t-small mb-6 text-ink-2">{total} result{total === 1 ? "" : "s"}</p>
            {results.corals.length > 0 && (
              <section className="mb-14">
                <h2 className="t-h3 mb-5">Corals</h2>
                <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 xl:grid-cols-4">
                  {results.corals.map((s) => <li key={s.code}><SpecimenCard s={s} className="h-full" /></li>)}
                </ul>
              </section>
            )}
            {results.other.length > 0 && (
              <section>
                <h2 className="t-h3 mb-5">Marine life and equipment</h2>
                <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 xl:grid-cols-4">
                  {results.other.map((p) => <li key={p.slug}><ProductCard p={p} className="h-full" /></li>)}
                </ul>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/brand/Badge";
import { useBag } from "@/components/store/bag";
import { store } from "@/config/placeholders";

export const navItems = [
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "Corals", href: "/corals/sps" },
  { label: "Marine Life", href: "/marine-life/fish" },
  { label: "Equipment", href: "/equipment" },
  { label: "Our Story", href: "/#story" },
];

/** Thin, translucent global navigation. Dark over the homepage hero, light elsewhere. */
export function Header() {
  const pathname = usePathname();
  // Dark bar only while a dark hero (marked data-dark-hero) sits behind it.
  // The homepage starts dark to avoid a flash before the first measurement.
  const [dark, setDark] = useState(pathname === "/");
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const on = () => {
      const hero = document.querySelector("[data-dark-hero]");
      setDark(!!hero && hero.getBoundingClientRect().bottom > 48);
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, [pathname]);
  const { count, setOpen, addedTick } = useBag();
  useEffect(() => setMenuOpen(false), [pathname]);

  const bar = dark && !menuOpen ? "bg-ocean-deep/80 text-white/90" : "bg-white/80 text-ink/85";

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 backdrop-blur-xl backdrop-saturate-150 transition-colors duration-300 ${bar}`}>
        <div className="container-wide flex h-12 items-center justify-between">
          <Link href="/" aria-label="Coral Fanatics home" className="shrink-0"><Badge size={34} href={null} priority /></Link>
          <nav aria-label="Main" className="hidden items-center gap-9 md:flex">
            {navItems.map((n) => (
              <Link key={n.href} href={n.href} className="text-[13px] tracking-[-0.01em] opacity-90 transition-opacity hover:opacity-100">
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-1">
            <Link href="/search" aria-label="Search" className="grid size-9 place-items-center opacity-90 hover:opacity-100">
              <Search className="size-[17px]" strokeWidth={1.6} />
            </Link>
            <button onClick={() => setOpen(true)} aria-label={`Bag, ${count} items`} className="relative grid size-9 place-items-center opacity-90 hover:opacity-100">
              <ShoppingBag className="size-[17px]" strokeWidth={1.6} />
              {count > 0 && (
                <span key={addedTick} className={`tabular absolute right-0.5 bottom-1 grid size-[15px] place-items-center rounded-full bg-current text-[9px] font-semibold ${addedTick ? "bump" : ""}`}>
                  <span className={dark && !menuOpen ? "text-ocean-deep" : "text-white"}>{count}</span>
                </span>
              )}
            </button>
            <button className="relative grid size-9 place-items-center md:hidden" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen((v) => !v)}>
              <span className={`absolute h-px w-[17px] bg-current transition-transform duration-300 ${menuOpen ? "rotate-45" : "-translate-y-[4px]"}`} />
              <span className={`absolute h-px w-[17px] bg-current transition-transform duration-300 ${menuOpen ? "-rotate-45" : "translate-y-[4px]"}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu: full-screen, large type */}
      <div className={`fixed inset-0 top-12 z-40 bg-white transition-[opacity,visibility] duration-300 md:hidden ${menuOpen ? "visible opacity-100" : "invisible opacity-0"}`}>
        {/* Remounts on open so the items arrive in sequence */}
        <nav key={String(menuOpen)} aria-label="Mobile" className="container-wide flex flex-col pt-6">
          {navItems.map((n, i) => (
            <Link key={n.href} href={n.href} onClick={() => setMenuOpen(false)} className="hero-line py-2.5 text-[28px] font-semibold tracking-[-0.02em]" style={{ "--i": i * 0.5 - 1.2 } as React.CSSProperties}>
              {n.label}
            </Link>
          ))}
          <div className="hero-line mt-8 flex flex-col gap-3 text-[17px]" style={{ "--i": 1.5 } as React.CSSProperties}>
            <Link href="/search" onClick={() => setMenuOpen(false)} className="text-ink-2">Search</Link>
            <Link href="/order-lookup" onClick={() => setMenuOpen(false)} className="text-ink-2">Check an order</Link>
          </div>
          <div className="t-small hero-line mt-10 space-y-1 text-ink-2" style={{ "--i": 2 } as React.CSSProperties}>
            <p className="font-medium text-ink">Visit the shop</p>
            <p>{store.address}</p>
            <p>{store.hours}</p>
          </div>
        </nav>
      </div>
    </>
  );
}

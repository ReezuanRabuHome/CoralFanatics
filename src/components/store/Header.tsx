"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Search, User, ShoppingBag, X } from "lucide-react";
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

export function Header() {
  const pathname = usePathname();
  const overHero = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { count, setOpen } = useBag();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 80);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => setMenuOpen(false), [pathname]);

  const transparent = overHero && !scrolled && !menuOpen;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-250 ${
          transparent
            ? "bg-gradient-to-b from-ocean-900/40 to-transparent text-pearl-50"
            : "border-b border-pearl-300 bg-pearl-100/92 text-ink-900 backdrop-blur-md"
        }`}
      >
        <div className="container-wide flex h-14 items-center gap-4 lg:h-[72px]">
          <button className="-ml-2 grid size-10 place-items-center lg:hidden" aria-label="Open menu" onClick={() => setMenuOpen((v) => !v)}>
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
          <div className="flex flex-1 justify-center lg:flex-none lg:justify-start">
            <span className="lg:hidden"><Badge size={40} priority /></span>
            <span className="hidden lg:inline"><Badge size={52} priority /></span>
          </div>
          <nav aria-label="Main" className="hidden flex-1 justify-center gap-8 lg:flex">
            {navItems.map((n) => (
              <Link key={n.href} href={n.href} className="text-[15px] font-medium underline-offset-[6px] hover:underline">
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="-mr-2 flex items-center">
            <Link href="/search" aria-label="Search" className="grid size-10 place-items-center rounded-full hover:bg-current/10">
              <Search className="size-5" strokeWidth={1.75} />
            </Link>
            <Link href="/order-lookup" aria-label="Order lookup" className="hidden size-10 place-items-center rounded-full hover:bg-current/10 sm:grid">
              <User className="size-5" strokeWidth={1.75} />
            </Link>
            <button onClick={() => setOpen(true)} aria-label={`Bag, ${count} items`} className="relative grid size-10 place-items-center rounded-full hover:bg-current/10">
              <ShoppingBag className="size-5" strokeWidth={1.75} />
              {count > 0 && (
                <span className="tabular absolute top-0.5 right-0.5 grid min-w-[18px] place-items-center rounded-full bg-orange-500 px-1 text-[11px] leading-[18px] font-semibold text-ocean-950">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu sheet */}
      <div className={`fixed inset-x-0 top-14 bottom-0 z-40 overflow-y-auto bg-pearl-100 transition-opacity duration-250 lg:hidden ${menuOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}>
        <nav aria-label="Mobile" className="container-wide flex flex-col py-4">
          {navItems.map((n) => (
            <Link key={n.href} href={n.href} className="t-h2 border-b border-pearl-300 py-4">
              {n.label}
            </Link>
          ))}
          <Link href="/order-lookup" className="border-b border-pearl-300 py-4 text-lg">Order lookup</Link>
          <div className="mt-8 space-y-1 text-sm text-ink-600">
            <p className="t-eyebrow mb-2 text-ink-900">Visit the shop</p>
            <p>{store.address}</p>
            <p>{store.hours}</p>
          </div>
        </nav>
      </div>
    </>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, BarChart3, Boxes, Diamond, LayoutDashboard, MoreHorizontal, Package, Plus, Receipt, Search, Settings, Users } from "lucide-react";

const nav = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Orders", href: "/admin/orders/CF-10042", icon: Receipt, badge: 3 },
  { label: "Livestock", href: "/admin/livestock", icon: Diamond },
  { label: "Products", href: "/admin#products", icon: Package },
  { label: "Inventory", href: "/admin#inventory", icon: Boxes },
  { label: "Customers", href: "/admin#customers", icon: Users },
  { label: "Reports", href: "/admin#reports", icon: BarChart3 },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const isActive = (href: string) => {
    if (href.includes("#")) return false; // sections not built in the prototype
    if (href === "/admin") return path === "/admin";
    const section = href.split("/").slice(0, 3).join("/"); // e.g. /admin/orders
    return path === section || path.startsWith(section + "/");
  };

  return (
    <div className="min-h-dvh bg-pearl-100 text-[14px]">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-pearl-300 bg-pearl-50 lg:flex">
        <div className="flex h-16 items-center gap-3 border-b border-pearl-300 px-5">
          <Image src="/brand/mark.png" alt="" width={36} height={21} className="h-auto w-9" />
          <div className="leading-tight">
            <p className="font-display text-[15px] font-semibold">Coral Fanatics</p>
            <p className="text-xs text-ink-600">Admin</p>
          </div>
        </div>
        <nav className="flex-1 space-y-0.5 p-3" aria-label="Admin">
          {nav.map((n) => (
            <Link
              key={n.label}
              href={n.href}
              aria-current={isActive(n.href) ? "page" : undefined}
              className={`flex h-9 items-center gap-3 rounded-md px-3 font-medium ${isActive(n.href) ? "bg-ocean-900 text-pearl-50" : "text-ink-900 hover:bg-pearl-100"}`}
            >
              <n.icon className="size-4" strokeWidth={1.75} />
              <span className="flex-1">{n.label}</span>
              {n.badge && <span className="tabular rounded-full bg-orange-500 px-1.5 text-[11px] font-semibold text-ocean-950">{n.badge}</span>}
            </Link>
          ))}
          <div className="my-3 border-t border-pearl-300" />
          <Link href="/admin#settings" className="flex h-9 items-center gap-3 rounded-md px-3 font-medium hover:bg-pearl-100"><Settings className="size-4" strokeWidth={1.75} />Settings</Link>
          <Link href="/" className="flex h-9 items-center gap-3 rounded-md px-3 font-medium hover:bg-pearl-100"><ArrowUpRight className="size-4" strokeWidth={1.75} />View store</Link>
        </nav>
        <div className="border-t border-pearl-300 p-4 text-xs text-ink-600">Signed in as <span className="font-semibold text-ink-900">Owner (sample)</span></div>
      </aside>

      {/* Top bar */}
      <div className="lg:pl-60">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-pearl-300 bg-pearl-50/95 px-4 backdrop-blur lg:h-16 lg:px-8">
          <Image src="/brand/mark.png" alt="Coral Fanatics" width={32} height={19} className="h-auto w-8 lg:hidden" />
          <label className="relative max-w-md flex-1">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-600" />
            <input className="h-9 w-full rounded-md border border-pearl-300 bg-pearl-100 pr-3 pl-9 text-sm placeholder:text-ink-600" placeholder="Search orders, specimen ID, products…" />
          </label>
          <Link href="/admin/livestock#new" className="ml-auto inline-flex h-9 items-center gap-1.5 rounded-md bg-ocean-900 px-3 text-sm font-semibold text-pearl-50 hover:bg-ocean-700">
            <Plus className="size-4" /> <span className="hidden sm:inline">New specimen</span>
          </Link>
        </header>
        <main className="px-4 py-6 pb-24 lg:px-8 lg:py-8">{children}</main>
      </div>

      {/* Mobile bottom tabs */}
      <nav aria-label="Admin mobile" className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-pearl-300 bg-pearl-50 lg:hidden">
        {[nav[0]!, nav[1]!, nav[2]!].map((n) => (
          <Link key={n.label} href={n.href} className={`flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium ${isActive(n.href) ? "text-ink-900" : "text-ink-600"}`}>
            <n.icon className="size-5" strokeWidth={1.75} />{n.label}
          </Link>
        ))}
        <Link href="/admin/livestock#new" className="flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium text-ink-600">
          <span className="grid size-8 place-items-center rounded-full bg-ocean-900 text-pearl-50"><Plus className="size-4" /></span>
        </Link>
        <button className="flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium text-ink-600"><MoreHorizontal className="size-5" />More</button>
      </nav>
    </div>
  );
}

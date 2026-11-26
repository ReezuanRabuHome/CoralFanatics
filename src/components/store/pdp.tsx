"use client";

import { useState } from "react";
import { Check, ChevronDown, Copy } from "lucide-react";
import { PhotoPlaceholder } from "@/components/PhotoPlaceholder";

export function Gallery({ labels, tone, chip }: { labels: string[]; tone: "specimen" | "dark" | "light"; chip?: string }) {
  const [i, setI] = useState(0);
  return (
    <div className="lg:sticky lg:top-24">
      <div className={`relative overflow-hidden rounded-xl ${tone === "specimen" ? "bg-ocean-950 p-3 lg:p-5" : ""}`}>
        <PhotoPlaceholder label={labels[i] ?? ""} tone={tone} />
        {chip && (
          <span className="absolute top-5 left-5 rounded-full bg-pearl-50/95 px-3 py-1 text-xs font-semibold text-ink-900 lg:top-8 lg:left-8">{chip}</span>
        )}
      </div>
      <div className="mt-3 grid grid-cols-5 gap-2" role="tablist" aria-label="Product images">
        {labels.map((l, n) => (
          <button
            key={l}
            role="tab"
            aria-selected={n === i}
            aria-label={`Image ${n + 1}: ${l}`}
            onClick={() => setI(n)}
            className={`overflow-hidden rounded-lg ring-offset-2 ring-offset-pearl-100 ${n === i ? "ring-2 ring-ink-900" : "opacity-70 hover:opacity-100"}`}
          >
            <PhotoPlaceholder label={l} tone={tone} compact />
          </button>
        ))}
      </div>
    </div>
  );
}

export function CopyId({ id }: { id: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 hover:bg-pearl-200"
      onClick={() => {
        navigator.clipboard?.writeText(id).catch(() => {});
        setOk(true);
        setTimeout(() => setOk(false), 1500);
      }}
      aria-label={`Copy specimen ID ${id}`}
    >
      <span className="t-id text-ink-900">{id}</span>
      {ok ? <Check className="size-3.5 text-green-600" /> : <Copy className="size-3.5 text-ink-600" />}
    </button>
  );
}

/** Tabs on desktop, accordions on mobile (Deliverable 5). */
export function DetailTabs({ tabs }: { tabs: { id: string; label: string; content: React.ReactNode }[] }) {
  const [active, setActive] = useState(tabs[0]?.id);
  return (
    <>
      <div className="hidden lg:block">
        <div role="tablist" className="flex gap-8 border-b border-pearl-300">
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={active === t.id}
              onClick={() => setActive(t.id)}
              className={`-mb-px border-b-2 pb-4 text-[15px] font-semibold ${active === t.id ? "border-ink-900" : "border-transparent text-ink-600 hover:text-ink-900"}`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div role="tabpanel" className="max-w-[68ch] py-8 text-[16px] leading-relaxed">
          {tabs.find((t) => t.id === active)?.content}
        </div>
      </div>
      <div className="divide-y divide-pearl-300 border-y border-pearl-300 lg:hidden">
        {tabs.map((t, n) => (
          <details key={t.id} open={n === 0} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between py-4 font-semibold">
              {t.label}
              <ChevronDown className="size-4 transition-transform group-open:rotate-180" />
            </summary>
            <div className="pb-6 leading-relaxed">{t.content}</div>
          </details>
        ))}
      </div>
    </>
  );
}

"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { PhotoPlaceholder } from "@/components/PhotoPlaceholder";

/** Large single image with quiet dot pagination. */
export function Gallery({ labels, tone, note }: { labels: string[]; tone: "specimen" | "light" | "white"; note?: string }) {
  const [i, setI] = useState(0);
  return (
    <div className="lg:sticky lg:top-20">
      <div className="relative overflow-hidden rounded-[28px]">
        <PhotoPlaceholder label={labels[i] ?? ""} tone={tone} className={tone === "white" ? "!bg-mist" : ""} />
        {note && <p className={`absolute top-5 right-6 text-[12px] ${tone === "specimen" ? "text-white/60" : "text-ink-2"}`}>{note}</p>}
      </div>
      {labels.length > 1 && (
        <div className="mt-5 flex justify-center gap-2.5" role="tablist" aria-label="Images">
          {labels.map((l, n) => (
            <button
              key={l}
              role="tab"
              aria-selected={n === i}
              aria-label={`Image ${n + 1} of ${labels.length}`}
              onClick={() => setI(n)}
              className={`size-2 rounded-full transition-colors ${n === i ? "bg-ink" : "bg-ink/20 hover:bg-ink/40"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function CopyId({ id }: { id: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      className="t-id inline-flex items-center gap-1.5 text-ink-2 hover:text-ink"
      onClick={() => {
        navigator.clipboard?.writeText(id).catch(() => {});
        setOk(true);
        setTimeout(() => setOk(false), 1500);
      }}
      aria-label={`Copy specimen ID ${id}`}
    >
      Specimen {id}
      {ok ? <Check className="size-3.5 text-green-600" /> : <Copy className="size-3.5" />}
    </button>
  );
}

/** Editorial detail sections: heading left, content right, hairline between. */
export function DetailTabs({ tabs }: { tabs: { id: string; label: string; content: React.ReactNode }[] }) {
  return (
    <div className="divide-y divide-hairline border-y border-hairline">
      {tabs.map((t) => (
        <section key={t.id} className="grid gap-4 py-10 md:grid-cols-[1fr_2fr] md:gap-12 lg:py-14">
          <h2 className="t-h3 md:text-[24px]">{t.label}</h2>
          <div className="max-w-[60ch] text-[17px] leading-relaxed text-ink">{t.content}</div>
        </section>
      ))}
    </div>
  );
}

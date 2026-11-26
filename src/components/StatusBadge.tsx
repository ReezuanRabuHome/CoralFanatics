import type { SpecimenStatus } from "@/data/sample";

type Tone = "success" | "warning" | "danger" | "info" | "neutral";

const toneClass: Record<Tone, string> = {
  success: "bg-green-100 text-green-600",
  warning: "bg-amber-100 text-amber-600",
  danger: "bg-red-100 text-red-600",
  info: "bg-blue-100 text-blue-600",
  neutral: "bg-pearl-200 text-ink-600",
};

/** Status is never conveyed by colour alone: always text + shape-coded dot. */
const shapeClass: Record<Tone, string> = {
  success: "rounded-full bg-current", // ● filled circle
  warning: "rounded-full border border-current bg-[linear-gradient(90deg,currentColor_50%,transparent_50%)]", // ◐ half
  danger: "rounded-[1px] bg-current", // ■ square
  info: "rotate-45 rounded-[1px] bg-current", // ◆ diamond
  neutral: "rounded-full border border-current", // ○ hollow
};

export function Pill({ tone, children, className = "" }: { tone: Tone; children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium whitespace-nowrap ${toneClass[tone]} ${className}`}>
      <span aria-hidden className={`size-2 ${shapeClass[tone]}`} />
      {children}
    </span>
  );
}

export const specimenStatusMeta: Record<SpecimenStatus, { tone: Tone; store: string; admin: string }> = {
  AVAILABLE: { tone: "success", store: "Available", admin: "Available" },
  RESERVED: { tone: "warning", store: "In someone's checkout", admin: "Reserved" },
  SOLD: { tone: "danger", store: "Sold", admin: "Sold" },
  UNAVAILABLE: { tone: "neutral", store: "Unavailable", admin: "Unavailable" },
  DRAFT: { tone: "neutral", store: "Draft", admin: "Draft" },
};

export function SpecimenStatusPill({ status, variant = "store" }: { status: SpecimenStatus; variant?: "store" | "admin" }) {
  const m = specimenStatusMeta[status];
  return <Pill tone={m.tone}>{variant === "store" ? m.store : m.admin}</Pill>;
}

export function StockPill({ stock, low }: { stock: number; low: number }) {
  if (stock <= 0) return <Pill tone="danger">Sold out</Pill>;
  if (stock <= low) return <Pill tone="warning">Only {stock} left</Pill>;
  return <Pill tone="success">In stock</Pill>;
}

export function OneOfAKind({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold text-gold-700 ${className}`}>
      <span aria-hidden className="size-2 rotate-45 border border-current" />
      One of a kind
    </span>
  );
}

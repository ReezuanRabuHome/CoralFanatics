import { Camera } from "lucide-react";

/**
 * Clearly identified placeholder for a missing real photograph
 * (photography-spec.md §8, placeholders.md Q1). Never replace with stock/AI imagery.
 */
export function PhotoPlaceholder({
  label,
  tone = "light",
  ratio = "1 / 1",
  className = "",
  compact = false,
  rounded = true,
  labelAt = "center",
}: {
  label: string;
  tone?: "light" | "dark" | "specimen";
  ratio?: string;
  className?: string;
  compact?: boolean;
  rounded?: boolean;
  /** "top" keeps the label clear of overlaid text (e.g. hero headline). */
  labelAt?: "center" | "top";
}) {
  const tones = {
    light: "bg-pearl-200 text-ink-600 border-ink-400/30",
    dark: "bg-ocean-800 text-ocean-300 border-ocean-600/60",
    specimen: "bg-ocean-950 text-ocean-300 border-ocean-700",
  } as const;
  return (
    <div
      role="img"
      aria-label={`Photo placeholder: ${label}`}
      className={`relative flex w-full justify-center overflow-hidden ${labelAt === "top" ? "items-start justify-end! pt-[72px] pr-6 lg:pt-28 lg:pr-14" : "items-center"} ${rounded ? "rounded-xl" : ""} ${tones[tone]} ${className}`}
      style={{ aspectRatio: ratio }}
    >
      <div className={`absolute inset-2 border border-dashed ${rounded ? "rounded-lg" : ""} ${tones[tone]} bg-transparent`} />
      <div className={`relative flex flex-col gap-2 ${labelAt === "top" ? "max-w-[55%] items-end text-right" : "max-w-[80%] items-center text-center"}`}>
        <Camera className={compact ? "size-4" : "size-5"} strokeWidth={1.5} aria-hidden />
        {!compact && <span className="t-eyebrow text-[10px]">Photo placeholder</span>}
        {!compact && <span className="text-xs leading-snug opacity-80">{label}</span>}
      </div>
    </div>
  );
}

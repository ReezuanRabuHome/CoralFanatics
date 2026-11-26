/**
 * Placeholder for a missing real photograph (photography-spec.md §8).
 * Deliberately quiet: a flat tone plus one small "Photo" label so the layout
 * reads as it will with real imagery. The full shot description is kept in
 * aria-label/title (and in the photography spec) rather than printed on screen.
 * Never replace with stock or AI imagery.
 */
export function PhotoPlaceholder({
  label,
  tone = "light",
  ratio = "1 / 1",
  className = "",
  compact = false,
  rounded = false,
  labelAt = "corner",
}: {
  label: string;
  tone?: "light" | "dark" | "specimen" | "white";
  ratio?: string;
  className?: string;
  compact?: boolean;
  rounded?: boolean;
  labelAt?: "corner" | "top" | "center";
}) {
  const tones = {
    light: "bg-mist text-ink-3",
    white: "bg-white text-ink-3",
    dark: "bg-ocean-2 text-on-ocean-2/70",
    specimen: "bg-[#06090b] text-white/35",
  } as const;
  const pos = {
    corner: "items-end justify-start p-4",
    top: "items-start justify-end p-5 lg:p-6",
    center: "items-center justify-center",
  } as const;
  return (
    <div
      role="img"
      aria-label={`Photo placeholder: ${label}`}
      title={`Photo placeholder: ${label}`}
      className={`flex w-full overflow-hidden ${rounded ? "rounded-2xl" : ""} ${tones[tone]} ${pos[labelAt]} ${className}`}
      style={{ aspectRatio: ratio }}
    >
      {!compact && <span className="text-[11px] font-medium tracking-[0.02em] select-none">Photo placeholder</span>}
    </div>
  );
}

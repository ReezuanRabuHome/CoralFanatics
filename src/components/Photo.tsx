import Image from "next/image";
import { PhotoPlaceholder } from "@/components/PhotoPlaceholder";

/**
 * Real photograph when one exists, otherwise the labelled placeholder.
 * Photos are shown exactly as supplied (no colour grading or filters), cropped
 * to the slot's aspect ratio with object-cover.
 */
export function Photo({
  src,
  alt,
  ratio = "1 / 1",
  tone = "specimen",
  sizes = "(min-width: 1024px) 25vw, 50vw",
  priority = false,
  className = "",
  imgClassName = "",
  rounded = false,
  compact = false,
  position = "center",
}: {
  src?: string;
  alt: string;
  ratio?: string;
  tone?: "light" | "dark" | "specimen" | "white";
  sizes?: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  rounded?: boolean;
  compact?: boolean;
  position?: string;
}) {
  if (!src) return <PhotoPlaceholder label={alt} tone={tone} ratio={ratio} className={className} rounded={rounded} compact={compact} />;
  return (
    <div className={`relative w-full overflow-hidden bg-[#06090b] ${rounded ? "rounded-2xl" : ""} ${className}`} style={{ aspectRatio: ratio }}>
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={`object-cover ${imgClassName}`} style={{ objectPosition: position }} />
    </div>
  );
}

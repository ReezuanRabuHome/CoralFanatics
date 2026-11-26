import Image from "next/image";
import Link from "next/link";

/**
 * The Coral Fanatics circular badge. The supplied logo cannot be split into
 * icon + wordmark, so the full badge is used everywhere (Brand Audit §6).
 * Interim transparent PNG derived from the supplied raster until a vector master exists.
 */
export function Badge({ size = 52, href = "/", priority = false }: { size?: number; href?: string | null; priority?: boolean }) {
  const img = (
    <Image
      src="/brand/badge.png"
      alt="Coral Fanatics"
      width={size}
      height={Math.round(size * 0.977)}
      priority={priority}
      className="block h-auto select-none"
      style={{ width: size }}
    />
  );
  if (!href) return img;
  return (
    <Link href={href} aria-label="Coral Fanatics home" className="inline-block shrink-0">
      {img}
    </Link>
  );
}

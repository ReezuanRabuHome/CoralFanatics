import Link from "next/link";
import { Badge } from "@/components/brand/Badge";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <Badge size={80} />
      <h1 className="t-section mt-8">This page has drifted away.</h1>
      <p className="t-sub mt-4 max-w-[34ch] text-ink-2">The link may be old, or the piece may have found a new home.</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link href="/" className="btn btn-primary">Go to the homepage</Link>
        <Link href="/search" className="btn btn-quiet">Search the shop</Link>
      </div>
    </main>
  );
}

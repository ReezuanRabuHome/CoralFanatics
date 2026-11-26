import Link from "next/link";

/** Simple text tabs for sibling categories. */
export function SubNav({ items, current }: { items: { label: string; href: string }[]; current: string }) {
  return (
    <nav aria-label="Categories" className="no-scrollbar -mx-5 overflow-x-auto px-5 md:mx-0 md:px-0">
      <ul className="flex gap-7">
        {items.map((i) => (
          <li key={i.href}>
            <Link
              href={i.href}
              aria-current={i.href === current ? "page" : undefined}
              className={`block border-b pb-2 text-[15px] whitespace-nowrap ${i.href === current ? "border-ink font-medium text-ink" : "border-transparent text-ink-2 hover:text-ink"}`}
            >
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

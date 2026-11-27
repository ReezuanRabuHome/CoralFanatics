import Link from "next/link";
import { notFound } from "next/navigation";

/** Admin screens designed in Deliverable 6 and scheduled for Phase 2–6. */
const sections: Record<string, { title: string; what: string[] }> = {
  products: { title: "Products", what: ["Create and edit products, variants and prices", "Upload and reorder photos", "Publish, unpublish and archive", "Manage categories"] },
  inventory: { title: "Inventory", what: ["Stock levels with low-stock alerts", "Receive deliveries and adjust stock with a reason", "Full movement history and audit trail"] },
  customers: { title: "Customers", what: ["Customer records and order history", "Internal notes", "PDPA data export and anonymisation"] },
  reports: { title: "Reports", what: ["Sales by day, week and month", "Sales by category", "Livestock sell-through and losses", "Payments reconciliation export"] },
  settings: { title: "Settings", what: ["Store details and opening hours", "Collection and delivery rules", "Policies and checkout text", "Users and roles"] },
};

export function generateStaticParams() {
  return Object.keys(sections).map((section) => ({ section }));
}

export default async function AdminSection({ params }: { params: Promise<{ section: string }> }) {
  const s = sections[(await params).section];
  if (!s) notFound();
  return (
    <div className="mx-auto max-w-[720px] py-10">
      <h1 className="font-display text-2xl font-semibold">{s.title}</h1>
      <div className="mt-6 rounded-lg border border-pearl-300 bg-pearl-50 p-6">
        <p className="font-semibold">This screen is designed and will be built with the real database.</p>
        <p className="mt-1 text-ink-600">The prototype includes Overview, Orders and Livestock. {s.title} will let staff:</p>
        <ul className="mt-4 space-y-2">
          {s.what.map((w) => <li key={w} className="flex gap-3"><span className="text-ink-400">–</span>{w}</li>)}
        </ul>
        <Link href="/admin/livestock" className="mt-6 inline-flex h-9 items-center rounded-md bg-ocean-900 px-3 font-semibold text-pearl-50 hover:bg-ocean-700">Open the livestock board</Link>
      </div>
    </div>
  );
}

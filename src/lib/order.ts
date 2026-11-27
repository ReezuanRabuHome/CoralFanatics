/** Prototype order hand-off between checkout, confirmation and order lookup (sessionStorage). */
export interface SavedOrder {
  number: string;
  email: string;
  name: string;
  method: "COLLECTION" | "DELIVERY";
  when: string;
  items: { title: string; subtitle: string; qty: number; unitCents: number; photo?: string; specimen: boolean }[];
  subtotalCents: number;
  deliveryCents: number;
  totalCents: number;
}

export function readLastOrder(): SavedOrder | null {
  try {
    const raw = sessionStorage.getItem("cf-last-order");
    return raw ? (JSON.parse(raw) as SavedOrder) : null;
  } catch {
    return null;
  }
}

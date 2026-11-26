/**
 * Placeholder business information.
 *
 * Every value here is a PLACEHOLDER awaiting confirmation from Coral Fanatics.
 * See docs/planning/placeholders.md (Q2–Q12). Written as plain, neutral copy so
 * the design reads naturally; the "PROTOTYPE" marker and placeholders.md make
 * clear none of it is final. These move into admin Settings in Phase 6.
 */
export const store = {
  name: "Coral Fanatics",
  address: "Shop address to be confirmed",
  hours: "Opening hours to be confirmed",
  phone: "Phone to be confirmed",
  email: "Email to be confirmed",
  whatsapp: null as string | null, // Q11: hidden until provided
  social: [] as { label: string; href: string }[], // Q11: hidden until provided
  legalName: "Legal entity to be confirmed",
};

export const fulfilment = {
  collection: { title: "Collect in store", detail: "Ready to collect at our shop. Hours to be confirmed." },
  delivery: { title: "Delivery in Singapore", detail: "Scheduled livestock delivery. Days and fees to be confirmed." },
  /** Q3: layout-only value. Real fee rules will be configured in Settings. */
  deliveryFeeCents: 1500,
  /** Q4: layout-only collection windows. */
  collectionSlots: ["12:00 – 16:00", "16:00 – 20:00"],
};

export const policies = {
  livestockTerms:
    "Livestock terms to be provided by Coral Fanatics, covering live-arrival policy, acclimatisation guidance and how long uncollected livestock is held.",
  gstNote: "GST treatment to be confirmed",
};

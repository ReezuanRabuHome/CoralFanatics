/**
 * Placeholder business information.
 *
 * Every value here is a PLACEHOLDER awaiting confirmation from Coral Fanatics.
 * See docs/planning/placeholders.md (Q2–Q12). These move into admin Settings in
 * Phase 6; until then nothing else in the codebase may hard-code store facts.
 */
export const PLACEHOLDER = "[TBC]";

export const store = {
  name: "Coral Fanatics",
  address: "[Shop address TBC]",
  hours: "[Opening hours TBC]",
  phone: "[Phone TBC]",
  email: "[Email TBC]",
  whatsapp: null as string | null, // Q11: hidden until provided
  social: [] as { label: string; href: string }[], // Q11: hidden until provided
  legalName: "[Legal entity / UEN TBC]",
};

export const fulfilment = {
  collectionSummary: "Collect from our shop: [hours TBC]",
  deliverySummary: "Delivery in Singapore: [schedule TBC]",
  /** Q3: layout-only value. Real fee rules will be configured in Settings. */
  deliveryFeeCents: 1500,
  deliveryFeeIsPlaceholder: true,
  /** Q4: layout-only collection days and hours. */
  collectionSlots: ["12:00 – 16:00", "16:00 – 20:00"],
};

export const policies = {
  livestockTerms:
    "[Livestock terms to be provided by Coral Fanatics: live-arrival / DOA policy, acclimatisation guidance and collection hold period.]",
  gstNote: "GST: [to be confirmed]",
};

export const serviceStrip = [
  { icon: "truck", text: "Livestock delivery in Singapore [TBC]" },
  { icon: "store", text: "Collect from our shop [TBC]" },
  { icon: "shield", text: "Secure checkout with PayNow & cards" },
  { icon: "heart", text: "Live-arrival policy [TBC]" },
] as const;

/**
 * SAMPLE DATA: Phase 1 visual prototype only.
 *
 * Species names are real coral/fish species, but every specimen, price, stock
 * level, product and order below is INVENTED for layout purposes and does not
 * represent Coral Fanatics stock (placeholders.md Q9). Dry goods use a generic
 * "Sample Brand" so no real brand or product is implied.
 *
 * Phase 2 replaces this file with the database-backed catalogue modules.
 */
import type { Cents } from "@/lib/money";

export type CoralType = "sps" | "lps" | "mushrooms";
export type SpecimenStatus = "AVAILABLE" | "RESERVED" | "SOLD" | "UNAVAILABLE" | "DRAFT";
export type Level = "Low" | "Medium" | "High";
export type CareLevel = "Beginner" | "Intermediate" | "Expert";

export interface Specimen {
  code: string;
  speciesSlug: string;
  species: string;
  scientificName: string;
  type: CoralType;
  subType: string;
  priceCents: Cents;
  status: SpecimenStatus;
  sizeCm: number;
  lighting: Level;
  flow: Level | "Low–Medium" | "Medium–High";
  placement: "Lower" | "Middle" | "Upper";
  care: CareLevel;
  growth: "Slow" | "Moderate" | "Fast";
  colours: string[];
  notes: string;
  listedDaysAgo: number;
  tank: string;
  /** Real Coral Fanatics photograph (public/photos), if supplied. */
  photo?: string;
}

export const coralTypes: Record<CoralType, { label: string; title: string; eyebrow: string; blurb: string }> = {
  sps: {
    label: "SPS",
    title: "SPS corals.",
    eyebrow: "Small-polyp stony",
    blurb: "Acropora, Montipora and other small-polyp stony corals, chosen for colour and structure.",
  },
  lps: {
    label: "LPS",
    title: "LPS corals.",
    eyebrow: "Large-polyp stony",
    blurb: "Hammers, torches, acans and more. Fleshy, expressive corals with movement.",
  },
  mushrooms: {
    label: "Mushrooms",
    title: "Mushrooms.",
    eyebrow: "Corallimorphs",
    blurb: "Ricordea, Rhodactis and Discosoma. Hardy, vivid and full of character.",
  },
};

type SpeciesSeed = Omit<Specimen, "code" | "priceCents" | "status" | "sizeCm" | "notes" | "listedDaysAgo" | "tank">;

const species: Record<string, SpeciesSeed> = {
  "fox-flame-acropora": { speciesSlug: "fox-flame-acropora", species: "Fox Flame Acropora", scientificName: "Acropora sp.", type: "sps", subType: "Acropora", lighting: "High", flow: "Medium–High", placement: "Upper", care: "Expert", growth: "Moderate", colours: ["Orange/Yellow", "Green"] },
  "walt-disney-acropora": { speciesSlug: "walt-disney-acropora", species: "Walt Disney Acropora", scientificName: "Acropora sp.", type: "sps", subType: "Acropora", lighting: "High", flow: "High", placement: "Upper", care: "Expert", growth: "Moderate", colours: ["Multi-colour", "Purple"] },
  "strawberry-shortcake-acropora": { speciesSlug: "strawberry-shortcake-acropora", species: "Strawberry Shortcake Acropora", scientificName: "Acropora microclados", type: "sps", subType: "Acropora", lighting: "High", flow: "Medium–High", placement: "Upper", care: "Expert", growth: "Slow", colours: ["Pink/Red", "Green"] },
  "green-slimer-acropora": { speciesSlug: "green-slimer-acropora", species: "Green Slimer Acropora", scientificName: "Acropora yongei", type: "sps", subType: "Acropora", lighting: "Medium", flow: "Medium", placement: "Middle", care: "Intermediate", growth: "Fast", colours: ["Green"] },
  "sunset-montipora": { speciesSlug: "sunset-montipora", species: "Sunset Montipora", scientificName: "Montipora sp.", type: "sps", subType: "Montipora", lighting: "Medium", flow: "Medium", placement: "Middle", care: "Intermediate", growth: "Moderate", colours: ["Orange/Yellow", "Pink/Red"] },
  "bubblegum-digitata": { speciesSlug: "bubblegum-digitata", species: "Bubblegum Digitata", scientificName: "Montipora digitata", type: "sps", subType: "Montipora", lighting: "Medium", flow: "Medium", placement: "Middle", care: "Beginner", growth: "Fast", colours: ["Pink/Red"] },
  "pink-birdsnest": { speciesSlug: "pink-birdsnest", species: "Pink Birdsnest", scientificName: "Seriatopora hystrix", type: "sps", subType: "Seriatopora", lighting: "High", flow: "Medium", placement: "Upper", care: "Intermediate", growth: "Fast", colours: ["Pink/Red"] },
  "hammer-coral": { speciesSlug: "hammer-coral", species: "Hammer Coral", scientificName: "Fimbriaphyllia ancora", type: "lps", subType: "Euphyllia", lighting: "Medium", flow: "Low–Medium", placement: "Middle", care: "Intermediate", growth: "Moderate", colours: ["Green", "Orange/Yellow"] },
  "torch-coral": { speciesSlug: "torch-coral", species: "Torch Coral", scientificName: "Fimbriaphyllia glabrescens", type: "lps", subType: "Euphyllia", lighting: "Medium", flow: "Low–Medium", placement: "Middle", care: "Intermediate", growth: "Moderate", colours: ["Green", "Orange/Yellow"] },
  "duncan-coral": { speciesSlug: "duncan-coral", species: "Duncan Coral", scientificName: "Duncanopsammia axifuga", type: "lps", subType: "Duncan", lighting: "Low", flow: "Low–Medium", placement: "Lower", care: "Beginner", growth: "Moderate", colours: ["Green", "Purple"] },
  "acan-lord": { speciesSlug: "acan-lord", species: "Acan Lord", scientificName: "Micromussa lordhowensis", type: "lps", subType: "Acanthastrea", lighting: "Low", flow: "Low", placement: "Lower", care: "Beginner", growth: "Slow", colours: ["Multi-colour", "Pink/Red"] },
  "blastomussa-wellsi": { speciesSlug: "blastomussa-wellsi", species: "Blastomussa Wellsi", scientificName: "Blastomussa wellsi", type: "lps", subType: "Blastomussa", lighting: "Low", flow: "Low", placement: "Lower", care: "Beginner", growth: "Slow", colours: ["Pink/Red"] },
  // Species below were added to match real shop photos (26 Nov 2026).
  // Names are best guesses from the photos and must be confirmed by the shop.
  "orange-teal-chalice": { speciesSlug: "orange-teal-chalice", species: "Orange & Teal Chalice", scientificName: "Echinophyllia sp.", type: "lps", subType: "Chalice", lighting: "Low", flow: "Low–Medium", placement: "Lower", care: "Intermediate", growth: "Slow", colours: ["Orange/Yellow", "Green", "Multi-colour"] },
  "green-gold-acropora": { speciesSlug: "green-gold-acropora", species: "Green & Gold Acropora", scientificName: "Acropora sp.", type: "sps", subType: "Acropora", lighting: "High", flow: "Medium–High", placement: "Upper", care: "Expert", growth: "Moderate", colours: ["Green", "Orange/Yellow"] },
  "lime-acropora": { speciesSlug: "lime-acropora", species: "Lime Acropora", scientificName: "Acropora sp.", type: "sps", subType: "Acropora", lighting: "High", flow: "Medium–High", placement: "Upper", care: "Expert", growth: "Moderate", colours: ["Green", "Orange/Yellow"] },
  "yellow-purple-acropora": { speciesSlug: "yellow-purple-acropora", species: "Yellow & Purple Acropora", scientificName: "Acropora sp.", type: "sps", subType: "Acropora", lighting: "High", flow: "Medium–High", placement: "Upper", care: "Expert", growth: "Moderate", colours: ["Orange/Yellow", "Purple"] },
  "ricordea-florida": { speciesSlug: "ricordea-florida", species: "Ricordea Florida", scientificName: "Ricordea florida", type: "mushrooms", subType: "Ricordea", lighting: "Low", flow: "Low", placement: "Lower", care: "Beginner", growth: "Slow", colours: ["Green", "Orange/Yellow"] },
  "ricordea-yuma": { speciesSlug: "ricordea-yuma", species: "Ricordea Yuma", scientificName: "Ricordea yuma", type: "mushrooms", subType: "Ricordea", lighting: "Medium", flow: "Low", placement: "Middle", care: "Intermediate", growth: "Slow", colours: ["Multi-colour"] },
  "bounce-mushroom": { speciesSlug: "bounce-mushroom", species: "Bounce Mushroom", scientificName: "Rhodactis inchoata", type: "mushrooms", subType: "Rhodactis", lighting: "Low", flow: "Low", placement: "Lower", care: "Expert", growth: "Slow", colours: ["Orange/Yellow", "Pink/Red"] },
  "jawbreaker-mushroom": { speciesSlug: "jawbreaker-mushroom", species: "Jawbreaker Mushroom", scientificName: "Discosoma sp.", type: "mushrooms", subType: "Discosoma", lighting: "Low", flow: "Low", placement: "Lower", care: "Beginner", growth: "Moderate", colours: ["Multi-colour", "Purple"] },
};

const prefix: Record<CoralType, string> = { sps: "SPS", lps: "LPS", mushrooms: "MUS" };

// [species, number, price $, status, size cm, days ago, notes]
const rows: [string, number, number, SpecimenStatus, number, number, string][] = [
  // Pieces with real photographs (prices, sizes and notes are SAMPLE values)
  ["lime-acropora", 146, 150, "AVAILABLE", 6, 0, "Bright lime colony with gold polyps."],
  ["green-gold-acropora", 145, 220, "AVAILABLE", 12, 0, "Large branching colony, green base with gold polyps."],
  ["yellow-purple-acropora", 144, 65, "AVAILABLE", 2, 1, "Small frag on plug. Yellow tips over a purple base."],
  ["hammer-coral", 89, 280, "AVAILABLE", 15, 0, "Large colony with spotted lime tips."],
  ["orange-teal-chalice", 90, 180, "AVAILABLE", 10, 0, "Layered plates in orange and teal."],
  ["fox-flame-acropora", 142, 85, "AVAILABLE", 3, 0, "Bright green base with two healthy growth tips."],
  ["fox-flame-acropora", 143, 95, "AVAILABLE", 4, 0, "Fuller colony with strong orange polyp extension."],
  ["fox-flame-acropora", 139, 75, "RESERVED", 3, 2, "Compact frag, encrusted on plug."],
  ["walt-disney-acropora", 141, 160, "AVAILABLE", 4, 1, "Classic tricolour with purple tips."],
  ["strawberry-shortcake-acropora", 138, 180, "AVAILABLE", 3, 3, "Dense branching, deep pink tips."],
  ["strawberry-shortcake-acropora", 131, 150, "SOLD", 3, 9, "Small but well coloured."],
  ["green-slimer-acropora", 136, 45, "AVAILABLE", 5, 4, "Hardy grower, great first Acropora."],
  ["sunset-montipora", 135, 55, "AVAILABLE", 4, 5, "Plating start with orange rim."],
  ["bubblegum-digitata", 134, 35, "AVAILABLE", 5, 6, "Branching, fast-growing, vivid pink."],
  ["pink-birdsnest", 133, 40, "AVAILABLE", 4, 6, "Fine branches, good polyp extension."],
  ["walt-disney-acropora", 130, 140, "SOLD", 3, 11, "Encrusting well."],
  ["hammer-coral", 88, 120, "AVAILABLE", 6, 0, "Two-head branching hammer, green with gold tips."],
  ["torch-coral", 87, 135, "AVAILABLE", 5, 1, "Single head, long tentacles."],
  ["duncan-coral", 86, 45, "AVAILABLE", 5, 2, "Six heads, green centres."],
  ["acan-lord", 85, 90, "AVAILABLE", 4, 3, "Four polyps, rainbow colouration."],
  ["blastomussa-wellsi", 84, 65, "RESERVED", 4, 4, "Eight polyps, deep red."],
  ["hammer-coral", 83, 95, "SOLD", 5, 8, "Single head."],
  ["ricordea-florida", 52, 45, "AVAILABLE", 3, 0, "Single polyp, orange centre."],
  ["ricordea-yuma", 51, 120, "AVAILABLE", 4, 0, "Orange-tipped Yuma with a green mouth."],
  ["bounce-mushroom", 50, 220, "AVAILABLE", 3, 2, "Single bounce, strong bubble pattern."],
  ["jawbreaker-mushroom", 49, 55, "AVAILABLE", 4, 3, "Striped purple and green."],
  ["ricordea-florida", 48, 40, "AVAILABLE", 3, 5, "Green single polyp."],
];

export const specimens: Specimen[] = rows.map(([slug, n, price, status, sizeCm, days, notes], i) => {
  const s = species[slug]!;
  return {
    ...s,
    code: `CF-${prefix[s.type]}-${String(n).padStart(4, "0")}`,
    priceCents: price * 100,
    status,
    sizeCm,
    listedDaysAgo: days,
    notes,
    tank: `Rack ${String.fromCharCode(65 + (i % 4))}${(i % 6) + 1}`,
  };
});

/** Real photographs supplied by Coral Fanatics, keyed by specimen ID. */
const photos: Record<string, string> = {
  "CF-SPS-0146": "/photos/acropora-lime.jpg",
  "CF-SPS-0145": "/photos/acropora-green-yellow-polyps.jpg",
  "CF-SPS-0144": "/photos/acropora-frag-yellow-purple.jpg",
  "CF-LPS-0089": "/photos/hammer-green.jpg",
  "CF-LPS-0090": "/photos/chalice-orange-teal.jpg",
  "CF-MUS-0051": "/photos/ricordea-yuma-orange.jpg",
};
for (const s of specimens) s.photo = photos[s.code];

export function getSpecimen(code: string): Specimen | undefined {
  return specimens.find((s) => s.code.toLowerCase() === code.toLowerCase());
}

export function specimenHref(s: Specimen): string {
  return `/corals/${s.type}/${s.speciesSlug}/${s.code.toLowerCase()}`;
}

/* ───────── Quantity-based products (fish, inverts, dry goods) ───────── */

export interface Variant {
  id: string;
  name: string;
  priceCents: Cents;
  stock: number;
}

export interface Product {
  slug: string;
  name: string;
  brand?: string;
  scientificName?: string;
  section: "fish" | "invertebrates" | "equipment" | "additives";
  subCategory: string;
  variants: Variant[];
  isLivestock: boolean;
  representativePhoto?: boolean;
  description: string;
  highlights?: string[];
  specs?: [string, string][];
  facts?: [string, string][];
  lowStockThreshold: number;
  /** Real Coral Fanatics photograph (public/photos), if supplied. */
  photo?: string;
}

export const products: Product[] = [
  // Products with real shop photographs (26 Nov 2026). Prices, stock and
  // variants are SAMPLE values; species identified from the photos.
  {
    slug: "regal-blue-tang", name: "Regal Blue Tang", scientificName: "Paracanthurus hepatus", section: "fish", subCategory: "Tangs",
    variants: [{ id: "rbt-s", name: "Small ~5 cm", priceCents: 6800, stock: 6 }, { id: "rbt-m", name: "Medium ~8 cm", priceCents: 9800, stock: 3 }],
    isLivestock: true, representativePhoto: true, lowStockThreshold: 2, photo: "/photos/blue-tangs.jpg",
    description: "An active, fast-swimming tang that needs plenty of swimming room and a steady diet including marine algae.",
    facts: [["Reef safe", "Yes"], ["Temperament", "Semi-aggressive"], ["Diet", "Omnivore"], ["Max size", "25 cm"], ["Min tank", "~500 L"], ["Care", "Intermediate"]],
  },
  {
    slug: "yellow-watchman-goby", name: "Yellow Watchman Goby", scientificName: "Cryptocentrus cinctus", section: "fish", subCategory: "Gobies",
    variants: [{ id: "ywg", name: "Standard", priceCents: 3200, stock: 4 }],
    isLivestock: true, representativePhoto: true, lowStockThreshold: 2, photo: "/photos/yellow-watchman-goby.jpg",
    description: "A hardy sand-dwelling goby that often pairs with a pistol shrimp and sits watch at the burrow entrance.",
    facts: [["Reef safe", "Yes"], ["Temperament", "Peaceful"], ["Diet", "Carnivore"], ["Max size", "10 cm"], ["Min tank", "~110 L"], ["Care", "Beginner"]],
  },
  {
    slug: "electric-blue-hermit-crab", name: "Electric Blue Hermit Crab", scientificName: "Calcinus elegans", section: "invertebrates", subCategory: "Crabs",
    variants: [{ id: "ebh", name: "Each", priceCents: 1500, stock: 10 }],
    isLivestock: true, representativePhoto: true, lowStockThreshold: 3, photo: "/photos/electric-blue-hermit-crabs.jpg",
    description: "A colourful clean-up crew hermit that grazes algae and leftover food. Keep spare empty shells in the tank.",
    facts: [["Reef safe", "With caution"], ["Role", "Clean-up crew"], ["Care", "Beginner"], ["Max size", "4 cm"], ["Sensitivity", "Copper-sensitive"], ["With fish", "Generally"]],
  },
  {
    slug: "nyos-quantum-protein-skimmer", name: "Quantum Protein Skimmer", brand: "Nyos", section: "equipment", subCategory: "Filtration",
    variants: [{ id: "nq", name: "Model to be confirmed", priceCents: 69000, stock: 2 }],
    isLivestock: false, lowStockThreshold: 1, photo: "/photos/nyos-quantum-skimmer.jpg",
    description: "An in-sump protein skimmer that removes dissolved organic waste before it breaks down in the aquarium.",
    highlights: ["In-sump protein skimmer", "Model, sizing and specifications to be confirmed by the shop"],
    specs: [["Type", "In-sump protein skimmer"], ["Model", "To be confirmed"], ["Recommended tank size", "To be confirmed"]],
  },
  {
    slug: "ocellaris-clownfish", name: "Ocellaris Clownfish", scientificName: "Amphiprion ocellaris", section: "fish", subCategory: "Clownfish",
    variants: [{ id: "oc-s", name: "Small ~3 cm", priceCents: 2800, stock: 6 }, { id: "oc-m", name: "Medium ~5 cm", priceCents: 3800, stock: 2 }],
    isLivestock: true, representativePhoto: true, lowStockThreshold: 2,
    description: "A hardy, peaceful clownfish that suits most reef aquariums.",
    facts: [["Reef safe", "Yes"], ["Temperament", "Peaceful"], ["Diet", "Omnivore"], ["Max size", "8 cm"], ["Min tank", "~75 L"], ["Care", "Beginner"]],
  },
  {
    slug: "yellow-tang", name: "Yellow Tang", scientificName: "Zebrasoma flavescens", section: "fish", subCategory: "Tangs",
    variants: [{ id: "yt-m", name: "Medium ~7 cm", priceCents: 16800, stock: 1 }], isLivestock: true, representativePhoto: true, lowStockThreshold: 1,
    description: "An active grazer that needs swimming space and a steady supply of algae.",
    facts: [["Reef safe", "Yes"], ["Temperament", "Semi-aggressive"], ["Diet", "Herbivore"], ["Max size", "20 cm"], ["Min tank", "~400 L"], ["Care", "Intermediate"]],
  },
  {
    slug: "royal-gramma", name: "Royal Gramma", scientificName: "Gramma loreto", section: "fish", subCategory: "Basslets",
    variants: [{ id: "rg", name: "Standard", priceCents: 4500, stock: 4 }], isLivestock: true, representativePhoto: true, lowStockThreshold: 2,
    description: "A peaceful, colourful basslet that holds a small territory among the rockwork.",
    facts: [["Reef safe", "Yes"], ["Temperament", "Peaceful"], ["Diet", "Carnivore"], ["Max size", "8 cm"], ["Min tank", "~110 L"], ["Care", "Beginner"]],
  },
  {
    slug: "six-line-wrasse", name: "Six-line Wrasse", scientificName: "Pseudocheilinus hexataenia", section: "fish", subCategory: "Wrasses",
    variants: [{ id: "sl", name: "Standard", priceCents: 3500, stock: 0 }], isLivestock: true, representativePhoto: true, lowStockThreshold: 2,
    description: "A busy wrasse that hunts pests between the rocks.",
    facts: [["Reef safe", "Yes"], ["Temperament", "Semi-aggressive"], ["Diet", "Carnivore"], ["Max size", "8 cm"], ["Min tank", "~110 L"], ["Care", "Beginner"]],
  },
  {
    slug: "skunk-cleaner-shrimp", name: "Skunk Cleaner Shrimp", scientificName: "Lysmata amboinensis", section: "invertebrates", subCategory: "Shrimp",
    variants: [{ id: "scs", name: "Standard", priceCents: 3200, stock: 5 }], isLivestock: true, representativePhoto: true, lowStockThreshold: 2,
    description: "A cleaner shrimp that sets up cleaning stations for fish.",
    facts: [["Reef safe", "Yes"], ["Role", "Cleaner"], ["Care", "Beginner"], ["Max size", "6 cm"], ["Sensitivity", "Copper-sensitive"], ["With fish", "Generally"]],
  },
  {
    slug: "turbo-snail", name: "Turbo Snail", scientificName: "Turbo sp.", section: "invertebrates", subCategory: "Snails",
    variants: [{ id: "ts", name: "Each", priceCents: 600, stock: 24 }], isLivestock: true, representativePhoto: true, lowStockThreshold: 6,
    description: "An efficient algae grazer for the glass and rockwork.",
    facts: [["Reef safe", "Yes"], ["Role", "Clean-up crew"], ["Care", "Beginner"], ["Max size", "5 cm"], ["Sensitivity", "Copper-sensitive"], ["With fish", "Generally"]],
  },
  {
    slug: "emerald-crab", name: "Emerald Crab", scientificName: "Mithraculus sculptus", section: "invertebrates", subCategory: "Crabs",
    variants: [{ id: "ec", name: "Each", priceCents: 1200, stock: 3 }], isLivestock: true, representativePhoto: true, lowStockThreshold: 2,
    description: "Known for eating bubble algae.",
    facts: [["Reef safe", "With caution"], ["Role", "Clean-up crew"], ["Care", "Beginner"], ["Max size", "5 cm"], ["Sensitivity", "Copper-sensitive"], ["With fish", "Generally"]],
  },
  {
    slug: "tuxedo-urchin", name: "Tuxedo Urchin", scientificName: "Mespilia globulus", section: "invertebrates", subCategory: "Urchins",
    variants: [{ id: "tu", name: "Each", priceCents: 2200, stock: 2 }], isLivestock: true, representativePhoto: true, lowStockThreshold: 1,
    description: "A slow, steady algae grazer with striking banding.",
    facts: [["Reef safe", "Yes"], ["Role", "Algae control"], ["Care", "Intermediate"], ["Max size", "7 cm"], ["Sensitivity", "Copper-sensitive"], ["With fish", "Generally"]],
  },
  {
    slug: "reef-salt-mix", name: "Reef Salt Mix", brand: "Sample Brand", section: "equipment", subCategory: "Salt & Testing",
    variants: [{ id: "rs-7", name: "7 kg", priceCents: 4800, stock: 12 }, { id: "rs-22", name: "22 kg", priceCents: 12000, stock: 3 }],
    isLivestock: false, lowStockThreshold: 4,
    description: "A synthetic sea salt formulated for reef aquariums, with elevated alkalinity and calcium.",
    highlights: ["Makes approx. 210 L (7 kg) or 660 L (22 kg)", "Dissolves clear in minutes", "Consistent batch-to-batch"],
    specs: [["Weight", "7 kg / 22 kg"], ["Yield", "~210 L / ~660 L"], ["Mix ratio", "~33 g per litre"], ["Packaging", "Resealable bucket"]],
  },
  {
    slug: "alkalinity-test-kit", name: "Alkalinity Test Kit", brand: "Sample Brand", section: "equipment", subCategory: "Salt & Testing",
    variants: [{ id: "atk", name: "Standard", priceCents: 3600, stock: 9 }], isLivestock: false, lowStockThreshold: 3,
    description: "A titration test kit for accurate dKH readings.",
    highlights: ["~75 tests", "0.1 dKH resolution"], specs: [["Tests", "~75"], ["Range", "0–15 dKH"], ["Method", "Titration"]],
  },
  {
    slug: "led-reef-light-90w", name: "LED Reef Light 90W", brand: "Sample Brand", section: "equipment", subCategory: "Lighting",
    variants: [{ id: "led", name: "Standard", priceCents: 42000, stock: 2 }], isLivestock: false, lowStockThreshold: 1,
    description: "A full-spectrum LED fixture with app control.",
    highlights: ["Full spectrum for SPS and LPS", "App scheduling"], specs: [["Power", "90 W"], ["Coverage", "~60 × 60 cm"], ["Control", "Wi-Fi app"]],
  },
  {
    slug: "dc-return-pump-3000", name: "DC Return Pump 3000", brand: "Sample Brand", section: "equipment", subCategory: "Pumps",
    variants: [{ id: "pump", name: "3000 L/h", priceCents: 18500, stock: 0 }], isLivestock: false, lowStockThreshold: 1,
    description: "A quiet, controllable DC return pump.",
    highlights: ["Variable speed", "Quiet running"], specs: [["Flow", "3000 L/h"], ["Head", "3 m"], ["Power", "35 W"]],
  },
  {
    slug: "two-part-calcium-alkalinity", name: "Two-part Calcium & Alkalinity", brand: "Sample Brand", section: "additives", subCategory: "Balling",
    variants: [{ id: "tp-1", name: "2 × 500 ml", priceCents: 3900, stock: 7 }, { id: "tp-2", name: "2 × 1 L", priceCents: 6500, stock: 4 }],
    isLivestock: false, lowStockThreshold: 3,
    description: "A balanced two-part supplement for stable calcium and alkalinity.",
    highlights: ["Balanced dosing", "Suitable for dosing pumps"], specs: [["Volume", "2 × 500 ml / 2 × 1 L"]],
  },
  {
    slug: "coral-frag-glue", name: "Coral Frag Glue Gel", brand: "Sample Brand", section: "additives", subCategory: "Fragging",
    variants: [{ id: "glue", name: "20 g", priceCents: 1200, stock: 15 }], isLivestock: false, lowStockThreshold: 5,
    description: "A cyanoacrylate gel for mounting frags. Sets underwater.",
    highlights: ["Sets underwater", "Precision nozzle"], specs: [["Size", "20 g"]],
  },
];

export const sectionHref: Record<Product["section"], string> = {
  fish: "/marine-life/fish",
  invertebrates: "/marine-life/invertebrates",
  equipment: "/equipment",
  additives: "/additives",
};

export function productHref(p: Product): string {
  return `${sectionHref[p.section]}/${p.slug}`;
}

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function fromPrice(p: Product): Cents {
  return Math.min(...p.variants.map((v) => v.priceCents));
}

export function totalStock(p: Product): number {
  return p.variants.reduce((n, v) => n + v.stock, 0);
}

/* ───────── Sample order (admin prototype) ───────── */

export const sampleOrders = [
  { number: "CF-10042", date: "26 Nov 2026, 14:22", customer: "Sample Customer A", items: 2, totalCents: 22000, payment: "PAID", fulfilment: "PREPARING", method: "Delivery", scheduled: "Sat 28 Nov" },
  { number: "CF-10041", date: "26 Nov 2026, 11:05", customer: "Sample Customer B", items: 1, totalCents: 12000, payment: "PAID", fulfilment: "READY_FOR_COLLECTION", method: "Collection", scheduled: "Thu 26 Nov" },
  { number: "CF-10040", date: "26 Nov 2026, 09:48", customer: "Sample Customer C", items: 4, totalCents: 9600, payment: "PENDING", fulfilment: "UNFULFILLED", method: "Collection", scheduled: "Fri 27 Nov" },
  { number: "CF-10039", date: "25 Nov 2026, 19:30", customer: "Sample Customer D", items: 3, totalCents: 31500, payment: "PAID", fulfilment: "UNFULFILLED", method: "Delivery", scheduled: "Sat 28 Nov" },
  { number: "CF-10038", date: "25 Nov 2026, 16:12", customer: "Sample Customer E", items: 1, totalCents: 4500, payment: "EXPIRED", fulfilment: "CANCELLED", method: "Collection", scheduled: "—" },
] as const;

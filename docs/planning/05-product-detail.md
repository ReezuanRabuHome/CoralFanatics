# Deliverable 5 — Product Detail Design

All four PDP types share one frame, so they are consistent and cheaper to build:

```
DESKTOP (container 1200–1440)
┌──────────────────────────────────────────────────────────────────┐
│ Breadcrumb: Corals / SPS / Acropora                              │
├───────────────────────────────────────┬──────────────────────────┤
│                                       │ INFO COLUMN (5/12)       │
│  GALLERY (7/12, sticky)               │                          │
│  ┌─────────────────────────────────┐  │                          │
│  │                                 │  │                          │
│  │        main image 1:1           │  │                          │
│  │        (click → lightbox)       │  │                          │
│  └─────────────────────────────────┘  │                          │
│  [thumb][thumb][thumb]                │                          │
├───────────────────────────────────────┴──────────────────────────┤
│ DETAIL SECTIONS (full width, tabs on desktop / accordions mobile)│
├──────────────────────────────────────────────────────────────────┤
│ RELATED (4-up grid)                                              │
└──────────────────────────────────────────────────────────────────┘

MOBILE: Gallery (swipe, dots) → Info → Detail accordions → Related
        + sticky bottom bar: [S$85] [ Add to bag ]
```

Background: pearl for every PDP. The coral PDP uses an ocean-950 frame inside the gallery to give the specimen a "gallery wall" presentation.

---

## 1. Individual coral specimen PDP (flagship page)

URL: `/corals/sps/fox-flame-acropora/cf-sps-0142`

### Info column, in order
1. **Eyebrow:** `SPS · ACROPORA`
2. **H1:** Fox Flame Acropora
3. **Scientific name** (italic, muted): *Acropora* sp.
4. **Specimen line:** `◆ One of a kind · Specimen CF-SPS-0142`. The ID can be copied with one tap (customers quote it on WhatsApp).
5. **Price:** `S$85` (large, tabular). GST note if applicable (*to be confirmed*).
6. **Availability:** status badge
   - ● Available: "This exact piece is available."
   - ● Reserved: "Someone is checking out with this piece. It may become available again within 15 minutes."
   - ● Sold: "This piece has found a new home." plus "See other Fox Flame pieces →"
7. **Key facts grid** (2 × 3, icon + label + value):
   `Size ~3 cm` · `Lighting High` · `Flow Medium–High` · `Placement Upper` · `Care Expert` · `Growth Moderate`
8. **Primary CTA:** `Add to bag` (lg). No quantity selector. Disabled when not Available.
9. **Fulfilment summary** (small list): "Collect in store: ready [same day]*", "Delivery in Singapore: [schedule]*", plus a link to the Livestock policy. *(Placeholders until policy confirmed.)*
10. **Colour honesty note:** "Photographed under reef lighting. Colours may vary."

### Gallery
- 1–5 images of this specimen; the first is top-down.
- Image overlay chip: `Actual specimen`.
- Lightbox with zoom up to the 2400px master.
- Optional short video (v1.1).

### Detail sections
| Tab | Content |
|---|---|
| About this coral | Species description (shared across all specimens of the species) + specimen-specific notes ("Nice green base, 2 growth tips") |
| Care | Lighting (PAR range if the shop provides it), Flow, Placement, Difficulty, Feeding, Water parameters (Alk/Ca/Mg ranges, *only if the shop supplies values*) |
| Collection & delivery | Livestock handling, acclimatisation advice link, live-arrival terms |

### Related
1. **Other pieces of this species** (siblings), if any are available.
2. **More SPS you may like** (same sub-category, similar price band).
3. Optional: "Pair with" dry goods (e.g. coral glue, dip). Hand-picked in the admin per species.

---

## 2. Marine fish PDP

Fish are usually stocked several at a time, so the **default inventory model is quantity-based** (with "Representative photo" shown where it applies). A showpiece fish can be listed as a unique specimen using the coral layout.

### Info column
1. Eyebrow: `MARINE FISH · CLOWNFISH`
2. H1: Ocellaris Clownfish
3. Scientific name: *Amphiprion ocellaris*
4. Price, with a variant selector if sizes differ: `Size: [Small ~3cm] [Medium ~5cm]`
5. Quantity selector (1 – stock, with a per-order limit configurable per product)
6. Availability: In stock / Only 2 left / Sold out
7. Key facts grid:
   `Reef safe Yes` · `Temperament Peaceful` · `Diet Omnivore` · `Max size 8 cm` · `Min tank ~75 L` · `Care Beginner`
8. `Add to bag`
9. Origin (Captive-bred / Wild-collected) and **quarantine/acclimation status**: shown **only if the shop records it** (to be confirmed).
10. Fulfilment summary + livestock policy link.

### Detail sections
About · Care & compatibility (tankmates, aggression notes, feeding) · Collection & delivery.

---

## 3. Invertebrate PDP

Same frame as fish (quantity-based by default).

Key facts grid:
`Reef safe Yes / With caution` · `Role Clean-up crew` · `Care Beginner` · `Max size` · `Sensitivity Copper/nitrate-sensitive` · `Compatible with fish Generally`

Detail sections: About · Care (acclimatisation, especially drip acclimation for shrimp) · Collection & delivery.

Bundles (e.g. a "Clean-up crew pack") are **future scope**.

---

## 4. Dry goods PDP

URL: `/equipment/salt-testing/red-sea-coral-pro-salt`

### Info column
1. Brand (eyebrow, linked to the brand filter): `RED SEA`
2. H1: Coral Pro Salt
3. Price (updates with the variant)
4. **Variant selector** as segmented buttons: `Size: [7 kg] [22 kg]`. Unavailable variants are struck through but still selectable to show they are sold out.
5. Quantity stepper (− 1 +), capped at available stock
6. Availability: In stock / Only 3 left / Sold out (v1.1: "Notify me")
7. `Add to bag`
8. Fulfilment summary: dry goods may ship by standard delivery while livestock needs a scheduled slot (see Deliverable 7).
9. 3–5 short highlight bullets.

### Detail sections
| Tab | Content |
|---|---|
| Description | Rich text |
| Specifications | Key–value table (dimensions, wattage, capacity, flow rate…), with spec keys defined per category template in the admin |
| Collection & delivery | Standard text |

### Related
Same sub-category, then "Frequently bought with" (hand-picked in v1; automatic in a future version).

---

## 5. Shared PDP behaviour
- **Server-authoritative price and stock.** The page renders from the database, and stock is re-checked when the customer adds to the bag and again at checkout.
- **Add-to-bag feedback:** the button shows "✓ Added", and the bag drawer slides in with "Continue shopping" and "Checkout".
- **Structured data:** JSON-LD `Product` + `Offer` (price SGD, availability), breadcrumbs.
- **Sold specimen URLs stay live** (status Sold, with a link to siblings). Search engine links don't break, and customers can still share their purchase.
- **Accessibility:** the gallery is keyboard-navigable, the lightbox traps focus, and the key facts are a `<dl>`.

# Deliverable 1 — Brand Audit

> **Status: PROVISIONAL.** No logo file or shop photographs were present in the repository when this audit was written (the repository was empty). Everything under "Observed" comes from the written description in the project brief, not from inspecting the artwork. All colour values are **unverified** until the real logo is sampled.
>
> **Action required:** place the logo source files in `assets/brand/` (see `assets/README.md`). The audit will then be re-run: colours sampled from the artwork, contrast re-checked and this document updated.

---

## 1. What is known vs. what is recommended

| Topic | Observed (from brief) | Unknown / must verify | Recommendation |
|---|---|---|---|
| Mark | Clownfish illustration with coral/reef elements | Line style (flat, outlined, gradient, detailed?), whether the fish works small | Use the full illustrated logo only at medium/large sizes; derive a simplified mark for small sizes (see §4) |
| Wordmark | Gold lettering, script style | Exact letterforms, whether wordmark and mark can be separated cleanly | Keep the script **exclusive to the logo**; never set site text in script |
| Colour | Orange and yellow tones; gold lettering | Exact hex values, gradients, outlines, background colour of the artwork | Sample from the vector file; map to tokens in Deliverable 2 |
| Tone | Specialist reef shop, enthusiast audience ("Fanatics") | Existing tone of voice on social media | Calm, knowledgeable, specimen-focused: "collector's gallery", not "pet shop sale" |
| Formats | — | Is there a vector (AI/SVG/PDF) master, or only raster? | A vector master is essential. If only a raster exists, budget for a faithful vector redraw (redraw only, **no redesign**) |

---

## 2. Brand characteristics (interpretation)

From the elements described, the brand already carries:

1. **Warmth and character.** A clownfish is friendly and instantly recognised, and orange/yellow is a warm palette.
2. **Craft.** Gold script lettering reads as boutique and personal rather than corporate.
3. **Subject authenticity.** Reef and coral elements say clearly that this is a specialist, not a general pet store.

**Brand tension to manage.** A friendly illustrated clownfish can tip into "children's aquarium" if it is surrounded by bright colour. The Hybrid Luxury direction fixes this with context: the logo stays exactly as it is, and the website around it is restrained (deep ocean, warm pearl, generous space, real photography). The logo then reads as a heritage mark inside a premium frame. **The logo should be the warmest, most colourful element on most screens. The photography is the only thing that competes with it.**

---

## 3. Colour

### 3.1 Approximate logo colours — TO BE SAMPLED

The brief provides these provisional values. They are consistent with the description ("gold lettering, orange and yellow tones"), but **I have not confirmed them against the artwork**:

| Role | Provisional | Verify against logo |
|---|---|---|
| Logo gold (lettering) | `#DCA923` | Sample the flat area of the lettering; the logo may use a gradient, in which case take the mid-tone for UI use |
| Clownfish orange | `#F07822` | Sample the fish body |
| Clownfish white bands / outlines | not specified | Likely white plus a dark outline; the dark outline colour may make a better "brand dark" than the provisional ocean |
| Yellow | not specified | The brief mentions yellow tones; may be a highlight in the gold |

### 3.2 Recommended supporting palette

Adopted from the brief, with accessibility adjustments that I **calculated** (WCAG 2.x relative luminance):

| Token | Hex | Use | Contrast notes |
|---|---|---|---|
| Deep ocean | `#09212C` | Cinematic sections, footer, primary buttons on light | White text ≈ 15.8:1 ✅ |
| Secondary ocean | `#102B38` | Raised surfaces on dark | — |
| Warm pearl | `#F5F3ED` | Primary light background for shopping pages | — |
| Soft white | `#FFFFFF` | Cards, forms, admin surfaces | — |
| Gold | `#DCA923` | Logo, fine accents **on dark only** | On deep ocean ≈ 7.7:1 ✅. On white ≈ 2.1:1 ❌, so never use for text on light |
| Gold (text on light) — *new* | `#8C6A12` | Gold-toned text/icons on light backgrounds | On white ≈ 5.0:1 ✅ |
| Clownfish orange | `#F07822` | Rare highlight (e.g. "New arrival" dot, sale) | On white ≈ 2.8:1 ❌, so use for non-text only |
| Orange (text on light) — *new* | `#B5520E` | When orange must be text | On white ≈ 4.9:1 ✅ |
| Primary text | `#17272E` | Body and headings on light | — |
| Muted text — *adjusted* | `#5F6E75` (was `#718087`) | Secondary text | The original `#718087` is ≈ 4.1:1 on white and **fails AA** for body text. `#5F6E75` ≈ 5.3:1 on white, ≈ 4.8:1 on pearl ✅. Keep `#718087` for decorative/disabled use only |
| Light border | `#E2E7E7` | Dividers, card borders | — |

**Usage ratio guideline (per screen):**
- Shopping pages: ~85% pearl/white, ~12% ink/ocean, ≤3% gold/orange.
- Cinematic sections: ~70% photography, ~25% deep ocean, ≤5% gold.

---

## 4. Logo variations needed

None of these exist yet as far as I know. All must be **derived from the existing logo, not redesigned**.

| # | Variation | Purpose | Notes |
|---|---|---|---|
| 1 | Primary full-colour logo (master) | Footer, Our Story, packaging | Vector master (SVG + PDF) |
| 2 | Horizontal lockup | Desktop navigation bar (height ~32–40px) | Mark left, wordmark right, if the artwork allows separation |
| 3 | Mark only (clownfish) | Mobile nav, favicon, social avatars, admin | May need a simplified version: fewer details, thicker lines for ≤32px |
| 4 | Reversed version for dark backgrounds | Hero overlay, footer | Check that outlines don't vanish on `#09212C`; may need a thin light keyline |
| 5 | Single-colour gold | Watermark-free premium usage: invoices, receipts, emails | Flat `#DCA923` |
| 6 | Single-colour dark | Printed labels, fax-style receipts, specimen labels | Flat `#17272E` |
| 7 | Favicon set | Browser, iOS, Android | 16/32/48 ICO, 180 apple-touch, 192/512 PNG, SVG favicon |
| 8 | Open Graph image template | Social sharing | 1200×630 with logo over a real reef photograph |

Clear-space rule (proposed): minimum clear space = the height of the clownfish's eye ×4, or 0.25× logo height. Finalise once the artwork is seen.

Minimum sizes (proposed): full logo ≥ 120px wide on screen; mark-only ≥ 24px.

---

## 5. Typography direction

| Role | Recommendation | Rationale |
|---|---|---|
| Display / headings | **Manrope** (600–700) | Geometric-humanist. Large sizes feel confident and modern without looking corporate, and it sits well next to a script logo because it does not compete |
| Body / UI | **Inter** (400–600) | Excellent legibility at small sizes; tabular numerals for prices and specimen IDs |
| Data / IDs | Inter with `font-variant-numeric: tabular-nums`; optionally **JetBrains Mono** for specimen IDs in admin only | Specimen IDs such as `CF-SPS-0142` must be easy to read aloud and match to tank labels |
| Logo script | **Logo only** | Never used for headings or UI |

Both fonts are free (SIL Open Font License) and will be **self-hosted** via `next/font`. That means no Google Fonts runtime dependency and no subscription.

Alternative (if Manrope feels too soft once seen next to the real logo): **Satoshi** or **General Sans** (free from Fontshare) for display. I'll decide after a side-by-side mock with the real logo.

---

## 6. Photography style

Full technical spec: [`photography-spec.md`](./photography-spec.md).

| Category | Style direction |
|---|---|
| Editorial / hero | Wide, immersive reef-tank or display shots; dark negative space for overlaid type; natural colour (no oversaturation); calm composition with one focal point |
| Individual coral specimens | **Top-down, consistent angle, consistent lighting, neutral dark background**, scale reference in a secondary image. This is the "museum catalogue" look that makes each frag feel collectible |
| Fish | Side profile in a photo tank with a plain dark or neutral background; sharp eye |
| Invertebrates | Close, detail-focused |
| Dry goods | Clean, evenly lit, on white or pearl seamless; consistent framing |
| Shop / team | Documentary, natural light, real moments. No posed corporate shots |

**Colour honesty statement (recommended to display on coral pages):** *"Photographed under reef lighting. Colours may vary with your lighting and display."* This protects the shop and builds trust.

---

## 7. Items I need from you

1. Logo in the best available format (AI/EPS/SVG/PDF preferred; else the highest-resolution PNG).
2. Any existing brand guidelines, and the colour codes used by your printer or signage maker.
3. Links to the shop's social accounts (to align tone of voice; I won't copy content without your approval).
4. 20–40 representative photographs (see the photography spec for the shot list).

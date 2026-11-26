# Deliverable 1 — Brand Audit

> **Status: v2, based on the supplied logo** (`assets/brand/logo-source-raster.jpg`, received 26 Nov 2026).
> Colours were **sampled programmatically** from the file (pixel clustering by hue). Contrast ratios were **calculated** (WCAG 2.x). Shop photography has **not** been supplied yet, so the photography section is still a recommendation.

---

## 1. The supplied file

| Property | Observed |
|---|---|
| Format | JPEG, 1290 × 1276 px, white background, no transparency |
| Artwork area | ≈ 920 × 915 px of the canvas (generous white margin, larger at the bottom) |
| Vector master | **Not supplied.** Only this raster exists in the repository |
| Rendering style | Gold elements rendered as **3D metallic/embossed** (highlights, bevels and shadows), not flat colour. The clownfish is **detailed and photo-realistic** with soft shading and a light grey halo outline |

**Implications**
- The raster is good enough for on-screen use up to ~450px wide (at 2× density). It is **not** good enough for print, signage or very small sizes.
- On dark backgrounds the white background must be removed. I produced **interim** derived files automatically (see §6). They are fine for the prototype, but a clean production version needs a **vector redraw of the same design** (a faithful redraw, no redesign).

## 2. What the logo contains (observed)

1. **Circular frame:** a thin gold arc forming an *open* circle (it breaks at the lower left and is interrupted by the script on the right), with a short separate arc beneath "Fanatics".
2. **Clownfish:** orange body, three white bands with black edging, swimming right, positioned in the upper centre. It is the only non-gold element.
3. **Coral:** a gold staghorn/finger coral at the upper left and a fine gold branching (gorgonian/sea-fan-like) coral at the upper right.
4. **Bubbles:** three metallic gold bubbles above the fish.
5. **Wordmark:** "Coral" (large) above "Fanatics" (smaller), in a **flowing brush script** with long swashes (the "l" of Coral rises into the frame; the "s" of Fanatics trails right beyond the circle).

There is no tagline, no blue, and no secondary typeface in the logo.

## 3. Brand characteristics

| Observed | Interpretation |
|---|---|
| Metallic gold dominates (~85% of coloured pixels) | Premium, "trophy/collector" feel. Gold is the brand's true primary colour |
| Single realistic clownfish in full colour | Warmth and approachability; the fish is the focal point and the most recognisable element |
| Script lettering with expressive swashes | Personal, crafted, boutique |
| Circular badge composition | Reads as a seal/emblem, which suits a specialist shop. It is a *badge*, not a horizontal logo |

**Brand tension (confirmed):** the metallic gold and realistic fish are rich and ornamental. If the website were also ornamental, the result would look busy. The approved Hybrid Luxury direction (restrained typography, calm surfaces, real photography) is the right counterweight. **The logo is the only ornamental element on any page.**

## 4. Colours

### 4.1 Sampled from the logo

| Element | Sampled range | Representative | Notes |
|---|---|---|---|
| Gold, highlight | `#F4DD69` – `#FAE673` | `#F4DD69` | Specular highlights |
| **Gold, mid-tone** | median of ≈185k gold pixels | **`#EBC455`** (median `#EFCA57`) | Use as the flat brand gold |
| Gold, shadow | `#B3904C` – `#D1B54A` | `#B3904C` | Bevel shadows |
| **Clownfish orange** | `#C45C29` – `#E78932` | **`#E2762E`** (median `#DE7031`) | Very close to the provisional `#F07822`; slightly deeper |
| Fish outline / dark | `#0D0503` – `#241A18` | `#1A0F0D` | Warm brown-black |
| Fish bands | near white | `#FFFFFF` | — |

### 4.2 What changed from the provisional palette

| Provisional | Finding | Decision |
|---|---|---|
| Gold `#DCA923` | The logo's gold is **lighter and yellower** (≈ `#EBC455`). `#DCA923` is more orange and saturated than anything in the logo | **Replace** with `#EBC455` |
| Orange `#F07822` | The logo's orange is ≈ `#E2762E` | **Adjust** to `#E2762E` |
| Ocean blues | **Not present in the logo.** They are a supporting choice to frame the gold, not a logo colour | Keep, as approved |

### 4.3 Final palette (approved recommendations + sampled values)

| Token | Hex | Role | Contrast (calculated) |
|---|---|---|---|
| Deep ocean | `#09212C` | Cinematic backgrounds, primary buttons on light | White text 15.8:1 |
| Secondary ocean | `#102B38` | Raised dark surfaces | — |
| Warm pearl | `#F5F3ED` | Shopping page background | — |
| Soft white | `#FFFFFF` | Cards, forms, admin | — |
| **Brand gold** | **`#EBC455`** | Fine accents and gold UI **on dark only** | On ocean **9.9:1** ✅ · on white 1.7:1 ❌ |
| Gold highlight | `#F4DD69` | Rare: hover state of gold on dark | On ocean 12.2:1 |
| Gold shadow | `#B3904C` | Hairlines/borders on dark, decorative only | On ocean 5.5:1 |
| **Gold ink** (text on light) | **`#84661A`** | Gold-toned text/icons on pearl or white | White 5.4:1 ✅ · pearl 4.9:1 ✅ |
| **Clownfish orange** | **`#E2762E`** | Non-text accents (e.g. "New" dot) | White 3.1:1 (non-text OK) · ocean 5.4:1 |
| Orange ink | `#B5520E` | Orange text on light | White 5.0:1 ✅ · pearl 4.5:1 ✅ |
| Primary text | `#17272E` | Body text | White 15.4:1 |
| Muted text | `#5F6E75` | Secondary text | White 5.3:1 · pearl 4.8:1 ✅ |
| Light border | `#E2E7E7` | Dividers | — |

The ratio guidance is unchanged: gold and orange together stay at ≤ 3–5% of any screen.

## 5. Typography

Unchanged and confirmed. **Manrope** (display) and **Inter** (text) contrast cleanly with the brush script. A geometric sans next to an expressive script is a classic, legible pairing, and neither competes with the logo. The script stays exclusive to the logo.

## 6. Logo variations

| # | Variation | Status | File |
|---|---|---|---|
| 1 | Original raster (source of truth) | ✅ Supplied | `assets/brand/logo-source-raster.jpg` |
| 2 | Full badge, transparent background (for dark sections) | 🟡 **Interim**, derived automatically. Minor edge artifacts around the fish's white bands; acceptable for the prototype | `assets/brand/logo-transparent.png` |
| 3 | Clownfish mark only (favicon, mobile nav, social avatar, admin) | 🟡 **Interim**, extracted from the badge | `assets/brand/mark-clownfish.png` |
| 4 | Vector master (SVG/PDF) of the full badge | ❌ Needed for production and print | — |
| 5 | **Flat** gold version (no metallic effect) | ❌ Recommended: the metallic effect turns muddy below ~80px and can't be printed in one ink | — |
| 6 | Single-colour dark (`#17272E`) and white versions | ❌ For labels, receipts and engraving | — |
| 7 | Favicon set (from the clownfish mark) | 🟡 Generated in Phase 1 from #3 | — |

**Horizontal lockup.** Because the logo is a circular badge with the wordmark inside the circle, it **cannot be split** into an icon + wordmark without redesign, so I won't do that. The navigation uses the **full badge at 48–56px height**. At that size the gold circle and orange fish read clearly, but the script does not. The script reads legibly from ~160px wide, which is where the badge appears large: hero (optional), footer, Our Story, emails and packing slips.

**Minimum sizes (measured from the artwork):** full badge ≥ 160px wide for the script to be legible; ≥ 40px as a recognisable emblem; below 40px use the clownfish mark.

**Clear space:** ≥ 15% of the badge diameter on all sides.

**Recommendation (needs a designer, not urgent for the prototype):** commission a faithful vector redraw (variations 4–6). This is a one-off cost, typically quoted per job. I'll flag it again before launch.

## 7. Photography style

Unchanged; see [`photography-spec.md`](./photography-spec.md). One addition from the logo: the logo's gold is warm and yellow, so **hero photography with warm or neutral light** (not deep actinic blue) will harmonise better around it. Coral specimen photos must still show true reef-light colour; this note applies to editorial and hero images only.

## 8. Still needed from the shop
- Vector logo, if one exists (ask whoever designed it), or approval to commission a redraw.
- Shop photography (photo shoot / shot list), which is **placeholder** for now.

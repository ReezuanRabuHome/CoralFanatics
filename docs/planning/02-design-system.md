# Deliverable 2 — Visual Design System

> ## Revision 2 (26 Nov 2026): supersedes the sections below where they conflict
>
> **Why:** owner feedback on the first prototype was that it looked AI-generated and nothing like the Apple-level quality requested. The causes were decoration: gold uppercase labels on every section, badges/pills on every card, dashed placeholder boxes with icons and captions, bracketed `[TBC]` text, heavy navy throughout, and a repeated "headline left / link right" pattern.
>
> **Principles now:** let type and photography do the work; remove anything that is not content.
>
> | Area | Revision 2 |
> |---|---|
> | Typeface | **Inter only**, with optical sizing (display cut at large sizes). Manrope dropped. Body 17px / 1.47, headlines weight 650 with tight tracking (−0.03em) |
> | Surfaces | White and neutral mist `#F5F5F4` for most of the site. Deep ocean `#05141B` only for the hero, coral tiles and the story section. Warm pearl dropped (read as beige) |
> | Text | Ink `#141617`; secondary `#6B6F73` |
> | Action colour | Reef blue `#0B5F7D` for primary buttons and text links (`#6CC3E0` on dark). Gold appears only in the logo; coral orange only as the small "New" label |
> | Navigation | 48px translucent bar with blur, 13px links, badge at 34px. Dark only while over the homepage hero |
> | Composition | Centred headline + one-line subhead + filled button + text link with chevron. Large rounded tiles (28px radius) with text at the top and photography filling the tile. Horizontal "shelves" of cards with a two-tone heading |
> | Cards | White, 20px radius, soft shadow, no border, no badges. Photo, name, ID (specimens), price. Availability text only when it changes what the customer can do ("Reserved in checkout", "Sold out", "Only 2 left") |
> | Product pages | Large single image with dot pagination; right column: name, price, one button, fulfilment in a soft panel, facts as hairline rows. Details as editorial sections, not tabs |
> | Filters | One "Filter" control opening a side sheet (bottom sheet on mobile); chip-style options |
> | Placeholders | Flat tone with a single small "Photo placeholder" label; shot descriptions live in `aria-label`/`title` and the photography spec. Placeholder business facts written as plain copy ("to be confirmed") |
> | Footer | Light mist, 12px, hairline dividers |
> | Motion | One subtle reveal on homepage headings (scroll-driven, reduced-motion aware); hover lift on cards |
>
> Apple is the benchmark for *quality and restraint*. We do not use its branding, blue, typeface, iconography or copy.

Name: **Reef** (internal design-system name).
Implementation: Tailwind CSS v4 theme tokens (CSS variables) + shadcn/ui components restyled to these tokens. All values below map 1:1 to tokens in `src/styles/tokens.css`.

Two **surface modes**:
- **Ocean** (dark): homepage cinematic sections, Our Story, footer.
- **Pearl** (light): all shopping, product, cart, checkout and account pages; admin uses a variant called **Admin** (white, denser).

---

## 1. Colour tokens

### 1.1 Primitives

```css
--ocean-950: #061820;  /* deepest, footer base */
--ocean-900: #09212C;  /* Deep ocean (brand) */
--ocean-800: #102B38;  /* Secondary ocean */
--ocean-700: #1A3A49;
--ocean-600: #2A5062;
--ocean-300: #8FA6B0;
--ocean-100: #DCE5E8;

--pearl-50:  #FFFFFF;  /* Soft white */
--pearl-100: #F5F3ED;  /* Warm pearl */
--pearl-200: #ECE9E1;
--pearl-300: #E2E7E7;  /* Light border */

--ink-900:   #17272E;  /* Primary text */
--ink-600:   #5F6E75;  /* Muted text (AA-adjusted) */
--ink-400:   #718087;  /* Decorative / disabled only */

--gold-300:  #F4DD69;  /* Logo highlight: hover on dark */
--gold-500:  #EBC455;  /* Brand gold (sampled from logo): on dark only */
--gold-600:  #B3904C;  /* Logo shadow: hairlines on dark, decorative */
--gold-700:  #84661A;  /* Gold ink: text on light */
--gold-100:  #F7EDCF;  /* Gold tint background */

--orange-500:#E2762E;  /* Clownfish (sampled from logo): non-text accents */
--orange-700:#B5520E;  /* Orange text on light */

--green-600: #2F7D5B;  --green-100: #E3F1EA;
--amber-600: #A86A0C;  --amber-100: #FBEFD9;
--red-600:   #B4412F;  --red-100:   #F8E3DF;
--blue-600:  #2A6F8F;  --blue-100:  #E0EEF4;
```
*(Gold and orange sampled from the supplied logo, 26 Nov 2026; see Deliverable 1 §4.)*

### 1.2 Semantic tokens

| Token | Pearl mode | Ocean mode |
|---|---|---|
| `--bg` | pearl-100 | ocean-900 |
| `--bg-raised` | pearl-50 | ocean-800 |
| `--text` | ink-900 | pearl-100 |
| `--text-muted` | ink-600 | ocean-300 |
| `--border` | pearl-300 | ocean-700 |
| `--accent` | gold-700 | gold-500 |
| `--action-primary-bg` | ocean-900 | pearl-100 |
| `--action-primary-fg` | pearl-50 | ocean-900 |
| `--focus-ring` | ocean-600 (2px) + 2px offset | gold-500 (2px) + 2px offset |

### 1.3 Status tokens (shared by storefront and admin)

| Status | Fg | Bg | Used for |
|---|---|---|---|
| success | green-600 | green-100 | Available, Paid, Delivered |
| warning | amber-600 | amber-100 | Reserved, Low stock, Awaiting payment |
| danger | red-600 | red-100 | Sold out, Failed, Refund needed |
| info | blue-600 | blue-100 | Preparing, Ready for collection |
| neutral | ink-600 | pearl-200 | Draft, Archived, Unavailable |

**Rule:** status is **never shown by colour alone**. Always include a text label, and in admin a shape-coded dot too.

---

## 2. Typography

Fonts are self-hosted via `next/font`: **Manrope** (display) and **Inter** (text/UI). Prices and IDs use `tabular-nums`.

Fluid scale (`clamp(min, preferred, max)`):

| Token | Font | Size (mobile → desktop) | Line height | Weight | Tracking | Use |
|---|---|---|---|---|---|---|
| `display-xl` | Manrope | 44 → 96px | 1.02 | 600 | −0.03em | Homepage hero only |
| `display-l` | Manrope | 36 → 72px | 1.05 | 600 | −0.025em | Section headlines ("One of a kind.") |
| `h1` | Manrope | 30 → 48px | 1.1 | 600 | −0.02em | Page titles, PDP product name |
| `h2` | Manrope | 24 → 32px | 1.2 | 600 | −0.015em | Sub-sections |
| `h3` | Manrope | 19 → 22px | 1.3 | 600 | −0.01em | Card groups, panels |
| `body-l` | Inter | 17 → 19px | 1.6 | 400 | 0 | Lead paragraphs |
| `body` | Inter | 16px | 1.6 | 400 | 0 | Default |
| `body-s` | Inter | 14px | 1.5 | 400 | 0 | Secondary info |
| `label` | Inter | 13px | 1.3 | 500 | 0.01em | Form labels, card meta |
| `eyebrow` | Inter | 12px | 1.2 | 600 | 0.12em, UPPERCASE | Section kickers ("SPS CORALS") |
| `price` | Inter | 18 → 20px | 1.2 | 600 | tabular | Prices |
| `id` | Inter | 12–13px | 1.2 | 500 | 0.04em, tabular | Specimen IDs |

Rules:
- Maximum two weights per screen besides labels.
- Body copy max width **68ch**.
- Headlines end with a full stop as in the brief ("Nature's finest details."). This is a deliberate, calm editorial voice.
- No script, no italics for emphasis in headlines.

---

## 3. Spacing

Base unit **4px**. Tokens: `0, 1(4), 2(8), 3(12), 4(16), 5(20), 6(24), 8(32), 10(40), 12(48), 16(64), 20(80), 24(96), 32(128), 40(160)`.

| Context | Mobile | Desktop |
|---|---|---|
| Section vertical padding (cinematic) | 96px | 160px |
| Section vertical padding (shopping) | 48px | 80px |
| Card inner padding | 16px | 20px |
| Grid gap (product grid) | 12px | 24px |
| Form field vertical rhythm | 20px | 24px |

---

## 4. Grid and layout widths

| Breakpoint | Width | Columns | Gutter | Side margin |
|---|---|---|---|---|
| `sm` | 0–639 | 4 | 12px | 16px |
| `md` | 640–1023 | 8 | 16px | 24px |
| `lg` | 1024–1279 | 12 | 24px | 40px |
| `xl` | 1280–1535 | 12 | 24px | 56px |
| `2xl` | ≥1536 | 12 | 32px | auto (content max) |

Container widths:
- `--w-full`: 100% (cinematic imagery, full-bleed)
- `--w-wide`: 1440px (product grids, homepage sections)
- `--w-content`: 1200px (PDP, checkout two-column)
- `--w-text`: 720px (story, policies)
- `--w-narrow`: 480px (sign-in, single-column forms)

---

## 5. Buttons

| Variant | Pearl mode | Ocean mode | Use |
|---|---|---|---|
| **Primary** | ocean-900 bg / white text | pearl-100 bg / ocean-900 text | One per view: Add to bag, Pay, Explore |
| **Secondary** | transparent, 1px ink-900 border | transparent, 1px pearl-100/60% border | Supporting actions |
| **Ghost / text link** | ink-900 text, underline on hover | pearl-100 | "View all SPS →" |
| **Accent** (rare) | gold-500 bg / ocean-900 text, **on Ocean mode only** | — | Homepage final CTA only |
| **Destructive** (admin) | red-600 bg / white | — | Delete, refund |

Sizes: `sm` 36px, `md` 44px (default, the minimum touch target), `lg` 56px (PDP add-to-bag, checkout pay).
Shape: **radius 999px (pill)** for storefront primary/secondary; **6px** for admin.
States: hover darkens 8% / lightens 8%; active scales 0.98; disabled 40% opacity with `not-allowed`; loading shows a spinner and keeps the button width; focus is the token ring.
Label style: `label` scaled to 15px, weight 600, sentence case.

---

## 6. Navigation

**Desktop header** (height 72px):
`[Badge]   New Arrivals  Corals  Marine Life  Equipment  Our Story     [Search] [Account] [Bag (n)]`

- **Logo in nav:** the full circular badge at 52px (desktop) / 40px (mobile). The badge can't be split into icon + wordmark, so there is no horizontal lockup (see Brand Audit §6).
- On the homepage hero: transparent over the image with the transparent-background badge and white text, and a subtle top gradient (ocean-900 at 40% to transparent, 160px) **only to protect legibility**. Not decorative.
- After scrolling 80px: becomes pearl-100 at 92% with backdrop blur, ink text, the same badge, and a 1px border underneath.
- **Mega-menu** (Corals / Marine Life / Equipment): a single-row panel with sub-categories as text links on the left and one real photo tile ("New this week: 14 SPS") on the right. Opens on hover with a 120ms intent delay, or on click/keyboard.

**Mobile header** (56px): `[☰] [Badge 40px] [Search] [Bag]`. The menu is a full-height sheet with large category rows, then Account, Visit the shop, and Contact.

**Recommendation:** replace "Discover" with **"New Arrivals"**. Reef customers check for new drops repeatedly; this is the highest-intent navigation item for a livestock shop. "Discover" has no clear destination in v1 (there is no editorial/guides section yet). If you prefer to keep "Discover", it can point to the homepage collections.

**Footer** (Ocean mode): 4 columns (Shop, Help, Visit, Follow) plus a bottom bar with policies and ©. On mobile these become accordions, except "Visit" (address and hours), which is always expanded.

---

## 7. Product cards

### 7.1 Specimen card (unique livestock)
```
┌──────────────────────┐
│                      │  1:1 image, radius 12px,
│      [photo]         │  dark neutral bg behind image
│               ◆ 1/1  │  ← "One of a kind" micro-badge (gold-700 on pearl)
├──────────────────────┤
│ Fox Flame Acropora   │  h3-ish (16px/600)
│ CF-SPS-0142          │  id token, muted
│ S$85        ● Avail. │  price + status
└──────────────────────┘
```
- Hover (desktop): image swaps to the 2nd photo (if present) with a 250ms cross-fade; no zoom jump.
- Reserved: the card shows an amber "In someone's checkout" label and the button is disabled. It becomes available again automatically if that payment fails.
- Sold: shown only in "Recently sold" contexts, with the image desaturated 40% and a "Sold" label. Builds credibility without cluttering the shop.

### 7.2 Quantity product card (fish/inverts/dry goods)
Same skeleton, minus the ID; shows "From S$12" when there are variants, and a stock hint ("Only 3 left" when ≤ low-stock threshold). Dry goods images sit on a white background.

### 7.3 Editorial collection panel
4:5 full-bleed photo, eyebrow + display-l headline bottom-left, 1px pearl hairline arrow link. Ocean mode.

---

## 8. Forms

- Labels **above** fields (never placeholder-only labels).
- Field height 48px; radius 10px; 1px border `--border`; focus border ocean-600 plus ring.
- Error: red-600 text below the field with an icon, plus `aria-describedby`. Validate on blur, and again on submit.
- Helper text in `body-s` muted.
- Singapore specifics: phone field prefilled `+65`; 6-digit postal code with address lookup (OneMap, free government API) to auto-fill the street; unit number as a separate field (`#12-345`).
- Checkboxes and radios are 20px, with large clickable rows for delivery/collection choice ("choice cards").

## 9. Tables (admin)

- Row height 44px (comfortable) / 36px (compact toggle).
- Sticky header, zebra off, row hover pearl-100.
- Numbers right-aligned, tabular; money always shown as `S$1,234.50`.
- First column = identifier (order no. / specimen ID) as a link.
- Row actions in a trailing "…" menu; bulk select checkbox column.
- Empty state: one line of explanation plus a primary action.
- On mobile the table collapses into stacked cards with the 3–4 key fields.

## 10. Badges

| Badge | Style |
|---|---|
| Status (Available, Reserved, Sold, Paid…) | Pill, 24px high, status bg/fg tokens, 6px dot + text |
| "One of a kind" | Gold-700 outline diamond + text, pearl bg (storefront only) |
| "New arrival" | Orange-500 dot + ink text "New" |
| "Representative photo" | Neutral pill on fish/invert images where applicable |
| Care level (Beginner / Intermediate / Expert) | Neutral outline pill |

Never stack more than **two** badges on a card.

## 11. Modals, drawers and toasts

- **Bag drawer** (right side, 420px desktop, full-width mobile sheet): opens when something is added; lists items, subtotal and a "Checkout" primary button.
- **Modal dialogs**: max 560px, radius 16px, ocean-950 at 50% overlay; focus-trapped; Esc closes; used sparingly (confirmations, admin edits).
- **Image lightbox** (PDP): full-screen ocean-950, swipe/arrow navigation, pinch/scroll zoom on the 2400px image.
- **Toasts**: bottom-centre (mobile) / bottom-right (desktop), 4s, used for "Added to bag" and admin save confirmations.
- **Bottom sheets** (mobile filters): 85% height, drag handle, sticky "Show 24 results" button.

## 12. Image treatments

- Radius: 12px for cards and gallery thumbs; **0** for full-bleed editorial and hero.
- Specimen images sit on an `ocean-950` letterbox so frags with different backgrounds still look like one catalogue.
- No filters, no colour grading, no duotone on product photography.
- Text over photographs: only on editorial imagery, with a localised scrim (gradient from ocean-900 at 60% to transparent, behind the text block only). Contrast must meet 4.5:1.
- Loading: dominant-colour blur placeholder, then a fade-in over 300ms.
- Aspect ratios are fixed per slot (see the photography spec) to prevent layout shift.

## 13. Responsive behaviour

| Element | Mobile (sm) | Tablet (md) | Desktop (lg+) |
|---|---|---|---|
| Product grid | 2 columns | 3 columns | 4 columns (5 on 2xl for corals) |
| Homepage collection panels | Horizontal swipe carousel (peek next) | 2 + 1 | 3 across |
| PDP | Gallery swipe → info stacked; **sticky bottom "Add to bag" bar** | Same, wider | Two columns: gallery 7/12 (sticky), info 5/12 |
| Filters | Bottom sheet | Bottom sheet | Left sidebar 260px (collapsible) |
| Checkout | Single column; summary collapsed at top | Single column | Two columns: form 7/12, summary 5/12 (sticky) |
| Admin | Bottom tab bar + stacked cards (key flows only: specimens, orders) | Collapsible sidebar | Fixed sidebar 240px |

Mobile is designed first for the storefront, because most reef-hobbyist browsing happens on phones, often while standing in front of their own tank.

## 14. Motion and animation

| Token | Duration | Easing | Use |
|---|---|---|---|
| `motion-fast` | 150ms | `cubic-bezier(.2,.8,.2,1)` | Hover, focus, button press |
| `motion-base` | 250ms | same | Drawers, image swap, dropdowns |
| `motion-slow` | 500ms | `cubic-bezier(.16,1,.3,1)` | Section reveal on scroll (homepage only) |

Principles:
- **Homepage**: sections fade and rise 16px once as they enter the viewport. The hero has no parallax; the optional hero video is the only "big" motion.
- **Shopping pages**: almost no motion besides feedback (add-to-bag tick, drawer slide).
- **Admin**: no decorative motion.
- `prefers-reduced-motion`: all reveals become instant and the video is replaced by its poster image.
- Never animate prices, stock, or anything that affects a decision.
- Implemented with CSS and the native View Transitions API where supported; **no heavy animation library** in v1.

## 15. Iconography

**Lucide** (free, MIT; it ships with shadcn/ui), 1.5px stroke, 20/24px. Custom icons only for coral parameters (lighting, flow, placement, difficulty), drawn in the same stroke style.

## 16. Accessibility baseline (WCAG 2.2 AA)

Text contrast ≥ 4.5:1 (large ≥ 3:1); touch targets ≥ 44px; full keyboard navigation; visible focus; semantic landmarks; alt text required in admin; forms announce errors; no information conveyed by colour alone.

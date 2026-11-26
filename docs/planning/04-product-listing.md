# Deliverable 4 — Product Listing Design

## 1. Category structure and URLs

```
/shop                          All products
/new-arrivals                  Newest available items (livestock-first)
/corals                        All corals
  /corals/sps                  SPS
  /corals/lps                  LPS
  /corals/mushrooms            Mushrooms (incl. Ricordea, Rhodactis, Discosoma)
/marine-life/fish              Marine fish
/marine-life/invertebrates     Invertebrates
/equipment                     Equipment (sub-categories: Lighting, Filtration, Pumps, Testing…)
/additives                     Additives & maintenance
/search?q=                     Search results
```
Sub-categories (e.g. Acropora under SPS) are **managed in the admin**, not hard-coded. Each listing page is server-rendered with clean URLs for SEO. Filters live in query parameters (`?colour=green&light=high`) so filtered views can be shared, and they are set to `noindex`.

## 2. Page layout

```
DESKTOP (lg+)
┌───────────────────────────────────────────────────────────────┐
│ Header                                                         │
├───────────────────────────────────────────────────────────────┤
│ Eyebrow: CORALS                                                │
│ H1: SPS corals.                              [optional 21:9    │
│ One-line description (muted)                  category banner] │
├───────────────────────────────────────────────────────────────┤
│ Sub-cat chips: All · Acropora · Montipora · …                  │
├────────────┬──────────────────────────────────────────────────┤
│ FILTERS    │ 64 specimens · [✓ In stock only]   Sort: Newest ▾│
│ (260px,    │ Active: [Green ×] [High light ×]  Clear all       │
│ collapsible│ ┌────┐┌────┐┌────┐┌────┐                         │
│ accordion) │ │card││card││card││card│   4-col grid (5 on 2xl) │
│            │ └────┘└────┘└────┘└────┘                         │
│            │ …                                                │
│            │        [ Load more (24 of 64) ]                  │
└────────────┴──────────────────────────────────────────────────┘

MOBILE
┌──────────────────────┐
│ H1 + 1-line desc     │
│ Chips (h-scroll)     │
│ [Filter (2)] [Sort ▾]│  ← sticky bar under header on scroll up
│ ┌────┐┌────┐         │
│ │card││card│  2-col  │
│ └────┘└────┘         │
│ [ Load more ]        │
└──────────────────────┘
```

- **Pagination:** a "Load more" button (24 items per page) with URL `?page=2` for crawlability, rather than infinite scroll. It keeps the footer reachable and the back button predictable.
- **Scroll restoration:** coming back from a PDP returns the visitor to the same position.
- **Empty filtered result:** "No corals match these filters." with "Clear filters" and a "Notify me about new SPS" placeholder (v1.1).

## 3. Filters (deliberately limited)

Filters are configured **per category** in the admin. Defaults:

| Category | Filters (max 6) |
|---|---|
| Corals (all / SPS / LPS / Mushrooms) | Sub-type · Colour · Price · Lighting · Flow · Care level |
| Marine fish | Sub-type (Clownfish, Tangs, Wrasses…) · Reef safe · Care level · Price |
| Invertebrates | Sub-type (Shrimp, Snails, Crabs, Urchins…) · Reef safe · Price |
| Equipment | Sub-type · Brand · Price |
| Additives | Sub-type · Brand · Price |

- **Availability:** a single toggle, **"In stock only"**, default ON for livestock (customers only see what they can buy), with "Show recently sold" as an opt-in.
- **Placement** (top/middle/bottom) is shown on the PDP but **not** as a filter in v1; it overlaps with Lighting and adds clutter.
- **Colour** uses a curated tag set (Green, Blue, Purple, Pink/Red, Orange/Yellow, Multi-colour, Rainbow) with swatches. It is a staff-assigned tag, not automatic.
- **Price:** preset ranges (Under S$50 · S$50–100 · S$100–250 · S$250+) rather than a slider (better on mobile and for accessibility).
- Desktop filters apply instantly; the mobile bottom sheet applies on "Show 24 results".
- Facet counts are shown ("Green (12)"), and options with zero results are hidden.

## 4. Sorting

| Option | Default for |
|---|---|
| **Newest** | Corals, Fish, Inverts, New arrivals |
| **Featured** (staff order) | Equipment, Additives |
| Price: low to high | — |
| Price: high to low | — |

## 5. Product card rules — unique livestock vs. ordinary products

| Aspect | Unique specimen (coral, select fish) | Quantity product (most fish, inverts, dry goods) |
|---|---|---|
| What the card represents | **One physical item** | A product line (may have variants) |
| Image | The exact specimen's photo | Product photo (labelled "Representative photo" for livestock where applicable) |
| Title | Species/common name, e.g. "Fox Flame Acropora" | Product name |
| Secondary line | **Specimen ID** `CF-SPS-0142` | Brand (dry goods) or size range (fish) |
| Price | Exact price, `S$85` | `S$32` or `From S$32` |
| Availability | Available / In someone's checkout / Sold | In stock / Only n left / Sold out |
| Badge | "One of a kind" diamond | "New" if within 14 days |
| Quick add (desktop) | "Add to bag" (no quantity) | "Add to bag" if single variant; else "Choose options" |
| Sold state | Disappears from default listing; appears in "Recently sold" | "Sold out" card stays (de-prioritised to the end) |

### Grouping specimens of the same species
A species such as "Fox Flame Acropora" may have 5 specimens. **Recommendation:** listings show **every specimen as its own card** (the collector browses pieces, not SKUs). On each specimen's PDP, an "Other Fox Flame pieces" strip shows its siblings. This matches how hobbyists shop ("I want *that* one").

An optional admin setting per category, "Group by species", shows one card per species with "5 pieces from S$65". It is useful if a category ever has dozens of near-identical frags.

## 6. New Arrivals page
- Grouped by day: "Today", "This week", "Earlier".
- Mixed livestock (corals, fish, inverts), using the same cards.
- Becomes the most-visited livestock page; it is linked from the nav, the homepage hero and order-confirmation emails.

## 7. Search
- Header search opens an overlay with instant results (debounced 200ms), grouped by type: Corals, Marine life, Equipment, plus matching categories.
- It matches common names, scientific names, specimen IDs (typing `0142` finds `CF-SPS-0142`) and brands.
- Implemented with PostgreSQL full-text search plus `pg_trgm` for typo tolerance. **No paid search service.**

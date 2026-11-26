# Deliverable 3 — Homepage Wireframe

**Rhythm:** Ocean → Pearl → Ocean → Pearl → Ocean. The page alternates cinematic dark sections with calm light shopping sections, so the visitor never spends long in either mode and every product shelf sits on a clean light background.

## Recommended structure (with changes from the brief)

| # | Section | Mode | Change vs. brief |
|---|---|---|---|
| A | Navigation | over hero → pearl on scroll | "Discover" → **New Arrivals** (recommended) |
| B | Cinematic hero | Ocean | — |
| B2 | **Service strip** | Pearl | **Added**: one line of trust facts. Livestock buyers need to know about delivery and collection before they browse |
| C | Coral collections — "Nature's finest details." | Ocean | — |
| D | Featured specimens — "One of a kind." | Pearl | Now driven by **newest available specimens** so it refreshes itself without staff effort |
| E | Marine life — "Bring your reef to life." | Ocean | — |
| F | Equipment — "Everything your reef needs." | Pearl | — |
| G | Brand story — "Driven by a passion for the reef." | Ocean | Merged with a **Visit the shop** block (address, hours, map link). A physical shop is a trust signal and a sales channel |
| H | Final CTA — "Your next reef begins here." | Ocean (deepest) | — |
| I | Footer | Ocean | — |

All section content except fixed headlines is **managed in the admin** (Settings → Homepage): choosing the hero image, collection images and featured products. Placeholders are marked until you supply real photography.

---

### A. Navigation
- **Purpose:** wayfinding with minimal visual weight; brand presence.
- **Layout and content:** see Design System §6. Logo left; 5 category links; Search, Account and Bag icons on the right. The bag shows a count badge.
- **Photography:** none.
- **CTA:** Bag.
- **Desktop:** transparent over the hero with the reversed (light) logo; turns solid pearl on scroll.
- **Mobile:** 56px bar with menu, logo, search and bag; the menu opens as a full-screen sheet with large category rows plus the shop address and hours at the bottom.

### B. Cinematic hero
- **Purpose:** an immediate emotional "this is a specialist reef gallery" signal.
- **Content:**
  - Eyebrow: `CORAL FANATICS · SINGAPORE`
  - Headline (`display-xl`): **A world beneath the surface.**
  - Supporting (`body-l`, max 40ch): *Discover exceptional corals, marine life and everything you need to build your own reef.*
  - Primary CTA: **Explore the collection** → `/corals` (or `/new-arrivals`)
  - Secondary text link: **See new arrivals →**
- **Photography:** one real wide display-tank image (or a 10–20s muted looping video with a poster frame), darker top-left area for text. Mobile uses a separate 4:5 art-directed crop. **Placeholder until supplied:** a solid ocean-900 block labelled "HERO PHOTO PLACEHOLDER".
- **Desktop:** 100vh (min 640px, max 960px). Text block anchored bottom-left at 8% inset within the 1440 container. A small scroll cue appears at the bottom centre (a static chevron, not animated).
- **Mobile:** 88svh. Text is anchored at the bottom over the localised scrim; the CTA is full-width.

### B2. Service strip
- **Purpose:** answer the first practical questions in one line.
- **Content** (3–4 items, icon + short text; **all wording to be confirmed by the shop**):
  `Same-day livestock delivery in Singapore*` · `Collect from our shop in [area]*` · `Secure checkout with PayNow & cards` · `[Live-arrival guarantee*]`
  *Items marked * are placeholders. I won't publish delivery or guarantee claims until you confirm the actual policy.*
- **Desktop:** a single row, 64px high, pearl-100, centred, muted text.
- **Mobile:** a horizontal auto-width scroll row (no auto-advance carousel).

### C. Coral collections: "Nature's finest details."
- **Purpose:** route visitors by coral type with editorial impact.
- **Content:** eyebrow `CORALS`; headline; three panels: **SPS**, **LPS**, **Mushrooms**, each with a one-line descriptor (e.g. "Small-polyp stony: colour and structure") and a live count ("38 available").
- **Photography:** three real 4:5 coral photographs, one per type.
- **CTA:** each panel links to its category; a text link "Shop all corals →".
- **Desktop:** headline left-aligned over 12 columns; three equal 4:5 panels across `--w-wide`; on hover the image eases to scale 1.02 over 500ms.
- **Mobile:** headline, then a horizontal swipe carousel with 85% panel width so the next panel peeks in; snap scrolling.

### D. Featured specimens: "One of a kind."
- **Purpose:** convert. Shows the unique-specimen proposition immediately.
- **Content:** eyebrow `JUST IN`; headline; subline *"Every coral below is the exact piece you'll receive."*; 8 specimen cards (photo, name, specimen ID, price, availability). The source is a choice in the admin: *Newest available* (default) or *Hand-picked*.
- **Photography:** real specimen photographs only. If fewer than 4 specimens with real photos exist, **the section hides itself** rather than showing placeholders.
- **CTA:** "View all new arrivals →"; each card opens its PDP; a quick "Add to bag" appears on hover/focus on desktop.
- **Desktop:** 4 × 2 grid.
- **Mobile:** 2 × 2 grid with a "View all" button (not a carousel, so prices are scannable).

### E. Marine life: "Bring your reef to life."
- **Purpose:** introduce fish and invertebrates.
- **Content:** headline; two large panels (**Marine fish**, **Invertebrates**) plus a row of 4 product cards in a light card style inside the dark section.
- **Photography:** a real fish photo and a real invertebrate photo for the panels.
- **CTA:** "Shop marine fish", "Shop invertebrates".
- **Desktop:** asymmetric layout, with a 7/12 panel (fish) and 5/12 panel (inverts), then 4 cards below.
- **Mobile:** stacked panels (4:5), then a 2-column grid of 4 cards.

### F. Equipment and essentials: "Everything your reef needs."
- **Purpose:** practical cross-sell; signals that the shop is a full-service supplier.
- **Content:** headline; category chips (Lighting, Filtration, Salt & Testing, Additives, Food); 8 product cards (hand-picked or best-sellers).
- **Photography:** clean product shots on white.
- **CTA:** "Shop equipment →" and "Shop additives →".
- **Desktop:** chips row above a 4 × 2 card grid; cards are white on a pearl background.
- **Mobile:** chips in a horizontal scroll; a 2-column grid showing 4 cards plus a "View all" button.

### G. Brand story + Visit: "Driven by a passion for the reef."
- **Purpose:** trust and personality; drive in-store visits.
- **Content:** 2–3 short paragraphs **supplied by the shop**; a team or shop photo; a **Visit** block with address, opening hours, "Get directions" (Google Maps link: free, no API key), phone and WhatsApp.
- **Photography:** real shop interior and team. **Placeholder until supplied.**
- **CTA:** "Our story →" and "Get directions".
- **Desktop:** two columns, a 3:2 image (7/12) and text (5/12); the Visit block sits below as a slim 3-column info row.
- **Mobile:** image, then text, then the Visit block as stacked rows.

### H. Final CTA: "Your next reef begins here."
- **Purpose:** close the page with a single clear action.
- **Content:** headline centred; one line of supporting text; **Accent (gold) button** "Explore the collection"; secondary link "Visit the shop".
- **Photography:** optional subtle full-bleed reef image at low exposure, or plain ocean-950.
- **Desktop:** 60vh, centred text.
- **Mobile:** 70svh, centred, full-width button.

### I. Footer
- **Content:**
  - **Shop:** Corals (SPS, LPS, Mushrooms), Marine fish, Invertebrates, Equipment, Additives, New arrivals.
  - **Help:** Collection & delivery, Livestock policy, Shipping zones, FAQ, Contact.
  - **Visit:** address, opening hours, phone, WhatsApp, email.
  - **Follow:** Instagram, Facebook, TikTok, YouTube (only the accounts that exist).
  - Bottom bar: logo mark, © Coral Fanatics [legal entity name, UEN if desired], Terms, Privacy (PDPA), Livestock terms, Returns.
- **Desktop:** 4 columns plus the bottom bar.
- **Mobile:** accordions, with Visit always expanded.

---

## Performance budget (homepage)
- LCP < 2.5s on 4G mid-range Android (hero image preloaded, AVIF, responsive sizes).
- Total JS for the homepage < 120 KB gzipped (mostly Server Components).
- CLS < 0.05 (fixed aspect-ratio slots).
- The hero video only loads on desktop with a fast connection and no reduced-motion preference; otherwise the poster image is shown.

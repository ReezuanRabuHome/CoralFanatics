# Coral Fanatics — Design & Architecture Plan

**Status:** awaiting approval. **No implementation has started.**
**Date:** 26 Nov 2026

| # | Deliverable | File |
|---|---|---|
| 1 | Brand audit (provisional: logo not yet supplied) | [01-brand-audit.md](./01-brand-audit.md) |
| — | Photography specification | [photography-spec.md](./photography-spec.md) |
| 2 | Visual design system | [02-design-system.md](./02-design-system.md) |
| 3 | Homepage wireframe | [03-homepage-wireframe.md](./03-homepage-wireframe.md) |
| 4 | Product listing design | [04-product-listing.md](./04-product-listing.md) |
| 5 | Product detail design | [05-product-detail.md](./05-product-detail.md) |
| 6 | Admin dashboard design | [06-admin-dashboard.md](./06-admin-dashboard.md) |
| 7 | User journeys | [07-user-journeys.md](./07-user-journeys.md) |
| 8 | Database architecture | [08-database-architecture.md](./08-database-architecture.md) |
| 9 | Technical architecture | [09-technical-architecture.md](./09-technical-architecture.md) |
| 10 | Development roadmap | [10-roadmap.md](./10-roadmap.md) |

---

## Key recommendations and design decisions

1. **"Discover" becomes "New Arrivals"** in the main navigation. This is the highest-intent destination for livestock buyers; "Discover" has no v1 content behind it.
2. **Homepage additions:** a slim service strip under the hero, and a "Visit the shop" block merged into the brand story. "One of a kind" auto-fills with the newest real specimens and hides itself if fewer than 4 exist.
3. **Each coral specimen is its own card** in listings, with siblings ("Other Fox Flame pieces") on the PDP.
4. **Reserve stock at "Pay", not at add-to-bag,** with a 15-minute hold aligned to HitPay expiry. Conditional atomic DB updates guarantee a specimen is never sold twice; a late payment for a piece sold elsewhere goes to **Needs review**.
5. **"Mark sold in store"** is a one-tap admin action. In-store sales are the most likely real-world source of double-selling.
6. **Phone-first specimen entry** (photo, species, price, publish in about 60 seconds) plus printable QR labels for the frag rack.
7. **Fish and invertebrates default to quantity-based** inventory (with a "Representative photo" label where it applies). Showpiece animals can still be listed as unique specimens.
8. **Accessibility corrections to the provisional palette:** muted text darkened to `#5F6E75` (the original fails WCAG AA); gold `#DCA923` and orange `#F07822` used **only on dark backgrounds or as non-text accents**, with darker text variants for light backgrounds.
9. **Typography:** Manrope (display) and Inter (text), self-hosted.
10. **Stack unchanged.** Additions are free libraries only (zod, sharp, pg-boss, react-email, vitest, playwright). Postgres-backed jobs (no Redis), Postgres search (no Algolia), and pre-generated images (no image SaaS).
11. **One image, two processes** (`web` + `worker`) on one 2 GB Singapore droplet. Estimated **≈ S$18–32/month**, subject to price verification at purchase. Docker images are built in GitHub Actions, never on the server.
12. **Customer accounts deferred to v1.1.** v1 uses guest checkout plus tokenised order-status links; the "Account" icon opens order lookup.

## Unresolved questions (essential)

These need answers before or during Phase 0–1. Items marked *(policy TBC)* in the documents depend on them.

1. **Assets:** please supply the logo (vector if possible) and a first photo set. The brand audit is currently based only on your written description; I have **not** seen the logo.
2. **GST:** is Coral Fanatics GST-registered? Should displayed prices include GST?
3. **Delivery policy:** do you deliver livestock yourselves or use a courier? Which days and time windows? Fees (flat, by zone, free above a threshold)? Is there a dry-goods-only delivery option?
4. **Collection:** collection hours, same-day cut-off, and how long uncollected livestock is held.
5. **Livestock guarantee:** is there a live-arrival / DOA policy, and what are its terms?
6. **In-store sales:** does the shop use a POS system today? (This affects whether "mark sold in store" is enough for v1.)
7. **Fish stock records:** are fish kept as multiples of the same species, or would you prefer each fish photographed individually?
8. **Existing domain and accounts:** which domain, and is a HitPay account already set up in the shop's name?
9. **Product data:** is there an existing product/price list (spreadsheet, POS export) to import?
10. **Team:** how many staff need admin access, and should staff see revenue or change prices?

## Proposed next steps

1. You review these documents and approve or adjust the direction (comments on any file are welcome).
2. You supply the logo and the first photo set (drop them into `assets/`, see `assets/README.md`) and answer the questions above.
3. I re-run the brand audit on the real logo and update the colour tokens.
4. **Phase 1:** build the clickable high-fidelity prototype in code with your real photos (homepage, SPS listing, coral PDP, dry-goods PDP, checkout UI, admin livestock board), deployed to a private preview.
5. After prototype approval, start Phase 2 (foundations).

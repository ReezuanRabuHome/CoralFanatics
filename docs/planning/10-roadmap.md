# Deliverable 10 — Development Roadmap

Assumptions: **one developer working with Claude Code**, ~20–25 focused hours/week. Durations are realistic ranges, not promises; full-time work roughly halves them. Every phase ends with a demo and your sign-off.

## Phase overview

| Phase | Outcome | Duration | Depends on |
|---|---|---|---|
| 0 | Accounts, assets, policies collected | 1–2 wks (in parallel with 1) | You / shop owner |
| 1 | **Visual prototype** approved (real logo and photos) | 2–3 wks | Logo + first photo set |
| 2 | Foundations: repo, CI, DB schema, auth, admin shell | 2 wks | Phase 1 tokens |
| 3 | Catalogue & livestock admin, media pipeline | 3 wks | 2 |
| 4 | Storefront (home, listings, PDPs, search, SEO) | 3 wks | 3 |
| 5 | Cart, checkout, HitPay, reservations | 3–4 wks | 4, HitPay sandbox account |
| 6 | Orders, inventory, notifications, reports | 2–3 wks | 5 |
| 7 | Hardening: security, performance, backups, staging | 2 wks | 6 |
| 8 | Content upload, training, soft launch | 2 wks | 7, photos, policies |
| — | **Total to public launch** | **~18–24 weeks** | |

---

## Phase 0: Accounts and inputs (owner-led)
- [ ] Shop-owned email for system accounts.
- [ ] Domain (confirm the existing domain and registrar), then move DNS to Cloudflare (free).
- [ ] Cloudflare, DigitalOcean, HitPay (business verification can take days: **start early**), GitHub organisation, Resend/SMTP.
- [ ] Logo source files and existing brand materials.
- [ ] Photo set per the photography spec shot list.
- [ ] Policies: delivery fees/zones/days, collection hours, livestock guarantee/DOA, returns, terms, privacy.
- [ ] Product data export (if a spreadsheet or POS list exists).

## Phase 1: Visual prototype (design approval gate)
- Run the brand audit against the real logo (sample colours, update tokens).
- Build a **clickable high-fidelity prototype in code** (Next.js + Tailwind, static data, real photos): Homepage, SPS listing, Coral PDP, Dry-goods PDP, Bag drawer, Checkout (UI only), Admin Livestock board, Admin Order detail.
- Deploy to a private preview URL (staging, behind Cloudflare Access).
- **Gate: you approve the look and feel before backend work.** Prototype components become the real component library, so the work is not thrown away.

## Phase 2: Foundations
- Repo structure, ESLint/Prettier, strict TypeScript, zod env validation.
- Docker Compose (dev), Prisma schema v1 + raw SQL constraints, seed script with fake **clearly-labelled test data**.
- Better Auth: invite flow, 2FA, roles, `requirePermission`, permission test matrix.
- Admin shell (navigation, layout, tables, forms).
- CI: typecheck, lint, unit and integration tests against Postgres.
- ADRs recorded for key decisions.

## Phase 3: Catalogue and livestock admin
- Categories (tree, filters config), brands.
- Products (quantity model) with variants and inventory items.
- Species templates + specimens; auto specimen codes; status transitions with audit logs.
- Media pipeline: presigned upload, sharp worker, reorder, alt text, placeholder rules.
- Phone-optimised "New specimen" flow; label printing.
- **Tests:** status-transition unit tests; code-sequence concurrency test; upload validation.

## Phase 4: Storefront
- Homepage (admin-configurable sections), listings with filters/sort/pagination, New Arrivals, all 4 PDP types, search overlay.
- SEO: metadata, JSON-LD, sitemap, robots, canonical URLs, OG images.
- Performance budget checks (Lighthouse CI on key pages).
- Accessibility pass (axe automated + keyboard manual).

## Phase 5: Cart, checkout and payments (highest risk; most testing)
- Cookie cart, server re-validation, bag drawer.
- Checkout: contact, collection/delivery (OneMap lookup, slots, fees), livestock terms, order creation + reservation transaction.
- HitPay sandbox integration: payment request, redirect, **webhook verification + idempotency**, return page polling.
- Worker: reservation-expiry sweep, email outbox.
- **Tests:**
  - Concurrency: N parallel checkouts on one specimen means exactly 1 succeeds; parallel checkouts on a variant never oversell.
  - Webhook: valid, invalid signature, duplicate, out-of-order (expired then paid), amount mismatch, late payment after release.
  - E2E (Playwright): coral-only, dry-goods-only, mixed, collection, delivery, payment failure.
  - Pricing: server ignores client-sent prices (tampering test).

## Phase 6: Operations
- Orders list/detail, fulfilment state machine, packing slip, internal notes, timeline.
- Inventory: adjustments, receive stock, movement ledger, low-stock alerts.
- "Mark sold in store" / losses.
- Customer emails: confirmation, ready for collection, out for delivery; owner new-order notification.
- Customers list/detail, PDPA export/anonymise.
- Reports: sales, by category, livestock, reconciliation CSV.
- Overview dashboard "Needs attention".

## Phase 7: Hardening and production
- Production droplet (SGP1), firewall, SSH hardening, Docker, Caddy, Cloudflare Full-Strict, Access on `/admin` + staging.
- Backups: nightly encrypted dumps to R2, **first restore test performed and documented**.
- Uptime monitoring, error tracking, log rotation, resource monitoring (alerts at 75% memory/disk).
- **Security checks:** dependency audit; OWASP ZAP baseline scan on staging; manual review of auth/RBAC, webhooks, uploads, rate limits, headers (securityheaders.com); secrets audit (`gitleaks`); a `/security-review` pass with Claude Code.
- Load sanity test (e.g. k6: 50 concurrent browsing users + 10 checkouts) on the 2 GB droplet.
- Runbooks: deploy, rollback, restore, key rotation, incident response, "HitPay webhook down".

## Phase 8: Content, training and launch
- Bulk import of dry goods (CSV importer), then staff enter livestock through the new-specimen flow.
- **Training** (2 sessions of ~2h, plus a short written guide with screenshots and 5-minute screen recordings):
  1. Daily: adding specimens, marking sold in store, processing orders, adjusting stock.
  2. Owner: settings, users and roles, refunds, reports, what to do if something looks wrong.
- Soft launch: live payments with real small-value orders by the team (refunded), then a friends-and-customers preview week, then public launch.

## Launch checklist
- [ ] All placeholder images replaced on published items; the placeholder report is empty.
- [ ] Policies published and linked in checkout and footer (terms, privacy/PDPA, livestock, returns, delivery).
- [ ] HitPay **live** keys configured; webhook URL registered; a live test payment and refund succeeded.
- [ ] Emails send from the shop domain with SPF, DKIM and DMARC configured.
- [ ] Backups ran and a **restore was tested** within the last 7 days.
- [ ] Uptime and backup alerts reach the owner **and** the developer.
- [ ] Owner has 2FA, owns every account, and the developer's access is documented and revocable.
- [ ] Lighthouse ≥ 90 (performance, accessibility, SEO) on home, listing and PDP on mobile.
- [ ] Google Search Console verified, sitemap submitted; Google Business Profile links to the site.
- [ ] 404/500 pages styled; `robots.txt` allows production and blocks staging.
- [ ] Analytics (privacy-friendly; Cloudflare Web Analytics is free) enabled.
- [ ] Owner and staff trained; the guide has been handed over.

---

## First release (essential) vs. future

| First release (v1) | v1.1 (soon after launch) | Later |
|---|---|---|
| Homepage, storefront, all PDP types, search | Customer accounts (magic link) + order history | Loyalty points |
| Specimen + quantity inventory, reservations | "Notify me" for sold-out / new arrivals by category | Mobile app |
| Guest checkout, HitPay, collection/delivery | Discount codes | Split shipments, courier API integration |
| Admin: overview, products, livestock, inventory, orders, customers, basic reports, settings, roles | Specimen video | Accounting (Xero) export integration |
| Email notifications | WAL point-in-time backups | Marketing automation |
| SEO basics, backups, monitoring | Wishlist | Wholesale/B2B pricing |
| Training, launch | Care guides / editorial ("Discover") | POS integration |

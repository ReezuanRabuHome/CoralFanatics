# Deliverable 9 — Technical Architecture

**Shape:** a single **modular monolith**. One Next.js (App Router, TypeScript) codebase and one Docker image, with two process entrypoints:
- `web`: the Next.js server (storefront, admin, API routes, webhooks)
- `worker`: a small Node process from the **same codebase** that runs scheduled and background jobs (reservation expiry, email outbox, image variants, backups trigger)

This is **not** a microservice split. Both processes share the code, the database and the deployment; the worker simply keeps slow or scheduled work off the request path.

Stack (as agreed, unchanged): Next.js · TypeScript · Tailwind CSS · shadcn/ui · PostgreSQL · Prisma · Better Auth · Cloudflare R2 · HitPay · Docker Compose · Caddy · Cloudflare DNS/CDN · GitHub.

Additions, all **free / no subscription**: `zod` (validation), `sharp` (images), `pg-boss` (Postgres-backed job queue: no Redis), `react-email` (email templates), `vitest` + `playwright` (tests), `pino` (logs).

---

## 1. Application structure

```
coralfanatics/
├─ src/
│  ├─ app/
│  │  ├─ (store)/                 # storefront route group (Pearl/Ocean layouts)
│  │  │  ├─ page.tsx              # homepage
│  │  │  ├─ corals/[type]/…       # listings & PDPs
│  │  │  ├─ marine-life/…  equipment/…  additives/…  new-arrivals/  search/
│  │  │  ├─ bag/  checkout/  checkout/return/  order/[token]/
│  │  │  └─ our-story/  policies/[slug]/
│  │  ├─ admin/                   # admin route group (auth-guarded layout)
│  │  │  ├─ page.tsx (overview)  orders/  livestock/  products/  inventory/
│  │  │  └─ customers/  reports/  settings/
│  │  ├─ api/
│  │  │  ├─ auth/[...all]/route.ts        # Better Auth handler
│  │  │  ├─ webhooks/hitpay/route.ts      # payment webhook
│  │  │  ├─ uploads/presign/route.ts      # R2 presigned upload (admin)
│  │  │  └─ health/route.ts
│  │  ├─ sitemap.ts  robots.ts
│  ├─ modules/                    # ← business logic lives here, not in routes
│  │  ├─ catalog/      (products, categories, variants, search)
│  │  ├─ livestock/    (specimens, codes, status transitions)
│  │  ├─ inventory/    (stock levels, reservations, movements)
│  │  ├─ cart/
│  │  ├─ checkout/     (pricing, fulfilment options, order creation)
│  │  ├─ orders/       (status machines, fulfilment, notes)
│  │  ├─ payments/     (hitpay client, webhook verify, reconciliation)
│  │  ├─ customers/    (records, PDPA export/anonymise)
│  │  ├─ media/        (R2, sharp pipeline)
│  │  ├─ notifications/(email outbox, templates)
│  │  ├─ auth/         (better-auth config, roles, permission checks)
│  │  ├─ audit/
│  │  └─ settings/
│  ├─ components/ ui/ (shadcn) store/ admin/
│  ├─ lib/ (db client, env (zod-validated), money, dates, rate-limit, logger)
│  ├─ styles/tokens.css
│  └─ worker/index.ts             # pg-boss workers & cron schedules
├─ prisma/ schema.prisma  migrations/  seed.ts
├─ tests/ unit/  integration/  e2e/
├─ infra/ docker-compose.yml  Caddyfile  backup/  scripts/
├─ docs/ planning/  runbooks/  adr/       # decisions recorded as ADRs
└─ .github/workflows/ ci.yml  deploy.yml
```

**Module rules** (documented and lint-enforced where practical):
- Each module exposes a small `index.ts` public API (service functions). Routes, server actions and other modules call **only** that.
- Only modules touch Prisma. Pages never query the database directly except through module read functions.
- Each module owns its tables; cross-module writes go through the owning module's function inside a shared transaction (`db.$transaction(tx => …)` passes `tx` down).

## 2. API boundaries

| Boundary | Mechanism | Callers |
|---|---|---|
| Storefront reads | React Server Components calling module read functions; cached with `revalidateTag` on admin edits | Public |
| Storefront mutations (cart, checkout) | **Server Actions**, each with a zod schema, a rate limit and a CSRF guard (built into Server Actions) | Public |
| Admin reads/mutations | Server Actions under `/admin`, each starting with `requirePermission('orders.fulfil')` | Staff/Owner/Dev |
| Payment webhook | `POST /api/webhooks/hitpay` (Route Handler, raw body) | HitPay only (signature verified) |
| Auth | `/api/auth/*` Better Auth handler | Admin users |
| Uploads | `POST /api/uploads/presign`, then the browser PUTs **directly to R2** | Admin |
| Health | `GET /api/health` (DB ping, worker heartbeat) | Uptime monitor |

No public REST/GraphQL API in v1. The module layer makes adding one later straightforward (e.g. for a future mobile app).

## 3. Authentication and authorisation

- **Better Auth** for admin users only: email + password (argon2/scrypt hashing via Better Auth) **+ TOTP two-factor, mandatory for Owner and Developer**, optional for Staff.
- Sessions use secure httpOnly SameSite=Lax cookies; admin sessions expire after 12h idle / 7d absolute; Staff on shop phones get a longer "trusted device" option, configurable by the Owner.
- No public sign-up. Users are **invite-only** (Owner sends an invite link).
- Login is rate-limited (5 attempts / 15 min per IP + email) with a lockout notification email.
- **RBAC:** `permissions.ts` maps `Role → Permission[]`. Every admin server action and route calls `requirePermission()` **on the server**. Hiding items in the UI is cosmetic only.
- **Optional, free hardening:** Cloudflare Zero Trust Access in front of `/admin` (free tier for small teams) adds a second gate via email one-time-PIN. Recommended for launch.
- **Customers:** guest checkout. The order-status page is reached via an unguessable token link in the confirmation email (`/order/{token}`). Customer accounts (email magic-link login via a separate Better Auth configuration) are planned for v1.1, which is why the navigation "Account" icon opens order lookup in v1.

## 4. Image storage (Cloudflare R2)

- Buckets: `cf-media` (public via custom domain `media.<domain>`, cached by Cloudflare CDN) and `cf-media-originals` + `cf-backups` (private).
- Upload flow: admin requests a presigned PUT, the browser uploads the original directly to R2 (so the VPS never streams large files), and a worker job downloads it, runs `sharp` (AVIF/WebP/JPEG at the widths in the photography spec, EXIF stripped), writes the variants and updates `ProductImage`.
- Serving: a custom `next/image` loader maps `(key, width)` to the pre-generated URL. **The VPS does no on-the-fly image optimisation**; that matters on a small server.
- R2 has zero egress fees. Expected cost: within the free tier (10 GB storage, 1M writes, 10M reads per month at last check, *to verify*) for a long time.

## 5. Payment integration (HitPay)

Flow: **Payment Request API**, then HitPay hosted checkout, then a **webhook as source of truth**.

1. Checkout server action → `checkout.createOrder()` (reserves stock in a transaction, computes the total from the DB), then `payments.createHitPayRequest({ amount, currency: 'SGD', reference_number: order.id, redirect_url, webhook, expiry })`. The amount is **always server-computed**; the client never sends prices.
2. Customer pays on HitPay (PayNow, cards and other enabled methods, depending on the shop's HitPay account).
3. **Webhook handler:**
   1. Read the raw body; **verify the HMAC-SHA256 signature** with the HitPay salt using a constant-time compare. Reject with 401 if invalid (and log it).
   2. Insert a `PaymentEvent` with a unique `dedupeKey`. If it already exists, return 200 immediately (**idempotent**).
   3. Cross-check: `reference_number` matches an order, the amount and currency match `order.totalCents`, and the payment request id matches `Payment`. On a mismatch, flag `needsReview` and do not fulfil.
   4. Optionally re-fetch payment status from the HitPay API (defence in depth).
   5. Run `orders.commitPaidOrder()` or `orders.releaseOrder()` in a transaction; return 200 quickly.
4. Redirect/return page: **read-only**; it never changes payment state.
5. Refunds in v1: done in the HitPay dashboard, recorded in the admin (owner), or reconciled by webhook where HitPay sends refund events.

> *To verify during Phase 4 against current HitPay documentation:* exact webhook format (HitPay has offered both a legacy form-encoded webhook with an `hmac` field and a newer JSON webhook with a signature header), payment-request expiry options, and refund events. The design above works with either.

## 6. Inventory reservation strategy

- **When:** reserve at **"Pay" (order creation)**, not at add-to-bag. This avoids carts locking rare corals for hours.
- **How long:** 15 minutes by default (Settings), aligned with the HitPay payment-request expiry.
- **How:** conditional atomic updates (see Deliverable 8 §5), all-or-nothing per order.
- **Release paths, all idempotent:**
  1. A HitPay failed/expired webhook.
  2. The **worker sweep every minute**: orders `PENDING_PAYMENT` with `reservationExpiresAt < now()` are released and set to `EXPIRED` (after a final HitPay status check, to avoid releasing a just-paid order).
  3. Customer returns and cancels.
- **Late payment:** handled as described in Deliverable 8 (claim if still available, otherwise `needsReview` and owner alert).
- **Concurrency testing:** integration tests fire 20 parallel checkouts at one specimen and assert exactly one reservation succeeds.

## 7. Hosting

| Component | Choice | Est. monthly (verify before purchase) |
|---|---|---|
| VPS | DigitalOcean Basic Droplet, **Singapore (SGP1)**, 2 GB RAM / 1–2 vCPU, 50+ GB SSD | ~US$12–18 |
| Droplet weekly snapshots (optional extra safety) | DigitalOcean Backups | +20% of droplet (~US$2.40–3.60) |
| Database | PostgreSQL **in Docker on the same droplet** (no managed DB: those start at ~US$15/mo) | US$0 |
| Object storage | Cloudflare R2 | ~US$0 (free tier) |
| DNS / CDN / TLS edge / WAF basics | Cloudflare Free | US$0 |
| TLS origin certs | Caddy (automatic Let's Encrypt) or Cloudflare Origin CA | US$0 |
| Transactional email | **Resend free tier** (≈3,000 emails/mo) *or* the shop's existing mailbox via SMTP | US$0 at expected volume |
| Uptime monitoring | UptimeRobot / Better Stack free tier | US$0 |
| Error tracking (optional) | Sentry free developer tier | US$0 |
| CI/CD + container registry | GitHub Actions + GHCR | US$0 (within free minutes/storage for a small private repo; verify) |
| Domain | `.sg` / `.com.sg` (if not already owned) | ~S$4–8/mo amortised (registrar-dependent) |
| **Total infrastructure** | | **≈ S$18–32 / month**, within the S$25–35 target |

*Prices are planning estimates from my last known pricing and **must be re-verified** at purchase time. HitPay transaction fees and GST are excluded.*

**Memory plan for 2 GB:** Next.js server ~250–400 MB · worker ~120 MB · PostgreSQL tuned (`shared_buffers=256MB`, `max_connections=30`) ~300–400 MB · Caddy ~30 MB · OS ~250 MB, plus **2 GB swap file** as a safety net. **Images are built in GitHub Actions, never on the server** (a Next.js build can exceed 2 GB RAM).
**Upgrade trigger:** sustained memory > 75%, swap use > 200 MB, or p95 response > 800 ms. Then resize to 4 GB (~US$24, a ~1-minute reboot).

## 8. Deployment

```
GitHub push to main
  → CI: typecheck, lint, unit + integration tests (Postgres service container), build
  → build Docker image → push to GHCR (tag = git SHA)
  → deploy job (manual approval for production): SSH to droplet
      → docker compose pull → run `prisma migrate deploy` (one-off container)
      → docker compose up -d web worker  (health-checked; previous image kept for rollback)
```

`docker-compose.yml` services: `caddy`, `web`, `worker`, `postgres`, `backup` (cron container). Postgres is not exposed to the internet (internal network only).

Environments: **production** (droplet) and **staging** (same droplet, separate compose project and database, HitPay sandbox, `staging.` subdomain behind Cloudflare Access). This costs nothing extra. Local dev uses Docker Compose for Postgres plus `next dev`.

Rollback: `deploy.sh rollback <sha>`. Migrations are written to be backward-compatible (expand → migrate → contract) so a rollback is always safe.

## 9. Backups

| What | How | Retention |
|---|---|---|
| PostgreSQL | `pg_dump -Fc` nightly at 03:00 SGT by the backup container, **encrypted with `age`**, uploaded to the private R2 `cf-backups` bucket | 14 daily · 8 weekly · 12 monthly |
| PostgreSQL (point-in-time, optional v1.1) | WAL archiving to R2 (`wal-g`) | 7 days |
| Media originals | Already in R2 (separate bucket); R2 is the system of record | — |
| Server config | In Git (`infra/`); secrets in a password manager owned by the shop | — |
| Droplet | DigitalOcean weekly backups (optional) | 4 weeks |

- **Restore testing:** a monthly scripted restore into a throwaway container, with row-count sanity checks and a report emailed to the developer. A documented restore runbook is in `docs/runbooks/restore.md`. Tested before launch.
- The backup job writes a heartbeat; the admin System page and the uptime monitor alert if the last success is more than 26h old.

## 10. Security

| Area | Measures |
|---|---|
| Transport | HTTPS everywhere (Cloudflare Full-Strict + Caddy), HSTS, TLS 1.2+ |
| Headers | CSP (nonce-based for scripts; HitPay redirect only), `X-Frame-Options: DENY` (admin), `Referrer-Policy`, `Permissions-Policy` |
| Input | zod validation on every server action and route; Prisma parameterised queries; rich text sanitised server-side |
| Pricing | Prices, delivery fees and totals are calculated **only on the server** from DB values |
| Payments | Hosted checkout (no card data touches our servers, keeping PCI scope minimal); webhook HMAC verification; amount/currency/reference cross-checks; idempotency |
| Auth | Better Auth, 2FA for privileged roles, invite-only, session rotation, login rate limits |
| RBAC | Server-side `requirePermission` on every admin action; tested by an automated permissions test matrix |
| Rate limiting | Cloudflare free rate-limiting rule on `/api/auth/*` and checkout, plus an in-app limiter (Postgres- or memory-backed, single instance) on login, checkout, search and order lookup |
| Secrets | `.env` on the server (root-only `chmod 600`), validated at boot with zod; never in Git or the client bundle; GitHub Actions secrets for deploys; **rotation runbook** |
| Server | SSH keys only, root login disabled, `ufw` allowing 22 (restricted)/80/443, unattended security upgrades, fail2ban, Docker images pinned and updated monthly; Dependabot alerts |
| Data separation | Admin users and customers in separate tables; staff see limited customer fields; customer pages expose only token-scoped order data |
| Audit | `AuditLog` for product/price/stock/status/role/refund/settings changes |
| PDPA | Privacy policy, consent capture for marketing, data export/anonymise tools, minimal data collection, breach response runbook |
| Uploads | Presigned URLs scoped to a key prefix, content-type and size limits, server-side re-encoding (`sharp` strips any payload) |

## 11. Shop ownership and continuity

All accounts are **registered in the shop's name with a shop-controlled email** (e.g. `admin@coralfanatics…`): domain registrar, Cloudflare, DigitalOcean, HitPay, GitHub organisation (repo owned by the org, developer invited as a member), Resend/SMTP, and the uptime monitor. The developer is added as a collaborator with least privilege. A **handover document** lists every account, what it does and how to revoke access. Secrets are stored in the shop's password manager (e.g. Bitwarden free/Families).

## 12. Avoiding unnecessary subscriptions

| Common paid add-on | Our free alternative |
|---|---|
| Managed database | Postgres in Docker + encrypted R2 backups |
| Redis / queue service | pg-boss on Postgres |
| Algolia / search SaaS | Postgres full-text + pg_trgm |
| Image CDN / optimisation SaaS | sharp at upload + R2 + Cloudflare cache |
| Vercel / PaaS | Docker on one VPS |
| Headless CMS | Admin settings + Postgres |
| Email marketing tool | Out of scope v1 (consent captured for later) |
| WhatsApp Business API | `wa.me` click-to-chat links (free) |
| Address API | OneMap (Singapore government, free) |

Possible future paid items, flagged only if needed: VPS upgrade to 4 GB (~+US$6–12/mo), and email beyond free-tier volume.

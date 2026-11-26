# Deliverable 6 — Admin Dashboard Design

**Location:** `/admin` inside the same Next.js app (separate layout and route group, server-side role checks on every action).
**Visual direction:** the "Admin" surface. White cards on a pearl-100 canvas, Inter only, 14px base, 6px radius, status tokens for meaning, no photography beyond product thumbnails, no decorative motion.

**Design principle:** organise around the shop's **daily jobs**, not database tables:
1. "What needs my attention today?" (orders to pack, payments to check, stock to fix)
2. "New corals came in: photograph, price, publish."
3. "A customer bought something in store: mark it sold so it isn't sold online twice."
4. "Pack and hand over today's orders."

Two of these jobs happen **standing in front of a tank with a phone**, so the Livestock and Orders screens are fully usable on mobile.

---

## 1. Shell and navigation

```
┌──────────────┬──────────────────────────────────────────────────────┐
│ [CF mark]    │ Top bar: Global search (orders, specimen ID, product)│
│ Coral        │          [+ New ▾]  [🔔 3]  [Avatar ▾]               │
│ Fanatics     ├──────────────────────────────────────────────────────┤
│              │                                                      │
│ ▣ Overview   │                  PAGE CONTENT                        │
│ ▤ Orders  (5)│                                                      │
│ ◆ Livestock  │                                                      │
│ ▦ Products   │                                                      │
│ ⇅ Inventory  │                                                      │
│ ☺ Customers  │                                                      │
│ ◔ Reports    │                                                      │
│ ─────────    │                                                      │
│ ⚙ Settings   │                                                      │
│ ↗ View store │                                                      │
└──────────────┴──────────────────────────────────────────────────────┘
Mobile: bottom tab bar → Overview · Orders · Livestock · [+] · More
```

- The **"+ New"** menu offers New specimen (the most common action), New product, and Stock adjustment.
- The order count badge shows paid orders awaiting fulfilment.
- **Global search** finds an order by number, phone or email; a specimen by ID; a product by name.
- Items a role cannot access are **hidden**, not disabled.

---

## 2. Overview

```
Good morning, [name] · Thursday 26 Nov

┌─ Needs attention ───────────────────────────────────────────────┐
│ ▶ 5 orders to fulfil (2 collections today · 3 deliveries)       │
│ ▶ 1 paid order needs review (specimen was released before pay)  │
│ ▶ 4 low-stock products                                          │
│ ▶ 3 specimens reserved > 15 min (auto-release pending)          │
│ ▶ 2 products missing photos                                     │
└─────────────────────────────────────────────────────────────────┘
┌ Today's sales ┐┌ Orders today ┐┌ Awaiting payment ┐┌ To fulfil ┐
│ S$1,240.00    ││ 9            ││ 2                ││ 5         │
│ +18% vs avg   ││              ││                  ││           │
└───────────────┘└──────────────┘└──────────────────┘└───────────┘
┌ Sales — last 30 days (bar chart, daily) ─────┐┌ Recent orders ─┐
│                                              ││ #1042 Paid ... │
│                                              ││ #1041 ...      │
└──────────────────────────────────────────────┘└────────────────┘
┌ Livestock snapshot: 82 available · 3 reserved · 14 sold (7d) ┐
```
- "Needs attention" is the hero of the page. Each line links to a pre-filtered list.
- **Staff** see the same page **without revenue figures** (configurable).

---

## 3. Products (catalogue)

**List view:** a table with Thumbnail · Name · Category · Type (Quantity / Specimen-based) · Price (or range) · Stock · Status (Draft / Published / Archived) · Updated.
Filters: Category, Status, Type, "Missing photos", "Low stock". Bulk actions: Publish, Unpublish, Archive, Change category.

**Edit view:** a single scrolling page with a sticky save bar, and sections in a left-hand anchor nav.

| Section | Fields |
|---|---|
| Basics | Name, slug (auto), category, sub-category, brand (dry goods), inventory model (Quantity / Unique specimens; locked after the first sale) |
| Media | Drag-and-drop upload, reorder, set primary, alt text, placeholder warnings |
| Pricing & variants | Single price, or variant matrix (option name, values, price, SKU, stock, low-stock threshold) |
| Livestock care profile | Scientific name, lighting, flow, placement, difficulty, growth, reef safe, temperament, diet, max size… (shown only for livestock categories). For specimen-based products, this is the **species template** inherited by every specimen |
| Content | Description (simple rich text: bold, lists, links only), highlights, specifications (key–value) |
| Fulfilment | Livestock flag (drives checkout terms and delivery rules), per-order quantity limit, collection only (yes/no) |
| SEO | Title, meta description (auto-generated defaults), preview |
| Visibility | Draft / Published / Archived; Featured on homepage |

**Categories** live under Products → Categories: a tree with drag reordering, a banner image, a description and the enabled filters per category.

---

## 4. Livestock (unique specimens)

The single most important admin screen. Two views:

**Board view (default, works well on mobile)**
```
[ Available 82 ] [ Reserved 3 ] [ Sold 14 ] [ Unavailable 6 ] [ Draft 4 ]   🔍 ID / name
┌────────┐┌────────┐┌────────┐┌────────┐
│ photo  ││ photo  ││ photo  ││ photo  │
│●Avail. ││●Resvd  ││●Avail. ││●Draft  │
│CF-SPS- ││CF-LPS- ││        ││        │
│0142    ││0087    ││ …      ││ …      │
│Fox Fl. ││Hammer  ││        ││        │
│S$85    ││S$120   ││        ││        │
└────────┘└────────┘└────────┘└────────┘
```
**Table view:** ID · Photo · Species · Price · Status · Tank/location · Listed date · Days listed.

**Status design.** These four states are visually distinct, and each has a text label, a colour and a dot shape:

| Status | Colour | Shape | Meaning | Storefront |
|---|---|---|---|---|
| Available | green | ● | On sale | Visible, purchasable |
| Reserved | amber | ◐ | In an active checkout (auto-expires) | Visible, not purchasable |
| Sold | red | ■ | Paid (online or in store) | Hidden from listings; PDP shows Sold |
| Unavailable | grey | ○ | On hold / quarantine / lost / not for sale | Hidden |
| Draft | grey dashed | ◌ | Not yet published | Hidden |

**Quick actions** on each specimen (one tap):
- **Mark sold in store**: records an in-store sale with an optional price and note. *Critical for preventing double-selling.* It is refused if the specimen is Reserved, with a prompt to view the checkout.
- **Mark unavailable** with a reason: Hold for customer / Quarantine / Lost (died) / Not for sale.
- **Duplicate as new specimen**: same species with a new photo and price, for fast entry.
- **Print label**: prints the specimen ID with a QR code to stick on the frag rack (browser print, no extra service).
- Edit price, edit photos.

**New specimen flow (phone-optimised, about 60 seconds):**
1. Tap **+ New specimen**.
2. Take or upload photo(s) (the phone camera opens directly).
3. Choose the species from a searchable list (e.g. "Fox Flame Acropora"), which inherits name, category, care profile and description. Or choose "+ New species".
4. Enter the price, approximate size and optional specimen notes and tank location.
5. The specimen ID is **auto-assigned** (`CF-SPS-0143`).
6. **Save as draft** or **Publish now**.

Reserved specimens show "Reserved by checkout #CHK-…, expires in 9 min". Staff can see why something is locked, but cannot override it without the owner role.

---

## 5. Inventory (quantity-based products)

- **Stock table:** Product · Variant · SKU · On hand · Reserved · Available · Low-stock threshold · Status (OK / Low / Out).
- **Adjust stock** (row action or bulk): reason is required (*Received delivery*, *In-store sale*, *Damaged*, *Livestock loss*, *Count correction*, *Return*), with quantity ±, optional note and reference (supplier invoice no.).
- **Receive stock** (bulk): pick multiple products and enter received quantities in one form, recorded as a single "Receipt".
- **Movement history:** a chronological ledger per product and globally; it is append-only (corrections are new entries). Columns: Date · Product/Variant · Change · Reason · Reference (order no. / adjustment) · User · Resulting on-hand.
- **Low-stock alerts:** a list, a dashboard item, and an optional daily email digest to the owner.
- Specimen status changes also appear in the global movement history, so there is one audit trail.

---

## 6. Orders

**List:** Order no. · Date · Customer · Items (count + first thumbnail) · Total · **Payment** badge · **Fulfilment** badge · Method (Collection / Delivery) · Scheduled date.
Saved tabs: *To fulfil* (default) · *Today's collections* · *Today's deliveries* · *Awaiting payment* · *Needs review* · *All*.

**Order detail:**
```
#CF-10042  ·  26 Nov 2026 14:22                      [Print packing slip] [⋯]
Payment: ● Paid (PayNow, HitPay ref …)   Fulfilment: ● Preparing  [Advance ▾]
┌ Items ─────────────────────────────────┐ ┌ Customer ────────────────┐
│ [img] Fox Flame Acropora CF-SPS-0142   │ │ Name, phone (WhatsApp ↗), │
│       S$85.00 × 1                      │ │ email                      │
│ [img] Coral Pro Salt 22kg  S$120 × 1   │ ├ Fulfilment ───────────────┤
│ Subtotal / Delivery / Discount / Total │ │ Delivery · Sat 28 Nov PM  │
└────────────────────────────────────────┘ │ Address …                 │
┌ Timeline ──────────────────────────────┐ └───────────────────────────┘
│ 14:22 Checkout created (reserved 2)    │ ┌ Internal notes ───────────┐
│ 14:24 Payment confirmed via webhook    │ │ + Add note                │
│ 14:24 Stock committed                  │ └───────────────────────────┘
│ 15:10 Fulfilment → Preparing (Staff A) │
└────────────────────────────────────────┘
```
- **Payment status** (Unpaid / Pending / Paid / Failed / Expired / Refunded / Partially refunded) is set **only by the payment system** (webhook). It is read-only for all humans except the owner's "record manual refund" action, which is audited.
- **Fulfilment status** is advanced by staff, and the next valid step is offered as a single button:
  - Collection: Unfulfilled → Preparing → Ready for collection → Collected
  - Delivery: Unfulfilled → Preparing → Out for delivery → Delivered
  - Any step → Cancelled (owner only after payment, with a refund prompt)
- Status changes can send the customer an email ("Ready for collection").
- **Needs review** appears when a payment arrives for an order whose reservation had already expired *and* the specimen was sold elsewhere. It shows "Refund or offer alternative" guidance.
- Refunds in v1 are processed in the **HitPay dashboard** and recorded here (owner only); the refund webhook updates status automatically where supported.

---

## 7. Customers

- **List:** Name · Email · Phone · Orders · Total spent · Last order · Marketing consent.
- **Detail:** contact details, addresses, order history, internal notes ("prefers WhatsApp", "regular SPS collector").
- Guest checkouts are grouped into customer records by email (an unverified link; no login is required).
- **PDPA tools (owner only):** export a customer's data, and anonymise a customer (keeps order financials, strips personal data).

## 8. Reports (owner and developer)

Kept intentionally simple in v1:
- **Sales:** revenue by day/week/month, order count and average order value; filter by date range; CSV export.
- **Sales by category:** corals vs. fish vs. inverts vs. dry goods.
- **Livestock:** specimens listed vs. sold, average days to sell, and losses (from "Lost" reasons).
- **Inventory valuation:** at cost price, if cost is recorded (optional field).
- **Payments reconciliation:** paid orders with HitPay references, for matching against HitPay payouts; CSV export for the accountant.

## 9. Settings

| Section | Contents | Role |
|---|---|---|
| Store details | Name, legal entity/UEN, address, hours, phone, WhatsApp, social links | Owner |
| Homepage | Hero image/video, collection panel images, featured selection mode | Owner |
| Fulfilment | Collection slots & cut-off, delivery fee rules (flat / free over threshold), delivery days for livestock, blackout dates (public holidays, shop closure) | Owner |
| Checkout & policies | Livestock terms text, terms, privacy, returns; reservation timeout (default 15 min) | Owner |
| Payments | HitPay mode (sandbox/live), key status, webhook health (last received) | Owner (view) / Developer (keys via env) |
| Notifications | Order notification recipients, email templates (preview) | Owner |
| Users & roles | Invite, deactivate, change role, enforce 2FA | Owner |
| Audit log | Filterable log of admin actions | Owner, Developer |
| System | Backups status (last success), version, health check | Developer (Owner view) |

Secrets (API keys) are **never** editable in the UI. They live in server environment variables; the UI only shows "configured ✓".

---

## 10. Roles and permissions

| Capability | Developer | Owner | Staff |
|---|:-:|:-:|:-:|
| View dashboard (with revenue) | ✓ | ✓ | configurable |
| Create/edit products & specimens | ✓ | ✓ | ✓ |
| Publish / unpublish | ✓ | ✓ | ✓ (configurable) |
| Change prices | ✓ | ✓ | configurable |
| Archive / delete products | ✓ | ✓ | — |
| Stock adjustments | ✓ | ✓ | ✓ (reason required) |
| Mark specimen sold in store / unavailable | ✓ | ✓ | ✓ |
| View orders & advance fulfilment | ✓ | ✓ | ✓ |
| Cancel paid order / record refund | — | ✓ | — |
| View customers | ✓ | ✓ | name/phone only |
| Export / anonymise customer data | — | ✓ | — |
| Reports | ✓ | ✓ | — |
| Settings: store, fulfilment, policies | — | ✓ | — |
| Users & roles | — (can be granted) | ✓ | — |
| Audit log | ✓ | ✓ | — |
| System / backups / technical health | ✓ | view | — |

**Ownership principle:** the Owner is the top authority. The Developer role cannot remove or demote the Owner, and **the Owner can revoke the Developer at any time**. The Developer gets no financial actions (refunds, cancellations) by default.

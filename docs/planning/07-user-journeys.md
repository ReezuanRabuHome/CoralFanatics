# Deliverable 7 — User Journeys

Conventions: **[S]** = server action/validation, **[DB]** = database transaction, **[HP]** = HitPay.
Placeholders that depend on shop policy are marked *(policy TBC)*.

---

## J1. Customer discovers and purchases a coral

| # | Step | UI | System |
|---|---|---|---|
| 1 | Sees an Instagram post or the homepage, taps **"One of a kind"** → PDP | Homepage D section / social link | — |
| 2 | Views the gallery, checks ID `CF-SPS-0142`, care facts, price | Coral PDP | Page rendered with live status |
| 3 | Taps **Add to bag** | Bag drawer opens | **[S]** checks the specimen is `AVAILABLE`, adds a cart line `specimenId`. **No reservation yet** (prevents cart hoarding) |
| 4 | Taps **Checkout** | Checkout page | **[S]** re-validates every line; a removed or sold specimen is shown with an explanation |
| 5 | Enters email and phone, chooses Collection or Delivery (→ J4/J5), accepts **livestock terms** (checkbox, shown because the cart contains livestock) | Checkout | Client and server validation |
| 6 | Taps **Pay S$85.00** | Button loading state | **[DB]** in one transaction: create `Order (PENDING_PAYMENT)` with price snapshots; `UPDATE specimen SET status='RESERVED', reservation=… WHERE id=… AND status='AVAILABLE'`. If 0 rows are updated, the whole thing rolls back and the customer sees "Sorry, this piece was just reserved by someone else". **[HP]** create a Payment Request (amount from the DB, reference = order id, expiry = 15 min) |
| 7 | Redirected to the HitPay hosted page, pays with PayNow QR or card | HitPay | — |
| 8 | HitPay sends a webhook | — | **[S]** verify HMAC signature → store `PaymentEvent` (unique by provider event id, so it is idempotent) → **[DB]** mark Payment `PAID`, Order paymentStatus `PAID`, specimen `SOLD`, write a status history entry, enqueue emails |
| 9 | Customer returns to `/checkout/return?order=…` | "Confirming your payment…" then "Thank you" | **[S]** the page **reads** the order status; it never marks it paid. If the webhook hasn't arrived yet, it polls status for up to ~30s and then shows "We'll email you once payment is confirmed" |
| 10 | Receives a confirmation email with order no., specimen ID, photo and fulfilment details | Email | — |

**Alternative paths**
- *Payment fails or customer abandons:* the HitPay failed/expired webhook, **or** the reservation-expiry job after 15 min, releases the specimen to `AVAILABLE`; the order is set to `EXPIRED`/`FAILED`.
- *Late payment after expiry:* the webhook arrives as PAID, but the reservation is gone. If the specimen is still `AVAILABLE`, it is claimed and the order proceeds normally. If it was sold to someone else, the order is set to **Needs review** and the owner is alerted to refund or offer an alternative.
- *Customer opens two tabs:* the second checkout for the same specimen fails at step 6 with a clear message.

---

## J2. Customer purchases multiple dry goods

1. Browses Equipment → Salt & Testing; filters by Brand.
2. On the PDP, picks variant `22 kg` and quantity 2, then **Add to bag**. **[S]** checks `available = onHand − reserved ≥ requested`; caps the quantity with a message if not.
3. Adds a test kit from "Frequently bought with".
4. In the bag drawer, changes a quantity. **[S]** re-validates.
5. At checkout: contact details, then fulfilment. Livestock terms are **not** shown.
6. **Pay**. **[DB]** creates the order and a `StockReservation` per variant line, and increments `reserved` using conditional updates (`WHERE onHand - reserved >= qty`). If any line fails, the whole transaction rolls back and the customer is shown which item ran short.
7. HitPay → webhook PAID → **[DB]** for each line: `onHand -= qty`, `reserved -= qty`, write an `InventoryMovement(SALE)`, and mark the reservation `CONSUMED`.
8. Confirmation email.

---

## J3. Coral and dry goods together

Same as J1 + J2 in **one order, one payment, one transaction**:
- Reservation of the specimen and all variant quantities is atomic: all succeed or none do.
- Livestock terms are shown, because the cart contains livestock.
- **Fulfilment rule:** the whole order uses the livestock fulfilment rules (livestock delivery slots apply to the whole order). *Split shipments are future scope.*
- Order detail in the admin shows livestock lines first, flagged with ◆, so the packer handles them last-out and first-delivered.

---

## J4. Customer selects Collection

1. At checkout, chooses the **"Collect from our shop"** choice card, which shows the address and hours.
2. Picks a **collection date** (and optionally a time window) from available slots. **[S]** slots are generated from Settings: opening hours, cut-off (e.g. orders after 5pm → next day), and blackout dates *(policy TBC)*.
3. No address is required. The collection fee is S$0.
4. After payment: email "Order received". When staff mark it **Ready for collection**, the customer gets an email (plus a WhatsApp link button for the shop to message manually, with no paid WhatsApp API in v1).
5. In store: staff search the order number, verify the name or phone, hand over, and mark it **Collected**.
6. *Uncollected livestock policy (e.g. hold for 48h)*: *(policy TBC)*, shown in the livestock terms.

## J5. Customer selects Delivery

1. Chooses the **"Deliver to me"** choice card.
2. Enters a 6-digit **postal code**. **[S]** OneMap lookup auto-fills the block and street; the customer adds the unit number. The postal code is validated as Singapore-only.
3. Picks a **delivery date/window**. For orders containing livestock, only the configured livestock delivery days appear *(policy TBC)*.
4. **[S]** calculates the delivery fee server-side (flat rate or free above a threshold; per-zone later), shown in the summary before payment.
5. After payment, staff mark **Out for delivery** (customer emailed), then **Delivered**.
6. Delivery is done by the shop or a manually booked courier. Courier API integration is out of scope for v1.

---

## J6. Shop staff adds a new coral specimen (on phone, at the tank)

1. Opens `/admin` on the phone (signed in, with a session that persists for staff).
2. Taps the bottom-bar **[+] → New specimen**.
3. Camera opens and takes 1–3 photos. Uploads go **directly to R2** via a presigned URL, with a progress bar. **[S]** generates image variants in the background.
4. Searches the species "fox flame" and selects it. Name, category (SPS › Acropora), care profile and description are inherited.
5. Enters the price `85`, size `~3 cm`, and an optional note.
6. ID `CF-SPS-0143` is assigned **[DB]** (per-type sequence).
7. Taps **Publish**. **[S]** validates a real photo, price > 0 and a category. The specimen goes live immediately and appears in New Arrivals and the homepage "One of a kind" section.
8. Optional: **Print label** with QR → sticks it on the frag plug rack.
9. An audit log entry is written: `specimen.created`, `specimen.published` by [staff].

## J7. Shop staff updates inventory

**a) Delivery received (dry goods)**
1. Admin → Inventory → **Receive stock**.
2. Searches and adds products/variants, enters quantities received and a supplier invoice reference.
3. Saves. **[DB]** one `InventoryMovement(RECEIVED)` per line, and `onHand` updated in the same transaction. Low-stock flags clear automatically.

**b) In-store sale**
- Dry goods: row action **Adjust → In-store sale −1**.
- Specimen: **Mark sold in store**. **[DB]** conditional update `WHERE status='AVAILABLE'`. If it is currently reserved online, staff are told to wait or contact the owner.

**c) Livestock loss**
- Specimen: **Mark unavailable → Lost**. Quantity livestock: **Adjust → Livestock loss −n**. Both are recorded with the reason, for the losses report.

## J8. Shop owner processes an order

1. Gets a **new paid order** email (and the admin badge count). Payment is already verified by the webhook, so there is no need to check HitPay.
2. Admin → Orders → **To fulfil** tab, sorted by scheduled date. Today's collections and deliveries are at the top.
3. Opens `#CF-10042`, then **Print packing slip** (items with specimen IDs and photos, customer, fulfilment details, internal notes).
4. Taps **Preparing**, then picks items: matches specimen IDs to the tank labels and bags the livestock.
5. Taps **Ready for collection** or **Out for delivery**. The customer is emailed automatically.
6. Taps **Collected** / **Delivered** to complete the order.
7. **Exceptions:**
   - Customer cancels before fulfilment: owner refunds in the HitPay dashboard, then records the refund on the order (or it updates automatically via webhook). Specimens are returned to stock via **"Return items to stock"** (a choice, because a livestock item may not be resaleable).
   - DOA claim: an internal note plus a partial refund, following the shop policy *(policy TBC)*.
8. Every status change is written to the order timeline and the audit log, with the user and time.

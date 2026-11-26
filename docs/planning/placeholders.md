# Placeholder Register

**Status:** recommendations approved 26 Nov 2026. The open business questions are **deferred**; the values below are **placeholders** used for design and the prototype so work can continue. They will be revisited with the shop before launch.

Rules:
- Every placeholder appears in the UI with a visible marker in development and staging (`[PLACEHOLDER]` text or an amber dashed outline), so none can slip into production unnoticed.
- In code, placeholder values live in **one file** (`src/config/placeholders.ts`, later moved into admin Settings). Nothing is hard-coded across components.
- The launch checklist (Deliverable 10) blocks launch until this register is empty.

| # | Question | Placeholder used | Where it shows | Resolved? |
|---|---|---|---|---|
| Q1 | Shop photography | 6 real coral photos received 26 Nov 2026 (see mapping below). Everything else still uses a flat placeholder with a small "Photo placeholder" label. Still needed: fish, invertebrates, dry goods, shop interior/team, a wide high-resolution hero shot | Everywhere without a real photo | Partly |
| Q1b | Vector logo | Interim derived PNGs (`assets/brand/`) | Nav, footer, favicon | ☐ |
| Q2 | GST registration / price display | Prices shown without a GST statement; checkout line "GST: [to be confirmed]" | PDP, checkout | ☐ |
| Q3 | Livestock delivery method, days, fees | "Delivery in Singapore: [schedule TBC]"; fee shown as `S$[TBC]`; prototype uses S$15.00 flat for layout only | Service strip, PDP, checkout | ☐ |
| Q4 | Collection hours, cut-off, hold period | "Collect in store: [hours TBC]"; slots Tue–Sun, 12:00–20:00 for layout only | PDP, checkout, footer | ☐ |
| Q5 | Live-arrival / DOA guarantee | Livestock terms box with "[Livestock terms to be provided by Coral Fanatics]" | Checkout, policy page | ☐ |
| Q6 | POS in store | Assume none; "Mark sold in store" action covers in-store sales | Admin | ☐ |
| Q7 | Fish stock model | Fish = quantity-based with "Representative photo" label | Fish PDP, listings | ☐ |
| Q8 | Domain, HitPay account | `coralfanatics.example` placeholder domain; HitPay sandbox only | Config | ☐ |
| Q9 | Existing product list | Clearly fictional sample products marked "SAMPLE" (names of real species and brands, but **invented prices and stock**) | Prototype data | ☐ |
| Q10 | Staff count / permissions | Default matrix from Deliverable 6 (staff: no revenue, no price changes) | Admin | ☐ |
| Q11 | Store address, hours, phone, socials | "[Address TBC]", "[Hours TBC]", "[Phone TBC]"; social icons hidden until URLs are provided | Footer, Visit block | ☐ |
| Q12 | Brand story copy | Lorem-free neutral draft marked "[DRAFT COPY: to be written with the owner]" | Homepage G, Our Story | ☐ |

## Photo-to-specimen mapping (names to confirm with the shop)

| Original file | Web file | Used as | Name given (best guess) |
|---|---|---|---|
| IMG_6923.jpeg | `public/photos/acropora-lime.jpg` | Homepage hero; CF-SPS-0146 | Lime Acropora |
| IMG_6924.jpeg | `public/photos/acropora-green-yellow-polyps.jpg` | SPS tile; CF-SPS-0145 | Green & Gold Acropora |
| IMG_6706.jpeg | `public/photos/acropora-frag-yellow-purple.jpg` | CF-SPS-0144 | Yellow & Purple Acropora (frag) |
| IMG_6926.jpeg | `public/photos/hammer-green.jpg` | LPS tile; CF-LPS-0089 | Hammer Coral |
| IMG_6925.jpeg | `public/photos/chalice-orange-teal.jpg` | CF-LPS-0090 | Orange & Teal Chalice (*Echinophyllia* sp.?) — least certain |
| IMG_6770.jpeg | `public/photos/ricordea-yuma-orange.jpg` | Mushrooms tile; CF-MUS-0051 | Ricordea Yuma |

Prices, sizes and notes for these pieces remain SAMPLE values. Web copies are resized (max 2000px), converted to sRGB and stripped of metadata; no colour or saturation changes were made. No GPS data was present in the originals.

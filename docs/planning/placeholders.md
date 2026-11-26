# Placeholder Register

**Status:** recommendations approved 26 Nov 2026. The open business questions are **deferred**; the values below are **placeholders** used for design and the prototype so work can continue. They will be revisited with the shop before launch.

Rules:
- Every placeholder appears in the UI with a visible marker in development and staging (`[PLACEHOLDER]` text or an amber dashed outline), so none can slip into production unnoticed.
- In code, placeholder values live in **one file** (`src/config/placeholders.ts`, later moved into admin Settings). Nothing is hard-coded across components.
- The launch checklist (Deliverable 10) blocks launch until this register is empty.

| # | Question | Placeholder used | Where it shows | Resolved? |
|---|---|---|---|---|
| Q1 | Shop photography | Neutral blocks labelled "PHOTO PLACEHOLDER: {shot description}" (ocean on dark sections, pearl on light) | Everywhere | ☐ |
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

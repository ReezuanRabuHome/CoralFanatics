# Coral Fanatics

Premium custom e-commerce website for Coral Fanatics, a marine reef aquarium shop in Singapore.

**Current stage: Phase 1 — visual prototype (design approval gate).**
The storefront and admin screens use the real logo, the approved design tokens, clearly
labelled photo placeholders and invented SAMPLE data. There is no database, authentication
or payment yet. Those start in Phase 2 after the prototype is approved.

- Planning and design documents: [`docs/planning/`](docs/planning/README.md)
- Open business questions and the placeholders standing in for them: [`docs/planning/placeholders.md`](docs/planning/placeholders.md)
- Brand source files: [`assets/brand/`](assets/README.md)

## Run locally

Requires Node.js 22+.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # production build
npm run typecheck
```

## Prototype pages

| Storefront | Admin |
|---|---|
| `/` homepage | `/admin` overview |
| `/corals/sps` (also `lps`, `mushrooms`) listing with filters | `/admin/livestock` specimen board + new-specimen flow |
| `/corals/sps/fox-flame-acropora/cf-sps-0142` coral specimen | `/admin/orders/CF-10042` order detail |
| `/marine-life/fish/ocellaris-clownfish` fish | |
| `/equipment/reef-salt-mix` dry goods with variants | |
| `/new-arrivals`, `/checkout` (UI only, no payment) | |

## Where things live

```
src/app/(store)/       storefront routes
src/app/admin/         admin routes (no auth in the prototype)
src/app/globals.css    design-system tokens (Deliverable 2)
src/components/        shared UI
src/config/placeholders.ts   every placeholder business fact, in one file
src/data/sample.ts     SAMPLE data, replaced by database modules in Phase 2
```

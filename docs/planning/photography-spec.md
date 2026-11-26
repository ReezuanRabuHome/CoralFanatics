# Photography Specification

Applies to all imagery on the Coral Fanatics website. The core rule: **real Coral Fanatics photography only for stock and shop imagery. No AI-generated coral, and no stock photos standing in for real specimens.** Missing images use a clearly labelled placeholder (see §8).

---

## 1. Image types, dimensions and aspect ratios

Upload at the **master size or larger**. The system generates every display size automatically.

| Type | Aspect ratio | Master upload (min) | Display sizes generated | Notes |
|---|---|---|---|---|
| Homepage hero (desktop) | 16:9 (crops to 21:9 on ultrawide) | 3200 × 1800 | 3200, 2400, 1600, 1200 | Keep the subject centre-right; leave darker area top-left for headline |
| Homepage hero (mobile art-direction) | 4:5 | 1600 × 2000 | 1600, 1200, 800 | A separate crop or a separate photo; not just the desktop image squeezed |
| Hero video (optional) | 16:9 | 1920 × 1080, 10–20 s loop | 1080p + 720p | H.264 MP4 + WebM, muted, ≤ 4 MB at 720p; poster frame required |
| Collection panels (SPS/LPS/Mushroom) | 4:5 | 2000 × 2500 | 2000, 1400, 900, 600 | One representative real coral per category |
| **Coral specimen – primary** | **1:1** | **2400 × 2400** | 2400 (zoom), 1600, 1000, 600, 400 | Top-down, centred |
| Coral specimen – secondary | 1:1 | 2400 × 2400 | same | Side angle, scale reference, white-light shot (optional) |
| Fish / invertebrate | 1:1 (primary), 4:3 (gallery) | 2400 × 2400 | same | Side profile for fish |
| Dry goods | 1:1 | 2000 × 2000 | 2000, 1200, 800, 400 | White/pearl seamless background, product fills ~75% of frame |
| Brand story / shop | 3:2 or 4:5 | 3000 × 2000 | 3000, 2000, 1200, 800 | Documentary |
| Category banner | 21:9 | 3200 × 1371 | 3200, 2400, 1600 | Optional; text overlay space required |
| Open Graph / social | 1.91:1 | 1200 × 630 | 1200 | Generated from a template |

## 2. Lighting and background consistency

### Coral specimens (most important)
- **Photo station:** a dedicated photo tank or a fixed corner of a display, with the same light every time. Keep a written note of the light settings (fixture, channel %), camera, lens and white balance.
- **Lighting:** shoot under the shop's normal reef lighting. Use an **orange/yellow lens filter** (or a calibrated white-balance preset) so the camera shows what the eye sees. Do not push saturation to "pop" colours.
- **Background:** consistent dark neutral (black or deep blue-black acrylic) behind or under the frag plug.
- **Angle:** primary image top-down; the frag plug may be visible but cropped consistently.
- **Scale:** at least one image per specimen with a scale reference (a ruler disc, or the standard frag plug diameter stated in the description).
- **Water surface:** avoid surface ripple and glare (photograph through the side of a photo tank, or use a viewing box for top-down shots).

### Fish and invertebrates
- Plain background, the subject's eye in sharp focus, natural colour.
- If a photo is **representative** (not the exact animal sold), the system shows a "Representative photo" label. This is a legal and honesty requirement.

### Dry goods
- Even, soft lighting; white `#FFFFFF` or pearl `#F5F3ED` seamless; consistent camera height; no harsh shadows.
- Manufacturer images may be used **only** for dry goods, and only with permission from the brand or distributor.

## 3. Editing rules
- Allowed: exposure, white balance, crop, removing dust and backscatter, levelling.
- Not allowed: changing coral colour, adding glow, cloning out coral defects, compositing.
- Colour profile: export **sRGB**.
- Every coral page shows the colour honesty note (see Brand Audit §6).

## 4. File naming conventions

Originals are uploaded through the admin, which renames files automatically. For bulk/manual delivery, use:

```
{type}_{identifier}_{sequence}.{ext}

specimen_CF-SPS-0142_01.jpg     ← specimen ID + image order
specimen_CF-SPS-0142_02.jpg
product_red-sea-coral-pro-salt-22kg_01.jpg
brand_shop-interior_01.jpg
hero_home-desktop_01.jpg
hero_home-mobile_01.jpg
collection_sps_01.jpg
```

- Lowercase, hyphens, no spaces.
- Specimen IDs use the format in Deliverable 8: `CF-{TYPE}-{NNNN}`.
- Storage keys in R2: `products/{productId}/{imageId}/{width}.{avif|webp|jpg}`. These are generated, never hand-edited.

## 5. Compression and optimisation (automated)

On upload, the server (using `sharp`):
1. Rejects files under the minimum size for their type and warns about non-sRGB files.
2. Strips EXIF location data (privacy) but keeps orientation.
3. Generates AVIF (quality ~55), WebP (~75) and JPEG fallback (~80) at each display width.
4. Stores the original untouched in a private R2 prefix (for later re-processing).
5. Records width, height, dominant colour and a tiny blur placeholder (for smooth loading).

Targets: specimen card image ≤ 60 KB (AVIF at 600px); hero ≤ 350 KB at 2400px.

## 6. Product gallery requirements

| Product type | Minimum | Recommended |
|---|---|---|
| Coral specimen | 1 (primary top-down) | 3: top-down, angled side, scale reference |
| Fish | 1 | 2–3, plus optional short video (v1.1) |
| Invertebrate | 1 | 2 |
| Dry goods | 1 | 3–5: front, back/label, in use, size reference |

- Admin can **reorder** images and set the primary image.
- Every image needs **alt text**; the admin pre-fills it ("Fox Flame Acropora, specimen CF-SPS-0142, top view") and staff can edit it.

## 7. Shot list needed before design sign-off (minimum)

1. 2–3 hero candidates (wide display tank, dark surroundings).
2. 1 strong coral each for SPS, LPS and Mushroom collection panels.
3. 8–12 real coral specimens shot at the photo station (to validate the card grid).
4. 3–4 fish, 2–3 invertebrates.
5. 6–8 dry goods.
6. 4–6 shop interior and team photos.

## 8. Placeholders

When a real image is missing, the site shows a neutral placeholder: a deep-ocean or pearl block with a small outline icon and the text **"Photo coming soon"** (storefront) or **"PLACEHOLDER: no image uploaded"** (admin, in amber). **Livestock specimens with no real primary image cannot be published** (enforced by a validation rule), because a customer is buying that exact animal. Dry goods *may* be published with a placeholder, but they appear in the admin's "Needs attention" list until a photo is added.

# Static Image Architecture & Performance Documentation (`IMAGE-STRUCTURE.md`)

All website images for SLYTE are stored locally within the website project and served directly as static assets through **Cloudflare Static Hosting**. There is **zero dependency on Cloudflare R2** or external image CDNs.

---

## 1. Storage Location & Directory Structure

All image assets are housed in the root `/images/` directory:

```text
/images/
├── /products/        # Product front, side, back, and detail angle WebP images
├── /homepage/        # Hero background and interactive UI placeholder assets
├── /banners/         # Brand tagline and marketing banner assets
├── /logos/           # High-resolution transparent PNG brand logos
├── /icons/           # Category & feature UI icons
├── /size-guide/      # Size guide and measurement reference assets
└── /other/           # Internal reference assets
```

---

## 2. Image Asset Inventory & Optimization Metrics

| Original File Name | New Static Path | Format | Dimensions | Original Size | Optimized Size | Reduction | Purpose |
|--------------------|-----------------|--------|------------|---------------|----------------|-----------|---------|
| `whiterelaxedfittrouser.webp` | `images/products/white-relaxed-fit-trouser-front.webp` | WebP | 700x983 | 29.9 KB | 23.3 KB | -22% | Product 1 Main Front Image |
| `whiteright.png` | `images/products/white-relaxed-fit-trouser-right.webp` | WebP | 384x493 | 256.8 KB | 5.2 KB | -98% | Product 1 Right View |
| `whiteleft.png` | `images/products/white-relaxed-fit-trouser-left.webp` | WebP | 427x527 | 301.8 KB | 5.6 KB | -98% | Product 1 Left View |
| `whiteback.png` | `images/products/white-relaxed-fit-trouser-back.webp` | WebP | 353x507 | 251.5 KB | 6.3 KB | -97% | Product 1 Back View |
| `beigegurkha.webp` | `images/products/beige-gurkha-pant-front.webp` | WebP | 700x983 | 26.2 KB | 22.0 KB | -16% | Product 2 Main Front Image |
| `beigegurkharight.png` | `images/products/beige-gurkha-pant-right.webp` | WebP | 377x595 | 270.4 KB | 9.5 KB | -96% | Product 2 Right View |
| `beigegurkhaleft.png` | `images/products/beige-gurkha-pant-left.webp` | WebP | 421x592 | 290.7 KB | 9.3 KB | -97% | Product 2 Left View |
| `beigegurkhaback.png` | `images/products/beige-gurkha-pant-back.webp` | WebP | 431x608 | 301.6 KB | 9.0 KB | -97% | Product 2 Back View |
| `DeepBlackPleatedGurkhaPant.jpg` | `images/products/deep-black-pleated-gurkha-pant-front.webp` | WebP | 503x934 | 49.8 KB | 20.4 KB | -59% | Product 3 Main Front Image |
| `blackright.png` | `images/products/deep-black-pleated-gurkha-pant-right.webp` | WebP | 360x640 | 304.8 KB | 7.2 KB | -98% | Product 3 Right View |
| `blackleft.png` | `images/products/deep-black-pleated-gurkha-pant-left.webp` | WebP | 368x668 | 328.2 KB | 7.8 KB | -98% | Product 3 Left View |
| `blackback.png` | `images/products/deep-black-pleated-gurkha-pant-back.webp` | WebP | 332x640 | 262.7 KB | 6.6 KB | -97% | Product 3 Back View |
| `BrownTexturedKoreanPant.jpg` | `images/products/brown-textured-korean-pant-front.webp` | WebP | 700x983 | 69.7 KB | 41.0 KB | -41% | Product 4 Main Front Image |
| `brownright.png` | `images/products/brown-textured-korean-pant-right.webp` | WebP | 370x530 | 297.6 KB | 8.7 KB | -97% | Product 4 Right View |
| `brownslant.png` | `images/products/brown-textured-korean-pant-slant.webp` | WebP | 409x625 | 389.5 KB | 11.5 KB | -97% | Product 4 Slant View |
| `brownback.png` | `images/products/brown-textured-korean-pant-back.webp` | WebP | 428x592 | 382.0 KB | 9.9 KB | -97% | Product 4 Back View |
| `DSC9860_1000x.jpg` (Downloaded) | `images/products/pecan-khaki-relaxed-fit-korean-pintuck-pants-front.webp` | WebP | 1000x1333 | 99.2 KB | 49.1 KB | -50% | Product 5 Main Front Image |
| `hero-bg.png` | `images/homepage/hero-bg.webp` | WebP | 232x318 | 95.0 KB | 4.2 KB | -96% | Hero Banner Background |
| `ai-output-placeholder.png` | `images/homepage/ai-output-placeholder.webp` | WebP | 1366x768 | 312.8 KB | 37.0 KB | -88% | AI Fit Page Placeholder |
| `tagline.png` | `images/banners/slyte-tagline-banner.webp` | WebP | 2172x724 | 539.3 KB | 14.4 KB | -97% | Marketing Banner |
| `slyte_logo (black).png` | `images/logos/slyte-logo-black.png` | PNG | 853x246 | 142.6 KB | 108.7 KB | -24% | Header & Drawer Brand Logo |
| `slyte_logo(white).png` | `images/logos/slyte-logo-white.png` | PNG | 1774x887 | 273.3 KB | 218.5 KB | -20% | Dark Header Brand Logo |
| `slyte only logo black.png` | `images/logos/slyte-only-logo-black.png` | PNG | 416x416 | 88.9 KB | 68.9 KB | -22% | Site Favicon & Mobile Icon |
| `DASH-removebg-preview.png` | `images/logos/dash-logo.png` | PNG | 423x157 | 24.9 KB | 23.5 KB | -6% | Sub-brand Logo Asset |

---

## 3. Core Web Vitals Loading Strategy

### Above-The-Fold / Largest Contentful Paint (LCP) Assets
The primary above-the-fold image assets are configured for instant rendering:
- **Primary Product LCP Image** (`images/products/white-relaxed-fit-trouser-front.webp` on `index.html` & `product.html`):
  - Configured with `fetchpriority="high"`
  - **No** `loading="lazy"` attribute applied
  - Ensures browser pre-parser loads image immediately without queuing delay.

### Below-The-Fold Assets
All secondary gallery images, category cards, and catalog grid items below the initial viewport use native lazy loading:
- Configured with `loading="lazy"`
- Defers network bandwidth until user scrolls to the section.

### Cumulative Layout Shift (CLS) Prevention
- Every `<img>` tag in the project defines explicit `width=""` and `height=""` attributes (e.g. `width="700" height="983"`).
- Enables browsers to calculate aspect ratio instantly before images download, completely eliminating Cumulative Layout Shift.

---

## 4. Optimization Exceptions

- **Brand Logos (`/images/logos/`)**: Kept as lossless PNG format to preserve alpha channel transparency and pixel-sharp vector edges across light/dark backgrounds without compression artifacts.

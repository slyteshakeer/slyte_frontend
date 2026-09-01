# Cloudflare Pages Deployment Guide (Static Assets Architecture)

This guide provides step-by-step instructions for deploying the `slyte_frontend` project directly to **Cloudflare Pages**, setting up custom domain routing, handling caching, and managing rollbacks.

> [!NOTE]
> **No Cloudflare R2 Required**: All website HTML, CSS, JavaScript, and images (`/images/`) are deployed together as static assets served directly through Cloudflare Pages.

---

## 1. Project Architecture

```text
Cloudflare Pages
│
├── HTML (index.html, product.html, shop.html, etc.)
├── CSS (styles.css, cart.css, seo-content.css)
├── JavaScript (script.js, cart.js, api-client.js, js/config.js)
└── images/
      │
      ├── products/      # WebP product images
      ├── homepage/      # Hero & UI placeholder assets
      ├── banners/       # Marketing banners
      ├── logos/         # Brand logos & favicons
      └── icons/         # UI icons

Supabase Backend
│
└── Database & Edge Functions APIs (https://iqdtfllkdtjypiseklzt.supabase.co/functions/v1)
```

---

## 2. Cloudflare Pages Deployment Settings

Because this project is built with **vanilla HTML, CSS, JavaScript, and static WebP/PNG images**, no npm/node build step is required!

### Cloudflare Pages Setup:
1. Log into your [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. In the left navigation bar, select **Workers & Pages**.
3. Click **Create Application** → **Pages** → **Connect to Git** (or Direct Upload).

#### Direct Upload Option (Fastest):
- Select **Upload assets**.
- Set **Project Name**: `slyte-frontend` (or your preferred name).
- Upload the entire root directory `e:\slyte_frontend` (including `images/`, `_redirects`, `sitemap.xml`, `robots.txt`, and HTML/CSS/JS files).

#### Git Integration Option (Automatic Deploys on Push):
- Link your GitHub / GitLab repository.
- Select your production branch (`main` or `master`).
- **Framework Preset**: `None`
- **Build command**: *(Leave completely blank)*
- **Build output directory**: `/` (or leave blank for root directory)

---

## 3. Connecting Custom Domain (`slyte.in`)

1. In your Cloudflare Pages project, click the **Custom domains** tab.
2. Click **Set up a custom domain**.
3. Enter `slyte.in` (and optionally `www.slyte.in`).
4. Cloudflare will automatically configure CNAME records pointing `slyte.in` to `<your-project>.pages.dev` with free managed SSL.

---

## 4. Redirects & Clean URLs

The repository includes a `_redirects` file in the root directory:

```
/login /index.html 301
```

Cloudflare Pages automatically reads `_redirects` and serves static HTML files cleanly (e.g. serving `product.html` for `/product`).

---

## 5. Cache Management & Purging

Cloudflare Pages automatically serves images and static assets through Cloudflare's global CDN network.

### How to Purge Cache:
1. Go to Cloudflare Dashboard → **Caching** → **Configuration**.
2. Click **Purge Everything** (or **Custom Purge** for specific URLs like `/products-data.js` or `/images/homepage/hero-bg.webp`).

---

## 6. Rollback to a Previous Deployment

1. In your Pages project dashboard, click **Deployments**.
2. Browse past deployment history.
3. Next to any previous successful deployment, click **...** → **Rollback to this deployment**.
4. Cloudflare Pages instantly restores the previous static build worldwide without downtime.

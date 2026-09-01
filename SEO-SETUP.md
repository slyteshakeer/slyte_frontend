# Google Search Console & Technical SEO Setup Guide

This document explains step-by-step how to connect `slyte.in` to Google Search Console, submit your sitemap, request page indexing, monitor search queries, and troubleshoot indexing errors.

---

## 1. Connecting Domain to Google Search Console

### Method A: Domain Verification via DNS (Recommended)
1. Go to [Google Search Console](https://search.google.com/search-console/).
2. Click **Add property** → Select **Domain** (e.g., `slyte.in`).
3. Copy the TXT record provided by Google (e.g., `google-site-verification=xxxx...`).
4. In Cloudflare Dashboard → **DNS** → **Records** → **Add Record**:
   - **Type**: `TXT`
   - **Name**: `@` or `slyte.in`
   - **Content**: `google-site-verification=xxxx...`
   - **TTL**: Auto
5. Return to Google Search Console and click **Verify**.

### Method B: HTML Meta Tag Verification
If DNS access is restricted, copy the verification HTML tag and paste it inside `<head>` of `index.html`:

```html
<meta name="google-site-verification" content="YOUR_VERIFICATION_TOKEN" />
```

---

## 2. Submitting Sitemap.xml

1. In Search Console left sidebar, click **Sitemaps**.
2. Under **Add a new sitemap**, enter:
   `sitemap.xml`
3. Click **Submit**.
4. Confirm status shows **Success** and all 9 public indexable pages are discovered:
   - `https://slyte.in/`
   - `https://slyte.in/shop.html`
   - `https://slyte.in/product.html`
   - `https://slyte.in/pants.html`
   - `https://slyte.in/trousers.html`
   - `https://slyte.in/menswear.html`
   - `https://slyte.in/custom-fit.html`
   - `https://slyte.in/custom-clothing.html`
   - `https://slyte.in/ai-fit.html`

---

## 3. Requesting Page Indexing

For immediate indexing of newly updated or high-priority pages:
1. Paste the full URL (e.g. `https://slyte.in/product.html?id=1`) into the Search Console top search bar (**URL Inspection**).
2. Click **Test Live URL**.
3. Once live test succeeds, click **Request Indexing**.

---

## 4. Monitoring Indexing Errors & Performance

### Monitoring Indexing Status
- Check **Pages** tab under Indexing.
- Ensure private pages (`/cart.html`, `/orders.html`, `/complete-profile.html`) are listed under *Excluded by 'noindex' tag* (this is intentional and correct).
- Ensure public pages are listed under *Indexed*.

### Monitoring Search Queries & Impressions
- Under **Performance** → **Search Results**:
  - Track **Total clicks**, **Total impressions**, **Average CTR**, and **Average position**.
  - Filter by **Queries** to discover high-value keywords (e.g. "custom fit pants india", "gurkha pants for men", "slyte trousers").
  - Filter by **Pages** to optimize top landing pages.

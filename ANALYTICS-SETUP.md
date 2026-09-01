# Cloudflare Web Analytics & Optional GA4 Setup Guide

This guide explains step-by-step how to enable **Cloudflare Web Analytics** (privacy-conscious, lightweight visitor analytics) for the Slyte frontend, verify tracking, and optionally configure **Google Analytics (GA4)** for eCommerce events.

---

## 1. Cloudflare Web Analytics Setup

Cloudflare Web Analytics is privacy-first, cookie-free, and does not require a consent banner.

### Step 1: Enable Cloudflare Web Analytics
1. Log into your [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. In the left sidebar, navigate to **Web Analytics**.
3. Click **Add a site** (or select your existing `slyte.in` site).
4. Select **JS Snippet Setup** (or automatic setup if using Cloudflare DNS/Proxy).
5. Copy your unique **Beacon Token** (a string of letters and numbers like `a1b2c3d4e5f67890`).

### Step 2: Insert Token into HTML Pages
In all public HTML pages (`index.html`, `product.html`, `shop.html`, `pants.html`, `trousers.html`, `menswear.html`, `custom-fit.html`, `custom-clothing.html`, `ai-fit.html`, `cart.html`, `orders.html`, `wishlist.html`, `search.html`, `signup.html`), locate the Cloudflare Web Analytics comment block in the `<head>`:

```html
<!-- Cloudflare Web Analytics -->
<script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "YOUR_CLOUDFLARE_BEACON_TOKEN"}'></script>
<!-- End Cloudflare Web Analytics -->
```

Replace `YOUR_CLOUDFLARE_BEACON_TOKEN` with the beacon token copied from Cloudflare.

---

## 2. Verifying Tracking & Viewing Analytics

### How to Verify Tracking
1. Deploy the site to Cloudflare Pages.
2. Open `https://slyte.in/` in your browser.
3. Open Developer Tools (F12) → **Network** tab.
4. Filter for `beacon.min.js` or `cloudflareinsights.com`.
5. Confirm an HTTP 200/204 request is sent successfully.

### Where to View Dashboard Metrics
In the Cloudflare Dashboard under **Web Analytics**:
- **Visitor Numbers**: Total page views and unique visits over 24h, 7 days, or 30 days.
- **Page Views**: Breakdowns by specific page path (`/`, `/shop.html`, `/product.html`).
- **Popular Pages**: Sorted list of top-performing URLs.
- **Referral Sources**: Traffic origins (Direct, Google Search, Instagram, WhatsApp, etc.).
- **Performance & Core Web Vitals**: LCP, FID, CLS scores by device type.

---

## 3. Optional Google Analytics 4 (GA4) eCommerce Setup

If you require advanced eCommerce tracking (Cart additions, Checkout initiation, Purchases, Revenue funnels), you can optionally add GA4.

### Adding GA4 Script
Place the GA4 tag in `<head>` above `styles.css`:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Supported eCommerce Events
In `script.js` and `cart.js`, trigger events when user actions occur:

1. **Add to Cart** (`add_to_cart`):
   ```javascript
   if (typeof gtag === 'function') {
     gtag('event', 'add_to_cart', {
       currency: 'INR',
       value: parseFloat(product.price.replace(/[^\d]/g, '')),
       items: [{ item_id: product.id, item_name: product.name }]
     });
   }
   ```

2. **Begin Checkout** (`begin_checkout`):
   ```javascript
   if (typeof gtag === 'function') {
     gtag('event', 'begin_checkout', {
       currency: 'INR',
       value: grandTotal,
       items: cartItems
     });
   }
   ```

3. **Purchase** (`purchase`):
   ```javascript
   if (typeof gtag === 'function') {
     gtag('event', 'purchase', {
       transaction_id: orderId,
       value: totalAmount,
       currency: 'INR'
     });
   }
   ```

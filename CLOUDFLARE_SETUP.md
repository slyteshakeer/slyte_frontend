# Cloudflare Worker API Setup & Deployment Guide (`CLOUDFLARE_SETUP.md`)

This guide provides step-by-step instructions for configuring, binding secrets, deploying, and connecting the **`slyte-api` Cloudflare Worker** to your static frontend (`slyte-frontend`).

---

## 1. Architecture Overview

```text
Static Frontend (Cloudflare Pages: slyte-frontend)
│
├── Domain: https://slyte.in
└── js/config.js (API_BASE_URL: "https://api.slyte.in")
      │
      ▼
Cloudflare Worker API (slyte-api)
│
├── Custom Subdomain: https://api.slyte.in
├── Server-Side Price Validation (Against Product Catalog)
├── Domain-Scoped CORS (Allowed Origin: https://slyte.in)
└── Encrypted Cloudflare Worker Secret Bindings:
      ├── CASHFREE_APP_ID
      ├── CASHFREE_SECRET_KEY
      ├── CASHFREE_ENV (PRODUCTION / SANDBOX)
      ├── SHIPROCKET_EMAIL
      ├── SHIPROCKET_PASSWORD
      ├── SUPABASE_URL
      ├── SUPABASE_SERVICE_ROLE_KEY
      ├── MONGODB_URI
      └── JWT_SECRET
```

---

## 2. Secrets Configuration (Required Cloudflare Secrets)

To ensure zero backend secrets or API keys are exposed to the browser or committed to GitHub, all secrets must be added using Cloudflare Wrangler CLI or the Cloudflare Dashboard.

### Exact Secret Names & Commands

Run these commands inside the `slyte-api` directory:

```bash
cd slyte-api

# 1. Cashfree Payment Gateway Credentials
npx wrangler secret put CASHFREE_APP_ID
# Prompt: Enter your Cashfree App ID

npx wrangler secret put CASHFREE_SECRET_KEY
# Prompt: Enter your Cashfree Secret Key

# 2. Shiprocket Shipping Credentials
npx wrangler secret put SHIPROCKET_EMAIL
# Prompt: Enter your Shiprocket account email

npx wrangler secret put SHIPROCKET_PASSWORD
# Prompt: Enter your Shiprocket account password

# 3. Supabase Database Service Role Key
npx wrangler secret put SUPABASE_URL
# Prompt: Enter your Supabase URL (e.g. https://iqdtfllkdtjypiseklzt.supabase.co)

npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
# Prompt: Enter your Supabase service_role secret key

# 4. MongoDB Database URI (If applicable)
npx wrangler secret put MONGODB_URI
# Prompt: Enter your MongoDB connection URI

# 5. JWT Secret Key
npx wrangler secret put JWT_SECRET
# Prompt: Enter a strong random secret string for JWT signing
```

---

## 3. Worker Deployment Commands

### Prerequisites
- Install Node.js (v18+)
- Install Cloudflare Wrangler globally or use `npx wrangler`:
  ```bash
  npm install -g wrangler
  ```

### Step-by-Step Worker Deployment
1. Authenticate with Cloudflare:
   ```bash
   npx wrangler login
   ```
2. Navigate to the Worker project directory:
   ```bash
   cd slyte-api
   ```
3. Test locally with live reloading:
   ```bash
   npx wrangler dev
   ```
   *(Worker runs at `http://localhost:8787`)*

4. Deploy Worker to Production:
   ```bash
   npx wrangler deploy
   ```

---

## 4. Custom Subdomain Setup (`api.slyte.in`)

To bind your Worker to `https://api.slyte.in`:

1. Log into [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Navigate to **Workers & Pages** → Select **slyte-api**.
3. Click **Settings** → **Triggers** → **Custom Domains**.
4. Click **Add Custom Domain**.
5. Enter: `api.slyte.in`
6. Click **Add Custom Domain**. Cloudflare will automatically route DNS requests and issue free SSL certificates.

---

## 5. Frontend Integration

The frontend automatically connects to the API Worker via `js/config.js`:

```javascript
window.SLYTE_CONFIG = {
    // Points to custom domain in production, or localhost:8787 in local dev
    API_BASE_URL: "https://api.slyte.in",
    getImageUrl: function(path) { ... }
};
```

All checkout, login, OTP, and order tracking calls in `api-client.js`, `orders.html`, and `index.html` automatically route to `https://api.slyte.in`.

---

## 6. How to Test Each API Endpoint

You can test the deployed Worker API endpoints using `curl`:

### A. Health Check
```bash
curl -X GET https://api.slyte.in/health
```
*Expected Response:* `{"status":"ok","service":"slyte-api",...}`

### B. Create Order / Cashfree Payment Session
```bash
curl -X POST https://api.slyte.in/api/payment/create \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 999,
    "customerPhone": "9876543210",
    "customerName": "Test Customer",
    "customerEmail": "test@slyte.in",
    "cart_details": [
      { "id": 1, "name": "White Relaxed Fit Trouser", "quantity": 1, "price": 999 }
    ]
  }'
```
*Expected Response:* `{"success":true,"order_id":"SLYTE_...","amount":999,"payment_session_id":"..."}`

### C. Verify Payment
```bash
curl -X GET https://api.slyte.in/api/payment/verify/SLYTE_123456789
```
*Expected Response:* `{"success":true,"order_id":"SLYTE_123456789","order_status":"PAID","payment_status":"PAID"}`

### D. Phone Login
```bash
curl -X POST https://api.slyte.in/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone": "9876543210"}'
```
*Expected Response:* `{"success":true,"user":{"phone":"9876543210","name":"Customer"}}`

### E. Send OTP
```bash
curl -X POST https://api.slyte.in/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "9876543210"}'
```
*Expected Response:* `{"success":true,"message":"OTP sent successfully..."}`

### F. Verify OTP
```bash
curl -X POST https://api.slyte.in/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "9876543210", "otp": "123456"}'
```
*Expected Response:* `{"success":true,"message":"OTP verified successfully"}`

### G. Order Lookup
```bash
curl -X POST https://api.slyte.in/api/orders/lookup \
  -H "Content-Type: application/json" \
  -d '{"phone": "9876543210"}'
```
*Expected Response:* `{"success":true,"orders":[]}`

### H. Cancel Order
```bash
curl -X POST https://api.slyte.in/api/orders/cancel \
  -H "Content-Type: application/json" \
  -d '{"order_id": "SLYTE_123456789"}'
```
*Expected Response:* `{"success":true,"message":"Order SLYTE_123456789 cancellation requested successfully."}`

---

## 7. Step-by-Step Deployment Checklist

- [x] **Worker Code & Config**: Created `slyte-api/wrangler.jsonc`, `package.json`, and `src/index.js`.
- [x] **Server-Side Price Validation**: Implemented official catalog validation in `src/index.js` to override browser-submitted prices.
- [x] **Domain-Scoped CORS**: Configured Worker response headers to restrict `Access-Control-Allow-Origin` to `https://slyte.in`.
- [x] **Frontend Refactor**: Updated `js/config.js`, `api-client.js`, `orders.html`, `index.html`, `success.html` to point to `window.SLYTE_CONFIG.API_BASE_URL`.
- [ ] **Deploy Worker**: Run `cd slyte-api && npx wrangler deploy`.
- [ ] **Add Cloudflare Secrets**: Execute `npx wrangler secret put` for `CASHFREE_APP_ID`, `CASHFREE_SECRET_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, etc.
- [ ] **Bind Custom Domain**: Add `api.slyte.in` custom domain trigger under Worker settings in Cloudflare Dashboard.
- [ ] **Deploy Static Frontend**: Push `slyte-frontend` to Cloudflare Pages via Git / direct upload.

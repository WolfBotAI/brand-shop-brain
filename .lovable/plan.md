

# Phase 3–6: Complete Production Build Plan

## Summary

The backend at `api.brand-shop.ai` provides: dashboard summary, integration status, supplier accounts, store builder trigger, and GHL connect. It does NOT expose catalog browsing, AI vision job management, or order routing rule endpoints. However, we have `SS_API_KEY` and `SS_ACCOUNT_NUMBER` secrets configured, so we can call the S&S Activewear API directly via an edge function.

---

## Phase 3A — Real Catalog via S&S Activewear API

**Edge Function: `ss-catalog`**
- Create a backend function that proxies requests to the S&S Activewear API (`https://api.ssactivewear.com/v2/`)
- Uses `SS_API_KEY` and `SS_ACCOUNT_NUMBER` secrets (already configured)
- Endpoints to proxy: `GET /styles` (list/search), `GET /styles/{styleID}` (detail), `GET /products` (SKU-level variants)
- Auth: Basic auth with account number + API key per S&S docs

**Replace `ssProducts.ts` mock data**
- Rewrite `searchStyles()`, `getAllStyles()`, `getStyleById()`, `getProductsByStyle()` to call the edge function instead of returning hardcoded arrays
- Map S&S API response fields to existing `SSStyle` and `SSProduct` interfaces
- Keep `getSearchQueriesForVertical()` as-is (it drives search terms)

**Store Workspace — Catalog tab**
- Persist selected product style IDs in `stores.metadata` during onboarding
- Workspace Catalog tab fetches product details from the edge function using stored style IDs

---

## Phase 3B — Store Workspace Tabs

**Pricing tab**
- Build markup rules UI: global percentage markup, per-category overrides, per-product overrides
- Store pricing config in `stores.metadata.pricing` (JSON in existing column)
- Calculate retail price = cost × (1 + markup)

**Mockups tab**
- Build logo-on-product mockup generator using canvas overlay
- User uploads logo (already have logo from onboarding), positions it on product images
- Save generated mockup URLs to store metadata

**Billing tab**
- Display current billing model (Brand-Shop Managed)
- Show store creation date, plan tier info
- Placeholder for Stripe integration

---

## Phase 4 — Operations Console (DB-backed)

Since the backend doesn't expose vision/routing endpoints, we'll persist this data in Supabase.

**Database migration**
- Create `vision_jobs` table: id, user_id, source (email/pdf/photo), subject, customer, status, extracted_fields (jsonb), error_flag, created_at
- Create `routing_rules` table: id, user_id, category, decoration_type, supplier, decorator, priority, created_at
- RLS: users see only their own data

**AI Vision Jobs page**
- Replace `MOCK_JOBS` with Supabase queries
- Add "Create Job" flow (manual entry or future email integration)
- Wire Approve/Push buttons to update status in DB

**Order Routing Manager page**
- Replace `MOCK_RULES` and `MOCK_INVOICE_ITEMS` with Supabase queries
- Wire Add/Edit/Delete rule buttons to real CRUD operations
- Split Order Viewer reads rules from DB to compute routing

---

## Phase 5 — Public Storefront

**Route: `/store/:slug`** (unprotected)
- Add `slug` column to `stores` table (unique, auto-generated from store name)
- Public page fetches store config (theme, logo, name) from Supabase with a public RLS policy on slug lookup
- Fetches catalog products via the ss-catalog edge function using stored style IDs
- Renders StorefrontPreview-style layout with real product data, cart, and theme

**Checkout**
- Cart state management with React context
- Checkout form (name, email, shipping address)
- Order saved to new `orders` table in Supabase
- Future: Stripe payment integration

---

## Phase 6 — Remaining Features

- **KPI Reports page**: Charts (recharts) with date range filters, pulling from dashboard API
- **Pop-Up Stores**: Add `expires_at` field to stores table, countdown/splash page logic
- **Site Migration**: Wizard UI that calls Firecrawl to scrape existing store, import products
- **AI Chat Widget**: Embed chat component on public storefront using Lovable AI model
- **Notifications settings**: Wire to profile preferences

---

## Implementation Order

| Step | Scope | Depends On |
|------|-------|------------|
| 1 | SS Catalog edge function | SS_API_KEY (already set) |
| 2 | Replace ssProducts.ts with real API calls | Step 1 |
| 3 | Vision Jobs + Routing Rules DB tables | Nothing |
| 4 | Wire AI Vision & Order Routing to DB | Step 3 |
| 5 | Store Workspace tabs (Pricing, Mockups) | Step 2 |
| 6 | Public Storefront + slug | Steps 2, 5 |
| 7 | KPI Reports, Pop-Up Stores, remaining | Step 6 |

Steps 1+3 can run in parallel. Steps 2+4 can run in parallel after their dependencies.

---

## Technical Details

**S&S Activewear API** (confirmed docs pattern):
- Base URL: `https://api.ssactivewear.com/v2/`
- Auth: HTTP Basic (`SS_ACCOUNT_NUMBER:SS_API_KEY`)
- Key endpoints: `/styles`, `/styles/{id}`, `/products`, `/categories`
- Response: JSON array of style/product objects

**New DB tables:**
```
vision_jobs: id, user_id, source, subject, customer, status, extracted_fields, error_flag, created_at
routing_rules: id, user_id, category, decoration_type, supplier, decorator, priority, created_at
orders: id, store_id, customer_email, customer_name, shipping_address, items, total, status, created_at
```

All tables get RLS restricting to `auth.uid() = user_id`. The `stores` table gets a public SELECT policy for slug-based lookups on the public storefront.


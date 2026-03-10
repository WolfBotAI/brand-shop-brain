

# Production Readiness Audit — What's Working, What's Not, What Needs to Be Done

## Current State: What's Actually Working

### Backend API (api.brand-shop.ai) — LIVE
I tested the API directly. It's running and responding:
- `GET /health` → `{"ok":true}`
- `GET /api/integrations/status` → Returns real data (SSActivewear connected, Printful connected, ShipStation, TaxJar, Printavo, etc.)
- `GET /api/supplier-accounts?tenantId=...` → Works (requires tenantId)
- `GET /api/dashboard/summary?tenantId=...` → Works (requires tenantId)
- `POST /api/ghl/connect` → Endpoint exists (POST)
- `POST /api/store-builder/trigger` → Endpoint exists (POST)
- `POST /api/supplier-accounts` → Endpoint exists (POST)

The API layer in `src/lib/api/` is correctly wired to these endpoints. The backend codex is built and running.

### What's Wired to Real API
- **Dashboard** (`Dashboard.tsx`) — calls `fetchDashboardSummary()` and `fetchIntegrationStatus()` via react-query. Will work once tenantId is set.
- **Onboarding WolfBot step** — calls `connectWolfBot()` POST to real API
- **Onboarding Supplier step** — calls `createSupplierAccount()` POST to real API
- **Onboarding Store creation** — calls `createStore()` POST to real API
- **Firecrawl branding scrape** — wired through a Cloud edge function

### What's Using Mock/Hardcoded Data (NOT wired)
- **Product Catalog** (`ssProducts.ts`) — 12 hardcoded mock products with fake delays. NOT calling the real SS Activewear API through the backend.
- **Store List** (`StoreList.tsx`) — hardcoded `MOCK_STORES` array
- **Suppliers page** (`Suppliers.tsx`) — hardcoded `MOCK_SUPPLIERS` array
- **AI Vision Jobs** (`AIVisionJobs.tsx`) — hardcoded `MOCK_JOBS` array
- **Order Routing** (`OrderRoutingManager.tsx`) — hardcoded `MOCK_RULES` and `MOCK_INVOICE_ITEMS`
- **Store Workspace** (`StoreWorkspace.tsx`) — relies on React router `location.state` (ephemeral, lost on refresh)
- **Settings** (`Settings.tsx`) — hardcoded values, no persistence

## What's Completely Missing

### 1. Authentication (Critical)
No login, signup, or session management. All `/app/*` routes are unprotected. Anyone can access the portal.

### 2. Tenant Context Persistence
`setTenantContext()` stores tenantId in localStorage, but there's no way to establish it except going through onboarding. No login flow sets it.

### 3. Real Catalog API Integration
The backend has SS Activewear connected, but the frontend uses mock data in `ssProducts.ts` instead of calling the backend catalog endpoints. Need to discover the correct catalog API routes.

### 4. Store List from API
Need a `GET /api/stores?tenantId=...` endpoint (or similar) and wire `StoreList.tsx` to it.

### 5. Store Workspace Persistence
Currently reads from `location.state`. On refresh, everything is lost. Needs to fetch store data from `GET /api/stores/:storeId`.

### 6. Public Storefront
No customer-facing store page exists (e.g., `/store/:slug` for end-customers to browse/buy).

---

## Plan: Path to Production

### Phase 1 — Authentication & Protected Routes
- Add login/signup pages using Cloud authentication
- Create a profiles table to store tenantId, locationId, business name
- Protect all `/app/*` routes with an auth guard
- On login, restore tenant context from profile

### Phase 2 — Wire Mock Pages to Real API
- **Store List**: Add `fetchStores()` to `src/lib/api/stores.ts`, replace `MOCK_STORES`
- **Suppliers**: Replace `MOCK_SUPPLIERS` with `fetchSupplierAccounts()` (already exists in API layer)
- **Store Workspace**: Fetch store data from API on mount instead of `location.state`
- **Product Catalog**: Replace mock catalog in `ssProducts.ts` with real API calls (need to confirm backend catalog routes — likely `GET /api/catalog/styles` or similar)
- **AI Vision Jobs**: Add API calls (need to confirm backend routes)
- **Order Routing**: Add API calls (need to confirm backend routes)
- **Settings**: Wire to profile data

### Phase 3 — Public Storefront
- Create `/store/:slug` route for end-customers
- Fetch store config, products, and theme from API
- Build browsable product catalog with cart

---

## Before I Start: I Need One Thing

I can see the API is live, but I need to know the exact catalog/product endpoints available on the backend. The frontend has mock data in `ssProducts.ts` but I don't know the real routes for:
- Searching/listing catalog products
- Fetching AI Vision jobs
- Fetching order routing rules
- Listing stores by tenant

**Can you share the API route list or documentation from the codex backend?** Alternatively, if there's a project with the backend code, point me to it and I'll read it directly.

In the meantime, I can immediately start with **Phase 1 (Authentication)** since that doesn't depend on knowing additional API routes. Want me to proceed with that?


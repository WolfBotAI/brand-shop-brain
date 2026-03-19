

# Phase 6 — Remaining Features Implementation Plan

## What's Done (Phases 1–5)
Auth, wiring, catalog API, workspace tabs, operations console, public storefront — all complete.

## What's Left (7 features)

### 1. KPI Reports Page (`/app/reporting`)
- New page with recharts: revenue over time (line), orders by store (bar), top products (horizontal bar), margin breakdown (pie)
- Date range filter (7d / 30d / 90d / all) and store filter dropdown
- Data source: query `orders` table grouped by store, aggregate totals
- Add "Reporting" nav item to sidebar

### 2. Pop-Up Stores
- DB migration: add `expires_at` (timestamptz, nullable) and `store_type` (text, default 'standard') columns to `stores` table
- Onboarding: add store type selector (Standard vs Pop-Up) with date picker for expiration
- Public storefront: if `expires_at < now()`, show expired splash page with countdown-to-close or redirect message
- Store list: show countdown badge for pop-up stores

### 3. Site Migration Wizard (`/app/migrate`)
- New page with step-by-step wizard: Enter URL → Firecrawl scrape → Review extracted products/branding → Import into new store
- Uses existing `firecrawl-scrape` edge function to extract branding and product data
- Creates a new store with scraped theme config and product catalog
- Add "Migrate" nav item to sidebar

### 4. AI Chat Widget (Public Storefront)
- Floating chat bubble on `/store/:slug` pages
- Uses Lovable AI (gemini-2.5-flash) via an edge function to answer product questions
- Sends store context (product list, store name) as system prompt
- Simple message list + input UI

### 5. Multi-Store Bulk Actions
- Add checkboxes to StoreList cards
- Bulk action bar: "Update Status", "Delete Selected", "Export"
- Bulk status update via Supabase batch update

### 6. Customer Portal (`/store/:slug/orders`)
- Public page where customers enter email to view their order history
- Queries `orders` table by `customer_email` with anon RLS policy (need new policy)
- Shows order list with status, items, total, date

### 7. White-Label / Custom Domain
- Settings tab for custom domain configuration
- Stores `custom_domain` field in stores table
- Display instructions for DNS setup (CNAME to lovable.app)
- This is primarily UI — actual DNS routing is external

---

## Database Changes Required
1. Add `expires_at` and `store_type` columns to `stores` table
2. Add `custom_domain` column to `stores` table  
3. Add anon SELECT policy on `orders` for customer email lookup
4. Create `ai-chat` edge function for storefront chat

## New Files
- `src/pages/app/Reporting.tsx` — KPI reports with recharts
- `src/pages/app/SiteMigrationWizard.tsx` — migration wizard
- `src/pages/app/CustomerOrders.tsx` — customer order lookup
- `supabase/functions/ai-chat/index.ts` — AI chat edge function

## Modified Files
- `src/App.tsx` — add new routes
- `src/components/app/AppSidebar.tsx` — add Reporting and Migrate nav items
- `src/pages/app/PublicStorefront.tsx` — add chat widget and expiry check
- `src/pages/app/StoreList.tsx` — add bulk actions and pop-up badges
- `src/components/app/onboarding/CreateStoreStep.tsx` — add store type + expiry picker
- `src/pages/app/Settings.tsx` — add custom domain config section
- `.lovable/plan.md` — mark Phase 6 complete

## Implementation Order
1. KPI Reports (self-contained, immediate value)
2. Pop-Up Stores (DB migration + onboarding + storefront changes)
3. Site Migration Wizard (uses existing Firecrawl)
4. AI Chat Widget (new edge function + storefront embed)
5. Multi-Store Bulk Actions (StoreList enhancement)
6. Customer Portal (new route + RLS policy)
7. White-Label Config (UI-only settings)


# Production Build Plan — Status

## ✅ Completed

### Phase 1 — Auth & App Shell
- Supabase Auth, protected routes, profile persistence — DONE

### Phase 2 — Wiring & Persistence
- Dashboard, Store List, Suppliers, Settings wired to real API/DB — DONE

### Phase 3A — Real Catalog via S&S Activewear API
- Created `ss-catalog` edge function proxying S&S API v2 with Basic auth
- Replaced `ssProducts.ts` mock with live API calls (fallback to mock on failure)
- Store Workspace Catalog tab fetches real product data — DONE

### Phase 3B — Store Workspace Tabs
- **Pricing**: Global markup slider, per-product preview table, saves to `stores.metadata.pricing` — DONE
- **Mockups**: Logo overlay on product images using onboarding logo — DONE
- **Billing**: Shows plan tier, billing model, creation date — DONE

### Phase 4 — Operations Console (DB-backed)
- Created `vision_jobs`, `routing_rules`, `orders` tables with RLS
- AI Vision Jobs: full CRUD (create/approve/push/process), replaces MOCK_JOBS — DONE
- Order Routing: full CRUD (add/edit/delete rules), replaces MOCK_RULES — DONE

### Phase 5 — Public Storefront & Checkout
- Added `slug` column to stores, auto-generated on store creation
- Public route `/store/:slug` with anon RLS policy
- Full product grid with theme, cart, checkout form
- Orders saved to `orders` table — DONE

---

## 🔲 Remaining (Phase 6)

| Feature | Status |
|---------|--------|
| KPI Reports page (recharts + date filters) | Not started |
| Pop-Up Stores (expires_at, countdown) | Not started |
| Site Migration wizard (Firecrawl import) | Not started |
| AI Chat Widget (public storefront) | Not started |
| Multi-Store bulk actions | Not started |
| Customer Portal (order history) | Not started |
| White-Label / custom domain | Not started |

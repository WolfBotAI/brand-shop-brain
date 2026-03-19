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

### Phase 6 — Remaining Features
- **KPI Reports** (`/app/reporting`): Revenue over time, orders by store, top products, status breakdown charts with date range + store filters — DONE
- **Pop-Up Stores**: Added `expires_at`, `store_type`, `custom_domain` columns to stores. Onboarding has store type selector + expiry picker. Public storefront shows expired splash or countdown banner — DONE
- **Site Migration** (`/app/migrate`): Wizard scrapes URL via Firecrawl, extracts branding/colors/logo, creates new store — DONE
- **AI Chat Widget**: `ai-chat` edge function using Lovable AI (gemini-2.5-flash). Floating chat widget on public storefront with streaming responses — DONE
- **Multi-Store Bulk Actions**: StoreList has checkboxes, bulk status update, bulk delete — DONE
- **Customer Portal** (`/store/:slug/orders`): Email lookup for order history with anon RLS — DONE
- **White-Label / Custom Domain**: Settings page has per-store custom domain config with DNS instructions — DONE

---

## 🎉 All Phases Complete

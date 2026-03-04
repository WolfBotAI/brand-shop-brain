

# Project Status & Next Steps

## What's Built

### Marketing Website (Landing)
- Hero, Intro, Introducing, Packages, Seamless, Connect, Integrations, CTA sections — all updated with current product copy, placehold.co images, package tiers, and working CTA scroll buttons
- Navbar with Features dropdown linking to all feature pages
- 10 feature pages: Store Builder, AI Support, AI Vision, AI Suggestions, Order Routing, Reporting, KPI Reports, Multi-Store, Site Migration, Acquisition — all with hero, demos, feature sections, and CTAs

### Platform App (`/app/`)
- **Phase 1 — App Shell & Dashboard**: Done. Sidebar with nav groups (Distributor, Operations, Platform), Dashboard with KPI cards, activity feed, integration health, store performance table
- **Phase 2 — Distributor Onboarding**: Done. Full wizard with Welcome, WolfBot Connect (GHL), Supplier setup, AI Discovery chat (4-step), Package tier selection, Catalog with bulk variant selection, Logo upload, Theme picker (presets/custom/scrape), Storefront preview, Completion
- **Phase 3 — Store Workspace**: Partial. Has Storefront preview, Overview, Catalog grid, Pricing/Mockups/Billing tabs are placeholder stubs

### What's NOT Built Yet (by roadmap phase)

**Phase 3 — Store Launch Workspace (incomplete)**
- Pricing Rules tab (stub — needs markup percentage controls, per-category rules)
- Mockup Studio tab (stub — needs AI mockup generation UI)
- Billing tab (stub — needs payment method management)
- Catalog sync status and re-sync controls

**Phase 4 — Ops Console (not started)**
- `/app/ai-vision` — AI Vision jobs dashboard (inbox of incoming emails/POs, extraction status, error flags, Printavo push status)
- `/app/routing` — Order Routing rules manager (supplier/decorator mapping, manual override, split order view)
- These are in the sidebar nav but have no routes or pages

**Phase 5 — Client Portal (not started)**
- Public-facing storefront at `/store/:storeId`
- Customer-facing catalog, cart, checkout
- AI Chat widget embedded on storefront

**Other Missing Platform Features**
- `/app/stores` — Store list page (sidebar link exists, no route)
- `/app/suppliers` — Integrations/supplier management page (sidebar link exists, no route)
- `/app/settings` — Settings page (sidebar link exists, no route)
- Authentication — No login/signup, all `/app` routes are open

## Recommended Next Step

The highest-impact next step is **Phase 4 — Ops Console**, specifically the two pages already in the sidebar:

### 1. AI Vision Jobs Page (`/app/ai-vision`)
- Table/list of incoming documents (emails, PDFs, photos)
- Status badges: Pending, Extracting, Needs Review, Approved, Pushed to Printavo
- Detail view showing extracted fields (customer, items, quantities, sizes, colors)
- Error flags with "Email Customer" action
- Mock data for demo purposes (no backend integration yet)

### 2. Order Routing Page (`/app/routing`)
- Routing rules configuration (supplier + decorator mapping per product category/decoration type)
- Split order viewer showing how an invoice gets divided
- Manual override controls
- Mock data for demo

### 3. Route Registration
- Add routes for `/app/ai-vision`, `/app/routing`, `/app/stores`, `/app/suppliers`, `/app/settings` in `App.tsx`

### Files

| File | Action |
|------|--------|
| `src/pages/app/AIVisionJobs.tsx` | New — Vision jobs dashboard |
| `src/pages/app/OrderRoutingManager.tsx` | New — Routing rules + split viewer |
| `src/pages/app/StoreList.tsx` | New — List of all stores |
| `src/pages/app/Suppliers.tsx` | New — Integration/supplier management |
| `src/pages/app/Settings.tsx` | New — Settings placeholder |
| `src/App.tsx` | Add routes for all new pages |

This builds out the operational backbone. After this, Phase 5 (Client Portal) and authentication would follow.


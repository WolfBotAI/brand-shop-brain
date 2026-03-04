

# Brand-Shop.AI Platform Rebuild Plan

## Context

The current Lovable project is a **marketing/landing site** with feature pages (Store Builder, AI Vision, Order Routing, etc.). The real backend engine lives at `https://api.brand-shop.ai` (built via Codex) and already handles store creation, catalog sync, pricing, mockups, routing, AI Vision, checkout, and more.

The task is to **keep the marketing site** and build the full **distributor/decorator/store platform** as a new application section at `/app/*`, calling the live backend directly.

---

## Architecture

```text
/                          ← Marketing site (keep as-is)
/app                       ← Platform shell (sidebar + header)
/app/dashboard             ← Home dashboard
/app/onboarding            ← Distributor onboarding wizard
/app/stores                ← Store list
/app/stores/:id            ← Store launch workspace
/app/stores/:id/catalog    ← Catalog sync & curation
/app/stores/:id/pricing    ← Pricing workspace
/app/stores/:id/mockups    ← Mockup studio
/app/stores/:id/storefront ← Storefront preview & publish
/app/suppliers             ← Supplier account management
/app/routing               ← Order routing rules & console
/app/ai-vision             ← AI Vision jobs & review
/app/settings              ← Tenant/integration settings
```

### API Service Layer

Create a centralized API client (`src/lib/api.ts`) wrapping `fetch` calls to `https://api.brand-shop.ai`. All endpoints go through this layer so we can swap to a BFF/edge proxy later without touching components.

```text
src/lib/api/
  client.ts          ← Base fetch wrapper, error handling, headers
  stores.ts          ← Store CRUD, domains
  catalogs.ts        ← Catalog sync
  pricing.ts         ← Pricing config & rules
  mockups.ts         ← Mockup generation & settings
  storefront.ts      ← Resolve, catalog, checkout
  routing.ts         ← Routing rules & execution
  ai-vision.ts       ← Ingest & job management
  suppliers.ts       ← Supplier accounts
  dashboard.ts       ← Dashboard summary
  integrations.ts    ← Integration status
  tenant.ts          ← GHL connect, tenant setup
```

---

## Build Phases

### Phase 1: App Shell + Dashboard (Build First)

**What to build:**

1. **Platform layout** — Sidebar navigation using Shadcn `Sidebar` component, top header with `SidebarTrigger`, role-aware nav groups (Distributor, Decorator, Platform)
2. **Dashboard page** (`/app/dashboard`) — Calls `GET /api/dashboard/summary` and `GET /api/integrations/status`. Shows:
   - Active stores count, total orders, revenue KPIs
   - Launch readiness scores (gamified)
   - Recent activity feed
   - Integration health status cards
   - AI assistant card with next-best-action recommendations
3. **API client foundation** — `src/lib/api/client.ts` with tenant context, error normalization, React Query hooks

**Files to create:**
- `src/lib/api/client.ts` — Base API client
- `src/lib/api/dashboard.ts` — Dashboard endpoints
- `src/layouts/AppLayout.tsx` — Sidebar + header shell
- `src/components/app/AppSidebar.tsx` — Sidebar nav
- `src/pages/app/Dashboard.tsx` — Dashboard page
- Routes in `App.tsx` under `/app/*`

### Phase 2: Distributor Onboarding

**What to build:**

Multi-step guided wizard (`/app/onboarding`) with progress indicator, AI assistant guidance, and completion scoring:

1. Welcome + brand positioning
2. Connect GHL location → `POST /api/ghl/connect`
3. Connect supplier credentials → `POST /api/supplier-accounts`
4. Create first store → `POST /api/store-builder/trigger`
5. Completion celebration + redirect to store workspace

**UX:** Step cards with `AnimatedStep` component (already exists), progressive disclosure, no raw IDs visible, trust checkpoints.

**Files to create:**
- `src/lib/api/tenant.ts`, `src/lib/api/suppliers.ts`
- `src/pages/app/Onboarding.tsx`
- `src/components/app/onboarding/` — Step components

### Phase 3: Store Launch Workspace

**What to build:**

Store-scoped workspace (`/app/stores/:id`) with tabbed sub-views:

1. **Overview** — Store status, domain, launch readiness score, publish checklist
2. **Catalog** — Trigger sync (`POST /api/catalogs/sync`), show imported products, image coverage stats, curation controls
3. **Pricing** — Model selector, markup rule builder, live price preview with before/after, scope switcher → calls pricing config + rules endpoints
4. **Mockups** — Product preview canvas, placement selector, logo layer controls, decoration style, auto-generate rules, generated gallery → calls mockup endpoints
5. **Storefront** — Preview mode, domain assignment (`POST /api/storefront/domains`), publish checklist, cart test mode

**Gamification:** Launch readiness score (catalog synced ✓, pricing set ✓, mockups generated ✓, domain assigned ✓, etc.)

**Files to create:**
- `src/lib/api/stores.ts`, `src/lib/api/catalogs.ts`, `src/lib/api/pricing.ts`, `src/lib/api/mockups.ts`, `src/lib/api/storefront.ts`
- `src/pages/app/stores/StoreList.tsx`
- `src/pages/app/stores/StoreWorkspace.tsx`
- `src/components/app/stores/` — Overview, Catalog, Pricing, Mockups, Storefront tabs

### Phase 4: Ops Console

**What to build:**

1. **AI Vision** (`/app/ai-vision`) — Upload intake (`POST /api/ai-vision/ingest`), GHL attachment intake, job queue with status, review interface
2. **Order Routing** (`/app/routing`) — Rule builder (`POST /api/routing/rules`), routing test (`POST /api/routing/route`), exception queue, audit timeline
3. **Supplier Management** (`/app/suppliers`) — Credential management, connection status, sync history

**Files to create:**
- `src/lib/api/routing.ts`, `src/lib/api/ai-vision.ts`
- `src/pages/app/AIVision.tsx`
- `src/pages/app/Routing.tsx`
- `src/pages/app/Suppliers.tsx`

### Phase 5: Client Portal (Decorator/Store View)

Separate layout for end-customer store experience — storefront catalog, cart, checkout, order history. This consumes `GET /api/storefront/:storeId/catalog` and `POST /api/storefront/checkout`.

---

## UX Rules Applied Everywhere

- **Guided progress**: Every workspace shows current stage, next action, blockers, completion confidence
- **AI assistant**: Contextual recommendation cards (not decoration) — e.g., "12 products imported. 4 missing front images." or "Puff embroidery recommended for hats."
- **Scoring**: Launch readiness, mockup coverage, catalog quality — practical, not gamified badges
- **Workspaces over forms**: Side panels, inspectors, preview canvases, step cards — no raw CRUD screens
- **Brand system**: Uses existing Brand-Shop.AI design tokens (primary orange, secondary navy, accent blue)

## Technical Notes

- Marketing site (`/`, `/features/*`) remains untouched
- All API calls go through centralized service layer for future BFF swap
- React Query for server state management (already installed)
- No auth enforcement in Phase 1 — will add BFF/edge layer before production
- SanMar supplier is excluded from UI until backend implements it

## Recommended Starting Point

**Phase 1 (App Shell + Dashboard)** is the foundation everything else plugs into. I recommend building this first, then iterating through phases 2-5 in order.

Shall I proceed with Phase 1?


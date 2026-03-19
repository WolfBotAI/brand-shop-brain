

# Production Readiness Audit + New Features

## What's Already Built
- Distributor onboarding (profile, catalog, pricing, client store creation)
- S&S catalog browsing with infinite scroll
- Pricing engine with platform fees + distributor markup
- Public storefront with cart/checkout
- Basic order history lookup by email (`/store/:slug/orders`)
- AI chat widget on storefronts
- GHL sync edge function (foundation)
- Dashboard, store workspace, settings

## What's Pending / New Requirements

### 1. Order Status Tracking Page (per store)
**Current state:** `CustomerOrders.tsx` shows order history by email but has no real-time status tracking, no order number lookup, and no status detail view.

**Build:**
- Upgrade `/store/:slug/orders` to an **Order Status Tracker** — accepts order number OR email
- Show real-time status timeline (Received → In Production → Decorated → Shipped → Delivered)
- Pull status from three sources in priority order:
  1. Printful API (if order was fulfilled via Printful)
  2. Decorator API (if routed to a decorator with API)
  3. GHL contact record `status` field (fallback)
- Create a `check-order-status` edge function that queries these sources and returns unified status
- Add GHL chat widget + AI voice agent phone number to the status page (configurable per store)

### 2. Per-Store AI Agent Toggle (Chat + Voice)
**Current state:** Chat widget is always shown on storefronts. No voice agent. No per-store billing toggle.

**Build:**
- Add `ai_chat_enabled` and `ai_voice_enabled` boolean columns to `stores` table
- Add AI agent toggle controls in `StoreWorkspace.tsx` settings tab
- Conditionally render chat widget and voice agent phone number on storefront/status page based on these flags
- Show billing notice: "AI Chat: $X/mo per store" / "AI Voice: $X/mo per store"

### 3. Accounting Integration (QuickBooks / Xero / Spreadsheet)
**Build:**
- Add an `accounting_config` jsonb column to `stores` table (per-location) and `profiles` table (distributor-level)
- Create a settings section in `StoreWorkspace.tsx` for connecting accounting:
  - QuickBooks Online (OAuth — future connector)
  - Xero (OAuth — future connector)
  - Google Sheets export (manual CSV download now, API later)
- Create a `sync-accounting` edge function that formats order data for each platform
- For now: implement CSV/spreadsheet export of orders as the immediate solution; QuickBooks/Xero OAuth as Phase 2

### 4. GHL Deep Sync
**Current state:** `ghl-sync` edge function exists but isn't wired into order flow.

**Build:**
- Wire `ghl-sync` into the checkout flow in `PublicStorefront.tsx` (after order insert)
- Add communication logging: every chat message and order status update gets logged as a GHL conversation note
- Auto-create GHL sub-account on store creation in `AddClientStep.tsx`

### 5. Remaining Production Gaps
- **Order status updates:** Add `UPDATE` RLS policy on `orders` table for store owners
- **Printful integration:** Create `check-order-status` edge function that queries Printful order status API
- **Platform fees seed data:** Insert default row into `platform_fees` table so pricing step works out of the box
- **Email verification:** Currently no auto-confirm — verify this is working correctly
- **Error handling:** Add proper error boundaries and loading states across all pages

## Files to Create/Change

| File | Change |
|------|--------|
| `src/pages/app/CustomerOrders.tsx` | Complete rewrite → Order Status Tracker with order# + email lookup, status timeline, GHL chat widget, voice agent phone |
| NEW: `supabase/functions/check-order-status/index.ts` | Queries Printful API, decorator API, or GHL for order status |
| `src/pages/app/PublicStorefront.tsx` | Wire GHL sync on checkout, conditionally show chat/voice based on store flags |
| `src/pages/app/StoreWorkspace.tsx` | Add AI agent toggles (chat/voice), accounting integration section |
| `src/components/app/store/StorefrontChatWidget.tsx` | Make conditional on `ai_chat_enabled` |
| `supabase/functions/ghl-sync/index.ts` | Add communication logging action |
| Migration | Add `ai_chat_enabled`, `ai_voice_enabled`, `accounting_config` to `stores`; add `UPDATE` policy on `orders` for store owners; seed `platform_fees` |
| `src/pages/app/Settings.tsx` | Add distributor-level accounting connection option |

## Implementation Order
1. Database migration (new columns + policies + seed data)
2. Order Status Tracker page with edge function
3. Per-store AI agent toggles
4. GHL sync wiring into checkout + store creation
5. Accounting integration (CSV export now, OAuth connectors later)


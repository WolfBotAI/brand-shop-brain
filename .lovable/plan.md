

# Enhanced Theme Selection + Store Provisioning

## Two problems to solve

### 1. Theme step needs more options
Currently the theme step only shows 3 preset palettes. The user wants:
- **Custom brand colors** — a color picker to define their own palette
- **AI website scrape** — enter a URL, the system scrapes it (via Firecrawl branding format), extracts logos, brand colors, fonts, and auto-suggests a theme
- **Edit existing themes** — ability to tweak colors on any preset theme

### 2. Completion step shows nothing — no actual store
After "Create Store" the user lands on a placeholder workspace with "coming soon" tabs. There must be a real, functional storefront preview showing the selected products, theme, and logo — ready to take orders.

---

## Plan

### A. Upgrade Theme Phase in CreateStoreStep

Add three tabs/modes to the theme selection phase:

1. **Presets** (current behavior, cleaned up) — vertical-based palettes with edit button per theme
2. **Custom Colors** — 4 color pickers (primary, secondary, accent, background) with live swatch preview
3. **AI Scrape** — URL input field + "Analyze Website" button. Uses Firecrawl `branding` format to extract colors, logo, and fonts. Auto-populates a custom theme and shows the extracted logo. Requires connecting the Firecrawl connector.

Each mode produces the same output: a `ThemeConfig` object with `{ primary, secondary, accent, background, logoUrl?, fontFamily? }`.

**Files:**
- `src/components/app/onboarding/CreateStoreStep.tsx` — Replace Phase C (theme) with tabbed UI (Presets / Custom / AI Scrape)
- New: `src/lib/api/firecrawl.ts` — Firecrawl API client (from useful-context pattern)
- New: `supabase/functions/firecrawl-scrape/index.ts` — Edge function for scraping (branding format)

### B. Build a Real Store Preview + Storefront Page

After store creation, instead of a placeholder workspace, render an actual storefront preview page showing:
- Store name + logo header
- Theme colors applied as CSS variables
- Product grid with images, prices, color swatches
- "Add to Cart" buttons (functional UI, mock cart for now)
- A live URL the user can share (even if it's just the `/app/stores/:storeId` route styled as a storefront)

**Files:**
- `src/pages/app/StoreWorkspace.tsx` — Major rewrite: replace placeholder tabs with a real storefront preview tab that renders the selected products, theme, and logo
- New: `src/components/app/store/StorefrontPreview.tsx` — The actual mini-storefront component (product grid, cart, header with logo/colors)
- `src/components/app/onboarding/CompletionStep.tsx` — Update messaging: show the live store URL, embed a small iframe/preview of the storefront, add "Share Store Link" button

### C. Wire Store Creation to Codex API

The `handleCreateStore` function currently generates a fake ID. Wire it to the real `createStore()` from `src/lib/api/stores.ts` which calls `POST /api/store-builder/trigger`. Pass the selected products, theme config, and logo URL in the request body so the Codex engine can provision the GHL funnel/site.

**Files:**
- `src/components/app/onboarding/CreateStoreStep.tsx` — Replace `handleCreateStore` with real API call using `createStore()`, pass selected product IDs, theme, logo, billing model
- `src/lib/api/stores.ts` — Extend `CreateStoreRequest` to include `selectedProducts`, `themeConfig`, `logoUrl` fields

---

## Architecture

```text
Theme Phase (CreateStoreStep)
 ├── Tab: Presets (vertical-based palettes, edit button)
 ├── Tab: Custom (4 color pickers → ThemeConfig)
 └── Tab: AI Scrape (URL → Firecrawl branding → auto-fill ThemeConfig + logo)

Store Creation
 ├── POST /api/store-builder/trigger (Codex API)
 │    body: { storeName, clientName, brandVertical, selectedProducts[], themeConfig, logoUrl, billingModel }
 └── Response: { storeId, catalogId, storefrontUrl }

Completion → Store Workspace
 ├── StorefrontPreview (live mini-store with products, theme, logo)
 ├── Share link / iframe preview
 └── Edit tabs (Catalog, Pricing, Mockups, Storefront, Billing)
```

## Files Summary

| File | Action |
|------|--------|
| `src/components/app/onboarding/CreateStoreStep.tsx` | Rewrite theme phase with 3 tabs; wire `handleCreateStore` to real API |
| `src/lib/api/stores.ts` | Extend request type with products, theme, logo fields |
| `src/lib/api/firecrawl.ts` | **New** — Firecrawl API client for branding scrape |
| `supabase/functions/firecrawl-scrape/index.ts` | **New** — Edge function for Firecrawl branding extraction |
| `src/components/app/store/StorefrontPreview.tsx` | **New** — Live storefront preview component |
| `src/pages/app/StoreWorkspace.tsx` | Rewrite with real storefront preview tab |
| `src/components/app/onboarding/CompletionStep.tsx` | Show live store preview + share link |


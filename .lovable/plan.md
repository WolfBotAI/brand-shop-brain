

# Fix: Show the ENTIRE S&S Catalog (Not Just 15 or 50)

## Problem

Two limits are blocking the full catalog:

1. **`getAllStyles()` requests only 50 items** (`perPage: "50"`) from the S&S API — one page, no pagination
2. **When the API fails, it falls back to a hardcoded 15-item array** instead of loading all available products

The S&S Activewear catalog has **thousands** of styles. Distributors need to browse and select from the complete inventory.

## Solution

### 1. Add pagination to `getAllStyles()` in `src/lib/api/ssProducts.ts`
- Fetch page 1, then keep fetching subsequent pages until the API returns fewer results than `perPage`
- Use `perPage=100` for efficiency (fewer round trips)
- Accumulate all pages into a single array before returning
- Show a loading progress indicator while pages load

### 2. Add lazy/infinite scroll to `CatalogSetupStep.tsx`
- Instead of loading everything upfront (which could be slow for thousands of items), implement **paginated loading with infinite scroll**
- Load first 100 items immediately, then fetch more as the user scrolls down
- Keep search and category filtering working — when a search/filter changes, reset and re-fetch from page 1 with the new parameters
- Show a "Loading more..." spinner at the bottom of the grid while fetching the next page

### 3. Update `searchStyles()` similarly
- Currently also limited to 50 results — paginate or at minimum fetch a larger set (200+)

### 4. Keep fallback catalog as emergency-only
- The 15-item fallback stays but is only used if the edge function is completely unreachable
- Add a banner when in fallback mode: "Showing sample catalog — full catalog unavailable"

## Files to Change

| File | Change |
|------|--------|
| `src/lib/api/ssProducts.ts` | Add `fetchAllStyles()` with pagination loop; update `getAllStyles()` to paginate; add `fetchStylesPage(page, filters)` for lazy loading |
| `src/components/app/onboarding/CatalogSetupStep.tsx` | Replace single `loadCatalog()` call with paginated infinite scroll; add loading-more indicator; pass search/category filters to API instead of client-side filtering |
| `supabase/functions/ss-catalog/index.ts` | No changes needed — already supports `page` and `perPage` params |

## How It Will Work

```text
User opens Catalog Setup
  → Fetches page 1 (100 styles) from ss-catalog edge function
  → Renders grid immediately
  → As user scrolls down, fetches page 2, 3, 4...
  → Search box sends keyword to API (server-side filtering)
  → Category badges also filter via API parameter
  → If API is down → shows 15-item fallback with warning banner
```

This ensures distributors see the **complete S&S inventory** (branded "Brand-Shop Apparel") and can select exactly what they want to offer.


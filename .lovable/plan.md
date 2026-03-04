

# Pull Real Products from SS Activewear API — Images, Pricing, Catalog

## Summary

Replace all hardcoded emoji product cards with real product data from the SS Activewear API (images, descriptions, wholesale pricing). Create a Supabase Edge Function to proxy the API calls (the SS API requires Basic Auth and won't work from the browser). Display two pricing tiers: distributor cost and standard retail.

## Architecture

```text
Browser (CreateStoreStep)
   │
   ▼
Edge Function: supabase/functions/ss-products/index.ts
   │  (Basic Auth with SS_ACCOUNT_NUMBER + SS_API_KEY)
   ▼
SS Activewear API v2
   ├── GET /v2/styles/?search={vertical keywords}
   │     → returns styleID, title, description, baseCategory, styleImage
   └── GET /v2/products/?style={styleID}&fields=Sku,piecePrice,customerPrice,colorFrontImage,colorName,sizeName,brandName,styleName
         → returns real images, wholesale prices per SKU
```

## Steps

### 1. Store SS Activewear credentials as secrets
- `SS_ACCOUNT_NUMBER` — the distributor's account number (used as Basic Auth username)
- `SS_API_KEY` — the API key (used as Basic Auth password)

### 2. Create Edge Function `supabase/functions/ss-products/index.ts`
- Accepts `POST` with body: `{ categoryFilter?: string, styleIds?: string[], search?: string }`
- Calls SS Activewear API with Basic Auth header (`Authorization: Basic base64(account:key)`)
- Two modes:
  - **Search styles**: `GET /v2/styles/?search={query}` — returns style-level data (title, image, baseCategory)
  - **Get products for style**: `GET /v2/products/?style={styleId}&fields=Sku,piecePrice,customerPrice,dozenPrice,casePrice,colorFrontImage,colorName,sizeName,brandName,styleName,title` — returns SKU-level data with real images and pricing
- Returns normalized JSON with images prefixed as `https://www.ssactivewear.com/{imagePath}`
- Includes CORS headers

### 3. Create `src/lib/api/ssProducts.ts`
- Functions to call the edge function:
  - `searchStyles(query: string)` — search by keyword (e.g., "t-shirt", "hoodie", "polo")
  - `getProductsByStyle(styleIds: string[])` — get SKU-level data with images/prices
- Maps vertical to search keywords (sports → "performance tee, athletic short, hoodie, cap, polo"; corporate → "polo, oxford, jacket, pullover")
- Returns typed data with `imageUrl`, `brandName`, `styleName`, `title`, `customerPrice` (distributor cost), `piecePrice` (standard retail)

### 4. Rewrite catalog section in `CreateStoreStep.tsx`
- On entering Phase B (Catalog), call `searchStyles` with vertical-mapped keywords
- Show loading skeleton while fetching
- Display real product cards with:
  - Actual product image from SS (`colorFrontImage`)
  - Brand + style name (e.g., "Gildan 2000")
  - Title (e.g., "Ultra Cotton T-Shirt")
  - Two price lines: **Distributor Cost**: `$X.XX` (customerPrice) | **Standard Retail**: `$X.XX` (piecePrice)
  - Checkbox to select/deselect for the store
- Products grouped by baseCategory (T-Shirts, Hoodies, Caps, etc.)
- Keep the AI Merch Advisor chat — when user mentions filtering, re-query the API with refined search terms

### 5. Pricing display logic
- **Distributor pricing** = `customerPrice` from SS API (the logged-in distributor's wholesale cost)
- **Standard/retail pricing** = `piecePrice` from SS API (non-distributor single-piece price)
- Distributors can later set their own markup on top of their cost in the Pricing tab of StoreWorkspace

## Files to create/modify

| File | Action |
|------|--------|
| `supabase/functions/ss-products/index.ts` | New — edge function proxying SS Activewear API |
| `src/lib/api/ssProducts.ts` | New — frontend API layer for calling the edge function |
| `src/components/app/onboarding/CreateStoreStep.tsx` | Rewrite Phase B catalog to use real SS API data |

## Credentials needed
Before building, we need to store two secrets:
- `SS_ACCOUNT_NUMBER` — your SS Activewear account number
- `SS_API_KEY` — your SS Activewear API key


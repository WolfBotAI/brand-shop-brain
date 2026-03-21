

# Fix: Real Catalog with Images, Colors, Sizes, and Pricing from S&S API

## Root Causes

After testing the live S&S API, here's what's actually happening:

1. **Images return 404** — `www.ssactivewear.com` blocks direct image fetches (requires browser session/cookies). The edge function proxy tries both auth and no-auth, both fail.
2. **Styles endpoint returns NO colors, sizes, or pricing** — it only returns `styleID`, `title`, `description`, `brandName`, `baseCategory`, and `styleImage` (a relative path). No `availableColors`, `availableSizes`, `customerPrice`, or `piecePrice`.
3. **Products endpoint HAS everything** — colors with hex codes, sizes, pricing tiers (piece/dozen/case/customer), front/back/side images per color, inventory qty.

The current code calls `/styles` and tries to map `availableColors` and `availableSizes` which simply don't exist in that response, so every product shows 0 colors, 0 sizes, and no pricing.

## Solution: Two-Phase Data Loading

### Phase 1 — Browse by Styles (grid view)
- Show style cards with: title, brand, category, description (rendered as HTML)
- For images: use the S&S CDN pattern `https://cdni.ssactivewear.com/` instead of `www.ssactivewear.com` — this is the public CDN that works without auth. Replace `_fm` with `_fl` for large images.
- If CDN still fails, show category-specific placeholder icons (already built)

### Phase 2 — Click to Expand (product details)
- When a user clicks a style card, call the **products endpoint** (`/products/?styleID=XXXX`) to fetch all SKU-level data
- This returns every color/size combination with:
  - `colorName`, `color1` (hex), `colorFrontImage`, `colorBackImage`
  - `sizeName`
  - `customerPrice`, `piecePrice`, `dozenPrice`, `casePrice`
- Aggregate into unique colors and sizes for the selection UI
- Show real pricing with Brand-Shop markup applied

### Edge Function Changes (`ss-catalog/index.ts`)
- Fix image proxy: try `cdni.ssactivewear.com` CDN domain instead of `www.ssactivewear.com`
- Add a new action `styleDetail` that fetches `/products/?styleID=X` and returns aggregated colors, sizes, pricing, and image URLs

### API Client Changes (`ssProducts.ts`)
- Update `mapStyle()` to stop expecting colors/sizes/pricing from styles endpoint (they're not there)
- Add `fetchStyleProducts(styleID)` that calls the products endpoint and returns aggregated color/size/pricing data
- Fix image URL construction to use the CDN pattern: `https://cdni.ssactivewear.com/{path}` with `_fl` suffix for large images

### Catalog UI Changes (`CatalogSetupStep.tsx`)
- Style cards show: image, title, brand, category badge, and a "View Details" button
- Clicking a card opens `ProductDetailModal` which loads product-level data (colors, sizes, pricing) on demand
- Modal shows: all color swatches (from `colorFrontImage`), all sizes, pricing tiers (piece/dozen/case), description rendered as HTML
- User selects colors and sizes in the modal, sets per-item markup there
- Price display: "Your Cost: $X.XX" (customerPrice) + "Retail: $X.XX" (with Brand-Shop fee + distributor markup applied)

### ProductDetailModal Changes
- On open: call `fetchStyleProducts(styleID)` to get real data
- Show loading spinner while fetching
- Display color swatches with actual product images (each color has its own front/back image)
- Show pricing breakdown: base cost → + Brand-Shop fee → your retail price
- Render HTML description properly with `dangerouslySetInnerHTML`

## Files to Change

| File | Change |
|------|--------|
| `supabase/functions/ss-catalog/index.ts` | Fix image CDN URL (`cdni.ssactivewear.com`), add `styleDetail` action that fetches products by styleID and aggregates colors/sizes/pricing |
| `src/lib/api/ssProducts.ts` | Fix image URL helper to use CDN domain, add `fetchStyleProducts()`, update `mapStyle()` to not expect missing fields |
| `src/components/app/onboarding/CatalogSetupStep.tsx` | Style cards show image + basic info only, click opens detail modal for color/size/price selection |
| `src/components/app/onboarding/ProductDetailModal.tsx` | Load real product data on open, show color images, sizes, pricing tiers, HTML description |
| `src/components/app/onboarding/ProductImage.tsx` | Update CDN URL construction |

## Implementation Order
1. Fix edge function image proxy + add styleDetail action
2. Update API client with CDN URLs + fetchStyleProducts
3. Update ProductDetailModal to load real data
4. Update CatalogSetupStep cards to show images + link to modal


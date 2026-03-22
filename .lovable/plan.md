
# Fix the Catalog Images Once and For All

## What is actually broken

I inspected the code and data, and the issue is now very clear:

- `ss_catalog_cache` currently has **5,760 styles**
- **336** styles have colors/pricing enriched
- **0** styles have `style_image_url`
- The catalog grid renders cards from `product.styleImage`, which maps to `style_image_url`
- So the grid is guaranteed to show placeholders for every item right now

There is a second bug too:

- In `sync-catalog` detail mode, color images are being stored as raw S&S image URLs (`colorFrontImage`, `colorBackImage`)
- Those S&S URLs are not browser-safe/public for this app
- So even enriched products can still fail in the detail modal

So the real problem is not the React components. The real problem is the image pipeline:
1. main style images are never populated
2. color images are saved in the wrong format
3. the nightly enrichment only enriches colors/sizes/pricing, not usable hosted images

## What to build

### 1. Replace the current image strategy with true cached hosting
Update `sync-catalog` so it does all of this server-side:

- For each style:
  - fetch products from S&S
  - extract usable image candidates
  - download the image server-side
  - upload it into the public `product-images` bucket
  - save the public hosted URL into:
    - `style_image_url`
    - each color’s `imageUrl` / `backImageUrl`

This means the frontend will only ever read our own hosted URLs, never direct S&S URLs.

### 2. Merge image enrichment into the main detail sync
Right now the process is split awkwardly:
- `mode=detail` enriches metadata
- `mode=images` tries to backfill style images later
- nothing in the code appears to be actually running `mode=images`

I would simplify this:

- make `mode=detail` also generate hosted images
- optionally keep `mode=images` only as a repair/backfill tool
- nightly cron should call the unified enrichment path, not metadata-only

### 3. Backfill the existing cache
After the function is corrected, run a proper backfill so existing rows get repaired:

- all rows with `style_image_url is null`
- all rows where `colors[].imageUrl` still points to raw S&S URLs
- prioritize already-enriched rows first so the visible catalog improves fast

### 4. Make the UI prefer hosted cached images only
Update the frontend image logic so it is deterministic:

- grid card image source:
  1. `style_image_url`
  2. first cached color image from `colors`
  3. placeholder
- detail modal image source:
  1. selected cached color image
  2. `style_image_url`
  3. placeholder

Also, do not treat any random `http` URL as valid just because it starts with `http`. The UI should prefer known hosted URLs from our cache.

### 5. Avoid showing “broken but technically loaded” image states
The blank modal area in your screenshot should be hardened:

- add a stricter image fallback state
- if image load fails once, immediately swap to branded placeholder
- show a lightweight “image syncing” badge if the product is enriched but image hosting is still pending

### 6. Make catalog records production-ready
To stop repeating this problem, the cache should be treated as the source of truth:

```text
S&S API → sync-catalog edge function → product-images bucket + ss_catalog_cache → frontend
```

The frontend should not depend on live S&S image URLs at all.

## Files to change

- `supabase/functions/sync-catalog/index.ts`
  - download/upload style and color images during enrichment
  - save public hosted URLs into cache
  - optionally add a repair mode for missing images

- `src/lib/api/ssProducts.ts`
  - map `style_image_url` and cached color image URLs cleanly
  - prefer hosted cache URLs only

- `src/components/app/onboarding/ProductImage.tsx`
  - make fallback handling stricter and immediate
  - stop assuming every external URL is usable

- `src/components/app/onboarding/CatalogSetupStep.tsx`
  - prefer fallback to first cached color image if `style_image_url` is missing
  - optionally show “syncing image” state

- `src/components/app/onboarding/ProductDetailModal.tsx`
  - prefer cached selected color image, then hosted style image, then placeholder

## Implementation order

1. Fix `sync-catalog` so it uploads and stores usable hosted images
2. Backfill existing cache rows with hosted image URLs
3. Update frontend to prefer cached hosted URLs only
4. Add stronger placeholder/syncing states so nothing looks broken during backfill

## Expected result

After this fix:
- the catalog grid will show real product images
- the product detail modal will show real color images
- the app will stop relying on inaccessible S&S URLs
- nightly sync will keep the catalog updated without breaking images again

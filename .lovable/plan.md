

# Fix Broken Catalog Images: Cache S&S Catalog in Supabase Storage

## Root Cause
The S&S Activewear CDN (`cdni.ssactivewear.com`) and API image URLs both require authentication/session cookies. Direct `<img src>` tags in the browser cannot pass auth headers, so every product image returns 404. The edge function image proxy also fails because the authenticated fetch to `www.ssactivewear.com` returns 404 too — S&S likely requires a browser session or specific referrer.

**The only solution**: Download the images server-side and store them in Supabase Storage where they're publicly accessible.

## Architecture

```text
Nightly Cron Job (edge function)
  → Fetches S&S /styles (paginated, all pages)
  → For each style, downloads styleImage via authenticated API
  → Uploads image to Supabase Storage bucket "product-images"
  → Upserts style metadata (title, brand, category, description, image path) into a new "ss_catalog_cache" table
  → For popular/all styles, also fetches /products/?styleID=X to get colors, sizes, pricing
  → Stores aggregated color/size/pricing data in the cache table

Frontend reads from cache table + Storage URLs instead of calling S&S API directly
```

## Database Changes

**New table: `ss_catalog_cache`**
- `style_id` (integer, primary key)
- `title` (text)
- `brand_name` (text)
- `base_category` (text)
- `description` (text)
- `style_image_url` (text) — public Storage URL
- `colors` (jsonb) — array of `{name, hex, imageUrl, backImageUrl}`
- `sizes` (jsonb) — array of size strings
- `pricing` (jsonb) — `{customerPrice: {min, max}, piecePrice: {min, max}}`
- `total_skus` (integer)
- `raw_categories` (text) — original S&S category IDs for filtering
- `updated_at` (timestamptz, default now())

RLS: public SELECT for all (catalog is public data), INSERT/UPDATE only via service role (edge function).

**New storage bucket: `product-images`** — public bucket for cached S&S product images.

## New Edge Function: `sync-catalog`

Handles the heavy lifting:
1. Fetches all styles from S&S API (paginated, 100 per page)
2. For each style with a `styleImage`, downloads the image using authenticated fetch and uploads to `product-images` bucket
3. For each style, fetches `/products/?styleID=X` to get colors, sizes, pricing, and color-specific images
4. Downloads color front/back images and uploads to storage
5. Upserts everything into `ss_catalog_cache`
6. Designed to be called by a cron job nightly, but also callable manually

Rate limiting: processes styles in batches of 10 with small delays to avoid hammering S&S API.

## Frontend Changes

**`src/lib/api/ssProducts.ts`**:
- New function `fetchCachedCatalog(page, perPage, filters)` — queries `ss_catalog_cache` table via Supabase client instead of calling the edge function
- Returns same `SSStyle` shape but with working Storage URLs for images
- `fetchStyleDetail()` reads from cache table's `colors`/`sizes`/`pricing` jsonb columns
- Falls back to live API call only if cache is empty

**`src/components/app/onboarding/CatalogSetupStep.tsx`**:
- Switch from `fetchStylesPage()` to `fetchCachedCatalog()`
- Images now point to Supabase Storage URLs (publicly accessible, no auth needed)

**`src/components/app/onboarding/ProductDetailModal.tsx`**:
- Read colors/sizes/pricing from cache instead of calling `styleDetail` API
- Color images are also cached Storage URLs

**`src/components/app/onboarding/ProductImage.tsx`**:
- Simplify: if URL starts with Supabase Storage domain, use directly; otherwise show fallback icon

## Cron Job Setup

Schedule `sync-catalog` to run nightly at 2 AM via `pg_cron`:
```sql
SELECT cron.schedule('sync-ss-catalog-nightly', '0 2 * * *', ...);
```

Also expose a manual trigger so the app owner can force a refresh.

## Implementation Order
1. Create `product-images` storage bucket + `ss_catalog_cache` table (migration)
2. Build `sync-catalog` edge function (downloads images + metadata from S&S, stores in Supabase)
3. Update `ssProducts.ts` to read from cache table
4. Update `CatalogSetupStep`, `ProductDetailModal`, `ProductImage` to use cached data
5. Set up nightly cron job
6. Run initial sync to populate the cache

## Files

| File | Change |
|------|--------|
| Migration | Create `ss_catalog_cache` table, `product-images` bucket |
| NEW: `supabase/functions/sync-catalog/index.ts` | Downloads S&S catalog + images, stores in Supabase |
| `src/lib/api/ssProducts.ts` | Add `fetchCachedCatalog()`, update helpers to use Storage URLs |
| `src/components/app/onboarding/CatalogSetupStep.tsx` | Use cached catalog instead of live API |
| `src/components/app/onboarding/ProductDetailModal.tsx` | Read from cache for colors/sizes/pricing |
| `src/components/app/onboarding/ProductImage.tsx` | Simplify URL handling for Storage URLs |


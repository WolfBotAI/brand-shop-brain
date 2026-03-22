

# Fix Catalog Images: External Download + Smart Fallbacks

## Root Cause (Confirmed)

S&S Activewear uses aggressive Cloudflare bot protection on ALL image domains (`www`, `cdn`, `cdni`). Every server-to-server request returns **403 Forbidden**, regardless of auth headers, User-Agent, or proxy service. The 186 "uploaded" images in storage are actually blank — Cloudflare challenge HTML pages saved as `.jpg` files.

Edge functions, image proxies, and CDN-to-CDN fetches **cannot** bypass this. Only real browsers with JavaScript execution (handling Cloudflare's JS challenge) can load these images.

## Solution: Two-Part Fix

### Part 1 — External Bulk Download Script (one-time, run on Manus or local machine)

Provide an executable Python script that:
- Reads all 5,760 `style_id` values from the database
- For each enriched style (336 currently), fetches the S&S image via a real browser session (requests + cloudscraper or Selenium)
- Uploads each image directly to the `product-images` Supabase Storage bucket via the Storage API
- Updates `style_image_url` and color `imageUrl` fields in `ss_catalog_cache`

This is exactly what Manus AI did successfully — ran from a non-cloud IP with a real browser engine.

The script output: a standalone Python file the user runs on Manus with their Supabase service role key.

### Part 2 — Smart Color-Based Fallbacks in Frontend (immediate, no images needed)

While images are being populated, show **attractive product cards** that don't look broken:

- Use the product's **primary color hex** (we have this for all 336 enriched styles) to render a colored product silhouette
- Show brand logo area, product name, price prominently
- When a real hosted image exists (`supabase.co/storage`), show it
- When it doesn't, show a gradient card using the product's actual color with a category icon overlay (shirt, hat, bag, etc.)
- Never show a broken image icon or blank white space

### Part 3 — Fix Cron Job to Skip Image Downloads

The current cron enrichment wastes time trying to download images (and failing). Update `sync-catalog` `mode=detail` to:
- Only enrich metadata (colors, sizes, pricing) — skip image downloads entirely
- This makes enrichment faster (currently 336/5760, taking days because image attempts slow it down)
- Images will be populated by the external script

### Part 4 — Clean Up Bad Data

- Delete all 186 blank JPGs from the `product-images` bucket
- Set `style_image_url = NULL` for all rows that currently point to those blank files
- This ensures the frontend shows the color fallback instead of loading a blank white image

## Files to Change

| File | Change |
|------|--------|
| `/mnt/documents/download_ss_images.py` | New: Standalone Python script for Manus/local execution |
| `supabase/functions/sync-catalog/index.ts` | Remove image download logic from `mode=detail` to speed up enrichment |
| `src/components/app/onboarding/ProductImage.tsx` | Show color-based gradient cards with category icons instead of broken images |
| `src/components/app/onboarding/CatalogSetupStep.tsx` | Update card rendering to use color fallback prominently |

## Implementation Order
1. Clean up bad stored images + null out broken URLs
2. Update frontend with color-based fallbacks (immediate visual fix)
3. Speed up cron by removing image download attempts
4. Generate the external download script for Manus


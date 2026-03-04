

# Use Existing Brand-Shop.AI Backend for Product Catalog

## Problem
We built a redundant Supabase Edge Function (`ss-products`) to proxy SS Activewear API calls, when the Codex core engine at `api.brand-shop.ai` already has SS Activewear and Printful fully connected and live. This duplicates authentication, normalization, and pricing logic.

## Solution
Remove the Supabase Edge Function and route all product/catalog calls through the existing `apiClient` (pointing at `api.brand-shop.ai`). The frontend API layer in `src/lib/api/ssProducts.ts` gets rewritten to call Brand-Shop.AI endpoints instead.

## What I need from you
Before I can implement this, I need to know the **exact API endpoints** on `api.brand-shop.ai` for:

1. **Search/browse catalog products** — e.g. `GET /api/catalog/products?search=hoodie&vertical=sports`
2. **Get product details with images and pricing** — e.g. `GET /api/catalog/products/{styleId}`
3. **Response shape** — what fields come back (image URLs, pricing tiers, brand, category, etc.)

If you can share the endpoint paths and a sample response, I'll rewire everything to use them.

## Changes

| File | Action |
|------|--------|
| `supabase/functions/ss-products/index.ts` | Delete |
| `supabase/config.toml` | Remove `ss-products` entry |
| `src/lib/api/ssProducts.ts` | Rewrite to call `apiClient` endpoints on `api.brand-shop.ai` |
| `src/components/app/onboarding/CreateStoreStep.tsx` | Update imports/calls to use new API layer (minimal change) |

## Architecture after fix

```text
Browser (CreateStoreStep)
   │
   ▼
src/lib/api/ssProducts.ts
   │  (uses apiClient)
   ▼
api.brand-shop.ai
   ├── SS Activewear (already connected)
   └── Printful (already connected)
```

Once you share the endpoint details, I'll implement immediately.


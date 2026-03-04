

# Fix Catalog Integration — Use Correct Codex Endpoints, Remove SS Branding

## Problem
1. The catalog call fails because `/api/catalog/styles` doesn't exist on `api.brand-shop.ai` — we guessed the endpoint path
2. The UI says "SS Activewear Catalog" — the user doesn't want supplier names exposed in the storefront creation flow

## Root Cause
When we rewired `ssProducts.ts` to use `apiClient`, we assumed endpoint paths (`/api/catalog/styles`, `/api/catalog/products`) that don't actually exist on the Codex engine. We need the real endpoint paths.

## What I Need From You
**I need the actual API endpoint paths on `api.brand-shop.ai` for:**
1. Searching/browsing catalog products (what URL path? what query params?)
2. Getting product details with images and pricing

Without this, I'll keep guessing wrong paths. Can you share the endpoint documentation, a Postman collection, or even just one working curl example?

## Immediate UI Fix (can do now)
While waiting for endpoint info, I'll fix the branding:
- Change "SS Activewear Catalog" → "Product Catalog" throughout `CreateStoreStep.tsx`
- Change the bot message from "loading real products from SS Activewear" → "loading products from the Brand-Shop catalog"
- Rename `ssProducts.ts` references to be supplier-agnostic (the Codex engine abstracts over SS + Printful)

## Files to Change

| File | Change |
|------|--------|
| `src/components/app/onboarding/CreateStoreStep.tsx` | Remove all "SS Activewear" text, replace with "Brand-Shop Catalog" or just "Catalog" |
| `src/lib/api/ssProducts.ts` | Update endpoint paths once you confirm them; keep vertical keyword mapping |


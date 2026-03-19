

# Redesigned Distributor Onboarding Flow

## Current Problems

The current onboarding is backwards — it asks for Wolf Bot Location IDs (which new distributors don't have), then jumps straight to creating a client store. The distributor never sets up their own account, catalog, or pricing first.

## Correct Flow (per your description)

```text
Step 1: Distributor Profile
  → Business name, contact info, logo, website

Step 2: Catalog Setup
  → Choose: Brand-Shop Catalog OR connect own S&S account (API key)
  → Browse ENTIRE S&S catalog (branded "Brand-Shop Apparel")
  → Select items, colors, sizes per product
  → This becomes the distributor's master catalog

Step 3: Pricing
  → App owner (us) sets base prices (cost, decoration, shipping)
  → Distributor adjusts markup: %, $, per-item, per-category, or bulk
  → Shipping account integration option (FedEx, UPS)

Step 4: Add First Client
  → Collect client info: name, email, phone, website, logo
  → Choose template (AI-customized) OR GHL web builder OR we build it
  → Assign products from distributor's catalog to client store
  → OR give client self-service access to pick from distributor's catalog
```

No Printful/Printify shown to distributors — supplier-level only for super admin.

## Files to Change

| File | Change |
|------|--------|
| `src/pages/app/Onboarding.tsx` | Restructure steps: Profile → Catalog → Pricing → Add Client |
| `src/components/app/onboarding/WelcomeStep.tsx` | Update copy to reflect new flow |
| `src/components/app/onboarding/WolfBotConnectStep.tsx` | Replace with `DistributorProfileStep.tsx` — collects business name, contact, logo, website |
| `src/components/app/onboarding/SupplierStep.tsx` | Merge into new `CatalogSetupStep.tsx` — Brand-Shop catalog OR own S&S credentials, then browse full catalog, select items/colors/sizes |
| NEW: `src/components/app/onboarding/PricingStep.tsx` | Markup controls: %, $, per-item, per-category, bulk. Shipping account option |
| `src/components/app/onboarding/CreateStoreStep.tsx` | Rename to `AddClientStep.tsx` — collect client info, choose template, assign products or give client self-service access |
| `src/components/app/onboarding/CompletionStep.tsx` | Update to show distributor dashboard summary |
| `src/lib/api/ssProducts.ts` | Expand fallback catalog to 12+ items with better images |

## Key Design Decisions

1. **No GHL Location ID asked** — we auto-provision later when the API is ready; for now generate a local tenant ID from user ID
2. **Full S&S catalog browsing** — the catalog step loads ALL styles (paginated), not just vertical-filtered suggestions. Distributor picks what they want to offer
3. **Pricing is its own step** — base prices shown (set by us), distributor adds markup. Controls for bulk (all items), by category, or individual
4. **Client creation is the final step** — only after distributor has their catalog and pricing set. Client can either get a curated store or self-service access
5. **Printful/Printify hidden** — supplier dropdown in advanced section only shows S&S Activewear, SanMar, AlphaBroder (no Printful/Printify for distributors)

## Technical Notes

- Distributor's master catalog (selected products + pricing) stored in `profiles.metadata` or a new `distributor_catalogs` table
- Client stores reference the distributor's catalog, not S&S directly
- Pricing markup stored per-distributor, applied at storefront render time
- Migration needed: add `distributor_catalog` jsonb column to profiles, or create `distributor_catalogs` table


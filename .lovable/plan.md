

# Fix: Broken Images, Fullscreen Catalog, Pricing Fees, Modern Storefront

## Problems Identified (from screenshots)

1. **Broken images everywhere** — S&S CDN URLs like `ssactivewear.com/Images/Style/...` require authentication and don't load publicly. The fallback catalog and all stored products show broken `<img>` alt text.
2. **Catalog is cramped** — Browsing happens inside a `max-h-[500px]` scrollable div within the onboarding wizard. No fullscreen option.
3. **No per-item pricing during selection** — When a product is selected, user picks colors/sizes but can't adjust price. Pricing is a separate step that only shows global/category markup.
4. **Pricing missing app owner fees** — The pricing step only shows distributor markup. It needs to show: base cost + app owner markup + decoration fee + shipping fee + platform surcharge (% of apparel).
5. **Public storefront is bland** — `PublicStorefront.tsx` is a basic grid with minimal styling. Needs to be a modern, high-fashion shopping experience.
6. **Store preview images also broken** — Same S&S CDN issue in `StorefrontPreview.tsx` and `CompletionStep.tsx`.
7. **No GHL sync** — Orders, contacts, communications not synced to GHL sub-accounts.

## Plan

### 1. Fix broken images
- S&S CDN URLs require API auth — they can't be used as public `<img src>` URLs
- Update the `ss-catalog` edge function to also proxy product images, OR use S&S's public image CDN format (if available), OR cache images in storage
- For fallback catalog, use publicly accessible placeholder images (e.g., unsplash apparel photos or generic product silhouettes)
- Add an `onError` handler on all product `<img>` tags to show a styled placeholder instead of broken alt text

### 2. Fullscreen catalog browser
- Add a "Browse Fullscreen" button to `CatalogSetupStep.tsx` that opens a fullscreen `Dialog` (or dedicated overlay)
- The fullscreen view uses the full viewport: search bar at top, category filters, product grid fills the screen
- Clicking a product opens `ProductDetailModal` for color/size selection
- Selected count shown in a sticky footer bar with "Continue" button
- Keep the inline small view as a fallback/summary

### 3. Per-item pricing in catalog selection
- When a product is selected and expanded (or in the detail modal), show a markup input field per item
- Allow the distributor to set a custom markup (% or $) for that specific item right there
- This feeds into the `itemMarkups` map already in the pricing step
- The pricing step then becomes a review/bulk-adjust step rather than the only place to set prices

### 4. Complete pricing fee structure
Update `PricingStep.tsx` to show the full fee breakdown:
- **Base cost** (wholesale from S&S — set by platform)
- **App owner markup** (set by us, stored in a `platform_fees` config — read-only for distributors)
- **Decoration fee** (per-method: screen print, embroidery, DTG — configurable by app owner)
- **Shipping fee** (flat rate or real-time via FedEx/UPS)
- **Platform surcharge** (% of apparel subtotal, set by app owner — e.g., 5% technology fee)
- **Distributor markup** (what the distributor controls — %, $, per-item, per-category, bulk)
- Show a live price breakdown preview per product: Cost → + Owner Markup → + Decoration → + Shipping → + Platform Fee → + Distributor Markup = **Final Retail Price**

Create a `platform_fees` table (or config row) that the app owner sets:
- `owner_markup_percent`, `decoration_fee_default`, `platform_surcharge_percent`, `default_shipping_fee`

### 5. Modern public storefront redesign
Redesign `PublicStorefront.tsx` to be a high-fashion, interactive shopping experience:
- Hero banner with store name/logo and gradient overlay
- Product grid with hover effects, quick-view modals, image zoom
- Product detail page with color/size selectors, image gallery
- Animated cart drawer (slide from right)
- Category filtering and search
- Modern typography, spacing, and transitions
- Mobile-responsive with bottom sheet cart on mobile
- Image fallback with styled "no image" placeholders (not broken alt text)

### 6. Image error handling everywhere
- Add `onError` fallback to every `<img>` in: `ProductCard`, `StorefrontPreview`, `PublicStorefront`, `CompletionStep`, `ProductDetailModal`
- Fallback shows a gradient placeholder with product initials or a generic apparel icon

### 7. GHL sync (foundation)
- Create an edge function `ghl-sync` that:
  - On order creation: creates/updates contact in GHL, logs order as conversation note
  - On store creation: creates GHL sub-account location
- Wire up order placement in `PublicStorefront` to call this edge function after insert
- This is a foundation — full bi-directional sync comes later with webhooks

## Files to Change

| File | Change |
|------|--------|
| `src/components/app/onboarding/CatalogSetupStep.tsx` | Add fullscreen dialog mode, image error handling, per-item markup input |
| `src/components/app/onboarding/ProductDetailModal.tsx` | Add markup input, image error handler |
| `src/components/app/onboarding/PricingStep.tsx` | Add full fee breakdown (owner markup, decoration, shipping, platform surcharge), read from platform_fees |
| `src/pages/app/PublicStorefront.tsx` | Complete redesign — modern, high-fashion, product detail views, animated cart, hero section, image fallbacks |
| `src/components/app/store/StorefrontPreview.tsx` | Image error handling, improved styling |
| `src/components/app/onboarding/CompletionStep.tsx` | Image error handling |
| `src/lib/api/ssProducts.ts` | Fix fallback image URLs to publicly accessible ones, add image proxy helper |
| `supabase/functions/ss-catalog/index.ts` | Add image proxy action to serve authenticated S&S images |
| NEW: `supabase/migrations/platform_fees.sql` | Create `platform_fees` table for app owner fee config |
| NEW: `supabase/functions/ghl-sync/index.ts` | Foundation for GHL contact/order sync |

## Implementation Order
1. Fix images (proxy + fallbacks) — unblocks everything visual
2. Fullscreen catalog browser
3. Per-item pricing in selection + full fee breakdown in pricing step
4. Modern storefront redesign
5. GHL sync foundation


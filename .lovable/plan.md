

# Fix: Catalog UX, Broken Images, Pricing, AI Interaction, Theme Customization

## Problems (from screenshots)

1. **Category tags list is absurd** — hundreds of S&S category tags displayed as a wall of badges (screenshot shows 100+ tags like "2025 Fleece Guide Retail - Crewnecks"). Unnavigable.
2. **All product images broken** — S&S image proxy returns placeholder icons everywhere (catalog, storefront, mockups). The proxy likely fails or S&S returns auth errors.
3. **Platform Fee Structure is confusing** — "Owner Markup 15%" shown to distributors. They shouldn't see internal platform terminology. Rename and simplify.
4. **Pricing only adjusts by category** — no "Adjust by Brand" or "Adjust by Item" sections in the accordion.
5. **Shipping options missing** — no ShipStation or Shippo options, only Brand-Shop/FedEx/UPS.
6. **ChatBubble is a static text block** — not interactive, not a conversation. Zero AI feel. Just a styled `<p>` tag with a bot icon.
7. **Template selection is preset-only** — no custom color picker, no font selector, no hex/RGB input.
8. **Product description renders raw HTML** — storefront quick-view shows `<p><span style="color: #0000ff">` raw markup instead of rendered content.
9. **Product prices show $0.00** — pricing data not flowing through to storefront correctly.

## Plan

### 1. Fix category tags — group into parent categories
Instead of showing 100+ S&S sub-categories as individual tags, group them into ~10-15 parent categories (T-Shirts, Polos, Fleece, Outerwear, Caps & Hats, Bags, Pants & Shorts, etc.). Add a search-within-categories approach. Show a clean dropdown or collapsible group instead of a wall of badges.

### 2. Fix broken images
The `ss-catalog` edge function image proxy is failing. Diagnose: check if S&S image URLs are correct, if auth header works for images. Add better fallback — use S&S's public CDN pattern if available (`media.ssactivewear.com`), or generate colored product silhouettes with category-specific icons instead of generic shirt icon.

### 3. Rename Platform Fee Structure
Change "Owner Markup" → "Brand-Shop Fee", "Platform Surcharge" → "Technology Fee". Make it clear these are non-negotiable platform costs, not something the distributor is paying to an "owner."

### 4. Add "Adjust by Brand" and "Adjust by Item" to pricing
Add two more accordion sections:
- **Adjust by Brand** — list unique brands from selected products, allow per-brand markup override
- **Adjust by Item** — list all selected products, allow per-item markup (already partially exists via `itemMarkups` map but no UI in PricingStep)

### 5. Add ShipStation and Shippo shipping options
Add to the shipping radio group: ShipStation and Shippo alongside FedEx/UPS/Brand-Shop.

### 6. Make ChatBubble interactive — real AI conversation
Replace the static `ChatBubble` component with an **interactive AI assistant panel** that:
- Shows as a chat thread on the right side of each step
- Uses the existing `ai-chat` edge function to provide contextual guidance
- Responds to user questions about the current step
- Proactively suggests next actions based on what the user has done
- Types out responses with a typing animation
- Has an input field so users can ask questions

### 7. Custom theme builder in AddClientStep
Replace the 4 preset-only template grid with:
- Preset templates as quick-start options (keep these)
- **"Custom" option** that reveals: color pickers for primary/secondary/accent/background, hex code inputs, font family dropdown (Inter, Poppins, Montserrat, Roboto, Playfair Display, etc.)
- Optional: paste hex codes or RGB values directly

### 8. Fix raw HTML in product descriptions
Sanitize and render product descriptions as HTML (use `dangerouslySetInnerHTML` with a sanitizer, or strip HTML tags for plain text display).

### 9. Fix $0.00 prices on storefront
The `calcRetail` function uses `pricingConfig.globalMarkup` from metadata but the base cost (`customerPrice`/`piecePrice`) is likely 0 in stored products. Ensure pricing data flows from S&S API through catalog selection into store metadata.

## Files to Change

| File | Change |
|------|--------|
| `src/components/app/onboarding/CatalogSetupStep.tsx` | Group categories into parent groups (~15 max), clean up tag display |
| `src/components/app/onboarding/ProductImage.tsx` | Improve fallback with category-specific icons and colors |
| `supabase/functions/ss-catalog/index.ts` | Debug image proxy, try alternate S&S image URL patterns |
| `src/components/app/onboarding/PricingStep.tsx` | Rename fee labels, add "Adjust by Brand" and "Adjust by Item" accordions, add ShipStation/Shippo shipping options |
| `src/components/features/ChatBubble.tsx` | Rewrite as interactive AI chat panel with input, streaming responses, and contextual awareness |
| `src/components/app/onboarding/AddClientStep.tsx` | Add custom theme builder with color pickers, hex inputs, font selector alongside presets |
| `src/pages/app/PublicStorefront.tsx` | Fix HTML rendering in product descriptions, fix $0.00 pricing, ensure costs flow correctly |

## Implementation Order
1. Fix category grouping (immediate UX improvement)
2. Fix image proxy + fallbacks
3. Interactive AI chat panel (biggest UX gap)
4. Custom theme builder
5. Pricing adjustments (brand/item/shipping)
6. Fix storefront bugs (HTML, $0.00)


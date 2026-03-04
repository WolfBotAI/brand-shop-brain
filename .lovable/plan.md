

# AI Discovery, Package Tiers, Bulk Selection & Image Fix

## Problems

1. **Broken product images** — The `styleImage` URLs use Unsplash links that render as alt-text (screenshot shows "Performance Polo" text instead of image). The `<img>` tags lack `crossOrigin` and the URLs may be blocked or malformed in the preview iframe context.
2. **AI gives only 2 recommendations** — The `verticalKeywords` mapping for "corporate" only has 3 queries (`polo`, `jacket`, `quarter zip pullover`) which match only 2-3 products from 12 mock items. Other verticals fare better but the AI does not do any discovery.
3. **No discovery questions** — The AI Merch Advisor immediately jumps to recommendations without asking about goals, target audience, city/weather, budget, or preferred styles.
4. **No package tiers** — There is no concept of Package A (10 items), B (25), C (40), or Enterprise (40+). The flow allows unlimited selection.
5. **No bulk color/size selection** — The `ProductDetailModal` tracks `selectedColor` and `selectedSizes` locally but these selections are never saved back to the parent component. There is no "Select All Colors" button and no way to apply color/size selections in bulk across items or categories.

## Plan

### 1. Fix Product Images
Replace Unsplash URLs with reliable placeholder images using a deterministic service (e.g., `https://placehold.co/400x400/hex/text` or inline SVG data URIs per category). This ensures images always load in any context. Alternatively, add `crossOrigin="anonymous"` and verify Unsplash URLs work — but placehold.co is more reliable for demo.

**File:** `src/lib/api/ssProducts.ts` — swap all `styleImage` URLs

### 2. AI Discovery Conversation Flow
Rewrite the `handleDetailsNext` sequence and `getBotResponse` to implement a multi-step discovery before showing products:

**Step 1:** "What's the purpose of this store?" (e.g., team uniforms, fundraiser, corporate gifts, event merch)
**Step 2:** "Who's your target audience?" (employees, students, fans, general public)
**Step 3:** "What city/region? I'll factor in climate." (free text — bot responds with weather-appropriate suggestions like "Dallas gets hot — I'll prioritize moisture-wicking and lightweight items")
**Step 4:** "Any budget range per item?" (under $15, $15-25, $25-50, no limit)

After collecting answers, the bot says "Based on your input, here are my picks for [vertical] in [city]..." and loads the catalog filtered accordingly. Add `discoveryAnswers` state to track responses and a `discoveryStep` counter.

**File:** `src/components/app/onboarding/CreateStoreStep.tsx` — rewrite chat intro sequence, add discovery state, update `getBotResponse`

### 3. Package Tier Selection & Enforcement
Add a package selection step at the start of the catalog phase (or as a sub-phase):

| Package | Items | Label |
|---------|-------|-------|
| A — Starter | Up to 10 | $X/mo |
| B — Growth | Up to 25 | $Y/mo |
| C — Pro | Up to 40 | $Z/mo |
| Enterprise | 40+ | Custom pricing |

- Show package cards with item limits
- Display a counter badge: "8 of 10 selected (Package A)"
- **Soft warning**: When user exceeds their package limit, show a yellow banner: "You've selected X items — this exceeds Package A (10). Consider upgrading to Package B."
- **Enterprise**: When selecting 40+, show a modal: "Enterprise pricing requires approval. Submit a request and we'll get back to you within 24 hours." Block the "Continue" button until approved or until they reduce below 40.

Add `selectedPackage` state and `packageLimits` constant. The warning/upgrade prompt is non-blocking per user preference.

**Files:** `src/components/app/onboarding/CreateStoreStep.tsx` — add package selection UI before catalog grid, enforce limits with soft warning and enterprise approval modal

### 4. Color & Size Selection — Bulk Operations
Redesign variant selection to be persistent and support bulk operations:

**A. Track selections per product:**
Add a new type `ProductVariantSelection` = `{ styleID: number; colors: string[]; sizes: string[] }`. Store as a `Map<number, ProductVariantSelection>` in `CreateStoreStep` state. Pass to `ProductDetailModal` as props and save back on change.

**B. "Select All Colors" in ProductDetailModal:**
Add a toggle next to the color swatches (matching the existing "Select All" for sizes).

**C. Bulk selection toolbar:**
Add a floating action bar when 1+ items are selected:
- "Set Colors & Sizes for Selected" — opens a modal with all available colors/sizes across selected items, lets user pick once, applies to all
- "Apply to Category" — dropdown to apply current color/size config to all items in a category
- "Apply to All" — applies to every selected item

**Files:**
- `src/components/app/onboarding/CreateStoreStep.tsx` — add `variantSelections` state, bulk toolbar component
- `src/components/app/onboarding/ProductDetailModal.tsx` — accept `selectedColors`/`selectedSizes` as props, add "Select All Colors", fire `onVariantChange` callback
- New: `src/components/app/onboarding/BulkVariantModal.tsx` — modal for bulk color/size selection across multiple items

### 5. Improve Recommendation Count
Expand `verticalKeywords` to include more search terms per vertical so every vertical returns 8-12 results from the 12-item mock catalog. Also auto-select up to the package limit (not hardcoded 8).

**File:** `src/lib/api/ssProducts.ts` — expand keyword lists

## Files Summary

| File | Action |
|------|--------|
| `src/lib/api/ssProducts.ts` | Fix image URLs, expand vertical keywords |
| `src/components/app/onboarding/CreateStoreStep.tsx` | Major: add discovery flow, package tier selection, bulk variant toolbar, fix recommendation count |
| `src/components/app/onboarding/ProductDetailModal.tsx` | Accept variant props, add "Select All Colors", fire change callback |
| New: `src/components/app/onboarding/BulkVariantModal.tsx` | Bulk color/size selection modal |


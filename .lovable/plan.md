

# Comprehensive Messaging Overhaul: Distributor-First, No Packages/Tiers

## Problem
The website still has "Package B (25 max)", "Package badge", package tier selectors in onboarding, and scroll targets pointing to `#packages`. The homepage doesn't speak to the distributor pain points or the three store-creation options. The user wants every page — marketing AND app/onboarding — cleaned up.

## Changes by File

### HOMEPAGE — Landing Components

**1. `src/components/landing/Hero.tsx` (line 143)**
- Remove the `{/* Package badge */}` comment on line 143. The content itself is already clean ("AI-Curated Selection") but the HTML comment still says "Package badge" — rename to "AI Recommendation badge"

**2. `src/components/landing/IntroSection.tsx`**
- Already clean. No changes needed.

**3. `src/components/landing/IntroducingSection.tsx`**
- Already clean. No changes needed.

**4. `src/components/landing/PackagesSection.tsx`**
- Already clean (rewritten to platform capabilities). No changes needed.

**5. `src/components/landing/ConnectSection.tsx` (line 56)**
- Comment says `{/* AI Conversations - Top Left */}` — update to `{/* AI Support Agent - Top Left */}`

**6. `src/components/features/FeatureHero.tsx` (line 76)**
- `document.getElementById('packages')` → `document.getElementById('platform')` — the section ID was changed but this scroll target was missed

**7. `src/components/features/AISuggestionsDemo.tsx` (line 148)**
- `"5 items matched · Package B (25 max)"` → `"5 items matched to budget & climate"`

### APP / ONBOARDING

**8. `src/components/app/onboarding/CreateStoreStep.tsx`**
This is the big one. The entire package tier system needs to be removed:
- **Lines 48-54**: Remove `packageTiers` array (Package A/B/C/Enterprise with item limits)
- **Lines 195-196**: Remove `selectedPackage` state and related state
- **Lines 214**: Remove `currentTier` and `isOverLimit` logic
- **Lines 339-344**: Remove tier-based bot message ("I've pre-selected up to X items for your Package…")
- **Lines 574-596**: Remove the entire "Package tier selection" UI block (4 tier buttons)
- **Lines 613-630**: Remove the tier badge and over-limit warning in catalog header
- Replace with a simple "unlimited products" or no cap at all — the distributor sets limits at the agency level, not per-store onboarding
- Remove `Package` from lucide import (line 6)

### FEATURE PAGES

**9. `src/pages/features/OrderRouting.tsx` (line 7)**
- `Package` icon import is used for "White-Label Fulfillment" (line 54) — this is fine, it's the lucide icon name, not marketing copy. No change needed.

**10. `src/pages/features/SiteMigration.tsx` (lines 7, 11)**
- Same situation — `Package` icon used for "Product Import". Fine, no change needed.

### PERSONA PAGES

**11. `src/pages/personas/ForDistributors.tsx`**
- Already clean from last rewrite. No changes needed.

**12. `src/pages/personas/ForDecorators.tsx`**
- Already clean. No changes needed.

**13. `src/pages/personas/ForReferralPartners.tsx`**
- Already clean. No changes needed.

### ASSESSMENT

**14. `src/pages/Assessment.tsx`**
- Already clean. No changes needed.

## Summary of Actual Changes

| File | Change |
|------|--------|
| `Hero.tsx` line 143 | Comment "Package badge" → "AI Recommendation badge" |
| `ConnectSection.tsx` line 56 | Comment "AI Conversations" → "AI Support Agent" |
| `FeatureHero.tsx` line 76 | Scroll target `'packages'` → `'platform'` |
| `AISuggestionsDemo.tsx` line 148 | Remove "Package B (25 max)" text |
| `CreateStoreStep.tsx` | **Major**: Remove entire package tier system (data, state, UI, bot messages). Replace with open catalog selection with no artificial item limits |

The `CreateStoreStep.tsx` is the most significant change — it requires removing the `packageTiers` array, the tier selection UI, the tier badge in the catalog header, the over-limit warnings, and the bot message referencing tiers. The catalog will simply show all products without a tier-based cap.


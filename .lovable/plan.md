

# Fix StoreBuilderJourney: Remove Package Selection, Replace with AI Product Recommendations

The "Package Selection" step with pricing ($49/mo, $99/mo, $179/mo) must be removed. The journey should focus on AI helping select the right products based on the discovery chat context (purpose, audience, climate, budget).

## New 4-Step Flow

1. **AI Discovery** (unchanged) — Purpose, audience, city, budget
2. **AI Product Picks** (replaces Package Selection) — AI recommends products based on discovery answers. Shows product cards with match percentages, material type, and "why" tags (e.g., "Weather Pick", "Budget Friendly", "Best Match") similar to the AISuggestionsDemo component
3. **AI Catalog** (unchanged but remove "Package B" reference) — Full catalog selection, counter shows "X of Y selected" without package reference
4. **Theme & Launch** (unchanged)

## Changes to `src/components/features/StoreBuilderJourney.tsx`

- Remove `packageTiers` array entirely
- Remove `selectedPackage` state
- Rename Step 2 from "Package Selection" to "AI Product Picks" with a Sparkles icon
- Replace Step 1 content (package cards with prices) with AI-recommended product cards showing match %, material info, and contextual tags (moisture-wicking for Dallas heat, navy/gold for school colors, under $25 budget)
- Update `aiMessages[1]` from package recommendation to something like: "Based on Dallas fall weather and your $25 budget, here are my top picks — moisture-wicking in navy & gold."
- Update subtitle text to remove "recommends a package"
- Remove "Package B" reference from Step 2 catalog counter
- Update auto-play timers to select recommended products instead of a package

## Files

| File | Action |
|------|--------|
| `src/components/features/StoreBuilderJourney.tsx` | Replace package selection step with AI product recommendations |


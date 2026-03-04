

# Marketing Website Refresh — Align with Current Product

## Why This Is Needed

The marketing website was written before the onboarding product was built. Now that the actual system has AI discovery conversations, package tiers (A/B/C/Enterprise), bulk variant selection, and a real catalog flow, the marketing pages are stale in several ways:

**Mismatches identified:**

1. **Hero section** — Background uses an Unsplash image that may not load (same issue as product images). The dashboard mockup shows "12 Active" stores and "AI handling 47 conversations" which are generic placeholders, not reflective of the actual product UI.

2. **StoreBuilderJourney demo** — Shows a simplified 4-step flow (org type, 4 emoji products, 3 themes, go live). The real product now has: AI discovery questions (purpose, audience, city/weather, budget), package tier selection, real catalog with images/colors/sizes, bulk variant selection, and 3-mode theme picker (presets, custom colors, AI scrape). The demo should reflect these.

3. **AISuggestionsDemo** — Shows only 2 chat messages and 3 hardcoded results. The real AI Merch Advisor now asks 4 discovery questions before recommending products. The demo should show the conversation flow.

4. **Navbar** — Missing links to AI Suggestions, Multi-Store, KPI Reports, and Site Migration feature pages. Only 6 nav links vs 11 feature pages.

5. **IntroSection** — Uses Unsplash image. Per brand guidelines, should use industry-specific imagery (screen printing, embroidery). The "100% Autopilot" messaging is fine but doesn't mention the new package tiers or AI discovery.

6. **IntroducingSection** — Uses Unsplash image at bottom. Feature cards don't mention AI Merch Advisor or package tiers.

7. **Footer copyright** — Says "© 2024" but current date is 2026.

8. **Feature pages** — The Store Builder, AI Suggestions, and Reporting feature pages use static descriptions. Their interactive demos could be updated to reflect the new discovery flow and package selection, but this is lower priority.

9. **No "Pricing" or "Packages" section** — The landing page has no mention of Package A/B/C tiers, which is now a core part of the product.

## Plan

### 1. Fix Unsplash Images Across All Landing Components
Replace all `images.unsplash.com` URLs with reliable `placehold.co` placeholders styled to the brand (orange/navy). Affected files:
- `Hero.tsx` (background image)
- `IntroSection.tsx` (screen printing image)
- `IntroducingSection.tsx` (bottom banner image)

### 2. Update StoreBuilderJourney Demo
Rewrite the demo to match the real product flow with these steps:
1. **Discovery** — AI asks purpose, audience, city, budget (animated chat bubbles)
2. **Package Selection** — Show A/B/C/Enterprise cards with item limits
3. **AI Catalog** — Show products with images, color swatches, and size badges (not emojis)
4. **Theme & Launch** — 3-mode theme picker preview

Update `StoreBuilderJourney.tsx` with new steps array, new mock data, and updated auto-play timings.

### 3. Update AISuggestionsDemo
Expand the chat to show the 4-step discovery conversation before recommendations. Show 5-8 product results instead of 3 to reflect the package-tier-appropriate count.

Update `AISuggestionsDemo.tsx`.

### 4. Add Pricing/Packages Section to Landing Page
Create a new `PackagesSection.tsx` component showing the 4 tiers (Starter 10 items, Growth 25, Pro 40, Enterprise 40+) with feature comparison. Add it to `Index.tsx` between `SeamlessSection` and `ConnectSection`.

### 5. Update Navbar
Add a "Features" dropdown or expand links to include AI Suggestions and the most important feature pages. Keep it clean — group under a dropdown if needed.

Update `Navbar.tsx`.

### 6. Fix Footer Copyright Year
Change "© 2024" to "© 2026" in `Footer.tsx`.

### 7. Update Hero Copy & Mockup
- Refresh the dashboard mockup to show package badges and the AI discovery flow preview
- Update quick stats to reference package tiers or real metrics

Update `Hero.tsx`.

### 8. Update IntroducingSection Feature Cards
Add "AI Merch Advisor" as a feature card (replacing or supplementing "Customer Portal") and mention package-based stores.

Update `IntroducingSection.tsx`.

## Files Summary

| File | Change |
|------|--------|
| `src/components/landing/Hero.tsx` | Fix image, update mockup and stats |
| `src/components/landing/IntroSection.tsx` | Fix image |
| `src/components/landing/IntroducingSection.tsx` | Fix image, update feature cards |
| `src/components/landing/Navbar.tsx` | Add features dropdown |
| `src/components/landing/Footer.tsx` | Fix copyright year |
| `src/components/features/StoreBuilderJourney.tsx` | Major rewrite to match real flow |
| `src/components/features/AISuggestionsDemo.tsx` | Expand discovery conversation |
| New: `src/components/landing/PackagesSection.tsx` | Package tier cards |
| `src/pages/Index.tsx` | Add PackagesSection |


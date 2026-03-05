

# Two Features: Pop-Up Stores + Rename Assessment CTA

## 1. Pop-Up Stores Feature

### New Feature Page: `src/pages/features/PopUpStores.tsx`
Standard feature page using existing `FeatureHero`, `FeatureSection`, and `FeatureCTA` components. Content:

- **Hero**: "Launch Pop-Up Stores in Minutes" / "Events, Fundraisers, Campaigns — Done."
- **How It Works section** (3 steps): Select event type (fundraiser, corporate event, team sport, campaign) -> Upload logo or let AI generate one -> Set start/end dates, AI builds the store
- **Key Features grid**: Event-type templates, AI logo generation, auto-expiration with splash redirect ("Event's over — visit the main store"), time-limited storefronts, full catalog access from S&S/SanMar/etc., instant deployment
- **Expired Store Splash**: Visual mockup showing the "This event has ended" splash page with a CTA linking to the main store

### New Homepage Section: `src/components/landing/PopUpStoresSection.tsx`
A dedicated section on the homepage between the platform capabilities and the connect section. Visual, concise:
- Headline: "Pop-Up Stores for Any Event"
- Subhead: "Fundraisers, team events, campaigns — launch a branded store in minutes. Set it and forget it. When the event ends, customers are redirected to the main store."
- 3-4 event type icons (Fundraiser, Corporate, Sports, Campaign)
- CTA: "Learn More" linking to `/features/popup-stores`

### Route + Nav Updates
- `src/App.tsx`: Add route `/features/popup-stores` -> `PopUpStores`
- `src/components/landing/Navbar.tsx`: Add "Pop-Up Stores" to `featureLinks` array
- `src/pages/Index.tsx`: Import and add `PopUpStoresSection` between `Integrations` and `CTASection`

---

## 2. Rename Assessment CTA

The "Take the Assessment" label doesn't communicate value. Rename it to **"See How Much You Can Save"** — this works for both distributors (unifying systems, eliminating support overhead) and decorators (eliminating manual PO entry, call handling).

### Files to update (all instances of "Take the Assessment" or "Take Assessment"):

| File | Current Text | New Text |
|------|-------------|----------|
| `Hero.tsx` line 54 | "Take the Assessment" | "See How Much You Can Save" |
| `CTASection.tsx` line 65 | "Take the Assessment" | "See How Much You Can Save" |
| `IntroSection.tsx` line 108 | "Take the Assessment" | "See How Much You Can Save" |
| `FeatureHero.tsx` line 23 | default prop `"Take Assessment"` | `"See How Much You Can Save"` |
| `FeatureCTA.tsx` line 35 | "Take Assessment" | "See How Much You Can Save" |
| `ForDistributors.tsx` lines 117, 259 | "Take the Assessment" | "See How Much You Can Save" |
| `ForDecorators.tsx` lines 96, 200 | "Take the Assessment" | "Calculate Your Time Savings" |
| `ForReferralPartners.tsx` lines 79, 174 | "Take the Assessment" | "See How Much You Can Save" |
| `Navbar.tsx` line 74 | nav link label "Assessment" | "Savings Calculator" |
| `Assessment.tsx` line 266 | badge "Free Assessment" | "Free Savings Calculator" |
| `SeamlessSection.tsx` | Check for any "assessment" CTA text | Update if found |

For the **ForDecorators** page specifically, use "Calculate Your Time Savings" to speak to the PO copy-paste and call-handling pain point. Everywhere else uses "See How Much You Can Save" as the universal CTA.

---

## Summary
- **3 new files**: `PopUpStores.tsx` (feature page), `PopUpStoresSection.tsx` (homepage section)
- **~12 files edited**: CTA rename across all marketing pages + navbar + assessment page + route registration + homepage composition


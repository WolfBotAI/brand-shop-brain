

# Purge All Package/Tier/Item-Count Language from Marketing Pages

## Problem
Four files on the homepage still have "package," "tier," and item-count copy that was supposed to be removed. The ForDistributors page is already correct.

## Exact Changes

### 1. `src/components/landing/Hero.tsx`
- Line 44: "with flexible package tiers from 10 to 40+ items" → "and builds their store — so you can focus on growing your business."
- Line 62: `scrollIntoView('packages')` → `scrollIntoView('how-it-works')`
- Line 71: Stat `{ value: "4", label: "Package Tiers" }` → `{ value: "24/7", label: "AI Support" }`
- Line 140: "Here are 8 picks for Package B…" → "Here are my top picks — moisture-wicking for Dallas fall weather."
- Lines 143-155: Replace the "Package B — Growth / Up to 25 items" badge with a simple "AI Recommendations" badge: icon `Sparkles`, text "AI-Curated Selection", subtitle "8 products matched to budget & climate"
- Remove `Package` from lucide import

### 2. `src/components/landing/IntroSection.tsx`
- Line 80: "then recommends the perfect products with flexible package tiers." → "then recommends the perfect products for each client's needs."
- Line 85: "Scalable package tiers from 10 to 40+ items per store" → "AI-curated product catalogs tailored to each client"

### 3. `src/components/landing/IntroducingSection.tsx`
- Replace feature card at index 2 ("Package Tiers / Starter (10 items)…") with: icon `MessageSquare`, title "AI Support Agent", description "24/7 omnichannel support via web chat, SMS, email, phone, Facebook & Instagram — all trained on your brand."
- Replace step 02 ("Package Selection / Client picks a tier — AI fills the catalog") with: icon `ShoppingBag` (or `Store`), title "Store Built", desc "AI curates the right products and launches the store"
- Update imports accordingly (remove `Package`, `Users`; add `MessageSquare`)

### 4. `src/components/landing/PackagesSection.tsx`
Complete rewrite. Replace the 4 package-tier cards with a "What's Included" section showing the platform capabilities as a feature grid (not tiers):
- **AI-Managed Stores** — Centralize all client stores. AI creates, updates, and manages them.
- **AI Website Assistant** — 24/7 embedded chat for tracking, returns, and product recommendations.
- **AI Support Agent** — Omnichannel support via SMS, email, phone, FB, IG.
- **AI Voice Agent** — Answers phone calls with real-time order lookups.
- **Agency Reporting** — Complete visibility into every store's performance.
- **White-Label Branding** — Your brand, your domain, your client relationship.

Keep the add-ons section (Order Routing, AI Vision, Site Migration) as-is. Change section heading from "Scalable Package Tiers" to "Everything You Need. Built In." Change the `id` from `packages` to `platform`.

### Files NOT changing (already clean)
- `ForDistributors.tsx` — already rewritten correctly
- `ForDecorators.tsx` — no package references
- `ForReferralPartners.tsx` — no package references
- `PersonasSection.tsx` — clean
- `ConnectSection.tsx` — clean
- `Features.tsx` — clean
- `Assessment.tsx` — clean


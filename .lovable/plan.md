

# Fix "See How It Works" CTA Buttons

Both the Hero and CTASection have "See How It Works" buttons that are plain `<Button>` elements with no `onClick` or link behavior. Similarly, "Book a Demo" buttons go nowhere.

## Plan

**Scroll-to approach** for "See How It Works": Scroll to the `IntroSection` (or `StoreBuilderJourney` area) on the same page. Add an `id` to the target section and use `scrollIntoView` on click.

**Link approach** for "Book a Demo": Since there's no booking page yet, link to an anchor or a mailto/Calendly placeholder. For now, scroll to the CTA section or open a `#contact` anchor.

### Changes

1. **`src/components/landing/Hero.tsx`** — Wrap "See How It Works" in scroll-to `#how-it-works`, wrap "Book a Demo" in scroll-to `#packages` (or keep as-is with a future link).
2. **`src/components/landing/CTASection.tsx`** — Same: "See How It Works" scrolls to `#how-it-works`, "Book a Demo" stays as contact action.
3. **`src/components/landing/IntroducingSection.tsx`** (or whichever section best represents "how it works") — Add `id="how-it-works"` to the section element.
4. **`src/components/features/FeatureHero.tsx`** and **`src/components/features/FeatureCTA.tsx`** — Add `onClick` handlers for "Book Demo" / "Contact Sales" buttons (scroll or link).

All CTA buttons across the site will use `document.getElementById('target')?.scrollIntoView({ behavior: 'smooth' })` for on-page targets, or `react-router-dom` `useNavigate` for cross-page links like `/features/store-builder`.


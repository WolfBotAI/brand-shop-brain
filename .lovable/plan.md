
Goal: fix CTA text visibility everywhere (not just one page) by making CTA styling deterministic and contrast-safe across all sections.

What I found in the current codebase:
1. CTA buttons are primarily rendered in shared components:
   - `src/components/features/FeatureHero.tsx`
   - `src/components/features/FeatureCTA.tsx`
   - `src/components/landing/CTASection.tsx`
   - `src/components/landing/Hero.tsx`
2. Many feature routes reuse `FeatureHero` + `FeatureCTA`, so one styling issue there affects multiple pages (`/features/order-routing`, `/features/ai-support`, etc.).
3. Current secondary CTA buttons rely on `variant="outline"` plus class overrides. Even with overrides, this pattern is fragile and can still produce white-on-white or low-contrast rendering if any class resolution/theme context shifts.
4. There is also a resilience gap: CTA labels come from props/defaults, but empty strings could still produce visually blank buttons.

Implementation approach (comprehensive + future-proof):
1. Create dedicated CTA-safe button variants in `src/components/ui/button.tsx`
   - Add explicit variants for CTA contexts, for example:
     - `ctaPrimary` (brand orange fill, white text)
     - `ctaOutlineDark` (transparent bg, light text, light border, dark-section hover)
     - `ctaOutlineLight` (transparent/light bg compatible, dark text, dark border)
   - These variants will encode the final contrast behavior directly, so CTA visibility does not depend on long per-component class overrides.

2. Refactor shared CTA components to use those variants
   - `src/components/features/FeatureHero.tsx`
     - Secondary CTA: switch from `variant="outline"` + long className to `variant="ctaOutlineDark"`.
     - Keep size/shape utilities (pill, spacing) but remove color logic from local className.
   - `src/components/features/FeatureCTA.tsx`
     - Same conversion as above.
   - `src/components/landing/CTASection.tsx`
     - Secondary CTA should use the dark-surface CTA outline variant.
   - `src/components/landing/Hero.tsx`
     - Secondary CTA should use light-surface CTA outline variant for consistency and guaranteed contrast.

3. Add CTA label fallbacks (defensive)
   - In `FeatureHero`, normalize label rendering so empty/whitespace values still render visible text:
     - Primary fallback: “Book Demo”
     - Secondary fallback: “Contact Sales”
   - This prevents “blank pill” CTAs if data ever comes through as empty text.

4. Quick audit pass on remaining CTA-style buttons
   - Validate `IntroSection`, `ConnectSection`, and `Integrations` CTA buttons still meet contrast and do not need special variants.
   - Keep primary buttons aligned to the same brand token usage.

Verification plan (end-to-end):
1. Check all pages that reuse shared CTA components:
   - `/features/order-routing`
   - `/features/store-builder`
   - `/features/ai-support`
   - `/features/ai-vision`
   - `/features/reporting`
   - `/features/acquisition`
   - `/features/multi-store`
   - `/features/ai-suggestions`
   - `/features/kpi-reports`
   - `/features/site-migration`
2. Check landing page sections:
   - top Hero CTA pair
   - final CTA section
3. Verify in both normal and hover/focus states:
   - text remains visible
   - border remains visible
   - button background is not unintentionally white on dark sections
4. Verify responsive behavior on mobile widths so CTA text remains readable and not clipped.

Technical notes:
- This plan avoids broad risky changes to generic `outline` behavior used by non-CTA UI controls.
- Standardizing CTA variants in one place reduces regressions when theme tokens are adjusted again (like the recent primary orange update).
- Result: every CTA gets predictable contrast by design, not by ad-hoc class combinations.

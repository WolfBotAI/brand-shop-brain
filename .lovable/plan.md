

# Fix Invisible CTA Button Text

## Problem
The outline/secondary CTA buttons across several components have `text-white` or `border-white/50` styling, making the text invisible when the button background is also white or light-colored. This is visible in the screenshot where "See How It Works" text cannot be read.

## Affected Files & Fix

| File | Button | Current Issue | Fix |
|------|--------|--------------|-----|
| `src/components/landing/CTASection.tsx` (line 69) | "See How It Works" | `text-white border-white/50` on dark bg — but button itself renders white | Change to `border-[hsl(var(--section-dark-foreground))]/30 text-[hsl(var(--section-dark-foreground))] hover:bg-[hsl(var(--section-dark-foreground))]/10` so text is visible against the button background |
| `src/components/features/FeatureCTA.tsx` (line 38) | "Contact Sales" | `text-white border-white/50` — same issue on secondary bg | Change to `border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground/10` |
| `src/components/features/FeatureHero.tsx` (line 72) | Secondary CTA | Already uses `text-secondary-foreground` — OK | No change needed |
| `src/components/landing/Hero.tsx` (line 60) | "Book a Demo" | Uses `text-foreground` on light bg — OK | No change needed |

## Root Cause
The `variant="outline"` button has a default `bg-background` (white). Using `text-white` makes the text invisible. The fix ensures text color contrasts against the actual button background on dark sections.

## Summary
Two files need updating: `CTASection.tsx` and `FeatureCTA.tsx` — replacing `text-white` and `border-white/50` with proper foreground color references that maintain contrast.




# Restructure Hero + Add "Three Ways to Launch" Homepage Section

## What the user wants
1. **Hero**: Remove the 3 boxes. Instead, weave the 3 launch paths into the hero description text naturally. The overall hero message should be about launching a store in minutes (steps to launch + integrate with supplier/decorator).
2. **Dedicated homepage section**: A separate, prominent section below the hero that visually explains and demonstrates the 3 launch options (AI-Generated, Distributor-Curated, Client Self-Build) with interactive demos.

## Changes

### 1. Hero (`src/components/landing/Hero.tsx`)
- **Remove** the `launchPaths` array and the entire "Three Ways to Launch" card grid (lines 5-21, 86-115)
- **Update headline** to something like: "Launch a Store in Minutes" / "Integrated with Your Suppliers & Decorators"
- **Update description** to naturally mention: "Let AI build it, curate it yourself, or let your client self-build — every store connects to your suppliers and decorators automatically."
- Keep CTAs and the right-side AI chat mockup as-is

### 2. New homepage section: `src/components/landing/ThreeWaysSection.tsx`
A dedicated section with:
- Headline: "Three Ways to Launch a Store"
- 3 columns, each with an **interactive animated demo mockup** (similar to existing demo patterns):
  - **AI-Generated**: Animated flow showing AI asking questions → products auto-selected → store deployed
  - **Distributor-Curated**: Animated flow showing distributor picking products/theme → handing ready store to client
  - **Client Self-Build**: Animated flow showing client browsing catalog within distributor rules → store goes live
- Each column has icon, title, short description, and the animated visual
- Uses `framer-motion` with the project's existing slow-animation pattern (progress bar, pause-on-hover per memory)

### 3. Update homepage composition (`src/pages/Index.tsx`)
- Import `ThreeWaysSection`
- Place it right after `Hero` (before `IntroSection`)

### 4. Update `IntroducingSection.tsx` 3-step flow
- Update the 3-step flow at the bottom to reflect the full journey: "Choose Your Path → AI Builds Your Store → Integrated & Live" (connecting to suppliers/decorators emphasis)

## Files
- **New**: `src/components/landing/ThreeWaysSection.tsx`
- **Edit**: `src/components/landing/Hero.tsx` (remove boxes, update copy)
- **Edit**: `src/pages/Index.tsx` (add new section)
- **Edit**: `src/components/landing/IntroducingSection.tsx` (update 3-step flow copy)


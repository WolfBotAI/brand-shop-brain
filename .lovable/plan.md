

# Fix Integrations Section: Brand Colors + Even Grid

## Problem
1. The "Powerful Integrations" badge and "Your Workflow" heading use `accent` (blue) instead of brand orange (`primary`).
2. The grid has 9 items: 1 spanning full width + 8 in a 3-col grid = uneven last row (2 items). Need 1 full-width + 9 regular = 3 even rows of 3. Adding Stripe as the 10th integration.

## Changes — `src/components/landing/Integrations.tsx`

### Color fixes (lines 65, 71, 119)
- Badge: `bg-accent/10 border-accent/20 text-accent` → `bg-primary/10 border-primary/20 text-primary`
- Heading accent span: `text-accent` → `text-primary`
- CTA button: `bg-accent hover:bg-accent/90 text-accent-foreground` → `bg-primary hover:bg-primary/90 text-primary-foreground`

### Add Stripe integration (after ShopWorks, before API Access)
```
{ name: "Stripe", category: "Payments", description: "Secure payment processing and invoicing" }
```

This gives 10 items total: 1 full-width (Brand-Shop Catalog) + 9 regular items = 3 perfect rows of 3.


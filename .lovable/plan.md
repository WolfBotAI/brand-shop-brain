

# Make "Brand" White in Footer Logo

## Problem
The footer currently renders the logo as a single PNG image (`brand-logo.png`). Since the word "Brand" is baked into the image, we cannot change its color with CSS alone.

## Solution
Replace the `<img>` tag in the footer with an inline text-based logo that matches the brand logo layout:
- The orange shopping bag icon (from `brand-shop-ai-symbol.png`, already at `public/favicon.png`)
- "Brand-" in **white** text
- "Shop.AI" in **orange** (`text-primary`) text

The Navbar will continue using the original PNG logo unchanged.

## Files to Modify

| File | Change |
|------|--------|
| `src/components/landing/Footer.tsx` | Replace `<img src={brandLogo}>` with an inline layout: icon image + styled text spans ("Brand-" in white, "Shop.AI" in orange). Import the symbol icon from `src/assets/` or reference `/favicon.png`. |

## Technical Details
- Import the symbol/icon image (copy `brand-shop-ai-symbol.png` to `src/assets/brand-icon.png` for proper bundling)
- Render as a flex row: icon + text with two `<span>` elements
- "Brand-" span: `text-white font-bold`
- "Shop.Ai" span: `text-primary font-bold`
- Match the existing `h-10` sizing

## New File
| File | Source |
|------|--------|
| `src/assets/brand-icon.png` | Copy from `user-uploads://brand-shop-ai-symbol.png` |


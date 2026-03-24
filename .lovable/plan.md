

# Add Login/Signup Links to Landing Page

## What to do

Add "Log In" and "Sign Up" buttons to the Navbar and relevant CTAs that link to `https://hub.brand-shop.ai`.

## Changes

### `src/components/landing/Navbar.tsx`
- Add a "Log In" text link and a "Sign Up" primary button to the desktop nav (right side, after Features dropdown)
- Add both links to the mobile menu at the bottom
- Both link to `https://hub.brand-shop.ai` as external `<a>` tags (not React Router `<Link>`)

### `src/components/landing/Hero.tsx`
- No change needed — CTAs are "See How Much You Can Save" and "Book a Demo" which are landing-page specific

### `src/components/landing/CTASection.tsx`
- Optionally add a "Sign Up Free" button linking to `https://hub.brand-shop.ai`

### `src/components/features/FeatureCTA.tsx`
- Update the "See How Much You Can Save" or add a "Get Started" button linking to `https://hub.brand-shop.ai`

## Technical detail
- Use `<a href="https://hub.brand-shop.ai" target="_blank" rel="noopener noreferrer">` for external links
- Keep existing internal `/login` and `/signup` routes working for the app itself (ProtectedRoute redirects, etc.)


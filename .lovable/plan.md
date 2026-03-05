

# Add Persona Pages (Distributors, Decorators, Referral Partners) + "Who We Serve" Nav

## What We're Building

Three dedicated persona landing pages that speak directly to each audience's pain points, plus a "Who We Serve" dropdown in the main nav and homepage integration.

---

## Persona Pages

### `/for/distributors` — For Distributors
**Hero**: "Stop Forwarding Emails. Start Scaling."
**Pain points section** (3-4 cards):
- Managing multiple stores across multiple platforms manually
- Forwarding POs to suppliers and creating POs for decorators
- Answering tracking calls, emails, SMS from customers — then chasing decorators for updates
- Everyone frustrated: customers can't get answers, decorators overwhelmed, distributors stuck in the middle

**How We Solve It** section:
- AI-Powered Stores — AI builds and manages stores for your clients, no web updates needed
- Order Routing — Orders auto-route to the right supplier and decorator, no forwarding
- AI Conversations Agent — Handles customer support 24/7 across web chat, SMS, email, FB, IG
- AI Voice Agent — Answers phone calls for tracking and status
- Certified Decorator Network — Vetted decorators integrated into our systems, so AI agents can provide real-time tracking

**What You Get**:
- White-labeled distributor agency account
- Agency-level reporting
- AI-powered web stores for all your clients
- AI Conversations + AI Voice for 24/7 support

**Add-ons**: Order Routing, AI Vision, Site Migration

**CTA**: "Take the Assessment" → `/assessment`

---

### `/for/decorators` — For Decorators
**Hero**: "Stop Copy-Pasting POs. Let AI Handle It."
**Pain points section**:
- Every client sends POs in a different format (PDF, email, phone)
- Staff manually opens emails, copies PO data into your system
- Supervisors re-check every entry for accuracy
- Overwhelmed by client calls and emails asking for status updates — can't answer distributors, distributors can't answer their clients

**How We Solve It**:
- AI Vision Agent — Reads any PO format (PDF, photo, email) and extracts all fields automatically
- AI Conversations Agent — Handles client inquiries 24/7 across all channels
- AI Voice Agent — Answers phone calls for order status
- Integration into your existing platform — our AI plugs into your system

**CTA**: "Take the Assessment" → `/assessment`

---

### `/for/referral-partners` — For Referral Partners
**Hero**: "Offer Branded Stores to Your Audience. Earn While You Grow."
**Who this is for**: Agencies, micro/macro influencers, industry leaders with an audience
**Value prop**:
- Offer company stores for almost any vertical
- Decorated apparel and one-off items at case pricing
- White-label under your brand
- Revenue share / commissions

**CTA**: "Take the Assessment" → `/assessment`

---

## Navigation Changes

### `Navbar.tsx`
Add a **"Who We Serve"** dropdown (same pattern as Features dropdown) with:
- Distributors → `/for/distributors`
- Decorators → `/for/decorators`
- Referral Partners → `/for/referral-partners`

Also add to mobile menu.

### `Footer.tsx`
Update footer columns to include "Who We Serve" links pointing to the three persona pages.

---

## Homepage Integration

### `Index.tsx`
Add a new **`PersonasSection`** component between IntroSection and IntroducingSection. Shows 3 cards — one per persona — with icon, title, 1-line pain point summary, and "Learn More →" link to each persona page.

---

## Route Registration

### `App.tsx`
Add routes: `/for/distributors`, `/for/decorators`, `/for/referral-partners`

---

## Files

| File | Action |
|------|--------|
| `src/pages/personas/ForDistributors.tsx` | **New** — Full persona landing page |
| `src/pages/personas/ForDecorators.tsx` | **New** — Full persona landing page |
| `src/pages/personas/ForReferralPartners.tsx` | **New** — Full persona landing page |
| `src/components/landing/PersonasSection.tsx` | **New** — 3-card section for homepage |
| `src/components/landing/Navbar.tsx` | Add "Who We Serve" dropdown |
| `src/components/landing/Footer.tsx` | Add persona page links |
| `src/pages/Index.tsx` | Add PersonasSection |
| `src/App.tsx` | Add 3 persona routes |

All pages use the same Navbar + Footer wrapper and match the homepage's light color scheme with `framer-motion` animations.


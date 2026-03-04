

# Major Landing Page Overhaul: Assessment Funnel, Persona-Based Messaging, Pricing Removal, Visual Fixes

## Summary

This is a significant restructuring of the marketing website to: (1) add a 3-persona assessment funnel with DISC profiling, (2) remove all pricing, (3) fix broken images/visuals, (4) update the ConnectSection AI hub labels, and (5) align feature page styling with the homepage.

---

## 1. Assessment Funnel (New Page + Component)

Create `/assessment` route with a multi-step quiz component that identifies 3 personas then customizes questions.

### Step 1: Persona Identification
"Which best describes you?"
- **Distributor** — "I supply branded apparel to schools, churches, businesses"
- **Decorator** — "I print, embroider, or decorate apparel for clients"
- **Referral Partner** — "I'm an agency, influencer, or industry leader with an audience"

### Step 2-4: Persona-Specific Pain Point Questions

**Distributor path:**
- "How many client stores do you currently manage?" (1-5, 6-20, 20+, None yet)
- "What's your biggest operational headache?" (Updating websites, Forwarding POs to suppliers/decorators, Answering customer tracking calls/emails, All of the above)
- "How do you currently handle customer support?" (I answer everything myself, I have staff but they're overwhelmed, I don't — customers wait, I outsource it)

**Decorator path:**
- "How do you currently receive purchase orders?" (Email PDFs, Phone calls, Web forms, Mix of everything)
- "What's your biggest PO processing challenge?" (Inconsistent formats from clients, Manual copy-paste into our system, Supervisor has to verify every entry, All of the above)
- "How do you handle client calls and status requests?" (We answer when we can, We're overwhelmed and miss calls, We have staff dedicated to this, We don't have a system)

**Referral Partner path:**
- "What kind of audience do you serve?" (Local businesses, Schools/orgs, Social media following, Industry network)
- "Have you offered branded merchandise before?" (Yes actively, Tried but too complex, No but interested, No and not sure)
- "What would make you want to refer a merch platform?" (Revenue share/commissions, Value to my audience, White-label under my brand, Case pricing for one-offs)

### Step 5: DISC Question 1 (Pace)
Contextualized to apparel industry:
- **Distributor**: "When a new client reaches out about a company store, you typically..." → "Jump in immediately — send them options same day" (outgoing) vs. "Take time to research their needs before responding" (reserved)
- **Decorator**: "When you receive a rush order from a top client, you..." → "Rally the team and get it done fast, communicating every step" (outgoing) vs. "Quietly prioritize it and deliver without fanfare" (reserved)
- **Referral Partner**: "When you discover a product your audience would love, you..." → "Share it immediately with excitement and energy" (outgoing) vs. "Test it yourself first and share a thoughtful review" (reserved)

### Step 6: DISC Question 2 (Priority)
- **Distributor**: "What matters more when choosing a decorator partner?" → "On-time delivery and competitive pricing" (task) vs. "Strong communication and relationship" (people)
- **Decorator**: "What makes you proudest about your shop?" → "Efficiency — fast turnaround and zero defects" (task) vs. "Relationships — clients trust us and keep coming back" (people)
- **Referral Partner**: "What drives your recommendations?" → "ROI and measurable results for your audience" (task) vs. "How the brand treats people and builds community" (people)

### Step 7: Contact Capture
Name, email, phone, SMS consent

### Step 8: Results
Show DISC profile + personalized value proposition based on persona + CTA to book demo

### Data Flow
- Submit to edge function `submit-brand-assessment`
- Calculate DISC type (outgoing+task=D, outgoing+people=I, reserved+people=S, reserved+task=C)
- Store in `assessment_results` table
- Push to Wolf Bot AI (GHL) with tags: `persona-distributor`, `disc-d`, `assessment-completed`, etc.
- GHL custom fields: `disc_type`, `disc_label`, `disc_tips`, `persona_type`, `pain_points`

---

## 2. Remove All Pricing

**`PackagesSection.tsx`**: Remove dollar amounts ($49, $99, $179, Custom). Reframe as capability tiers without prices. Keep package names (Starter, Growth, Pro, Enterprise) and feature lists. Replace "Get Started" buttons with "Book a Demo" / "Contact Sales".

**Landing page copy**: Remove any reference to specific pricing anywhere.

### What Packages Include (for all distributors):
- White-labeled distributor agency account
- Agency-level reporting
- AI-powered web stores for clients
- AI Conversations Agent (web chat, SMS, email, Facebook, Instagram messengers)
- AI Voice Agent for 24/7 customer support

### Add-ons (mentioned separately):
- Order Routing
- AI Vision
- Site Migration

---

## 3. Fix ConnectSection AI Hub

**Current issue**: The 4 nodes show "AI Chat" (Live Support), "AI Voice", "AI Vision", "Web Widget". 
**Fix**: 
- Rename "AI Chat" → "AI Conversations" with subtitle "Web, SMS, Email, FB, IG"
- Keep "AI Voice" → "Phone Calls"
- Keep "AI Vision" → "PO Extraction"  
- Remove "Web Widget" (redundant with AI Conversations) → Replace with "AI Web Widget" subtitle "Embed on Any Site"
- Center the AI Agent icon properly within the hub

---

## 4. Fix Broken Images & Visuals

The IntroSection and IntroducingSection use CSS gradient placeholders that look like broken/empty grey boxes (visible in screenshots). Replace with meaningful illustrated content or styled mockup cards instead of gradient rectangles.

- **IntroSection**: Replace gradient placeholder with a styled mockup showing the AI discovery chat flow (similar to the Hero mockup)
- **IntroducingSection bottom visual**: Replace gradient rectangle with a 3-step flow diagram using icons and text (AI Discovery → Package Selection → Store Live)

---

## 5. Feature Page Styling Alignment

Feature pages use `bg-secondary` (deep navy) for heroes and CTAs, while the homepage uses `bg-background` (white) and `bg-muted` (light grey). Update shared components:

- **`FeatureHero.tsx`**: Change from `bg-secondary` to match homepage style — white background with subtle radial gradient pattern (like Hero.tsx)
- **`FeatureCTA.tsx`**: Change from `bg-secondary` to `bg-[hsl(var(--section-dark))]` to match the homepage CTA
- **`FeatureSection.tsx`**: Icon containers use `bg-secondary` (navy) — change to `bg-primary/10` with `text-primary` icons to match homepage cards

---

## Files

| File | Action |
|------|--------|
| `src/pages/Assessment.tsx` | **New** — Full assessment funnel with persona identification + DISC |
| `src/components/landing/PackagesSection.tsx` | Remove prices, reframe as capabilities |
| `src/components/landing/ConnectSection.tsx` | Fix AI hub labels, center icon |
| `src/components/landing/IntroSection.tsx` | Replace gradient placeholder with mockup |
| `src/components/landing/IntroducingSection.tsx` | Replace gradient placeholder with flow diagram |
| `src/components/features/FeatureHero.tsx` | Match homepage color scheme |
| `src/components/features/FeatureCTA.tsx` | Match homepage CTA colors |
| `src/components/features/FeatureSection.tsx` | Match homepage card styling |
| `src/components/landing/Hero.tsx` | Update CTA to link to `/assessment` |
| `src/components/landing/CTASection.tsx` | Update CTA to link to `/assessment` |
| `src/components/landing/Navbar.tsx` | Add "Take Assessment" link |
| `src/App.tsx` | Add `/assessment` route |
| `src/pages/Index.tsx` | No structural changes needed |

This will be implemented in stages — assessment funnel first, then pricing/visual fixes, then feature page alignment.


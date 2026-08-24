# Book a Demo, Blog 404, and Metadata Fixes

Three separate issues, fixed in one pass.

## 1. "Book a Demo" actually books a demo

Today the button just scrolls to the "How it works" section. It will become a real
booking flow for a **15-minute Zoom discovery call**, backed by your GHL calendar.

New page `/demo`:
- Branded form: name, business email, phone, company, role, "what do you want to solve".
- Live open time slots pulled from your GHL calendar (free-slots API), timezone-aware.
- On submit: books the appointment in GHL and shows a confirmation screen with the Zoom
  details and an "Add to calendar" link.

Every "Book a Demo" button (homepage hero and the feature-page hero component) points to
`/demo` instead of scrolling. No other page content changes.

What happens in GHL on every booking:
- Upsert the **contact** (name, email, phone, company, source = website demo request).
- Create the **appointment** on the discovery calendar, assigned owner **William**.
- Create an **opportunity** in the sales pipeline, owner **William**.
- Apply the tag (e.g. `demo-booked`) to the contact.

## 2. Confirmation and reminder messaging

- **Emails** are created and sent by this app: branded HTML (Brand-Shop orange, logo,
  meeting details, reschedule link) for the instant confirmation plus reminders at
  **48h, 24h, and 1h** before the call. A scheduled job checks upcoming appointments and
  sends each reminder once.
- **SMS** is triggered in GHL for the same four moments (instant confirmation + 48h / 24h /
  1h), so texts send from your GHL number and stay in the contact's conversation thread.

Prerequisite: sending branded email from your own domain requires a verified sender domain
(e.g. `notify@brand-shop.ai`). None is configured yet, so I'll surface the email setup step
first. Until it verifies, bookings still work and SMS still fires; emails queue and start
sending once DNS verifies.

## 3. /blog returning 404 on the published site

The blog routes exist in source but the live site is running an older build from before the
blog shipped. Fix: publish the project. I'll also confirm `/blog` and the post URL load on
the live domain and that both are in the sitemap.

## 4. Duplicate/generic metadata

Several routes have no per-page metadata and inherit the site-wide title and description
from `index.html`, so search engines see the same text repeated. I'll give unique titles,
descriptions, and canonicals to: Login, Signup, Forgot Password, Reset Password, the new
`/demo` page, and the 404 page (noindex). I'll also review the feature and persona pages for
near-duplicate descriptions and rewrite any that overlap, and add `/demo` to the sitemap.

## Technical notes

- New edge functions: `ghl-calendar` (list free slots), `book-demo` (validated booking:
  contact upsert, appointment, opportunity, tag, owner assignment, enqueue confirmation
  email, trigger GHL SMS webhook) and `demo-reminders` (cron, 48h/24h/1h email sends +
  GHL SMS triggers). Input validated with Zod; GHL credentials stored as backend secrets.
- New table `demo_bookings` (contact/appointment/opportunity ids, slot time, reminder-sent
  flags) with RLS + grants; no public read.
- Frontend: `src/pages/Demo.tsx`, route in `App.tsx`, CTA href swaps in
  `src/components/landing/Hero.tsx` and `src/components/features/FeatureHero.tsx`.
- Email templates built as branded HTML in the project and sent through Lovable's email
  infrastructure (queue + retries + send log).

## What I need from you

- GHL calendar ID (or booking link) for the 15-minute Zoom discovery call, William's GHL
  user ID/email, pipeline + stage for the opportunity, and the exact tag name.
- A GHL API key/token with calendar, contact, and opportunity access (I'll request it
  securely).
- The sender domain for confirmation emails.

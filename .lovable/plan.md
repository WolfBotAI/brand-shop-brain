

# Rebrand GHL to Wolf Bot AI + White-Label Supplier Architecture

## Summary

Two interconnected changes:

1. **Rename all "GHL" / "GoHighLevel" references to "Wolf Bot AI"** across the entire codebase — UI labels, component names, API wrapper functions, file names
2. **Restructure supplier/integration model** to support white-labeled catalogs ("Brand-Shop Catalog") vs. distributor-owned supplier accounts, and update the order routing narrative to emphasize multi-supplier/multi-decorator invoice splitting

---

## Part 1: GHL → Wolf Bot AI Rename

### Files to modify

| File | Changes |
|------|---------|
| `src/components/app/onboarding/GhlConnectStep.tsx` | Rename file to `WolfBotConnectStep.tsx`. Replace all "GHL", "GoHighLevel" labels with "Wolf Bot AI". Update chat bubble text. Change accordion help text. |
| `src/lib/api/tenant.ts` | Rename `GhlConnectRequest` → `WolfBotConnectRequest`, `GhlConnectResponse` → `WolfBotConnectResponse`, `connectGhl` → `connectWolfBot`. The actual API path (`/api/ghl/connect`) stays the same — only the frontend-facing names change. |
| `src/pages/app/Onboarding.tsx` | Update import from `GhlConnectStep` to `WolfBotConnectStep`. Update step title from "Connect CRM" to "Connect Wolf Bot AI". |

### What does NOT change
- The backend API endpoint `/api/ghl/connect` stays as-is (backend knows it as GHL internally)
- The `locationId` field name stays the same in the request payload

---

## Part 2: White-Label Supplier Architecture

### Concept
- **Brand-Shop Catalog**: The default integration for all distributors. Behind the scenes this is S&S Activewear, Printful, and eventually SanMar — but the distributor sees "Brand-Shop Catalog" with no mention of underlying suppliers.
- **Advanced/Own Accounts**: Some distributors have their own S&S or SanMar accounts. These distributors get an "Advanced Integrations" section where they can connect their own supplier credentials.
- The landing page Integrations section should NOT list S&S, SanMar, Printful, AlphaBroder, Augusta as separate supplier cards. Instead show "Brand-Shop Catalog" as the primary product source integration.

### Files to modify

**`src/components/app/onboarding/SupplierStep.tsx`** — Complete rewrite of this step:
- Default path: "Connect to Brand-Shop Catalog" — a simple toggle/confirm (no credentials needed from distributor, we use our own white-labeled accounts)
- Advanced path: Expandable "I have my own supplier accounts" accordion revealing credential forms for S&S Activewear, SanMar, etc.
- Remove all visible mentions of "SSActivewear" from the default flow
- Chat bubble: "Brand-Shop Catalog gives you access to thousands of blank apparel products ready for decoration."
- API call: For default path, call `createSupplierAccount` with `supplier: "brand-shop"` (or skip if backend auto-provisions). For advanced path, call with specific supplier name.

**`src/components/landing/Integrations.tsx`** — Restructure the integrations list:
- Remove SanMar, S&S Activewear, AlphaBroder, Augusta as separate visible cards
- Add "Brand-Shop Catalog" as the primary product sourcing integration ("Thousands of blank products, ready for your brand")
- Keep Printavo, DecoNetwork, InkSoft, Zapier, TaxJar, QuickBooks, ShopWorks, API Access

**`src/components/app/AppSidebar.tsx`** — Rename "Suppliers" nav item to "Integrations" (since it now covers both Brand-Shop Catalog and optional own supplier accounts)

---

## Part 3: Order Routing Narrative — Multi-Supplier/Multi-Decorator Split

### Key differentiator to surface in UI
One customer order (one invoice) can contain products sourced from different suppliers AND requiring different decoration methods. The system splits that single order and routes:
- SanMar products → SanMar fulfillment
- S&S products → S&S fulfillment
- Embroidery items → Decorator A
- DTG items → Decorator B

### Files to modify

**`src/components/features/OrderRoutingDemo.tsx`** — Update the demo to show invoice splitting:
- Change the demo narrative from "3 separate orders going to 3 decorators" to "1 order with 3 line items, split across suppliers AND decorators"
- Show a single invoice splitting into multiple fulfillment paths
- Update order items to reflect mixed-supplier scenario (e.g., "Gildan Tees (S&S)" and "Nike Polos (SanMar)" — but labeled generically as product names without supplier names visible)

**`src/pages/features/OrderRouting.tsx`** — Update feature page copy:
- Emphasize "One Invoice, Multiple Destinations" as the hero concept
- Update feature descriptions to highlight supplier + decorator splitting

---

## Technical Notes

- All API endpoint paths remain unchanged — only frontend labels, component names, and copy change
- The `supplier` field sent to the backend will use `"brand-shop"` for white-labeled accounts (backend maps this to the actual supplier internally)
- The white-label architecture means most distributors never see "S&S Activewear" or "SanMar" anywhere in the platform
- Distributors with their own accounts see an "Advanced" section where they can optionally connect direct supplier credentials




# Expanded Store Creation + AI Merch Advisor + Store Workspace + Payment Config

## Problems
1. **404 error**: CompletionStep links to `/app/stores/${storeId}` but no route or page exists
2. **No catalog browsing**: Store creation step has no product selection from Brand-Shop Catalog
3. **No themes/templates**: No way to pick a store theme based on vertical
4. **No AI agent helping with apparel selection**: The AI Merch Advisor concept exists on the feature marketing page but is not present in the actual onboarding/store creation flow
5. **No payment/billing configuration**: Need two billing models (Brand-Shop bills end customer via our Stripe, or distributor self-collects and we charge their card)

## Plan

### 1. Rewrite `CreateStoreStep.tsx` as a multi-phase flow

Expand the step into sequential sub-sections the user progresses through:

**Phase A — Store Details** (existing: name, client, vertical)

**Phase B — AI Merch Advisor + Catalog Selection**
- After vertical is selected, show an embedded mini chat with the AI Merch Advisor bot
- The bot greets: "I've loaded the Brand-Shop Catalog for [vertical]. Tell me about the event — goals, budget per item, colors, season — and I'll recommend products."
- Below the chat, show a product grid pre-populated with recommended items for the vertical (mock data: tees, polos, hoodies, caps, etc. with images, names, price ranges)
- Each product card has a checkbox to include/exclude from the store
- User can chat to refine (e.g., "remove hoodies, add jackets under $30") and the grid updates
- This is a UI prototype — the chat responses and filtering are scripted/local for now

**Phase C — Theme Selection**
- Show 3-4 theme cards based on vertical (e.g., "Bold Athletics", "Classic School Spirit", "Clean Corporate")
- Each shows a color palette preview and mini layout thumbnail
- One is pre-selected as recommended
- "Customize with AI" button opens a text input: "Describe your ideal store look" (placeholder for future AI store builder)

**Phase D — Payment Setup**
- Two radio cards:
  1. **"Brand-Shop handles billing"** (recommended) — We process payments on behalf of distributor. Brand-Shop appears on client's credit card. We handle taxes, shipping, fulfillment billing. Simple confirmation.
  2. **"I collect payments"** — Distributor collects from clients directly. We charge the distributor's card on file when orders are placed. Shows "Connect Payment Method" button (Stripe placeholder).

After all phases complete → "Create Store" button enabled → sets local state → Continue to CompletionStep.

### 2. Create `src/pages/app/StoreWorkspace.tsx`

New tabbed page at `/app/stores/:storeId` with placeholder tabs:
- **Overview** — Store name, status, selected theme, billing model
- **Catalog** — Grid of selected products
- **Pricing** — Markup/pricing rules (placeholder)
- **Mockups** — Mockup studio (placeholder)
- **Storefront** — Preview/publish (placeholder)
- **Billing** — Payment configuration summary

### 3. Add route in `App.tsx`

Add `<Route path="stores/:storeId" element={<StoreWorkspace />} />` inside the `/app` layout.

## Files to create/modify

| File | Action |
|------|--------|
| `src/components/app/onboarding/CreateStoreStep.tsx` | Rewrite: 4-phase flow with AI chat, catalog grid, themes, payment |
| `src/pages/app/StoreWorkspace.tsx` | New: tabbed store workspace |
| `src/App.tsx` | Add `/app/stores/:storeId` route |


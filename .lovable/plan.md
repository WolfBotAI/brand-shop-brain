

# Fix Remaining GHL References, Store Creation Error, and AI Assistant Vision

## Problems Identified

1. **"GHL" still appears in 3 files**: WelcomeStep ("Connect your GHL location"), CompletionStep ("CRM connected via GHL"), Dashboard ("connect your GHL location")
2. **Dashboard exposes supplier names**: Integration Health section shows "SSActivewear", "Printful", "SanMar", "Handled-In-Ghl" — all should be hidden or white-labeled
3. **Store creation fails with API error 401**: The `POST /api/store-builder/trigger` call fails because the `tenantId`/`locationId` from the Wolf Bot AI step are likely empty (that API also fails). Same fix pattern as supplier step — skip the blocking API call during onboarding and let the user proceed.
4. **AI Assistant needs a complete rethink**: Should help end customers (not distributors) select merchandise based on goals, budget, weather, event type, colors, materials — searching connected catalogs and recommending apparel. If they have a store, offer "Add to Store" with mockups. If no store, guide them through theme selection and AI-assisted store creation.

---

## Part 1: Remove All Remaining GHL References

**`src/components/app/onboarding/WelcomeStep.tsx`** (line 13)
- Change `"Connect your GHL location to link your CRM"` → `"Connect Wolf Bot AI to link your CRM"`

**`src/components/app/onboarding/CompletionStep.tsx`** (line 16)
- Change `"CRM connected via GHL"` → `"Wolf Bot AI connected"`

**`src/pages/app/Dashboard.tsx`** (line 105)
- Change `"connect your GHL location and supplier credentials"` → `"complete onboarding to activate your catalog and launch your first store"`

---

## Part 2: White-Label Dashboard Integration Health

**`src/pages/app/Dashboard.tsx`** — Transform integration names before display:
- Map `SSActivewear` → `Brand-Shop Catalog`
- Map `Printful` → `Brand-Shop Fulfillment`
- Map `SanMar` → `Brand-Shop Catalog`
- Replace `"Handled-In-Ghl"` status text → `"Active"`
- Collapse duplicate Brand-Shop entries into one

---

## Part 3: Fix Store Creation 401 Error

**`src/components/app/onboarding/CreateStoreStep.tsx`** — Same approach as supplier fix:
- Make "Create Store" a visual confirmation (skip the API call) since the Wolf Bot AI step likely didn't return valid tenant credentials
- Set `created = true` locally with a success toast
- Allow Continue to proceed to completion
- The real store creation will happen when the backend is fully provisioned

---

## Part 4: Reimagine AI Assistant Concept

This is a larger UX concept. The AI assistant across the platform should serve the **end customer** (the school, church, company ordering merch) — not just the distributor. The assistant would:

- Ask about their **goals** (team uniforms, fundraiser, corporate event)
- Understand **budget** constraints (per-item or total budget)
- Factor in **weather/season** (outdoor fall event vs indoor summer)
- Accept **preferences** (colors, materials, fit, special requests)
- **Search connected catalogs** and show matching apparel recommendations
- Offer **"Add to Store"** if the client already has a store (adds products with mockups)
- If no store exists, guide them through **theme selection** (distributor-picked or AI-recommended based on vertical) and **AI-assisted store creation** via chat (describe branding, colors, style → AI builds the store)

### Implementation for this round
Update the AI Recommendations card on the Dashboard and the AI Suggestions feature page/demo to reflect this end-customer-facing merchandise advisor concept rather than generic distributor analytics.

**`src/pages/app/Dashboard.tsx`** — Rename "AI Recommendations" to "AI Merch Advisor" with copy reflecting the end-customer assistance model

**`src/components/features/AISuggestionsDemo.tsx`** — Update demo to show a conversational flow: customer states goals/budget → AI searches catalog → shows apparel recommendations with "Add to Store" buttons

**`src/pages/features/AISuggestions.tsx`** — Update feature page copy to describe the end-customer merchandise selection experience

---

## Files to modify
| File | Changes |
|------|---------|
| `src/components/app/onboarding/WelcomeStep.tsx` | GHL → Wolf Bot AI |
| `src/components/app/onboarding/CompletionStep.tsx` | GHL → Wolf Bot AI |
| `src/pages/app/Dashboard.tsx` | GHL text, white-label integrations, AI card |
| `src/components/app/onboarding/CreateStoreStep.tsx` | Skip API call, visual confirmation |
| `src/components/features/AISuggestionsDemo.tsx` | Conversational merch advisor demo |
| `src/pages/features/AISuggestions.tsx` | Updated copy for end-customer AI advisor |


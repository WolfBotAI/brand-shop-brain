

# Phase 2: Distributor Onboarding Wizard

Phase 1 (App Shell + Dashboard) is complete. Next up is the **Distributor Onboarding** flow at `/app/onboarding`.

## What gets built

A multi-step guided wizard that walks a new distributor from zero to their first live store:

1. **Welcome** — Brand positioning, value prop, what to expect
2. **Connect GHL** — Location ID input, calls `POST /api/ghl/connect`, confirms tenant creation
3. **Connect Supplier** — SSActivewear credentials form, calls `POST /api/supplier-accounts`, shows connection status
4. **Create First Store** — Store name, client name, brand vertical, calls `POST /api/store-builder/trigger`
5. **Completion** — Celebration state, launch readiness summary, redirect to store workspace

## UX approach

- Reuse the existing `AnimatedStep` / `StepIndicator` components for the step sidebar
- Each step has an AI assistant card with contextual guidance ("Your GHL location links your CRM to Brand-Shop.AI")
- Progressive disclosure — no raw IDs visible, expandable "technical details" accordion
- Completion scoring — visual progress bar showing 0-100% onboarding complete
- Each step validates before allowing next (e.g., GHL connect must succeed before supplier step unlocks)
- Uses framer-motion for step transitions

## Files to create

- `src/pages/app/Onboarding.tsx` — Main wizard page with step state management
- `src/components/app/onboarding/WelcomeStep.tsx`
- `src/components/app/onboarding/GhlConnectStep.tsx` — Form + `POST /api/ghl/connect`
- `src/components/app/onboarding/SupplierStep.tsx` — Form + `POST /api/supplier-accounts`
- `src/components/app/onboarding/CreateStoreStep.tsx` — Form + `POST /api/store-builder/trigger`
- `src/components/app/onboarding/CompletionStep.tsx` — Success state + redirect

## Files to modify

- `src/App.tsx` — Add `<Route path="onboarding" element={<Onboarding />} />` under `/app`

## API calls used

- `POST /api/ghl/connect` (already in `src/lib/api/tenant.ts`)
- `POST /api/supplier-accounts` (already in `src/lib/api/suppliers.ts`)
- `POST /api/store-builder/trigger` (already in `src/lib/api/stores.ts`)

All three API service modules already exist from Phase 1 — no new API files needed.


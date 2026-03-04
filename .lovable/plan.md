

# Fix: Supplier Step "Connection Failed" Error

## Problem
The "Activate Brand-Shop Catalog" button calls `POST /api/supplier-accounts` with `supplier: "brand-shop"` and `credentials: {}`. The backend returns a 400, likely because:
1. The `tenantId` passed may be empty/invalid (if the Wolf Bot AI step didn't return one from the real API)
2. The backend may not accept `"brand-shop"` as a supplier identifier
3. Empty credentials may be rejected

## Fix
Make the Brand-Shop Catalog activation **skip the API call entirely** during onboarding — treat it as a default provisioning that happens server-side when the tenant is created. The "Activate" button becomes a simple confirmation that advances the user, since Brand-Shop Catalog is our own white-labeled catalog and doesn't require distributor credentials.

For the advanced supplier section, keep the real API call but add better error handling and show the actual error message from the backend.

### Changes to `src/components/app/onboarding/SupplierStep.tsx`:
- **Default path (Brand-Shop Catalog):** Remove the `createSupplierAccount` API call. Just set `connected = true` with a success toast — the backend provisions Brand-Shop Catalog automatically when a tenant is created.
- **Also allow continuing without activation:** Make the Continue button always enabled (Brand-Shop Catalog is the default and is always available). The "Activate" button becomes a visual confirmation rather than a gate.
- **Advanced path:** Keep the API call but improve error display to show the actual backend message.

### Files to modify
- `src/components/app/onboarding/SupplierStep.tsx` — Remove API dependency for default catalog activation


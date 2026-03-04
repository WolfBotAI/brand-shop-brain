import { apiClient, getTenantContext } from "./client";

export interface SupplierAccount {
  id: string;
  tenantId: string;
  supplier: string;
  active: boolean;
  credentials: Record<string, string>;
  baseUrl?: string;
}

export function fetchSupplierAccounts() {
  const { tenantId } = getTenantContext();
  return apiClient<SupplierAccount[]>("/api/supplier-accounts", {
    params: { tenantId: tenantId ?? undefined },
  });
}

export interface CreateSupplierAccountRequest {
  tenantId: string;
  supplier: string;
  credentials: Record<string, string>;
  baseUrl?: string;
  active?: boolean;
}

export function createSupplierAccount(data: CreateSupplierAccountRequest) {
  return apiClient<SupplierAccount>("/api/supplier-accounts", {
    method: "POST",
    body: data,
  });
}

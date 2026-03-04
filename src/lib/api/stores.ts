import { apiClient, getTenantContext } from "./client";
import type { ThemeConfig } from "@/components/app/store/StorefrontPreview";

export interface Store {
  id: string;
  storeName: string;
  clientName: string;
  brandVertical: string;
  domain?: string;
  status?: string;
  catalogId?: string;
  metadata?: Record<string, unknown>;
}

export interface CreateStoreRequest {
  tenantId?: string;
  locationId?: string;
  storeName: string;
  clientName: string;
  brandVertical: string;
  metadata?: Record<string, unknown>;
  pricingModel?: string;
  selectedProducts?: number[];
  themeConfig?: ThemeConfig;
  logoUrl?: string;
}

export interface CreateStoreResponse {
  ok: boolean;
  storeId: string;
  catalogId: string;
  storefrontUrl?: string;
}

export function createStore(data: CreateStoreRequest) {
  return apiClient<CreateStoreResponse>("/api/store-builder/trigger", {
    method: "POST",
    body: data,
  });
}

export function fetchStore(storeId: string) {
  return apiClient<Store>(`/api/stores/${storeId}`);
}

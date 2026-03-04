import { apiClient } from "./client";

export interface GhlConnectRequest {
  tenantName: string;
  tenantId?: string;
  locationId: string;
  apiKey?: string;
}

export interface GhlConnectResponse {
  ok: boolean;
  tenantId: string;
  locationId: string;
}

export function connectGhl(data: GhlConnectRequest) {
  return apiClient<GhlConnectResponse>("/api/ghl/connect", {
    method: "POST",
    body: data,
  });
}

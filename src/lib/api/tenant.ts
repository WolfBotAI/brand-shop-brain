import { apiClient } from "./client";

export interface WolfBotConnectRequest {
  tenantName: string;
  tenantId?: string;
  locationId: string;
  apiKey?: string;
}

export interface WolfBotConnectResponse {
  ok: boolean;
  tenantId: string;
  locationId: string;
}

export function connectWolfBot(data: WolfBotConnectRequest) {
  return apiClient<WolfBotConnectResponse>("/api/ghl/connect", {
    method: "POST",
    body: data,
  });
}

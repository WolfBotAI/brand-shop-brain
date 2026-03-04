import { apiClient, getTenantContext } from "./client";

export interface DashboardSummary {
  activeStores: number;
  totalOrders: number;
  totalRevenue: number;
  avgOrderValue: number;
  recentActivity: Array<{
    id: string;
    type: string;
    message: string;
    timestamp: string;
  }>;
  storePerformance: Array<{
    storeId: string;
    storeName: string;
    revenue: number;
    orders: number;
    change: number;
  }>;
}

export interface IntegrationStatus {
  integrations: Array<{
    name: string;
    status: "connected" | "disconnected" | "demo" | "error";
    lastChecked?: string;
    details?: string;
  }>;
}

export function fetchDashboardSummary() {
  const { tenantId } = getTenantContext();
  return apiClient<DashboardSummary>("/api/dashboard/summary", {
    params: { tenantId: tenantId ?? undefined },
  });
}

export function fetchIntegrationStatus() {
  return apiClient<IntegrationStatus>("/api/integrations/status");
}

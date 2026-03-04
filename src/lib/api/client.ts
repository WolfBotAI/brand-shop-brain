/**
 * Brand-Shop.AI API Client
 * 
 * Centralized fetch wrapper for https://api.brand-shop.ai
 * All components call this layer — never the backend directly.
 * When we add a BFF/edge layer, we swap the BASE_URL here and nothing else changes.
 */

const BASE_URL = "https://api.brand-shop.ai";

// Tenant context — set once after login/onboarding, read everywhere
let _tenantId: string | null = null;
let _locationId: string | null = null;

export function setTenantContext(tenantId: string, locationId?: string) {
  _tenantId = tenantId;
  _locationId = locationId ?? null;
  if (typeof window !== "undefined") {
    localStorage.setItem("bs_tenantId", tenantId);
    if (locationId) localStorage.setItem("bs_locationId", locationId);
  }
}

export function getTenantContext() {
  if (!_tenantId && typeof window !== "undefined") {
    _tenantId = localStorage.getItem("bs_tenantId");
    _locationId = localStorage.getItem("bs_locationId");
  }
  return { tenantId: _tenantId, locationId: _locationId };
}

export function clearTenantContext() {
  _tenantId = null;
  _locationId = null;
  if (typeof window !== "undefined") {
    localStorage.removeItem("bs_tenantId");
    localStorage.removeItem("bs_locationId");
  }
}

// Error normalization
export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  params?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
};

export async function apiClient<T = unknown>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, body, headers: extraHeaders, ...rest } = options;

  // Build URL with query params
  const url = new URL(path, BASE_URL);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) url.searchParams.set(key, String(value));
    });
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((extraHeaders as Record<string, string>) ?? {}),
  };

  const res = await fetch(url.toString(), {
    ...rest,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  // Try to parse JSON; fall back to text
  let data: unknown;
  const ct = res.headers.get("content-type") ?? "";
  if (ct.includes("application/json")) {
    data = await res.json();
  } else {
    data = await res.text();
  }

  if (!res.ok) {
    throw new ApiError(
      (data as any)?.message ?? `API error ${res.status}`,
      res.status,
      data
    );
  }

  return data as T;
}

// Multipart helper (for file uploads like AI Vision ingest)
export async function apiUpload<T = unknown>(
  path: string,
  formData: FormData
): Promise<T> {
  const url = new URL(path, BASE_URL);
  const res = await fetch(url.toString(), {
    method: "POST",
    body: formData,
  });

  let data: unknown;
  const ct = res.headers.get("content-type") ?? "";
  if (ct.includes("application/json")) {
    data = await res.json();
  } else {
    data = await res.text();
  }

  if (!res.ok) {
    throw new ApiError(
      (data as any)?.message ?? `Upload error ${res.status}`,
      res.status,
      data
    );
  }
  return data as T;
}

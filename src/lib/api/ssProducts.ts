/**
 * Catalog API — reads from ss_catalog_cache table (populated by sync-catalog edge function)
 * Falls back to live S&S API via ss-catalog edge function if cache is empty.
 */

import { supabase } from "@/integrations/supabase/client";

// --- Types ---

export interface SSStyle {
  styleID: number;
  title: string;
  description: string;
  brandName: string;
  baseCategory: string;
  styleImage: string | null;
  customerPrice?: number;
  piecePrice?: number;
  availableColors: { name: string; hex: string }[];
  availableSizes: string[];
}

export interface SSProduct {
  sku: string;
  brandName: string;
  styleName: string;
  title: string;
  colorName: string;
  sizeName: string;
  customerPrice: number;
  piecePrice: number;
  dozenPrice: number;
  casePrice: number;
  imageUrl: string | null;
}

export interface StyleDetailResult {
  colors: { name: string; hex: string; image: string | null; backImage: string | null }[];
  sizes: string[];
  pricing: {
    customerPrice: { min: number; max: number };
    piecePrice: { min: number; max: number };
  };
  description: string;
  brandName: string;
  styleName: string;
  totalSkus: number;
}

// --- Image helpers ---

/** For cached catalog, images are already public Supabase Storage URLs */
export function getCdnImageUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  return path; // Already a full public URL from storage
}

export function getProxiedImageUrl(originalUrl: string | null | undefined): string | null {
  if (!originalUrl) return null;
  return originalUrl;
}

export function getPlaceholderImage(label: string): string {
  const encoded = encodeURIComponent(label.substring(0, 20).replace(/ /g, "+"));
  return `https://placehold.co/400x400/1a1a2e/e2e8f0?text=${encoded}`;
}

// --- Edge function caller (fallback only) ---

async function callCatalog(params: Record<string, string>): Promise<any> {
  const qs = new URLSearchParams(params).toString();
  const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
  const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  const url = `https://${projectId}.supabase.co/functions/v1/ss-catalog?${qs}`;

  const resp = await fetch(url, {
    headers: {
      Authorization: `Bearer ${anonKey}`,
      apikey: anonKey,
    },
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ error: resp.statusText }));
    throw new Error(err.error || `Catalog API error ${resp.status}`);
  }

  return resp.json();
}

// --- Fallback mock catalog ---

const FALLBACK_CATALOG: SSStyle[] = [
  {
    styleID: 1, title: "Premium Heavyweight Tee", description: "6.1 oz ringspun cotton",
    brandName: "Brand-Shop Basics", baseCategory: "T-Shirts",
    styleImage: null,
    customerPrice: 8.50, piecePrice: 12.99,
    availableColors: [{ name: "White", hex: "#FFFFFF" }, { name: "Black", hex: "#1a1a1a" }, { name: "Navy", hex: "#1B2A4A" }],
    availableSizes: ["S", "M", "L", "XL", "2XL"],
  },
  {
    styleID: 2, title: "Performance Polo", description: "Moisture-wicking polyester blend",
    brandName: "Brand-Shop Performance", baseCategory: "Polos",
    styleImage: null,
    customerPrice: 14.00, piecePrice: 22.99,
    availableColors: [{ name: "White", hex: "#FFFFFF" }, { name: "Black", hex: "#1a1a1a" }],
    availableSizes: ["S", "M", "L", "XL", "2XL"],
  },
  {
    styleID: 3, title: "Classic Pullover Hoodie", description: "8 oz fleece blend",
    brandName: "Brand-Shop Basics", baseCategory: "Hoodies & Sweatshirts",
    styleImage: null,
    customerPrice: 16.50, piecePrice: 28.99,
    availableColors: [{ name: "Black", hex: "#1a1a1a" }, { name: "Navy", hex: "#1B2A4A" }],
    availableSizes: ["S", "M", "L", "XL", "2XL"],
  },
];

// --- Cache-based API ---

export interface FetchStylesPageResult {
  styles: SSStyle[];
  hasMore: boolean;
  isFallback: boolean;
}

function mapCacheRow(row: any): SSStyle {
  const pricing = row.pricing || {};
  const colors = (row.colors || []) as any[];
  const sizes = (row.sizes || []) as string[];

  return {
    styleID: row.style_id,
    title: row.title,
    description: row.description,
    brandName: row.brand_name,
    baseCategory: row.base_category,
    styleImage: row.style_image_url,
    customerPrice: pricing.customerPrice?.min || undefined,
    piecePrice: pricing.piecePrice?.min || undefined,
    availableColors: colors.map((c: any) => ({ name: c.name, hex: c.hex })),
    availableSizes: sizes,
  };
}

export async function fetchStylesPage(
  page: number = 1,
  perPage: number = 100,
  filters?: { keyword?: string; category?: string }
): Promise<FetchStylesPageResult> {
  try {
    // Try cache first
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    let query = supabase
      .from("ss_catalog_cache" as any)
      .select("*")
      .order("brand_name")
      .order("title")
      .range(from, to);

    if (filters?.keyword) {
      query = query.or(
        `title.ilike.%${filters.keyword}%,brand_name.ilike.%${filters.keyword}%,base_category.ilike.%${filters.keyword}%`
      );
    }
    if (filters?.category) {
      query = query.ilike("base_category", `%${filters.category}%`);
    }

    const { data, error } = await query;

    if (error) throw error;

    if (data && data.length > 0) {
      return {
        styles: data.map(mapCacheRow),
        hasMore: data.length >= perPage,
        isFallback: false,
      };
    }

    // Cache empty — fall back to live API
    console.warn("Catalog cache empty, falling back to live API");
    return await fetchStylesPageLive(page, perPage, filters);
  } catch (e) {
    console.warn("fetchStylesPage cache failed, trying live API:", e);
    return await fetchStylesPageLive(page, perPage, filters);
  }
}

async function fetchStylesPageLive(
  page: number,
  perPage: number,
  filters?: { keyword?: string; category?: string }
): Promise<FetchStylesPageResult> {
  try {
    const params: Record<string, string> = {
      action: "styles",
      page: String(page),
      perPage: String(perPage),
    };
    if (filters?.keyword) params.keyword = filters.keyword;
    if (filters?.category) params.category = filters.category;

    const data = await callCatalog(params);
    if (Array.isArray(data) && data.length > 0) {
      return {
        styles: data.map((raw: any) => ({
          styleID: raw.styleID ?? raw.StyleID ?? 0,
          title: raw.title ?? raw.Title ?? "",
          description: raw.description ?? raw.Description ?? "",
          brandName: raw.brandName ?? raw.BrandName ?? "",
          baseCategory: raw.baseCategory ?? raw.BaseCategory ?? "",
          styleImage: null, // S&S images require auth, won't load
          customerPrice: undefined,
          piecePrice: undefined,
          availableColors: [],
          availableSizes: [],
        })),
        hasMore: data.length >= perPage,
        isFallback: false,
      };
    }
    return { styles: [], hasMore: false, isFallback: false };
  } catch {
    if (page > 1) return { styles: [], hasMore: false, isFallback: true };
    let filtered = [...FALLBACK_CATALOG];
    if (filters?.keyword) {
      const lower = filters.keyword.toLowerCase();
      filtered = filtered.filter(
        (s) => s.title.toLowerCase().includes(lower) || s.baseCategory.toLowerCase().includes(lower)
      );
    }
    if (filters?.category) {
      filtered = filtered.filter((s) => s.baseCategory === filters.category);
    }
    return { styles: filtered, hasMore: false, isFallback: true };
  }
}

/** Fetch detailed product data from cache */
export async function fetchStyleDetail(styleID: number): Promise<StyleDetailResult | null> {
  try {
    // Try cache first
    const { data, error } = await (supabase
      .from("ss_catalog_cache" as any)
      .select("*")
      .eq("style_id", styleID)
      .single() as any);

    if (!error && data) {
      const row = data as any;
      const colors = (row.colors || []) as any[];
      const sizes = (row.sizes || []) as string[];
      const pricing = row.pricing || {};

      return {
        colors: colors.map((c: any) => ({
          name: c.name,
          hex: c.hex,
          image: c.imageUrl || null,
          backImage: c.backImageUrl || null,
        })),
        sizes,
        pricing: {
          customerPrice: pricing.customerPrice || { min: 0, max: 0 },
          piecePrice: pricing.piecePrice || { min: 0, max: 0 },
        },
        description: data.description || "",
        brandName: data.brand_name || "",
        styleName: data.title || "",
        totalSkus: data.total_skus || 0,
      };
    }

    // Fallback to live API
    const result = await callCatalog({ action: "styleDetail", styleID: String(styleID) });
    return result as StyleDetailResult;
  } catch (e) {
    console.warn("fetchStyleDetail failed for styleID", styleID, e);
    return null;
  }
}

export async function searchStyles(query: string): Promise<SSStyle[]> {
  const result = await fetchStylesPage(1, 100, { keyword: query });
  return result.styles;
}

export async function getAllStyles(): Promise<SSStyle[]> {
  const result = await fetchStylesPage(1, 100);
  return result.styles;
}

export async function fetchCategories(): Promise<string[]> {
  try {
    // Get unique categories from cache
    const { data, error } = await supabase
      .from("ss_catalog_cache" as any)
      .select("base_category")
      .limit(1000);

    if (!error && data && data.length > 0) {
      const cats = [...new Set(data.map((r: any) => r.base_category).filter(Boolean))];
      return cats.sort();
    }

    // Fallback to live API
    const apiData = await callCatalog({ action: "categories" });
    if (Array.isArray(apiData)) {
      return apiData.map((c: any) => c.name ?? c.Name ?? c.categoryName ?? String(c));
    }
  } catch (e) {
    console.warn("Failed to fetch categories:", e);
  }
  return Array.from(new Set(FALLBACK_CATALOG.map((p) => p.baseCategory)));
}

export function getStyleById(styleID: number): SSStyle | undefined {
  return FALLBACK_CATALOG.find((s) => s.styleID === styleID);
}

export async function fetchStyleById(styleID: number): Promise<SSStyle | undefined> {
  try {
    const { data, error } = await supabase
      .from("ss_catalog_cache" as any)
      .select("*")
      .eq("style_id", styleID)
      .single();

    if (!error && data) return mapCacheRow(data);
  } catch {}
  return FALLBACK_CATALOG.find((s) => s.styleID === styleID);
}

export async function getProductsByStyle(styleIds: (string | number)[]): Promise<SSProduct[]> {
  if (styleIds.length === 0) return [];
  try {
    const data = await callCatalog({ action: "products", styleIDs: styleIds.join(",") });
    if (Array.isArray(data) && data.length > 0) {
      return data.map((raw: any) => ({
        sku: raw.sku ?? raw.SKU ?? "",
        brandName: raw.brandName ?? raw.BrandName ?? "",
        styleName: raw.styleName ?? raw.StyleName ?? "",
        title: raw.title ?? raw.Title ?? `${raw.styleName ?? ""} ${raw.colorName ?? ""}`.trim(),
        colorName: raw.colorName ?? raw.ColorName ?? "",
        sizeName: raw.sizeName ?? raw.SizeName ?? "",
        customerPrice: raw.customerPrice ?? raw.CustomerPrice ?? 0,
        piecePrice: raw.piecePrice ?? raw.PiecePrice ?? 0,
        dozenPrice: raw.dozenPrice ?? raw.DozenPrice ?? 0,
        casePrice: raw.casePrice ?? raw.CasePrice ?? 0,
        imageUrl: raw.colorFrontImage ?? raw.ColorFrontImage ?? null,
      }));
    }
  } catch (e) {
    console.warn("getProductsByStyle failed:", e);
  }
  return [];
}

// --- Vertical → search keywords ---

const verticalKeywords: Record<string, string[]> = {
  sports: ["tee", "polo", "hoodie", "cap", "shorts"],
  corporate: ["polo", "jacket", "quarter-zip", "sweatshirt", "tee"],
  schools: ["tee", "hoodie", "cap", "polo", "sweatshirt"],
  events: ["tee", "hoodie", "cap", "tank", "tote"],
  fashion: ["tee", "hoodie", "jogger", "snapback", "sweatshirt"],
  other: ["tee", "hoodie", "cap", "polo", "sweatshirt"],
};

export function getSearchQueriesForVertical(vertical: string): string[] {
  return verticalKeywords[vertical] || verticalKeywords.other;
}

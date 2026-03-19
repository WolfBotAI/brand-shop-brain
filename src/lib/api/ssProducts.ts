/**
 * Catalog API — calls the ss-catalog edge function
 * which proxies the S&S Activewear API v2.
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

// --- Edge function caller ---

async function callCatalog(params: Record<string, string>): Promise<any> {
  const qs = new URLSearchParams(params).toString();
  const { data, error } = await supabase.functions.invoke("ss-catalog", {
    body: null,
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  // supabase.functions.invoke doesn't support query params well for GET,
  // so we use fetch directly with the project URL
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

// --- Map S&S API response to our interfaces ---

function mapStyle(raw: any): SSStyle {
  return {
    styleID: raw.styleID ?? raw.StyleID ?? raw.id ?? 0,
    title: raw.title ?? raw.Title ?? raw.styleName ?? "",
    description: raw.description ?? raw.Description ?? "",
    brandName: raw.brandName ?? raw.BrandName ?? raw.brand ?? "",
    baseCategory: raw.baseCategory ?? raw.BaseCategory ?? raw.category ?? "",
    styleImage: raw.styleImage ?? raw.StyleImage ?? raw.mainImage ?? null,
    customerPrice: raw.customerPrice ?? raw.CustomerPrice ?? raw.piecePrice ?? undefined,
    piecePrice: raw.piecePrice ?? raw.PiecePrice ?? undefined,
    availableColors: Array.isArray(raw.availableColors ?? raw.Colors)
      ? (raw.availableColors ?? raw.Colors).map((c: any) => ({
          name: c.name ?? c.ColorName ?? c.colorName ?? "",
          hex: c.hex ?? c.HexCode ?? c.hexCode ?? "#888888",
        }))
      : [],
    availableSizes: Array.isArray(raw.availableSizes ?? raw.Sizes)
      ? (raw.availableSizes ?? raw.Sizes).map((s: any) => (typeof s === "string" ? s : s.name ?? s.SizeName ?? ""))
      : [],
  };
}

function mapProduct(raw: any): SSProduct {
  return {
    sku: raw.sku ?? raw.SKU ?? raw.Sku ?? "",
    brandName: raw.brandName ?? raw.BrandName ?? "",
    styleName: raw.styleName ?? raw.StyleName ?? "",
    title: raw.title ?? raw.Title ?? `${raw.styleName ?? ""} ${raw.colorName ?? ""}`.trim(),
    colorName: raw.colorName ?? raw.ColorName ?? "",
    sizeName: raw.sizeName ?? raw.SizeName ?? "",
    customerPrice: raw.customerPrice ?? raw.CustomerPrice ?? 0,
    piecePrice: raw.piecePrice ?? raw.PiecePrice ?? 0,
    dozenPrice: raw.dozenPrice ?? raw.DozenPrice ?? 0,
    casePrice: raw.casePrice ?? raw.CasePrice ?? 0,
    imageUrl: raw.colorFrontImage ?? raw.ColorFrontImage ?? raw.styleImage ?? null,
  };
}

// --- Reliable placeholder images (fallback if API fails) ---

function placeholdImg(label: string, bg = "e2e8f0", fg = "475569"): string {
  const encoded = encodeURIComponent(label.replace(/ /g, "+"));
  return `https://placehold.co/400x400/${bg}/${fg}?text=${encoded}`;
}

// --- Fallback mock catalog (used when edge function is unavailable) ---

const FALLBACK_CATALOG: SSStyle[] = [
  {
    styleID: 1, title: "Premium Heavyweight Tee", description: "6.1 oz ringspun cotton",
    brandName: "Brand-Shop Basics", baseCategory: "T-Shirts",
    styleImage: placeholdImg("Heavyweight\\nTee", "f1f5f9", "334155"),
    customerPrice: 8.50, piecePrice: 12.99,
    availableColors: [{ name: "White", hex: "#FFFFFF" }, { name: "Black", hex: "#1a1a1a" }, { name: "Navy", hex: "#1B2A4A" }, { name: "Heather Grey", hex: "#B0B0B0" }],
    availableSizes: ["S", "M", "L", "XL", "2XL"],
  },
  {
    styleID: 2, title: "Performance Polo", description: "Moisture-wicking polyester",
    brandName: "Brand-Shop Performance", baseCategory: "Polos",
    styleImage: placeholdImg("Performance\\nPolo", "dbeafe", "1e40af"),
    customerPrice: 14.00, piecePrice: 22.99,
    availableColors: [{ name: "White", hex: "#FFFFFF" }, { name: "Black", hex: "#1a1a1a" }, { name: "Royal Blue", hex: "#2E5EAA" }],
    availableSizes: ["S", "M", "L", "XL", "2XL", "3XL"],
  },
  {
    styleID: 3, title: "Classic Pullover Hoodie", description: "8 oz fleece blend",
    brandName: "Brand-Shop Basics", baseCategory: "Hoodies & Sweatshirts",
    styleImage: placeholdImg("Pullover\\nHoodie", "e2e8f0", "1e293b"),
    customerPrice: 16.50, piecePrice: 28.99,
    availableColors: [{ name: "Black", hex: "#1a1a1a" }, { name: "Charcoal", hex: "#36454F" }, { name: "Navy", hex: "#1B2A4A" }, { name: "Forest Green", hex: "#228B22" }],
    availableSizes: ["S", "M", "L", "XL", "2XL"],
  },
  {
    styleID: 4, title: "Snapback Trucker Cap", description: "Structured 6-panel",
    brandName: "Brand-Shop Headwear", baseCategory: "Caps & Hats",
    styleImage: placeholdImg("Trucker\\nCap", "fef3c7", "92400e"),
    customerPrice: 6.00, piecePrice: 14.99,
    availableColors: [{ name: "Black", hex: "#1a1a1a" }, { name: "White", hex: "#FFFFFF" }, { name: "Red", hex: "#DC2626" }, { name: "Navy", hex: "#1B2A4A" }],
    availableSizes: ["One Size"],
  },
  {
    styleID: 5, title: "Quarter-Zip Pullover", description: "Lightweight performance fleece",
    brandName: "Brand-Shop Performance", baseCategory: "Outerwear",
    styleImage: placeholdImg("Quarter-Zip\\nPullover", "ddd6fe", "5b21b6"),
    customerPrice: 18.00, piecePrice: 32.99,
    availableColors: [{ name: "Black", hex: "#1a1a1a" }, { name: "Navy", hex: "#1B2A4A" }, { name: "Grey", hex: "#808080" }],
    availableSizes: ["S", "M", "L", "XL", "2XL"],
  },
  {
    styleID: 6, title: "Unisex Tank Top", description: "4.2 oz jersey knit",
    brandName: "Brand-Shop Basics", baseCategory: "T-Shirts",
    styleImage: placeholdImg("Tank\\nTop", "fce7f3", "9d174d"),
    customerPrice: 5.50, piecePrice: 9.99,
    availableColors: [{ name: "White", hex: "#FFFFFF" }, { name: "Black", hex: "#1a1a1a" }, { name: "Heather Grey", hex: "#B0B0B0" }],
    availableSizes: ["S", "M", "L", "XL"],
  },
];

// --- Public API (tries live, falls back to mock) ---

export async function searchStyles(query: string): Promise<SSStyle[]> {
  try {
    const data = await callCatalog({ action: "styles", keyword: query, perPage: "50" });
    if (Array.isArray(data) && data.length > 0) {
      return data.map(mapStyle);
    }
  } catch (e) {
    console.warn("SS catalog search failed, using fallback:", e);
  }
  // Fallback: filter mock data
  const lower = query.toLowerCase();
  return FALLBACK_CATALOG.filter(
    (s) =>
      s.title.toLowerCase().includes(lower) ||
      s.baseCategory.toLowerCase().includes(lower) ||
      s.description.toLowerCase().includes(lower)
  );
}

export async function getAllStyles(): Promise<SSStyle[]> {
  try {
    const data = await callCatalog({ action: "styles", perPage: "50" });
    if (Array.isArray(data) && data.length > 0) {
      return data.map(mapStyle);
    }
  } catch (e) {
    console.warn("SS catalog getAllStyles failed, using fallback:", e);
  }
  return [...FALLBACK_CATALOG];
}

export function getStyleById(styleID: number): SSStyle | undefined {
  // Synchronous fallback — for async use fetchStyleById
  return FALLBACK_CATALOG.find((s) => s.styleID === styleID);
}

export async function fetchStyleById(styleID: number): Promise<SSStyle | undefined> {
  try {
    const data = await callCatalog({ action: "style", styleID: String(styleID) });
    if (data && (data.styleID || data.StyleID)) {
      return mapStyle(data);
    }
  } catch (e) {
    console.warn("SS catalog fetchStyleById failed, using fallback:", e);
  }
  return FALLBACK_CATALOG.find((s) => s.styleID === styleID);
}

export async function getProductsByStyle(styleIds: (string | number)[]): Promise<SSProduct[]> {
  if (styleIds.length === 0) return [];
  try {
    const data = await callCatalog({ action: "products", styleIDs: styleIds.join(",") });
    if (Array.isArray(data) && data.length > 0) {
      return data.map(mapProduct);
    }
  } catch (e) {
    console.warn("SS catalog getProductsByStyle failed:", e);
  }
  return [];
}

// --- Vertical → search keywords ---

const verticalKeywords: Record<string, string[]> = {
  sports: ["tee", "polo", "hoodie", "cap", "shorts", "sweatshirt", "jogger", "quarter-zip", "tank", "jacket", "performance"],
  corporate: ["polo", "jacket", "quarter-zip", "sweatshirt", "tee", "tote", "hat", "pullover", "softshell", "crewneck"],
  schools: ["tee", "hoodie", "cap", "polo", "sweatshirt", "shorts", "jogger", "hat", "tank", "pullover"],
  events: ["tee", "hoodie", "cap", "tank", "tote", "hat", "shorts", "sweatshirt", "jogger", "snapback"],
  fashion: ["tee", "hoodie", "jogger", "snapback", "sweatshirt", "jacket", "hat", "shorts", "tank", "pullover"],
  other: ["tee", "hoodie", "cap", "polo", "sweatshirt", "shorts", "tote", "hat", "jogger", "jacket"],
};

export function getSearchQueriesForVertical(vertical: string): string[] {
  return verticalKeywords[vertical] || verticalKeywords.other;
}

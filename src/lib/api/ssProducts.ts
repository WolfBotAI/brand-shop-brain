/**
 * Catalog API — calls the ss-catalog edge function
 * which proxies the S&S Activewear API v2.
 */

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

const SS_CDN = "https://cdni.ssactivewear.com";

/** Convert an S&S relative image path to a public CDN URL */
export function getCdnImageUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("http")) {
    // Fix www domain to CDN
    return path.replace("www.ssactivewear.com", "cdni.ssactivewear.com");
  }
  return `${SS_CDN}/${path.replace(/^\//, "")}`;
}

/** Get a proxied image URL through our edge function (for auth-required images) */
export function getProxiedImageUrl(originalUrl: string | null | undefined): string | null {
  if (!originalUrl) return null;
  if (originalUrl.startsWith("https://placehold.co") || originalUrl.startsWith("data:")) return originalUrl;
  
  // First try CDN URL directly (no proxy needed)
  const cdnUrl = getCdnImageUrl(originalUrl);
  if (cdnUrl) return cdnUrl;
  
  // Fallback to proxy
  const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
  if (!projectId) return originalUrl;
  return `https://${projectId}.supabase.co/functions/v1/ss-catalog?action=image&url=${encodeURIComponent(originalUrl)}`;
}

/** Placeholder gradient image for when product images fail to load */
export function getPlaceholderImage(label: string): string {
  const encoded = encodeURIComponent(label.substring(0, 20).replace(/ /g, "+"));
  return `https://placehold.co/400x400/1a1a2e/e2e8f0?text=${encoded}`;
}

// --- Edge function caller ---

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

// --- Map S&S API response to our interfaces ---

function mapStyle(raw: any): SSStyle {
  // The /styles endpoint does NOT return colors, sizes, or pricing
  // Those come from /products endpoint via fetchStyleDetail()
  const styleImage = raw.styleImage ?? raw.StyleImage ?? raw.mainImage ?? null;
  
  return {
    styleID: raw.styleID ?? raw.StyleID ?? raw.id ?? 0,
    title: raw.title ?? raw.Title ?? raw.styleName ?? "",
    description: raw.description ?? raw.Description ?? "",
    brandName: raw.brandName ?? raw.BrandName ?? raw.brand ?? "",
    baseCategory: raw.baseCategory ?? raw.BaseCategory ?? raw.category ?? "",
    styleImage: getCdnImageUrl(styleImage),
    customerPrice: undefined, // Not available from /styles
    piecePrice: undefined,    // Not available from /styles
    availableColors: [],      // Not available from /styles
    availableSizes: [],       // Not available from /styles
  };
}

// --- Fallback mock catalog (used when edge function is unavailable) ---

const FALLBACK_CATALOG: SSStyle[] = [
  {
    styleID: 1, title: "Premium Heavyweight Tee", description: "6.1 oz ringspun cotton",
    brandName: "Brand-Shop Basics", baseCategory: "T-Shirts",
    styleImage: null,
    customerPrice: 8.50, piecePrice: 12.99,
    availableColors: [{ name: "White", hex: "#FFFFFF" }, { name: "Black", hex: "#1a1a1a" }, { name: "Navy", hex: "#1B2A4A" }, { name: "Heather Grey", hex: "#B0B0B0" }, { name: "Red", hex: "#DC2626" }, { name: "Royal Blue", hex: "#2E5EAA" }],
    availableSizes: ["S", "M", "L", "XL", "2XL", "3XL"],
  },
  {
    styleID: 2, title: "Performance Polo", description: "Moisture-wicking polyester blend",
    brandName: "Brand-Shop Performance", baseCategory: "Polos",
    styleImage: null,
    customerPrice: 14.00, piecePrice: 22.99,
    availableColors: [{ name: "White", hex: "#FFFFFF" }, { name: "Black", hex: "#1a1a1a" }, { name: "Royal Blue", hex: "#2E5EAA" }, { name: "Red", hex: "#DC2626" }],
    availableSizes: ["S", "M", "L", "XL", "2XL", "3XL"],
  },
  {
    styleID: 3, title: "Classic Pullover Hoodie", description: "8 oz fleece blend, double-lined hood",
    brandName: "Brand-Shop Basics", baseCategory: "Hoodies & Sweatshirts",
    styleImage: null,
    customerPrice: 16.50, piecePrice: 28.99,
    availableColors: [{ name: "Black", hex: "#1a1a1a" }, { name: "Charcoal", hex: "#36454F" }, { name: "Navy", hex: "#1B2A4A" }, { name: "Forest Green", hex: "#228B22" }, { name: "Maroon", hex: "#800000" }],
    availableSizes: ["S", "M", "L", "XL", "2XL"],
  },
  {
    styleID: 4, title: "Snapback Trucker Cap", description: "Structured 6-panel, mesh back",
    brandName: "Brand-Shop Headwear", baseCategory: "Caps & Hats",
    styleImage: null,
    customerPrice: 6.00, piecePrice: 14.99,
    availableColors: [{ name: "Black", hex: "#1a1a1a" }, { name: "White", hex: "#FFFFFF" }, { name: "Red", hex: "#DC2626" }, { name: "Navy", hex: "#1B2A4A" }, { name: "Charcoal", hex: "#36454F" }],
    availableSizes: ["One Size"],
  },
  {
    styleID: 5, title: "Quarter-Zip Pullover", description: "Lightweight performance fleece",
    brandName: "Brand-Shop Performance", baseCategory: "Outerwear",
    styleImage: null,
    customerPrice: 18.00, piecePrice: 32.99,
    availableColors: [{ name: "Black", hex: "#1a1a1a" }, { name: "Navy", hex: "#1B2A4A" }, { name: "Grey", hex: "#808080" }, { name: "True Royal", hex: "#2E5EAA" }],
    availableSizes: ["S", "M", "L", "XL", "2XL"],
  },
  {
    styleID: 6, title: "Unisex Tank Top", description: "4.2 oz jersey knit",
    brandName: "Brand-Shop Basics", baseCategory: "T-Shirts",
    styleImage: null,
    customerPrice: 5.50, piecePrice: 9.99,
    availableColors: [{ name: "White", hex: "#FFFFFF" }, { name: "Black", hex: "#1a1a1a" }, { name: "Heather Grey", hex: "#B0B0B0" }, { name: "Navy", hex: "#1B2A4A" }],
    availableSizes: ["S", "M", "L", "XL"],
  },
  {
    styleID: 7, title: "Crewneck Sweatshirt", description: "7.8 oz 50/50 fleece blend",
    brandName: "Brand-Shop Basics", baseCategory: "Hoodies & Sweatshirts",
    styleImage: null,
    customerPrice: 12.00, piecePrice: 21.99,
    availableColors: [{ name: "Black", hex: "#1a1a1a" }, { name: "Navy", hex: "#1B2A4A" }, { name: "Ash Grey", hex: "#B2BEB5" }, { name: "Sport Grey", hex: "#97999B" }, { name: "Maroon", hex: "#800000" }],
    availableSizes: ["S", "M", "L", "XL", "2XL"],
  },
  {
    styleID: 8, title: "Softshell Jacket", description: "Wind and water resistant, 3-layer bonded",
    brandName: "Brand-Shop Performance", baseCategory: "Outerwear",
    styleImage: null,
    customerPrice: 28.00, piecePrice: 49.99,
    availableColors: [{ name: "Black", hex: "#1a1a1a" }, { name: "Navy", hex: "#1B2A4A" }, { name: "Battleship Grey", hex: "#6B6B6B" }],
    availableSizes: ["S", "M", "L", "XL", "2XL", "3XL"],
  },
  {
    styleID: 9, title: "Jogger Pants", description: "French terry fleece, tapered leg",
    brandName: "Brand-Shop Basics", baseCategory: "Pants & Shorts",
    styleImage: null,
    customerPrice: 14.00, piecePrice: 24.99,
    availableColors: [{ name: "Black", hex: "#1a1a1a" }, { name: "Navy", hex: "#1B2A4A" }, { name: "Charcoal", hex: "#36454F" }, { name: "Heather Grey", hex: "#B0B0B0" }],
    availableSizes: ["S", "M", "L", "XL", "2XL"],
  },
  {
    styleID: 10, title: "V-Neck Performance Tee", description: "4.5 oz moisture-wicking polyester",
    brandName: "Brand-Shop Performance", baseCategory: "T-Shirts",
    styleImage: null,
    customerPrice: 7.50, piecePrice: 13.99,
    availableColors: [{ name: "White", hex: "#FFFFFF" }, { name: "Black", hex: "#1a1a1a" }, { name: "True Royal", hex: "#2E5EAA" }, { name: "Iron Grey", hex: "#48494B" }],
    availableSizes: ["S", "M", "L", "XL", "2XL"],
  },
  {
    styleID: 11, title: "Classic Dad Cap", description: "Unstructured low-profile, adjustable strap",
    brandName: "Brand-Shop Headwear", baseCategory: "Caps & Hats",
    styleImage: null,
    customerPrice: 5.50, piecePrice: 12.99,
    availableColors: [{ name: "Black", hex: "#1a1a1a" }, { name: "White", hex: "#FFFFFF" }, { name: "Navy", hex: "#1B2A4A" }, { name: "Khaki", hex: "#C3B091" }, { name: "Stone", hex: "#928E85" }],
    availableSizes: ["One Size"],
  },
  {
    styleID: 12, title: "Canvas Tote Bag", description: "12 oz heavyweight cotton canvas",
    brandName: "Brand-Shop Accessories", baseCategory: "Bags & Accessories",
    styleImage: null,
    customerPrice: 4.00, piecePrice: 8.99,
    availableColors: [{ name: "Natural", hex: "#F5F0E1" }, { name: "Black", hex: "#1a1a1a" }, { name: "Navy", hex: "#1B2A4A" }, { name: "Red", hex: "#DC2626" }],
    availableSizes: ["One Size"],
  },
  {
    styleID: 13, title: "Zip-Up Hoodie", description: "8 oz 50/50 fleece, full zip front",
    brandName: "Brand-Shop Basics", baseCategory: "Hoodies & Sweatshirts",
    styleImage: null,
    customerPrice: 18.00, piecePrice: 31.99,
    availableColors: [{ name: "Black", hex: "#1a1a1a" }, { name: "Navy", hex: "#1B2A4A" }, { name: "Dark Heather", hex: "#3F3F3F" }, { name: "Red", hex: "#DC2626" }],
    availableSizes: ["S", "M", "L", "XL", "2XL"],
  },
  {
    styleID: 14, title: "Athletic Shorts", description: '100% polyester mesh, 9" inseam',
    brandName: "Brand-Shop Performance", baseCategory: "Pants & Shorts",
    styleImage: null,
    customerPrice: 8.00, piecePrice: 15.99,
    availableColors: [{ name: "Black", hex: "#1a1a1a" }, { name: "Navy", hex: "#1B2A4A" }, { name: "True Royal", hex: "#2E5EAA" }, { name: "Red", hex: "#DC2626" }, { name: "Silver", hex: "#C0C0C0" }],
    availableSizes: ["S", "M", "L", "XL", "2XL"],
  },
  {
    styleID: 15, title: "Ladies Fitted V-Neck", description: "4.3 oz fine jersey, contoured fit",
    brandName: "Brand-Shop Basics", baseCategory: "T-Shirts",
    styleImage: null,
    customerPrice: 6.50, piecePrice: 11.99,
    availableColors: [{ name: "White", hex: "#FFFFFF" }, { name: "Black", hex: "#1a1a1a" }, { name: "Heather Grey", hex: "#B0B0B0" }, { name: "Navy", hex: "#1B2A4A" }, { name: "Hot Pink", hex: "#FF69B4" }],
    availableSizes: ["S", "M", "L", "XL", "2XL"],
  },
];

// --- Public API ---

export interface FetchStylesPageResult {
  styles: SSStyle[];
  hasMore: boolean;
  isFallback: boolean;
}

export async function fetchStylesPage(
  page: number = 1,
  perPage: number = 100,
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
        styles: data.map(mapStyle),
        hasMore: data.length >= perPage,
        isFallback: false,
      };
    }
    return { styles: [], hasMore: false, isFallback: false };
  } catch (e) {
    console.warn("SS catalog fetchStylesPage failed, using fallback:", e);
    if (page > 1) return { styles: [], hasMore: false, isFallback: true };
    let filtered = [...FALLBACK_CATALOG];
    if (filters?.keyword) {
      const lower = filters.keyword.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.title.toLowerCase().includes(lower) ||
          s.baseCategory.toLowerCase().includes(lower) ||
          s.description.toLowerCase().includes(lower)
      );
    }
    if (filters?.category) {
      filtered = filtered.filter((s) => s.baseCategory === filters.category);
    }
    return { styles: filtered, hasMore: false, isFallback: true };
  }
}

/** Fetch detailed product data (colors, sizes, pricing) for a specific style */
export async function fetchStyleDetail(styleID: number): Promise<StyleDetailResult | null> {
  try {
    const data = await callCatalog({ action: "styleDetail", styleID: String(styleID) });
    return data as StyleDetailResult;
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
    const data = await callCatalog({ action: "categories" });
    if (Array.isArray(data)) {
      return data.map((c: any) => c.name ?? c.Name ?? c.categoryName ?? String(c));
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
        imageUrl: getCdnImageUrl(raw.colorFrontImage ?? raw.ColorFrontImage ?? raw.styleImage ?? null),
      }));
    }
  } catch (e) {
    console.warn("SS catalog getProductsByStyle failed:", e);
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

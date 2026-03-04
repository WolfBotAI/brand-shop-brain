/**
 * Catalog API — frontend layer
 * Routes through the Brand-Shop.AI Codex engine (api.brand-shop.ai)
 * which already has SS Activewear + Printful fully connected.
 */

// import { apiClient } from "./client";

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

// --- Mock catalog data (until real Codex endpoints are confirmed) ---

const mockCatalog: SSStyle[] = [
  { styleID: 1, title: "Premium Heavyweight Tee", description: "6.1 oz ringspun cotton", brandName: "Brand-Shop Basics", baseCategory: "T-Shirts", styleImage: null, customerPrice: 8.50, piecePrice: 12.99 },
  { styleID: 2, title: "Performance Polo", description: "Moisture-wicking polyester", brandName: "Brand-Shop Performance", baseCategory: "Polos", styleImage: null, customerPrice: 14.00, piecePrice: 22.99 },
  { styleID: 3, title: "Classic Pullover Hoodie", description: "8 oz fleece blend", brandName: "Brand-Shop Basics", baseCategory: "Hoodies & Sweatshirts", styleImage: null, customerPrice: 16.50, piecePrice: 28.99 },
  { styleID: 4, title: "Snapback Trucker Cap", description: "Structured 6-panel", brandName: "Brand-Shop Headwear", baseCategory: "Caps & Hats", styleImage: null, customerPrice: 6.00, piecePrice: 14.99 },
  { styleID: 5, title: "Quarter-Zip Pullover", description: "Lightweight performance fleece", brandName: "Brand-Shop Performance", baseCategory: "Outerwear", styleImage: null, customerPrice: 18.00, piecePrice: 32.99 },
  { styleID: 6, title: "Unisex Tank Top", description: "4.2 oz jersey knit", brandName: "Brand-Shop Basics", baseCategory: "T-Shirts", styleImage: null, customerPrice: 5.50, piecePrice: 9.99 },
  { styleID: 7, title: "Athletic Shorts", description: "Moisture-wicking with liner", brandName: "Brand-Shop Performance", baseCategory: "Shorts", styleImage: null, customerPrice: 10.00, piecePrice: 18.99 },
  { styleID: 8, title: "Crewneck Sweatshirt", description: "7.8 oz pill-resistant fleece", brandName: "Brand-Shop Basics", baseCategory: "Hoodies & Sweatshirts", styleImage: null, customerPrice: 14.00, piecePrice: 24.99 },
  { styleID: 9, title: "Softshell Jacket", description: "3-layer bonded shell", brandName: "Brand-Shop Outerwear", baseCategory: "Outerwear", styleImage: null, customerPrice: 28.00, piecePrice: 49.99 },
  { styleID: 10, title: "Canvas Tote Bag", description: "12 oz heavy canvas", brandName: "Brand-Shop Accessories", baseCategory: "Accessories", styleImage: null, customerPrice: 4.00, piecePrice: 8.99 },
  { styleID: 11, title: "Dad Hat", description: "Unstructured low-profile", brandName: "Brand-Shop Headwear", baseCategory: "Caps & Hats", styleImage: null, customerPrice: 5.00, piecePrice: 12.99 },
  { styleID: 12, title: "Jogger Pants", description: "French terry with elastic cuffs", brandName: "Brand-Shop Performance", baseCategory: "Pants", styleImage: null, customerPrice: 16.00, piecePrice: 29.99 },
];

export async function searchStyles(query: string): Promise<SSStyle[]> {
  // TODO: Replace with real apiClient call once Codex endpoints are confirmed
  // return apiClient<SSStyle[]>("/api/catalog/styles", { params: { search: query } });
  await new Promise((r) => setTimeout(r, 400 + Math.random() * 300));
  const lower = query.toLowerCase();
  return mockCatalog.filter(
    (s) =>
      s.title.toLowerCase().includes(lower) ||
      s.baseCategory.toLowerCase().includes(lower) ||
      s.description.toLowerCase().includes(lower)
  );
}

export async function getProductsByStyle(styleIds: (string | number)[]): Promise<SSProduct[]> {
  // TODO: Replace with real apiClient call once Codex endpoints are confirmed
  await new Promise((r) => setTimeout(r, 300));
  return [];
}

// --- Vertical → search keywords ---

const verticalKeywords: Record<string, string[]> = {
  sports: ["performance tee", "athletic short", "hoodie", "cap", "polo"],
  corporate: ["polo", "oxford shirt", "jacket", "quarter zip pullover"],
  schools: ["t-shirt", "hoodie", "varsity jacket", "cap", "polo"],
  events: ["t-shirt", "hoodie", "trucker hat", "tank top", "tote bag"],
  fashion: ["heavyweight tee", "oversized hoodie", "jogger", "snapback", "crewneck sweatshirt"],
  other: ["t-shirt", "hoodie", "cap", "polo"],
};

export function getSearchQueriesForVertical(vertical: string): string[] {
  return verticalKeywords[vertical] || verticalKeywords.other;
}

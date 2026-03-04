/**
 * Catalog API — frontend layer
 * Routes through the Brand-Shop.AI Codex engine (api.brand-shop.ai)
 * which already has SS Activewear + Printful fully connected.
 */

import { apiClient } from "./client";

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

// --- API calls (routed through Codex engine) ---

export async function searchStyles(query: string): Promise<SSStyle[]> {
  return apiClient<SSStyle[]>("/api/catalog/styles", {
    params: { search: query },
  });
}

export async function getProductsByStyle(styleIds: (string | number)[]): Promise<SSProduct[]> {
  return apiClient<SSProduct[]>("/api/catalog/products", {
    params: { styleIds: styleIds.map(String).join(",") },
  });
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

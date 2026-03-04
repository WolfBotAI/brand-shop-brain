/**
 * SS Activewear API — frontend layer
 * Calls the ss-products edge function which proxies to the SS API with Basic Auth.
 */

const SUPABASE_PROJECT_ID = import.meta.env.VITE_SUPABASE_PROJECT_ID;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

function edgeFunctionUrl(): string {
  return `https://${SUPABASE_PROJECT_ID}.supabase.co/functions/v1/ss-products`;
}

async function callEdge<T>(body: Record<string, unknown>): Promise<T> {
  const res = await fetch(edgeFunctionUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY ?? "",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`SS products edge error ${res.status}: ${text}`);
  }
  return res.json();
}

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

// --- API calls ---

export async function searchStyles(query: string): Promise<SSStyle[]> {
  return callEdge<SSStyle[]>({ search: query });
}

export async function getProductsByStyle(styleIds: (string | number)[]): Promise<SSProduct[]> {
  return callEdge<SSProduct[]>({ styleIds: styleIds.map(String) });
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

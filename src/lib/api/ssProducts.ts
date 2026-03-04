/**
 * Catalog API — frontend layer
 * Routes through the Brand-Shop.AI Codex engine (api.brand-shop.ai)
 * which already has SS Activewear + Printful fully connected.
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

// --- Mock catalog data ---

const mockCatalog: SSStyle[] = [
  {
    styleID: 1, title: "Premium Heavyweight Tee", description: "6.1 oz ringspun cotton",
    brandName: "Brand-Shop Basics", baseCategory: "T-Shirts",
    styleImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    customerPrice: 8.50, piecePrice: 12.99,
    availableColors: [{ name: "White", hex: "#FFFFFF" }, { name: "Black", hex: "#1a1a1a" }, { name: "Navy", hex: "#1B2A4A" }, { name: "Heather Grey", hex: "#B0B0B0" }],
    availableSizes: ["S", "M", "L", "XL", "2XL"],
  },
  {
    styleID: 2, title: "Performance Polo", description: "Moisture-wicking polyester",
    brandName: "Brand-Shop Performance", baseCategory: "Polos",
    styleImage: "https://images.unsplash.com/photo-1625910513413-5fc48c5be7cf?w=400&h=400&fit=crop",
    customerPrice: 14.00, piecePrice: 22.99,
    availableColors: [{ name: "White", hex: "#FFFFFF" }, { name: "Black", hex: "#1a1a1a" }, { name: "Royal Blue", hex: "#2E5EAA" }],
    availableSizes: ["S", "M", "L", "XL", "2XL", "3XL"],
  },
  {
    styleID: 3, title: "Classic Pullover Hoodie", description: "8 oz fleece blend",
    brandName: "Brand-Shop Basics", baseCategory: "Hoodies & Sweatshirts",
    styleImage: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop",
    customerPrice: 16.50, piecePrice: 28.99,
    availableColors: [{ name: "Black", hex: "#1a1a1a" }, { name: "Charcoal", hex: "#36454F" }, { name: "Navy", hex: "#1B2A4A" }, { name: "Forest Green", hex: "#228B22" }],
    availableSizes: ["S", "M", "L", "XL", "2XL"],
  },
  {
    styleID: 4, title: "Snapback Trucker Cap", description: "Structured 6-panel",
    brandName: "Brand-Shop Headwear", baseCategory: "Caps & Hats",
    styleImage: "https://images.unsplash.com/photo-1588850561407-ed78c334e67a?w=400&h=400&fit=crop",
    customerPrice: 6.00, piecePrice: 14.99,
    availableColors: [{ name: "Black", hex: "#1a1a1a" }, { name: "White", hex: "#FFFFFF" }, { name: "Red", hex: "#DC2626" }, { name: "Navy", hex: "#1B2A4A" }],
    availableSizes: ["One Size"],
  },
  {
    styleID: 5, title: "Quarter-Zip Pullover", description: "Lightweight performance fleece",
    brandName: "Brand-Shop Performance", baseCategory: "Outerwear",
    styleImage: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop",
    customerPrice: 18.00, piecePrice: 32.99,
    availableColors: [{ name: "Black", hex: "#1a1a1a" }, { name: "Navy", hex: "#1B2A4A" }, { name: "Grey", hex: "#808080" }],
    availableSizes: ["S", "M", "L", "XL", "2XL"],
  },
  {
    styleID: 6, title: "Unisex Tank Top", description: "4.2 oz jersey knit",
    brandName: "Brand-Shop Basics", baseCategory: "T-Shirts",
    styleImage: "https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=400&h=400&fit=crop",
    customerPrice: 5.50, piecePrice: 9.99,
    availableColors: [{ name: "White", hex: "#FFFFFF" }, { name: "Black", hex: "#1a1a1a" }, { name: "Heather Grey", hex: "#B0B0B0" }],
    availableSizes: ["S", "M", "L", "XL"],
  },
  {
    styleID: 7, title: "Athletic Shorts", description: "Moisture-wicking with liner",
    brandName: "Brand-Shop Performance", baseCategory: "Shorts",
    styleImage: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=400&fit=crop",
    customerPrice: 10.00, piecePrice: 18.99,
    availableColors: [{ name: "Black", hex: "#1a1a1a" }, { name: "Navy", hex: "#1B2A4A" }, { name: "Grey", hex: "#808080" }],
    availableSizes: ["S", "M", "L", "XL", "2XL"],
  },
  {
    styleID: 8, title: "Crewneck Sweatshirt", description: "7.8 oz pill-resistant fleece",
    brandName: "Brand-Shop Basics", baseCategory: "Hoodies & Sweatshirts",
    styleImage: "https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=400&h=400&fit=crop",
    customerPrice: 14.00, piecePrice: 24.99,
    availableColors: [{ name: "Black", hex: "#1a1a1a" }, { name: "Heather Grey", hex: "#B0B0B0" }, { name: "Navy", hex: "#1B2A4A" }, { name: "Burgundy", hex: "#800020" }],
    availableSizes: ["S", "M", "L", "XL", "2XL"],
  },
  {
    styleID: 9, title: "Softshell Jacket", description: "3-layer bonded shell",
    brandName: "Brand-Shop Outerwear", baseCategory: "Outerwear",
    styleImage: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop",
    customerPrice: 28.00, piecePrice: 49.99,
    availableColors: [{ name: "Black", hex: "#1a1a1a" }, { name: "Navy", hex: "#1B2A4A" }],
    availableSizes: ["S", "M", "L", "XL", "2XL", "3XL"],
  },
  {
    styleID: 10, title: "Canvas Tote Bag", description: "12 oz heavy canvas",
    brandName: "Brand-Shop Accessories", baseCategory: "Accessories",
    styleImage: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&h=400&fit=crop",
    customerPrice: 4.00, piecePrice: 8.99,
    availableColors: [{ name: "Natural", hex: "#F5F0E1" }, { name: "Black", hex: "#1a1a1a" }],
    availableSizes: ["One Size"],
  },
  {
    styleID: 11, title: "Dad Hat", description: "Unstructured low-profile",
    brandName: "Brand-Shop Headwear", baseCategory: "Caps & Hats",
    styleImage: "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=400&h=400&fit=crop",
    customerPrice: 5.00, piecePrice: 12.99,
    availableColors: [{ name: "Black", hex: "#1a1a1a" }, { name: "Khaki", hex: "#C3B091" }, { name: "Navy", hex: "#1B2A4A" }, { name: "White", hex: "#FFFFFF" }],
    availableSizes: ["One Size"],
  },
  {
    styleID: 12, title: "Jogger Pants", description: "French terry with elastic cuffs",
    brandName: "Brand-Shop Performance", baseCategory: "Pants",
    styleImage: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=400&h=400&fit=crop",
    customerPrice: 16.00, piecePrice: 29.99,
    availableColors: [{ name: "Black", hex: "#1a1a1a" }, { name: "Heather Grey", hex: "#B0B0B0" }, { name: "Navy", hex: "#1B2A4A" }],
    availableSizes: ["S", "M", "L", "XL", "2XL"],
  },
];

export async function searchStyles(query: string): Promise<SSStyle[]> {
  await new Promise((r) => setTimeout(r, 400 + Math.random() * 300));
  const lower = query.toLowerCase();
  return mockCatalog.filter(
    (s) =>
      s.title.toLowerCase().includes(lower) ||
      s.baseCategory.toLowerCase().includes(lower) ||
      s.description.toLowerCase().includes(lower)
  );
}

export async function getAllStyles(): Promise<SSStyle[]> {
  await new Promise((r) => setTimeout(r, 300));
  return [...mockCatalog];
}

export function getStyleById(styleID: number): SSStyle | undefined {
  return mockCatalog.find((s) => s.styleID === styleID);
}

export async function getProductsByStyle(styleIds: (string | number)[]): Promise<SSProduct[]> {
  await new Promise((r) => setTimeout(r, 300));
  return [];
}

// --- Vertical → search keywords ---

const verticalKeywords: Record<string, string[]> = {
  sports: ["performance tee", "athletic short", "hoodie", "cap", "polo"],
  corporate: ["polo", "jacket", "quarter zip pullover"],
  schools: ["t-shirt", "hoodie", "cap", "polo"],
  events: ["t-shirt", "hoodie", "trucker hat", "tank top", "tote bag"],
  fashion: ["heavyweight tee", "hoodie", "jogger", "snapback", "crewneck sweatshirt"],
  other: ["t-shirt", "hoodie", "cap", "polo"],
};

export function getSearchQueriesForVertical(vertical: string): string[] {
  return verticalKeywords[vertical] || verticalKeywords.other;
}

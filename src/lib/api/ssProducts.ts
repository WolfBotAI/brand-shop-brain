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

// --- Reliable placeholder images (placehold.co) ---

function placeholdImg(label: string, bg = "e2e8f0", fg = "475569"): string {
  const encoded = encodeURIComponent(label.replace(/ /g, "+"));
  return `https://placehold.co/400x400/${bg}/${fg}?text=${encoded}`;
}

// --- Mock catalog data ---

const mockCatalog: SSStyle[] = [
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
  {
    styleID: 7, title: "Athletic Shorts", description: "Moisture-wicking with liner",
    brandName: "Brand-Shop Performance", baseCategory: "Shorts",
    styleImage: placeholdImg("Athletic\\nShorts", "d1fae5", "065f46"),
    customerPrice: 10.00, piecePrice: 18.99,
    availableColors: [{ name: "Black", hex: "#1a1a1a" }, { name: "Navy", hex: "#1B2A4A" }, { name: "Grey", hex: "#808080" }],
    availableSizes: ["S", "M", "L", "XL", "2XL"],
  },
  {
    styleID: 8, title: "Crewneck Sweatshirt", description: "7.8 oz pill-resistant fleece",
    brandName: "Brand-Shop Basics", baseCategory: "Hoodies & Sweatshirts",
    styleImage: placeholdImg("Crewneck\\nSweatshirt", "e0e7ff", "3730a3"),
    customerPrice: 14.00, piecePrice: 24.99,
    availableColors: [{ name: "Black", hex: "#1a1a1a" }, { name: "Heather Grey", hex: "#B0B0B0" }, { name: "Navy", hex: "#1B2A4A" }, { name: "Burgundy", hex: "#800020" }],
    availableSizes: ["S", "M", "L", "XL", "2XL"],
  },
  {
    styleID: 9, title: "Softshell Jacket", description: "3-layer bonded shell",
    brandName: "Brand-Shop Outerwear", baseCategory: "Outerwear",
    styleImage: placeholdImg("Softshell\\nJacket", "cffafe", "155e75"),
    customerPrice: 28.00, piecePrice: 49.99,
    availableColors: [{ name: "Black", hex: "#1a1a1a" }, { name: "Navy", hex: "#1B2A4A" }],
    availableSizes: ["S", "M", "L", "XL", "2XL", "3XL"],
  },
  {
    styleID: 10, title: "Canvas Tote Bag", description: "12 oz heavy canvas",
    brandName: "Brand-Shop Accessories", baseCategory: "Accessories",
    styleImage: placeholdImg("Canvas\\nTote", "fef9c3", "854d0e"),
    customerPrice: 4.00, piecePrice: 8.99,
    availableColors: [{ name: "Natural", hex: "#F5F0E1" }, { name: "Black", hex: "#1a1a1a" }],
    availableSizes: ["One Size"],
  },
  {
    styleID: 11, title: "Dad Hat", description: "Unstructured low-profile",
    brandName: "Brand-Shop Headwear", baseCategory: "Caps & Hats",
    styleImage: placeholdImg("Dad\\nHat", "ffe4e6", "9f1239"),
    customerPrice: 5.00, piecePrice: 12.99,
    availableColors: [{ name: "Black", hex: "#1a1a1a" }, { name: "Khaki", hex: "#C3B091" }, { name: "Navy", hex: "#1B2A4A" }, { name: "White", hex: "#FFFFFF" }],
    availableSizes: ["One Size"],
  },
  {
    styleID: 12, title: "Jogger Pants", description: "French terry with elastic cuffs",
    brandName: "Brand-Shop Performance", baseCategory: "Pants",
    styleImage: placeholdImg("Jogger\\nPants", "f3e8ff", "6b21a8"),
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

// --- Vertical → search keywords (expanded for broader matches) ---

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

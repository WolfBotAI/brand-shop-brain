import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight, Search, Loader2, AlertTriangle, Maximize2, X, Check, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { fetchStylesPage, fetchCategories, type SSStyle } from "@/lib/api/ssProducts";
import { ProductImage } from "./ProductImage";
import { ProductDetailModal, type ProductVariantSelection } from "./ProductDetailModal";

export interface CatalogSelection {
  catalogId: string;
  products: SelectedProduct[];
}

export interface SelectedProduct extends SSStyle {
  selectedColors: string[];
  selectedSizes: string[];
  itemMarkup?: number;
}

interface CatalogSetupStepProps {
  onNext: (data: CatalogSelection) => void;
  onBack: () => void;
}

const PARENT_CATEGORIES: Record<string, string[]> = {
  "T-Shirts": ["T-Shirts", "Tee", "Tank", "Jersey", "Short Sleeve"],
  "Polos": ["Polo", "Knit"],
  "Hoodies & Sweatshirts": ["Hoodies", "Sweatshirt", "Fleece", "Pullover", "Crewneck"],
  "Outerwear": ["Jacket", "Outerwear", "Coat", "Vest", "Windbreaker", "Softshell", "Quarter-Zip", "Full-Zip"],
  "Caps & Hats": ["Cap", "Hat", "Beanie", "Visor", "Headwear", "Trucker"],
  "Pants & Shorts": ["Pant", "Short", "Jogger", "Sweatpant"],
  "Bags & Accessories": ["Bag", "Tote", "Backpack", "Accessori", "Towel", "Blanket", "Apron"],
  "Dress Shirts": ["Dress Shirt", "Woven", "Oxford", "Button"],
  "Performance": ["Performance", "Athletic", "Moisture", "Dri-Fit", "Sport"],
  "Youth": ["Youth", "Kid", "Infant", "Toddler"],
  "Ladies": ["Ladies", "Women"],
};

function groupCategory(rawCat: string): string {
  const lower = rawCat.toLowerCase();
  for (const [parent, keywords] of Object.entries(PARENT_CATEGORIES)) {
    if (keywords.some((kw) => lower.includes(kw.toLowerCase()))) return parent;
  }
  return "Other";
}

export const CatalogSetupStep = ({ onNext, onBack }: CatalogSetupStepProps) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [products, setProducts] = useState<SSStyle[]>([]);
  const [selected, setSelected] = useState<Map<number, SelectedProduct>>(new Map());
  const [categories, setCategories] = useState<string[]>([]);
  const [groupedCategories, setGroupedCategories] = useState<string[]>([]);
  const [isFallback, setIsFallback] = useState(false);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchTimeout, setSearchTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  const [saving, setSaving] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [detailProduct, setDetailProduct] = useState<SSStyle | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fullscreenScrollRef = useRef<HTMLDivElement>(null);

  const PER_PAGE = 100;

  useEffect(() => {
    fetchCategories().then((cats) => {
      setCategories(cats);
      const groups = Array.from(new Set(cats.map(groupCategory))).sort();
      setGroupedCategories(groups);
    });
  }, []);

  const getFilterCategory = useCallback(() => {
    if (!activeCategory) return undefined;
    if (categories.includes(activeCategory)) return activeCategory;
    const keywords = PARENT_CATEGORIES[activeCategory];
    if (keywords) return keywords[0];
    return activeCategory;
  }, [activeCategory, categories]);

  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    setLoading(true);
    loadPage(1, true);
  }, [searchQuery, activeCategory]);

  const loadPage = useCallback(async (pageNum: number, reset: boolean) => {
    try {
      const filterCat = getFilterCategory();
      const result = await fetchStylesPage(pageNum, PER_PAGE, {
        keyword: searchQuery || filterCat || undefined,
        category: undefined,
      });
      setProducts((prev) => reset ? result.styles : [...prev, ...result.styles]);
      setHasMore(result.hasMore);
      setIsFallback(result.isFallback);
      setPage(pageNum);
    } catch {
      toast({ title: "Error", description: "Failed to load catalog", variant: "destructive" });
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [searchQuery, activeCategory, toast, getFilterCategory]);

  const handleScroll = useCallback((el: HTMLDivElement | null) => {
    if (!el || loadingMore || !hasMore) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 200) {
      setLoadingMore(true);
      loadPage(page + 1, false);
    }
  }, [loadingMore, hasMore, page, loadPage]);

  const handleSearchChange = (value: string) => {
    if (searchTimeout) clearTimeout(searchTimeout);
    const timeout = setTimeout(() => setSearchQuery(value), 400);
    setSearchTimeout(timeout);
  };

  const toggleProduct = (product: SSStyle) => {
    setSelected((prev) => {
      const next = new Map(prev);
      if (next.has(product.styleID)) {
        next.delete(product.styleID);
      } else {
        next.set(product.styleID, {
          ...product,
          selectedColors: product.availableColors.map((c) => c.name),
          selectedSizes: [...product.availableSizes],
        });
      }
      return next;
    });
  };

  const handleVariantChange = (styleID: number, selection: ProductVariantSelection) => {
    setSelected((prev) => {
      const next = new Map(prev);
      const item = next.get(styleID);
      if (!item) return prev;
      next.set(styleID, {
        ...item,
        selectedColors: selection.colors,
        selectedSizes: selection.sizes,
        itemMarkup: selection.itemMarkup,
      });
      return next;
    });
  };

  const handleDetailToggle = (styleID: number) => {
    const product = products.find((p) => p.styleID === styleID) || detailProduct;
    if (product) toggleProduct(product);
  };

  const selectAllVisible = () => {
    const map = new Map(selected);
    for (const p of products) {
      if (!map.has(p.styleID)) {
        map.set(p.styleID, {
          ...p,
          selectedColors: p.availableColors.map((c) => c.name),
          selectedSizes: [...p.availableSizes],
        });
      }
    }
    setSelected(map);
  };

  const selectNone = () => setSelected(new Map());

  const handleNext = async () => {
    if (selected.size === 0) return;
    setSaving(true);
    try {
      const selectedProducts = Array.from(selected.values());
      let catalogId = "";

      if (user) {
        const { data, error } = await supabase
          .from("distributor_catalogs")
          .insert({
            user_id: user.id,
            catalog_name: "My Catalog",
            selected_products: selectedProducts.map((p) => ({
              styleID: p.styleID,
              title: p.title,
              description: p.description,
              brandName: p.brandName,
              baseCategory: p.baseCategory,
              styleImage: p.styleImage,
              customerPrice: p.customerPrice,
              piecePrice: p.piecePrice,
              selectedColors: p.selectedColors,
              selectedSizes: p.selectedSizes,
              availableColors: p.availableColors,
              availableSizes: p.availableSizes,
              itemMarkup: p.itemMarkup,
            })) as any,
          })
          .select("id")
          .single();

        if (error) throw error;
        catalogId = data.id;
      }

      onNext({ catalogId, products: selectedProducts });
    } catch (err: any) {
      toast({ title: "Error saving catalog", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const searchAndFilters = (
    <div className="space-y-3">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            defaultValue=""
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={activeCategory || "all"} onValueChange={(v) => setActiveCategory(v === "all" ? null : v)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {groupedCategories.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {selected.size} selected · {products.length} loaded{hasMore ? "+" : ""}
        </span>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={selectAllVisible} className="text-xs h-7">Select Visible</Button>
          <Button variant="ghost" size="sm" onClick={selectNone} className="text-xs h-7">Clear</Button>
        </div>
      </div>
    </div>
  );

  const productGrid = (isFullscreen: boolean) => (
    <>
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-lg" />
          ))}
        </div>
      ) : (
        <div
          ref={isFullscreen ? fullscreenScrollRef : scrollRef}
          onScroll={(e) => handleScroll(e.currentTarget)}
          className={`grid gap-3 overflow-y-auto pr-1 ${
            isFullscreen
              ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 max-h-[calc(100vh-220px)]"
              : "grid-cols-2 md:grid-cols-3 max-h-[500px]"
          }`}
        >
          {products.map((product) => (
            <StyleCard
              key={product.styleID}
              product={product}
              isSelected={selected.has(product.styleID)}
              onToggle={() => toggleProduct(product)}
              onViewDetails={() => setDetailProduct(product)}
            />
          ))}

          {loadingMore && (
            <div className="col-span-full flex items-center justify-center py-6">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">Loading more products...</span>
            </div>
          )}

          {!hasMore && products.length > 0 && (
            <div className="col-span-full text-center py-4">
              <span className="text-xs text-muted-foreground">All {products.length} products loaded</span>
            </div>
          )}
        </div>
      )}
    </>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground">Build Your Catalog</h2>
            <p className="text-muted-foreground">Browse and select products. Click "View Details" for colors, sizes & pricing.</p>
          </div>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setFullscreen(true)}>
            <Maximize2 className="w-4 h-4" /> Fullscreen
          </Button>
        </div>
      </div>

      {isFallback && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
          <AlertTriangle className="w-4 h-4 text-destructive shrink-0" />
          <p className="text-xs text-destructive">Showing sample catalog — full catalog unavailable. Please try again later.</p>
        </div>
      )}

      {searchAndFilters}
      {productGrid(false)}

      {/* Fullscreen Catalog Dialog */}
      <Dialog open={fullscreen} onOpenChange={setFullscreen}>
        <DialogContent className="max-w-[95vw] w-full h-[95vh] flex flex-col p-0 gap-0">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div>
              <h2 className="text-lg font-bold text-foreground">Brand-Shop Apparel Catalog</h2>
              <p className="text-sm text-muted-foreground">{selected.size} products selected</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setFullscreen(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="px-6 py-3 border-b border-border">
            {searchAndFilters}
          </div>
          <div className="flex-1 overflow-hidden px-6 py-3">
            {productGrid(true)}
          </div>
          <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/30">
            <span className="text-sm font-medium text-foreground">{selected.size} products selected</span>
            <Button onClick={() => setFullscreen(false)} className="gap-2">
              Done <Check className="w-4 h-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={detailProduct}
        open={!!detailProduct}
        onOpenChange={(open) => !open && setDetailProduct(null)}
        isSelected={detailProduct ? selected.has(detailProduct.styleID) : false}
        onToggleSelect={handleDetailToggle}
        variantSelection={
          detailProduct && selected.has(detailProduct.styleID)
            ? {
                colors: selected.get(detailProduct.styleID)!.selectedColors,
                sizes: selected.get(detailProduct.styleID)!.selectedSizes,
                itemMarkup: selected.get(detailProduct.styleID)!.itemMarkup,
              }
            : undefined
        }
        onVariantChange={handleVariantChange}
      />

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">Back</Button>
        <Button onClick={handleNext} disabled={selected.size === 0 || saving} className="flex-1 gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          Continue with {selected.size} products <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
};

// --- Style Card (simplified — no inline color/size pickers) ---

interface StyleCardProps {
  product: SSStyle;
  isSelected: boolean;
  onToggle: () => void;
  onViewDetails: () => void;
}

const StyleCard = ({ product, isSelected, onToggle, onViewDetails }: StyleCardProps) => {
  return (
    <Card
      className={`border transition-all ${
        isSelected ? "border-primary ring-1 ring-primary/30" : "border-border hover:border-primary/40"
      }`}
    >
      <CardContent className="p-0">
        <div className="relative cursor-pointer" onClick={onViewDetails}>
          <ProductImage
            src={product.styleImage}
            alt={product.title}
            className="w-full aspect-square rounded-t-lg"
          />
          {isSelected && (
            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
              <Check className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
          )}
          <div className="absolute bottom-2 right-2">
            <Button variant="secondary" size="sm" className="h-7 text-xs gap-1 shadow-md" onClick={(e) => { e.stopPropagation(); onViewDetails(); }}>
              <Eye className="w-3 h-3" /> Details
            </Button>
          </div>
        </div>

        <div className="p-3 space-y-2">
          <div className="flex items-start gap-2">
            <Checkbox checked={isSelected} onCheckedChange={onToggle} className="mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">{product.title}</p>
              <p className="text-[10px] text-muted-foreground">{product.brandName}</p>
            </div>
          </div>
          <Badge variant="secondary" className="text-[10px]">{product.baseCategory}</Badge>
        </div>
      </CardContent>
    </Card>
  );
};

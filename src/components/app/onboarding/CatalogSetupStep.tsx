import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight, Search, Loader2, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ChatBubble } from "@/components/features/ChatBubble";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { fetchStylesPage, fetchCategories, type SSStyle } from "@/lib/api/ssProducts";

export interface CatalogSelection {
  catalogId: string;
  products: SelectedProduct[];
}

export interface SelectedProduct extends SSStyle {
  selectedColors: string[];
  selectedSizes: string[];
}

interface CatalogSetupStepProps {
  onNext: (data: CatalogSelection) => void;
  onBack: () => void;
}

export const CatalogSetupStep = ({ onNext, onBack }: CatalogSetupStepProps) => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Catalog data
  const [products, setProducts] = useState<SSStyle[]>([]);
  const [selected, setSelected] = useState<Map<number, SelectedProduct>>(new Map());
  const [categories, setCategories] = useState<string[]>([]);
  const [isFallback, setIsFallback] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchTimeout, setSearchTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  // UI
  const [saving, setSaving] = useState(false);
  const [expandedProduct, setExpandedProduct] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Advanced S&S credentials
  const [ssAccount, setSsAccount] = useState("");
  const [ssApiKey, setSsApiKey] = useState("");

  const PER_PAGE = 100;

  // Load categories once
  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  // Load first page (and reset on filter change)
  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    setLoading(true);
    loadPage(1, true);
  }, [searchQuery, activeCategory]);

  const loadPage = useCallback(async (pageNum: number, reset: boolean) => {
    try {
      const result = await fetchStylesPage(pageNum, PER_PAGE, {
        keyword: searchQuery || undefined,
        category: activeCategory || undefined,
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
  }, [searchQuery, activeCategory, toast]);

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || loadingMore || !hasMore) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 200) {
      setLoadingMore(true);
      loadPage(page + 1, false);
    }
  }, [loadingMore, hasMore, page, loadPage]);

  // Debounced search
  const handleSearchChange = (value: string) => {
    if (searchTimeout) clearTimeout(searchTimeout);
    const timeout = setTimeout(() => setSearchQuery(value), 400);
    setSearchTimeout(timeout);
  };

  // Selection helpers
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

  const toggleColor = (styleID: number, colorName: string) => {
    setSelected((prev) => {
      const next = new Map(prev);
      const item = next.get(styleID);
      if (!item) return prev;
      const colors = item.selectedColors.includes(colorName)
        ? item.selectedColors.filter((c) => c !== colorName)
        : [...item.selectedColors, colorName];
      next.set(styleID, { ...item, selectedColors: colors });
      return next;
    });
  };

  const toggleSize = (styleID: number, size: string) => {
    setSelected((prev) => {
      const next = new Map(prev);
      const item = next.get(styleID);
      if (!item) return prev;
      const sizes = item.selectedSizes.includes(size)
        ? item.selectedSizes.filter((s) => s !== size)
        : [...item.selectedSizes, size];
      next.set(styleID, { ...item, selectedSizes: sizes });
      return next;
    });
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

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Build Your Catalog</h2>
            <p className="text-muted-foreground">Select the products you want to offer your clients</p>
          </div>
        </div>
      </div>

      <ChatBubble
        message="Browse the Brand-Shop Apparel catalog below. Select the items, colors, and sizes you want to make available to your clients. Scroll down to load more products."
        delay={0.2}
      />

      {/* Fallback warning */}
      {isFallback && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
          <AlertTriangle className="w-4 h-4 text-destructive shrink-0" />
          <p className="text-xs text-destructive">Showing sample catalog — full catalog unavailable. Please try again later.</p>
        </div>
      )}

      {/* Advanced: Own S&S Account */}
      <Accordion type="single" collapsible>
        <AccordionItem value="advanced" className="border border-border rounded-lg">
          <AccordionTrigger className="px-4 py-3 text-xs text-muted-foreground hover:no-underline">
            I have my own S&S Activewear account (optional)
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 space-y-3">
            <p className="text-xs text-muted-foreground">Connect your own account for custom pricing and direct inventory access.</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Account Number</Label>
                <Input placeholder="Your account #" value={ssAccount} onChange={(e) => setSsAccount(e.target.value)} className="h-8 text-xs" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">API Key</Label>
                <Input type="password" placeholder="Your API key" value={ssApiKey} onChange={(e) => setSsApiKey(e.target.value)} className="h-8 text-xs" />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Search & Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            defaultValue=""
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge
            variant={activeCategory === null ? "default" : "outline"}
            className="cursor-pointer text-xs"
            onClick={() => setActiveCategory(null)}
          >
            All
          </Badge>
          {categories.map((cat) => (
            <Badge
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              className="cursor-pointer text-xs"
              onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
            >
              {cat}
            </Badge>
          ))}
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

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-lg" />
          ))}
        </div>
      ) : (
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto pr-1"
        >
          {products.map((product) => (
            <ProductCard
              key={product.styleID}
              product={product}
              selected={selected}
              expandedProduct={expandedProduct}
              onToggle={toggleProduct}
              onToggleColor={toggleColor}
              onToggleSize={toggleSize}
              onExpand={(id) => setExpandedProduct(expandedProduct === id ? null : id)}
            />
          ))}

          {/* Loading more indicator */}
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

      {/* Actions */}
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

// --- Extracted product card component ---

interface ProductCardProps {
  product: SSStyle;
  selected: Map<number, SelectedProduct>;
  expandedProduct: number | null;
  onToggle: (p: SSStyle) => void;
  onToggleColor: (id: number, color: string) => void;
  onToggleSize: (id: number, size: string) => void;
  onExpand: (id: number) => void;
}

const ProductCard = ({ product, selected, expandedProduct, onToggle, onToggleColor, onToggleSize, onExpand }: ProductCardProps) => {
  const isSelected = selected.has(product.styleID);
  const sel = selected.get(product.styleID);
  const isExpanded = expandedProduct === product.styleID;

  return (
    <Card
      className={`border cursor-pointer transition-all ${
        isSelected ? "border-primary ring-1 ring-primary/30" : "border-border hover:border-primary/40"
      }`}
    >
      <CardContent className="p-3 space-y-2">
        <div className="flex items-start gap-2">
          <Checkbox checked={isSelected} onCheckedChange={() => onToggle(product)} className="mt-0.5" />
          <div className="flex-1 min-w-0" onClick={() => onToggle(product)}>
            <p className="text-xs font-medium text-foreground truncate">{product.title}</p>
            <p className="text-[10px] text-muted-foreground">{product.brandName}</p>
          </div>
        </div>

        <div className="aspect-square bg-muted rounded-md overflow-hidden" onClick={() => onToggle(product)}>
          {product.styleImage ? (
            <img src={product.styleImage} alt={product.title} className="w-full h-full object-contain" loading="lazy" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No image</div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">${product.piecePrice?.toFixed(2) || "—"}</span>
          <Badge variant="secondary" className="text-[10px]">{product.baseCategory}</Badge>
        </div>

        {isSelected && (
          <div className="space-y-2 border-t border-border pt-2">
            <button
              className="flex items-center justify-between w-full text-xs text-muted-foreground"
              onClick={(e) => { e.stopPropagation(); onExpand(product.styleID); }}
            >
              <span>{sel?.selectedColors.length} colors, {sel?.selectedSizes.length} sizes</span>
              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {isExpanded && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="space-y-2">
                <div>
                  <p className="text-[10px] font-medium text-foreground mb-1">Colors</p>
                  <div className="flex flex-wrap gap-1">
                    {product.availableColors.map((c) => (
                      <button
                        key={c.name}
                        onClick={(e) => { e.stopPropagation(); onToggleColor(product.styleID, c.name); }}
                        className={`w-5 h-5 rounded-full border-2 transition-all ${
                          sel?.selectedColors.includes(c.name) ? "border-primary scale-110" : "border-transparent opacity-40"
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-medium text-foreground mb-1">Sizes</p>
                  <div className="flex flex-wrap gap-1">
                    {product.availableSizes.map((s) => (
                      <Badge
                        key={s}
                        variant={sel?.selectedSizes.includes(s) ? "default" : "outline"}
                        className="text-[10px] cursor-pointer px-1.5 py-0"
                        onClick={(e) => { e.stopPropagation(); onToggleSize(product.styleID, s); }}
                      >
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

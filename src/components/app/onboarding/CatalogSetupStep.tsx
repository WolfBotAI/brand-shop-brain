import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight, Search, Check, Loader2, ChevronDown, ChevronUp } from "lucide-react";
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
import { getAllStyles, type SSStyle } from "@/lib/api/ssProducts";

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
  const [allProducts, setAllProducts] = useState<SSStyle[]>([]);
  const [selected, setSelected] = useState<Map<number, SelectedProduct>>(new Map());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedProduct, setExpandedProduct] = useState<number | null>(null);

  // Advanced: own S&S credentials
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [ssAccount, setSsAccount] = useState("");
  const [ssApiKey, setSsApiKey] = useState("");

  useEffect(() => {
    loadCatalog();
  }, []);

  const loadCatalog = async () => {
    setLoading(true);
    try {
      const styles = await getAllStyles();
      setAllProducts(styles);
    } catch {
      toast({ title: "Error", description: "Failed to load catalog", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const categories = Array.from(new Set(allProducts.map((p) => p.baseCategory)));

  const filtered = allProducts.filter((p) => {
    const matchesCat = !activeCategory || p.baseCategory === activeCategory;
    const matchesSearch =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

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

  const selectAll = () => {
    const map = new Map<number, SelectedProduct>();
    for (const p of allProducts) {
      map.set(p.styleID, {
        ...p,
        selectedColors: p.availableColors.map((c) => c.name),
        selectedSizes: [...p.availableSizes],
      });
    }
    setSelected(map);
  };

  const selectNone = () => setSelected(new Map());

  const handleNext = async () => {
    if (selected.size === 0) return;
    setSaving(true);
    try {
      const products = Array.from(selected.values());
      let catalogId = "";

      if (user) {
        const { data, error } = await supabase
          .from("distributor_catalogs" as any)
          .insert({
            user_id: user.id,
            catalog_name: "My Catalog",
            selected_products: products.map((p) => ({
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
            })),
          } as any)
          .select("id")
          .single();

        if (error) throw error;
        catalogId = (data as any).id;
      }

      onNext({ catalogId, products });
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
        message="Browse the Brand-Shop Apparel catalog below. Select the items, colors, and sizes you want to make available to your clients. You can always add more later."
        delay={0.2}
      />

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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
            {selected.size} of {allProducts.length} selected
          </span>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={selectAll} className="text-xs h-7">Select All</Button>
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
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto pr-1">
          {filtered.map((product) => {
            const isSelected = selected.has(product.styleID);
            const sel = selected.get(product.styleID);
            const isExpanded = expandedProduct === product.styleID;

            return (
              <Card
                key={product.styleID}
                className={`border cursor-pointer transition-all ${
                  isSelected ? "border-primary ring-1 ring-primary/30" : "border-border hover:border-primary/40"
                }`}
              >
                <CardContent className="p-3 space-y-2">
                  {/* Header with checkbox */}
                  <div className="flex items-start gap-2">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleProduct(product)}
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0" onClick={() => toggleProduct(product)}>
                      <p className="text-xs font-medium text-foreground truncate">{product.title}</p>
                      <p className="text-[10px] text-muted-foreground">{product.brandName}</p>
                    </div>
                  </div>

                  {/* Image */}
                  <div className="aspect-square bg-muted rounded-md overflow-hidden" onClick={() => toggleProduct(product)}>
                    {product.styleImage ? (
                      <img src={product.styleImage} alt={product.title} className="w-full h-full object-contain" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No image</div>
                    )}
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      ${product.piecePrice?.toFixed(2) || "—"}
                    </span>
                    <Badge variant="secondary" className="text-[10px]">{product.baseCategory}</Badge>
                  </div>

                  {/* Expand for color/size selection when selected */}
                  {isSelected && (
                    <div className="space-y-2 border-t border-border pt-2">
                      <button
                        className="flex items-center justify-between w-full text-xs text-muted-foreground"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedProduct(isExpanded ? null : product.styleID);
                        }}
                      >
                        <span>{sel?.selectedColors.length} colors, {sel?.selectedSizes.length} sizes</span>
                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>

                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          className="space-y-2"
                        >
                          {/* Colors */}
                          <div>
                            <p className="text-[10px] font-medium text-foreground mb-1">Colors</p>
                            <div className="flex flex-wrap gap-1">
                              {product.availableColors.map((c) => (
                                <button
                                  key={c.name}
                                  onClick={(e) => { e.stopPropagation(); toggleColor(product.styleID, c.name); }}
                                  className={`w-5 h-5 rounded-full border-2 transition-all ${
                                    sel?.selectedColors.includes(c.name)
                                      ? "border-primary scale-110"
                                      : "border-transparent opacity-40"
                                  }`}
                                  style={{ backgroundColor: c.hex }}
                                  title={c.name}
                                />
                              ))}
                            </div>
                          </div>
                          {/* Sizes */}
                          <div>
                            <p className="text-[10px] font-medium text-foreground mb-1">Sizes</p>
                            <div className="flex flex-wrap gap-1">
                              {product.availableSizes.map((s) => (
                                <Badge
                                  key={s}
                                  variant={sel?.selectedSizes.includes(s) ? "default" : "outline"}
                                  className="text-[10px] cursor-pointer px-1.5 py-0"
                                  onClick={(e) => { e.stopPropagation(); toggleSize(product.styleID, s); }}
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
          })}
        </div>
      )}

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

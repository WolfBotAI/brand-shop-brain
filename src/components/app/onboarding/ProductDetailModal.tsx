import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Minus, Check, Loader2, DollarSign } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductImage } from "./ProductImage";
import { fetchStyleDetail, getCdnImageUrl, type SSStyle, type StyleDetailResult } from "@/lib/api/ssProducts";

export interface ProductVariantSelection {
  colors: string[];
  sizes: string[];
  itemMarkup?: number;
}

interface ProductDetailModalProps {
  product: SSStyle | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isSelected: boolean;
  onToggleSelect: (styleID: number) => void;
  variantSelection?: ProductVariantSelection;
  onVariantChange?: (styleID: number, selection: ProductVariantSelection) => void;
}

export const ProductDetailModal = ({
  product,
  open,
  onOpenChange,
  isSelected,
  onToggleSelect,
  variantSelection,
  onVariantChange,
}: ProductDetailModalProps) => {
  const [detail, setDetail] = useState<StyleDetailResult | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [selectedColors, setSelectedColors] = useState<Set<string>>(new Set());
  const [selectedSizes, setSelectedSizes] = useState<Set<string>>(new Set());
  const [itemMarkup, setItemMarkup] = useState<number | undefined>(undefined);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Load product detail on open
  useEffect(() => {
    if (open && product) {
      setLoadingDetail(true);
      setDetail(null);
      fetchStyleDetail(product.styleID).then((d) => {
        setDetail(d);
        setLoadingDetail(false);
        // Set first color image as preview
        if (d?.colors?.[0]?.image) {
          setPreviewImage(getCdnImageUrl(d.colors[0].image));
        }
      });
    }
  }, [open, product?.styleID]);

  // Sync from parent variant selection
  useEffect(() => {
    if (variantSelection) {
      setSelectedColors(new Set(variantSelection.colors));
      setSelectedSizes(new Set(variantSelection.sizes));
      setItemMarkup(variantSelection.itemMarkup);
    } else if (detail) {
      // Auto-select all when first opening
      setSelectedColors(new Set(detail.colors.map((c) => c.name)));
      setSelectedSizes(new Set(detail.sizes));
      setItemMarkup(undefined);
    }
  }, [variantSelection, detail]);

  if (!product) return null;

  const colors = detail?.colors || product.availableColors.map((c) => ({ ...c, image: null, backImage: null }));
  const sizes = detail?.sizes || product.availableSizes;
  const pricing = detail?.pricing;
  const description = detail?.description || product.description;

  const fireChange = (c: Set<string>, s: Set<string>, m?: number) => {
    onVariantChange?.(product.styleID, {
      colors: Array.from(c),
      sizes: Array.from(s),
      itemMarkup: m,
    });
  };

  const toggleColor = (name: string) => {
    setSelectedColors((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      fireChange(next, selectedSizes, itemMarkup);
      return next;
    });
    const col = colors.find((c) => c.name === name);
    if (col?.image) setPreviewImage(getCdnImageUrl(col.image));
  };

  const selectAllColors = () => {
    const allSelected = selectedColors.size === colors.length;
    const next = allSelected ? new Set<string>() : new Set(colors.map((c) => c.name));
    setSelectedColors(next);
    fireChange(next, selectedSizes, itemMarkup);
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) => {
      const next = new Set(prev);
      next.has(size) ? next.delete(size) : next.add(size);
      fireChange(selectedColors, next, itemMarkup);
      return next;
    });
  };

  const selectAllSizes = () => {
    const allSelected = selectedSizes.size === sizes.length;
    const next = allSelected ? new Set<string>() : new Set(sizes);
    setSelectedSizes(next);
    fireChange(selectedColors, next, itemMarkup);
  };

  const handleMarkupChange = (val: string) => {
    const m = val === "" ? undefined : Number(val);
    setItemMarkup(m);
    fireChange(selectedColors, selectedSizes, m);
  };

  const formatPrice = (val: number) => val > 0 ? `$${val.toFixed(2)}` : "—";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">{product.title}</DialogTitle>
          {detail && (
            <p className="text-xs text-muted-foreground">{detail.brandName} · {detail.totalSkus} SKUs</p>
          )}
        </DialogHeader>

        <div className="space-y-5">
          {/* Product Image */}
          <div className="w-full aspect-square rounded-lg bg-muted overflow-hidden">
            {loadingDetail ? (
              <Skeleton className="w-full h-full" />
            ) : (
              <ProductImage
                src={previewImage || product.styleImage}
                alt={product.title}
                className="w-full h-full"
                iconSize="lg"
              />
            )}
          </div>

          {/* Description */}
          {description && (
            <div
              className="text-sm text-muted-foreground prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}

          {/* Pricing */}
          {loadingDetail ? (
            <Skeleton className="h-16 w-full rounded-lg" />
          ) : pricing ? (
            <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
              <div>
                <p className="text-xs text-muted-foreground">Your Cost</p>
                <p className="text-lg font-bold text-foreground">
                  {pricing.customerPrice.min === pricing.customerPrice.max
                    ? formatPrice(pricing.customerPrice.min)
                    : `${formatPrice(pricing.customerPrice.min)} – ${formatPrice(pricing.customerPrice.max)}`}
                </p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <p className="text-xs text-muted-foreground">Piece Price</p>
                <p className="text-lg font-semibold text-muted-foreground">
                  {pricing.piecePrice.min === pricing.piecePrice.max
                    ? formatPrice(pricing.piecePrice.min)
                    : `${formatPrice(pricing.piecePrice.min)} – ${formatPrice(pricing.piecePrice.max)}`}
                </p>
              </div>
            </div>
          ) : (product.customerPrice || product.piecePrice) ? (
            <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
              <div>
                <p className="text-xs text-muted-foreground">Your Cost</p>
                <p className="text-lg font-bold text-foreground">{formatPrice(product.customerPrice || 0)}</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <p className="text-xs text-muted-foreground">Piece Price</p>
                <p className="text-lg font-semibold text-muted-foreground">{formatPrice(product.piecePrice || 0)}</p>
              </div>
            </div>
          ) : null}

          {/* Per-Item Markup */}
          <div className="p-3 rounded-lg border border-border space-y-2">
            <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-primary" /> Item Markup (%)
            </p>
            <Input
              type="number"
              min={0}
              max={500}
              placeholder="Use global markup"
              value={itemMarkup ?? ""}
              onChange={(e) => handleMarkupChange(e.target.value)}
              className="h-9 w-32"
            />
            <p className="text-[10px] text-muted-foreground">Override the global markup for this item only. Leave blank to use category/global markup.</p>
          </div>

          {/* Colors */}
          {loadingDetail ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <div className="flex gap-2"><Skeleton className="w-9 h-9 rounded-full" /><Skeleton className="w-9 h-9 rounded-full" /><Skeleton className="w-9 h-9 rounded-full" /></div>
            </div>
          ) : colors.length > 0 ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">
                  Colors ({selectedColors.size} of {colors.length})
                </p>
                <button onClick={selectAllColors} className="text-xs text-primary hover:underline">
                  {selectedColors.size === colors.length ? "Deselect All" : "Select All"}
                </button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => toggleColor(color.name)}
                    className={`w-9 h-9 rounded-full border-2 transition-all flex items-center justify-center ${
                      selectedColors.has(color.name)
                        ? "border-primary ring-2 ring-primary/30"
                        : "border-border hover:border-muted-foreground"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  >
                    {selectedColors.has(color.name) && (
                      <Check className={`w-4 h-4 ${color.hex === "#FFFFFF" || color.hex === "#F5F0E1" ? "text-foreground" : "text-white"}`} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {/* Sizes */}
          {loadingDetail ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <div className="flex gap-2"><Skeleton className="w-12 h-7 rounded-md" /><Skeleton className="w-12 h-7 rounded-md" /></div>
            </div>
          ) : sizes.length > 0 ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">
                  Sizes ({selectedSizes.size} of {sizes.length})
                </p>
                <button onClick={selectAllSizes} className="text-xs text-primary hover:underline">
                  {selectedSizes.size === sizes.length ? "Deselect All" : "Select All"}
                </button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => toggleSize(size)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-all ${
                      selectedSizes.has(size)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-foreground border-border hover:border-muted-foreground"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {/* Add / Remove Button */}
          <Button
            onClick={() => onToggleSelect(product.styleID)}
            variant={isSelected ? "outline" : "default"}
            className="w-full gap-2"
          >
            {isSelected ? (
              <><Minus className="w-4 h-4" /> Remove from Store</>
            ) : (
              <><Plus className="w-4 h-4" /> Add to Store</>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

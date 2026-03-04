import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Plus, Minus, ShoppingBag, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { SSStyle } from "@/lib/api/ssProducts";

export interface ProductVariantSelection {
  colors: string[];
  sizes: string[];
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
  const [selectedColors, setSelectedColors] = useState<Set<string>>(new Set());
  const [selectedSizes, setSelectedSizes] = useState<Set<string>>(new Set());

  // Sync from parent variant selection
  useEffect(() => {
    if (variantSelection) {
      setSelectedColors(new Set(variantSelection.colors));
      setSelectedSizes(new Set(variantSelection.sizes));
    } else {
      setSelectedColors(new Set());
      setSelectedSizes(new Set());
    }
  }, [variantSelection, product?.styleID]);

  if (!product) return null;

  const fireChange = (colors: Set<string>, sizes: Set<string>) => {
    onVariantChange?.(product.styleID, {
      colors: Array.from(colors),
      sizes: Array.from(sizes),
    });
  };

  const toggleColor = (name: string) => {
    setSelectedColors((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      fireChange(next, selectedSizes);
      return next;
    });
  };

  const selectAllColors = () => {
    const allSelected = selectedColors.size === product.availableColors.length;
    const next = allSelected ? new Set<string>() : new Set(product.availableColors.map((c) => c.name));
    setSelectedColors(next);
    fireChange(next, selectedSizes);
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) => {
      const next = new Set(prev);
      if (next.has(size)) next.delete(size);
      else next.add(size);
      fireChange(selectedColors, next);
      return next;
    });
  };

  const selectAllSizes = () => {
    const allSelected = selectedSizes.size === product.availableSizes.length;
    const next = allSelected ? new Set<string>() : new Set(product.availableSizes);
    setSelectedSizes(next);
    fireChange(selectedColors, next);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">{product.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Product Image */}
          <div className="w-full aspect-square rounded-lg bg-muted overflow-hidden">
            {product.styleImage ? (
              <img
                src={product.styleImage}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                No image
              </div>
            )}
          </div>

          {/* Brand & Description */}
          <div>
            <p className="text-xs font-semibold text-primary">{product.brandName}</p>
            <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
          </div>

          {/* Pricing */}
          <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
            <div>
              <p className="text-xs text-muted-foreground">Your Cost</p>
              <p className="text-lg font-bold text-foreground">
                ${product.customerPrice?.toFixed(2)}
              </p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <p className="text-xs text-muted-foreground">Suggested Retail</p>
              <p className="text-lg font-semibold text-muted-foreground">
                ${product.piecePrice?.toFixed(2)}
              </p>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground">
            Pricing set by Brand-Shop. Adjust your markup in Store Settings after creation.
          </p>

          {/* Colors — with Select All */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">
                Colors ({selectedColors.size} of {product.availableColors.length})
              </p>
              <button onClick={selectAllColors} className="text-xs text-primary hover:underline">
                {selectedColors.size === product.availableColors.length ? "Deselect All" : "Select All"}
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {product.availableColors.map((color) => (
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

          {/* Sizes */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">
                Sizes ({selectedSizes.size} of {product.availableSizes.length})
              </p>
              <button
                onClick={selectAllSizes}
                className="text-xs text-primary hover:underline"
              >
                {selectedSizes.size === product.availableSizes.length ? "Deselect All" : "Select All"}
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {product.availableSizes.map((size) => (
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

          {/* Add / Remove Button */}
          <Button
            onClick={() => onToggleSelect(product.styleID)}
            variant={isSelected ? "outline" : "default"}
            className="w-full gap-2"
          >
            {isSelected ? (
              <>
                <Minus className="w-4 h-4" /> Remove from Store
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" /> Add to Store
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

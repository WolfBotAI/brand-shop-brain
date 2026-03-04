import { useState } from "react";
import { motion } from "framer-motion";
import { X, Plus, Minus, ShoppingBag, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { SSStyle } from "@/lib/api/ssProducts";

interface ProductDetailModalProps {
  product: SSStyle | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isSelected: boolean;
  onToggleSelect: (styleID: number) => void;
}

export const ProductDetailModal = ({
  product,
  open,
  onOpenChange,
  isSelected,
  onToggleSelect,
}: ProductDetailModalProps) => {
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSizes, setSelectedSizes] = useState<Set<string>>(new Set());

  if (!product) return null;

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) => {
      const next = new Set(prev);
      if (next.has(size)) next.delete(size);
      else next.add(size);
      return next;
    });
  };

  const selectAllSizes = () => {
    if (selectedSizes.size === product.availableSizes.length) {
      setSelectedSizes(new Set());
    } else {
      setSelectedSizes(new Set(product.availableSizes));
    }
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

          {/* Colors */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">
              Color: {product.availableColors[selectedColor]?.name}
            </p>
            <div className="flex gap-2 flex-wrap">
              {product.availableColors.map((color, i) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(i)}
                  className={`w-9 h-9 rounded-full border-2 transition-all flex items-center justify-center ${
                    selectedColor === i
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-border hover:border-muted-foreground"
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                >
                  {selectedColor === i && (
                    <Check className={`w-4 h-4 ${color.hex === "#FFFFFF" || color.hex === "#F5F0E1" ? "text-foreground" : "text-white"}`} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">Sizes</p>
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

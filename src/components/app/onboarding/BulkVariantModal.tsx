import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Layers } from "lucide-react";
import type { SSStyle } from "@/lib/api/ssProducts";

export interface VariantSelection {
  colors: string[];
  sizes: string[];
}

interface BulkVariantModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  products: SSStyle[];
  applyMode: "selected" | "category" | "all";
  categoryName?: string;
  onApply: (selection: VariantSelection) => void;
}

export const BulkVariantModal = ({
  open,
  onOpenChange,
  products,
  applyMode,
  categoryName,
  onApply,
}: BulkVariantModalProps) => {
  const [selectedColors, setSelectedColors] = useState<Set<string>>(new Set());
  const [selectedSizes, setSelectedSizes] = useState<Set<string>>(new Set());

  // Gather all unique colors/sizes across given products
  const allColors = useMemo(() => {
    const map = new Map<string, string>();
    products.forEach((p) => p.availableColors.forEach((c) => map.set(c.name, c.hex)));
    return Array.from(map.entries()).map(([name, hex]) => ({ name, hex }));
  }, [products]);

  const allSizes = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.availableSizes.forEach((s) => set.add(s)));
    // Sort sizes logically
    const order = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "One Size"];
    return Array.from(set).sort((a, b) => order.indexOf(a) - order.indexOf(b));
  }, [products]);

  const toggleColor = (name: string) => {
    setSelectedColors((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) => {
      const next = new Set(prev);
      if (next.has(size)) next.delete(size);
      else next.add(size);
      return next;
    });
  };

  const selectAllColors = () => {
    if (selectedColors.size === allColors.length) setSelectedColors(new Set());
    else setSelectedColors(new Set(allColors.map((c) => c.name)));
  };

  const selectAllSizes = () => {
    if (selectedSizes.size === allSizes.length) setSelectedSizes(new Set());
    else setSelectedSizes(new Set(allSizes));
  };

  const modeLabel =
    applyMode === "category" ? `Apply to "${categoryName}"` :
    applyMode === "all" ? "Apply to All Items" :
    `Apply to ${products.length} Selected Items`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Layers className="w-5 h-5 text-primary" />
            Bulk Color & Size Selection
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">{modeLabel}</p>

        {/* Colors */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">Colors</p>
            <button onClick={selectAllColors} className="text-xs text-primary hover:underline">
              {selectedColors.size === allColors.length ? "Deselect All" : "Select All"}
            </button>
          </div>
          <div className="flex gap-2 flex-wrap">
            {allColors.map((color) => (
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
          {selectedColors.size > 0 && (
            <div className="flex gap-1 flex-wrap">
              {Array.from(selectedColors).map((name) => (
                <Badge key={name} variant="secondary" className="text-[10px]">{name}</Badge>
              ))}
            </div>
          )}
        </div>

        {/* Sizes */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">Sizes</p>
            <button onClick={selectAllSizes} className="text-xs text-primary hover:underline">
              {selectedSizes.size === allSizes.length ? "Deselect All" : "Select All"}
            </button>
          </div>
          <div className="flex gap-2 flex-wrap">
            {allSizes.map((size) => (
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

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            onClick={() => {
              onApply({ colors: Array.from(selectedColors), sizes: Array.from(selectedSizes) });
              onOpenChange(false);
            }}
            disabled={selectedColors.size === 0 && selectedSizes.size === 0}
          >
            {modeLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

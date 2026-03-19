import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Plus, X, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductImage } from "@/components/app/onboarding/ProductImage";
import type { SSStyle } from "@/lib/api/ssProducts";

export interface ThemeConfig {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  logoUrl?: string;
  fontFamily?: string;
}

interface CartItem {
  product: SSStyle;
  color: string;
  size: string;
  qty: number;
}

interface StorefrontPreviewProps {
  storeName: string;
  products: SSStyle[];
  theme: ThemeConfig;
  logoUrl?: string | null;
}

export const StorefrontPreview = ({ storeName, products, theme, logoUrl }: StorefrontPreviewProps) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const addToCart = (product: SSStyle) => {
    const color = product.availableColors[0]?.name || "Default";
    const size = product.availableSizes[0] || "One Size";
    setCart((prev) => {
      const existing = prev.find((i) => i.product.styleID === product.styleID && i.color === color && i.size === size);
      if (existing) return prev.map((i) => (i === existing ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { product, color, size, qty: 1 }];
    });
  };

  const removeFromCart = (index: number) => setCart((prev) => prev.filter((_, i) => i !== index));
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);
  const cartTotal = cart.reduce((sum, i) => sum + (i.product.piecePrice || 0) * i.qty, 0);

  return (
    <div className="rounded-xl border border-border overflow-hidden" style={{ fontFamily: theme.fontFamily || "inherit" }}>
      {/* Store Header */}
      <div className="px-6 py-4 flex items-center justify-between" style={{ backgroundColor: theme.primary, color: "#fff" }}>
        <div className="flex items-center gap-3">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="w-8 h-8 rounded object-contain bg-white/20 p-0.5" />
          ) : (
            <Store className="w-6 h-6" />
          )}
          <span className="font-bold text-lg">{storeName}</span>
        </div>
        <button onClick={() => setCartOpen(!cartOpen)} className="relative p-2 rounded-lg hover:bg-white/20 transition-colors">
          <ShoppingCart className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center" style={{ backgroundColor: theme.accent, color: "#fff" }}>
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Cart Drawer */}
      {cartOpen && (
        <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} className="border-b border-border" style={{ backgroundColor: theme.background }}>
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Cart ({cartCount})</h3>
              <button onClick={() => setCartOpen(false)}><X className="w-4 h-4" /></button>
            </div>
            {cart.length === 0 ? (
              <p className="text-xs text-muted-foreground">Your cart is empty</p>
            ) : (
              <>
                {cart.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium">{item.product.title}</p>
                      <p className="text-xs text-muted-foreground">{item.color} / {item.size} × {item.qty}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">${((item.product.piecePrice || 0) * item.qty).toFixed(2)}</span>
                      <button onClick={() => removeFromCart(i)} className="text-muted-foreground hover:text-destructive"><X className="w-3 h-3" /></button>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between font-bold text-sm pt-2 border-t border-border">
                  <span>Total</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <Button className="w-full" size="sm" style={{ backgroundColor: theme.accent, color: "#fff" }}>
                  Checkout
                </Button>
              </>
            )}
          </div>
        </motion.div>
      )}

      {/* Product Grid */}
      <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-4" style={{ backgroundColor: theme.background }}>
        {products.map((product) => (
          <motion.div key={product.styleID} whileHover={{ y: -2 }} className="rounded-lg border border-border overflow-hidden bg-card">
            <ProductImage src={product.styleImage} alt={product.title} className="w-full h-32" iconSize="md" />
            <div className="p-3 space-y-2">
              <p className="text-xs font-medium truncate">{product.title}</p>
              <div className="flex gap-1">
                {product.availableColors.slice(0, 4).map((c) => (
                  <div key={c.name} className="w-3.5 h-3.5 rounded-full border border-border" style={{ backgroundColor: c.hex }} />
                ))}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold" style={{ color: theme.primary }}>${(product.piecePrice || 0).toFixed(2)}</span>
                <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => addToCart(product)}>
                  <Plus className="w-3 h-3" /> Add
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="px-4 py-3 text-center text-[10px] text-muted-foreground border-t border-border" style={{ backgroundColor: theme.background }}>
        Powered by Brand-Shop.AI
      </div>
    </div>
  );
};

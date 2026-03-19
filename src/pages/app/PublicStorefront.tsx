import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ShoppingCart, Plus, X, Store, Loader2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import type { SSStyle } from "@/lib/api/ssProducts";

interface ThemeConfig {
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

export default function PublicStorefront() {
  const { slug } = useParams();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({ name: "", email: "", address: "" });
  const [submitting, setSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Fetch store by slug (public — anon RLS)
  const { data: store, isLoading, error } = useQuery({
    queryKey: ["public-store", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stores")
        .select("*")
        .eq("slug", slug!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  const theme: ThemeConfig = useMemo(() => {
    const tc = store?.theme_config as unknown as ThemeConfig | null;
    return tc || { primary: "#2d3436", secondary: "#0984e3", accent: "#fdcb6e", background: "#ffffff" };
  }, [store]);

  const metadata = (store?.metadata as any) || {};
  const products: SSStyle[] = metadata.products || [];
  const pricingConfig = metadata.pricing || { globalMarkup: 40 };
  const storeName = store?.store_name || "Store";
  const logoUrl = store?.logo_url || theme.logoUrl;

  const calcRetail = (cost: number) => +(cost * (1 + pricingConfig.globalMarkup / 100)).toFixed(2);

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
  const cartTotal = cart.reduce((sum, i) => sum + calcRetail(i.product.customerPrice || i.product.piecePrice || 0) * i.qty, 0);

  const placeOrder = async () => {
    if (!store) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from("orders").insert({
        store_id: store.id,
        customer_email: checkoutForm.email,
        customer_name: checkoutForm.name,
        shipping_address: { address: checkoutForm.address },
        items: cart.map((i) => ({
          title: i.product.title,
          color: i.color,
          size: i.size,
          qty: i.qty,
          price: calcRetail(i.product.customerPrice || i.product.piecePrice || 0),
        })),
        total: cartTotal,
        status: "pending",
      } as any);
      if (error) throw error;
      setOrderPlaced(true);
      setCart([]);
    } catch (e) {
      console.error("Order failed:", e);
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <Store className="w-12 h-12 text-muted-foreground mx-auto" />
          <h1 className="text-xl font-bold">Store not found</h1>
          <p className="text-muted-foreground text-sm">This store doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.background }}>
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center" style={{ backgroundColor: theme.accent }}>
            <ChevronRight className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Order Placed!</h1>
          <p className="text-muted-foreground">Thank you for your order. You'll receive a confirmation email at {checkoutForm.email}.</p>
          <Button onClick={() => { setOrderPlaced(false); setCheckoutOpen(false); }}>Continue Shopping</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.background, fontFamily: theme.fontFamily || "inherit" }}>
      {/* Header */}
      <header className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between shadow-sm" style={{ backgroundColor: theme.primary, color: "#fff" }}>
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
      </header>

      {/* Cart Drawer */}
      {cartOpen && (
        <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} className="border-b border-border bg-card">
          <div className="max-w-4xl mx-auto p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Cart ({cartCount})</h3>
              <button onClick={() => setCartOpen(false)}><X className="w-4 h-4" /></button>
            </div>
            {cart.length === 0 ? (
              <p className="text-sm text-muted-foreground">Your cart is empty</p>
            ) : (
              <>
                {cart.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium">{item.product.title}</p>
                      <p className="text-xs text-muted-foreground">{item.color} / {item.size} × {item.qty}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">${(calcRetail(item.product.customerPrice || item.product.piecePrice || 0) * item.qty).toFixed(2)}</span>
                      <button onClick={() => removeFromCart(i)} className="text-muted-foreground hover:text-destructive"><X className="w-3 h-3" /></button>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between font-bold pt-2 border-t border-border">
                  <span>Total</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <Button className="w-full" onClick={() => { setCheckoutOpen(true); setCartOpen(false); }} style={{ backgroundColor: theme.accent, color: "#fff" }}>
                  Checkout
                </Button>
              </>
            )}
          </div>
        </motion.div>
      )}

      {/* Checkout */}
      {checkoutOpen ? (
        <div className="max-w-lg mx-auto p-6 space-y-6">
          <h2 className="text-xl font-bold">Checkout</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Full Name</label>
              <Input value={checkoutForm.name} onChange={(e) => setCheckoutForm({ ...checkoutForm, name: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input type="email" value={checkoutForm.email} onChange={(e) => setCheckoutForm({ ...checkoutForm, email: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium">Shipping Address</label>
              <Input value={checkoutForm.address} onChange={(e) => setCheckoutForm({ ...checkoutForm, address: e.target.value })} />
            </div>
          </div>
          <div className="border-t border-border pt-4 space-y-2">
            {cart.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span>{item.product.title} × {item.qty}</span>
                <span>${(calcRetail(item.product.customerPrice || item.product.piecePrice || 0) * item.qty).toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setCheckoutOpen(false)}>Back to Store</Button>
            <Button
              className="flex-1"
              style={{ backgroundColor: theme.accent, color: "#fff" }}
              disabled={!checkoutForm.name || !checkoutForm.email || submitting}
              onClick={placeOrder}
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Place Order
            </Button>
          </div>
        </div>
      ) : (
        /* Product Grid */
        <div className="max-w-6xl mx-auto p-6">
          {products.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <Store className="w-12 h-12 text-muted-foreground mx-auto" />
              <p className="text-muted-foreground">This store is being set up. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {products.map((product) => (
                <motion.div
                  key={product.styleID}
                  whileHover={{ y: -4 }}
                  className="rounded-lg border border-border overflow-hidden bg-card shadow-sm"
                >
                  {product.styleImage ? (
                    <img src={product.styleImage} alt={product.title} className="w-full h-48 object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-48 bg-muted flex items-center justify-center text-muted-foreground text-xs">No image</div>
                  )}
                  <div className="p-4 space-y-2">
                    <p className="text-sm font-medium truncate">{product.title}</p>
                    <p className="text-xs text-muted-foreground">{product.brandName}</p>
                    <div className="flex gap-1">
                      {product.availableColors?.slice(0, 5).map((c) => (
                        <div key={c.name} className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: c.hex }} title={c.name} />
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-lg font-bold" style={{ color: theme.primary }}>
                        ${calcRetail(product.customerPrice || product.piecePrice || 0).toFixed(2)}
                      </span>
                      <Button size="sm" variant="outline" className="h-8 text-xs gap-1" onClick={() => addToCart(product)}>
                        <Plus className="w-3 h-3" /> Add
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <footer className="mt-12 py-6 text-center text-xs text-muted-foreground border-t border-border">
        Powered by Brand-Shop.AI
      </footer>
    </div>
  );
}

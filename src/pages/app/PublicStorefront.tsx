import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart, Plus, X, Store, Loader2, ChevronRight, Clock, Minus,
  Search, Filter, Heart, Eye, ShoppingBag, ArrowRight, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { StorefrontChatWidget } from "@/components/app/store/StorefrontChatWidget";
import { ProductImage } from "@/components/app/onboarding/ProductImage";
import { isPast, parseISO, formatDistanceToNow } from "date-fns";
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
  const [selectedProduct, setSelectedProduct] = useState<SSStyle | null>(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

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
    return tc || { primary: "#0f0f0f", secondary: "#6366f1", accent: "#f59e0b", background: "#fafafa" };
  }, [store]);

  const metadata = (store?.metadata as any) || {};
  const products: SSStyle[] = metadata.products || [];
  const pricingConfig = metadata.pricing || { globalMarkup: 40 };
  const storeName = store?.store_name || "Store";
  const logoUrl = store?.logo_url || theme.logoUrl;

  const calcRetail = (cost: number) => +(cost * (1 + pricingConfig.globalMarkup / 100)).toFixed(2);

  const isExpired = useMemo(() => {
    const expiresAt = (store as any)?.expires_at;
    const storeType = (store as any)?.store_type;
    if (storeType !== "popup" || !expiresAt) return false;
    return isPast(parseISO(expiresAt));
  }, [store]);

  const expiresAt = (store as any)?.expires_at;
  const storeType = (store as any)?.store_type;

  const categories = useMemo(() => Array.from(new Set(products.map((p) => p.baseCategory))), [products]);

  const filteredProducts = useMemo(() => {
    let result = products;
    if (searchQuery) {
      const lower = searchQuery.toLowerCase();
      result = result.filter((p) =>
        p.title.toLowerCase().includes(lower) || p.brandName.toLowerCase().includes(lower)
      );
    }
    if (activeCategory) {
      result = result.filter((p) => p.baseCategory === activeCategory);
    }
    return result;
  }, [products, searchQuery, activeCategory]);

  const addToCart = (product: SSStyle, color?: string, size?: string) => {
    const c = color || product.availableColors[0]?.name || "Default";
    const s = size || product.availableSizes[0] || "One Size";
    setCart((prev) => {
      const existing = prev.find((i) => i.product.styleID === product.styleID && i.color === c && i.size === s);
      if (existing) return prev.map((i) => (i === existing ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { product, color: c, size: s, qty: 1 }];
    });
    setCartOpen(true);
  };

  const updateQty = (index: number, delta: number) => {
    setCart((prev) =>
      prev.map((item, i) => (i === index ? { ...item, qty: Math.max(1, item.qty + delta) } : item))
    );
  };

  const removeFromCart = (index: number) => setCart((prev) => prev.filter((_, i) => i !== index));
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);
  const cartTotal = cart.reduce((sum, i) => sum + calcRetail(i.product.customerPrice || i.product.piecePrice || 0) * i.qty, 0);

  const placeOrder = async () => {
    if (!store) return;
    setSubmitting(true);
    try {
      const orderItems = cart.map((i) => ({
        title: i.product.title,
        color: i.color,
        size: i.size,
        qty: i.qty,
        price: calcRetail(i.product.customerPrice || i.product.piecePrice || 0),
      }));
      const { data: orderData, error } = await supabase.from("orders").insert({
        store_id: store.id,
        customer_email: checkoutForm.email,
        customer_name: checkoutForm.name,
        shipping_address: { address: checkoutForm.address },
        items: orderItems,
        total: cartTotal,
        status: "pending",
      } as any).select("id").single();
      if (error) throw error;

      // Sync order to GHL (fire-and-forget)
      try {
        await supabase.functions.invoke("ghl-sync", {
          body: {
            action: "sync_order",
            payload: {
              customer_name: checkoutForm.name,
              customer_email: checkoutForm.email,
              order_id: orderData?.id,
              items: orderItems,
              total: cartTotal,
              store_name: storeName,
            },
          },
        });
      } catch (ghlErr) {
        console.warn("GHL sync failed (non-blocking):", ghlErr);
      }

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
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <Store className="w-16 h-16 text-muted-foreground" />
        <h1 className="text-2xl font-bold text-foreground">Store not found</h1>
        <p className="text-muted-foreground">This store doesn't exist or has been removed.</p>
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.background }}>
        <div className="text-center space-y-4 max-w-md">
          <Clock className="w-16 h-16 text-muted-foreground mx-auto" />
          <h1 className="text-2xl font-bold">This Pop-Up Store Has Ended</h1>
          <p className="text-muted-foreground">The "{storeName}" pop-up event has concluded.</p>
          <Link to="/"><Button variant="outline">Visit Brand-Shop.AI</Button></Link>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${theme.primary}08, ${theme.accent}12)` }}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-6 max-w-md px-6">
          <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center bg-primary/10">
            <Check className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Order Confirmed!</h1>
          <p className="text-muted-foreground">Thank you for your order. Confirmation sent to {checkoutForm.email}.</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => { setOrderPlaced(false); setCheckoutOpen(false); }}>Continue Shopping</Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: theme.fontFamily || "'Inter', system-ui, sans-serif" }}>
      {/* Pop-up countdown */}
      {storeType === "popup" && expiresAt && !isExpired && (
        <div className="text-center text-sm py-2 px-4" style={{ backgroundColor: theme.primary, color: "#fff" }}>
          <Clock className="inline w-3.5 h-3.5 mr-1 -mt-0.5" />
          Pop-Up ends in {formatDistanceToNow(parseISO(expiresAt))}
        </div>
      )}

      {/* Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="w-10 h-10 rounded-lg object-contain" />
            ) : (
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: theme.primary }}>
                <Store className="w-5 h-5 text-white" />
              </div>
            )}
            <span className="font-bold text-lg text-foreground tracking-tight">{storeName}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCartOpen(!cartOpen)}
              className="relative p-2.5 rounded-full hover:bg-muted transition-colors"
            >
              <ShoppingBag className="w-5 h-5 text-foreground" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center bg-primary text-primary-foreground">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div
          className="py-20 sm:py-28 px-6"
          style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary || theme.primary}dd)` }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-4xl sm:text-6xl font-bold text-white mb-4 tracking-tight"
            >
              {storeName}
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-white/70 max-w-xl mx-auto"
            >
              Premium branded apparel, curated for you.
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-8"
            >
              <Button
                size="lg"
                className="rounded-full px-8 gap-2 text-base"
                style={{ backgroundColor: theme.accent, color: "#fff" }}
                onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
              >
                Shop Collection <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.08),transparent_70%)]" />
      </section>

      {/* Search & Filters */}
      <div id="products" className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-full border-border bg-muted/30"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Badge
              variant={!activeCategory ? "default" : "outline"}
              className="cursor-pointer rounded-full px-4 py-1.5"
              onClick={() => setActiveCategory(null)}
            >
              All
            </Badge>
            {categories.map((cat) => (
              <Badge
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                className="cursor-pointer rounded-full px-4 py-1.5"
                onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
              >
                {cat}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Checkout View */}
      {checkoutOpen ? (
        <div className="max-w-lg mx-auto px-6 py-10 space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Checkout</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Full Name</label>
              <Input value={checkoutForm.name} onChange={(e) => setCheckoutForm({ ...checkoutForm, name: e.target.value })} className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Email</label>
              <Input type="email" value={checkoutForm.email} onChange={(e) => setCheckoutForm({ ...checkoutForm, email: e.target.value })} className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Shipping Address</label>
              <Input value={checkoutForm.address} onChange={(e) => setCheckoutForm({ ...checkoutForm, address: e.target.value })} className="mt-1" />
            </div>
          </div>
          <div className="border-t border-border pt-4 space-y-2">
            {cart.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span>{item.product.title} × {item.qty}</span>
                <span className="font-medium">${(calcRetail(item.product.customerPrice || item.product.piecePrice || 0) * item.qty).toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold text-lg pt-3 border-t border-border">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setCheckoutOpen(false)} className="flex-1">Back</Button>
            <Button
              className="flex-1"
              disabled={!checkoutForm.name || !checkoutForm.email || submitting}
              onClick={placeOrder}
              style={{ backgroundColor: theme.primary }}
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Place Order
            </Button>
          </div>
        </div>
      ) : (
        /* Product Grid */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 space-y-3">
              <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mx-auto" />
              <p className="text-muted-foreground">
                {products.length === 0 ? "This store is being set up. Check back soon!" : "No products match your search."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((product, i) => (
                <motion.div
                  key={product.styleID}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="group relative rounded-xl overflow-hidden bg-card border border-border hover:shadow-lg transition-all duration-300"
                >
                  {/* Product Image */}
                  <div className="relative overflow-hidden cursor-pointer" onClick={() => {
                    setSelectedProduct(product);
                    setSelectedColor(product.availableColors[0]?.name || "");
                    setSelectedSize(product.availableSizes[0] || "");
                  }}>
                    <ProductImage
                      src={product.styleImage}
                      alt={product.title}
                      className="w-full aspect-[3/4] group-hover:scale-105 transition-transform duration-500"
                      iconSize="lg"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button
                        size="sm"
                        className="w-full rounded-full gap-1.5 backdrop-blur-sm"
                        style={{ backgroundColor: theme.primary + "ee", color: "#fff" }}
                        onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                      >
                        <Plus className="w-3.5 h-3.5" /> Quick Add
                      </Button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4 space-y-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{product.brandName}</p>
                    <p className="text-sm font-medium text-foreground leading-snug line-clamp-2">{product.title}</p>
                    <div className="flex gap-1 pt-1">
                      {product.availableColors?.slice(0, 5).map((c) => (
                        <div key={c.name} className="w-3.5 h-3.5 rounded-full border border-border shadow-sm" style={{ backgroundColor: c.hex }} />
                      ))}
                      {(product.availableColors?.length || 0) > 5 && (
                        <span className="text-[10px] text-muted-foreground ml-0.5">+{product.availableColors.length - 5}</span>
                      )}
                    </div>
                    <p className="text-lg font-bold text-foreground pt-1">
                      ${calcRetail(product.customerPrice || product.piecePrice || 0).toFixed(2)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Product Detail Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-0">
          {selectedProduct && (
            <div>
              <ProductImage
                src={selectedProduct.styleImage}
                alt={selectedProduct.title}
                className="w-full aspect-square"
                iconSize="lg"
              />
              <div className="p-6 space-y-5">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{selectedProduct.brandName}</p>
                  <h2 className="text-xl font-bold text-foreground">{selectedProduct.title}</h2>
                  <p className="text-sm text-muted-foreground mt-2">{selectedProduct.description}</p>
                </div>

                <p className="text-2xl font-bold text-foreground">
                  ${calcRetail(selectedProduct.customerPrice || selectedProduct.piecePrice || 0).toFixed(2)}
                </p>

                {/* Color selector */}
                {selectedProduct.availableColors.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Color: {selectedColor}</p>
                    <div className="flex gap-2 flex-wrap">
                      {selectedProduct.availableColors.map((c) => (
                        <button
                          key={c.name}
                          onClick={() => setSelectedColor(c.name)}
                          className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${
                            selectedColor === c.name ? "border-primary ring-2 ring-primary/30 scale-110" : "border-border"
                          }`}
                          style={{ backgroundColor: c.hex }}
                        >
                          {selectedColor === c.name && (
                            <Check className={`w-3.5 h-3.5 ${c.hex === "#FFFFFF" || c.hex === "#F5F0E1" ? "text-foreground" : "text-white"}`} />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size selector */}
                {selectedProduct.availableSizes.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Size: {selectedSize}</p>
                    <div className="flex gap-2 flex-wrap">
                      {selectedProduct.availableSizes.map((s) => (
                        <button
                          key={s}
                          onClick={() => setSelectedSize(s)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                            selectedSize === s
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-background text-foreground border-border hover:border-primary/50"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  className="w-full rounded-full py-6 text-base gap-2"
                  style={{ backgroundColor: theme.primary }}
                  onClick={() => {
                    addToCart(selectedProduct, selectedColor, selectedSize);
                    setSelectedProduct(null);
                  }}
                >
                  <ShoppingBag className="w-5 h-5" /> Add to Cart
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Slide-out Cart Drawer */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50"
              onClick={() => setCartOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-background z-50 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h3 className="text-lg font-bold text-foreground">Your Cart ({cartCount})</h3>
                <button onClick={() => setCartOpen(false)} className="p-2 rounded-full hover:bg-muted transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-16">
                    <ShoppingBag className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground">Your cart is empty</p>
                  </div>
                ) : (
                  cart.map((item, i) => (
                    <div key={i} className="flex gap-4 pb-4 border-b border-border last:border-0">
                      <ProductImage
                        src={item.product.styleImage}
                        alt={item.product.title}
                        className="w-20 h-20 rounded-lg flex-shrink-0"
                        iconSize="sm"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{item.product.title}</p>
                        <p className="text-xs text-muted-foreground">{item.color} / {item.size}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button onClick={() => updateQty(i, -1)} className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-medium w-6 text-center">{item.qty}</span>
                          <button onClick={() => updateQty(i, 1)} className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <button onClick={() => removeFromCart(i)} className="text-muted-foreground hover:text-destructive">
                          <X className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-bold">
                          ${(calcRetail(item.product.customerPrice || item.product.piecePrice || 0) * item.qty).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t border-border space-y-4">
                  <div className="flex justify-between text-lg font-bold text-foreground">
                    <span>Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <Button
                    className="w-full rounded-full py-6 text-base"
                    style={{ backgroundColor: theme.primary }}
                    onClick={() => { setCheckoutOpen(true); setCartOpen(false); }}
                  >
                    Checkout
                  </Button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="py-8 text-center text-xs text-muted-foreground border-t border-border bg-muted/30">
        <p>Powered by <span className="font-semibold">Brand-Shop.AI</span></p>
      </footer>

      {/* AI Chat Widget (conditional) */}
      {(store as any)?.ai_chat_enabled !== false && (
        <StorefrontChatWidget
          storeName={storeName}
          products={products.map((p) => ({
            title: p.title,
            price: calcRetail(p.customerPrice || p.piecePrice || 0),
            brandName: p.brandName,
          }))}
          accentColor={theme.accent}
        />
      )}

      {/* AI Voice Agent CTA */}
      {(store as any)?.ai_voice_enabled && (store as any)?.ai_voice_number && (
        <a
          href={`tel:${(store as any).ai_voice_number}`}
          className="fixed bottom-5 left-5 z-50 flex items-center gap-2 px-4 py-3 rounded-full shadow-lg bg-primary text-primary-foreground text-sm font-medium hover:scale-105 transition-transform"
        >
          <Phone className="w-4 h-4" /> AI Voice Support
        </a>
      )}
    </div>
  );
}

import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Loader2, Search, ShoppingBag, Store, Package, CheckCircle2,
  Truck, Clock, Phone, MessageCircle, ChevronDown, ChevronUp
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO } from "date-fns";
import { StorefrontChatWidget } from "@/components/app/store/StorefrontChatWidget";

interface StatusStep {
  label: string;
  status: "completed" | "current" | "upcoming";
  timestamp?: string;
}

interface FulfillmentGroup {
  source: "printful" | "ss" | "manual";
  externalId?: string;
  decorator?: string;
  items: any[];
  status: string;
  statusLabel: string;
  timeline: StatusStep[];
  trackingNumber?: string;
  trackingUrl?: string;
  carrier?: string;
  estimatedDelivery?: string;
}

interface EnrichedOrder {
  id: string;
  created_at: string;
  updated_at: string;
  status: string;
  status_label: string;
  items: any[];
  total: number;
  customer_email: string;
  customer_name: string;
  timeline: StatusStep[];
  fulfillment_groups?: FulfillmentGroup[];
}

const statusIcons: Record<string, any> = {
  "Order Received": Clock,
  "Confirmed": CheckCircle2,
  "In Production": Package,
  "Decorated": Package,
  "Shipped": Truck,
  "Delivered": CheckCircle2,
};

export default function CustomerOrders() {
  const { slug } = useParams();
  const [lookupValue, setLookupValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<"email" | "order_id">("email");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const { data: store } = useQuery({
    queryKey: ["customer-store", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stores")
        .select("id, store_name, logo_url, ai_chat_enabled, ai_voice_enabled, ai_voice_number, theme_config, metadata")
        .eq("slug", slug!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ["order-status", store?.id, searchTerm, searchType],
    queryFn: async () => {
      const payload: any = {};
      if (searchType === "order_id") {
        payload.order_id = searchTerm;
      } else {
        payload.email = searchTerm;
        payload.store_id = store!.id;
      }
      const resp = await supabase.functions.invoke("check-order-status", { body: payload });
      if (resp.error) throw resp.error;
      return resp.data as { orders: EnrichedOrder[] };
    },
    enabled: !!searchTerm && (searchType === "order_id" || !!store?.id),
  });

  const orders = ordersData?.orders || [];
  const theme = (store?.theme_config as any) || {};
  const accentColor = theme.accent || theme.primary || "#6366f1";
  const products = ((store?.metadata as any)?.products || []).map((p: any) => ({
    title: p.title,
    price: p.piecePrice,
    brandName: p.brandName,
  }));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const val = lookupValue.trim();
    if (!val) return;
    // Detect if it's a UUID (order ID) or email
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);
    setSearchType(isUuid ? "order_id" : "email");
    setSearchTerm(isUuid ? val : val.toLowerCase());
  };

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/80 border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to={`/store/${slug}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            {store?.logo_url ? (
              <img src={store.logo_url} alt="" className="h-9 w-9 rounded-lg object-contain" />
            ) : (
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Store className="h-4 w-4 text-primary" />
              </div>
            )}
            <div>
              <span className="font-bold text-foreground">{store?.store_name || "Store"}</span>
              <span className="text-muted-foreground text-xs block">Order Tracking</span>
            </div>
          </Link>
          {store?.ai_voice_enabled && store?.ai_voice_number && (
            <a
              href={`tel:${store.ai_voice_number}`}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors bg-primary/10 text-primary hover:bg-primary/20"
            >
              <Phone className="h-3.5 w-3.5" />
              Call Support
            </a>
          )}
        </div>
      </header>

      <div className="max-w-3xl mx-auto p-6 space-y-8">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3 pt-4"
        >
          <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center bg-primary/10">
            <Package className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Track Your Order</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Enter your order number or email address to get real-time updates on your order status.
          </p>
        </motion.div>

        {/* Search Form */}
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSearch}
          className="flex gap-2"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Order number or email address"
              value={lookupValue}
              onChange={(e) => setLookupValue(e.target.value)}
              className="pl-10 h-12 rounded-xl text-base"
              required
            />
          </div>
          <Button type="submit" className="h-12 px-6 rounded-xl gap-2">
            <Search className="h-4 w-4" /> Track
          </Button>
        </motion.form>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* No results */}
        {searchTerm && !isLoading && orders.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 space-y-3"
          >
            <ShoppingBag className="h-12 w-12 text-muted-foreground/30 mx-auto" />
            <p className="text-muted-foreground">No orders found. Double-check your order number or email.</p>
          </motion.div>
        )}

        {/* Order Results */}
        <AnimatePresence mode="wait">
          {orders.length > 0 && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <p className="text-sm text-muted-foreground font-medium">
                {orders.length} order{orders.length !== 1 ? "s" : ""} found
              </p>

              {orders.map((order) => {
                const isExpanded = expandedOrder === order.id;
                return (
                  <Card key={order.id} className="border-border overflow-hidden">
                    <CardContent className="p-0">
                      {/* Order Header */}
                      <button
                        onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                        className="w-full p-5 flex items-center justify-between text-left hover:bg-muted/30 transition-colors"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-foreground">
                              Order #{order.id.slice(0, 8).toUpperCase()}
                            </span>
                            <Badge
                              variant={order.status === "delivered" ? "default" : "secondary"}
                              className="text-[10px]"
                            >
                              {order.status_label}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {format(parseISO(order.created_at), "MMM dd, yyyy 'at' h:mm a")}
                            {" · "}${Number(order.total).toFixed(2)}
                          </p>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        )}
                      </button>

                      {/* Expanded Details */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 pb-5 space-y-5 border-t border-border pt-5">
                              {/* Fulfillment Groups (multi-source) */}
                              {(order.fulfillment_groups && order.fulfillment_groups.length > 1) ? (
                                order.fulfillment_groups.map((group: FulfillmentGroup, gi: number) => (
                                  <div key={gi} className="space-y-3">
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline" className="text-[10px]">
                                        {group.source === "printful" ? "Print-on-Demand" : group.decorator ? `Decorator: ${group.decorator}` : "Apparel"}
                                      </Badge>
                                      <Badge variant={group.status === "shipped" || group.status === "delivered" ? "default" : "secondary"} className="text-[10px]">
                                        {group.statusLabel}
                                      </Badge>
                                    </div>
                                    {group.trackingNumber && (
                                      <div className="flex items-center gap-2 text-xs">
                                        <Truck className="w-3 h-3 text-primary" />
                                        {group.trackingUrl ? (
                                          <a href={group.trackingUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                                            {group.carrier && `${group.carrier}: `}{group.trackingNumber}
                                          </a>
                                        ) : (
                                          <span className="text-muted-foreground">{group.carrier && `${group.carrier}: `}{group.trackingNumber}</span>
                                        )}
                                      </div>
                                    )}
                                    {group.estimatedDelivery && (
                                      <p className="text-xs text-muted-foreground">Est. delivery: {group.estimatedDelivery}</p>
                                    )}
                                    {renderTimeline(group.timeline)}
                                    <div className="text-xs text-muted-foreground space-y-1">
                                      {(group.items || []).map((item: any, ii: number) => (
                                        <p key={ii}>{item.title} {item.color && `· ${item.color}`} {item.size && `· ${item.size}`} × {item.qty}</p>
                                      ))}
                                    </div>
                                    {gi < (order.fulfillment_groups?.length || 0) - 1 && <hr className="border-border" />}
                                  </div>
                                ))
                              ) : (
                                <>
                                  <div className="space-y-1">
                                    <p className="text-sm font-semibold text-foreground mb-3">Order Progress</p>
                                    {renderTimeline(order.timeline)}
                                  </div>
                                </>
                              )}

                              {/* Items */}
                              <div className="space-y-2">
                                <p className="text-sm font-semibold text-foreground">Items</p>
                                {((order.items as any[]) || []).map((item: any, i: number) => (
                                  <div key={i} className="flex justify-between text-sm py-1.5 border-b border-border last:border-0">
                                    <span className="text-muted-foreground">
                                      {item.title}
                                      {item.color && ` · ${item.color}`}
                                      {item.size && ` · ${item.size}`}
                                      {" × "}{item.qty}
                                    </span>
                                    <span className="font-medium text-foreground">
                                      ${((item.price || 0) * (item.qty || 1)).toFixed(2)}
                                    </span>
                                  </div>
                                ))}
                                <div className="flex justify-between font-bold pt-2 text-foreground">
                                  <span>Total</span>
                                  <span>${Number(order.total).toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Voice agent CTA */}
        {store?.ai_voice_enabled && store?.ai_voice_number && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl border border-border p-5 flex items-center gap-4 bg-muted/30"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Phone className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">Need help? Call our AI Support Agent</p>
              <p className="text-xs text-muted-foreground">Available 24/7 for order status, returns, and more.</p>
            </div>
            <a
              href={`tel:${store.ai_voice_number}`}
              className="px-5 py-2.5 rounded-full text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {store.ai_voice_number}
            </a>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-muted-foreground border-t border-border mt-12">
        <p>Powered by <span className="font-semibold">Brand-Shop.AI</span></p>
      </footer>

      {/* AI Chat Widget (conditional) */}
      {store?.ai_chat_enabled && (
        <StorefrontChatWidget
          storeName={store?.store_name || "Store"}
          products={products}
          accentColor={accentColor}
        />
      )}
    </div>
  );
}

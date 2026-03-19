import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, ShoppingBag, Store } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO } from "date-fns";

export default function CustomerOrders() {
  const { slug } = useParams();
  const [email, setEmail] = useState("");
  const [searchEmail, setSearchEmail] = useState("");

  const { data: store } = useQuery({
    queryKey: ["customer-store", slug],
    queryFn: async () => {
      const { data, error } = await supabase.from("stores").select("id, store_name, logo_url").eq("slug", slug!).single();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  const { data: orders, isLoading } = useQuery({
    queryKey: ["customer-orders", store?.id, searchEmail],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("store_id", store!.id)
        .eq("customer_email", searchEmail)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!store?.id && !!searchEmail,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchEmail(email.trim().toLowerCase());
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4 flex items-center gap-3">
        {store?.logo_url && <img src={store.logo_url} alt="" className="h-6 w-6 rounded object-contain" />}
        <span className="font-bold">{store?.store_name || "Store"}</span>
        <span className="text-muted-foreground text-sm ml-1">— Order History</span>
      </header>

      <div className="max-w-xl mx-auto p-6 space-y-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="email"
            placeholder="Enter your email to look up orders"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit"><Search className="h-4 w-4 mr-1" /> Look Up</Button>
        </form>

        {isLoading && (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {searchEmail && !isLoading && (!orders || orders.length === 0) && (
          <div className="text-center py-8 space-y-2">
            <ShoppingBag className="h-10 w-10 text-muted-foreground mx-auto" />
            <p className="text-sm text-muted-foreground">No orders found for {searchEmail}</p>
          </div>
        )}

        {orders && orders.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">{orders.length} order(s) found</p>
            {orders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {format(parseISO(order.created_at), "MMM dd, yyyy")}
                    </span>
                    <Badge variant={order.status === "pending" ? "secondary" : "default"}>
                      {order.status}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    {((order.items as any[]) || []).map((item: any, i: number) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{item.title} × {item.qty}</span>
                        <span>${((item.price || 0) * (item.qty || 1)).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between font-bold pt-1 border-t border-border">
                    <span>Total</span>
                    <span>${Number(order.total).toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

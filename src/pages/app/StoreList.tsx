import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Store, Plus, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

async function fetchStores() {
  const { data, error } = await supabase
    .from("stores")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export default function StoreList() {
  const navigate = useNavigate();

  const { data: stores, isLoading } = useQuery({
    queryKey: ["stores"],
    queryFn: fetchStores,
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Stores</h1>
          <p className="text-muted-foreground text-sm">All your branded storefronts</p>
        </div>
        <Button onClick={() => navigate("/app/onboarding")}><Plus className="mr-1 h-4 w-4" />New Store</Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : !stores?.length ? (
        <div className="text-center py-16 space-y-3">
          <Store className="h-10 w-10 text-muted-foreground mx-auto" />
          <p className="text-sm text-muted-foreground">No stores yet. Create your first store to get started.</p>
          <Button onClick={() => navigate("/app/onboarding")}>Create Store</Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stores.map((s) => (
            <Card key={s.id} className="cursor-pointer hover:border-primary/40 transition-colors" onClick={() => navigate(`/app/stores/${s.id}`)}>
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {s.logo_url ? (
                      <img src={s.logo_url} alt="" className="h-5 w-5 rounded object-contain" />
                    ) : (
                      <Store className="h-5 w-5 text-primary" />
                    )}
                    <p className="font-semibold">{s.store_name}</p>
                  </div>
                  <Badge variant={s.status === "live" ? "default" : "secondary"}>{s.status}</Badge>
                </div>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>{s.client_name || "No client"}</span>
                  <span>{s.brand_vertical}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

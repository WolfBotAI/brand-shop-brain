import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Store, Plus, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MOCK_STORES = [
  { id: "riverside-hs", name: "Riverside High School", status: "live", products: 48, orders: 12 },
  { id: "downtown-dental", name: "Downtown Dental", status: "draft", products: 22, orders: 0 },
  { id: "techcorp", name: "TechCorp Inc.", status: "live", products: 65, orders: 34 },
];

export default function StoreList() {
  const navigate = useNavigate();
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Stores</h1>
          <p className="text-muted-foreground text-sm">All your branded storefronts</p>
        </div>
        <Button onClick={() => navigate("/app/onboarding")}><Plus className="mr-1 h-4 w-4" />New Store</Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOCK_STORES.map((s) => (
          <Card key={s.id} className="cursor-pointer hover:border-primary/40 transition-colors" onClick={() => navigate(`/app/stores/${s.id}`)}>
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Store className="h-5 w-5 text-primary" />
                  <p className="font-semibold">{s.name}</p>
                </div>
                <Badge variant={s.status === "live" ? "default" : "secondary"}>{s.status}</Badge>
              </div>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span>{s.products} products</span>
                <span>{s.orders} orders</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

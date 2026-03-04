import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Truck, Plus, CheckCircle2, AlertTriangle, RefreshCw } from "lucide-react";

const MOCK_SUPPLIERS = [
  { name: "S&S Activewear", type: "Supplier", status: "connected", lastSync: "2 min ago" },
  { name: "SanMar", type: "Supplier", status: "connected", lastSync: "5 min ago" },
  { name: "Alphabroder", type: "Supplier", status: "error", lastSync: "Failed" },
  { name: "PrintShop Pro", type: "Decorator", status: "connected", lastSync: "1 min ago" },
  { name: "StitchWorks", type: "Decorator", status: "connected", lastSync: "3 min ago" },
  { name: "Printavo", type: "Platform", status: "connected", lastSync: "Real-time" },
];

export default function Suppliers() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Integrations</h1>
          <p className="text-muted-foreground text-sm">Manage supplier, decorator, and platform connections</p>
        </div>
        <Button><Plus className="mr-1 h-4 w-4" />Add Integration</Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOCK_SUPPLIERS.map((s) => (
          <Card key={s.name}>
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-muted-foreground" />
                  <p className="font-semibold">{s.name}</p>
                </div>
                <Badge variant="secondary">{s.type}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  {s.status === "connected" ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
                  )}
                  <span className={s.status === "connected" ? "text-green-600" : "text-destructive"}>
                    {s.status === "connected" ? "Connected" : "Error"}
                  </span>
                </div>
                <span className="text-muted-foreground text-xs">{s.lastSync}</span>
              </div>
              <Button variant="outline" size="sm" className="w-full"><RefreshCw className="mr-1 h-3 w-3" />Re-sync</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Truck, Plus, CheckCircle2, AlertTriangle, RefreshCw, Loader2 } from "lucide-react";
import { fetchSupplierAccounts } from "@/lib/api/suppliers";
import { fetchIntegrationStatus } from "@/lib/api/dashboard";
import { SEO } from "@/components/seo/SEO";

export default function Suppliers() {
  const integrations = useQuery({
    queryKey: ["integrations-status"],
    queryFn: fetchIntegrationStatus,
    retry: 1,
  });

  const suppliers = useQuery({
    queryKey: ["supplier-accounts"],
    queryFn: fetchSupplierAccounts,
    retry: 1,
  });

  const isLoading = integrations.isLoading || suppliers.isLoading;

  // Merge integration status + supplier accounts into a unified list
  const items = (integrations.data?.integrations ?? []).map((intg) => ({
    name: intg.name,
    type: "Platform",
    status: intg.status === "connected" || (intg.status as string) === "active" || (intg.status as string) === "Handled-In-Ghl" ? "connected" : intg.status,
    lastSync: intg.lastChecked ? new Date(intg.lastChecked).toLocaleString() : intg.details ?? "—",
  }));

  return (
    <div className="p-6 space-y-6">
      <SEO title="Integrations | Brand-Shop.AI" description="Connect suppliers, decorators, and fulfillment integrations powering your branded stores." path="/app/suppliers" noIndex />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Integrations</h1>
          <p className="text-muted-foreground text-sm">Manage supplier, decorator, and platform connections</p>
        </div>
        <Button><Plus className="mr-1 h-4 w-4" />Add Integration</Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : items.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-16">No integrations configured yet. Complete onboarding to get started.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((s) => (
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
                      {s.status === "connected" ? "Connected" : s.status}
                    </span>
                  </div>
                  <span className="text-muted-foreground text-xs">{s.lastSync}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => integrations.refetch()}
                >
                  <RefreshCw className="mr-1 h-3 w-3" />Re-sync
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

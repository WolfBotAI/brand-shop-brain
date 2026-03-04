import { useParams, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Store, ShoppingBag, DollarSign, Image, Globe, CreditCard, CheckCircle2 } from "lucide-react";

const StoreWorkspace = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/app/dashboard")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Store className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Store Workspace</h1>
            <p className="text-sm text-muted-foreground">ID: {storeId}</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="catalog">Catalog</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="mockups">Mockups</TabsTrigger>
          <TabsTrigger value="storefront">Storefront</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Store className="w-5 h-5" /> Store Overview</CardTitle>
              <CardDescription>Your store is being provisioned. Product sync is in progress.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Status", value: "Syncing Products", icon: CheckCircle2 },
                  { label: "Theme", value: "Applied", icon: Globe },
                  { label: "Billing", value: "Brand-Shop Managed", icon: CreditCard },
                  { label: "Products", value: "Loading…", icon: ShoppingBag },
                ].map((item) => (
                  <Card key={item.label} className="border-border">
                    <CardContent className="p-4 flex items-center gap-3">
                      <item.icon className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">{item.label}</p>
                        <p className="text-sm font-medium text-foreground">{item.value}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="catalog">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ShoppingBag className="w-5 h-5" /> Catalog</CardTitle>
              <CardDescription>Products selected during store creation are syncing from the Brand-Shop Catalog.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
                Product catalog will appear here once sync completes.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><DollarSign className="w-5 h-5" /> Pricing Rules</CardTitle>
              <CardDescription>Set markup rules and pricing tiers for your products.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
                Pricing configuration coming soon.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mockups">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Image className="w-5 h-5" /> Mockup Studio</CardTitle>
              <CardDescription>Generate and manage product mockups with your client's branding.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
                AI-powered mockup studio coming soon.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="storefront">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Globe className="w-5 h-5" /> Storefront</CardTitle>
              <CardDescription>Preview and publish your branded storefront.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
                Storefront preview and publishing coming soon.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><CreditCard className="w-5 h-5" /> Billing</CardTitle>
              <CardDescription>Payment configuration for this store.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
                Billing details and payment method management coming soon.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StoreWorkspace;

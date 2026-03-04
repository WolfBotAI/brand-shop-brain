import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Store, ShoppingBag, DollarSign, Image, Globe, CreditCard, CheckCircle2, ExternalLink, Copy } from "lucide-react";
import { StorefrontPreview, type ThemeConfig } from "@/components/app/store/StorefrontPreview";
import type { SSStyle } from "@/lib/api/ssProducts";
import { useToast } from "@/hooks/use-toast";

const StoreWorkspace = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Receive store data from onboarding navigation state
  const state = location.state as {
    storeName?: string;
    products?: SSStyle[];
    theme?: ThemeConfig;
    logoUrl?: string;
  } | null;

  const storeName = state?.storeName || "My Store";
  const products = state?.products || [];
  const theme: ThemeConfig = state?.theme || {
    primary: "#2d3436", secondary: "#0984e3", accent: "#fdcb6e", background: "#ffffff",
  };
  const logoUrl = state?.logoUrl || theme.logoUrl;

  const storeUrl = `${window.location.origin}/app/stores/${storeId}`;

  const copyLink = () => {
    navigator.clipboard.writeText(storeUrl);
    toast({ title: "Link copied!", description: "Share this link with your client." });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/app/dashboard")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-3 flex-1">
          {logoUrl ? (
            <img src={logoUrl} alt="Store logo" className="w-10 h-10 rounded-lg object-contain bg-muted p-1" />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Store className="w-5 h-5 text-primary" />
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold text-foreground">{storeName}</h1>
            <p className="text-sm text-muted-foreground">ID: {storeId}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={copyLink}>
            <Copy className="w-3.5 h-3.5" /> Copy Link
          </Button>
          <Button size="sm" className="gap-2" onClick={() => window.open(storeUrl, "_blank")}>
            <ExternalLink className="w-3.5 h-3.5" /> View Store
          </Button>
        </div>
      </div>

      <Tabs defaultValue="storefront" className="space-y-4">
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="storefront">Storefront</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="catalog">Catalog</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="mockups">Mockups</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        {/* Storefront Preview Tab — default */}
        <TabsContent value="storefront">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Globe className="w-5 h-5" /> Live Storefront Preview</CardTitle>
                <CardDescription>This is what your customers see. Products, theme, and branding are live.</CardDescription>
              </CardHeader>
              <CardContent>
                {products.length > 0 ? (
                  <StorefrontPreview
                    storeName={storeName}
                    products={products}
                    theme={theme}
                    logoUrl={logoUrl}
                  />
                ) : (
                  <div className="rounded-lg border border-border p-8 text-center space-y-3">
                    <Store className="w-10 h-10 text-muted-foreground mx-auto" />
                    <p className="text-sm text-muted-foreground">
                      Your storefront is being provisioned. Products will appear once the catalog sync completes.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

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
                  { label: "Products", value: `${products.length} items`, icon: ShoppingBag },
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
              <CardDescription>Products selected during store creation.</CardDescription>
            </CardHeader>
            <CardContent>
              {products.length > 0 ? (
                <div className="grid grid-cols-3 gap-4">
                  {products.map((p) => (
                    <div key={p.styleID} className="rounded-lg border border-border overflow-hidden">
                      {p.styleImage && <img src={p.styleImage} alt={p.title} className="w-full h-24 object-cover" />}
                      <div className="p-2">
                        <p className="text-xs font-medium truncate">{p.title}</p>
                        <p className="text-xs text-muted-foreground">${(p.piecePrice || 0).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
                  Product catalog will appear here once sync completes.
                </div>
              )}
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

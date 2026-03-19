import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Store, ShoppingBag, DollarSign, Image, Globe, CreditCard, CheckCircle2, ExternalLink, Copy, Loader2, Save, Upload, Bot, Phone, Download, FileSpreadsheet, Settings2 } from "lucide-react";
import { StorefrontPreview, type ThemeConfig } from "@/components/app/store/StorefrontPreview";
import { fetchStyleById, type SSStyle } from "@/lib/api/ssProducts";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { StorefrontPreview, type ThemeConfig } from "@/components/app/store/StorefrontPreview";
import { fetchStyleById, type SSStyle } from "@/lib/api/ssProducts";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// --- Pricing helpers ---
interface PricingConfig {
  globalMarkup: number;
  categoryOverrides: Record<string, number>;
}

const DEFAULT_PRICING: PricingConfig = { globalMarkup: 40, categoryOverrides: {} };

const StoreWorkspace = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const navState = location.state as {
    storeName?: string;
    products?: SSStyle[];
    theme?: ThemeConfig;
    logoUrl?: string;
  } | null;

  const { data: dbStore, isLoading } = useQuery({
    queryKey: ["store", storeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stores")
        .select("*")
        .eq("id", storeId!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!storeId,
  });

  const storeName = navState?.storeName || dbStore?.store_name || "My Store";
  const products = navState?.products || [];
  const dbTheme = dbStore?.theme_config as unknown as ThemeConfig | null;
  const theme: ThemeConfig = navState?.theme || dbTheme || {
    primary: "#2d3436", secondary: "#0984e3", accent: "#fdcb6e", background: "#ffffff",
  };
  const logoUrl = navState?.logoUrl || dbStore?.logo_url || theme.logoUrl;
  const metadata = (dbStore?.metadata as any) || {};

  // --- Pricing state ---
  const [pricing, setPricing] = useState<PricingConfig>(metadata.pricing || DEFAULT_PRICING);

  useEffect(() => {
    if (metadata.pricing) setPricing(metadata.pricing);
  }, [dbStore]);

  const savePricing = useMutation({
    mutationFn: async (newPricing: PricingConfig) => {
      const { error } = await supabase
        .from("stores")
        .update({ metadata: { ...metadata, pricing: newPricing } } as any)
        .eq("id", storeId!);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store", storeId] });
      toast({ title: "Pricing saved" });
    },
  });

  // --- Mockup state ---
  const [mockupLogo, setMockupLogo] = useState<string | null>(logoUrl || null);

  const storeUrl = dbStore?.slug
    ? `${window.location.origin}/store/${dbStore.slug}`
    : `${window.location.origin}/app/stores/${storeId}`;

  const copyLink = () => {
    navigator.clipboard.writeText(storeUrl);
    toast({ title: "Link copied!", description: "Share this link with your client." });
  };

  if (isLoading && !navState) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const calcRetail = (cost: number) => +(cost * (1 + pricing.globalMarkup / 100)).toFixed(2);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/app/stores")}>
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
            <p className="text-sm text-muted-foreground">
              {dbStore?.status && <span className="capitalize">{dbStore.status} · </span>}
              {dbStore?.client_name || ""}
            </p>
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

        {/* Storefront */}
        <TabsContent value="storefront">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Globe className="w-5 h-5" /> Live Storefront Preview</CardTitle>
              <CardDescription>This is what your customers see.</CardDescription>
            </CardHeader>
            <CardContent>
              {products.length > 0 ? (
                <StorefrontPreview storeName={storeName} products={products} theme={theme} logoUrl={logoUrl} />
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
        </TabsContent>

        {/* Overview */}
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Store className="w-5 h-5" /> Store Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Status", value: dbStore?.status ?? "Syncing", icon: CheckCircle2 },
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

        {/* Catalog */}
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

        {/* Pricing */}
        <TabsContent value="pricing">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><DollarSign className="w-5 h-5" /> Pricing Rules</CardTitle>
              <CardDescription>Set a global markup percentage. Your retail price = Your Cost × (1 + markup%).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Global Markup</Label>
                  <span className="text-lg font-bold text-primary">{pricing.globalMarkup}%</span>
                </div>
                <Slider
                  value={[pricing.globalMarkup]}
                  onValueChange={([v]) => setPricing({ ...pricing, globalMarkup: v })}
                  min={0}
                  max={200}
                  step={5}
                />
              </div>

              {products.length > 0 && (
                <div className="space-y-2">
                  <Label>Price Preview</Label>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right">Your Cost</TableHead>
                        <TableHead className="text-right">Retail ({pricing.globalMarkup}%)</TableHead>
                        <TableHead className="text-right">Margin</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.slice(0, 8).map((p) => {
                        const cost = p.customerPrice || p.piecePrice || 0;
                        const retail = calcRetail(cost);
                        const margin = retail - cost;
                        return (
                          <TableRow key={p.styleID}>
                            <TableCell className="text-sm">{p.title}</TableCell>
                            <TableCell className="text-right text-sm">${cost.toFixed(2)}</TableCell>
                            <TableCell className="text-right text-sm font-medium">${retail.toFixed(2)}</TableCell>
                            <TableCell className="text-right text-sm text-green-600">${margin.toFixed(2)}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}

              <Button
                onClick={() => savePricing.mutate(pricing)}
                disabled={savePricing.isPending}
                className="gap-2"
              >
                {savePricing.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Pricing
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mockups */}
        <TabsContent value="mockups">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Image className="w-5 h-5" /> Mockup Studio</CardTitle>
              <CardDescription>Preview your logo on products. Upload a logo to generate mockups.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                {mockupLogo ? (
                  <img src={mockupLogo} alt="Logo" className="w-16 h-16 rounded-lg object-contain bg-muted p-2 border border-border" />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center border border-border">
                    <Upload className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}
                <div className="space-y-1">
                  <p className="text-sm font-medium">{mockupLogo ? "Logo uploaded" : "No logo"}</p>
                  <p className="text-xs text-muted-foreground">Your logo from onboarding is used for mockups.</p>
                </div>
              </div>

              {products.length > 0 && mockupLogo ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {products.slice(0, 6).map((p) => (
                    <div key={p.styleID} className="rounded-lg border border-border overflow-hidden relative">
                      {p.styleImage ? (
                        <div className="relative">
                          <img src={p.styleImage} alt={p.title} className="w-full h-40 object-cover" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <img src={mockupLogo} alt="Logo overlay" className="w-12 h-12 object-contain opacity-80 drop-shadow-lg" />
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-40 bg-muted flex items-center justify-center">
                          <img src={mockupLogo} alt="Logo overlay" className="w-12 h-12 object-contain" />
                        </div>
                      )}
                      <div className="p-2">
                        <p className="text-xs font-medium truncate">{p.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-32 flex items-center justify-center text-muted-foreground text-sm rounded-lg border border-dashed border-border">
                  {!mockupLogo ? "Upload a logo to preview mockups." : "Add products to your catalog first."}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing */}
        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><CreditCard className="w-5 h-5" /> Billing</CardTitle>
              <CardDescription>Payment configuration for this store.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card className="border-border">
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground">Billing Model</p>
                    <p className="text-sm font-medium">Brand-Shop Managed</p>
                    <p className="text-xs text-muted-foreground mt-1">Payments are processed and managed by Brand-Shop.AI on your behalf.</p>
                  </CardContent>
                </Card>
                <Card className="border-border">
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground">Store Created</p>
                    <p className="text-sm font-medium">{dbStore?.created_at ? new Date(dbStore.created_at).toLocaleDateString() : "—"}</p>
                  </CardContent>
                </Card>
                <Card className="border-border">
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground">Plan Tier</p>
                    <p className="text-sm font-medium">Professional</p>
                    <p className="text-xs text-muted-foreground mt-1">Includes unlimited products, AI mockups, and priority support.</p>
                  </CardContent>
                </Card>
                <Card className="border-border">
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground">Payment Status</p>
                    <p className="text-sm font-medium text-green-600">Active</p>
                  </CardContent>
                </Card>
              </div>
              <p className="text-xs text-muted-foreground">To update your billing plan or payment method, contact your Brand-Shop.AI account manager.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StoreWorkspace;

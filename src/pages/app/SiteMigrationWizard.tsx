import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Globe, ArrowRight, Loader2, CheckCircle2, Palette, Store } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { firecrawlApi } from "@/lib/api/firecrawl";

type Step = "url" | "scraping" | "review" | "importing" | "done";

interface ScrapedData {
  storeName: string;
  colors: { primary: string; secondary: string; accent: string; background: string };
  logoUrl?: string;
  products: Array<{ title: string; description: string; price?: string; image?: string }>;
  markdown?: string;
}

export default function SiteMigrationWizard() {
  const [step, setStep] = useState<Step>("url");
  const [url, setUrl] = useState("");
  const [scraped, setScraped] = useState<ScrapedData | null>(null);
  const [storeName, setStoreName] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleScrape = async () => {
    if (!url.trim()) return;
    setStep("scraping");

    try {
      const res = await firecrawlApi.scrape(url, { formats: ["markdown", "branding", "links"] as any });

      if (!res.success) {
        toast({ title: "Scrape failed", description: res.error || "Could not scrape the URL", variant: "destructive" });
        setStep("url");
        return;
      }

      const data = res.data || res;
      const branding = data.branding || {};
      const colors = branding.colors || {};

      const parsed: ScrapedData = {
        storeName: data.metadata?.title || new URL(url).hostname.replace(/^www\./, ""),
        colors: {
          primary: colors.primary || "#2d3436",
          secondary: colors.secondary || "#0984e3",
          accent: colors.accent || "#fdcb6e",
          background: colors.background || "#ffffff",
        },
        logoUrl: branding.images?.logo || branding.logo || undefined,
        products: [],
        markdown: data.markdown,
      };

      setScraped(parsed);
      setStoreName(parsed.storeName);
      setStep("review");
    } catch (err) {
      console.error("Scrape error:", err);
      toast({ title: "Error", description: "Failed to scrape the website", variant: "destructive" });
      setStep("url");
    }
  };

  const handleImport = async () => {
    if (!user || !scraped) return;
    setStep("importing");

    try {
      const slug = storeName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 50);

      const { error } = await supabase.from("stores").insert({
        user_id: user.id,
        store_name: storeName,
        client_name: storeName,
        brand_vertical: "other",
        status: "draft",
        slug: `${slug}-${Date.now().toString(36)}`,
        logo_url: scraped.logoUrl || null,
        theme_config: {
          primary: scraped.colors.primary,
          secondary: scraped.colors.secondary,
          accent: scraped.colors.accent,
          background: scraped.colors.background,
        },
        metadata: { source: "migration", sourceUrl: url },
      } as any);

      if (error) throw error;
      setStep("done");
    } catch (err) {
      console.error("Import error:", err);
      toast({ title: "Import failed", description: "Could not create the store", variant: "destructive" });
      setStep("review");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Site Migration</h1>
        <p className="text-muted-foreground text-sm">Import an existing store into Brand-Shop.AI</p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 text-sm">
        {["Enter URL", "Scraping", "Review", "Importing", "Done"].map((label, i) => {
          const steps: Step[] = ["url", "scraping", "review", "importing", "done"];
          const active = steps.indexOf(step) >= i;
          return (
            <div key={label} className="flex items-center gap-2">
              {i > 0 && <ArrowRight className="h-3 w-3 text-muted-foreground" />}
              <Badge variant={active ? "default" : "secondary"}>{label}</Badge>
            </div>
          );
        })}
      </div>

      {step === "url" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><Globe className="h-4 w-4" />Enter Store URL</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="https://existingstore.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">We'll scrape the site to extract branding, colors, and product information.</p>
            <Button onClick={handleScrape} disabled={!url.trim()}>
              Start Migration <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {step === "scraping" && (
        <Card>
          <CardContent className="p-8 flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Analyzing {url}…</p>
          </CardContent>
        </Card>
      )}

      {step === "review" && scraped && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><Palette className="h-4 w-4" />Extracted Branding</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Store Name</label>
                <Input value={storeName} onChange={(e) => setStoreName(e.target.value)} />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">Colors:</span>
                {Object.entries(scraped.colors).map(([key, val]) => (
                  <div key={key} className="flex items-center gap-1">
                    <div className="w-6 h-6 rounded border border-border" style={{ backgroundColor: val }} />
                    <span className="text-xs text-muted-foreground">{key}</span>
                  </div>
                ))}
              </div>
              {scraped.logoUrl && (
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">Logo:</span>
                  <img src={scraped.logoUrl} alt="Logo detected on the scraped website" className="h-8 w-8 rounded object-contain border border-border" />
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep("url")}>Back</Button>
            <Button onClick={handleImport} className="flex-1">
              Import as New Store <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {step === "importing" && (
        <Card>
          <CardContent className="p-8 flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Creating your store…</p>
          </CardContent>
        </Card>
      )}

      {step === "done" && (
        <Card>
          <CardContent className="p-8 flex flex-col items-center gap-4">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
            <h2 className="text-lg font-bold">Migration Complete!</h2>
            <p className="text-sm text-muted-foreground text-center">
              Your store "{storeName}" has been created with the extracted branding.
              Head to the Stores page to customize products and pricing.
            </p>
            <Button onClick={() => navigate("/app/stores")}>
              <Store className="mr-2 h-4 w-4" /> Go to Stores
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

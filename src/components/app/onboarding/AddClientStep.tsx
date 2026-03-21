import { useState } from "react";
import { motion } from "framer-motion";
import { Users, ArrowRight, Loader2, Upload, X, Palette, Sparkles, SkipForward, Pipette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import type { SelectedProduct } from "./CatalogSetupStep";
import type { PricingRules } from "./PricingStep";
import type { ThemeConfig } from "@/components/app/store/StorefrontPreview";

interface AddClientStepProps {
  catalogId: string;
  products: SelectedProduct[];
  pricingRules: PricingRules;
  onNext: (data: { storeId: string; storeName: string; products: SelectedProduct[]; theme: ThemeConfig; logoUrl: string | null }) => void;
  onSkip: () => void;
  onBack: () => void;
}

const templates: { id: string; name: string; theme: ThemeConfig; desc: string }[] = [
  {
    id: "clean-corporate",
    name: "Clean Corporate",
    theme: { primary: "#2d3436", secondary: "#0984e3", accent: "#dfe6e9", background: "#ffffff" },
    desc: "Professional and polished",
  },
  {
    id: "bold-athletics",
    name: "Bold Athletics",
    theme: { primary: "#1a1a2e", secondary: "#e94560", accent: "#f5f5f5", background: "#ffffff" },
    desc: "Energetic and dynamic",
  },
  {
    id: "modern-minimal",
    name: "Modern Minimal",
    theme: { primary: "#1a1a1a", secondary: "#ffffff", accent: "#c9c9c9", background: "#f8f8f8" },
    desc: "Simple and elegant",
  },
  {
    id: "school-spirit",
    name: "School Spirit",
    theme: { primary: "#2c3e50", secondary: "#e74c3c", accent: "#f39c12", background: "#ffffff" },
    desc: "Traditional school colors",
  },
];

const fontOptions = [
  "Inter", "Poppins", "Montserrat", "Roboto", "Playfair Display",
  "Oswald", "Raleway", "Lato", "Merriweather", "Bebas Neue",
];

export const AddClientStep = ({ catalogId, products, pricingRules, onNext, onSkip, onBack }: AddClientStepProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientWebsite, setClientWebsite] = useState("");
  const [clientLogoUrl, setClientLogoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("clean-corporate");
  const [storeAccess, setStoreAccess] = useState<"curated" | "self-service">("curated");
  const [creating, setCreating] = useState(false);

  // Custom theme
  const [useCustomTheme, setUseCustomTheme] = useState(false);
  const [customPrimary, setCustomPrimary] = useState("#1a1a2e");
  const [customSecondary, setCustomSecondary] = useState("#6366f1");
  const [customAccent, setCustomAccent] = useState("#f59e0b");
  const [customBackground, setCustomBackground] = useState("#ffffff");
  const [customFont, setCustomFont] = useState("Inter");

  const getActiveTheme = (): ThemeConfig => {
    if (useCustomTheme) {
      return { primary: customPrimary, secondary: customSecondary, accent: customAccent, background: customBackground, fontFamily: customFont };
    }
    const t = templates.find((t) => t.id === selectedTemplate);
    return t?.theme || templates[0].theme;
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/client-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("logos").upload(path, file, { upsert: true });
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from("logos").getPublicUrl(path);
      setClientLogoUrl(publicUrl);
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleCreate = async () => {
    if (!clientName.trim()) return;
    setCreating(true);
    try {
      const theme = getActiveTheme();
      const slug = clientName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Date.now().toString(36);
      const storeName = `${clientName.trim()} Store`;

      const productsForMetadata = products.map(({ selectedColors, selectedSizes, ...rest }) => ({
        ...rest,
        selectedColors,
        selectedSizes,
      }));

      const { data, error } = await supabase
        .from("stores")
        .insert({
          user_id: user!.id,
          tenant_id: `tenant-${user!.id.slice(0, 8)}`,
          store_name: storeName,
          client_name: clientName.trim(),
          brand_vertical: "other",
          logo_url: clientLogoUrl,
          theme_config: theme as any,
          status: "live",
          slug,
          metadata: {
            products: productsForMetadata,
            pricingRules,
            catalogId,
            clientEmail: clientEmail.trim(),
            clientPhone: clientPhone.trim(),
            clientWebsite: clientWebsite.trim(),
            storeAccess,
          },
        } as any)
        .select("id")
        .single();

      if (error) throw error;

      try {
        await supabase.functions.invoke("ghl-sync", {
          body: {
            action: "create_sub_account",
            payload: {
              store_name: storeName,
              store_id: data.id,
              owner_email: user!.email || clientEmail.trim(),
            },
          },
        });
      } catch (ghlErr) {
        console.warn("GHL sub-account creation failed (non-blocking):", ghlErr);
      }

      toast({ title: "Client store created!", description: `${storeName} is live.` });
      onNext({ storeId: data.id, storeName, products, theme, logoUrl: clientLogoUrl });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setCreating(false);
    }
  };

  const ColorInput = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <div className="flex items-center gap-2">
        <div className="relative">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-9 h-9 rounded-lg border border-border cursor-pointer p-0.5"
          />
        </div>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="h-9 text-xs font-mono w-28"
        />
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Add Your First Client</h2>
            <p className="text-muted-foreground">Create a branded store for your client</p>
          </div>
        </div>
      </div>

      {/* Client Info */}
      <Card className="border-border">
        <CardContent className="p-6 space-y-4">
          <h3 className="font-semibold text-foreground text-sm">Client Information</h3>
          <div className="space-y-2">
            <Label htmlFor="clientName">Client / Business Name *</Label>
            <Input id="clientName" placeholder="e.g. Lincoln High School" value={clientName} onChange={(e) => setClientName(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientEmail">Email</Label>
              <Input id="clientEmail" type="email" placeholder="client@example.com" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientPhone">Phone</Label>
              <Input id="clientPhone" placeholder="(555) 123-4567" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="clientWebsite">Website</Label>
            <Input id="clientWebsite" placeholder="https://client-site.com" value={clientWebsite} onChange={(e) => setClientWebsite(e.target.value)} />
          </div>

          {/* Client Logo */}
          <div className="space-y-2">
            <Label>Client Logo</Label>
            {clientLogoUrl ? (
              <div className="flex items-center gap-4">
                <img src={clientLogoUrl} alt="Client logo" className="w-14 h-14 object-contain rounded-lg border border-border" />
                <Button variant="ghost" size="sm" onClick={() => setClientLogoUrl(null)}>
                  <X className="w-4 h-4 mr-1" /> Remove
                </Button>
              </div>
            ) : (
              <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                {uploading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                ) : (
                  <>
                    <Upload className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Upload client logo</span>
                  </>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} disabled={uploading} />
              </label>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Template Selection */}
      <Card className="border-border">
        <CardContent className="p-6 space-y-4">
          <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
            <Palette className="w-4 h-4" /> Store Theme
          </h3>

          {/* Preset templates */}
          <div className="grid grid-cols-2 gap-3">
            {templates.map((t) => (
              <label
                key={t.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  !useCustomTheme && selectedTemplate === t.id ? "border-primary ring-1 ring-primary/30" : "border-border hover:border-primary/40"
                }`}
                onClick={() => { setSelectedTemplate(t.id); setUseCustomTheme(false); }}
              >
                <input type="radio" name="template" className="sr-only" />
                <div className="flex gap-1 mb-2">
                  <div className="w-5 h-5 rounded-full border border-border" style={{ backgroundColor: t.theme.primary }} />
                  <div className="w-5 h-5 rounded-full border border-border" style={{ backgroundColor: t.theme.secondary }} />
                  <div className="w-5 h-5 rounded-full border border-border" style={{ backgroundColor: t.theme.accent }} />
                </div>
                <p className="text-xs font-medium text-foreground">{t.name}</p>
                <p className="text-[10px] text-muted-foreground">{t.desc}</p>
              </label>
            ))}
          </div>

          {/* Custom theme toggle */}
          <div
            className={`p-4 rounded-lg border cursor-pointer transition-all ${
              useCustomTheme ? "border-primary ring-1 ring-primary/30 bg-primary/5" : "border-border hover:border-primary/40"
            }`}
            onClick={() => setUseCustomTheme(true)}
          >
            <div className="flex items-center gap-2 mb-3">
              <Pipette className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Custom Colors & Font</span>
            </div>

            {useCustomTheme && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <ColorInput label="Primary" value={customPrimary} onChange={setCustomPrimary} />
                  <ColorInput label="Secondary" value={customSecondary} onChange={setCustomSecondary} />
                  <ColorInput label="Accent" value={customAccent} onChange={setCustomAccent} />
                  <ColorInput label="Background" value={customBackground} onChange={setCustomBackground} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Font Family</Label>
                  <Select value={customFont} onValueChange={setCustomFont}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontOptions.map((f) => (
                        <SelectItem key={f} value={f}>{f}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* Preview */}
                <div className="rounded-lg overflow-hidden border border-border">
                  <div className="h-8" style={{ background: `linear-gradient(135deg, ${customPrimary}, ${customSecondary})` }} />
                  <div className="p-3 flex items-center gap-2" style={{ backgroundColor: customBackground, fontFamily: customFont }}>
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: customAccent }} />
                    <span className="text-xs" style={{ color: customPrimary, fontFamily: customFont }}>Preview text in {customFont}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Store Access */}
      <Card className="border-border">
        <CardContent className="p-6 space-y-3">
          <h3 className="font-semibold text-foreground text-sm">Client Store Access</h3>
          <RadioGroup value={storeAccess} onValueChange={(v) => setStoreAccess(v as any)} className="space-y-2">
            <label className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer ${storeAccess === "curated" ? "border-primary bg-primary/5" : "border-border"}`}>
              <RadioGroupItem value="curated" className="mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Curated Store</p>
                <p className="text-xs text-muted-foreground">You select products for the client — they see only what you assign</p>
              </div>
            </label>
            <label className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer ${storeAccess === "self-service" ? "border-primary bg-primary/5" : "border-border"}`}>
              <RadioGroupItem value="self-service" className="mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Self-Service Access</p>
                <p className="text-xs text-muted-foreground">Client can browse your catalog and pick their own products</p>
              </div>
            </label>
          </RadioGroup>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">Back</Button>
        <Button variant="ghost" onClick={onSkip} className="gap-1 text-muted-foreground">
          <SkipForward className="w-4 h-4" /> Skip for now
        </Button>
        <Button onClick={handleCreate} disabled={!clientName.trim() || creating} className="flex-1 gap-2">
          {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          Create Store
        </Button>
      </div>
    </motion.div>
  );
};

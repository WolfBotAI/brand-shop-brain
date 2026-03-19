import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { DollarSign, ArrowRight, Percent, Loader2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatBubble } from "@/components/features/ChatBubble";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { SelectedProduct } from "./CatalogSetupStep";

export interface PricingRules {
  globalMarkupPercent: number;
  globalMarkupDollar: number;
  categoryMarkups: Record<string, number>;
  itemMarkups: Record<number, number>;
  shippingAccount: string;
  decorationMethod: string;
}

interface PlatformFees {
  owner_markup_percent: number;
  decoration_fee_default: number;
  platform_surcharge_percent: number;
  default_shipping_fee: number;
  decoration_methods: { method: string; fee: number }[];
}

interface PricingStepProps {
  products: SelectedProduct[];
  catalogId: string;
  onNext: (rules: PricingRules) => void;
  onBack: () => void;
}

export const PricingStep = ({ products, catalogId, onNext, onBack }: PricingStepProps) => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [markupType, setMarkupType] = useState<"percent" | "dollar">("percent");
  const [globalPercent, setGlobalPercent] = useState(40);
  const [globalDollar, setGlobalDollar] = useState(0);
  const [categoryMarkups, setCategoryMarkups] = useState<Record<string, number>>({});
  const [itemMarkups, setItemMarkups] = useState<Record<number, number>>({});
  const [shippingAccount, setShippingAccount] = useState("brandshop");
  const [decorationMethod, setDecorationMethod] = useState("Screen Print");

  const [platformFees, setPlatformFees] = useState<PlatformFees | null>(null);

  // Seed itemMarkups from products that had per-item markup set in catalog step
  useEffect(() => {
    const fromCatalog: Record<number, number> = {};
    products.forEach((p) => {
      if (p.itemMarkup !== undefined) fromCatalog[p.styleID] = p.itemMarkup;
    });
    if (Object.keys(fromCatalog).length > 0) setItemMarkups((prev) => ({ ...fromCatalog, ...prev }));
  }, [products]);

  // Fetch platform fees
  useEffect(() => {
    supabase
      .from("platform_fees" as any)
      .select("*")
      .limit(1)
      .single()
      .then(({ data }: any) => {
        if (data) {
          setPlatformFees({
            owner_markup_percent: Number(data.owner_markup_percent) || 0,
            decoration_fee_default: Number(data.decoration_fee_default) || 0,
            platform_surcharge_percent: Number(data.platform_surcharge_percent) || 0,
            default_shipping_fee: Number(data.default_shipping_fee) || 0,
            decoration_methods: Array.isArray(data.decoration_methods) ? data.decoration_methods : [],
          });
        }
      });
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.baseCategory))),
    [products]
  );

  const getDecorationFee = (): number => {
    if (!platformFees) return 0;
    const method = platformFees.decoration_methods.find((m) => m.method === decorationMethod);
    return method?.fee ?? platformFees.decoration_fee_default;
  };

  const getDistributorMarkup = (product: SelectedProduct): number => {
    if (itemMarkups[product.styleID] !== undefined) return itemMarkups[product.styleID];
    if (categoryMarkups[product.baseCategory] !== undefined) return categoryMarkups[product.baseCategory];
    return markupType === "percent" ? globalPercent : globalDollar;
  };

  const getPriceBreakdown = (product: SelectedProduct) => {
    const baseCost = product.piecePrice || product.customerPrice || 0;
    const ownerMarkup = platformFees ? baseCost * (platformFees.owner_markup_percent / 100) : 0;
    const decorationFee = getDecorationFee();
    const shipping = platformFees?.default_shipping_fee || 0;
    const distributorMarkupVal = getDistributorMarkup(product);
    const afterOwner = baseCost + ownerMarkup;
    const distributorAdd = markupType === "percent"
      ? afterOwner * (distributorMarkupVal / 100)
      : distributorMarkupVal;
    const apparelSubtotal = afterOwner + distributorAdd;
    const platformSurcharge = platformFees ? apparelSubtotal * (platformFees.platform_surcharge_percent / 100) : 0;
    const finalPrice = apparelSubtotal + decorationFee + shipping + platformSurcharge;

    return { baseCost, ownerMarkup, decorationFee, shipping, distributorAdd, platformSurcharge, finalPrice, apparelSubtotal };
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const rules: PricingRules = {
        globalMarkupPercent: markupType === "percent" ? globalPercent : 0,
        globalMarkupDollar: markupType === "dollar" ? globalDollar : 0,
        categoryMarkups,
        itemMarkups,
        shippingAccount,
        decorationMethod,
      };

      if (catalogId) {
        await supabase
          .from("distributor_catalogs" as any)
          .update({ pricing_rules: rules, shipping_config: { account: shippingAccount } } as any)
          .eq("id", catalogId);
      }

      onNext(rules);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

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
            <DollarSign className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Set Your Pricing</h2>
            <p className="text-muted-foreground">Configure your markup and review the full price breakdown</p>
          </div>
        </div>
      </div>

      <ChatBubble
        message="The final retail price includes: base cost, platform markup, your distributor markup, decoration fee, shipping, and a platform surcharge. You control the distributor markup — everything else is set by Brand-Shop."
        delay={0.2}
      />

      {/* Platform Fee Summary */}
      {platformFees && (
        <Card className="border-border bg-muted/30">
          <CardContent className="p-4">
            <h3 className="font-semibold text-foreground text-sm mb-3 flex items-center gap-2">
              Platform Fee Structure
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger><Info className="w-3.5 h-3.5 text-muted-foreground" /></TooltipTrigger>
                  <TooltipContent><p className="text-xs max-w-[200px]">These fees are set by Brand-Shop and applied to all products.</p></TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex justify-between p-2 rounded bg-background border border-border">
                <span className="text-muted-foreground">Owner Markup</span>
                <span className="font-medium text-foreground">{platformFees.owner_markup_percent}%</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-background border border-border">
                <span className="text-muted-foreground">Platform Surcharge</span>
                <span className="font-medium text-foreground">{platformFees.platform_surcharge_percent}%</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-background border border-border">
                <span className="text-muted-foreground">Default Shipping</span>
                <span className="font-medium text-foreground">${platformFees.default_shipping_fee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-background border border-border">
                <span className="text-muted-foreground">Decoration</span>
                <span className="font-medium text-foreground">${getDecorationFee().toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Decoration Method */}
      {platformFees && platformFees.decoration_methods.length > 0 && (
        <Card className="border-border">
          <CardContent className="p-4 space-y-3">
            <h3 className="font-semibold text-foreground text-sm">Decoration Method</h3>
            <div className="flex flex-wrap gap-2">
              {platformFees.decoration_methods.map((m) => (
                <Badge
                  key={m.method}
                  variant={decorationMethod === m.method ? "default" : "outline"}
                  className="cursor-pointer text-xs"
                  onClick={() => setDecorationMethod(m.method)}
                >
                  {m.method} (${m.fee.toFixed(2)})
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Distributor Markup */}
      <Card className="border-border">
        <CardContent className="p-6 space-y-4">
          <h3 className="font-semibold text-foreground text-sm">Your Distributor Markup</h3>
          <Tabs value={markupType} onValueChange={(v) => setMarkupType(v as any)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="percent" className="gap-1"><Percent className="w-3 h-3" /> Percentage</TabsTrigger>
              <TabsTrigger value="dollar" className="gap-1"><DollarSign className="w-3 h-3" /> Dollar Amount</TabsTrigger>
            </TabsList>
            <TabsContent value="percent" className="mt-3">
              <div className="flex items-center gap-3">
                <Input type="number" min={0} max={500} value={globalPercent} onChange={(e) => setGlobalPercent(Number(e.target.value))} className="w-24" />
                <span className="text-sm text-muted-foreground">% markup on all products</span>
              </div>
            </TabsContent>
            <TabsContent value="dollar" className="mt-3">
              <div className="flex items-center gap-3">
                <div className="relative w-24">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input type="number" min={0} value={globalDollar} onChange={(e) => setGlobalDollar(Number(e.target.value))} className="pl-7" />
                </div>
                <span className="text-sm text-muted-foreground">added to each product</span>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Category Markups */}
      <Accordion type="single" collapsible>
        <AccordionItem value="category" className="border border-border rounded-lg">
          <AccordionTrigger className="px-4 py-3 text-sm hover:no-underline">Adjust by Category</AccordionTrigger>
          <AccordionContent className="px-4 pb-4 space-y-3">
            {categories.map((cat) => (
              <div key={cat} className="flex items-center justify-between gap-3">
                <span className="text-sm text-foreground">{cat}</span>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder={markupType === "percent" ? `${globalPercent}%` : `$${globalDollar}`}
                    value={categoryMarkups[cat] ?? ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCategoryMarkups((prev) => {
                        if (val === "") { const next = { ...prev }; delete next[cat]; return next; }
                        return { ...prev, [cat]: Number(val) };
                      });
                    }}
                    className="w-20 h-8 text-xs"
                  />
                  <span className="text-xs text-muted-foreground">{markupType === "percent" ? "%" : "$"}</span>
                </div>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Full Price Breakdown Preview */}
      <Card className="border-border">
        <CardContent className="p-4 space-y-2">
          <h3 className="font-semibold text-foreground text-sm mb-3">Price Breakdown Preview</h3>
          <div className="max-h-64 overflow-y-auto space-y-3 pr-1">
            {products.slice(0, 20).map((p) => {
              const bd = getPriceBreakdown(p);
              return (
                <div key={p.styleID} className="py-2 border-b border-border last:border-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{p.title}</p>
                      <p className="text-[10px] text-muted-foreground">{p.baseCategory}</p>
                    </div>
                    <span className="text-sm font-bold text-primary">${bd.finalPrice.toFixed(2)}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-[10px] text-muted-foreground">
                    <span>Base: ${bd.baseCost.toFixed(2)}</span>
                    <span>Owner: +${bd.ownerMarkup.toFixed(2)}</span>
                    <span>You: +${bd.distributorAdd.toFixed(2)}</span>
                    <span>Decor: +${bd.decorationFee.toFixed(2)}</span>
                    <span>Ship: +${bd.shipping.toFixed(2)}</span>
                    <span>Plat: +${bd.platformSurcharge.toFixed(2)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Shipping */}
      <Accordion type="single" collapsible>
        <AccordionItem value="shipping" className="border border-border rounded-lg">
          <AccordionTrigger className="px-4 py-3 text-sm hover:no-underline">Shipping Account</AccordionTrigger>
          <AccordionContent className="px-4 pb-4 space-y-3">
            <p className="text-xs text-muted-foreground">Choose how shipping is handled for your client stores.</p>
            <div className="space-y-2">
              {[
                { value: "brandshop", label: "Brand-Shop Shipping", desc: "We handle shipping rates and fulfillment" },
                { value: "fedex", label: "My FedEx Account", desc: "Use your own FedEx account for shipping" },
                { value: "ups", label: "My UPS Account", desc: "Use your own UPS account for shipping" },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    shippingAccount === opt.value ? "border-primary bg-primary/5" : "border-border"
                  }`}
                >
                  <input type="radio" name="shipping" value={opt.value} checked={shippingAccount === opt.value} onChange={() => setShippingAccount(opt.value)} className="mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{opt.label}</p>
                    <p className="text-xs text-muted-foreground">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">Back</Button>
        <Button onClick={handleSave} disabled={saving} className="flex-1 gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          Continue <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
};

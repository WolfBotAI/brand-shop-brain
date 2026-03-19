import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { DollarSign, ArrowRight, Percent, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatBubble } from "@/components/features/ChatBubble";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { SelectedProduct } from "./CatalogSetupStep";

export interface PricingRules {
  globalMarkupPercent: number;
  globalMarkupDollar: number;
  categoryMarkups: Record<string, number>;
  itemMarkups: Record<number, number>;
  shippingAccount: string;
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

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.baseCategory))),
    [products]
  );

  const getMarkup = (product: SelectedProduct): number => {
    // Item-level > Category-level > Global
    if (itemMarkups[product.styleID] !== undefined) return itemMarkups[product.styleID];
    if (categoryMarkups[product.baseCategory] !== undefined) return categoryMarkups[product.baseCategory];
    return markupType === "percent" ? globalPercent : globalDollar;
  };

  const getRetailPrice = (product: SelectedProduct): number => {
    const base = product.piecePrice || product.customerPrice || 0;
    const markup = getMarkup(product);
    if (markupType === "percent") return base * (1 + markup / 100);
    return base + markup;
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
            <p className="text-muted-foreground">Add your markup to the base wholesale prices</p>
          </div>
        </div>
      </div>

      <ChatBubble
        message="Base prices are set by Brand-Shop. Add your markup as a percentage or dollar amount — globally, by category, or per item. Your clients will see the final retail price."
        delay={0.2}
      />

      {/* Global Markup */}
      <Card className="border-border">
        <CardContent className="p-6 space-y-4">
          <h3 className="font-semibold text-foreground text-sm">Global Markup</h3>
          <Tabs value={markupType} onValueChange={(v) => setMarkupType(v as any)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="percent" className="gap-1"><Percent className="w-3 h-3" /> Percentage</TabsTrigger>
              <TabsTrigger value="dollar" className="gap-1"><DollarSign className="w-3 h-3" /> Dollar Amount</TabsTrigger>
            </TabsList>
            <TabsContent value="percent" className="mt-3">
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  min={0}
                  max={500}
                  value={globalPercent}
                  onChange={(e) => setGlobalPercent(Number(e.target.value))}
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">% markup on all products</span>
              </div>
            </TabsContent>
            <TabsContent value="dollar" className="mt-3">
              <div className="flex items-center gap-3">
                <div className="relative w-24">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    type="number"
                    min={0}
                    value={globalDollar}
                    onChange={(e) => setGlobalDollar(Number(e.target.value))}
                    className="pl-7"
                  />
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
          <AccordionTrigger className="px-4 py-3 text-sm hover:no-underline">
            Adjust by Category
          </AccordionTrigger>
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
                        if (val === "") {
                          const next = { ...prev };
                          delete next[cat];
                          return next;
                        }
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

      {/* Product Price Preview */}
      <Card className="border-border">
        <CardContent className="p-4 space-y-2">
          <h3 className="font-semibold text-foreground text-sm mb-3">Price Preview</h3>
          <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
            {products.slice(0, 20).map((p) => (
              <div key={p.styleID} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{p.title}</p>
                  <p className="text-[10px] text-muted-foreground">{p.baseCategory}</p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-muted-foreground">Cost: ${(p.piecePrice || 0).toFixed(2)}</span>
                  <span className="font-semibold text-primary">Retail: ${getRetailPrice(p).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Shipping */}
      <Accordion type="single" collapsible>
        <AccordionItem value="shipping" className="border border-border rounded-lg">
          <AccordionTrigger className="px-4 py-3 text-sm hover:no-underline">
            Shipping Account
          </AccordionTrigger>
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
                  <input
                    type="radio"
                    name="shipping"
                    value={opt.value}
                    checked={shippingAccount === opt.value}
                    onChange={() => setShippingAccount(opt.value)}
                    className="mt-0.5"
                  />
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

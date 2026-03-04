import { useState } from "react";
import { motion } from "framer-motion";
import { PackageCheck, Loader2, CheckCircle2, ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ChatBubble } from "@/components/features/ChatBubble";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { createSupplierAccount } from "@/lib/api/suppliers";
import { useToast } from "@/hooks/use-toast";

interface SupplierStepProps {
  tenantId: string;
  onNext: () => void;
  onBack: () => void;
}

export const SupplierStep = ({ tenantId, onNext, onBack }: SupplierStepProps) => {
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [advancedSupplier, setAdvancedSupplier] = useState("");
  const [advancedAccount, setAdvancedAccount] = useState("");
  const [advancedApiKey, setAdvancedApiKey] = useState("");
  const [advancedConnected, setAdvancedConnected] = useState(false);
  const { toast } = useToast();

  const handleConnectCatalog = () => {
    setConnected(true);
    toast({ title: "Catalog activated!", description: "Brand-Shop Catalog is now active on your account." });
  };

  const handleConnectAdvanced = async () => {
    if (!advancedSupplier || !advancedAccount.trim() || !advancedApiKey.trim()) return;
    setLoading(true);
    try {
      await createSupplierAccount({
        tenantId,
        supplier: advancedSupplier,
        credentials: { accountNumber: advancedAccount.trim(), apiKey: advancedApiKey.trim() },
      });
      setAdvancedConnected(true);
      toast({ title: "Supplier linked!", description: `${advancedSupplier} is now connected.` });
    } catch (err: any) {
      toast({ title: "Connection failed", description: err.message || "Check your credentials and try again.", variant: "destructive" });
    } finally {
      setLoading(false);
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
            <PackageCheck className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Product Catalog</h2>
            <p className="text-muted-foreground">Connect to Brand-Shop Catalog for product sourcing</p>
          </div>
        </div>
      </div>

      <ChatBubble
        message="Brand-Shop Catalog gives you access to thousands of blank apparel products ready for decoration — no supplier accounts needed. Just activate and start selling."
        delay={0.2}
      />

      {/* Default: Brand-Shop Catalog */}
      <Card className="border-border">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0">
              <PackageCheck className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">Brand-Shop Catalog</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Thousands of blank apparel products from top manufacturers — t-shirts, polos, hoodies, hats, and more. All white-labeled under your brand.
              </p>
            </div>
          </div>

          {connected ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 text-primary"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm font-medium">Brand-Shop Catalog activated</span>
            </motion.div>
          ) : (
            <Button
              onClick={handleConnectCatalog}
              disabled={loading}
              className="w-full"
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Activating...</> : "Activate Brand-Shop Catalog"}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Advanced: Own supplier accounts */}
      <Accordion type="single" collapsible>
        <AccordionItem value="advanced" className="border border-border rounded-lg">
          <AccordionTrigger className="px-6 py-4 text-sm text-muted-foreground hover:no-underline">
            I have my own supplier accounts (optional)
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6 space-y-4">
            <p className="text-xs text-muted-foreground">
              If you have direct accounts with suppliers, you can connect them here for custom pricing and inventory access.
            </p>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="advancedSupplier">Supplier</Label>
                <select
                  id="advancedSupplier"
                  value={advancedSupplier}
                  onChange={(e) => setAdvancedSupplier(e.target.value)}
                  disabled={advancedConnected}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select a supplier...</option>
                  <option value="ssactivewear">S&S Activewear</option>
                  <option value="sanmar">SanMar</option>
                  <option value="alphabroder">AlphaBroder</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="advancedAccount">Account Number</Label>
                <Input
                  id="advancedAccount"
                  placeholder="Your account number"
                  value={advancedAccount}
                  onChange={(e) => setAdvancedAccount(e.target.value)}
                  disabled={advancedConnected}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="advancedApiKey">API Key</Label>
                <Input
                  id="advancedApiKey"
                  type="password"
                  placeholder="Your API key"
                  value={advancedApiKey}
                  onChange={(e) => setAdvancedApiKey(e.target.value)}
                  disabled={advancedConnected}
                />
              </div>
              {advancedConnected ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 text-primary"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-sm font-medium">Supplier connected</span>
                </motion.div>
              ) : (
                <Button
                  onClick={handleConnectAdvanced}
                  disabled={loading || !advancedSupplier || !advancedAccount.trim() || !advancedApiKey.trim()}
                  variant="outline"
                  className="w-full"
                >
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Connecting...</> : "Connect Supplier"}
                </Button>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">Back</Button>
        <Button onClick={onNext} className="flex-1 gap-2">
          Continue <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
};

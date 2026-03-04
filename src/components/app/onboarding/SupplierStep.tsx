import { useState } from "react";
import { motion } from "framer-motion";
import { PackageCheck, Loader2, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ChatBubble } from "@/components/features/ChatBubble";
import { createSupplierAccount } from "@/lib/api/suppliers";
import { useToast } from "@/hooks/use-toast";

interface SupplierStepProps {
  tenantId: string;
  onNext: () => void;
  onBack: () => void;
}

export const SupplierStep = ({ tenantId, onNext, onBack }: SupplierStepProps) => {
  const [accountNumber, setAccountNumber] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const { toast } = useToast();

  const handleConnect = async () => {
    if (!accountNumber.trim() || !apiKey.trim()) return;
    setLoading(true);
    try {
      await createSupplierAccount({
        tenantId,
        supplier: "ssactivewear",
        credentials: { accountNumber: accountNumber.trim(), apiKey: apiKey.trim() },
      });
      setConnected(true);
      toast({ title: "Supplier linked!", description: "SSActivewear is now connected." });
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
            <h2 className="text-2xl font-bold text-foreground">Connect Your Supplier</h2>
            <p className="text-muted-foreground">Link SSActivewear for product sourcing</p>
          </div>
        </div>
      </div>

      <ChatBubble
        message="SSActivewear gives you access to 1,000+ blank apparel products. Once connected, we can sync catalogs automatically for every store."
        delay={0.2}
      />

      <Card className="border-border">
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="accountNumber">Account Number</Label>
            <Input
              id="accountNumber"
              placeholder="Your SSActivewear account number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              disabled={connected}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="Your SSActivewear API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              disabled={connected}
            />
          </div>

          {connected ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 text-primary"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm font-medium">SSActivewear connected</span>
            </motion.div>
          ) : (
            <Button
              onClick={handleConnect}
              disabled={loading || !accountNumber.trim() || !apiKey.trim()}
              className="w-full"
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Connecting...</> : "Connect Supplier"}
            </Button>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">Back</Button>
        <Button onClick={onNext} disabled={!connected} className="flex-1 gap-2">
          Continue <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
};

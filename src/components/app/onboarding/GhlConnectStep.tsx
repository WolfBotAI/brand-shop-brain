import { useState } from "react";
import { motion } from "framer-motion";
import { Link2, Loader2, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ChatBubble } from "@/components/features/ChatBubble";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { connectGhl } from "@/lib/api/tenant";
import { useToast } from "@/hooks/use-toast";

interface GhlConnectStepProps {
  onNext: (data: { tenantId: string; locationId: string }) => void;
  onBack: () => void;
}

export const GhlConnectStep = ({ onNext, onBack }: GhlConnectStepProps) => {
  const [tenantName, setTenantName] = useState("");
  const [locationId, setLocationId] = useState("");
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [result, setResult] = useState<{ tenantId: string; locationId: string } | null>(null);
  const { toast } = useToast();

  const handleConnect = async () => {
    if (!tenantName.trim() || !locationId.trim()) return;
    setLoading(true);
    try {
      const res = await connectGhl({ tenantName: tenantName.trim(), locationId: locationId.trim() });
      setResult({ tenantId: res.tenantId, locationId: res.locationId });
      setConnected(true);
      toast({ title: "Connected!", description: "Your GHL location is now linked." });
    } catch (err: any) {
      toast({ title: "Connection failed", description: err.message || "Please check your details and try again.", variant: "destructive" });
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
            <Link2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Connect Your CRM</h2>
            <p className="text-muted-foreground">Link your GoHighLevel location to Brand-Shop.AI</p>
          </div>
        </div>
      </div>

      <ChatBubble
        message="Your GHL location connects your CRM contacts, pipelines, and automations to every store you create."
        delay={0.2}
      />

      <Card className="border-border">
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tenantName">Business Name</Label>
            <Input
              id="tenantName"
              placeholder="e.g. Acme Apparel"
              value={tenantName}
              onChange={(e) => setTenantName(e.target.value)}
              disabled={connected}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="locationId">GHL Location ID</Label>
            <Input
              id="locationId"
              placeholder="e.g. loc_abc123"
              value={locationId}
              onChange={(e) => setLocationId(e.target.value)}
              disabled={connected}
            />
          </div>

          {connected && result ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 text-primary"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm font-medium">Connected successfully</span>
            </motion.div>
          ) : (
            <Button
              onClick={handleConnect}
              disabled={loading || !tenantName.trim() || !locationId.trim()}
              className="w-full"
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Connecting...</> : "Connect Location"}
            </Button>
          )}

          <Accordion type="single" collapsible>
            <AccordionItem value="details" className="border-none">
              <AccordionTrigger className="text-xs text-muted-foreground py-2 hover:no-underline">
                Where do I find my Location ID?
              </AccordionTrigger>
              <AccordionContent className="text-xs text-muted-foreground">
                In GHL, go to Settings → Business Profile. Your Location ID is shown at the top of the page. It usually starts with "loc_".
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">Back</Button>
        <Button onClick={() => result && onNext(result)} disabled={!connected} className="flex-1 gap-2">
          Continue <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
};

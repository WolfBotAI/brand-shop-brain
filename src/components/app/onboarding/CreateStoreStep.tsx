import { useState } from "react";
import { motion } from "framer-motion";
import { Store, Loader2, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChatBubble } from "@/components/features/ChatBubble";
import { createStore } from "@/lib/api/stores";
import { useToast } from "@/hooks/use-toast";

interface CreateStoreStepProps {
  tenantId: string;
  locationId: string;
  onNext: (data: { storeId: string }) => void;
  onBack: () => void;
}

const verticals = [
  { value: "sports", label: "Sports & Athletics" },
  { value: "corporate", label: "Corporate & Uniforms" },
  { value: "schools", label: "Schools & Education" },
  { value: "events", label: "Events & Fundraisers" },
  { value: "fashion", label: "Fashion & Streetwear" },
  { value: "other", label: "Other" },
];

export const CreateStoreStep = ({ tenantId, locationId, onNext, onBack }: CreateStoreStepProps) => {
  const [storeName, setStoreName] = useState("");
  const [clientName, setClientName] = useState("");
  const [brandVertical, setBrandVertical] = useState("");
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(false);
  const [storeId, setStoreId] = useState("");
  const { toast } = useToast();

  const handleCreate = () => {
    if (!storeName.trim() || !clientName.trim() || !brandVertical) return;
    setStoreId(`store-${Date.now()}`);
    setCreated(true);
    toast({ title: "Store created!", description: `${storeName} is ready to configure.` });
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
            <Store className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Create Your First Store</h2>
            <p className="text-muted-foreground">Set up a branded storefront for your client</p>
          </div>
        </div>
      </div>

      <ChatBubble
        message="This creates your store and triggers the catalog sync. You'll be able to customize pricing, mockups, and branding in the store workspace."
        delay={0.2}
      />

      <Card className="border-border">
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="storeName">Store Name</Label>
            <Input
              id="storeName"
              placeholder="e.g. Wildcats Team Shop"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              disabled={created}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clientName">Client Name</Label>
            <Input
              id="clientName"
              placeholder="e.g. Lincoln High School"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              disabled={created}
            />
          </div>
          <div className="space-y-2">
            <Label>Brand Vertical</Label>
            <Select value={brandVertical} onValueChange={setBrandVertical} disabled={created}>
              <SelectTrigger>
                <SelectValue placeholder="Select a vertical" />
              </SelectTrigger>
              <SelectContent>
                {verticals.map((v) => (
                  <SelectItem key={v.value} value={v.value}>{v.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {created ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 text-primary"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm font-medium">Store created successfully</span>
            </motion.div>
          ) : (
            <Button
              onClick={handleCreate}
              disabled={loading || !storeName.trim() || !clientName.trim() || !brandVertical}
              className="w-full"
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating Store...</> : "Create Store"}
            </Button>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">Back</Button>
        <Button onClick={() => onNext({ storeId })} disabled={!created} className="flex-1 gap-2">
          Continue <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
};

import { motion } from "framer-motion";
import { PartyPopper, CheckCircle2, ArrowRight, Copy, ShoppingBag, DollarSign, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChatBubble } from "@/components/features/ChatBubble";
import { StorefrontPreview, type ThemeConfig } from "@/components/app/store/StorefrontPreview";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import type { SSStyle } from "@/lib/api/ssProducts";

interface CompletionStepProps {
  storeId: string;
  storeName?: string;
  products?: SSStyle[];
  theme?: ThemeConfig;
  logoUrl?: string | null;
}

export const CompletionStep = ({ storeId, storeName, products = [], theme, logoUrl }: CompletionStepProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const defaultTheme: ThemeConfig = theme || {
    primary: "#2d3436", secondary: "#0984e3", accent: "#fdcb6e", background: "#ffffff",
  };

  const hasStore = !!storeId;
  const storeUrl = hasStore ? `${window.location.origin}/app/stores/${storeId}` : "";

  const checklist = [
    { label: "Distributor profile completed", done: true, icon: CheckCircle2 },
    { label: "Product catalog configured", done: true, icon: ShoppingBag },
    { label: "Pricing & markup set", done: true, icon: DollarSign },
    { label: "First client store created", done: hasStore, icon: Users },
  ];

  const copyLink = () => {
    if (!storeUrl) return;
    navigator.clipboard.writeText(storeUrl);
    toast({ title: "Link copied!", description: "Share this link with your client." });
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
      <div className="text-center space-y-3">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.2 }} className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
          <PartyPopper className="w-8 h-8 text-primary" />
        </motion.div>
        <h2 className="text-2xl font-bold text-foreground">{hasStore ? "You're All Set!" : "Account Setup Complete!"}</h2>
        <p className="text-muted-foreground">{hasStore ? `${storeName} is live and ready to take orders.` : "Your distributor account is ready. Head to the dashboard to start adding clients."}</p>
      </div>

      <ChatBubble
        message={hasStore ? "Your first client store is live! Head to the dashboard to manage your stores, add more clients, and track orders." : "Your catalog and pricing are set up. You can add your first client from the dashboard whenever you're ready."}
        delay={0.4}
      />

      {hasStore && storeUrl && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground mb-1">Client Store URL</p>
              <p className="text-sm font-mono text-foreground truncate">{storeUrl}</p>
            </div>
            <Button variant="outline" size="sm" className="gap-1.5 flex-shrink-0" onClick={copyLink}>
              <Copy className="w-3.5 h-3.5" /> Copy
            </Button>
          </CardContent>
        </Card>
      )}

      {hasStore && products.length > 0 && (
        <div className="max-h-72 overflow-hidden rounded-xl border border-border relative">
          <StorefrontPreview storeName={storeName || "Client Store"} products={products.slice(0, 6)} theme={defaultTheme} logoUrl={logoUrl} />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent" />
        </div>
      )}

      <Card className="border-border">
        <CardContent className="p-6 space-y-3">
          <h3 className="font-semibold text-foreground text-sm">Setup Checklist</h3>
          {checklist.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.1 }} className="flex items-center gap-2">
              <item.icon className={`w-4 h-4 flex-shrink-0 ${item.done ? "text-primary" : "text-muted-foreground"}`} />
              <span className={`text-sm ${item.done ? "text-foreground" : "text-muted-foreground"}`}>{item.label}</span>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => navigate("/app/dashboard")} className="flex-1">Go to Dashboard</Button>
        {hasStore && (
          <Button onClick={() => navigate(`/app/stores/${storeId}`, { state: { storeName, products, theme: defaultTheme, logoUrl } })} className="flex-1 gap-2">
            Open Store Workspace <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </motion.div>
  );
};

import { motion } from "framer-motion";
import { PartyPopper, CheckCircle2, ArrowRight, Copy, ExternalLink } from "lucide-react";
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

export const CompletionStep = ({ storeId, storeName = "My Store", products = [], theme, logoUrl }: CompletionStepProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const defaultTheme: ThemeConfig = theme || {
    primary: "#2d3436", secondary: "#0984e3", accent: "#fdcb6e", background: "#ffffff",
  };

  const storeUrl = `${window.location.origin}/app/stores/${storeId}`;

  const checklist = [
    { label: "Wolf Bot AI connected", done: true },
    { label: "Supplier account linked", done: true },
    { label: "First store created", done: true },
    { label: "Catalog sync triggered", done: true },
    { label: "Storefront live", done: true },
  ];

  const copyLink = () => {
    navigator.clipboard.writeText(storeUrl);
    toast({ title: "Link copied!", description: "Share this link with your client." });
  };

  const goToWorkspace = () => {
    navigate(`/app/stores/${storeId}`, {
      state: { storeName, products, theme: defaultTheme, logoUrl },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      <div className="text-center space-y-3">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto"
        >
          <PartyPopper className="w-8 h-8 text-primary" />
        </motion.div>
        <h2 className="text-2xl font-bold text-foreground">Your Store is Live!</h2>
        <p className="text-muted-foreground">
          {storeName} is ready to take orders. Share the link with your client.
        </p>
      </div>

      <ChatBubble
        message="Your store is live! Below is a preview of what your customers will see. Head to the workspace to manage catalog, pricing, and mockups."
        delay={0.4}
      />

      {/* Share Link */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-4 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground mb-1">Store URL</p>
            <p className="text-sm font-mono text-foreground truncate">{storeUrl}</p>
          </div>
          <Button variant="outline" size="sm" className="gap-1.5 flex-shrink-0" onClick={copyLink}>
            <Copy className="w-3.5 h-3.5" /> Copy
          </Button>
        </CardContent>
      </Card>

      {/* Storefront Mini-Preview */}
      {products.length > 0 && (
        <div className="max-h-80 overflow-hidden rounded-xl border border-border relative">
          <StorefrontPreview
            storeName={storeName}
            products={products.slice(0, 6)}
            theme={defaultTheme}
            logoUrl={logoUrl}
          />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background to-transparent" />
        </div>
      )}

      {/* Checklist */}
      <Card className="border-border">
        <CardContent className="p-6 space-y-3">
          <h3 className="font-semibold text-foreground text-sm">Onboarding Checklist</h3>
          {checklist.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-sm text-foreground">{item.label}</span>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => navigate("/app/dashboard")} className="flex-1">
          Go to Dashboard
        </Button>
        <Button onClick={goToWorkspace} className="flex-1 gap-2">
          Open Store Workspace <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
};

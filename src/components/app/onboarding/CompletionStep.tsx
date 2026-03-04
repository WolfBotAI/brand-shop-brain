import { motion } from "framer-motion";
import { PartyPopper, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChatBubble } from "@/components/features/ChatBubble";
import { useNavigate } from "react-router-dom";

interface CompletionStepProps {
  storeId: string;
}

export const CompletionStep = ({ storeId }: CompletionStepProps) => {
  const navigate = useNavigate();

  const checklist = [
    { label: "CRM connected via GHL", done: true },
    { label: "Supplier account linked", done: true },
    { label: "First store created", done: true },
    { label: "Catalog sync triggered", done: true },
  ];

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
        <h2 className="text-2xl font-bold text-foreground">You're All Set!</h2>
        <p className="text-muted-foreground">Your platform is configured and your first store is being built.</p>
      </div>

      <ChatBubble
        message="Great work! Your store is now syncing products. Head to the store workspace to set up pricing, mockups, and publish your storefront."
        delay={0.4}
      />

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
        <Button onClick={() => navigate(`/app/stores/${storeId}`)} className="flex-1 gap-2">
          Open Store Workspace <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
};

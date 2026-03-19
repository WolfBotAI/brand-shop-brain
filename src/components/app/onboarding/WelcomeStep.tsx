import { motion } from "framer-motion";
import { Rocket, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChatBubble } from "@/components/features/ChatBubble";

interface WelcomeStepProps {
  onNext: () => void;
}

export const WelcomeStep = ({ onNext }: WelcomeStepProps) => {
  const steps = [
    "Set up your distributor profile and branding",
    "Browse and select products from the Brand-Shop Apparel catalog",
    "Set your pricing and markup for your clients",
    "Create your first client store in minutes",
  ];

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
            <Rocket className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Welcome to Brand-Shop.AI</h2>
            <p className="text-muted-foreground">Your all-in-one branded apparel distribution platform</p>
          </div>
        </div>
      </div>

      <ChatBubble
        message="I'll walk you through setting up your distributor account. You'll build your catalog, set your prices, and launch your first client store — all in one flow."
        delay={0.3}
      />

      <Card className="border-border">
        <CardContent className="p-6 space-y-4">
          <h3 className="font-semibold text-foreground">Here's what we'll do together:</h3>
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.15 }}
              className="flex items-start gap-3"
            >
              <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-sm text-foreground">{step}</p>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      <Button onClick={onNext} size="lg" className="w-full gap-2">
        Let's Get Started <ArrowRight className="w-4 h-4" />
      </Button>
    </motion.div>
  );
};

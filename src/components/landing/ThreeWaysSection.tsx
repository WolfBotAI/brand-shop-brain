import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Users, Plug, MessageSquare, Store, CheckCircle, Palette, ShoppingBag, Shield } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const paths = [
  {
    icon: Sparkles,
    title: "AI-Generated Store",
    subtitle: "AI builds it for your client",
    description: "AI asks adaptive discovery questions — purpose, audience, climate, budget & more — then curates products and launches a ready-to-go store.",
    steps: [
      { icon: MessageSquare, label: "AI asks discovery questions", detail: "Purpose, audience, climate, budget…" },
      { icon: ShoppingBag, label: "Products auto-selected", detail: "Best matches from your catalog" },
      { icon: Store, label: "Store deployed", detail: "White-labeled & live in minutes" },
    ],
    accent: "primary",
  },
  {
    icon: Users,
    title: "Distributor-Curated",
    subtitle: "You build it for your client",
    description: "You hand-pick products, choose a theme, and set pricing — then deliver a turnkey store your client just needs to share.",
    steps: [
      { icon: Palette, label: "Pick theme & products", detail: "You choose from your catalog" },
      { icon: ShoppingBag, label: "Set pricing & rules", detail: "Margins, deadlines, minimums" },
      { icon: CheckCircle, label: "Hand off ready store", detail: "Client just shares the link" },
    ],
    accent: "primary",
  },
  {
    icon: Plug,
    title: "Client Self-Build",
    subtitle: "Your client builds their own",
    description: "Your client selects their theme and products from your catalog — within the guardrails and rules you define.",
    steps: [
      { icon: Shield, label: "You set the rules", detail: "Approved products, pricing, limits" },
      { icon: Palette, label: "Client picks theme & products", detail: "From your curated catalog" },
      { icon: Store, label: "Store goes live", detail: "Under your brand umbrella" },
    ],
    accent: "primary",
  },
];

const STEP_DURATION = 3000; // 3s per step (slow for clarity)

const PathDemo = ({ path, index }: { path: typeof paths[0]; index: number }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const advanceStep = useCallback(() => {
    setCurrentStep((prev) => (prev + 1) % path.steps.length);
    setProgress(0);
  }, [path.steps.length]);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          advanceStep();
          return 0;
        }
        return prev + (100 / (STEP_DURATION / 50));
      });
    }, 50);
    return () => clearInterval(interval);
  }, [isPaused, advanceStep]);

  const Icon = path.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="flex flex-col bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-shadow"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-1">{path.title}</h3>
        <p className="text-sm font-medium text-primary mb-2">{path.subtitle}</p>
        <p className="text-sm text-muted-foreground">{path.description}</p>
      </div>

      {/* Animated Demo */}
      <div className="px-6 pb-6 flex-1 flex flex-col">
        {/* Progress bar */}
        <Progress value={progress} className="h-1 mb-4" />

        {/* Step indicators */}
        <div className="space-y-2 mb-4">
          {path.steps.map((step, i) => {
            const StepIcon = step.icon;
            const isActive = currentStep === i;
            const isComplete = currentStep > i;
            return (
              <motion.button
                key={i}
                onClick={() => { setCurrentStep(i); setProgress(0); }}
                className={`flex items-center gap-3 p-3 rounded-xl w-full text-left transition-all ${
                  isActive
                    ? "bg-primary/10 border border-primary/30"
                    : isComplete
                      ? "bg-muted/80 border border-transparent"
                      : "bg-muted/40 border border-transparent"
                }`}
                animate={{ scale: isActive ? 1.02 : 1 }}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isActive ? "bg-primary text-primary-foreground" : isComplete ? "bg-primary/60 text-primary-foreground" : "bg-muted-foreground/20 text-muted-foreground"
                }`}>
                  {isComplete ? <CheckCircle className="w-4 h-4" /> : <StepIcon className="w-4 h-4" />}
                </div>
                <div className="min-w-0">
                  <p className={`text-sm font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>{step.label}</p>
                  <p className="text-xs text-muted-foreground truncate">{step.detail}</p>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Visual preview area */}
        <div className="rounded-xl bg-muted/50 border border-border p-4 flex-1 min-h-[80px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-3"
            >
              {(() => {
                const StepIcon = path.steps[currentStep].icon;
                return (
                  <>
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <StepIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{path.steps[currentStep].label}</p>
                      <p className="text-xs text-muted-foreground">{path.steps[currentStep].detail}</p>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export const ThreeWaysSection = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Three Ways to{" "}
            <span className="text-primary">Launch a Store</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Whether AI builds it, you curate it, or your client self-builds — every store integrates with your suppliers and decorators automatically.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {paths.map((path, index) => (
            <PathDemo key={path.title} path={path} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

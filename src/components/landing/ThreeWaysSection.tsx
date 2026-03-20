import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Users, Plug, MessageSquare, Store, CheckCircle, Palette, ShoppingBag, Shield } from "lucide-react";

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
  },
];

const PathCard = ({ path, index }: { path: typeof paths[0]; index: number }) => {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const Icon = path.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-[box-shadow] duration-300"
    >
      <div className="p-6 pb-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-1">{path.title}</h3>
        <p className="text-sm font-medium text-primary mb-2">{path.subtitle}</p>
        <p className="text-sm text-muted-foreground">{path.description}</p>
      </div>

      <div className="px-6 pb-6 flex-1 flex flex-col gap-2">
        {path.steps.map((step, i) => {
          const StepIcon = step.icon;
          const isActive = activeStep === i;
          return (
            <button
              key={i}
              onClick={() => setActiveStep(isActive ? null : i)}
              className={`flex items-center gap-3 p-3 rounded-xl w-full text-left transition-colors duration-200 ${
                isActive
                  ? "bg-primary/10 border border-primary/30"
                  : "bg-muted/40 border border-transparent hover:bg-muted/70"
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-200 ${
                isActive ? "bg-primary text-primary-foreground" : "bg-muted-foreground/20 text-muted-foreground"
              }`}>
                <StepIcon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className={`text-sm font-medium transition-colors duration-200 ${isActive ? "text-foreground" : "text-muted-foreground"}`}>{step.label}</p>
                <p className="text-xs text-muted-foreground truncate">{step.detail}</p>
              </div>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
};

export const ThreeWaysSection = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-wrap-balance" style={{ lineHeight: 1.1 }}>
            Three Ways to{" "}
            <span className="text-primary">Launch a Store</span>
          </h2>
          <p className="text-xl text-muted-foreground text-wrap-pretty">
            Whether AI builds it, you curate it, or your client self-builds — every store integrates with your suppliers and decorators automatically.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {paths.map((path, index) => (
            <PathCard key={path.title} path={path} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

import { motion } from "framer-motion";
import { Store, Bot, Users, Route } from "lucide-react";

const features = [
  {
    icon: Store,
    title: "AI Store Builder",
    description: "AI asks discovery questions, then builds stores with the right products for each client's audience and budget",
  },
  {
    icon: Bot,
    title: "AI Merch Advisor",
    description: "4-step discovery: purpose, audience, climate, budget — then personalized product recommendations from your catalog",
  },
  {
    icon: Users,
    title: "Package Tiers",
    description: "Starter (10 items), Growth (25), Pro (40), Enterprise (40+) — clients pick a tier, AI fills the catalog",
  },
  {
    icon: Route,
    title: "Smart Order Routing",
    description: "Orders automatically route to the right decorator based on product or supplier",
  },
];

export const IntroducingSection = () => {
  return (
    <section id="how-it-works" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Everything Your Clients Need.{" "}
            <span className="text-primary">Nothing You Have to Manage.</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Give schools, churches, and brands a complete e-commerce experience — 
            while you focus on growing your distributor business.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow border border-border"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Product Visual */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-16"
        >
          <div className="aspect-[21/9] rounded-2xl overflow-hidden flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, hsl(var(--primary) / 0.1), hsl(var(--secondary)))' }}
          >
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-foreground">AI Discovery → Package Selection → Store Live</p>
              <p className="text-muted-foreground mt-2">The complete journey, powered by AI</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

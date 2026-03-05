import { motion } from "framer-motion";
import { Store, Bot, MessageSquare, Route, Sparkles, ShoppingBag, Rocket } from "lucide-react";

const features = [
  {
    icon: Store,
    title: "AI Store Builder",
    description: "AI asks discovery questions, then builds stores with the right products for each client's audience and budget",
  },
  {
    icon: Bot,
    title: "AI Merch Advisor",
    description: "Adaptive discovery — purpose, audience, climate, budget & more — then personalized product recommendations from your catalog",
  },
  {
    icon: MessageSquare,
    title: "AI Support Agent",
    description: "24/7 omnichannel support via web chat, SMS, email, phone, Facebook & Instagram — all trained on your brand",
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

        {/* 3-Step Flow Diagram */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-16"
        >
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Sparkles, step: "01", title: "AI Discovery", desc: "AI asks about purpose, audience, climate & budget" },
              { icon: ShoppingBag, step: "02", title: "Store Built", desc: "AI curates the right products and launches the store" },
              { icon: Rocket, step: "03", title: "Store Live", desc: "White-labeled store launches with full AI support" },
            ].map((item, i) => {
              const StepIcon = item.icon;
              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.15 }}
                  className="relative text-center p-6 rounded-2xl bg-card border border-border"
                >
                  <div className="text-xs font-bold text-primary mb-3">STEP {item.step}</div>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <StepIcon className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="text-lg font-bold text-foreground mb-1">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                  {i < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-6 text-primary z-10">→</div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

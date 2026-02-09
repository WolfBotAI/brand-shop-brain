import { motion } from "framer-motion";
import { Store, Bot, Users, Route } from "lucide-react";

const features = [
  {
    icon: Store,
    title: "AI Store Builder",
    description: "Your clients build their own stores guided by AI or choose from themes you pre-select",
  },
  {
    icon: Bot,
    title: "Built-in AI Support",
    description: "Every store includes AI Chat & Voice for tracking, support, and returns — you do nothing",
  },
  {
    icon: Users,
    title: "Customer Portal",
    description: "Clients manage orders, billing, and catalogs themselves with AI guidance",
  },
  {
    icon: Route,
    title: "Smart Order Routing",
    description: "Orders automatically route to the right decorator based on product or supplier",
  },
];

export const IntroducingSection = () => {
  return (
    <section className="py-24 bg-background">
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
          <div className="aspect-[21/9] rounded-2xl overflow-hidden bg-secondary">
            <img 
              src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1600&q=80" 
              alt="Custom branded apparel and merchandise"
              className="w-full h-full object-cover opacity-80"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

import { motion } from "framer-motion";
import { Store, MessageSquare, Phone, BarChart3, Palette, Bot, Plus } from "lucide-react";

const capabilities = [
  {
    icon: Store,
    title: "AI-Managed Stores",
    description: "Centralize all client stores. AI creates, updates, and manages them.",
  },
  {
    icon: MessageSquare,
    title: "AI Website Assistant",
    description: "24/7 embedded chat for order tracking, returns, and product recommendations.",
  },
  {
    icon: Bot,
    title: "AI Support Agent",
    description: "Omnichannel support via SMS, email, phone, Facebook & Instagram.",
  },
  {
    icon: Phone,
    title: "AI Voice Agent",
    description: "Answers phone calls with real-time order lookups and customer support.",
  },
  {
    icon: BarChart3,
    title: "Agency Reporting",
    description: "Complete visibility into every store's performance and sales data.",
  },
  {
    icon: Palette,
    title: "White-Label Branding",
    description: "Your brand, your domain, your client relationship.",
  },
];

const addOns = [
  { name: "Order Routing", description: "Auto-route orders to the right supplier or decorator" },
  { name: "AI Vision", description: "Extract POs from any format — PDF, photo, handwritten" },
  { name: "Site Migration", description: "Migrate existing stores from any platform" },
];

export const PackagesSection = () => {
  return (
    <section id="platform" className="py-24 bg-muted">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Everything You Need.{" "}
            <span className="text-primary">Built In.</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            A complete AI-powered platform for managing client stores, support, and operations — 
            so you can focus on growing your distributor business.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {capabilities.map((cap, index) => {
            const Icon = cap.icon;
            return (
              <motion.div
                key={cap.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="bg-card rounded-2xl p-8 shadow-sm border border-border hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{cap.title}</h3>
                <p className="text-sm text-muted-foreground">{cap.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Add-ons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 max-w-4xl mx-auto"
        >
          <h3 className="text-center text-lg font-bold text-foreground mb-6">Available Add-ons</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {addOns.map((addon) => (
              <div key={addon.name} className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border">
                <Plus className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground text-sm">{addon.name}</p>
                  <p className="text-xs text-muted-foreground">{addon.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

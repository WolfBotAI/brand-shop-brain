import { motion } from "framer-motion";
import { Puzzle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const integrations = [
  {
    name: "Brand-Shop Catalog",
    category: "Product Sourcing",
    description: "Thousands of blank products, ready for your brand",
  },
  {
    name: "Printavo",
    category: "Order Management",
    description: "Seamlessly sync orders and production status",
  },
  {
    name: "DecoNetwork",
    category: "Order Management",
    description: "Full integration with decoration workflows",
  },
  {
    name: "InkSoft",
    category: "Store Platform",
    description: "Connect existing InkSoft stores",
  },
  {
    name: "Zapier",
    category: "Automation",
    description: "Connect to 5,000+ apps",
  },
  {
    name: "TaxJar",
    category: "Tax Automation",
    description: "Automatic sales tax calculation",
  },
  {
    name: "QuickBooks",
    category: "Accounting",
    description: "Sync invoices and financial data",
  },
  {
    name: "ShopWorks",
    category: "ERP",
    description: "Enterprise resource planning integration",
  },
  {
    name: "Stripe",
    category: "Payments",
    description: "Secure payment processing and invoicing",
  },
  {
    name: "API Access",
    category: "Custom",
    description: "Build your own integrations",
  },
];

export const Integrations = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6">
            <Puzzle className="w-4 h-4" />
            <span className="text-sm font-medium">Powerful Integrations</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Integrates With{" "}
            <span className="text-primary">Your Workflow</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Brand-Shop Catalog powers your product sourcing. Our open API connects to the tools you already use — Printavo, DecoNetwork, InkSoft, and more.
          </p>
        </motion.div>

        {/* Integrations Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-12"
        >
          {integrations.map((integration, index) => (
            <motion.div
              key={integration.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              className={`glass-card rounded-xl p-6 text-center hover:shadow-lg transition-all cursor-pointer group ${
                index === 0 ? "md:col-span-3 border-primary/20 bg-primary/5" : ""
              }`}
            >
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-secondary/10 to-accent/10 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl font-bold text-secondary">{integration.name.charAt(0)}</span>
              </div>
              <h3 className="font-bold text-foreground mb-1">{integration.name}</h3>
              <p className="text-xs text-primary font-medium mb-2">{integration.category}</p>
              <p className="text-xs text-muted-foreground">{integration.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center"
        >
          <p className="text-muted-foreground mb-4">
            Don't see your system? We can build custom integrations.
          </p>
          <Button className="rounded-full px-8 bg-primary hover:bg-primary/90 text-primary-foreground group">
            Request Integration
            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

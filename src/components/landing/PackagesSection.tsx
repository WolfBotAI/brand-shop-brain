import { motion } from "framer-motion";
import { Check, Star, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const packages = [
  {
    name: "Starter",
    items: "Up to 10 items",
    features: [
      "White-labeled agency account",
      "AI-powered web stores",
      "AI Conversations Agent",
      "AI Voice Agent",
      "Agency-level reporting",
    ],
    popular: false,
  },
  {
    name: "Growth",
    items: "Up to 25 items",
    features: [
      "Everything in Starter",
      "Bulk variant selection",
      "Multi-store management",
      "Advanced reporting & KPIs",
    ],
    popular: true,
  },
  {
    name: "Pro",
    items: "Up to 40 items",
    features: [
      "Everything in Growth",
      "Priority support",
      "Custom branding options",
      "Dedicated onboarding",
    ],
    popular: false,
  },
  {
    name: "Enterprise",
    items: "40+ items",
    features: [
      "Everything in Pro",
      "Unlimited items",
      "Dedicated account manager",
      "Custom integrations",
    ],
    popular: false,
  },
];

const addOns = [
  { name: "Order Routing", description: "Auto-route orders to the right supplier or decorator" },
  { name: "AI Vision", description: "Extract POs from any format — PDF, photo, handwritten" },
  { name: "Site Migration", description: "Migrate existing stores from any platform" },
];

export const PackagesSection = () => {
  return (
    <section id="packages" className="py-24 bg-muted">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Scalable{" "}
            <span className="text-primary">Package Tiers</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Every package includes a white-labeled agency account, AI-powered stores, 
            AI Conversations, and AI Voice for 24/7 customer support.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative bg-card rounded-2xl p-8 shadow-sm border transition-shadow hover:shadow-md ${
                pkg.popular ? "border-primary shadow-md" : "border-border"
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                  <Star className="w-3 h-3" />
                  Most Popular
                </div>
              )}

              <h3 className="text-2xl font-bold text-foreground mb-1">{pkg.name}</h3>
              <p className="text-sm text-primary font-medium mb-6">{pkg.items}</p>

              <Button
                asChild
                className={`w-full rounded-full mb-6 ${
                  pkg.popular
                    ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                    : ""
                }`}
                variant={pkg.popular ? "default" : "outline"}
              >
                <Link to="/assessment">Take Assessment</Link>
              </Button>

              <ul className="space-y-3">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-foreground">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
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

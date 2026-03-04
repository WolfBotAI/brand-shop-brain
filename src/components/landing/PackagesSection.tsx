import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const packages = [
  {
    name: "Starter",
    tier: "A",
    items: "Up to 10",
    price: "$49",
    period: "/mo",
    features: ["AI Store Builder", "AI Merch Advisor", "AI Chat Support", "Basic Reporting"],
    popular: false,
  },
  {
    name: "Growth",
    tier: "B",
    items: "Up to 25",
    price: "$99",
    period: "/mo",
    features: ["Everything in Starter", "Bulk Variant Selection", "Order Routing", "KPI Reports"],
    popular: true,
  },
  {
    name: "Pro",
    tier: "C",
    items: "Up to 40",
    price: "$179",
    period: "/mo",
    features: ["Everything in Growth", "Multi-Store Management", "Site Migration", "Priority Support"],
    popular: false,
  },
  {
    name: "Enterprise",
    tier: "E",
    items: "40+",
    price: "Custom",
    period: "",
    features: ["Everything in Pro", "Unlimited Items", "Dedicated Account Manager", "Custom Integrations"],
    popular: false,
  },
];

export const PackagesSection = () => {
  return (
    <section className="py-24 bg-muted">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Simple, Scalable{" "}
            <span className="text-primary">Package Tiers</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Choose a package based on how many items your clients need. 
            Upgrade anytime as their store grows.
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

              <div className="text-sm font-medium text-muted-foreground mb-1">Package {pkg.tier}</div>
              <h3 className="text-2xl font-bold text-foreground mb-1">{pkg.name}</h3>
              <p className="text-sm text-primary font-medium mb-4">{pkg.items} items</p>

              <div className="mb-6">
                <span className="text-4xl font-bold text-foreground">{pkg.price}</span>
                <span className="text-muted-foreground">{pkg.period}</span>
              </div>

              <Button
                className={`w-full rounded-full mb-6 ${
                  pkg.popular
                    ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                    : ""
                }`}
                variant={pkg.popular ? "default" : "outline"}
              >
                {pkg.price === "Custom" ? "Contact Sales" : "Get Started"}
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
      </div>
    </section>
  );
};

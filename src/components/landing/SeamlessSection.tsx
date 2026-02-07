import { motion } from "framer-motion";
import { DollarSign, Palette, Route, Lock } from "lucide-react";

const features = [
  {
    icon: DollarSign,
    title: "Pricing Controls",
    description: "Adjust by %, $, category, brand, sizes, or supplier — in bulk",
  },
  {
    icon: Palette,
    title: "Theme Management",
    description: "Pre-select themes for clients OR let them build with AI",
  },
  {
    icon: Route,
    title: "Order Routing",
    description: "Configure which decorator gets which products automatically",
  },
  {
    icon: Lock,
    title: "Private Catalogs",
    description: "Set up client-specific product access and pricing",
  },
];

export const SeamlessSection = () => {
  return (
    <section className="py-24 bg-[hsl(var(--section-blue))]">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[hsl(var(--section-blue-foreground))] mb-6">
              Full Control for You.{" "}
              <span className="opacity-90">Full Automation for Clients.</span>
            </h2>
            <p className="text-xl text-[hsl(var(--section-blue-foreground))]/80 mb-10">
              You set the rules once. Every client store follows them automatically. 
              Pricing, themes, routing, catalogs — all under your control.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[hsl(var(--section-blue-foreground))]/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-[hsl(var(--section-blue-foreground))]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[hsl(var(--section-blue-foreground))] mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-[hsl(var(--section-blue-foreground))]/70">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Right - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Control panel mockup */}
            <div className="bg-[hsl(var(--section-blue-foreground))] rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-bold text-foreground">Pricing Controls</p>
                  <p className="text-sm text-muted-foreground">Bulk adjustments</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {/* Pricing rule examples */}
                {[
                  { category: "Apparel", adjustment: "+15%", type: "Margin" },
                  { category: "Headwear", adjustment: "+$2.50", type: "Fixed" },
                  { category: "Bags", adjustment: "+12%", type: "Margin" },
                ].map((rule, index) => (
                  <motion.div
                    key={rule.category}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <span className="text-foreground font-medium">{rule.category}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-primary font-bold">{rule.adjustment}</span>
                      <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded">
                        {rule.type}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground text-center">
                  Applied to all 12 client stores automatically
                </p>
              </div>
            </div>

            {/* Floating indicator */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="absolute -bottom-4 -left-4 bg-secondary text-secondary-foreground px-4 py-3 rounded-xl shadow-lg"
            >
              <p className="text-sm font-medium">Configure once</p>
              <p className="text-xs opacity-80">Apply everywhere</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

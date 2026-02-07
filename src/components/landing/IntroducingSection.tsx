import { motion } from "framer-motion";
import { Store, Bot, Palette, ShoppingCart } from "lucide-react";

const features = [
  {
    icon: Store,
    title: "AI Store Builder",
    description: "Clients build their own stores guided by AI or choose from distributor-approved themes",
  },
  {
    icon: Bot,
    title: "24/7 AI Support",
    description: "Every store includes AI Chat & Voice for tracking, support, and returns",
  },
  {
    icon: Palette,
    title: "Full Customization",
    description: "Colors, logos, products - all tailored to your brand identity",
  },
  {
    icon: ShoppingCart,
    title: "Smart Order Routing",
    description: "Orders automatically sent to the right decorator based on product or supplier",
  },
];

export const IntroducingSection = () => {
  return (
    <section className="py-24 bg-muted">
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
            Introducing{" "}
            <span className="text-primary">BrandShop.AI</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            A comprehensive e-commerce platform designed to enhance customer journeys, 
            build lasting brand loyalty, and drive revenue growth — powered entirely by AI.
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
                className="bg-card rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow"
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
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80" 
              alt="Branded merchandise display"
              className="w-full h-full object-cover opacity-80"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

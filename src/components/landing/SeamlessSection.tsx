import { motion } from "framer-motion";
import { MessageSquare, Phone, Sparkles, Settings } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Custom-Designed Mockups",
    description: "Tailored to your brand identity and style preferences",
  },
  {
    icon: MessageSquare,
    title: "Chat Autonomous Agent",
    description: "Trained on YOUR brand, products, and services",
  },
  {
    icon: Phone,
    title: "Telephone Autonomous Agent",
    description: "Voice support that knows your catalog inside and out",
  },
  {
    icon: Settings,
    title: "Distributor Controls",
    description: "Adjust pricing by %, $, category, brand, sizes, or supplier",
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
              Seamless Integration,{" "}
              <span className="opacity-90">Tailor-Made Experience</span>
            </h2>
            <p className="text-xl text-[hsl(var(--section-blue-foreground))]/80 mb-10">
              Every store is equipped with AI agents trained specifically on your brand, 
              products, and services — providing order assistance, product suggestions, 
              and sales support around the clock.
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
            {/* Chat mockup */}
            <div className="bg-[hsl(var(--section-blue-foreground))] rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-bold text-foreground">AI Support Agent</p>
                  <p className="text-sm text-muted-foreground">Online • Trained on your brand</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-end">
                  <div className="bg-primary text-primary-foreground px-4 py-3 rounded-2xl rounded-br-md max-w-[80%]">
                    Where's my order #12345?
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-muted text-foreground px-4 py-3 rounded-2xl rounded-bl-md max-w-[80%]">
                    Your order shipped yesterday via UPS and will arrive Friday by 5pm. 
                    Would you like the tracking link?
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-primary text-primary-foreground px-4 py-3 rounded-2xl rounded-br-md max-w-[80%]">
                    Yes please!
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border">
                <div className="flex gap-2">
                  <div className="flex-1 bg-muted rounded-full px-4 py-2 text-muted-foreground text-sm">
                    Type your message...
                  </div>
                </div>
              </div>
            </div>

            {/* Floating channels badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="absolute -bottom-4 -left-4 bg-secondary text-secondary-foreground px-4 py-3 rounded-xl shadow-lg"
            >
              <p className="text-sm font-medium">Available via:</p>
              <p className="text-xs opacity-80">SMS • Email • Facebook • Instagram</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

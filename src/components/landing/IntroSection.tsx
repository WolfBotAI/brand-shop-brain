import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const IntroSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-muted">
              <img 
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80" 
                alt="Team collaboration"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground px-6 py-4 rounded-xl shadow-lg"
            >
              <p className="text-lg font-bold">"We are going with</p>
              <p className="text-2xl font-bold">BrandShop.AI"</p>
            </motion.div>
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:pl-8"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              The First{" "}
              <span className="text-primary">A.I. Powered</span>{" "}
              Brand E-commerce Store System
            </h2>
            <p className="text-xl text-muted-foreground mb-6">
              For Schools, Religious Organizations, and B2B/B2C Brands.
            </p>
            <p className="text-lg text-muted-foreground mb-8">
              Includes chat and telephone Autonomous Agents that elevate customer experience, 
              build brand loyalty, and increase revenues — all on autopilot!
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "AI-guided store building or pre-selected themes",
                "Real-time order tracking via SMS, Email, Messenger",
                "Eliminates customer support burden for distributors",
                "Customer portal with full AI guidance",
              ].map((item, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="text-foreground">{item}</span>
                </motion.li>
              ))}
            </ul>
            <Button 
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-full group"
            >
              Start Now
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

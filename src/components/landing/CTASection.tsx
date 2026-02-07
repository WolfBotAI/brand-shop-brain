import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";

const benefits = [
  "AI-powered store creation",
  "24/7 autonomous support",
  "Multi-channel engagement",
  "Smart order routing",
];

export const CTASection = () => {
  return (
    <section className="py-24 bg-[hsl(var(--section-dark))]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[hsl(var(--section-dark-foreground))] mb-6">
            Secure Your{" "}
            <span className="text-primary">Brand-Shop.AI</span>{" "}
            Store Today!
          </h2>
          <p className="text-xl text-[hsl(var(--section-dark-foreground))]/70 mb-10 max-w-2xl mx-auto">
            Join schools, churches, and brands who have transformed their merchandise experience 
            with AI-powered automation.
          </p>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-6 mb-10"
          >
            {benefits.map((benefit, index) => (
              <div 
                key={benefit}
                className="flex items-center gap-2 text-[hsl(var(--section-dark-foreground))]/80"
              >
                <CheckCircle className="w-5 h-5 text-primary" />
                <span>{benefit}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <Button 
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-7 text-xl rounded-full group shadow-lg"
            >
              Start Now!
              <ArrowRight className="ml-2 w-6 h-6 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>

          {/* Trust indicator */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="mt-8 text-sm text-[hsl(var(--section-dark-foreground))]/50"
          >
            Powered by WolfBot.AI Intelligence
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

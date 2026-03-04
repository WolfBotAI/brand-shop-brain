import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";

const benefits = [
  "Scale without hiring",
  "Zero support burden",
  "Configure once, apply everywhere",
  "Clients manage themselves",
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
            Start Serving More Clients{" "}
            <span className="text-primary">With Less Effort</span>
          </h2>
          <p className="text-xl text-[hsl(var(--section-dark-foreground))]/70 mb-10 max-w-2xl mx-auto">
            Join distributors who have transformed how they serve schools, churches, and brands — 
            with AI-powered automation that scales.
          </p>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-6 mb-10"
          >
            {benefits.map((benefit) => (
              <div 
                key={benefit}
                className="flex items-center gap-2 text-[hsl(var(--section-dark-foreground))]/80"
              >
                <CheckCircle className="w-5 h-5 text-primary" />
                <span>{benefit}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button 
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-7 text-xl rounded-full group shadow-lg"
              onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Book a Demo
              <ArrowRight className="ml-2 w-6 h-6 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button 
              size="lg"
              variant="ctaOutlineDark"
              className="px-12 py-7 text-xl rounded-full"
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            >
              See How It Works
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

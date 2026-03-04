import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface FeatureCTAProps {
  title: string;
  description: string;
}

export const FeatureCTA = ({ title, description }: FeatureCTAProps) => {
  return (
    <section className="py-20 bg-[hsl(var(--section-dark))]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--section-dark-foreground))] mb-4">
            {title}
          </h2>
          <p className="text-lg text-[hsl(var(--section-dark-foreground))]/70 mb-8">
            {description}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              asChild
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-full group"
            >
              <Link to="/assessment">
                Take Assessment
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button 
              asChild
              size="lg" 
              variant="outline"
              className="px-8 py-6 text-lg rounded-full border-[hsl(var(--section-dark-foreground))]/30 text-[hsl(var(--section-dark-foreground))] hover:bg-[hsl(var(--section-dark-foreground))]/10"
            >
              <Link to="/">
                Back to Home
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

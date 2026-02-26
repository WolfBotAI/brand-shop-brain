import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface FeatureHeroProps {
  icon: LucideIcon;
  badge: string;
  title: string;
  highlight: string;
  description: string;
  primaryCta?: string;
  secondaryCta?: string;
}

export const FeatureHero = ({
  icon: Icon,
  badge,
  title,
  highlight,
  description,
  primaryCta = "Book Demo",
  secondaryCta = "Contact Sales",
}: FeatureHeroProps) => {
  return (
    <section className="relative pt-32 pb-20 bg-secondary overflow-hidden">
      {/* Subtle dot pattern */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary-foreground) / 0.15) 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />
      
      <div className="relative container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-secondary-foreground mb-6">
            <Icon className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">{badge}</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-secondary-foreground leading-tight mb-6">
            {title}{" "}
            <span className="text-primary">{highlight}</span>
          </h1>

          {/* Description */}
          <p className="text-xl text-secondary-foreground/70 max-w-2xl mx-auto mb-10">
            {description}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-full group"
            >
              {primaryCta}
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button 
              size="lg" 
              variant="ctaOutlineSecondary"
              className="px-8 py-6 text-lg rounded-full"
            >
              {secondaryCta}
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

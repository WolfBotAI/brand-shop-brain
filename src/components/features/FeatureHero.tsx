import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

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
  primaryCta = "Take Assessment",
  secondaryCta = "Book a Demo",
}: FeatureHeroProps) => {
  return (
    <section className="relative pt-32 pb-20 bg-background overflow-hidden">
      {/* Subtle radial pattern matching homepage */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, hsl(var(--primary) / 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsl(var(--primary) / 0.05) 0%, transparent 40%)`,
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-foreground mb-6">
            <Icon className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">{badge}</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
            {title}{" "}
            <span className="text-primary">{highlight}</span>
          </h1>

          {/* Description */}
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            {description}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              asChild
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-full group"
            >
              <Link to="/assessment">
                {primaryCta}
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="px-8 py-6 text-lg rounded-full"
              onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {secondaryCta}
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

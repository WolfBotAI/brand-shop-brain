import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles } from "lucide-react";

const integrationLogos = [
  { name: "Printavo" },
  { name: "DecoNetwork" },
  { name: "InkSoft" },
  { name: "GraphicsFlow" },
  { name: "TaxJar" },
  { name: "QuickBooks" },
];

export const Hero = () => {
  return (
    <section className="relative min-h-screen overflow-hidden bg-secondary">
      {/* Subtle dot pattern background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary-foreground) / 0.15) 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="relative container mx-auto px-4 pt-32 pb-20">
        {/* Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-secondary-foreground">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Powered by WolfBot.AI Intelligence</span>
          </div>
        </motion.div>

        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center max-w-5xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-secondary-foreground leading-tight mb-6">
            One AI Brain.{" "}
            <span className="text-primary">Every Store.</span>
            <br />
            Zero Hassle.
          </h1>
          <p className="text-xl md:text-2xl text-secondary-foreground/70 max-w-3xl mx-auto mb-10">
            The smartest e-commerce platform for apparel distributors. 
            Customer acquisition, store creation, order routing, and 24/7 AI support — all in one.
          </p>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-full group"
          >
            Book Strategy Call
            <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground/10 px-8 py-6 text-lg rounded-full group"
          >
            <Play className="mr-2 w-5 h-5" />
            See It In Action
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-20"
        >
          {[
            { value: "24/7", label: "AI Support" },
            { value: "19+", label: "Ad Channels" },
            { value: "100s", label: "Ad Variations" },
            { value: "1", label: "Unified Brain" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-1">{stat.value}</div>
              <div className="text-sm text-secondary-foreground/60">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Integration Logos */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center"
        >
          <p className="text-sm text-secondary-foreground/50 mb-6 uppercase tracking-wider">
            Works with your existing systems
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {integrationLogos.map((logo, index) => (
              <motion.div
                key={logo.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                className="text-secondary-foreground/40 hover:text-secondary-foreground/70 transition-colors cursor-pointer"
              >
                <span className="text-lg font-semibold">{logo.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Clean bottom edge */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-background" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 100%)' }} />
    </section>
  );
};

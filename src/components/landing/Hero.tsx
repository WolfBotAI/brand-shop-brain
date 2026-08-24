import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Store, Sparkles, Zap } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Background pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-muted opacity-50" />
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, hsl(var(--primary) / 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsl(var(--primary) / 0.05) 0%, transparent 40%)`,
          }}
        />
      </div>

      <div className="relative container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6"
            >
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">For Apparel Distributors</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Launch a Store in{" "}
              <span className="text-primary">Minutes</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-4 max-w-xl">
              Let AI build it, curate it yourself, or let your client self-build — every store connects to your suppliers and decorators automatically.
            </p>

            <p className="text-base text-muted-foreground mb-8 max-w-xl">
              Three ways to launch. One platform. Integrated with your supply chain from day one.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                asChild
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-full group"
              >
                <a href="/assessment">
                  See How Much You Can Save
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
              <Button 
                asChild
                size="lg" 
                variant="ctaOutlineLight"
                className="px-8 py-6 text-lg rounded-full"
              >
                <a href="/demo">Book a Demo</a>
              </Button>
            </div>
          </motion.div>

          {/* Right - Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-card rounded-2xl shadow-2xl border border-border overflow-hidden">
              {/* Header */}
              <div className="bg-muted px-6 py-4 border-b border-border flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-destructive/50" />
                  <div className="w-3 h-3 rounded-full bg-primary/50" />
                  <div className="w-3 h-3 rounded-full bg-secondary" />
                </div>
                <span className="text-sm text-muted-foreground">AI Merch Advisor</span>
              </div>
              
              {/* AI Discovery Chat Preview */}
              <div className="p-6 space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="p-3 rounded-xl bg-muted text-foreground text-sm mr-8"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-medium text-primary">AI Advisor</span>
                  </div>
                  What's the purpose of this store? Team uniforms, fundraiser, corporate gifts, or event merch?
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="p-3 rounded-xl bg-primary/10 text-foreground text-sm ml-8"
                >
                  Fall football fundraiser for Lincoln High — budget around $25/item
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="p-3 rounded-xl bg-muted text-foreground text-sm mr-8"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-medium text-primary">AI Advisor</span>
                  </div>
                  Great! Dallas gets warm in fall — I'll prioritize moisture-wicking. Here are my top picks for your store.
                </motion.div>

                {/* AI Recommendation badge */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1 }}
                  className="flex items-center gap-3 p-3 bg-primary/5 rounded-xl border border-primary/20"
                >
                  <Sparkles className="w-5 h-5 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">AI-Curated Selection</p>
                    <p className="text-xs text-muted-foreground">8 products matched to budget & climate</p>
                  </div>
                </motion.div>

                {/* Mini product cards */}
                <div className="grid grid-cols-3 gap-2">
                  {["Dri-Fit Polo", "Lightweight Hoodie", "Performance Tee"].map((name, i) => (
                    <motion.div
                      key={name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.2 + i * 0.1 }}
                      className="p-2 rounded-lg bg-muted text-center"
                    >
                      <div className="w-full h-10 rounded bg-primary/10 flex items-center justify-center mb-1">
                        <Store className="w-4 h-4 text-primary" />
                      </div>
                      <p className="text-xs text-foreground truncate">{name}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

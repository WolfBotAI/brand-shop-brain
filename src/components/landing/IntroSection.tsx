import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Sparkles, MessageSquare, Phone } from "lucide-react";
import { Link } from "react-router-dom";

export const IntroSection = () => {
  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - AI Discovery Mockup */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden">
              {/* Window chrome */}
              <div className="bg-muted px-5 py-3 border-b border-border flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-destructive/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-primary/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-border" />
                </div>
                <span className="text-xs text-muted-foreground">AI Merch Advisor</span>
              </div>
              <div className="p-5 space-y-3">
                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
                  className="p-3 rounded-xl bg-muted text-sm text-foreground mr-6">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3 h-3 text-primary" />
                    <span className="text-[10px] font-medium text-primary">AI Advisor</span>
                  </div>
                  What's the purpose of this store?
                </motion.div>
                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }}
                  className="p-3 rounded-xl bg-primary/10 text-sm text-foreground ml-6">
                  Football fundraiser for Lincoln High
                </motion.div>
                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.7 }}
                  className="p-3 rounded-xl bg-muted text-sm text-foreground mr-6">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3 h-3 text-primary" />
                    <span className="text-[10px] font-medium text-primary">AI Advisor</span>
                  </div>
                  Great! Here are 8 top picks — moisture-wicking for Dallas fall weather…
                </motion.div>
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="absolute -bottom-5 -right-4 bg-primary text-primary-foreground px-5 py-3 rounded-xl shadow-lg"
            >
              <p className="text-sm font-bold">Zero Support</p>
              <p className="text-lg font-bold">100% Autopilot</p>
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
              AI Discovers. AI Recommends.{" "}
              <span className="text-primary">You Grow.</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              The AI Merch Advisor asks about purpose, audience, climate, and budget — 
              then recommends the perfect products for each client's needs.
            </p>
            <ul className="space-y-4 mb-8">
              {[
                "AI asks as many discovery questions as needed to match the best products",
                "AI-curated product catalogs tailored to each client",
                "AI Support Agent provides 24/7 support across web, SMS, email, FB & IG",
                "Bulk color & size selection across your entire catalog",
              ].map((item, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{item}</span>
                </motion.li>
              ))}
            </ul>
            <Button 
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-full group"
            >
              <Link to="/assessment">
                See How Much You Can Save
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

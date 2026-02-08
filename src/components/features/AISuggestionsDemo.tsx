import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Package, ArrowRight, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";

const suggestions = [
  { product: "Custom Polo Shirts", confidence: 94, reason: "Trending with schools", growth: "+32%" },
  { product: "Embroidered Caps", confidence: 87, reason: "High margin item", growth: "+18%" },
  { product: "Team Jerseys", confidence: 82, reason: "Season demand spike", growth: "+45%" },
];

export const AISuggestionsDemo = () => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStage((prev) => (prev + 1) % 4);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          {/* Demo Container */}
          <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Left: Data Analysis */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <TrendingUp className="w-4 h-4" />
                  <span>Analyzing Sales Patterns</span>
                </div>

                {/* Data Bars */}
                <div className="space-y-3">
                  {["Schools", "Churches", "Sports Teams"].map((category, index) => (
                    <div key={category} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground">{category}</span>
                        <span className="text-muted-foreground">{[65, 45, 78][index]}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: stage >= 1 ? `${[65, 45, 78][index]}%` : 0 }}
                          transition={{ duration: 0.8, delay: index * 0.2 }}
                          className="h-full bg-primary rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI Processing Indicator */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: stage >= 2 ? 1 : 0 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-5 h-5 text-primary" />
                  </motion.div>
                  <span className="text-sm text-foreground">AI generating recommendations...</span>
                </motion.div>
              </div>

              {/* Right: Recommendations */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-4">
                  <Package className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Recommended Products</span>
                </div>

                {suggestions.map((suggestion, index) => (
                  <motion.div
                    key={suggestion.product}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ 
                      opacity: stage >= 3 ? 1 : 0, 
                      x: stage >= 3 ? 0 : 20 
                    }}
                    transition={{ duration: 0.4, delay: index * 0.15 }}
                    className="p-4 rounded-xl border border-border bg-background hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-foreground">{suggestion.product}</h4>
                        <p className="text-xs text-muted-foreground">{suggestion.reason}</p>
                      </div>
                      <div className="flex items-center gap-1 text-primary text-sm font-medium">
                        <TrendingUp className="w-3 h-3" />
                        {suggestion.growth}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${suggestion.confidence}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{suggestion.confidence}% match</span>
                      </div>
                      <button className="flex items-center gap-1 text-xs text-primary hover:underline">
                        Add to catalog
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: stage >= 3 ? 1 : 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center gap-2 text-sm text-primary pt-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>3 products recommended for your client base</span>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

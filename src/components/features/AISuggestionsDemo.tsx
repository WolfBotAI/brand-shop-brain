import { motion } from "framer-motion";
import { Sparkles, ShoppingBag, CloudSun, DollarSign, Palette, ArrowRight, Plus, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";

const chatMessages = [
  { role: "user" as const, text: "We need team uniforms for an outdoor fall football fundraiser. Budget is $25/item, school colors are navy and gold." },
  { role: "ai" as const, text: "Got it! Searching catalogs for outdoor-friendly apparel in navy/gold, under $25…" },
];

const recommendations = [
  { name: "Dri-Fit Polo — Navy/Gold", price: "$18.50", supplier: "Brand-Shop Catalog", match: 96, tag: "Best Match" },
  { name: "Lightweight Hoodie — Navy", price: "$22.00", supplier: "Brand-Shop Catalog", match: 89, tag: "Weather Pick" },
  { name: "Performance Tee — Gold", price: "$14.75", supplier: "Brand-Shop Catalog", match: 84, tag: "Budget Friendly" },
];

export const AISuggestionsDemo = () => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStage((prev) => (prev + 1) % 5);
    }, 2800);
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
          <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left: Conversation */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span>AI Merch Advisor</span>
                </div>

                {/* Chat messages */}
                <div className="space-y-3">
                  {chatMessages.map((msg, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: stage >= index ? 1 : 0, y: stage >= index ? 0 : 10 }}
                      transition={{ duration: 0.4 }}
                      className={`p-3 rounded-xl text-sm ${
                        msg.role === "user"
                          ? "bg-primary/10 text-foreground ml-4"
                          : "bg-muted text-foreground mr-4"
                      }`}
                    >
                      {msg.text}
                    </motion.div>
                  ))}
                </div>

                {/* Context pills */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: stage >= 2 ? 1 : 0 }}
                  className="flex flex-wrap gap-2"
                >
                  {[
                    { icon: CloudSun, label: "Fall · 55°F" },
                    { icon: DollarSign, label: "≤$25/item" },
                    { icon: Palette, label: "Navy & Gold" },
                    { icon: ShoppingBag, label: "Fundraiser" },
                  ].map((pill) => (
                    <span key={pill.label} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted text-xs text-muted-foreground border border-border">
                      <pill.icon className="w-3 h-3" />
                      {pill.label}
                    </span>
                  ))}
                </motion.div>
              </div>

              {/* Right: Recommendations */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-4">
                  <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Catalog Matches</span>
                </div>

                {recommendations.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{
                      opacity: stage >= 3 ? 1 : 0,
                      x: stage >= 3 ? 0 : 20,
                    }}
                    transition={{ duration: 0.4, delay: index * 0.12 }}
                    className="p-4 rounded-xl border border-border bg-background hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-foreground text-sm">{item.name}</h4>
                        <p className="text-xs text-muted-foreground">{item.supplier}</p>
                      </div>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        {item.tag}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">{item.price}</span>
                        <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${item.match}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground">{item.match}%</span>
                      </div>
                      <button className="flex items-center gap-1 text-xs text-primary hover:underline">
                        <Plus className="w-3 h-3" />
                        Add to Store
                      </button>
                    </div>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: stage >= 4 ? 1 : 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-2 text-sm text-primary pt-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>3 items matched from your catalog</span>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

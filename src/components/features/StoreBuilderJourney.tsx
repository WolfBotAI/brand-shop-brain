import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, Package, ShoppingBag, Layout, Rocket, Check, Sparkles,
  Pause, Play, Users, Plug, ShoppingCart
} from "lucide-react";
import { StepIndicator } from "./AnimatedStep";
import { ChatBubble } from "./ChatBubble";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const steps = [
  { title: "AI Discovery", icon: MessageSquare },
  { title: "Package Selection", icon: Package },
  { title: "AI Catalog", icon: ShoppingBag },
  { title: "Theme & Launch", icon: Rocket },
];

const discoveryChat = [
  { role: "ai" as const, text: "What's the purpose of this store?" },
  { role: "user" as const, text: "Fall football fundraiser" },
  { role: "ai" as const, text: "Who's your target audience?" },
  { role: "user" as const, text: "Students, parents, and fans" },
  { role: "ai" as const, text: "What city? I'll factor in climate." },
  { role: "user" as const, text: "Dallas, TX" },
  { role: "ai" as const, text: "Budget per item?" },
  { role: "user" as const, text: "Around $25" },
];

const packageTiers = [
  { id: "a", name: "Starter", items: 10, price: "$49/mo" },
  { id: "b", name: "Growth", items: 25, price: "$99/mo", popular: true },
  { id: "c", name: "Pro", items: 40, price: "$179/mo" },
];

const catalogProducts = [
  { id: 1, name: "Dri-Fit Polo", price: "$18.50", colors: ["bg-blue-900", "bg-yellow-500"], sizes: "S-2XL" },
  { id: 2, name: "Lightweight Hoodie", price: "$22.00", colors: ["bg-blue-900", "bg-gray-400"], sizes: "S-3XL" },
  { id: 3, name: "Performance Tee", price: "$14.75", colors: ["bg-yellow-500", "bg-blue-900"], sizes: "YS-2XL" },
  { id: 4, name: "Quarter Zip", price: "$24.50", colors: ["bg-blue-900"], sizes: "S-2XL" },
  { id: 5, name: "Mesh Shorts", price: "$16.00", colors: ["bg-yellow-500", "bg-blue-900"], sizes: "S-XL" },
  { id: 6, name: "Baseball Cap", price: "$12.00", colors: ["bg-blue-900", "bg-yellow-500"], sizes: "OS" },
];

const themeModes = [
  { id: "presets", label: "Preset Themes", desc: "Navy & Gold Spirit" },
  { id: "custom", label: "Custom Colors", desc: "Pick your own palette" },
  { id: "scrape", label: "AI Scrape", desc: "Match your school website" },
];

const integrationPlatforms = [
  { id: "shopify", name: "Shopify", icon: ShoppingCart },
  { id: "woocommerce", name: "WooCommerce", icon: ShoppingBag },
  { id: "custom", name: "Custom API", icon: Plug },
];

const aiMessages: Record<number, string> = {
  0: "Let me learn about your store. I'll ask a few quick questions…",
  1: "Based on your needs, I recommend Package B — up to 25 items for a fundraiser.",
  2: "Here are my top picks for fall football in Dallas. Moisture-wicking, under $25, navy & gold.",
  3: "Pick a theme mode — presets, custom, or let AI match your school website. Then you're live!",
};

type Mode = "client-build" | "ai-templates" | "connect-store";

const TOTAL_CYCLE_MS = 32000;

export const StoreBuilderJourney = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [chatIndex, setChatIndex] = useState(0);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [mode, setMode] = useState<Mode>("client-build");
  const [progress, setProgress] = useState(0);
  const [connectedPlatform, setConnectedPlatform] = useState<string | null>(null);
  const [connectStep, setConnectStep] = useState(0);

  // Progress bar
  useEffect(() => {
    if (!isAutoPlaying || isPaused || mode === "connect-store") return;
    const interval = setInterval(() => {
      setProgress(prev => prev >= 100 ? 0 : prev + (100 / (TOTAL_CYCLE_MS / 100)));
    }, 100);
    return () => clearInterval(interval);
  }, [isAutoPlaying, isPaused, mode]);

  // Auto-advance
  useEffect(() => {
    if (!isAutoPlaying || isPaused || mode === "connect-store") return;
    const timers: NodeJS.Timeout[] = [];

    // Step 0: Discovery chat — reveal messages one by one
    let t = 1000;
    discoveryChat.forEach((_, i) => {
      timers.push(setTimeout(() => setChatIndex(i + 1), t));
      t += 1200;
    });
    // Advance to step 1 after all chat
    timers.push(setTimeout(() => { setCurrentStep(1); setChatIndex(0); }, t + 500));
    const step1Start = t + 500;

    // Step 1: Select package
    timers.push(setTimeout(() => setSelectedPackage("b"), step1Start + 2000));
    timers.push(setTimeout(() => setCurrentStep(2), step1Start + 3500));
    const step2Start = step1Start + 3500;

    // Step 2: Select products one by one
    [1, 2, 3, 4, 5, 6].forEach((id, i) => {
      timers.push(setTimeout(() => setSelectedProducts(prev => [...prev, id]), step2Start + 1000 + i * 800));
    });
    timers.push(setTimeout(() => setCurrentStep(3), step2Start + 7000));
    const step3Start = step2Start + 7000;

    // Step 3: Select theme
    timers.push(setTimeout(() => setSelectedTheme("presets"), step3Start + 2000));

    // Reset
    timers.push(setTimeout(() => {
      setCurrentStep(0);
      setChatIndex(0);
      setSelectedPackage(null);
      setSelectedProducts([]);
      setSelectedTheme(null);
      setProgress(0);
    }, step3Start + 5000));

    return () => timers.forEach(clearTimeout);
  }, [isAutoPlaying, isPaused, mode, currentStep === 0 && isAutoPlaying]);

  // Connect store auto-play
  useEffect(() => {
    if (!isAutoPlaying || isPaused || mode !== "connect-store") return;
    const timers: NodeJS.Timeout[] = [];
    timers.push(setTimeout(() => setConnectedPlatform("shopify"), 3000));
    timers.push(setTimeout(() => setConnectStep(1), 5000));
    timers.push(setTimeout(() => setConnectStep(2), 8000));
    timers.push(setTimeout(() => setConnectStep(3), 11000));
    timers.push(setTimeout(() => { setConnectedPlatform(null); setConnectStep(0); }, 16000));
    return () => timers.forEach(clearTimeout);
  }, [isAutoPlaying, isPaused, mode, connectedPlatform === null && mode === "connect-store"]);

  const resetAll = () => {
    setCurrentStep(0); setChatIndex(0); setSelectedPackage(null);
    setSelectedProducts([]); setSelectedTheme(null); setProgress(0);
    setConnectedPlatform(null); setConnectStep(0); setIsAutoPlaying(true);
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Watch the AI-Powered Store Builder
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            AI discovers needs, recommends a package, fills the catalog, and launches — all automated. Hover to pause.
          </p>

          <div className="flex items-center justify-center gap-2 flex-wrap">
            {([
              { id: "ai-templates" as Mode, label: "AI Templates", icon: Sparkles, desc: "You build for clients" },
              { id: "client-build" as Mode, label: "Client Self-Build", icon: Users, desc: "Clients use AI" },
              { id: "connect-store" as Mode, label: "Connect Your Store", icon: Plug, desc: "Shopify / WooCommerce" },
            ]).map((opt) => (
              <button
                key={opt.id}
                onClick={() => { setMode(opt.id); resetAll(); }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  mode === opt.id
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                <opt.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{opt.label}</span>
                <span className="sm:hidden">{opt.label.split(" ")[0]}</span>
              </button>
            ))}
          </div>
        </div>

        <div
          className="max-w-6xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {mode !== "connect-store" ? (
            <div className="grid lg:grid-cols-12 gap-6">
              <div className="lg:col-span-3">
                <StepIndicator
                  steps={steps}
                  currentStep={currentStep}
                  onStepClick={(s) => { setIsAutoPlaying(false); setCurrentStep(s); }}
                />
              </div>

              <div className="lg:col-span-9">
                <div className="bg-card border border-border rounded-2xl p-6 md:p-8 min-h-[400px] relative">
                  {isPaused && isAutoPlaying && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="absolute top-4 right-4 flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
                      <Pause className="w-3 h-3" /> Paused
                    </motion.div>
                  )}

                  <div className="mb-6">
                    <AnimatePresence mode="wait">
                      <ChatBubble key={currentStep} message={aiMessages[currentStep]} />
                    </AnimatePresence>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.5 }}
                      className="mt-6"
                    >
                      {/* Step 0: Discovery Chat */}
                      {currentStep === 0 && (
                        <div className="space-y-3 max-w-lg">
                          {discoveryChat.slice(0, chatIndex).map((msg, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                              className={`p-3 rounded-xl text-sm ${
                                msg.role === "user"
                                  ? "bg-primary/10 text-foreground ml-8"
                                  : "bg-muted text-foreground mr-8"
                              }`}
                            >
                              {msg.role === "ai" && (
                                <div className="flex items-center gap-1 mb-1">
                                  <Sparkles className="w-3 h-3 text-primary" />
                                  <span className="text-xs font-medium text-primary">AI</span>
                                </div>
                              )}
                              {msg.text}
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {/* Step 1: Package Selection */}
                      {currentStep === 1 && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {packageTiers.map((pkg) => (
                            <motion.button
                              key={pkg.id}
                              onClick={() => { setIsAutoPlaying(false); setSelectedPackage(pkg.id); }}
                              className={`p-6 rounded-xl border-2 transition-all text-left relative ${
                                selectedPackage === pkg.id
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-primary/50"
                              }`}
                              whileHover={{ scale: 1.02 }}
                            >
                              {pkg.popular && (
                                <span className="absolute -top-2.5 right-3 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-medium">
                                  Recommended
                                </span>
                              )}
                              <Package className="w-8 h-8 text-primary mb-3" />
                              <p className="font-bold text-foreground text-lg">{pkg.name}</p>
                              <p className="text-sm text-muted-foreground">Up to {pkg.items} items</p>
                              <p className="text-sm font-semibold text-primary mt-2">{pkg.price}</p>
                              {selectedPackage === pkg.id && (
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-3 right-3">
                                  <Check className="w-5 h-5 text-primary" />
                                </motion.div>
                              )}
                            </motion.button>
                          ))}
                        </div>
                      )}

                      {/* Step 2: AI Catalog */}
                      {currentStep === 2 && (
                        <div>
                          <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                            <span>{selectedProducts.length} of 25 selected (Package B)</span>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {catalogProducts.map((product) => (
                              <motion.button
                                key={product.id}
                                onClick={() => {
                                  setIsAutoPlaying(false);
                                  setSelectedProducts(prev =>
                                    prev.includes(product.id) ? prev.filter(i => i !== product.id) : [...prev, product.id]
                                  );
                                }}
                                className={`p-4 rounded-xl border-2 transition-all text-left relative ${
                                  selectedProducts.includes(product.id)
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-primary/50"
                                }`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                {/* Placeholder image */}
                                <div className="w-full h-16 rounded-lg bg-muted flex items-center justify-center mb-2">
                                  <ShoppingBag className="w-6 h-6 text-muted-foreground" />
                                </div>
                                <p className="font-medium text-foreground text-sm">{product.name}</p>
                                <p className="text-xs text-primary font-semibold">{product.price}</p>
                                <div className="flex items-center gap-1 mt-2">
                                  {product.colors.map((c, i) => (
                                    <div key={i} className={`w-3.5 h-3.5 rounded-full ${c} border border-border`} />
                                  ))}
                                  <span className="text-xs text-muted-foreground ml-1">{product.sizes}</span>
                                </div>
                                {selectedProducts.includes(product.id) && (
                                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2 right-2">
                                    <Check className="w-4 h-4 text-primary" />
                                  </motion.div>
                                )}
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Step 3: Theme & Launch */}
                      {currentStep === 3 && (
                        <div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                            {themeModes.map((tm) => (
                              <motion.button
                                key={tm.id}
                                onClick={() => { setIsAutoPlaying(false); setSelectedTheme(tm.id); }}
                                className={`p-5 rounded-xl border-2 transition-all text-left ${
                                  selectedTheme === tm.id
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-primary/50"
                                }`}
                                whileHover={{ scale: 1.02 }}
                              >
                                <Layout className="w-6 h-6 text-primary mb-2" />
                                <p className="font-semibold text-foreground">{tm.label}</p>
                                <p className="text-xs text-muted-foreground">{tm.desc}</p>
                                {selectedTheme === tm.id && (
                                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-2">
                                    <Check className="w-5 h-5 text-primary" />
                                  </motion.div>
                                )}
                              </motion.button>
                            ))}
                          </div>

                          {selectedTheme && (
                            <motion.div className="text-center" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                              <motion.div
                                className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4"
                                initial={{ scale: 0 }}
                                animate={{ scale: [0, 1.2, 1] }}
                                transition={{ duration: 0.5 }}
                              >
                                <Rocket className="w-8 h-8 text-primary-foreground" />
                              </motion.div>
                              <h3 className="text-xl font-bold text-foreground mb-1">Store Ready!</h3>
                              <p className="text-sm text-muted-foreground">6 items · Package B · Navy & Gold Spirit Theme</p>
                              <Button size="lg" className="rounded-full px-8 mt-4">
                                Launch Store <Rocket className="ml-2 w-4 h-4" />
                              </Button>
                            </motion.div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {isAutoPlaying && (
                    <div className="mt-6">
                      <Progress value={progress} className="h-1" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Connect Your Store Mode */
            <div className="bg-card border border-border rounded-2xl p-6 md:p-8 min-h-[400px] relative">
              {isPaused && isAutoPlaying && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="absolute top-4 right-4 flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
                  <Pause className="w-3 h-3" /> Paused
                </motion.div>
              )}

              <div className="mb-6">
                <ChatBubble message="Connect your existing ecommerce platform. We'll sync products, orders, and customers automatically." />
              </div>

              <div className="max-w-2xl mx-auto">
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {integrationPlatforms.map((platform) => (
                    <motion.button
                      key={platform.id}
                      onClick={() => { setIsAutoPlaying(false); setConnectedPlatform(platform.id); }}
                      className={`p-6 rounded-xl border-2 transition-all text-center ${
                        connectedPlatform === platform.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      whileHover={{ scale: 1.02 }}
                    >
                      <platform.icon className="w-8 h-8 mx-auto mb-3 text-foreground" />
                      <p className="font-medium text-foreground text-sm">{platform.name}</p>
                      {connectedPlatform === platform.id && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-2">
                          <Check className="w-5 h-5 text-primary mx-auto" />
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>

                {connectedPlatform && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                    {[
                      { label: "Authenticating with API...", done: connectStep >= 1 },
                      { label: "Syncing product catalog (142 products)...", done: connectStep >= 2 },
                      { label: "Importing customer data & order history...", done: connectStep >= 3 },
                    ].map((step, i) => (
                      <div key={i} className={`flex items-center gap-3 p-3 rounded-lg transition-all ${step.done ? "bg-primary/5" : "bg-muted"}`}>
                        {step.done ? (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                            <Check className="w-5 h-5 text-primary" />
                          </motion.div>
                        ) : (
                          <motion.div
                            className="w-5 h-5 border-2 border-muted-foreground/30 rounded-full border-t-primary"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                        )}
                        <span className={`text-sm ${step.done ? "text-foreground" : "text-muted-foreground"}`}>{step.label}</span>
                      </div>
                    ))}
                    {connectStep >= 3 && (
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        className="text-center p-6 bg-primary/5 border border-primary rounded-xl mt-4">
                        <Check className="w-10 h-10 text-primary mx-auto mb-2" />
                        <p className="font-bold text-foreground">Store Connected Successfully!</p>
                        <p className="text-sm text-muted-foreground mt-1">142 products, 1,203 customers synced</p>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

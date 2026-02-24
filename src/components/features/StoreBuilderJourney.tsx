import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, Church, Briefcase, Palette, ShoppingBag, Layout, Rocket, Check, Sparkles,
  Sun, TrendingUp, Users, Settings, Plug, Play, Pause, ShoppingCart
} from "lucide-react";
import { StepIndicator } from "./AnimatedStep";
import { ChatBubble } from "./ChatBubble";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const steps = [
  { title: "Organization Type", icon: Building2 },
  { title: "AI Product Suggestions", icon: Sparkles },
  { title: "Choose Theme", icon: Layout },
  { title: "Go Live!", icon: Rocket },
];

const organizationTypes = [
  { id: "school", label: "High Schools", icon: Building2, color: "bg-blue-500" },
  { id: "church", label: "Churches", icon: Church, color: "bg-purple-500" },
  { id: "business", label: "B2B Brands", icon: Briefcase, color: "bg-emerald-500" },
];

const aiSuggestions = {
  school: [
    { id: "tshirt", name: "Spirit T-Shirts", reason: "Best seller for schools", icon: "👕", trending: true },
    { id: "hoodie", name: "Team Hoodies", reason: "Popular for fall sports", icon: "🧥", weather: true },
    { id: "cap", name: "Baseball Caps", reason: "Trending in your region", icon: "🧢", trending: true },
    { id: "polo", name: "Staff Polos", reason: "Requested by admin", icon: "👔", recommended: true },
  ],
  church: [
    { id: "tshirt", name: "Event Tees", reason: "VBS & retreats", icon: "👕", trending: true },
    { id: "mug", name: "Ministry Mugs", reason: "Popular for volunteers", icon: "☕", recommended: true },
    { id: "bag", name: "Tote Bags", reason: "Eco-friendly choice", icon: "👜", weather: false },
    { id: "hat", name: "Embroidered Hats", reason: "Trending for outreach", icon: "🧢", trending: true },
  ],
  business: [
    { id: "polo", name: "Corporate Polos", reason: "Professional look", icon: "👔", recommended: true },
    { id: "jacket", name: "Quarter Zips", reason: "Executive favorite", icon: "🧥", weather: true },
    { id: "notebook", name: "Branded Notebooks", reason: "Client gifts", icon: "📓", trending: true },
    { id: "bag", name: "Laptop Bags", reason: "Trade show essential", icon: "💼", recommended: true },
  ],
};

const themes = [
  { id: "modern", name: "Modern", description: "Clean lines, bold typography", locked: false },
  { id: "classic", name: "Classic", description: "Traditional, timeless feel", locked: false },
  { id: "bold", name: "Bold", description: "Vibrant, eye-catching", locked: true, lockedBy: "Distributor" },
];

const integrationPlatforms = [
  { id: "shopify", name: "Shopify", icon: ShoppingCart },
  { id: "woocommerce", name: "WooCommerce", icon: ShoppingBag },
  { id: "custom", name: "Custom API", icon: Plug },
];

const aiMessages: Record<number, Record<string, string>> = {
  0: {
    default: "Let's start! What type of organization is this store for?",
    distributor: "Select the organization type to configure their store.",
  },
  1: {
    school: "🎓 Based on Lincoln High's vertical and current trends, I recommend these products. The weather is warming up, so lightweight options are trending!",
    church: "⛪ For Grace Community Church, I've analyzed similar churches and current trends. These products perform best for ministry stores!",
    business: "💼 For corporate stores, I've selected products that balance professionalism with brand visibility. Q1 trade show season is approaching!",
    default: "Based on your organization type, here are AI-recommended products...",
  },
  2: {
    default: "Almost there! Pick a theme that matches your brand. Some themes are locked by your distributor.",
    distributor: "Assign a pre-approved theme from your catalog.",
  },
  3: {
    default: "🎉 Your store is ready! AI will continue suggesting trending products based on season and demand.",
  },
};

type Mode = "ai-templates" | "client-build" | "connect-store";

const TOTAL_CYCLE_MS = 25000;
const STEP_TIMINGS = [
  { selectAt: 3000, advanceAt: 4000 },
  { selectAt: 5500, advanceAt: 7500 },  // products selected one by one 
  { selectAt: 3000, advanceAt: 4000 },
  { resetAt: 5000 },
];

export const StoreBuilderJourney = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
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
      setProgress(prev => {
        if (prev >= 100) return 0;
        return prev + (100 / (TOTAL_CYCLE_MS / 100));
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isAutoPlaying, isPaused, mode]);

  // Auto-advance demo for ai-templates / client-build modes
  useEffect(() => {
    if (!isAutoPlaying || isPaused || mode === "connect-store") return;
    
    const timers: NodeJS.Timeout[] = [];
    
    // Step 0: Select organization at 3s, advance at 4s
    timers.push(setTimeout(() => setSelectedOrg("school"), 3000));
    timers.push(setTimeout(() => setCurrentStep(1), 4000));
    
    // Step 1: AI suggests products - select one by one with 1s gaps
    timers.push(setTimeout(() => setSelectedProducts(["tshirt"]), 5500));
    timers.push(setTimeout(() => setSelectedProducts(["tshirt", "hoodie"]), 6500));
    timers.push(setTimeout(() => setSelectedProducts(["tshirt", "hoodie", "cap"]), 7500));
    timers.push(setTimeout(() => setCurrentStep(2), 10000));
    
    // Step 2: Select theme at 13s, advance at 14s
    timers.push(setTimeout(() => setSelectedTheme("modern"), 13000));
    timers.push(setTimeout(() => setCurrentStep(3), 14000));
    
    // Reset and loop at 20s
    timers.push(setTimeout(() => {
      setCurrentStep(0);
      setSelectedOrg(null);
      setSelectedProducts([]);
      setSelectedTheme(null);
      setProgress(0);
    }, 20000));

    return () => timers.forEach(clearTimeout);
  }, [isAutoPlaying, isPaused, currentStep === 0 && isAutoPlaying, mode]);

  // Connect store auto-play
  useEffect(() => {
    if (!isAutoPlaying || isPaused || mode !== "connect-store") return;
    const timers: NodeJS.Timeout[] = [];
    timers.push(setTimeout(() => setConnectedPlatform("shopify"), 3000));
    timers.push(setTimeout(() => setConnectStep(1), 5000));
    timers.push(setTimeout(() => setConnectStep(2), 8000));
    timers.push(setTimeout(() => setConnectStep(3), 11000));
    timers.push(setTimeout(() => {
      setConnectedPlatform(null);
      setConnectStep(0);
    }, 16000));
    return () => timers.forEach(clearTimeout);
  }, [isAutoPlaying, isPaused, mode, connectedPlatform === null && mode === "connect-store"]);

  const handleStepClick = (step: number) => {
    setIsAutoPlaying(false);
    setCurrentStep(step);
  };

  const toggleProduct = (productId: string) => {
    setIsAutoPlaying(false);
    setSelectedProducts(prev => 
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const getCurrentMessage = () => {
    const stepMessages = aiMessages[currentStep];
    if (currentStep === 1 && selectedOrg) {
      return stepMessages[selectedOrg] || stepMessages.default;
    }
    return mode === "ai-templates" && stepMessages.distributor 
      ? stepMessages.distributor 
      : stepMessages.default;
  };

  const currentSuggestions = selectedOrg 
    ? aiSuggestions[selectedOrg as keyof typeof aiSuggestions] 
    : [];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Watch the AI-Powered Store Builder
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            AI suggests products based on vertical, weather, and trends. Hover to pause the demo.
          </p>
          
          {/* 3-Option Mode Selector */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {[
              { id: "ai-templates" as Mode, label: "AI Templates", icon: Sparkles, desc: "You build for clients" },
              { id: "client-build" as Mode, label: "Client Self-Build", icon: Users, desc: "Clients use AI" },
              { id: "connect-store" as Mode, label: "Connect Your Store", icon: Plug, desc: "Shopify / WooCommerce" },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  setMode(opt.id);
                  setIsAutoPlaying(true);
                  setCurrentStep(0);
                  setSelectedOrg(null);
                  setSelectedProducts([]);
                  setSelectedTheme(null);
                  setProgress(0);
                  setConnectedPlatform(null);
                  setConnectStep(0);
                }}
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

        {/* Demo Container with pause-on-hover */}
        <div 
          className="max-w-6xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {mode !== "connect-store" ? (
            <div className="grid lg:grid-cols-12 gap-6">
              {/* Step Indicator - Left sidebar */}
              <div className="lg:col-span-3">
                <StepIndicator 
                  steps={steps} 
                  currentStep={currentStep} 
                  onStepClick={handleStepClick}
                />
              </div>

              {/* Main Content Area */}
              <div className="lg:col-span-9">
                <div className="bg-card border border-border rounded-2xl p-6 md:p-8 min-h-[350px] md:min-h-[400px] relative">
                  {/* Play/Pause indicator */}
                  {isPaused && isAutoPlaying && (
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }}
                      className="absolute top-4 right-4 flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full"
                    >
                      <Pause className="w-3 h-3" /> Paused
                    </motion.div>
                  )}

                  {/* AI Chat Bubble */}
                  <div className="mb-6">
                    <AnimatePresence mode="wait">
                      <ChatBubble 
                        key={`${currentStep}-${selectedOrg}`} 
                        message={getCurrentMessage()} 
                      />
                    </AnimatePresence>
                  </div>

                  {/* Step Content */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.5 }}
                      className="mt-8"
                    >
                      {/* Step 0: Organization Selection */}
                      {currentStep === 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {organizationTypes.map((org) => (
                            <motion.button
                              key={org.id}
                              onClick={() => {
                                setIsAutoPlaying(false);
                                setSelectedOrg(org.id);
                              }}
                              className={`p-6 rounded-xl border-2 transition-all ${
                                selectedOrg === org.id 
                                  ? "border-primary bg-primary/5" 
                                  : "border-border hover:border-primary/50"
                              }`}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className={`w-12 h-12 rounded-full ${org.color} flex items-center justify-center mx-auto mb-3`}>
                                <org.icon className="w-6 h-6 text-white" />
                              </div>
                              <p className="font-medium text-card-foreground">{org.label}</p>
                              {selectedOrg === org.id && (
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-2">
                                  <Check className="w-5 h-5 text-primary mx-auto" />
                                </motion.div>
                              )}
                            </motion.button>
                          ))}
                        </div>
                      )}

                      {/* Step 1: AI Product Suggestions */}
                      {currentStep === 1 && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-4 p-3 bg-muted rounded-xl text-sm flex-wrap">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <TrendingUp className="w-4 h-4 text-primary" />
                              <span>Trending</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Sun className="w-4 h-4 text-amber-500" />
                              <span>Weather: 72°F, Sunny</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Sparkles className="w-4 h-4 text-purple-500" />
                              <span>AI Recommended</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            {currentSuggestions.map((product) => (
                              <motion.button
                                key={product.id}
                                onClick={() => toggleProduct(product.id)}
                                className={`p-4 rounded-xl border-2 transition-all text-left relative ${
                                  selectedProducts.includes(product.id)
                                    ? "border-primary bg-primary/5" 
                                    : "border-border hover:border-primary/50"
                                }`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <div className="absolute top-2 right-2 flex gap-1">
                                  {product.trending && (
                                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full flex items-center gap-1">
                                      <TrendingUp className="w-3 h-3" /> Trending
                                    </span>
                                  )}
                                  {product.weather && (
                                    <span className="px-2 py-0.5 bg-amber-500/10 text-amber-600 text-xs rounded-full flex items-center gap-1">
                                      <Sun className="w-3 h-3" /> Season
                                    </span>
                                  )}
                                </div>
                                <div className="text-3xl mb-2">{product.icon}</div>
                                <p className="font-medium text-card-foreground">{product.name}</p>
                                <p className="text-xs text-muted-foreground mt-1">{product.reason}</p>
                                {selectedProducts.includes(product.id) && (
                                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute bottom-2 right-2">
                                    <Check className="w-5 h-5 text-primary" />
                                  </motion.div>
                                )}
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Step 2: Theme Selection */}
                      {currentStep === 2 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {themes.map((theme) => (
                            <motion.button
                              key={theme.id}
                              onClick={() => {
                                if (!theme.locked || mode === "ai-templates") {
                                  setIsAutoPlaying(false);
                                  setSelectedTheme(theme.id);
                                }
                              }}
                              className={`p-6 rounded-xl border-2 transition-all text-left relative ${
                                theme.locked && mode !== "ai-templates"
                                  ? "border-border bg-muted/50 cursor-not-allowed opacity-60"
                                  : selectedTheme === theme.id 
                                    ? "border-primary bg-primary/5" 
                                    : "border-border hover:border-primary/50"
                              }`}
                              whileHover={{ scale: theme.locked && mode !== "ai-templates" ? 1 : 1.02 }}
                            >
                              {theme.locked && mode !== "ai-templates" && (
                                <div className="absolute top-2 right-2 px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-full">
                                  Locked by {theme.lockedBy}
                                </div>
                              )}
                              <div className="w-full h-20 bg-muted rounded-lg mb-4 flex items-center justify-center">
                                <Layout className="w-8 h-8 text-muted-foreground" />
                              </div>
                              <p className="font-semibold text-card-foreground">{theme.name}</p>
                              <p className="text-sm text-muted-foreground">{theme.description}</p>
                              {selectedTheme === theme.id && (
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-2">
                                  <Check className="w-5 h-5 text-primary" />
                                </motion.div>
                              )}
                            </motion.button>
                          ))}
                        </div>
                      )}

                      {/* Step 3: Launch */}
                      {currentStep === 3 && (
                        <motion.div className="text-center py-8" initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
                          <motion.div
                            className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6"
                            initial={{ scale: 0 }}
                            animate={{ scale: [0, 1.2, 1] }}
                            transition={{ duration: 0.6 }}
                          >
                            <Rocket className="w-10 h-10 text-primary-foreground" />
                          </motion.div>
                          <h3 className="text-2xl font-bold text-card-foreground mb-2">
                            Your AI-Powered Store is Ready!
                          </h3>
                          <p className="text-muted-foreground mb-4">
                            Lincoln High School Spirit Store is configured with AI product recommendations.
                          </p>
                          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span>AI will continuously suggest new products based on trends & weather</span>
                          </div>
                          <Button size="lg" className="rounded-full px-8">
                            Launch Store
                            <Rocket className="ml-2 w-4 h-4" />
                          </Button>
                        </motion.div>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {/* Progress bar */}
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
            <div className="bg-card border border-border rounded-2xl p-6 md:p-8 min-h-[350px] md:min-h-[400px] relative">
              {isPaused && isAutoPlaying && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="absolute top-4 right-4 flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full"
                >
                  <Pause className="w-3 h-3" /> Paused
                </motion.div>
              )}

              <div className="mb-6">
                <ChatBubble message="Connect your existing ecommerce platform. We'll sync products, orders, and customers automatically." />
              </div>

              <div className="max-w-2xl mx-auto">
                {/* Platform Selection */}
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
                      <platform.icon className="w-8 h-8 mx-auto mb-3 text-card-foreground" />
                      <p className="font-medium text-card-foreground text-sm">{platform.name}</p>
                      {connectedPlatform === platform.id && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-2">
                          <Check className="w-5 h-5 text-primary mx-auto" />
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>

                {/* Integration Steps */}
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
                        <span className={`text-sm ${step.done ? "text-card-foreground" : "text-muted-foreground"}`}>
                          {step.label}
                        </span>
                      </div>
                    ))}
                    {connectStep >= 3 && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }} 
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center p-6 bg-primary/5 border border-primary rounded-xl mt-4"
                      >
                        <Check className="w-10 h-10 text-primary mx-auto mb-2" />
                        <p className="font-bold text-card-foreground">Store Connected Successfully!</p>
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

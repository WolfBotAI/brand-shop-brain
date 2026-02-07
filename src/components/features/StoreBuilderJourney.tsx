import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, 
  Church, 
  Briefcase, 
  Palette, 
  ShoppingBag, 
  Layout, 
  Rocket,
  Check,
  Upload
} from "lucide-react";
import { StepIndicator } from "./AnimatedStep";
import { ChatBubble } from "./ChatBubble";
import { Button } from "@/components/ui/button";

const steps = [
  { title: "Organization Type", icon: Building2 },
  { title: "Brand Colors", icon: Palette },
  { title: "Select Products", icon: ShoppingBag },
  { title: "Choose Theme", icon: Layout },
  { title: "Go Live!", icon: Rocket },
];

const organizationTypes = [
  { id: "school", label: "High Schools", icon: Building2, color: "bg-blue-500" },
  { id: "church", label: "Churches", icon: Church, color: "bg-purple-500" },
  { id: "business", label: "B2B Brands", icon: Briefcase, color: "bg-emerald-500" },
];

const brandColors = [
  { name: "Navy Blue", primary: "#1e3a5f", secondary: "#3b82f6" },
  { name: "Forest Green", primary: "#166534", secondary: "#22c55e" },
  { name: "Royal Purple", primary: "#581c87", secondary: "#a855f7" },
  { name: "Crimson Red", primary: "#991b1b", secondary: "#ef4444" },
];

const products = [
  { id: "tshirt", name: "T-Shirts", image: "👕", selected: false },
  { id: "hoodie", name: "Hoodies", image: "🧥", selected: false },
  { id: "cap", name: "Caps", image: "🧢", selected: false },
  { id: "mug", name: "Mugs", image: "☕", selected: false },
  { id: "bag", name: "Tote Bags", image: "👜", selected: false },
  { id: "jacket", name: "Jackets", image: "🧥", selected: false },
];

const themes = [
  { id: "modern", name: "Modern", description: "Clean lines, bold typography" },
  { id: "classic", name: "Classic", description: "Traditional, timeless feel" },
  { id: "bold", name: "Bold", description: "Vibrant, eye-catching design" },
];

const aiMessages: Record<number, string> = {
  0: "Let's start! What type of organization is this store for?",
  1: "Great choice! Now let's pick your brand colors. I'll suggest options based on your logo.",
  2: "Most schools choose t-shirts, hoodies, and caps. What products do you want to offer?",
  3: "Almost there! Pick a theme that matches your brand personality.",
  4: "🎉 Your store is ready! Click 'Launch Store' to go live instantly.",
};

export const StoreBuilderJourney = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<number | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance demo
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const timers: NodeJS.Timeout[] = [];
    
    // Step 0: Select organization
    timers.push(setTimeout(() => setSelectedOrg("school"), 1500));
    timers.push(setTimeout(() => setCurrentStep(1), 2500));
    
    // Step 1: Select color
    timers.push(setTimeout(() => setSelectedColor(0), 3500));
    timers.push(setTimeout(() => setCurrentStep(2), 4500));
    
    // Step 2: Select products
    timers.push(setTimeout(() => setSelectedProducts(["tshirt", "hoodie", "cap"]), 5500));
    timers.push(setTimeout(() => setCurrentStep(3), 6500));
    
    // Step 3: Select theme
    timers.push(setTimeout(() => setSelectedTheme("modern"), 7500));
    timers.push(setTimeout(() => setCurrentStep(4), 8500));
    
    // Reset and loop
    timers.push(setTimeout(() => {
      setCurrentStep(0);
      setSelectedOrg(null);
      setSelectedColor(null);
      setSelectedProducts([]);
      setSelectedTheme(null);
    }, 12000));

    return () => timers.forEach(clearTimeout);
  }, [isAutoPlaying, currentStep === 0]);

  const handleStepClick = (step: number) => {
    setIsAutoPlaying(false);
    setCurrentStep(step);
  };

  const toggleProduct = (productId: string) => {
    setIsAutoPlaying(false);
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Watch the AI-Guided Journey
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Your clients build their own stores in minutes. The AI guides every step.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
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
            <div className="bg-card border border-border rounded-2xl p-6 md:p-8 min-h-[400px]">
              {/* AI Chat Bubble */}
              <div className="mb-6">
                <AnimatePresence mode="wait">
                  <ChatBubble 
                    key={currentStep} 
                    message={aiMessages[currentStep]} 
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
                  transition={{ duration: 0.3 }}
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
                            <motion.div 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="mt-2"
                            >
                              <Check className="w-5 h-5 text-primary mx-auto" />
                            </motion.div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  )}

                  {/* Step 1: Brand Colors */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-4 p-4 bg-muted rounded-xl">
                        <div className="w-16 h-16 bg-muted-foreground/20 rounded-lg flex items-center justify-center">
                          <Upload className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-card-foreground">school_logo.png</p>
                          <p className="text-sm text-muted-foreground">Logo uploaded successfully</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {brandColors.map((color, index) => (
                          <motion.button
                            key={color.name}
                            onClick={() => {
                              setIsAutoPlaying(false);
                              setSelectedColor(index);
                            }}
                            className={`p-4 rounded-xl border-2 transition-all ${
                              selectedColor === index 
                                ? "border-primary" 
                                : "border-border hover:border-primary/50"
                            }`}
                            whileHover={{ scale: 1.02 }}
                          >
                            <div className="flex gap-2 mb-2">
                              <div 
                                className="w-8 h-8 rounded-full" 
                                style={{ backgroundColor: color.primary }}
                              />
                              <div 
                                className="w-8 h-8 rounded-full" 
                                style={{ backgroundColor: color.secondary }}
                              />
                            </div>
                            <p className="text-sm font-medium text-card-foreground">{color.name}</p>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 2: Product Selection */}
                  {currentStep === 2 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {products.map((product) => (
                        <motion.button
                          key={product.id}
                          onClick={() => toggleProduct(product.id)}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            selectedProducts.includes(product.id)
                              ? "border-primary bg-primary/5" 
                              : "border-border hover:border-primary/50"
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="text-4xl mb-2">{product.image}</div>
                          <p className="font-medium text-card-foreground">{product.name}</p>
                          {selectedProducts.includes(product.id) && (
                            <motion.div 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="mt-2"
                            >
                              <Check className="w-5 h-5 text-primary mx-auto" />
                            </motion.div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  )}

                  {/* Step 3: Theme Selection */}
                  {currentStep === 3 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {themes.map((theme) => (
                        <motion.button
                          key={theme.id}
                          onClick={() => {
                            setIsAutoPlaying(false);
                            setSelectedTheme(theme.id);
                          }}
                          className={`p-6 rounded-xl border-2 transition-all text-left ${
                            selectedTheme === theme.id 
                              ? "border-primary bg-primary/5" 
                              : "border-border hover:border-primary/50"
                          }`}
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="w-full h-20 bg-muted rounded-lg mb-4 flex items-center justify-center">
                            <Layout className="w-8 h-8 text-muted-foreground" />
                          </div>
                          <p className="font-semibold text-card-foreground">{theme.name}</p>
                          <p className="text-sm text-muted-foreground">{theme.description}</p>
                          {selectedTheme === theme.id && (
                            <motion.div 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="mt-2"
                            >
                              <Check className="w-5 h-5 text-primary" />
                            </motion.div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  )}

                  {/* Step 4: Launch */}
                  {currentStep === 4 && (
                    <motion.div 
                      className="text-center py-8"
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                    >
                      <motion.div
                        className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6"
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 1.2, 1] }}
                        transition={{ duration: 0.5 }}
                      >
                        <Rocket className="w-10 h-10 text-primary-foreground" />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-card-foreground mb-2">
                        Your Store is Ready!
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Lincoln High School Spirit Store is configured and ready to launch.
                      </p>
                      <Button size="lg" className="rounded-full px-8">
                        Launch Store
                        <Rocket className="ml-2 w-4 h-4" />
                      </Button>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

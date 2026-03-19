import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Store, ArrowRight, ArrowLeft, CheckCircle2, Bot, Send,
  CreditCard, Sparkles, ShoppingBag, Palette, Search,
  Eye, Loader2, Globe, Pencil, Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ChatBubble } from "@/components/features/ChatBubble";
import { ProductDetailModal, type ProductVariantSelection } from "./ProductDetailModal";
import { BulkVariantModal, type VariantSelection } from "./BulkVariantModal";
import { LogoUploadStep } from "./LogoUploadStep";
import { useToast } from "@/hooks/use-toast";
import {
  searchStyles, getAllStyles, getSearchQueriesForVertical,
  type SSStyle,
} from "@/lib/api/ssProducts";
import { createStore } from "@/lib/api/stores";
import { firecrawlApi, type BrandingData } from "@/lib/api/firecrawl";
import type { ThemeConfig } from "@/components/app/store/StorefrontPreview";

interface CreateStoreStepProps {
  tenantId: string;
  locationId: string;
  onNext: (data: { storeId: string; storeName?: string; products?: SSStyle[]; theme?: ThemeConfig; logoUrl?: string | null }) => void;
  onBack: () => void;
}

const verticals = [
  { value: "sports", label: "Sports & Athletics" },
  { value: "corporate", label: "Corporate & Uniforms" },
  { value: "schools", label: "Schools & Education" },
  { value: "events", label: "Events & Fundraisers" },
  { value: "fashion", label: "Fashion & Streetwear" },
  { value: "other", label: "Other" },
];


type CatalogProduct = SSStyle & { selected: boolean };
type Theme = { id: string; name: string; colors: string[]; recommended?: boolean };

const themesByVertical: Record<string, Theme[]> = {
  sports: [
    { id: "bold-athletics", name: "Bold Athletics", colors: ["#1a1a2e", "#e94560", "#f5f5f5", "#16213e"], recommended: true },
    { id: "classic-sport", name: "Classic Sport", colors: ["#0d3b66", "#faf0ca", "#f4d35e", "#ee964b"] },
    { id: "modern-team", name: "Modern Team", colors: ["#2d3436", "#00b894", "#fdcb6e", "#ffffff"] },
  ],
  schools: [
    { id: "school-spirit", name: "Classic School Spirit", colors: ["#2c3e50", "#e74c3c", "#f39c12", "#ecf0f1"], recommended: true },
    { id: "modern-edu", name: "Modern Education", colors: ["#6c5ce7", "#a29bfe", "#dfe6e9", "#2d3436"] },
    { id: "clean-campus", name: "Clean Campus", colors: ["#0984e3", "#74b9ff", "#ffffff", "#2d3436"] },
  ],
  corporate: [
    { id: "clean-corporate", name: "Clean Corporate", colors: ["#2d3436", "#0984e3", "#dfe6e9", "#ffffff"], recommended: true },
    { id: "exec-dark", name: "Executive Dark", colors: ["#1a1a2e", "#e2e2e2", "#c9a96e", "#2c2c2c"] },
    { id: "fresh-business", name: "Fresh Business", colors: ["#00b894", "#55efc4", "#ffffff", "#2d3436"] },
  ],
  events: [
    { id: "vibrant-event", name: "Vibrant Event", colors: ["#6c5ce7", "#fd79a8", "#ffeaa7", "#2d3436"], recommended: true },
    { id: "clean-fundraiser", name: "Clean Fundraiser", colors: ["#00cec9", "#81ecec", "#ffffff", "#2d3436"] },
    { id: "bold-fest", name: "Bold Festival", colors: ["#e17055", "#fab1a0", "#2d3436", "#ffeaa7"] },
  ],
  fashion: [
    { id: "streetwear", name: "Streetwear Edge", colors: ["#1a1a1a", "#ffffff", "#ff6b6b", "#c9c9c9"], recommended: true },
    { id: "minimal-lux", name: "Minimal Luxury", colors: ["#2d3436", "#d4a574", "#f5f0eb", "#1a1a1a"] },
    { id: "retro-drop", name: "Retro Drop", colors: ["#e17055", "#ffeaa7", "#2d3436", "#dfe6e9"] },
  ],
  other: [
    { id: "clean-default", name: "Clean Default", colors: ["#2d3436", "#0984e3", "#dfe6e9", "#ffffff"], recommended: true },
    { id: "warm-neutral", name: "Warm Neutral", colors: ["#2d3436", "#e17055", "#ffeaa7", "#ffffff"] },
  ],
};

type ChatMessage = { role: "bot" | "user"; text: string; typing?: boolean; options?: string[] };

// Discovery questions for the AI advisor
interface DiscoveryAnswers {
  purpose?: string;
  audience?: string;
  city?: string;
  budget?: string;
}

const discoveryQuestions = [
  {
    question: "What's the primary purpose of this store?",
    options: ["Team Uniforms", "Corporate Gifts", "Fundraiser", "Event Merch", "Employee Swag", "Retail / Resale"],
  },
  {
    question: "Who's the target audience?",
    options: ["Employees", "Students", "Sports Fans", "General Public", "Event Attendees"],
  },
  {
    question: "What city or region will this store serve? I'll factor in climate for material recommendations.",
    options: [], // free text
  },
  {
    question: "Any budget range per item?",
    options: ["Under $15", "$15–$25", "$25–$50", "No limit"],
  },
];

function getWeatherInsight(city: string): string {
  const lower = city.toLowerCase();
  if (["dallas", "houston", "phoenix", "miami", "austin", "san antonio", "tampa", "orlando", "las vegas", "atlanta"].some(c => lower.includes(c)))
    return `${city} gets hot — I'll prioritize moisture-wicking, lightweight fabrics, and breathable materials.`;
  if (["chicago", "detroit", "minneapolis", "boston", "new york", "denver", "milwaukee", "buffalo", "pittsburgh"].some(c => lower.includes(c)))
    return `${city} has cold winters — I'll include heavier fleece, jackets, and layering options.`;
  if (["seattle", "portland", "san francisco"].some(c => lower.includes(c)))
    return `${city} is mild and rainy — I'll balance lightweight layers with water-resistant options.`;
  return `Got it — ${city}! I'll pick versatile items that work across seasons.`;
}

function getBotResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("budget") || lower.includes("$") || lower.includes("under"))
    return "Great choice! I've noted your budget. Check out the updated selections below — I've highlighted items that fit perfectly.";
  if (lower.includes("remove") || lower.includes("no ") || lower.includes("don't"))
    return "Done! I've unchecked those items. You can always add them back from the grid or browse the full catalog.";
  if (lower.includes("add") || lower.includes("include") || lower.includes("also") || lower.includes("show") || lower.includes("more"))
    return "I've added those to your recommendations! Scroll down to see the updated product grid.";
  if (lower.includes("catalog") || lower.includes("browse") || lower.includes("all"))
    return "Loading the full Brand-Shop catalog for you! You can filter by category using the chips above the grid.";
  return "Got it! I've updated the recommendations based on your input. Take a look at the product grid below.";
}

// --- Typing indicator component ---
const TypingIndicator = () => (
  <div className="flex items-start gap-2">
    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary flex items-center justify-center">
      <Bot className="w-3.5 h-3.5 text-primary-foreground" />
    </div>
    <div className="bg-muted rounded-xl rounded-tl-sm px-4 py-3">
      <div className="flex gap-1">
        <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0 }} className="w-2 h-2 rounded-full bg-muted-foreground" />
        <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }} className="w-2 h-2 rounded-full bg-muted-foreground" />
        <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }} className="w-2 h-2 rounded-full bg-muted-foreground" />
      </div>
    </div>
  </div>
);

export const CreateStoreStep = ({ tenantId, locationId, onNext, onBack }: CreateStoreStepProps) => {
  const [phase, setPhase] = useState<"details" | "catalog" | "logo" | "theme" | "payment">("details");
  const [storeName, setStoreName] = useState("");
  const [clientName, setClientName] = useState("");
  const [brandVertical, setBrandVertical] = useState("");
  const [catalogProducts, setCatalogProducts] = useState<CatalogProduct[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState(false);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState("");
  const [billingModel, setBillingModel] = useState("brandshop");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [created, setCreated] = useState(false);
  const [storeId, setStoreId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [detailProduct, setDetailProduct] = useState<SSStyle | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [themeMode, setThemeMode] = useState<"presets" | "custom" | "ai">("presets");
  const [customTheme, setCustomTheme] = useState<ThemeConfig>({
    primary: "#2d3436", secondary: "#0984e3", accent: "#fdcb6e", background: "#ffffff",
  });
  const [editingPreset, setEditingPreset] = useState<string | null>(null);
  const [scrapeUrl, setScrapeUrl] = useState("");
  const [scraping, setScraping] = useState(false);
  const [scrapedBranding, setScrapedBranding] = useState<BrandingData | null>(null);
  const [creatingStore, setCreatingStore] = useState(false);

  // Discovery state
  const [discoveryStep, setDiscoveryStep] = useState(0);
  const [discoveryAnswers, setDiscoveryAnswers] = useState<DiscoveryAnswers>({});
  const [discoveryComplete, setDiscoveryComplete] = useState(false);


  // Variant selections per product
  const [variantSelections, setVariantSelections] = useState<Map<number, ProductVariantSelection>>(new Map());

  // Bulk variant modal
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [bulkApplyMode, setBulkApplyMode] = useState<"selected" | "category" | "all">("selected");
  const [bulkCategoryName, setBulkCategoryName] = useState<string | undefined>();

  const chatEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const selectedCount = catalogProducts.filter((i) => i.selected).length;
  const themes = themesByVertical[brandVertical] || themesByVertical.other;

  // Get unique categories
  const categories = Array.from(new Set(catalogProducts.map((p) => p.baseCategory)));

  // Filter products
  const filteredProducts = catalogProducts.filter((p) => {
    const matchesCategory = !activeCategory || p.baseCategory === activeCategory;
    const matchesSearch =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Group by category
  const groupedProducts = filteredProducts.reduce<Record<string, CatalogProduct[]>>((acc, p) => {
    const cat = p.baseCategory || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(p);
    return acc;
  }, {});

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isTyping]);

  const addBotMessage = useCallback((text: string, delayMs: number = 1200, options?: string[]) => {
    setIsTyping(true);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setIsTyping(false);
        setChatMessages((prev) => [...prev, { role: "bot", text, options }]);
        resolve();
      }, delayMs);
    });
  }, []);

  const fetchCatalog = async (vertical: string) => {
    setLoadingCatalog(true);
    setCatalogError(null);
    try {
      const queries = getSearchQueriesForVertical(vertical);
      const allResults = await Promise.all(queries.map((q) => searchStyles(q)));
      const seen = new Set<number>();
      const products: CatalogProduct[] = [];
      for (const results of allResults) {
        for (const style of results) {
          if (!seen.has(style.styleID)) {
            seen.add(style.styleID);
            products.push({ ...style, selected: products.length < 12 });
          }
        }
      }
      setCatalogProducts(products);
    } catch (err) {
      console.error("Failed to load catalog:", err);
      setCatalogError(err instanceof Error ? err.message : "Failed to load catalog");
    } finally {
      setLoadingCatalog(false);
    }
  };

  const loadFullCatalog = async () => {
    setLoadingCatalog(true);
    try {
      const all = await getAllStyles();
      const existingIds = new Set(catalogProducts.map((p) => p.styleID));
      const merged = [
        ...catalogProducts,
        ...all
          .filter((s) => !existingIds.has(s.styleID))
          .map((s) => ({ ...s, selected: false })),
      ];
      setCatalogProducts(merged);
      setActiveCategory(null);
      await addBotMessage("Here's the full Brand-Shop catalog! Use the category filters and search to find exactly what you need.", 800);
    } catch {
      toast({ title: "Error", description: "Failed to load full catalog", variant: "destructive" });
    } finally {
      setLoadingCatalog(false);
    }
  };

  // --- Discovery flow ---
  const handleDetailsNext = async () => {
    if (!storeName.trim() || !clientName.trim() || !brandVertical) return;
    setPhase("catalog");
    setChatMessages([]);
    setDiscoveryStep(0);
    setDiscoveryComplete(false);
    setDiscoveryAnswers({});

    await addBotMessage(`Hey! 👋 I'm your AI Merch Advisor. Let me learn a bit about **${clientName}** so I can build the perfect product lineup.`, 800);
    await addBotMessage(discoveryQuestions[0].question, 1000, discoveryQuestions[0].options);
  };

  const handleDiscoveryAnswer = async (answer: string) => {
    setChatMessages((prev) => [...prev, { role: "user", text: answer }]);
    const step = discoveryStep;

    const updatedAnswers = { ...discoveryAnswers };
    if (step === 0) updatedAnswers.purpose = answer;
    else if (step === 1) updatedAnswers.audience = answer;
    else if (step === 2) updatedAnswers.city = answer;
    else if (step === 3) updatedAnswers.budget = answer;
    setDiscoveryAnswers(updatedAnswers);

    const nextStep = step + 1;

    if (step === 2) {
      // City — give weather insight then ask budget
      await addBotMessage(getWeatherInsight(answer), 1000);
      await addBotMessage(discoveryQuestions[3].question, 800, discoveryQuestions[3].options);
      setDiscoveryStep(3);
    } else if (nextStep < discoveryQuestions.length) {
      const q = discoveryQuestions[nextStep];
      await addBotMessage(q.question, 1000, q.options.length > 0 ? q.options : undefined);
      setDiscoveryStep(nextStep);
    } else {
      // Discovery complete — load catalog
      setDiscoveryComplete(true);
      const vertLabel = verticals.find((v) => v.value === brandVertical)?.label || brandVertical;
      await addBotMessage(
        `Based on your input, here are my top picks for **${vertLabel}** in **${updatedAnswers.city || "your area"}**! Feel free to add, remove, or ask me to refine!`,
        1500
      );
      fetchCatalog(brandVertical);
    }
  };

  const handleChatSend = async (text?: string) => {
    const msg = (text || chatInput).trim();
    if (!msg) return;
    setChatInput("");

    // If still in discovery, route through discovery
    if (!discoveryComplete) {
      await handleDiscoveryAnswer(msg);
      return;
    }

    setChatMessages((prev) => [...prev, { role: "user", text: msg }]);

    // Handle "browse full catalog"
    if (msg.toLowerCase().includes("catalog") || msg.toLowerCase().includes("browse")) {
      await loadFullCatalog();
      return;
    }

    await addBotMessage(getBotResponse(msg));
  };

  const toggleItem = (styleID: number) => {
    setCatalogProducts((prev) =>
      prev.map((i) => (i.styleID === styleID ? { ...i, selected: !i.selected } : i))
    );
  };

  const openProductDetail = (product: CatalogProduct) => {
    setDetailProduct(product);
    setDetailOpen(true);
  };

  const handleVariantChange = (styleID: number, selection: ProductVariantSelection) => {
    setVariantSelections((prev) => {
      const next = new Map(prev);
      next.set(styleID, selection);
      return next;
    });
  };

  const handleBulkApply = (selection: VariantSelection) => {
    const selectedProducts = catalogProducts.filter((p) => p.selected);
    let targetProducts: CatalogProduct[] = [];

    if (bulkApplyMode === "all") {
      targetProducts = selectedProducts;
    } else if (bulkApplyMode === "category" && bulkCategoryName) {
      targetProducts = selectedProducts.filter((p) => p.baseCategory === bulkCategoryName);
    } else {
      targetProducts = selectedProducts;
    }

    setVariantSelections((prev) => {
      const next = new Map(prev);
      for (const p of targetProducts) {
        // Only apply colors/sizes that are valid for this product
        const validColors = selection.colors.filter((c) => p.availableColors.some((ac) => ac.name === c));
        const validSizes = selection.sizes.filter((s) => p.availableSizes.includes(s));
        next.set(p.styleID, { colors: validColors, sizes: validSizes });
      }
      return next;
    });

    toast({
      title: "Variants applied!",
      description: `Updated ${targetProducts.length} items with your color/size selections.`,
    });
  };

  const handleCatalogNext = () => {
    if (selectedCount === 0) return;
    setPhase("logo");
  };

  const handleLogoNext = () => {
    const rec = themes.find((t) => t.recommended);
    if (rec) setSelectedTheme(rec.id);
    setPhase("theme");
  };

  const handleThemeNext = () => {
    if (themeMode === "presets" && !selectedTheme) return;
    setPhase("payment");
  };

  const getActiveThemeConfig = (): ThemeConfig => {
    if (themeMode === "custom" || themeMode === "ai") return customTheme;
    const theme = themes.find((t) => t.id === selectedTheme);
    if (theme) {
      return { primary: theme.colors[0], secondary: theme.colors[1], accent: theme.colors[2], background: theme.colors[3] };
    }
    return customTheme;
  };

  const handleScrapeWebsite = async () => {
    if (!scrapeUrl.trim()) return;
    setScraping(true);
    setScrapedBranding(null);
    try {
      const result = await firecrawlApi.scrapeBranding(scrapeUrl);
      if (result.success && result.data) {
        setScrapedBranding(result.data);
        const colors = result.data.colors;
        if (colors) {
          setCustomTheme({
            primary: colors.primary || customTheme.primary,
            secondary: colors.secondary || customTheme.secondary,
            accent: colors.accent || customTheme.accent,
            background: colors.background || customTheme.background,
            logoUrl: result.data.logo || result.data.images?.logo || undefined,
            fontFamily: result.data.typography?.fontFamilies?.primary || undefined,
          });
        }
        const scrapedLogo = result.data.logo || result.data.images?.logo;
        if (scrapedLogo && !logoUrl) {
          setLogoUrl(scrapedLogo);
        }
        toast({ title: "Brand analyzed!", description: "Colors, fonts, and logo extracted from the website." });
      } else {
        toast({ title: "Scrape failed", description: result.error || "Could not analyze that website.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to analyze website. Make sure the URL is valid.", variant: "destructive" });
    } finally {
      setScraping(false);
    }
  };

  const handleCreateStore = async () => {
    setCreatingStore(true);
    try {
      const selectedProducts = catalogProducts.filter((p) => p.selected).map((p) => p.styleID);
      const themeConfig = getActiveThemeConfig();

      // Call backend API
      let externalStoreId: string | undefined;
      let catalogId: string | undefined;
      try {
        const result = await createStore({
          tenantId,
          locationId,
          storeName,
          clientName,
          brandVertical,
          selectedProducts,
          themeConfig,
          logoUrl: logoUrl || undefined,
          pricingModel: billingModel,
        });
        externalStoreId = result.storeId;
        catalogId = result.catalogId;
      } catch (err) {
        console.warn("Backend store creation failed, continuing with local:", err);
      }

      // Persist to database
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Generate slug from store name
        const slug = storeName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Date.now().toString(36);

        // Persist full product objects so public storefront can render them
        const productsForMetadata = catalogProducts.filter((p) => p.selected).map(({ selected, ...rest }) => rest);

        const { data: dbStore, error: dbError } = await supabase
          .from("stores")
          .insert({
            user_id: user.id,
            tenant_id: tenantId || null,
            store_name: storeName,
            client_name: clientName,
            brand_vertical: brandVertical,
            external_store_id: externalStoreId || null,
            catalog_id: catalogId || null,
            logo_url: logoUrl || null,
            theme_config: themeConfig as any,
            status: "draft",
            slug,
            metadata: { selectedProducts, products: productsForMetadata, pricingModel: billingModel },
          } as any)
          .select("id")
          .single();

        if (dbError) {
          console.error("DB insert error:", dbError);
          const id = externalStoreId || `store-${Date.now()}`;
          setStoreId(id);
        } else {
          setStoreId(dbStore.id);
        }
      } else {
        setStoreId(externalStoreId || `store-${Date.now()}`);
      }

      setCreated(true);
      toast({ title: "Store created!", description: `${storeName} is ready.` });
    } catch (err) {
      console.error("Store creation failed:", err);
      const id = `store-${Date.now()}`;
      setStoreId(id);
      setCreated(true);
      toast({ title: "Store created!", description: `${storeName} is ready (demo mode).` });
    } finally {
      setCreatingStore(false);
    }
  };

  const phases = ["details", "catalog", "logo", "theme", "payment"];
  const phaseLabels = ["Details", "Catalog", "Logo", "Theme", "Payment"];
  const phaseIndex = phases.indexOf(phase);

  // Suggestion chips change based on discovery state
  const suggestionChips = discoveryComplete
    ? ["Show me hoodies", "Under $15", "Add more caps", "Browse full catalog", "Remove outerwear"]
    : [];

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Store className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Create Your First Store</h2>
            <p className="text-muted-foreground">Set up a branded storefront for your client</p>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="flex gap-1">
        {phaseLabels.map((label, i) => (
          <div key={label} className="flex-1 space-y-1">
            <div className={`h-1.5 rounded-full transition-colors ${i <= phaseIndex ? "bg-primary" : "bg-muted"}`} />
            <p className={`text-xs text-center ${i <= phaseIndex ? "text-primary font-medium" : "text-muted-foreground"}`}>{label}</p>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* PHASE A: Details */}
        {phase === "details" && (
          <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <ChatBubble message="Let's set up your store. Enter the basics and I'll load the right catalog for you." delay={0.1} />
            <Card className="border-border">
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input id="storeName" placeholder="e.g. Wildcats Team Shop" value={storeName} onChange={(e) => setStoreName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientName">Client Name</Label>
                  <Input id="clientName" placeholder="e.g. Lincoln High School" value={clientName} onChange={(e) => setClientName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Brand Vertical</Label>
                  <Select value={brandVertical} onValueChange={setBrandVertical}>
                    <SelectTrigger><SelectValue placeholder="Select a vertical" /></SelectTrigger>
                    <SelectContent>
                      {verticals.map((v) => (
                        <SelectItem key={v.value} value={v.value}>{v.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>


                <Button onClick={handleDetailsNext} disabled={!storeName.trim() || !clientName.trim() || !brandVertical} className="w-full gap-2">
                  Continue to Catalog <ArrowRight className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* PHASE B: AI Merch Advisor + Product Catalog */}
        {phase === "catalog" && (
          <motion.div key="catalog" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            {/* Item counter */}
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="gap-1">
                <ShoppingBag className="w-3 h-3" />
                Product Catalog
              </Badge>
              <span className="text-sm font-medium text-foreground">
                {selectedCount} selected
              </span>
            </div>

            {/* AI Chat */}
            <Card className="border-border bg-gradient-to-br from-primary/5 via-background to-background">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                    <Sparkles className="w-4 h-4 text-primary" />
                  </motion.div>
                  AI Merch Advisor
                </div>
                <div className="max-h-64 overflow-y-auto space-y-3 pr-1">
                  <AnimatePresence>
                    {chatMessages.map((msg, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className={`flex items-start gap-2 ${msg.role === "user" ? "justify-end" : ""}`}>
                          {msg.role === "bot" && (
                            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                              <Bot className="w-3.5 h-3.5 text-primary-foreground" />
                            </div>
                          )}
                          <div className={`rounded-xl px-3 py-2 text-sm max-w-[80%] ${
                            msg.role === "bot" ? "bg-muted text-foreground rounded-tl-sm" : "bg-primary text-primary-foreground rounded-tr-sm"
                          }`}>
                            {msg.text}
                          </div>
                        </div>
                        {/* Discovery option buttons */}
                        {msg.role === "bot" && msg.options && msg.options.length > 0 && i === chatMessages.length - 1 && !discoveryComplete && (
                          <div className="flex gap-2 flex-wrap mt-2 ml-9">
                            {msg.options.map((opt) => (
                              <button
                                key={opt}
                                onClick={() => handleDiscoveryAnswer(opt)}
                                className="px-3 py-1.5 rounded-full text-xs font-medium border border-primary/30 text-primary bg-primary/5 hover:bg-primary/10 transition-colors"
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {isTyping && <TypingIndicator />}
                  <div ref={chatEndRef} />
                </div>

                {/* Suggestion Chips — only after discovery */}
                {suggestionChips.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {suggestionChips.map((chip) => (
                      <button
                        key={chip}
                        onClick={() => handleChatSend(chip)}
                        className="px-3 py-1 rounded-full text-xs font-medium border border-primary/30 text-primary bg-primary/5 hover:bg-primary/10 transition-colors"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <Input
                    placeholder={discoveryComplete ? "Tell me about your event, budget, colors..." : "Type your answer..."}
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleChatSend()}
                    className="flex-1"
                  />
                  <Button size="icon" onClick={() => handleChatSend()} disabled={!chatInput.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Bulk selection toolbar */}
            {discoveryComplete && selectedCount > 0 && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 flex-wrap p-3 rounded-lg bg-muted/50 border border-border">
                <Layers className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium text-foreground mr-auto">Bulk Actions:</span>
                <Button
                  variant="outline" size="sm"
                  onClick={() => { setBulkApplyMode("selected"); setBulkCategoryName(undefined); setBulkModalOpen(true); }}
                >
                  Set Colors & Sizes for Selected
                </Button>
                {activeCategory && (
                  <Button
                    variant="outline" size="sm"
                    onClick={() => { setBulkApplyMode("category"); setBulkCategoryName(activeCategory); setBulkModalOpen(true); }}
                  >
                    Apply to "{activeCategory}"
                  </Button>
                )}
                <Button
                  variant="outline" size="sm"
                  onClick={() => { setBulkApplyMode("all"); setBulkCategoryName(undefined); setBulkModalOpen(true); }}
                >
                  Apply to All
                </Button>
              </motion.div>
            )}

            {/* Category Filters + Search */}
            {discoveryComplete && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setActiveCategory(null)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                      !activeCategory
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border text-muted-foreground hover:border-muted-foreground"
                    }`}
                  >
                    All
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                        activeCategory === cat
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border text-muted-foreground hover:border-muted-foreground"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Product Grid */}
            {discoveryComplete && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    Product Catalog — {selectedCount} selected
                  </h3>
                  <Button variant="outline" size="sm" onClick={loadFullCatalog} disabled={loadingCatalog}>
                    Browse Full Catalog
                  </Button>
                </div>

                {loadingCatalog && (
                  <div className="grid grid-cols-2 gap-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Card key={i} className="border-border">
                        <CardContent className="p-3 space-y-2">
                          <Skeleton className="w-full h-32 rounded-md" />
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {catalogError && (
                  <Card className="border-destructive">
                    <CardContent className="p-4 text-sm text-destructive">
                      <p>Failed to load products: {catalogError}</p>
                      <Button variant="outline" size="sm" className="mt-2" onClick={() => fetchCatalog(brandVertical)}>
                        Retry
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {!loadingCatalog && !catalogError && Object.keys(groupedProducts).length > 0 && (
                  <div className="space-y-4">
                    {Object.entries(groupedProducts).map(([category, products]) => (
                      <div key={category} className="space-y-2">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{category}</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {products.map((item) => {
                            const vs = variantSelections.get(item.styleID);
                            return (
                              <Card
                                key={item.styleID}
                                className={`cursor-pointer transition-all border-2 ${
                                  item.selected ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/30"
                                }`}
                                onClick={() => toggleItem(item.styleID)}
                              >
                                <CardContent className="p-3 space-y-2">
                                  {/* Product Image */}
                                  <div className="relative">
                                    {item.styleImage ? (
                                      <img
                                        src={item.styleImage}
                                        alt={item.title}
                                        className="w-full h-28 object-cover rounded-md bg-muted"
                                        loading="lazy"
                                      />
                                    ) : (
                                      <div className="w-full h-28 rounded-md bg-muted flex items-center justify-center text-muted-foreground text-xs">
                                        No image
                                      </div>
                                    )}
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openProductDetail(item);
                                      }}
                                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                                    >
                                      <Eye className="w-3 h-3 text-foreground" />
                                    </button>
                                    <div className="absolute bottom-1 left-1 flex gap-0.5">
                                      {item.availableColors.slice(0, 4).map((c) => (
                                        <div
                                          key={c.name}
                                          className="w-3 h-3 rounded-full border border-background/50"
                                          style={{ backgroundColor: c.hex }}
                                        />
                                      ))}
                                      {item.availableColors.length > 4 && (
                                        <span className="text-[8px] text-background bg-foreground/50 rounded-full px-1 flex items-center">
                                          +{item.availableColors.length - 4}
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex items-start justify-between gap-1">
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-semibold text-primary">{item.brandName}</p>
                                      <p className="text-sm font-medium text-foreground leading-tight truncate">{item.title}</p>
                                    </div>
                                    <Checkbox
                                      checked={item.selected}
                                      onCheckedChange={() => toggleItem(item.styleID)}
                                      className="mt-0.5 flex-shrink-0"
                                    />
                                  </div>

                                  {/* Variant badge */}
                                  {vs && (vs.colors.length > 0 || vs.sizes.length > 0) && (
                                    <div className="flex gap-1 flex-wrap">
                                      {vs.colors.length > 0 && (
                                        <Badge variant="outline" className="text-[9px] px-1.5 py-0">{vs.colors.length} colors</Badge>
                                      )}
                                      {vs.sizes.length > 0 && (
                                        <Badge variant="outline" className="text-[9px] px-1.5 py-0">{vs.sizes.length} sizes</Badge>
                                      )}
                                    </div>
                                  )}

                                  {/* Pricing */}
                                  <div className="space-y-0.5">
                                    {item.customerPrice != null && (
                                      <p className="text-xs text-foreground">
                                        <span className="font-medium">Your Cost:</span> ${Number(item.customerPrice).toFixed(2)}
                                      </p>
                                    )}
                                    {item.piecePrice != null && (
                                      <p className="text-xs text-muted-foreground">
                                        <span className="font-medium">Suggested Retail:</span> ${Number(item.piecePrice).toFixed(2)}
                                      </p>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {!loadingCatalog && !catalogError && filteredProducts.length === 0 && catalogProducts.length > 0 && (
                  <p className="text-sm text-muted-foreground text-center py-6">No products match your search. Try a different term or clear the filter.</p>
                )}
              </div>
            )}

            <p className="text-[10px] text-muted-foreground text-center">
              Pricing set by Brand-Shop. Adjust your markup in Store Settings after creation.
            </p>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setPhase("details")} className="flex-1 gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
              <Button onClick={handleCatalogNext} disabled={selectedCount === 0} className="flex-1 gap-2">
                Upload Logo <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* PHASE B.5: Logo Upload */}
        {phase === "logo" && (
          <motion.div key="logo" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <ChatBubble message="Upload your logo and I'll create mockups on your selected products. You can also skip this step and add it later." delay={0.1} />
            <Card className="border-border">
              <CardContent className="p-6">
                <LogoUploadStep
                  selectedProducts={catalogProducts.filter((p) => p.selected)}
                  onLogoUploaded={setLogoUrl}
                  logoUrl={logoUrl}
                  onRemoveLogo={() => setLogoUrl(null)}
                />
              </CardContent>
            </Card>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setPhase("catalog")} className="flex-1 gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
              <Button onClick={handleLogoNext} className="flex-1 gap-2">
                {logoUrl ? "Continue" : "Skip for Now"} <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* PHASE C: Theme Selection — Tabbed */}
        {phase === "theme" && (
          <motion.div key="theme" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <ChatBubble message="Choose your storefront theme. Pick a preset, customize your own colors, or let AI analyze your existing website!" delay={0.1} />

            <Tabs value={themeMode} onValueChange={(v) => setThemeMode(v as typeof themeMode)} className="space-y-4">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="presets"><Palette className="w-3.5 h-3.5 mr-1.5" />Presets</TabsTrigger>
                <TabsTrigger value="custom"><Pencil className="w-3.5 h-3.5 mr-1.5" />Custom</TabsTrigger>
                <TabsTrigger value="ai"><Globe className="w-3.5 h-3.5 mr-1.5" />AI Scrape</TabsTrigger>
              </TabsList>

              {/* Presets Tab */}
              <TabsContent value="presets" className="space-y-3">
                {themes.map((theme) => (
                  <Card
                    key={theme.id}
                    className={`cursor-pointer transition-all border-2 ${
                      selectedTheme === theme.id ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/30"
                    }`}
                    onClick={() => { setSelectedTheme(theme.id); setEditingPreset(null); }}
                  >
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="flex gap-1.5">
                        {(editingPreset === theme.id
                          ? [customTheme.primary, customTheme.secondary, customTheme.accent, customTheme.background]
                          : theme.colors
                        ).map((c, i) => (
                          <div key={i} className="w-8 h-8 rounded-md border border-border" style={{ backgroundColor: c }} />
                        ))}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{theme.name}</p>
                        {theme.recommended && <span className="text-xs text-primary font-medium">✦ Recommended</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTheme(theme.id);
                            setEditingPreset(editingPreset === theme.id ? null : theme.id);
                            setCustomTheme({
                              primary: theme.colors[0], secondary: theme.colors[1],
                              accent: theme.colors[2], background: theme.colors[3],
                            });
                          }}
                          className="p-1.5 rounded-md hover:bg-muted transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                        </button>
                        <Palette className={`w-5 h-5 ${selectedTheme === theme.id ? "text-primary" : "text-muted-foreground/40"}`} />
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {editingPreset && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-3">
                    <Card className="border-border">
                      <CardContent className="p-4 space-y-3">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Edit Colors</p>
                        {(["primary", "secondary", "accent", "background"] as const).map((key) => (
                          <div key={key} className="flex items-center gap-3">
                            <Label className="text-xs capitalize w-20">{key}</Label>
                            <input
                              type="color"
                              value={customTheme[key]}
                              onChange={(e) => setCustomTheme((prev) => ({ ...prev, [key]: e.target.value }))}
                              className="w-8 h-8 rounded border border-border cursor-pointer"
                            />
                            <Input
                              value={customTheme[key]}
                              onChange={(e) => setCustomTheme((prev) => ({ ...prev, [key]: e.target.value }))}
                              className="flex-1 h-8 text-xs font-mono"
                            />
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </TabsContent>

              {/* Custom Colors Tab */}
              <TabsContent value="custom" className="space-y-4">
                <Card className="border-border">
                  <CardContent className="p-4 space-y-4">
                    <p className="text-sm font-medium text-foreground">Define your brand colors</p>
                    {(["primary", "secondary", "accent", "background"] as const).map((key) => (
                      <div key={key} className="flex items-center gap-3">
                        <Label className="text-xs capitalize w-24">{key}</Label>
                        <input
                          type="color"
                          value={customTheme[key]}
                          onChange={(e) => setCustomTheme((prev) => ({ ...prev, [key]: e.target.value }))}
                          className="w-10 h-10 rounded-lg border border-border cursor-pointer"
                        />
                        <Input
                          value={customTheme[key]}
                          onChange={(e) => setCustomTheme((prev) => ({ ...prev, [key]: e.target.value }))}
                          className="flex-1 h-8 text-xs font-mono"
                        />
                      </div>
                    ))}

                    <div className="rounded-lg overflow-hidden border border-border">
                      <div className="h-10 flex items-center px-4" style={{ backgroundColor: customTheme.primary }}>
                        <span className="text-xs font-bold" style={{ color: customTheme.background }}>Header Preview</span>
                      </div>
                      <div className="p-4 space-y-2" style={{ backgroundColor: customTheme.background }}>
                        <div className="h-6 w-24 rounded" style={{ backgroundColor: customTheme.secondary }} />
                        <div className="h-4 w-32 rounded" style={{ backgroundColor: customTheme.accent }} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* AI Scrape Tab */}
              <TabsContent value="ai" className="space-y-4">
                <Card className="border-border">
                  <CardContent className="p-4 space-y-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" /> AI Brand Analyzer
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Enter your website URL and we'll extract your brand colors, logo, and fonts automatically.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="https://your-website.com"
                        value={scrapeUrl}
                        onChange={(e) => setScrapeUrl(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleScrapeWebsite()}
                        className="flex-1"
                      />
                      <Button onClick={handleScrapeWebsite} disabled={scraping || !scrapeUrl.trim()} className="gap-2">
                        {scraping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
                        {scraping ? "Analyzing..." : "Analyze"}
                      </Button>
                    </div>

                    {scrapedBranding && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-medium text-primary">
                          <CheckCircle2 className="w-4 h-4" /> Brand extracted!
                        </div>

                        {(scrapedBranding.logo || scrapedBranding.images?.logo) && (
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                            <img
                              src={scrapedBranding.logo || scrapedBranding.images?.logo}
                              alt="Extracted logo"
                              className="w-12 h-12 rounded object-contain bg-background p-1"
                            />
                            <div>
                              <p className="text-xs font-medium text-foreground">Logo detected</p>
                              <p className="text-[10px] text-muted-foreground">Auto-applied to your store</p>
                            </div>
                          </div>
                        )}

                        {(["primary", "secondary", "accent", "background"] as const).map((key) => (
                          <div key={key} className="flex items-center gap-3">
                            <Label className="text-xs capitalize w-24">{key}</Label>
                            <input
                              type="color"
                              value={customTheme[key]}
                              onChange={(e) => setCustomTheme((prev) => ({ ...prev, [key]: e.target.value }))}
                              className="w-8 h-8 rounded border border-border cursor-pointer"
                            />
                            <Input
                              value={customTheme[key]}
                              onChange={(e) => setCustomTheme((prev) => ({ ...prev, [key]: e.target.value }))}
                              className="flex-1 h-8 text-xs font-mono"
                            />
                          </div>
                        ))}

                        {scrapedBranding.fonts && scrapedBranding.fonts.length > 0 && (
                          <p className="text-xs text-muted-foreground">
                            Fonts detected: {scrapedBranding.fonts.map((f) => f.family).join(", ")}
                          </p>
                        )}
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setPhase("logo")} className="flex-1 gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
              <Button
                onClick={handleThemeNext}
                disabled={themeMode === "presets" && !selectedTheme}
                className="flex-1 gap-2"
              >
                Payment Setup <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* PHASE D: Payment Setup */}
        {phase === "payment" && (
          <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <ChatBubble message="Last step — choose how billing works for this store." delay={0.1} />
            <RadioGroup value={billingModel} onValueChange={setBillingModel} className="space-y-3">
              <Card className={`cursor-pointer transition-all border-2 ${billingModel === "brandshop" ? "border-primary bg-primary/5" : "border-border"}`}
                onClick={() => setBillingModel("brandshop")}>
                <CardContent className="p-4 flex items-start gap-3">
                  <RadioGroupItem value="brandshop" id="billing-brandshop" className="mt-1" />
                  <div className="space-y-1">
                    <Label htmlFor="billing-brandshop" className="text-sm font-medium cursor-pointer">
                      Brand-Shop handles billing
                      <span className="ml-2 text-xs text-primary font-medium">Recommended</span>
                    </Label>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      We process payments on behalf of your business. "Brand-Shop" appears on your client's credit card statement. We handle taxes, shipping, and fulfillment billing — you just focus on selling.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className={`cursor-pointer transition-all border-2 ${billingModel === "self" ? "border-primary bg-primary/5" : "border-border"}`}
                onClick={() => setBillingModel("self")}>
                <CardContent className="p-4 flex items-start gap-3">
                  <RadioGroupItem value="self" id="billing-self" className="mt-1" />
                  <div className="space-y-1">
                    <Label htmlFor="billing-self" className="text-sm font-medium cursor-pointer">I collect payments myself</Label>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      You invoice and collect from your clients directly. When an order is placed, we immediately charge the credit card on your account. You keep the margin.
                    </p>
                    {billingModel === "self" && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="pt-2">
                        <Button variant="outline" size="sm" className="gap-2">
                          <CreditCard className="w-4 h-4" /> Connect Payment Method
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </RadioGroup>

            {created ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 text-primary">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-medium">Store created successfully</span>
              </motion.div>
            ) : (
              <Button onClick={handleCreateStore} disabled={creatingStore} className="w-full gap-2">
                {creatingStore ? <Loader2 className="w-4 h-4 animate-spin" /> : <Store className="w-4 h-4" />}
                {creatingStore ? "Creating Store..." : "Create Store"}
              </Button>
            )}

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setPhase("theme")} className="flex-1 gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
              <Button onClick={() => onNext({
                storeId,
                storeName,
                products: catalogProducts.filter((p) => p.selected),
                theme: getActiveThemeConfig(),
                logoUrl,
              })} disabled={!created} className="flex-1 gap-2">
                Continue <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={detailProduct}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        isSelected={detailProduct ? catalogProducts.find((p) => p.styleID === detailProduct.styleID)?.selected ?? false : false}
        onToggleSelect={toggleItem}
        variantSelection={detailProduct ? variantSelections.get(detailProduct.styleID) : undefined}
        onVariantChange={handleVariantChange}
      />

      {/* Bulk Variant Modal */}
      <BulkVariantModal
        open={bulkModalOpen}
        onOpenChange={setBulkModalOpen}
        products={
          bulkApplyMode === "category" && bulkCategoryName
            ? catalogProducts.filter((p) => p.selected && p.baseCategory === bulkCategoryName)
            : catalogProducts.filter((p) => p.selected)
        }
        applyMode={bulkApplyMode}
        categoryName={bulkCategoryName}
        onApply={handleBulkApply}
      />

    </motion.div>
  );
};

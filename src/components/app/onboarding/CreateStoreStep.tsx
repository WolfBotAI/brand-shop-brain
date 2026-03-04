import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Store, ArrowRight, ArrowLeft, CheckCircle2, Bot, Send, CreditCard, Sparkles, ShoppingBag, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChatBubble } from "@/components/features/ChatBubble";
import { useToast } from "@/hooks/use-toast";

interface CreateStoreStepProps {
  tenantId: string;
  locationId: string;
  onNext: (data: { storeId: string }) => void;
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

type CatalogItem = {
  id: string;
  name: string;
  category: string;
  priceRange: string;
  supplier: string;
  image: string;
  selected: boolean;
};

const catalogByVertical: Record<string, CatalogItem[]> = {
  sports: [
    { id: "s1", name: "Performance Tee", category: "Tees", priceRange: "$8–$14", supplier: "Brand-Shop Catalog", image: "👕", selected: true },
    { id: "s2", name: "Mesh Athletic Short", category: "Shorts", priceRange: "$12–$18", supplier: "Brand-Shop Catalog", image: "🩳", selected: true },
    { id: "s3", name: "Team Hoodie", category: "Hoodies", priceRange: "$22–$35", supplier: "Brand-Shop Catalog", image: "🧥", selected: true },
    { id: "s4", name: "Flexfit Cap", category: "Caps", priceRange: "$10–$16", supplier: "Brand-Shop Catalog", image: "🧢", selected: true },
    { id: "s5", name: "Warm-Up Jacket", category: "Jackets", priceRange: "$28–$42", supplier: "Brand-Shop Fulfillment", image: "🧥", selected: false },
    { id: "s6", name: "Dri-Fit Polo", category: "Polos", priceRange: "$15–$24", supplier: "Brand-Shop Catalog", image: "👔", selected: true },
    { id: "s7", name: "Athletic Crew Socks", category: "Accessories", priceRange: "$6–$10", supplier: "Brand-Shop Fulfillment", image: "🧦", selected: false },
    { id: "s8", name: "Duffle Bag", category: "Accessories", priceRange: "$18–$30", supplier: "Brand-Shop Fulfillment", image: "👜", selected: false },
  ],
  schools: [
    { id: "sc1", name: "Spirit Tee", category: "Tees", priceRange: "$7–$12", supplier: "Brand-Shop Catalog", image: "👕", selected: true },
    { id: "sc2", name: "School Hoodie", category: "Hoodies", priceRange: "$20–$32", supplier: "Brand-Shop Catalog", image: "🧥", selected: true },
    { id: "sc3", name: "Varsity Jacket", category: "Jackets", priceRange: "$35–$55", supplier: "Brand-Shop Catalog", image: "🧥", selected: true },
    { id: "sc4", name: "School Cap", category: "Caps", priceRange: "$8–$14", supplier: "Brand-Shop Catalog", image: "🧢", selected: true },
    { id: "sc5", name: "Gym Short", category: "Shorts", priceRange: "$10–$16", supplier: "Brand-Shop Fulfillment", image: "🩳", selected: false },
    { id: "sc6", name: "Polo Shirt", category: "Polos", priceRange: "$14–$22", supplier: "Brand-Shop Catalog", image: "👔", selected: true },
  ],
  corporate: [
    { id: "c1", name: "Classic Polo", category: "Polos", priceRange: "$16–$28", supplier: "Brand-Shop Catalog", image: "👔", selected: true },
    { id: "c2", name: "Oxford Button-Down", category: "Dress Shirts", priceRange: "$22–$38", supplier: "Brand-Shop Catalog", image: "👔", selected: true },
    { id: "c3", name: "Soft-Shell Jacket", category: "Jackets", priceRange: "$30–$50", supplier: "Brand-Shop Catalog", image: "🧥", selected: true },
    { id: "c4", name: "Structured Cap", category: "Caps", priceRange: "$12–$18", supplier: "Brand-Shop Catalog", image: "🧢", selected: false },
    { id: "c5", name: "Quarter-Zip Pullover", category: "Pullovers", priceRange: "$25–$40", supplier: "Brand-Shop Fulfillment", image: "🧥", selected: true },
    { id: "c6", name: "Tote Bag", category: "Accessories", priceRange: "$10–$20", supplier: "Brand-Shop Fulfillment", image: "👜", selected: false },
  ],
  events: [
    { id: "e1", name: "Event Tee", category: "Tees", priceRange: "$6–$10", supplier: "Brand-Shop Catalog", image: "👕", selected: true },
    { id: "e2", name: "Lightweight Hoodie", category: "Hoodies", priceRange: "$18–$28", supplier: "Brand-Shop Catalog", image: "🧥", selected: true },
    { id: "e3", name: "Trucker Hat", category: "Caps", priceRange: "$8–$14", supplier: "Brand-Shop Catalog", image: "🧢", selected: true },
    { id: "e4", name: "Tank Top", category: "Tanks", priceRange: "$7–$12", supplier: "Brand-Shop Fulfillment", image: "👕", selected: false },
    { id: "e5", name: "Tote Bag", category: "Accessories", priceRange: "$8–$15", supplier: "Brand-Shop Fulfillment", image: "👜", selected: true },
  ],
  fashion: [
    { id: "f1", name: "Premium Heavyweight Tee", category: "Tees", priceRange: "$12–$22", supplier: "Brand-Shop Catalog", image: "👕", selected: true },
    { id: "f2", name: "Oversized Hoodie", category: "Hoodies", priceRange: "$28–$45", supplier: "Brand-Shop Catalog", image: "🧥", selected: true },
    { id: "f3", name: "Joggers", category: "Bottoms", priceRange: "$22–$38", supplier: "Brand-Shop Catalog", image: "👖", selected: true },
    { id: "f4", name: "Snapback Cap", category: "Caps", priceRange: "$14–$22", supplier: "Brand-Shop Fulfillment", image: "🧢", selected: true },
    { id: "f5", name: "Crewneck Sweatshirt", category: "Sweatshirts", priceRange: "$24–$38", supplier: "Brand-Shop Catalog", image: "👕", selected: false },
  ],
  other: [
    { id: "o1", name: "Basic Tee", category: "Tees", priceRange: "$6–$12", supplier: "Brand-Shop Catalog", image: "👕", selected: true },
    { id: "o2", name: "Pullover Hoodie", category: "Hoodies", priceRange: "$18–$30", supplier: "Brand-Shop Catalog", image: "🧥", selected: true },
    { id: "o3", name: "Baseball Cap", category: "Caps", priceRange: "$8–$14", supplier: "Brand-Shop Catalog", image: "🧢", selected: true },
    { id: "o4", name: "Polo Shirt", category: "Polos", priceRange: "$12–$20", supplier: "Brand-Shop Catalog", image: "👔", selected: false },
  ],
};

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

type ChatMessage = { role: "bot" | "user"; text: string };

const botResponses: Record<string, string> = {
  budget: "Great — I've filtered the catalog to items within your budget. Check the updated grid below!",
  remove: "Done! I've unchecked those items. You can always add them back from the grid.",
  add: "I've added those to your selection. The grid is updated!",
  default: "Got it! I've updated the recommendations based on your input. Take a look at the product grid below.",
};

function getBotResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("budget") || lower.includes("$") || lower.includes("under")) return botResponses.budget;
  if (lower.includes("remove") || lower.includes("no ") || lower.includes("don't")) return botResponses.remove;
  if (lower.includes("add") || lower.includes("include") || lower.includes("also")) return botResponses.add;
  return botResponses.default;
}

export const CreateStoreStep = ({ tenantId, locationId, onNext, onBack }: CreateStoreStepProps) => {
  const [phase, setPhase] = useState<"details" | "catalog" | "theme" | "payment">("details");
  const [storeName, setStoreName] = useState("");
  const [clientName, setClientName] = useState("");
  const [brandVertical, setBrandVertical] = useState("");
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([]);
  const [selectedTheme, setSelectedTheme] = useState("");
  const [billingModel, setBillingModel] = useState("brandshop");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [created, setCreated] = useState(false);
  const [storeId, setStoreId] = useState("");
  const { toast } = useToast();

  const selectedCount = catalogItems.filter((i) => i.selected).length;
  const themes = themesByVertical[brandVertical] || themesByVertical.other;

  const handleDetailsNext = () => {
    if (!storeName.trim() || !clientName.trim() || !brandVertical) return;
    const items = catalogByVertical[brandVertical] || catalogByVertical.other;
    setCatalogItems(items.map((i) => ({ ...i })));
    const vertLabel = verticals.find((v) => v.value === brandVertical)?.label || brandVertical;
    setChatMessages([
      {
        role: "bot",
        text: `I've loaded the Brand-Shop Catalog for **${vertLabel}**. Tell me about the event — goals, budget per item, colors, season — and I'll recommend products.`,
      },
    ]);
    setPhase("catalog");
  };

  const handleChatSend = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setChatInput("");
    setTimeout(() => {
      setChatMessages((prev) => [...prev, { role: "bot", text: getBotResponse(userMsg) }]);
    }, 800);
  };

  const toggleItem = (id: string) => {
    setCatalogItems((prev) => prev.map((i) => (i.id === id ? { ...i, selected: !i.selected } : i)));
  };

  const handleCatalogNext = () => {
    if (selectedCount === 0) return;
    const rec = themes.find((t) => t.recommended);
    if (rec) setSelectedTheme(rec.id);
    setPhase("theme");
  };

  const handleThemeNext = () => {
    if (!selectedTheme) return;
    setPhase("payment");
  };

  const handleCreateStore = () => {
    const id = `store-${Date.now()}`;
    setStoreId(id);
    setCreated(true);
    toast({ title: "Store created!", description: `${storeName} is ready to configure.` });
  };

  const phaseIndex = ["details", "catalog", "theme", "payment"].indexOf(phase);

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
        {["Details", "Catalog", "Theme", "Payment"].map((label, i) => (
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

        {/* PHASE B: AI Merch Advisor + Catalog */}
        {phase === "catalog" && (
          <motion.div key="catalog" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            {/* AI Chat */}
            <Card className="border-border">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Sparkles className="w-4 h-4 text-primary" />
                  AI Merch Advisor
                </div>
                <div className="max-h-48 overflow-y-auto space-y-3 pr-1">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex items-start gap-2 ${msg.role === "user" ? "justify-end" : ""}`}>
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
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g. Budget is $25/item, outdoor fall event, school colors are blue and gold"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleChatSend()}
                    className="flex-1"
                  />
                  <Button size="icon" onClick={handleChatSend} disabled={!chatInput.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Product Grid */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  Brand-Shop Catalog — {selectedCount} items selected
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {catalogItems.map((item) => (
                  <Card
                    key={item.id}
                    className={`cursor-pointer transition-all border-2 ${
                      item.selected ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/30"
                    }`}
                    onClick={() => toggleItem(item.id)}
                  >
                    <CardContent className="p-3 space-y-1">
                      <div className="flex items-start justify-between">
                        <span className="text-2xl">{item.image}</span>
                        <Checkbox checked={item.selected} onCheckedChange={() => toggleItem(item.id)} />
                      </div>
                      <p className="text-sm font-medium text-foreground leading-tight">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.priceRange}</p>
                      <p className="text-xs text-muted-foreground/70">{item.supplier}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setPhase("details")} className="flex-1 gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
              <Button onClick={handleCatalogNext} disabled={selectedCount === 0} className="flex-1 gap-2">
                Choose Theme <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* PHASE C: Theme Selection */}
        {phase === "theme" && (
          <motion.div key="theme" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <ChatBubble message="Pick a theme for your storefront. I've recommended one based on your vertical, but you can choose any." delay={0.1} />
            <div className="space-y-3">
              {themes.map((theme) => (
                <Card
                  key={theme.id}
                  className={`cursor-pointer transition-all border-2 ${
                    selectedTheme === theme.id ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/30"
                  }`}
                  onClick={() => setSelectedTheme(theme.id)}
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="flex gap-1.5">
                      {theme.colors.map((c, i) => (
                        <div key={i} className="w-8 h-8 rounded-md border border-border" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{theme.name}</p>
                      {theme.recommended && (
                        <span className="text-xs text-primary font-medium">✦ Recommended</span>
                      )}
                    </div>
                    <Palette className={`w-5 h-5 ${selectedTheme === theme.id ? "text-primary" : "text-muted-foreground/40"}`} />
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setPhase("catalog")} className="flex-1 gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
              <Button onClick={handleThemeNext} disabled={!selectedTheme} className="flex-1 gap-2">
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
              <Button onClick={handleCreateStore} className="w-full gap-2">
                <Store className="w-4 h-4" /> Create Store
              </Button>
            )}

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setPhase("theme")} className="flex-1 gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
              <Button onClick={() => onNext({ storeId })} disabled={!created} className="flex-1 gap-2">
                Continue <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

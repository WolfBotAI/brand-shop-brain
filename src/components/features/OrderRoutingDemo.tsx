import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Cpu, ArrowRight, CheckCircle2, Shirt, Sparkles, Building2, Pause, FileText, SplitSquareVertical } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface LineItem {
  id: string;
  product: string;
  decoration: string;
  icon: typeof Shirt;
  destination: string;
  destinationType: "supplier" | "decorator";
  color: string;
}

const invoiceItems: LineItem[] = [
  { id: "LINE-1", product: "Gildan Heavy Cotton Tees (50)", decoration: "Screen Print", icon: Shirt, destination: "Fulfillment Center A", destinationType: "supplier", color: "from-blue-500 to-blue-600" },
  { id: "LINE-2", product: "Nike Dri-FIT Polos (25)", decoration: "Embroidery", icon: Sparkles, destination: "StitchCraft Embroidery", destinationType: "decorator", color: "from-purple-500 to-purple-600" },
  { id: "LINE-3", product: "Bella+Canvas Hoodies (30)", decoration: "DTG Print", icon: Package, destination: "PrintMax DTG", destinationType: "decorator", color: "from-emerald-500 to-emerald-600" },
];

const destinations = [
  { name: "Fulfillment Center A", specialty: "Blank Apparel Fulfillment", color: "bg-blue-500/20 border-blue-500/50" },
  { name: "StitchCraft Embroidery", specialty: "Embroidery Specialist", color: "bg-purple-500/20 border-purple-500/50" },
  { name: "PrintMax DTG", specialty: "DTG & Screen Print", color: "bg-emerald-500/20 border-emerald-500/50" },
];

const OrderRoutingDemo = () => {
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [phase, setPhase] = useState<"invoice" | "splitting" | "routing" | "complete">("invoice");
  const [routedItems, setRoutedItems] = useState<string[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setProgress(prev => prev >= 100 ? 0 : prev + 1);
    }, 100);
    return () => clearInterval(interval);
  }, [isPaused, currentItemIndex]);

  useEffect(() => {
    if (isPaused) return;

    const runAnimation = () => {
      setPhase("invoice");
      setProgress(0);

      const timers = [
        setTimeout(() => setPhase("splitting"), 2500),
        setTimeout(() => setPhase("routing"), 5000),
        setTimeout(() => {
          setPhase("complete");
          setRoutedItems(prev => [...prev, invoiceItems[currentItemIndex].id]);
        }, 7500),
        setTimeout(() => {
          setCurrentItemIndex((prev) => (prev + 1) % invoiceItems.length);
          if (currentItemIndex === invoiceItems.length - 1) {
            setRoutedItems([]);
          }
        }, 10000),
      ];

      return () => timers.forEach(clearTimeout);
    };

    const cleanup = runAnimation();
    return cleanup;
  }, [currentItemIndex, isPaused]);

  const currentItem = invoiceItems[currentItemIndex];
  const ItemIcon = currentItem.icon;

  return (
    <div
      className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 md:p-8 overflow-hidden border border-white/10"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-white/60 font-medium">Invoice Splitting Engine Active</span>
          </div>
          <div className="flex items-center gap-4">
            {isPaused && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1.5 text-xs text-white/50">
                <Pause className="w-3 h-3" /> Paused
              </motion.div>
            )}
            <div className="text-xs text-white/40 font-mono">
              {routedItems.length} / {invoiceItems.length} items routed
            </div>
          </div>
        </div>

        {/* Invoice Badge */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <FileText className="w-4 h-4 text-white/60" />
            <span className="text-sm text-white/80 font-medium">Invoice #INV-2847</span>
            <span className="text-xs text-white/40">• 3 line items • 1 customer</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center min-h-[250px] md:min-h-[300px]">

          {/* Invoice Line Items */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-4">
              Invoice Line Items
            </div>
            {invoiceItems.map((item, idx) => {
              const Icon = item.icon;
              const isActive = idx === currentItemIndex;
              const isRouted = routedItems.includes(item.id);

              return (
                <motion.div
                  key={item.id}
                  animate={{
                    opacity: isActive ? 1 : isRouted ? 0.3 : 0.5,
                    scale: isActive ? 1.02 : 1,
                  }}
                  transition={{ duration: 0.5 }}
                  className={`relative p-3 rounded-lg border transition-all ${
                    isActive ? "bg-white/10 border-white/30" : "bg-white/5 border-white/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-white truncate">{item.product}</div>
                      <div className="text-xs text-white/40">{item.decoration}</div>
                    </div>
                    {isRouted && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                  </div>
                  {isActive && phase !== "complete" && (
                    <motion.div
                      className="absolute inset-0 rounded-lg border-2 border-primary/50"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* AI Splitting Engine */}
          <div className="flex flex-col items-center justify-center">
            <div className="md:hidden mb-4">
              <ArrowRight className="w-6 h-6 text-white/30 rotate-90" />
            </div>

            <AnimatePresence mode="wait">
              {phase === "invoice" && (
                <motion.div key="invoice" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                  <motion.div
                    className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 flex items-center justify-center mb-4 mx-auto"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  >
                    <FileText className="w-10 h-10 text-primary" />
                  </motion.div>
                  <div className="text-sm text-white/60">Reading invoice...</div>
                </motion.div>
              )}

              {phase === "splitting" && (
                <motion.div key="splitting" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="text-center">
                  <motion.div
                    className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/50 flex items-center justify-center mb-4 mx-auto"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <SplitSquareVertical className="w-10 h-10 text-amber-400" />
                  </motion.div>
                  <div className="text-sm text-amber-400 font-medium">Splitting Invoice</div>
                  <motion.div className="text-xs text-white/40 mt-1" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    Matching product to supplier & decorator...
                  </motion.div>
                  <div className="mt-3 text-xs text-white/30 space-y-1">
                    <p>Decoration: {currentItem.decoration}</p>
                    <p>Destination: {currentItem.destination}</p>
                  </div>
                </motion.div>
              )}

              {phase === "routing" && (
                <motion.div key="routing" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="text-center">
                  <motion.div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/50 flex items-center justify-center mb-4 mx-auto">
                    <motion.div animate={{ x: [0, 10, 0] }} transition={{ duration: 0.8, repeat: Infinity }}>
                      <ArrowRight className="w-10 h-10 text-blue-400" />
                    </motion.div>
                  </motion.div>
                  <div className="text-sm text-blue-400 font-medium">Routing Line Item</div>
                  <div className="text-xs text-white/40 mt-1">→ {currentItem.destination}</div>
                </motion.div>
              )}

              {phase === "complete" && (
                <motion.div key="complete" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="text-center">
                  <motion.div
                    className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/50 flex items-center justify-center mb-4 mx-auto"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 150 }}
                  >
                    <CheckCircle2 className="w-10 h-10 text-green-400" />
                  </motion.div>
                  <div className="text-sm text-green-400 font-medium">Item Routed!</div>
                  <div className="text-xs text-white/40 mt-1">Sent to {currentItem.destination}</div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="md:hidden mt-4">
              <ArrowRight className="w-6 h-6 text-white/30 rotate-90" />
            </div>
          </div>

          {/* Destinations */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-4">
              Suppliers & Decorators
            </div>
            {destinations.map((dest) => {
              const isTarget = phase === "routing" && currentItem.destination === dest.name;
              const hasItem = routedItems.some(itemId => {
                const item = invoiceItems.find(i => i.id === itemId);
                return item?.destination === dest.name;
              });

              return (
                <motion.div
                  key={dest.name}
                  animate={{
                    scale: isTarget ? 1.05 : 1,
                    borderColor: isTarget ? "rgba(59, 130, 246, 0.8)" : undefined,
                  }}
                  transition={{ duration: 0.5 }}
                  className={`relative p-3 rounded-lg border transition-all ${dest.color}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-white/70" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-white font-medium">{dest.name}</div>
                      <div className="text-xs text-white/50">{dest.specialty}</div>
                    </div>
                    {hasItem && (
                      <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                        <span className="text-xs text-green-400">✓</span>
                      </div>
                    )}
                  </div>
                  {isTarget && (
                    <motion.div
                      className="absolute inset-0 rounded-lg border-2 border-blue-400"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Rules indicator */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="flex items-center justify-center gap-4 md:gap-6 text-xs text-white/40 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Blank Apparel → Fulfillment Center</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              <span>Embroidery → Stitch Specialist</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>DTG Print → Print Specialist</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary/50 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderRoutingDemo;

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Cpu, ArrowRight, CheckCircle2, Shirt, Sparkles, Building2, Pause } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Order {
  id: string;
  product: string;
  type: "apparel" | "embroidery" | "promo";
  icon: typeof Shirt;
  decorator: string;
  color: string;
}

const orders: Order[] = [
  { id: "ORD-001", product: "Custom T-Shirts (50)", type: "apparel", icon: Shirt, decorator: "PrintMax Pro", color: "from-blue-500 to-blue-600" },
  { id: "ORD-002", product: "Embroidered Polos (25)", type: "embroidery", icon: Sparkles, decorator: "StitchCraft", color: "from-purple-500 to-purple-600" },
  { id: "ORD-003", product: "Branded Pens (500)", type: "promo", icon: Package, decorator: "PromoHub", color: "from-green-500 to-green-600" },
];

const decorators = [
  { name: "PrintMax Pro", specialty: "Screen Print & DTG", color: "bg-blue-500/20 border-blue-500/50" },
  { name: "StitchCraft", specialty: "Embroidery", color: "bg-purple-500/20 border-purple-500/50" },
  { name: "PromoHub", specialty: "Promotional Items", color: "bg-green-500/20 border-green-500/50" },
];

const OrderRoutingDemo = () => {
  const [currentOrderIndex, setCurrentOrderIndex] = useState(0);
  const [phase, setPhase] = useState<"incoming" | "analyzing" | "routing" | "complete">("incoming");
  const [completedOrders, setCompletedOrders] = useState<string[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  // Progress per order
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setProgress(prev => prev >= 100 ? 0 : prev + (100 / 100)); // 10s per order
    }, 100);
    return () => clearInterval(interval);
  }, [isPaused, currentOrderIndex]);

  useEffect(() => {
    if (isPaused) return;
    
    const runAnimation = () => {
      setPhase("incoming");
      setProgress(0);
      
      const timers = [
        setTimeout(() => setPhase("analyzing"), 2000),
        setTimeout(() => setPhase("routing"), 5000),
        setTimeout(() => {
          setPhase("complete");
          setCompletedOrders(prev => [...prev, orders[currentOrderIndex].id]);
        }, 8000),
        setTimeout(() => {
          setCurrentOrderIndex((prev) => (prev + 1) % orders.length);
          if (currentOrderIndex === orders.length - 1) {
            setCompletedOrders([]);
          }
        }, 10000),
      ];

      return () => timers.forEach(clearTimeout);
    };

    const cleanup = runAnimation();
    return cleanup;
  }, [currentOrderIndex, isPaused]);

  const currentOrder = orders[currentOrderIndex];
  const OrderIcon = currentOrder.icon;

  return (
    <div 
      className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 md:p-8 overflow-hidden border border-white/10"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px]" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-white/60 font-medium">AI Routing Engine Active</span>
          </div>
          <div className="flex items-center gap-4">
            {isPaused && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1.5 text-xs text-white/50">
                <Pause className="w-3 h-3" /> Paused
              </motion.div>
            )}
            <div className="text-xs text-white/40 font-mono">
              {completedOrders.length} / {orders.length} orders routed
            </div>
          </div>
        </div>

        {/* Main visualization - responsive */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center min-h-[250px] md:min-h-[300px]">
          
          {/* Incoming Orders Column */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-4">
              Incoming Orders
            </div>
            {orders.map((order, idx) => {
              const Icon = order.icon;
              const isActive = idx === currentOrderIndex;
              const isCompleted = completedOrders.includes(order.id);
              
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ 
                    opacity: isActive ? 1 : isCompleted ? 0.3 : 0.5,
                    x: 0,
                    scale: isActive ? 1.02 : 1
                  }}
                  transition={{ duration: 0.5 }}
                  className={`relative p-3 rounded-lg border transition-all ${
                    isActive ? "bg-white/10 border-white/30" : "bg-white/5 border-white/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${order.color} flex items-center justify-center`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-mono text-white/40">{order.id}</div>
                      <div className="text-sm text-white truncate">{order.product}</div>
                    </div>
                    {isCompleted && <CheckCircle2 className="w-4 h-4 text-green-400" />}
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

          {/* AI Processing Column */}
          <div className="flex flex-col items-center justify-center">
            {/* Arrow on mobile */}
            <div className="md:hidden mb-4">
              <ArrowRight className="w-6 h-6 text-white/30 rotate-90" />
            </div>
            
            <AnimatePresence mode="wait">
              {phase === "incoming" && (
                <motion.div key="incoming" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="text-center">
                  <motion.div 
                    className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 flex items-center justify-center mb-4 mx-auto"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  >
                    <Cpu className="w-10 h-10 text-primary" />
                  </motion.div>
                  <div className="text-sm text-white/60">Waiting for order...</div>
                </motion.div>
              )}

              {phase === "analyzing" && (
                <motion.div key="analyzing" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.5 }} className="text-center">
                  <motion.div 
                    className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/50 flex items-center justify-center mb-4 mx-auto"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Cpu className="w-10 h-10 text-amber-400" />
                  </motion.div>
                  <div className="text-sm text-amber-400 font-medium">Analyzing Order</div>
                  <motion.div className="text-xs text-white/40 mt-1" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    Checking product type & routing rules...
                  </motion.div>
                  <div className="mt-3 text-xs text-white/30 space-y-1">
                    <p>Type: {currentOrder.type}</p>
                    <p>Best match: {currentOrder.decorator}</p>
                  </div>
                </motion.div>
              )}

              {phase === "routing" && (
                <motion.div key="routing" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.5 }} className="text-center">
                  <motion.div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/50 flex items-center justify-center mb-4 mx-auto">
                    <motion.div animate={{ x: [0, 10, 0] }} transition={{ duration: 0.8, repeat: Infinity }}>
                      <ArrowRight className="w-10 h-10 text-blue-400" />
                    </motion.div>
                  </motion.div>
                  <div className="text-sm text-blue-400 font-medium">Routing to Decorator</div>
                  <div className="text-xs text-white/40 mt-1">→ {currentOrder.decorator}</div>
                </motion.div>
              )}

              {phase === "complete" && (
                <motion.div key="complete" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.5 }} className="text-center">
                  <motion.div 
                    className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/50 flex items-center justify-center mb-4 mx-auto"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 150 }}
                  >
                    <CheckCircle2 className="w-10 h-10 text-green-400" />
                  </motion.div>
                  <div className="text-sm text-green-400 font-medium">Order Routed!</div>
                  <div className="text-xs text-white/40 mt-1">Sent to {currentOrder.decorator}</div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Arrow on mobile */}
            <div className="md:hidden mt-4">
              <ArrowRight className="w-6 h-6 text-white/30 rotate-90" />
            </div>
          </div>

          {/* Decorators Column */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-4">
              Decorators
            </div>
            {decorators.map((decorator) => {
              const isTarget = phase === "routing" && currentOrder.decorator === decorator.name;
              const hasOrder = completedOrders.some(orderId => {
                const order = orders.find(o => o.id === orderId);
                return order?.decorator === decorator.name;
              });
              
              return (
                <motion.div
                  key={decorator.name}
                  animate={{ 
                    scale: isTarget ? 1.05 : 1,
                    borderColor: isTarget ? "rgba(59, 130, 246, 0.8)" : undefined
                  }}
                  transition={{ duration: 0.5 }}
                  className={`relative p-3 rounded-lg border transition-all ${decorator.color}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-white/70" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-white font-medium">{decorator.name}</div>
                      <div className="text-xs text-white/50">{decorator.specialty}</div>
                    </div>
                    {hasOrder && (
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
              <span>Apparel → PrintMax Pro</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              <span>Embroidery → StitchCraft</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>Promo → PromoHub</span>
            </div>
          </div>
          {/* Progress bar */}
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

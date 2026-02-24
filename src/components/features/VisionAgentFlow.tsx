import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, FileText, ArrowRight, AlertTriangle, Check, Send, ExternalLink, Eye, 
  MessageSquare, User, Pause
} from "lucide-react";
import { ChatBubble } from "./ChatBubble";
import { Progress } from "@/components/ui/progress";

const extractedFields = [
  { label: "Customer", value: "Lincoln High School", hasError: false },
  { label: "Contact", value: "john.smith@lhs.edu", hasError: false },
  { label: "Item", value: "Navy T-Shirt (S-XL)", hasError: false },
  { label: "Quantity", value: "1000", hasError: true },
  { label: "Due Date", value: "March 15, 2025", hasError: false },
  { label: "Total", value: "$4,500.00", hasError: false },
];

const printavoOrder = [
  { label: "Customer", value: "Lincoln High School" },
  { label: "Contact", value: "john.smith@lhs.edu" },
  { label: "Item", value: "Navy T-Shirt (S-XL)" },
  { label: "Quantity", value: "100" },
  { label: "Due Date", value: "March 15, 2025" },
  { label: "Total", value: "$450.00" },
];

type Phase = "email_arrives" | "ai_reads" | "error_detected" | "client_comms" | "client_confirms" | "submit_order";

const TOTAL_CYCLE = 35000;

export const VisionAgentFlow = () => {
  const [phase, setPhase] = useState<Phase>("email_arrives");
  const [scanProgress, setScanProgress] = useState(0);
  const [extractedCount, setExtractedCount] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  // Progress bar
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setProgress(prev => prev >= 100 ? 0 : prev + (100 / (TOTAL_CYCLE / 100)));
    }, 100);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Auto-play demo - SLOWER timings
  useEffect(() => {
    if (isPaused) return;
    const timers: NodeJS.Timeout[] = [];
    
    // Phase 2: AI reads (5s in)
    timers.push(setTimeout(() => setPhase("ai_reads"), 5000));
    
    // Scanning progress (slower)
    for (let i = 1; i <= 100; i += 3) {
      timers.push(setTimeout(() => setScanProgress(i), 5000 + (i * 30)));
    }
    
    // Extract fields one by one (500ms gaps)
    for (let i = 1; i <= 6; i++) {
      timers.push(setTimeout(() => setExtractedCount(i), 8000 + (i * 500)));
    }
    
    // Phase 3: Error detected (11s)
    timers.push(setTimeout(() => setPhase("error_detected"), 11000));
    
    // Phase 4: AI communicates (16s)
    timers.push(setTimeout(() => setPhase("client_comms"), 16000));
    
    // Phase 5: Client confirms (21s)
    timers.push(setTimeout(() => setPhase("client_confirms"), 21000));
    
    // Phase 6: Submit (26s)
    timers.push(setTimeout(() => setPhase("submit_order"), 26000));
    
    // Reset (35s)
    timers.push(setTimeout(() => {
      setPhase("email_arrives");
      setScanProgress(0);
      setExtractedCount(0);
      setProgress(0);
    }, TOTAL_CYCLE));

    return () => timers.forEach(clearTimeout);
  }, [isPaused, phase === "email_arrives"]);

  const phases: { id: Phase; label: string }[] = [
    { id: "email_arrives", label: "Email Arrives" },
    { id: "ai_reads", label: "AI Reads" },
    { id: "error_detected", label: "Error Found" },
    { id: "client_comms", label: "Contact Client" },
    { id: "client_confirms", label: "Confirmed" },
    { id: "submit_order", label: "Submit Order" },
  ];

  const currentPhaseIndex = phases.findIndex(p => p.id === phase);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            See the AI Vision Agent in Action
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Client sends email → AI reads & detects errors → AI contacts client to resolve → Submits to decorator. Hover to pause.
          </p>
        </div>

        <div 
          className="max-w-5xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Phase Indicator */}
          <div className="flex items-center justify-center gap-1 mb-8 flex-wrap">
            {phases.map((p, index) => {
              const isActive = index <= currentPhaseIndex;
              return (
                <div key={p.id} className="flex items-center">
                  <div className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-500 ${
                    isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}>
                    {p.label}
                  </div>
                  {index < phases.length - 1 && (
                    <ArrowRight className={`w-3 h-3 mx-1 transition-colors duration-500 ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`} />
                  )}
                </div>
              );
            })}
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 md:p-8 min-h-[400px] md:min-h-[500px] relative">
            {/* Pause indicator */}
            {isPaused && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="absolute top-4 right-4 flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full z-10"
              >
                <Pause className="w-3 h-3" /> Paused
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {/* Phase 1: Email Arrives */}
              {phase === "email_arrives" && (
                <motion.div key="email_arrives" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
                  <ChatBubble message="Watching for incoming orders from clients..." />
                  <motion.div 
                    className="max-w-lg mx-auto bg-muted rounded-xl p-6"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <Mail className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-card-foreground">New Email Received</p>
                        <p className="text-sm text-muted-foreground">From: john.smith@lhs.edu</p>
                      </div>
                    </div>
                    <div className="bg-background p-4 rounded-lg space-y-3">
                      <p className="text-sm text-card-foreground"><span className="font-medium">Subject:</span> PO for Spring Spirit Wear</p>
                      <p className="text-sm text-muted-foreground">
                        Hi, please find attached our purchase order for the spring spirit wear order. 
                        We need 1000 navy t-shirts in sizes S-XL by March 15th.
                      </p>
                      <div className="flex items-center gap-2 p-2 bg-muted rounded border border-border">
                        <FileText className="w-5 h-5 text-red-500" />
                        <span className="text-sm text-card-foreground">PurchaseOrder_LHS.pdf</span>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {/* Phase 2: AI Reads */}
              {phase === "ai_reads" && (
                <motion.div key="ai_reads" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
                  <ChatBubble message="Reading email and scanning PDF attachment for order details..." />
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-muted rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Eye className="w-4 h-4 text-primary animate-pulse" />
                        <span className="text-sm font-medium text-card-foreground">Reading Email</span>
                      </div>
                      <div className="bg-background p-3 rounded-lg text-sm text-muted-foreground">
                        <motion.span className="bg-primary/20 px-1" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }}>
                          1000 navy t-shirts
                        </motion.span>
                        {" "}in sizes S-XL by{" "}
                        <motion.span className="bg-primary/20 px-1" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}>
                          March 15th
                        </motion.span>
                      </div>
                    </div>
                    <div className="bg-muted rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <FileText className="w-4 h-4 text-red-500" />
                        <span className="text-sm font-medium text-card-foreground">Scanning PDF... {scanProgress}%</span>
                      </div>
                      <div className="h-2 bg-background rounded-full overflow-hidden mb-4">
                        <motion.div className="h-full bg-primary" style={{ width: `${scanProgress}%` }} />
                      </div>
                      <div className="space-y-2">
                        {extractedFields.slice(0, extractedCount).map((field) => (
                          <motion.div
                            key={field.label}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4 }}
                            className={`flex justify-between p-2 rounded text-sm ${
                              field.hasError ? "bg-destructive/10 border border-destructive/30" : "bg-primary/5"
                            }`}
                          >
                            <span className="text-muted-foreground">{field.label}</span>
                            <span className={field.hasError ? "text-destructive font-medium" : "text-card-foreground"}>{field.value}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Phase 3: Error Detected */}
              {phase === "error_detected" && (
                <motion.div key="error_detected" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
                  <ChatBubble message="⚠️ I detected a suspicious quantity! 1000 t-shirts is unusually high for a school order. I'll verify with the client before proceeding." />
                  <motion.div 
                    className="max-w-lg mx-auto p-6 bg-destructive/10 border-2 border-destructive rounded-xl"
                    animate={{ scale: [1, 1.01, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <AlertTriangle className="w-6 h-6 text-destructive" />
                      <span className="font-bold text-destructive text-lg">Potential Error Detected</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between p-3 bg-background rounded-lg">
                        <span className="text-muted-foreground">Quantity in PO:</span>
                        <span className="text-destructive font-bold line-through">1000</span>
                      </div>
                      <div className="flex justify-between p-3 bg-background rounded-lg">
                        <span className="text-muted-foreground">Typical school order:</span>
                        <span className="text-card-foreground font-medium">50-150 units</span>
                      </div>
                      <div className="flex justify-between p-3 bg-primary/10 rounded-lg border border-primary">
                        <span className="text-muted-foreground">AI Suggestion:</span>
                        <span className="text-primary font-bold">100 units?</span>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {/* Phase 4: AI Contacts Client */}
              {phase === "client_comms" && (
                <motion.div key="client_comms" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
                  <ChatBubble message="Sending verification email to the client to confirm the correct quantity..." />
                  <motion.div 
                    className="max-w-lg mx-auto bg-muted rounded-xl overflow-hidden"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="bg-primary px-4 py-3 flex items-center gap-2">
                      <Send className="w-4 h-4 text-primary-foreground" />
                      <span className="text-sm font-medium text-primary-foreground">AI Auto-Response Sent</span>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">To:</span>
                        <span className="text-card-foreground">john.smith@lhs.edu</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Subject:</span>
                        <span className="text-card-foreground">Quick Question About Your Order</span>
                      </div>
                      <div className="bg-background p-4 rounded-lg text-sm text-card-foreground">
                        <p className="mb-3">Hi John,</p>
                        <p className="mb-3">
                          Thank you for your order! I noticed the quantity shows <strong>1,000 t-shirts</strong>. 
                          Based on typical orders from Lincoln High, I wanted to confirm — did you mean <strong>100 units</strong>?
                        </p>
                        <p className="mb-3">Just reply with the correct quantity and I'll process your order immediately.</p>
                        <p className="text-muted-foreground">Best,<br/>AI Order Assistant</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {/* Phase 5: Client Confirms */}
              {phase === "client_confirms" && (
                <motion.div key="client_confirms" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
                  <ChatBubble message="✅ Client confirmed: They meant 100 units! Typo caught, $4,050 billing error prevented." />
                  <div className="max-w-lg mx-auto space-y-4">
                    <motion.div className="bg-muted rounded-xl p-4" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <span className="text-sm font-medium text-card-foreground">John Smith</span>
                          <span className="text-xs text-muted-foreground ml-2">just now</span>
                        </div>
                      </div>
                      <div className="bg-background p-3 rounded-lg text-sm text-card-foreground">
                        "Yes, sorry about that! It should be 100 t-shirts. Thanks for catching that!"
                      </div>
                    </motion.div>
                    <motion.div 
                      className="p-6 bg-primary/5 border-2 border-primary rounded-xl text-center"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    >
                      <motion.div
                        className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4"
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 1.2, 1] }}
                        transition={{ duration: 0.6 }}
                      >
                        <Check className="w-8 h-8 text-primary-foreground" />
                      </motion.div>
                      <h3 className="text-xl font-bold text-card-foreground mb-2">Issue Resolved!</h3>
                      <p className="text-muted-foreground">
                        Error caught before reaching decorator. <span className="text-primary font-bold">$4,050</span> billing mistake prevented.
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {/* Phase 6: Submit to Printavo */}
              {phase === "submit_order" && (
                <motion.div key="submit_order" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
                  <ChatBubble message="Submitting the verified order to Printavo now..." />
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-4 bg-muted rounded-xl">
                      <p className="text-sm font-medium text-muted-foreground mb-3">Original Email + PO (Messy)</p>
                      <div className="bg-background p-4 rounded-lg space-y-2 text-sm font-mono">
                        <p className="text-card-foreground">From: john.smith@lhs.edu</p>
                        <p className="text-muted-foreground">---</p>
                        <p className="text-card-foreground">Lincoln High...</p>
                        <p className="text-destructive line-through">1000 navy tees S-XL</p>
                        <p className="text-card-foreground">need by 3/15</p>
                      </div>
                    </div>
                    <motion.div 
                      className="p-4 bg-primary/5 border-2 border-primary rounded-xl"
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <ExternalLink className="w-4 h-4 text-primary" />
                        <p className="text-sm font-medium text-primary">New Order in Printavo</p>
                      </div>
                      <div className="space-y-2">
                        {printavoOrder.map((field, index) => (
                          <motion.div
                            key={field.label}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 + index * 0.15 }}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-muted-foreground">{field.label}:</span>
                            <span className="text-card-foreground font-medium">{field.value}</span>
                          </motion.div>
                        ))}
                      </div>
                      <motion.div 
                        className="mt-4 pt-4 border-t border-border flex items-center justify-center gap-2 text-sm text-primary"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                      >
                        <Check className="w-4 h-4" />
                        <span className="font-medium">Order Submitted Successfully</span>
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Progress bar */}
            <div className="mt-6">
              <Progress value={progress} className="h-1" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

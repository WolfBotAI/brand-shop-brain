import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  FileText, 
  Image, 
  FileSpreadsheet, 
  ArrowRight, 
  AlertTriangle,
  Check,
  Send,
  ExternalLink
} from "lucide-react";
import { ChatBubble } from "./ChatBubble";
import { Button } from "@/components/ui/button";

const documentTypes = [
  { id: "email", icon: Mail, label: "Email", color: "bg-blue-500" },
  { id: "pdf", icon: FileText, label: "PDF PO", color: "bg-red-500" },
  { id: "image", icon: Image, label: "Handwritten", color: "bg-green-500" },
  { id: "spreadsheet", icon: FileSpreadsheet, label: "Spreadsheet", color: "bg-emerald-600" },
];

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

type Phase = "input" | "scanning" | "extraction" | "error" | "resolved" | "integration";

export const VisionAgentFlow = () => {
  const [phase, setPhase] = useState<Phase>("input");
  const [activeDoc, setActiveDoc] = useState(0);
  const [scanProgress, setScanProgress] = useState(0);
  const [extractedCount, setExtractedCount] = useState(0);

  // Auto-play demo
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    
    // Phase 1: Documents arrive
    timers.push(setTimeout(() => setActiveDoc(1), 500));
    timers.push(setTimeout(() => setActiveDoc(2), 1000));
    timers.push(setTimeout(() => setActiveDoc(1), 1500));
    
    // Phase 2: Start scanning
    timers.push(setTimeout(() => setPhase("scanning"), 2500));
    
    // Scanning progress
    for (let i = 1; i <= 100; i += 5) {
      timers.push(setTimeout(() => setScanProgress(i), 2500 + (i * 20)));
    }
    
    // Phase 3: Extraction
    timers.push(setTimeout(() => setPhase("extraction"), 4500));
    
    // Extract fields one by one
    for (let i = 1; i <= 6; i++) {
      timers.push(setTimeout(() => setExtractedCount(i), 4500 + (i * 300)));
    }
    
    // Phase 4: Error detected
    timers.push(setTimeout(() => setPhase("error"), 7000));
    
    // Phase 5: Resolved
    timers.push(setTimeout(() => setPhase("resolved"), 9500));
    
    // Phase 6: Integration
    timers.push(setTimeout(() => setPhase("integration"), 11500));
    
    // Reset
    timers.push(setTimeout(() => {
      setPhase("input");
      setActiveDoc(0);
      setScanProgress(0);
      setExtractedCount(0);
    }, 15000));

    return () => timers.forEach(clearTimeout);
  }, [phase === "input"]);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            See the AI Vision Agent in Action
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Watch documents get processed, errors flagged, and orders created automatically.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Phase Indicator */}
          <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
            {["Input", "Scan", "Extract", "Validate", "Integrate"].map((label, index) => {
              const phases: Phase[] = ["input", "scanning", "extraction", "error", "integration"];
              const currentIndex = phases.indexOf(phase);
              const isActive = index <= currentIndex;
              
              return (
                <div key={label} className="flex items-center">
                  <div className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {label}
                  </div>
                  {index < 4 && (
                    <ArrowRight className={`w-4 h-4 mx-1 ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`} />
                  )}
                </div>
              );
            })}
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 md:p-8 min-h-[500px]">
            <AnimatePresence mode="wait">
              {/* Input Phase */}
              {phase === "input" && (
                <motion.div
                  key="input"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <ChatBubble message="I'm watching for incoming orders from any source..." />
                  
                  <div className="flex items-center justify-center gap-6 py-8 flex-wrap">
                    {documentTypes.map((doc, index) => (
                      <motion.div
                        key={doc.id}
                        className={`flex flex-col items-center gap-2 p-6 rounded-xl border-2 transition-all ${
                          activeDoc === index 
                            ? "border-primary scale-110 shadow-lg" 
                            : "border-border"
                        }`}
                        animate={{ 
                          y: activeDoc === index ? -10 : 0,
                          scale: activeDoc === index ? 1.05 : 1
                        }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className={`w-14 h-14 rounded-lg ${doc.color} flex items-center justify-center`}>
                          <doc.icon className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-sm font-medium text-card-foreground">{doc.label}</span>
                      </motion.div>
                    ))}
                  </div>
                  
                  <p className="text-center text-muted-foreground">
                    Documents arriving from email, uploads, and integrations...
                  </p>
                </motion.div>
              )}

              {/* Scanning Phase */}
              {phase === "scanning" && (
                <motion.div
                  key="scanning"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <ChatBubble message="New PDF received! Scanning document..." />
                  
                  <div className="max-w-md mx-auto">
                    <div className="bg-muted rounded-xl p-6 relative overflow-hidden">
                      {/* Scanning line */}
                      <motion.div
                        className="absolute left-0 right-0 h-1 bg-primary"
                        style={{ top: `${scanProgress}%` }}
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                      />
                      
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-card-foreground">PurchaseOrder_LHS.pdf</p>
                          <p className="text-sm text-muted-foreground">Scanning... {scanProgress}%</p>
                        </div>
                      </div>
                      
                      {/* Progress bar */}
                      <div className="h-2 bg-background rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-primary"
                          style={{ width: `${scanProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Extraction Phase */}
              {phase === "extraction" && (
                <motion.div
                  key="extraction"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <ChatBubble message="Extracting order details from the document..." />
                  
                  <div className="max-w-lg mx-auto bg-muted rounded-xl p-6">
                    <p className="text-sm font-medium text-muted-foreground mb-4">Extracted Fields:</p>
                    <div className="space-y-3">
                      {extractedFields.slice(0, extractedCount).map((field, index) => (
                        <motion.div
                          key={field.label}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`flex items-center justify-between p-3 rounded-lg ${
                            field.hasError 
                              ? "bg-destructive/10 border border-destructive/30" 
                              : "bg-primary/5 border border-primary/20"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {field.hasError ? (
                              <AlertTriangle className="w-4 h-4 text-destructive" />
                            ) : (
                              <Check className="w-4 h-4 text-primary" />
                            )}
                            <span className="text-sm text-muted-foreground">{field.label}</span>
                          </div>
                          <span className={`text-sm font-medium ${
                            field.hasError ? "text-destructive" : "text-card-foreground"
                          }`}>
                            {field.value}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Error Detection Phase */}
              {phase === "error" && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <ChatBubble message="⚠️ I noticed a potential issue. Quantity '1000' seems high for a school order. Let me verify with the customer..." />
                  
                  <div className="max-w-lg mx-auto space-y-4">
                    {/* Error highlight */}
                    <motion.div 
                      className="p-4 bg-destructive/10 border-2 border-destructive rounded-xl"
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-5 h-5 text-destructive" />
                        <span className="font-medium text-destructive">Potential Error Detected</span>
                      </div>
                      <p className="text-sm text-card-foreground">
                        Quantity: <span className="line-through text-destructive">1000</span> → Did you mean <span className="text-primary font-bold">100</span>?
                      </p>
                    </motion.div>
                    
                    {/* Auto-response email */}
                    <motion.div 
                      className="p-4 bg-muted rounded-xl border border-border"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <Send className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-card-foreground">AI Auto-Response Sent</span>
                      </div>
                      <div className="bg-background p-3 rounded-lg text-sm">
                        <p className="text-muted-foreground mb-2">To: john.smith@lhs.edu</p>
                        <p className="text-card-foreground">
                          Hi John, I noticed your order shows 1000 t-shirts. Based on typical school orders, 
                          did you mean 100? Please confirm and I'll process immediately.
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {/* Resolved Phase */}
              {phase === "resolved" && (
                <motion.div
                  key="resolved"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <ChatBubble message="✅ Customer confirmed: 100 units is correct! Order updated and ready to process." />
                  
                  <motion.div 
                    className="max-w-md mx-auto p-6 bg-primary/5 border-2 border-primary rounded-xl text-center"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                  >
                    <motion.div
                      className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4"
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.2, 1] }}
                    >
                      <Check className="w-8 h-8 text-primary-foreground" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-card-foreground mb-2">Issue Resolved!</h3>
                    <p className="text-muted-foreground">
                      Error caught before reaching decorator. $4,050 billing mistake prevented.
                    </p>
                  </motion.div>
                </motion.div>
              )}

              {/* Integration Phase */}
              {phase === "integration" && (
                <motion.div
                  key="integration"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <ChatBubble message="Perfect! Pushing the verified order to Printavo now..." />
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Source Document */}
                    <div className="p-4 bg-muted rounded-xl">
                      <p className="text-sm font-medium text-muted-foreground mb-3">Original PO (Messy)</p>
                      <div className="bg-background p-4 rounded-lg space-y-2">
                        <p className="text-sm text-card-foreground font-mono">Lincoln High...</p>
                        <p className="text-sm text-card-foreground font-mono">100 navy tees S-XL</p>
                        <p className="text-sm text-card-foreground font-mono">need by 3/15</p>
                        <p className="text-sm text-card-foreground font-mono">john smith</p>
                      </div>
                    </div>
                    
                    {/* Printavo Order */}
                    <motion.div 
                      className="p-4 bg-primary/5 border-2 border-primary rounded-xl"
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
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
                            transition={{ delay: 0.5 + index * 0.1 }}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-muted-foreground">{field.label}:</span>
                            <span className="text-card-foreground font-medium">{field.value}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </div>

                  {/* Platform logos */}
                  <div className="flex items-center justify-center gap-6 pt-4">
                    <p className="text-sm text-muted-foreground">Also integrates with:</p>
                    <div className="flex gap-4">
                      {["Printavo", "DecoNetwork", "InkSoft"].map((platform) => (
                        <span key={platform} className="px-3 py-1 bg-muted rounded-full text-sm font-medium text-muted-foreground">
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

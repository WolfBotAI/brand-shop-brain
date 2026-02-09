import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Upload, Database, Users, ShoppingCart, Globe, ArrowRight, FileSpreadsheet, Layout, RefreshCw } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";

const sources = [
  { id: "inksoft", name: "InkSoft", icon: Layout },
  { id: "custom", name: "Custom Site", icon: Globe },
  { id: "spreadsheet", name: "Spreadsheet", icon: FileSpreadsheet },
];

const dataTypes = [
  { id: "products", name: "Products", icon: ShoppingCart, count: 1247 },
  { id: "customers", name: "Customers", icon: Users, count: 3892 },
  { id: "orders", name: "Order History", icon: Database, count: 15420 },
];

const validationChecks = [
  "Product images verified",
  "Customer data validated",
  "Order history imported",
  "Store settings configured",
  "DNS records ready",
];

export const SiteMigrationDemo = () => {
  const [step, setStep] = useState(0);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [importProgress, setImportProgress] = useState<Record<string, number>>({});
  const [validationIndex, setValidationIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance through steps
  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      if (step === 0) {
        // Select source
        if (!selectedSource) {
          setSelectedSource("inksoft");
        } else {
          setStep(1);
        }
      } else if (step === 1) {
        // Import data with progress
        const allComplete = dataTypes.every(dt => (importProgress[dt.id] || 0) >= 100);
        if (allComplete) {
          setStep(2);
        } else {
          setImportProgress(prev => {
            const next = { ...prev };
            dataTypes.forEach(dt => {
              const current = prev[dt.id] || 0;
              if (current < 100) {
                next[dt.id] = Math.min(100, current + Math.random() * 15 + 5);
              }
            });
            return next;
          });
        }
      } else if (step === 2) {
        // Validation checks
        if (validationIndex < validationChecks.length) {
          setValidationIndex(prev => prev + 1);
        } else {
          // Reset after complete
          setTimeout(() => {
            setStep(0);
            setSelectedSource(null);
            setImportProgress({});
            setValidationIndex(0);
          }, 2000);
        }
      }
    }, 800);

    return () => clearInterval(timer);
  }, [step, selectedSource, importProgress, validationIndex, isAutoPlaying]);

  const handleStepClick = (newStep: number) => {
    setIsAutoPlaying(false);
    setStep(newStep);
    if (newStep === 0) {
      setSelectedSource(null);
      setImportProgress({});
      setValidationIndex(0);
    } else if (newStep === 1) {
      setSelectedSource("inksoft");
      setImportProgress({});
      setValidationIndex(0);
    } else if (newStep === 2) {
      setSelectedSource("inksoft");
      setImportProgress(Object.fromEntries(dataTypes.map(dt => [dt.id, 100])));
      setValidationIndex(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Step Indicators */}
      <div className="flex items-center justify-center gap-4 mb-8">
        {["Select Source", "Import Data", "Go Live"].map((label, index) => (
          <button
            key={label}
            onClick={() => handleStepClick(index)}
            className="flex items-center gap-2"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              step >= index 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted text-muted-foreground"
            }`}>
              {step > index ? <Check className="w-5 h-5" /> : index + 1}
            </div>
            <span className={`font-medium hidden sm:inline ${
              step >= index ? "text-foreground" : "text-muted-foreground"
            }`}>
              {label}
            </span>
            {index < 2 && (
              <ArrowRight className="w-4 h-4 text-muted-foreground mx-2 hidden sm:inline" />
            )}
          </button>
        ))}
      </div>

      {/* Step Content */}
      <Card className="p-6 min-h-[320px]">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="source"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <Upload className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Where are you migrating from?
                </h3>
                <p className="text-muted-foreground">
                  Select your current platform or data source
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {sources.map((source) => (
                  <motion.button
                    key={source.id}
                    onClick={() => {
                      setSelectedSource(source.id);
                      setIsAutoPlaying(false);
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-xl border-2 transition-colors text-center ${
                      selectedSource === source.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <source.icon className={`w-8 h-8 mx-auto mb-2 ${
                      selectedSource === source.id ? "text-primary" : "text-muted-foreground"
                    }`} />
                    <span className={`font-medium ${
                      selectedSource === source.id ? "text-foreground" : "text-muted-foreground"
                    }`}>
                      {source.name}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="import"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <Database className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Importing Your Data
                </h3>
                <p className="text-muted-foreground">
                  Transferring products, customers, and order history
                </p>
              </div>
              <div className="space-y-4">
                {dataTypes.map((dataType) => {
                  const progress = importProgress[dataType.id] || 0;
                  return (
                    <div key={dataType.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <dataType.icon className="w-5 h-5 text-muted-foreground" />
                          <span className="font-medium text-foreground">{dataType.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {Math.floor(dataType.count * progress / 100).toLocaleString()} / {dataType.count.toLocaleString()}
                          </span>
                          {progress >= 100 && (
                            <Check className="w-4 h-4 text-primary" />
                          )}
                        </div>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="validate"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <Globe className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Ready to Go Live!
                </h3>
                <p className="text-muted-foreground">
                  Final validation and DNS configuration
                </p>
              </div>
              <div className="space-y-3">
                {validationChecks.map((check, index) => (
                  <motion.div
                    key={check}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ 
                      opacity: index < validationIndex ? 1 : 0.3,
                      x: 0 
                    }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      index < validationIndex 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted-foreground/20"
                    }`}>
                      {index < validationIndex ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <RefreshCw className="w-3 h-3 animate-spin" />
                      )}
                    </div>
                    <span className={index < validationIndex ? "text-foreground" : "text-muted-foreground"}>
                      {check}
                    </span>
                  </motion.div>
                ))}
              </div>
              {validationIndex >= validationChecks.length && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center p-4 rounded-xl bg-primary/10 border border-primary/20"
                >
                  <Check className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="font-bold text-primary">Migration Complete!</p>
                  <p className="text-sm text-muted-foreground">Your store is now live on Brand-Shop.AI</p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
};

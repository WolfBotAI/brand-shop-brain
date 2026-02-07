import { motion } from "framer-motion";
import { FileText, Mail, Image, FileSpreadsheet, Check, AlertTriangle } from "lucide-react";

interface DocumentScannerProps {
  isScanning: boolean;
  documentType: "pdf" | "email" | "image" | "spreadsheet";
  extractedData?: { label: string; value: string; hasError?: boolean }[];
  onComplete?: () => void;
}

const documentIcons = {
  pdf: FileText,
  email: Mail,
  image: Image,
  spreadsheet: FileSpreadsheet,
};

const documentLabels = {
  pdf: "Purchase Order.pdf",
  email: "order@customer.com",
  image: "Handwritten_PO.jpg",
  spreadsheet: "Orders_Q4.xlsx",
};

export const DocumentScanner = ({ 
  isScanning, 
  documentType, 
  extractedData = [],
}: DocumentScannerProps) => {
  const Icon = documentIcons[documentType];

  return (
    <div className="relative">
      {/* Document */}
      <motion.div
        className="bg-card border border-border rounded-xl p-6 shadow-lg relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Document header */}
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-card-foreground">{documentLabels[documentType]}</p>
            <p className="text-xs text-muted-foreground">Processing document...</p>
          </div>
        </div>

        {/* Scanning line animation */}
        {isScanning && (
          <motion.div
            className="absolute left-0 right-0 h-1 bg-primary/50"
            initial={{ top: "20%" }}
            animate={{ top: ["20%", "80%", "20%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        )}

        {/* Document content placeholder with highlights */}
        <div className="space-y-3">
          {extractedData.map((field, index) => (
            <motion.div
              key={index}
              className={`flex items-center justify-between p-3 rounded-lg ${
                field.hasError 
                  ? "bg-destructive/10 border border-destructive/30" 
                  : "bg-primary/5 border border-primary/20"
              }`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.15, duration: 0.4 }}
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
      </motion.div>
    </div>
  );
};

interface DocumentInputsProps {
  activeDocument: number;
}

export const DocumentInputs = ({ activeDocument }: DocumentInputsProps) => {
  const documents = [
    { type: "email", icon: Mail, label: "Email", color: "bg-blue-500" },
    { type: "pdf", icon: FileText, label: "PDF", color: "bg-red-500" },
    { type: "image", icon: Image, label: "Image", color: "bg-green-500" },
    { type: "spreadsheet", icon: FileSpreadsheet, label: "Excel", color: "bg-emerald-600" },
  ];

  return (
    <div className="flex items-center justify-center gap-4 flex-wrap">
      {documents.map((doc, index) => (
        <motion.div
          key={doc.type}
          className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors ${
            activeDocument === index 
              ? "border-primary bg-primary/5" 
              : "border-border bg-card"
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            scale: activeDocument === index ? 1.05 : 1 
          }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
        >
          <div className={`w-12 h-12 rounded-lg ${doc.color} flex items-center justify-center`}>
            <doc.icon className="w-6 h-6 text-white" />
          </div>
          <span className="text-sm font-medium text-card-foreground">{doc.label}</span>
        </motion.div>
      ))}
    </div>
  );
};

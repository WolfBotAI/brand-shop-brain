import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Image, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { SSStyle } from "@/lib/api/ssProducts";

interface LogoUploadStepProps {
  selectedProducts: SSStyle[];
  onLogoUploaded: (logoUrl: string) => void;
  logoUrl: string | null;
  onRemoveLogo: () => void;
}

export const LogoUploadStep = ({
  selectedProducts,
  onLogoUploaded,
  logoUrl,
  onRemoveLogo,
}: LogoUploadStepProps) => {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const url = URL.createObjectURL(file);
      onLogoUploaded(url);
    },
    [onLogoUploaded]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  // Show mockup preview on up to 3 selected products
  const previewProducts = selectedProducts.slice(0, 3);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Image className="w-4 h-4 text-primary" />
        Upload Your Logo
      </div>

      {/* Upload area */}
      {!logoUrl ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            dragOver
              ? "border-primary bg-primary/5"
              : "border-border hover:border-muted-foreground/50"
          }`}
        >
          <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm font-medium text-foreground">
            Drop your logo here or click to browse
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            PNG, SVG, or JPG • Max 5MB
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-3">
          {/* Logo preview */}
          <div className="relative inline-block">
            <div className="w-24 h-24 rounded-lg border border-border bg-muted/30 p-2 flex items-center justify-center">
              <img
                src={logoUrl}
                alt="Uploaded logo"
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <button
              onClick={onRemoveLogo}
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          {/* Mockup previews */}
          {previewProducts.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Sparkles className="w-3 h-3 text-primary" />
                Mockup Preview
              </div>
              <div className="grid grid-cols-3 gap-2">
                {previewProducts.map((product) => (
                  <div
                    key={product.styleID}
                    className="relative aspect-square rounded-lg bg-muted overflow-hidden border border-border"
                  >
                    {product.styleImage && (
                      <img
                        src={product.styleImage}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                    {/* Logo overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <img
                        src={logoUrl}
                        alt="Logo overlay"
                        className="w-1/3 h-1/3 object-contain opacity-80 drop-shadow-lg"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground">
                Your logo will be applied to all selected products. AI will generate professional mockups after store creation.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

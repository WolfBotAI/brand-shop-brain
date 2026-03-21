import { useState } from "react";
import { Shirt, HardHat, ShoppingBag, Footprints } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  iconSize?: "sm" | "md" | "lg";
}

const getCategoryIcon = (alt: string) => {
  const lower = alt.toLowerCase();
  if (lower.includes("cap") || lower.includes("hat") || lower.includes("beanie")) return HardHat;
  if (lower.includes("bag") || lower.includes("tote")) return ShoppingBag;
  if (lower.includes("shoe") || lower.includes("sock")) return Footprints;
  return Shirt;
};

const getCategoryGradient = (alt: string) => {
  const lower = alt.toLowerCase();
  if (lower.includes("polo") || lower.includes("corporate")) return "from-blue-900/20 to-blue-800/10";
  if (lower.includes("hoodie") || lower.includes("fleece") || lower.includes("sweat")) return "from-slate-800/20 to-slate-700/10";
  if (lower.includes("cap") || lower.includes("hat")) return "from-amber-900/20 to-amber-800/10";
  if (lower.includes("bag") || lower.includes("tote")) return "from-emerald-900/20 to-emerald-800/10";
  if (lower.includes("jacket") || lower.includes("outerwear")) return "from-indigo-900/20 to-indigo-800/10";
  return "from-muted to-muted/60";
};

export const ProductImage = ({ src, alt, className, iconSize = "md" }: ProductImageProps) => {
  const [failed, setFailed] = useState(false);
  // Images from cache are already public Supabase Storage URLs
  const imageUrl = src && src.startsWith("http") ? src : null;
  const showImage = imageUrl && !failed;

  const iconSizes = { sm: "w-6 h-6", md: "w-10 h-10", lg: "w-16 h-16" };
  const Icon = getCategoryIcon(alt);
  const gradient = getCategoryGradient(alt);

  if (!showImage) {
    return (
      <div className={cn(`bg-gradient-to-br ${gradient} flex flex-col items-center justify-center gap-1`, className)}>
        <Icon className={cn("text-muted-foreground/40", iconSizes[iconSize])} />
        <span className="text-[10px] text-muted-foreground/50 truncate max-w-[80%] text-center">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={cn("object-cover", className)}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
};

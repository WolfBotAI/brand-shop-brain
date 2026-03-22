import { useState } from "react";
import { Shirt, HardHat, ShoppingBag, Footprints } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  iconSize?: "sm" | "md" | "lg";
  primaryColorHex?: string;
}

const SUPABASE_STORAGE_HOST = "supabase.co/storage";

function isHostedUrl(url: string): boolean {
  return url.includes(SUPABASE_STORAGE_HOST);
}

const getCategoryIcon = (alt: string) => {
  const lower = alt.toLowerCase();
  if (lower.includes("cap") || lower.includes("hat") || lower.includes("beanie") || lower.includes("visor")) return HardHat;
  if (lower.includes("bag") || lower.includes("tote") || lower.includes("backpack")) return ShoppingBag;
  if (lower.includes("shoe") || lower.includes("sock") || lower.includes("footwear")) return Footprints;
  return Shirt;
};

const getCategoryGradient = (alt: string, colorHex?: string) => {
  if (colorHex) {
    return undefined; // Will use inline style instead
  }
  const lower = alt.toLowerCase();
  if (lower.includes("polo") || lower.includes("corporate")) return "from-blue-900/20 to-blue-800/10";
  if (lower.includes("hoodie") || lower.includes("fleece") || lower.includes("sweat")) return "from-slate-800/20 to-slate-700/10";
  if (lower.includes("cap") || lower.includes("hat")) return "from-amber-900/20 to-amber-800/10";
  if (lower.includes("bag") || lower.includes("tote")) return "from-emerald-900/20 to-emerald-800/10";
  if (lower.includes("jacket") || lower.includes("outerwear")) return "from-indigo-900/20 to-indigo-800/10";
  return "from-muted to-muted/60";
};

export const ProductImage = ({ src, alt, className, iconSize = "md", primaryColorHex }: ProductImageProps) => {
  const [failed, setFailed] = useState(false);
  
  // Only show images from our own hosted storage
  const imageUrl = src && isHostedUrl(src) ? src : null;
  const showImage = imageUrl && !failed;

  const iconSizes = { sm: "w-6 h-6", md: "w-10 h-10", lg: "w-16 h-16" };
  const Icon = getCategoryIcon(alt);
  const gradient = getCategoryGradient(alt, primaryColorHex);

  if (!showImage) {
    // Build inline style for color-based gradient when we have a hex
    const inlineStyle: React.CSSProperties = primaryColorHex
      ? {
          background: `linear-gradient(135deg, ${primaryColorHex}22 0%, ${primaryColorHex}11 50%, ${primaryColorHex}08 100%)`,
        }
      : {};

    return (
      <div
        className={cn(
          `flex flex-col items-center justify-center gap-1.5 relative`,
          !primaryColorHex && `bg-gradient-to-br ${gradient}`,
          className
        )}
        style={inlineStyle}
      >
        <Icon
          className={cn("text-muted-foreground/40", iconSizes[iconSize])}
          style={primaryColorHex ? { color: `${primaryColorHex}66` } : undefined}
        />
        <span className="text-[10px] text-muted-foreground/60 truncate max-w-[80%] text-center leading-tight">
          {alt}
        </span>
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

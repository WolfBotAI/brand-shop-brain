import { useState } from "react";
import { Shirt } from "lucide-react";
import { getProxiedImageUrl, getPlaceholderImage } from "@/lib/api/ssProducts";
import { cn } from "@/lib/utils";

interface ProductImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  iconSize?: "sm" | "md" | "lg";
}

export const ProductImage = ({ src, alt, className, iconSize = "md" }: ProductImageProps) => {
  const [failed, setFailed] = useState(false);
  const proxiedUrl = getProxiedImageUrl(src);
  const showImage = proxiedUrl && !failed;

  const iconSizes = { sm: "w-6 h-6", md: "w-10 h-10", lg: "w-16 h-16" };

  if (!showImage) {
    return (
      <div className={cn("bg-gradient-to-br from-muted to-muted/60 flex flex-col items-center justify-center gap-1", className)}>
        <Shirt className={cn("text-muted-foreground/40", iconSizes[iconSize])} />
        <span className="text-[10px] text-muted-foreground/50 truncate max-w-[80%] text-center">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={proxiedUrl}
      alt={alt}
      className={cn("object-cover", className)}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
};

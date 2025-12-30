import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProductImageFallbackProps {
  src: string;
  alt: string;
  className?: string;
}

export function ProductImageFallback({ src, alt, className }: ProductImageFallbackProps) {
  const [error, setError] = useState(false);
  const hasImage = Boolean(src && src.trim() !== "" && src.startsWith("http"));
  const showFallback = !hasImage || error;

  if (showFallback) {
    return (
      <div
        className={cn(
          "flex items-center justify-center",
          className
        )}
        style={{
          backgroundColor: '#f6f7f8',
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'><g fill='none' stroke='%23cfd4da' stroke-width='2' opacity='.45'><circle cx='16' cy='16' r='6'/><rect x='60' y='12' width='20' height='10' rx='3'/><path d='M12 68h28c0 10-6 16-14 16s-14-6-14-16z'/><path d='M64 60c10 0 18 8 18 18H46c0-10 8-18 18-18z'/></g></svg>")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '60px 60px',
        }}
        aria-label={alt}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={cn("object-cover", className)}
      loading="lazy"
      onError={() => setError(true)}
    />
  );
}

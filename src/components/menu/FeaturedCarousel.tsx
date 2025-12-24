import { useRef, useState } from "react";
import { MenuItem, menuCategories } from "@/data/menuData";
import { cn } from "@/lib/utils";
import { ProductImage } from "./ProductImage";

interface FeaturedCarouselProps {
  onItemClick: (item: MenuItem) => void;
}

// Get featured items (those with featured=true, or fallback to first 8 items)
function getFeaturedItems(): MenuItem[] {
  const allItems = menuCategories.flatMap((cat) => cat.items);
  const featured = allItems.filter((item) => item.featured);
  
  if (featured.length > 0) {
    return featured
      .sort((a, b) => (a.featuredOrder ?? 999) - (b.featuredOrder ?? 999))
      .slice(0, 8);
  }
  
  // Fallback: return first 8 items from different categories
  return allItems.slice(0, 8);
}

export function FeaturedCarousel({ onItemClick }: FeaturedCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [imageLoaded, setImageLoaded] = useState<Record<string, boolean>>({});
  const featuredItems = getFeaturedItems();

  if (featuredItems.length === 0) return null;

  return (
    <section className="py-4 mb-6 lg:mb-8">
      <div className="container">
        <h2 className="text-lg font-bold text-card-foreground mb-3">
          I più amati
        </h2>
      </div>
      
      <div
        ref={scrollRef}
        className={cn(
          "flex gap-2.5 sm:gap-3 overflow-x-auto overflow-y-visible scrollbar-hide",
          "snap-x snap-mandatory",
          "pl-4 pr-6 lg:pl-[max(1rem,calc((100vw-1280px)/2+1rem))] lg:pr-[max(1.5rem,calc((100vw-1280px)/2+1.5rem))]"
        )}
        style={{ scrollPaddingLeft: "1rem", scrollPaddingRight: "1rem" }}
      >
        {featuredItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onItemClick(item)}
            className={cn(
              "flex flex-col flex-shrink-0 snap-start",
              // Mobile: 3 cards visible
              "w-[calc(33.333vw-16px)] min-w-[100px] max-w-[120px]",
              // Tablet: 4 cards
              "sm:w-[calc(25vw-16px)] sm:min-w-[120px] sm:max-w-[160px]",
              // Desktop: larger cards
              "lg:w-[160px] lg:min-w-[160px] lg:max-w-[180px]",
              "bg-card rounded-xl overflow-hidden",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
              "text-left"
            )}
          >
            {/* Image - full bleed, no gaps */}
            <ProductImage
              src={item.image}
              alt={item.name}
              className="w-full aspect-square"
            />
            
            {/* Info - only title and price, no badges */}
            <div className="p-2 sm:p-2.5">
              <h3 className="font-semibold text-card-foreground text-xs sm:text-sm line-clamp-2 mb-0.5 sm:mb-1">
                {item.name}
              </h3>
              <p className="font-semibold text-card-foreground text-xs sm:text-sm">
                {item.price.toFixed(2)} €
              </p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

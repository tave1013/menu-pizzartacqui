import { useState, useRef, useEffect } from "react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { MenuItem } from "@/data/menuData";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useOptionalOpenState } from "@/hooks/useOptionalOpenState";
import { useCart } from "@/contexts/CartContext";
import { useReadOnlyMode } from "@/contexts/ReadOnlyModeContext";
import { cn } from "@/lib/utils";
import { DietaryBadges } from "./DietaryBadge";
import { ProductImage } from "./ProductImage";

interface MenuItemCardProps {
  item: MenuItem;
  index: number;
  onItemClick: (item: MenuItem) => void;
}

export function MenuItemCard({ item, index, onItemClick }: MenuItemCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const { items } = useCart();
  const { readOnlyMode } = useReadOnlyMode();

  const openState = useOptionalOpenState();
  const isRestaurantOpen = openState?.isOpen ?? true;

  const quantityInCart = items
    .filter((cartItem) => cartItem.productId === item.id)
    .reduce((sum, cartItem) => sum + cartItem.quantity, 0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "50px" },
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.26,
        delay: prefersReduced ? 0 : (index % 3) * 0.06,
        ease: [0.22, 0.61, 0.36, 1] as const,
      },
    },
  };

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      initial={prefersReduced ? "visible" : "hidden"}
      animate={isVisible ? "visible" : "hidden"}
      className="group h-full"
    >
      <button
        onClick={() => onItemClick(item)}
        className={cn(
          "w-full text-left flex h-full",
          // Mobile: immagine a destra (order-2)
          "flex-row items-center py-4 border-b border-border/50",
          // Desktop: immagine sopra (order-1)
          "lg:flex-col lg:items-stretch lg:py-0 lg:border-b-0 lg:bg-card lg:rounded-[20px] lg:overflow-hidden lg:shadow-sm lg:hover:shadow-md transition-all lg:min-h-[380px]",
        )}
      >
        {/* TESTO: Sinistra su mobile (order-1), Sotto su desktop (order-2) */}
        <div className="flex-1 pr-4 lg:pr-0 order-1 lg:order-2 lg:p-4 lg:flex lg:flex-col lg:flex-grow">
          <h3 className="font-bold text-card-foreground mb-1 line-clamp-1 text-[15px] lg:text-[16px]">{item.name}</h3>

          <p className="text-[13px] lg:text-[13px] text-muted-foreground line-clamp-2 mb-3 lg:min-h-[2rem]">
            {item.desc}
          </p>

          <div className="mt-auto">
            <p className="font-bold text-card-foreground text-[14px] lg:text-[15px] mb-2">{item.price.toFixed(2)} €</p>
            <div className="min-h-[20px]">
              <DietaryBadges
                tags={item.dietaryTags}
                isHalal={item.isHalal}
                isLactoseFree={item.isLactoseFree}
                size="sm"
              />
            </div>
          </div>
        </div>

        {/* IMMAGINE: Destra su mobile (order-2), Sopra su desktop (order-1) */}
        <div className="flex-shrink-0 relative w-[90px] h-[90px] lg:w-full lg:h-[200px] order-2 lg:order-1 overflow-hidden">
          <ProductImage
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-500 lg:group-hover:scale-105"
          />

          {(readOnlyMode || isRestaurantOpen) && (
            <div
              className={cn(
                "absolute bottom-2 right-2 flex items-center justify-center rounded-full shadow-md",
                "w-7 h-7 lg:w-9 lg:h-9",
                quantityInCart > 0 ? "bg-primary text-primary-foreground" : "bg-white/90 backdrop-blur-sm text-primary",
              )}
            >
              {quantityInCart > 0 ? (
                <span className="text-xs font-bold">{quantityInCart}</span>
              ) : (
                <Plus className="w-4 h-4 lg:w-5 lg:h-5" strokeWidth={3} />
              )}
            </div>
          )}
        </div>
      </button>
    </motion.div>
  );
}

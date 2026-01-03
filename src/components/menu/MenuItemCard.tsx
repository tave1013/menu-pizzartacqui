import { useState, useRef, useEffect } from "react";
import { Plus, Minus, Trash2 } from "lucide-react";
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
  const { items, removeItem, updateQuantity } = useCart();
  const { readOnlyMode } = useReadOnlyMode();

  const openState = useOptionalOpenState();
  const isRestaurantOpen = openState?.isOpen ?? true;

  // Check product availability (default: true if not specified)
  const isAvailable = item.isAvailable !== false;

  // Get all cart items for this product
  const cartItemsForProduct = items.filter((cartItem) => cartItem.productId === item.id);
  const quantityInCart = cartItemsForProduct.reduce((sum, cartItem) => sum + cartItem.quantity, 0);

  // Handle minus click - decrease quantity or remove
  const handleMinus = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cartItemsForProduct.length > 0) {
      const lastItem = cartItemsForProduct[cartItemsForProduct.length - 1];
      if (lastItem.quantity > 1) {
        updateQuantity(lastItem.id, lastItem.quantity - 1);
      } else {
        removeItem(lastItem.id);
      }
    }
  };

  // Handle plus click - open modal to add/customize
  const handlePlus = (e: React.MouseEvent) => {
    e.stopPropagation();
    onItemClick(item);
  };

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
          // Stile "esaurito": grigio e opacità ridotta
          !isAvailable && "grayscale opacity-60 cursor-default"
        )}
      >
        {/* TESTO: Sinistra su mobile (order-1), Sotto su desktop (order-2) */}
        <div className="flex-1 pr-4 lg:pr-0 order-1 lg:order-2 lg:p-4 lg:flex lg:flex-col lg:flex-grow">
          <h3 className="font-bold text-card-foreground mb-1 line-clamp-1 text-[16px] lg:text-[16px]">{item.name}</h3>

          {!isAvailable ? (
            <p className="text-[14px] lg:text-[13px] text-orange-600 dark:text-orange-400 font-medium line-clamp-2 mb-3 lg:min-h-[2rem]">
              Prodotto esaurito
            </p>
          ) : (
            <p className="text-[14px] lg:text-[13px] text-muted-foreground line-clamp-2 mb-3 lg:min-h-[2rem]">
              {item.desc}
            </p>
          )}

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

          {/* Pulsante + sempre visibile (in read-only apre solo dettaglio) */}
          {/* Nascondi pulsante se prodotto non disponibile */}
          {isAvailable && (isRestaurantOpen || readOnlyMode) && (
            quantityInCart > 0 && !readOnlyMode ? (
              // Show - / quantity / + controls when item is in cart
              <div
                className={cn(
                  "absolute bottom-2 right-2 flex items-center gap-1 rounded-full shadow-md bg-white/95 backdrop-blur-sm",
                  "h-7 lg:h-9 px-1"
                )}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Minus/Trash button */}
                <button
                  onClick={handleMinus}
                  className="flex items-center justify-center w-6 h-6 lg:w-7 lg:h-7 rounded-full text-primary hover:bg-primary/10 transition-colors"
                  aria-label={quantityInCart === 1 ? "Rimuovi dal carrello" : "Diminuisci quantità"}
                >
                  {quantityInCart === 1 ? (
                    <Trash2 className="w-3.5 h-3.5 lg:w-4 lg:h-4" strokeWidth={2.5} />
                  ) : (
                    <Minus className="w-3.5 h-3.5 lg:w-4 lg:h-4" strokeWidth={3} />
                  )}
                </button>
                
                {/* Quantity */}
                <span className="text-xs lg:text-sm font-bold text-primary min-w-[16px] text-center">
                  {quantityInCart}
                </span>
                
                {/* Plus button */}
                <button
                  onClick={handlePlus}
                  className="flex items-center justify-center w-6 h-6 lg:w-7 lg:h-7 rounded-full text-primary hover:bg-primary/10 transition-colors"
                  aria-label="Aggiungi al carrello"
                >
                  <Plus className="w-3.5 h-3.5 lg:w-4 lg:h-4" strokeWidth={3} />
                </button>
              </div>
            ) : (
              // Show + button when item is not in cart
              <div
                className={cn(
                  "absolute bottom-2 right-2 flex items-center justify-center rounded-full shadow-md",
                  "w-7 h-7 lg:w-9 lg:h-9",
                  "bg-white/90 backdrop-blur-sm text-primary",
                )}
              >
                <Plus className="w-4 h-4 lg:w-5 lg:h-5" strokeWidth={3} />
              </div>
            )
          )}
        </div>
      </button>
    </motion.div>
  );
}

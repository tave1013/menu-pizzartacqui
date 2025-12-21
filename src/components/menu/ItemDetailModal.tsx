import { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, Minus, Plus } from "lucide-react";
import { MenuItem } from "@/data/menuData";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useOptionalOpenState } from "@/hooks/useOptionalOpenState";
import { useCart, CartItem } from "@/contexts/CartContext";
import { useReadOnlyMode } from "@/contexts/ReadOnlyModeContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { DietaryBadges } from "./DietaryBadge";

// Check if image URL is valid
function hasValidImage(imageUrl: string | undefined): boolean {
  if (!imageUrl || imageUrl.trim() === "") return false;
  return true;
}

// Product Cover Component with fallback pattern
function ProductCover({ imageUrl, name }: { imageUrl: string; name: string }) {
  const [imgError, setImgError] = useState(false);
  const showImage = hasValidImage(imageUrl) && !imgError;

  return (
    <div 
      className={cn(
        "relative w-full",
        "h-[clamp(180px,32vh,260px)]",
        "overflow-hidden",
        !showImage && "product-cover-fallback"
      )}
      style={!showImage ? {
        backgroundColor: '#f6f7f8',
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'><g fill='none' stroke='%23cfd4da' stroke-width='2' opacity='.45'><circle cx='16' cy='16' r='6'/><rect x='60' y='12' width='20' height='10' rx='3'/><path d='M12 68h28c0 10-6 16-14 16s-14-6-14-16z'/><path d='M64 60c10 0 18 8 18 18H46c0-10 8-18 18-18z'/></g></svg>")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '120px 120px'
      } : undefined}
    >
      {showImage && (
        <img
          src={imageUrl}
          alt={name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      )}
    </div>
  );
}


interface ItemDetailModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  editingCartItem?: CartItem | null;
}

// Parse ingredients from description
function parseIngredients(desc: string): string[] {
  // Split by comma and clean up
  return desc
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && s.length < 50); // Filter out very long parts
}

export function ItemDetailModal({ item, isOpen, onClose, editingCartItem }: ItemDetailModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const prefersReduced = useReducedMotion();
  const { addItem, updateQuantity, removeItem } = useCart();
  const { readOnlyMode } = useReadOnlyMode();
  const { toast } = useToast();
  
  // Get restaurant open state (optional in read-only routes)
  const openState = useOptionalOpenState();
  const isRestaurantOpen = openState?.isOpen ?? true;
  const openInfoModal = openState?.openInfoModal ?? (() => {});
  
  const [quantity, setQuantity] = useState(1);
  const [removedIngredients, setRemovedIngredients] = useState<Set<string>>(new Set());

  const ingredients = useMemo(() => {
    if (!item) return [];
    return parseIngredients(item.desc);
  }, [item]);

  const isEditing = !!editingCartItem;

  // Reset state when modal opens with new item or editing item
  useEffect(() => {
    if (isOpen && item) {
      if (editingCartItem) {
        setQuantity(editingCartItem.quantity);
        setRemovedIngredients(new Set(editingCartItem.removedIngredients));
      } else {
        setQuantity(1);
        setRemovedIngredients(new Set());
      }
    }
  }, [isOpen, item?.id, editingCartItem]);

  // Focus trap and escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!item) return null;

  const totalPrice = item.price * quantity;

  const formatPrice = (price: number) => {
    return price.toFixed(2).replace(".", ",") + " €";
  };

  const handleToggleIngredient = (ingredient: string) => {
    setRemovedIngredients((prev) => {
      const next = new Set(prev);
      if (next.has(ingredient)) {
        next.delete(ingredient);
      } else {
        next.add(ingredient);
      }
      return next;
    });
  };

  const handleAddToCart = () => {
    if (isEditing && editingCartItem) {
      // Remove old item and add updated one
      removeItem(editingCartItem.id);
      addItem(item, quantity, Array.from(removedIngredients));
      toast({
        title: "Ordine aggiornato",
      });
    } else {
      addItem(item, quantity, Array.from(removedIngredients));
      toast({
        title: "Aggiunto all'ordine",
      });
    }
    onClose();
  };

  // Determine if ordering controls should be shown
  const showOrderingControls = !readOnlyMode;

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.98, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Backdrop */}
          <motion.div
            variants={prefersReduced ? undefined : backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.18 }}
            className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            variants={prefersReduced ? undefined : modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2, ease: [0.22, 0.61, 0.36, 1] }}
            className={cn(
              "relative w-full sm:max-w-[720px] lg:max-w-[840px]",
              "max-h-[90vh] sm:max-h-[85vh]",
              "bg-card rounded-t-2xl sm:rounded-2xl shadow-modal",
              "flex flex-col overflow-hidden"
            )}
          >
            {/* Close Button */}
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className={cn(
                "absolute top-4 left-4 z-10",
                "w-10 h-10 rounded-full bg-card/90 backdrop-blur-sm",
                "flex items-center justify-center",
                "text-card-foreground hover:bg-secondary",
                "transition-colors duration-160",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              )}
              aria-label="Chiudi"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content */}
            <div className={cn("overflow-y-auto flex-1", showOrderingControls && (isRestaurantOpen ? "pb-40" : "pb-28"))}>
              {/* Image / Fallback Cover */}
              <ProductCover imageUrl={item.image} name={item.name} />

              {/* Details */}
              <div className="p-5 sm:p-6 lg:p-8 space-y-6">
                {/* Title and Description */}
                <div>
                  <h2 id="modal-title" className="text-2xl sm:text-3xl font-bold text-card-foreground mb-2">
                    {item.name}
                  </h2>
                  <p className="text-muted-foreground mb-3">
                    {item.desc}
                  </p>
                  <DietaryBadges tags={item.dietaryTags} isHalal={item.isHalal} isLactoseFree={item.isLactoseFree} size="md" className="mb-3" />
                </div>

                {/* Contact Box */}
                <div className="bg-secondary/50 rounded-xl p-4">
                  <p className="text-sm text-muted-foreground mb-3">
                    Hai delle domande su allergeni, ingredienti o metodi di preparazione?{" "}
                    <a
                      href={`tel:${item.contact.tel}`}
                      className="text-link font-medium hover:underline"
                    >
                      Contatta il ristorante.
                    </a>
                  </p>
                </div>

                {/* Remove Ingredients Section - only in order mode when open */}
                {showOrderingControls && isRestaurantOpen && ingredients.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-card-foreground mb-4">
                      Rimuovi Ingredienti da {item.name}
                    </h3>
                    <div className="border-t border-border">
                      {ingredients.map((ingredient) => {
                        const isRemoved = removedIngredients.has(ingredient);
                        const inputId = `ingredient-${ingredient.replace(/\s+/g, '-').toLowerCase()}`;
                        return (
                          <label
                            key={ingredient}
                            htmlFor={inputId}
                            className={cn(
                              "flex items-center justify-between",
                              "py-4 px-2 -mx-2 border-b border-border",
                              "cursor-pointer select-none",
                              "min-h-[56px]",
                              "rounded-lg transition-colors duration-160",
                              "hover:bg-secondary/50 active:bg-secondary/70",
                              isRemoved && "bg-secondary/30"
                            )}
                          >
                            <span className="text-card-foreground flex-1">
                              No {ingredient}
                            </span>
                            <input
                              type="checkbox"
                              id={inputId}
                              checked={isRemoved}
                              onChange={() => handleToggleIngredient(ingredient)}
                              className="sr-only"
                              aria-label={`Rimuovi ${ingredient}`}
                            />
                            <div
                              className={cn(
                                "w-6 h-6 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0",
                                isRemoved
                                  ? "bg-primary border-primary"
                                  : "border-border"
                              )}
                              aria-hidden="true"
                            >
                              {isRemoved && (
                                <svg className="w-4 h-4 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}


                {/* Allergens */}
                {item.allergens && item.allergens.length > 0 && (
                  <div className="bg-secondary/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-muted-foreground" />
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                        Allergeni
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {item.allergens.map((allergen) => (
                        <span
                          key={allergen}
                          className="px-3 py-1 text-sm bg-card rounded-full text-card-foreground"
                        >
                          {allergen}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Fixed Bottom - Quantity & Add to Cart - only in order mode when open */}
            {showOrderingControls && isRestaurantOpen && (
              <div
                className={cn(
                  "absolute bottom-0 left-0 right-0",
                  "bg-card border-t border-border",
                  "p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]",
                  "space-y-2.5"
                )}
              >
                {/* Quantity selector */}
                <div className="flex items-center justify-center gap-5">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className={cn(
                      "w-9 h-9 rounded-full",
                      "flex items-center justify-center",
                      "border border-border",
                      "text-card-foreground",
                      "transition-all duration-160",
                      quantity <= 1
                        ? "opacity-30 cursor-not-allowed"
                        : "hover:bg-secondary active:scale-95"
                    )}
                    aria-label="Riduci quantità"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  
                  <span className="text-lg font-bold text-card-foreground w-6 text-center">
                    {quantity}
                  </span>
                  
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className={cn(
                      "w-9 h-9 rounded-full",
                      "flex items-center justify-center",
                      "bg-primary text-primary-foreground",
                      "transition-all duration-160",
                      "hover:bg-primary/90 active:scale-95"
                    )}
                    aria-label="Aumenta quantità"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to cart button */}
                <button
                  onClick={handleAddToCart}
                  className={cn(
                    "w-full py-3 rounded-xl",
                    "bg-primary text-primary-foreground",
                    "text-sm font-semibold",
                    "transition-all duration-160",
                    "hover:bg-primary/90 active:scale-[0.99]",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  )}
                >
                  {isEditing 
                    ? `Aggiorna per ${formatPrice(totalPrice)}` 
                    : `Aggiungi per ${formatPrice(totalPrice)}`
                  }
                </button>
              </div>
            )}

            {/* Fixed Bottom - Closed message - only in order mode when closed */}
            {showOrderingControls && !isRestaurantOpen && (
              <div
                className={cn(
                  "absolute bottom-0 left-0 right-0",
                  "bg-card border-t border-border",
                  "p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]",
                  "text-center"
                )}
              >
                <p className="text-muted-foreground text-sm mb-2">
                  Siamo chiusi in questo momento. Torna durante l'orario di apertura per ordinare.
                </p>
                <button
                  onClick={openInfoModal}
                  className="text-link text-sm font-medium hover:underline"
                >
                  Vedi orari
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

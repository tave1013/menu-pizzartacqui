import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useCart, CartItem } from "@/contexts/CartContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";
import { ProductImage } from "./ProductImage";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartModal({ isOpen, onClose }: CartModalProps) {
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart } = useCart();
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const prefersReduced = useReducedMotion();
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);

  const formatPrice = (price: number) => {
    return price.toFixed(2).replace(".", ",") + " €";
  };

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

  const handleQuantityChange = (item: CartItem, delta: number) => {
    const newQty = item.quantity + delta;
    if (newQty <= 0) {
      setItemToRemove(item.id);
    } else {
      updateQuantity(item.id, newQty);
    }
  };

  const confirmRemove = () => {
    if (itemToRemove) {
      removeItem(itemToRemove);
      setItemToRemove(null);
    }
  };

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
          aria-labelledby="cart-modal-title"
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
              "relative w-full sm:max-w-[520px]",
              "max-h-[85vh]",
              "bg-card rounded-t-2xl sm:rounded-2xl shadow-modal",
              "flex flex-col overflow-hidden"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 id="cart-modal-title" className="text-xl font-bold text-card-foreground">
                Il tuo ordine ({totalItems})
              </h2>
              <button
                ref={closeButtonRef}
                onClick={onClose}
                className={cn(
                  "w-10 h-10 rounded-full",
                  "flex items-center justify-center",
                  "text-muted-foreground hover:bg-secondary",
                  "transition-colors duration-160",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                )}
                aria-label="Chiudi"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Il carrello è vuoto</p>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 p-3 bg-secondary/30 rounded-xl"
                  >
                    {/* Image - full bleed */}
                    <div className="w-16 h-16 rounded-lg flex-shrink-0 overflow-hidden">
                      <ProductImage
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-card-foreground truncate">
                        {item.name}
                      </h3>
                      {item.removedIngredients.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.removedIngredients.map((i) => `No ${i}`).join(" • ")}
                        </p>
                      )}
                      <p className="text-sm font-medium text-primary mt-1">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleQuantityChange(item, -1)}
                        className={cn(
                          "w-7 h-7 rounded-full",
                          "flex items-center justify-center",
                          "border border-border",
                          "text-card-foreground hover:bg-secondary",
                          "transition-colors duration-160"
                        )}
                        aria-label="Riduci quantità"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-5 text-center text-sm font-medium text-card-foreground">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item, 1)}
                        className={cn(
                          "w-7 h-7 rounded-full",
                          "flex items-center justify-center",
                          "bg-primary text-primary-foreground",
                          "hover:bg-primary/90",
                          "transition-colors duration-160"
                        )}
                        aria-label="Aumenta quantità"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold text-card-foreground">Totale</span>
                  <span className="text-lg font-bold text-primary">{formatPrice(totalPrice)}</span>
                </div>
                <p className="text-center text-xs text-muted-foreground">
                  Menu di consultazione – nessun acquisto online
                </p>
              </div>
            )}
          </motion.div>

          {/* Remove confirmation dialog */}
          <AnimatePresence>
            {itemToRemove && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-10 flex items-center justify-center bg-foreground/40"
                onClick={() => setItemToRemove(null)}
              >
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.95 }}
                  className="bg-card rounded-xl p-5 shadow-lg mx-4 max-w-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                      <Trash2 className="w-5 h-5 text-destructive" />
                    </div>
                    <h3 className="text-lg font-semibold text-card-foreground">
                      Rimuovere dal carrello?
                    </h3>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setItemToRemove(null)}
                      className={cn(
                        "flex-1 py-2.5 rounded-lg",
                        "border border-border",
                        "font-medium text-card-foreground",
                        "hover:bg-secondary transition-colors"
                      )}
                    >
                      Annulla
                    </button>
                    <button
                      onClick={confirmRemove}
                      className={cn(
                        "flex-1 py-2.5 rounded-lg",
                        "bg-destructive text-destructive-foreground",
                        "font-medium",
                        "hover:bg-destructive/90 transition-colors"
                      )}
                    >
                      Rimuovi
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  );
}

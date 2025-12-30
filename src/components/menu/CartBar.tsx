import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { useOpenState } from "@/contexts/OpenStateContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface CartBarProps {
  onViewCart: () => void;
}

export function CartBar({ onViewCart }: CartBarProps) {
  const { totalItems, totalPrice } = useCart();
  const { isOpen: isRestaurantOpen } = useOpenState();
  const prefersReduced = useReducedMotion();

  const formatPrice = (price: number) => {
    return price.toFixed(2).replace(".", ",") + " €";
  };

  // Hide cart bar when restaurant is closed
  if (!isRestaurantOpen) return null;

  return (
    <AnimatePresence>
      {totalItems > 0 && (
        <motion.div
          initial={prefersReduced ? undefined : { y: 100, opacity: 0 }}
          animate={prefersReduced ? undefined : { y: 0, opacity: 1 }}
          exit={prefersReduced ? undefined : { y: 100, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 0.61, 0.36, 1] }}
          className={cn(
            "fixed bottom-0 left-0 right-0 z-40",
            "pb-[env(safe-area-inset-bottom)]"
          )}
        >
          <div className="px-4 pb-3">
            <button
              onClick={onViewCart}
              className={cn(
                "w-full flex items-center justify-between",
                "px-3 py-2.5 rounded-xl",
                "bg-primary text-primary-foreground",
                "shadow-lg",
                "transition-transform duration-160 active:scale-[0.99]",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              )}
              aria-label={`Vedi carrello con ${totalItems} articoli per ${formatPrice(totalPrice)}`}
            >
              <span
                className={cn(
                  "flex items-center justify-center",
                  "w-6 h-6 rounded-md",
                  "bg-primary-foreground/20 text-primary-foreground",
                  "text-xs font-bold"
                )}
              >
                {totalItems}
              </span>

              <span className="text-sm font-semibold">
                Vedi carrello
              </span>

              <span className="text-sm font-bold">
                {formatPrice(totalPrice)}
              </span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

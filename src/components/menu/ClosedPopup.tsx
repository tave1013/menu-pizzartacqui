import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, X } from "lucide-react";
import { useOpenState } from "@/contexts/OpenStateContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function ClosedPopup() {
  const { showClosedPopup, dismissClosedPopup, openInfoModal, nextOpenTimeFormatted } = useOpenState();
  const prefersReduced = useReducedMotion();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!showClosedPopup) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismissClosedPopup();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [showClosedPopup, dismissClosedPopup]);

  const getTimeText = () => {
    if (!nextOpenTimeFormatted) return "alla prossima apertura";
    if (nextOpenTimeFormatted.day) {
      return `${nextOpenTimeFormatted.day} alle ${nextOpenTimeFormatted.time}`;
    }
    return `alle ${nextOpenTimeFormatted.time}`;
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 },
  };

  return (
    <AnimatePresence>
      {showClosedPopup && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="closed-popup-title"
          aria-describedby="closed-popup-description"
        >
          {/* Backdrop */}
          <motion.div
            variants={prefersReduced ? undefined : backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.18 }}
            className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
            onClick={dismissClosedPopup}
          />

          {/* Modal */}
          <motion.div
            variants={prefersReduced ? undefined : modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2, ease: [0.22, 0.61, 0.36, 1] }}
            className={cn(
              "relative w-full max-w-md",
              "bg-card rounded-2xl shadow-modal",
              "p-6 text-center"
            )}
          >
            {/* Close button */}
            <button
              ref={closeButtonRef}
              onClick={dismissClosedPopup}
              className={cn(
                "absolute top-4 right-4",
                "w-8 h-8 rounded-full",
                "flex items-center justify-center",
                "text-muted-foreground hover:text-card-foreground hover:bg-secondary",
                "transition-colors duration-160",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              )}
              aria-label="Chiudi"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Clock className="w-8 h-8 text-amber-600 dark:text-amber-400" />
              </div>
            </div>

            {/* Content */}
            <h2 
              id="closed-popup-title" 
              className="text-xl font-bold text-card-foreground mb-2"
            >
              Ordini non disponibili
            </h2>
            <p 
              id="closed-popup-description"
              className="text-muted-foreground mb-6"
            >
              Il locale è attualmente chiuso. Potrai ordinare a partire dalle {nextOpenTimeFormatted?.time || "prossima apertura"}.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={openInfoModal}
                className="flex-1"
              >
                Vedi orari
              </Button>
              <Button
                onClick={dismissClosedPopup}
                className="flex-1"
              >
                Ok
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

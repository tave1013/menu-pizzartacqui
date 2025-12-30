import { Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useOpenState } from "@/contexts/OpenStateContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

export function ClosedBanner() {
  const { isOpen, nextOpenTimeFormatted, minutesUntilOpen } = useOpenState();
  const prefersReduced = useReducedMotion();

  if (isOpen) return null;

  const showCountdown = minutesUntilOpen > 0 && minutesUntilOpen <= 15;

  const getSubtitle = () => {
    if (!nextOpenTimeFormatted) return "Controlla gli orari per maggiori informazioni.";
    
    if (nextOpenTimeFormatted.day) {
      return `Riapriamo ${nextOpenTimeFormatted.day} alle ${nextOpenTimeFormatted.time}.`;
    }
    return `Riapriamo alle ${nextOpenTimeFormatted.time}.`;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={prefersReduced ? undefined : { opacity: 0, y: -10 }}
        animate={prefersReduced ? undefined : { opacity: 1, y: 0 }}
        exit={prefersReduced ? undefined : { opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-900/50"
      >
        <div className="container py-3">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                Siamo chiusi al momento.
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                {showCountdown ? (
                  <>Si apre tra {minutesUntilOpen} minuti.</>
                ) : (
                  getSubtitle()
                )}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

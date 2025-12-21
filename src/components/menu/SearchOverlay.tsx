import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { ArrowLeft, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { MenuItem, menuCategories } from "@/data/menuData";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { DietaryBadge } from "./DietaryBadge";
import { ProductImage } from "./ProductImage";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onItemClick: (item: MenuItem) => void;
}

function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getAllItems(): MenuItem[] {
  return menuCategories.flatMap((cat) => cat.items);
}

const suggestedCategories = [
  { label: "Burgers", query: "burger" },
  { label: "Birre", query: "birra" },
  { label: "Dolci", query: "dolci" },
  { label: "Contorni", query: "patatine" },
];

export function SearchOverlay({ isOpen, onClose, onItemClick }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const prefersReducedMotion = useReducedMotion();
  
  const allItems = useMemo(() => getAllItems(), []);

  const results = useMemo(() => {
    if (query.length < 2) return [];
    
    const normalizedQuery = normalizeString(query);
    return allItems.filter((item) => {
      const normalizedName = normalizeString(item.name);
      const normalizedDesc = normalizeString(item.desc);
      return normalizedName.includes(normalizedQuery) || normalizedDesc.includes(normalizedQuery);
    });
  }, [query, allItems]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
    if (e.key === "Escape") {
      onClose();
    }
  }, [onClose]);

  const handleClearQuery = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  const handleClose = () => {
    setQuery("");
    onClose();
  };

  const handleSuggestionClick = (suggestionQuery: string) => {
    setQuery(suggestionQuery);
    inputRef.current?.focus();
  };

  const handleItemClick = (item: MenuItem) => {
    onItemClick(item);
    handleClose();
  };

  const overlayVariants = {
    hidden: { x: "100%", opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] bg-background lg:hidden"
          initial={prefersReducedMotion ? { opacity: 0 } : "hidden"}
          animate={prefersReducedMotion ? { opacity: 1 } : "visible"}
          exit={prefersReducedMotion ? { opacity: 0 } : "exit"}
          variants={prefersReducedMotion ? undefined : overlayVariants}
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          style={{ paddingTop: "env(safe-area-inset-top)", paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div className="flex items-center gap-2 h-14 px-2 border-b border-border/50">
            <button
              onClick={handleClose}
              className="flex items-center justify-center w-11 h-11 rounded-full hover:bg-secondary/80 active:bg-secondary transition-colors flex-shrink-0"
              aria-label="Torna al menu"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>

            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Cerca nel menu…"
                className="w-full h-10 pl-9 pr-10 rounded-full bg-secondary/60 border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
              />
              {query.length > 0 && (
                <button
                  onClick={handleClearQuery}
                  className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-7 h-7 rounded-full hover:bg-secondary active:bg-muted transition-colors"
                  aria-label="Cancella ricerca"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4" style={{ height: "calc(100vh - 56px - env(safe-area-inset-top) - env(safe-area-inset-bottom))" }}>
            {query.length < 2 && (
              <div>
                <h2 className="text-sm font-semibold text-muted-foreground mb-3">Suggerimenti</h2>
                <div className="flex flex-wrap gap-2">
                  {suggestedCategories.map((suggestion) => (
                    <button
                      key={suggestion.query}
                      onClick={() => handleSuggestionClick(suggestion.query)}
                      className="px-4 py-2 rounded-full bg-secondary/80 text-sm font-medium text-foreground hover:bg-secondary active:bg-muted transition-colors"
                    >
                      {suggestion.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {query.length >= 2 && results.length > 0 && (
              <div className="flex flex-col divide-y divide-border/40">
                {results.map((item) => (
                  <SearchResultCard
                    key={item.id}
                    item={item}
                    onClick={() => handleItemClick(item)}
                  />
                ))}
              </div>
            )}

            {query.length >= 2 && results.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Search className="w-12 h-12 text-muted-foreground/40 mb-4" />
                <p className="text-muted-foreground">
                  Nessun risultato per «<span className="font-medium text-foreground">{query}</span>»
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface SearchResultCardProps {
  item: MenuItem;
  onClick: () => void;
}

function SearchResultCard({ item, onClick }: SearchResultCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const maxBadges = 3;
  const dietaryTags = item.dietaryTags || [];
  const visibleTags = dietaryTags.slice(0, maxBadges);
  const extraCount = dietaryTags.length - maxBadges;

  return (
    <button
      onClick={onClick}
      className="flex items-start gap-3 py-3 w-full text-left hover:bg-secondary/40 active:bg-secondary/60 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 rounded-lg -mx-2 px-2"
      style={{ minHeight: "96px" }}
    >
      <div className="relative w-[72px] h-[72px] md:w-24 md:h-24 flex-shrink-0 rounded-lg overflow-hidden">
        <ProductImage
          src={item.image}
          alt={item.name}
          className="w-full h-full"
        />
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-between h-[72px] md:h-24">
        <div>
          <h3 className="text-sm font-semibold text-card-foreground line-clamp-2 leading-tight">
            {item.name}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
            {item.desc}
          </p>
        </div>

        <div className="flex items-center justify-between gap-2 mt-auto">
          {dietaryTags.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap">
              {visibleTags.map((tag) => (
                <DietaryBadge key={tag} tag={tag} size="sm" />
              ))}
              {extraCount > 0 && (
                <span className="text-[10px] text-muted-foreground font-medium px-1.5 py-0.5 bg-secondary rounded-md">
                  +{extraCount}
                </span>
              )}
            </div>
          )}
          
          <p className="text-sm font-semibold text-primary whitespace-nowrap ml-auto">
            € {item.price.toFixed(2).replace(".", ",")}
          </p>
        </div>
      </div>
    </button>
  );
}

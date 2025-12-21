import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import { Search, X, ArrowLeft } from "lucide-react";
import { MenuItem, menuCategories } from "@/data/menuData";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ProductImage } from "./ProductImage";

interface DesktopSearchResultsProps {
  isOpen: boolean;
  initialQuery: string;
  onClose: () => void;
  onItemClick: (item: MenuItem) => void;
  onQueryChange: (query: string) => void;
}

// Normalize string for search (remove accents, lowercase)
function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// Get all menu items flattened
function getAllItems(): MenuItem[] {
  return menuCategories.flatMap((cat) => cat.items);
}

// Quick filter tags
const quickFilters = [
  { label: "Burger", query: "burger" },
  { label: "Birre", query: "birra" },
  { label: "Bevande", query: "bevande" },
  { label: "Vegetariano", query: "vegetariano" },
  { label: "Piccante", query: "piccante" },
];

export function DesktopSearchResults({
  isOpen,
  initialQuery,
  onClose,
  onItemClick,
  onQueryChange,
}: DesktopSearchResultsProps) {
  const [query, setQuery] = useState(initialQuery);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const allItems = useMemo(() => getAllItems(), []);

  // Sync with initial query
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Filter results
  const results = useMemo(() => {
    const searchTerms = [query, ...activeFilters].filter(Boolean);
    if (searchTerms.length === 0 || (query.length < 2 && activeFilters.length === 0)) {
      return [];
    }

    return allItems.filter((item) => {
      const normalizedName = normalizeString(item.name);
      const normalizedDesc = normalizeString(item.desc);
      const itemText = normalizedName + " " + normalizedDesc;

      return searchTerms.every((term) => {
        const normalizedTerm = normalizeString(term);
        return itemText.includes(normalizedTerm);
      });
    });
  }, [query, activeFilters, allItems]);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onQueryChange(value);
  };

  const handleClear = useCallback(() => {
    setQuery("");
    onQueryChange("");
    inputRef.current?.focus();
  }, [onQueryChange]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  const toggleFilter = (filterQuery: string) => {
    setActiveFilters((prev) =>
      prev.includes(filterQuery)
        ? prev.filter((f) => f !== filterQuery)
        : [...prev, filterQuery]
    );
  };

  const handleItemClick = (item: MenuItem) => {
    onItemClick(item);
    onClose();
  };

  // Suggested categories when no results
  const suggestedCategories = menuCategories.map((cat) => ({
    label: cat.name,
    query: cat.name.toLowerCase(),
  }));

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] bg-background hidden lg:block"
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {/* Sticky Search Bar */}
          <div className="sticky top-0 bg-background/95 backdrop-blur-md border-b border-border z-10">
            <div className="container py-4">
              <div className="flex items-center gap-4">
                {/* Back Button */}
                <button
                  onClick={onClose}
                  className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-secondary transition-colors"
                  aria-label="Torna al menu"
                >
                  <ArrowLeft className="w-5 h-5 text-foreground" />
                </button>

                {/* Search Input */}
                <div className="relative flex-1 max-w-2xl">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={handleQueryChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Cerca nel menu…"
                    className="w-full h-12 pl-12 pr-12 rounded-full bg-secondary/60 border border-transparent focus:border-primary/40 focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground focus:outline-none transition-all"
                    autoComplete="off"
                  />
                  {query.length > 0 && (
                    <button
                      onClick={handleClear}
                      className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full hover:bg-muted transition-colors"
                      aria-label="Cancella ricerca"
                    >
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Filters */}
              <div className="flex items-center gap-2 mt-4 overflow-x-auto scrollbar-hide pb-1">
                {quickFilters.map((filter) => (
                  <button
                    key={filter.query}
                    onClick={() => toggleFilter(filter.query)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-colors flex-shrink-0",
                      activeFilters.includes(filter.query)
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary/80 text-foreground hover:bg-secondary"
                    )}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="container py-6 overflow-y-auto" style={{ height: "calc(100vh - 140px)" }}>
            {results.length > 0 ? (
              <>
                <p className="text-sm text-muted-foreground mb-4">
                  {results.length} risultat{results.length === 1 ? "o" : "i"} per «
                  <span className="font-medium text-foreground">{query || activeFilters.join(", ")}</span>»
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {results.map((item) => (
                    <ResultCard key={item.id} item={item} onClick={() => handleItemClick(item)} />
                  ))}
                </div>
              </>
            ) : query.length >= 2 || activeFilters.length > 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Search className="w-16 h-16 text-muted-foreground/30 mb-4" />
                <p className="text-lg text-muted-foreground mb-6">
                  Nessun risultato per «
                  <span className="font-medium text-foreground">{query || activeFilters.join(", ")}</span>»
                </p>
                <div>
                  <p className="text-sm text-muted-foreground mb-3">Prova con una di queste categorie:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {suggestedCategories.map((cat) => (
                      <button
                        key={cat.query}
                        onClick={() => {
                          setQuery(cat.query);
                          onQueryChange(cat.query);
                        }}
                        className="px-4 py-2 rounded-full bg-secondary/80 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Search className="w-16 h-16 text-muted-foreground/30 mb-4" />
                <p className="text-lg text-muted-foreground">
                  Inizia a digitare per cercare nel menu
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface ResultCardProps {
  item: MenuItem;
  onClick: () => void;
}

function ResultCard({ item, onClick }: ResultCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <button
      onClick={onClick}
      className="flex flex-col bg-card rounded-xl overflow-hidden text-left"
    >
      {/* Image - full bleed */}
      <ProductImage
        src={item.image}
        alt={item.name}
        className="w-full aspect-[4/3]"
      />

      {/* Content */}
      <div className="p-3">
        <h3 className="text-sm font-semibold text-card-foreground line-clamp-2 mb-1">
          {item.name}
        </h3>
        <p className="text-sm font-semibold text-primary">
          € {item.price.toFixed(2).replace(".", ",")}
        </p>
      </div>
    </button>
  );
}

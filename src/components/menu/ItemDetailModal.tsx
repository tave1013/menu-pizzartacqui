import { useEffect, useRef, useState, useMemo } from "react";
import { ClosedBanner } from "./ClosedBanner";
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
        "relative w-full flex-shrink-0",
        // Mobile: altezza fissa più contenuta per lasciare spazio al contenuto
        "h-[260px] sm:h-[clamp(240px,35vh,320px)]",
        "aspect-video",
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
  categoryId?: string; // Opzionale: per escludere categorie senza ingredienti rimovibili
}

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURAZIONE INGREDIENTI RIMOVIBILI
// ═══════════════════════════════════════════════════════════════════════════
// 
// Per aggiungere nuove categorie da ESCLUDERE (senza rimozione ingredienti):
// Aggiungi l'ID della categoria a questa lista:
//
const CATEGORIE_SENZA_INGREDIENTI = [
  "bevande",    // Coca Cola, Fanta, Acqua, etc.
  "birre",      // Menabrea, Tuborg, etc.
  "vini",       // Nebbiolo, Arneis, etc.
  // Aggiungi qui nuove categorie, es: "dolci", "gelati"
];

// Pattern per escludere descrizioni NON-ingredienti
// (funziona automaticamente, non serve modificare di solito)
const BLACKLIST_PATTERNS = [
  /\d+\s*cl/i,           // 33 cl, 50cl, etc.
  /\d+\s*ml/i,           // 500 ml, etc.
  /\d+\s*l\b/i,          // 1 l, 0,5 l, etc.
  /lattina/i,            // Lattina
  /bottiglia/i,          // Bottiglia
  /bottiglietta/i,       // Bottiglietta
  /bicchiere/i,          // Bicchiere
  /calice/i,             // Calice
  /vino\s*(rosso|bianco|rosè)?/i,  // Vino rosso, Vino bianco
  /spumante/i,           // Spumante
  /piemontese/i,         // Vino piemontese (per vini)
];
// ═══════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════
// INGREDIENTI EXTRA
// ═══════════════════════════════════════════════════════════════════════════
// 
// Per ESCLUDERE categorie dalla sezione Ingredienti Extra:
// Aggiungi l'ID della categoria a questa lista:
//
const EXCLUDED_EXTRA_CATEGORIES = [
  "bevande",              // Coca Cola, Fanta, Acqua, etc.
  "birre",                // Menabrea, Tuborg, etc.
  "birre-artigianali",    // Birre artigianali
  "vini",                 // Nebbiolo, Arneis, etc.
  // Aggiungi qui nuove categorie da escludere, es: "dolci", "gelati"
];

interface ExtraIngredient {
  id: string;
  name: string;
  price: number;
}

const INGREDIENTI_EXTRA: ExtraIngredient[] = [
  // Formaggi
  { id: "bufala", name: "Bufala", price: 2.00 },
  { id: "burrata", name: "Burrata", price: 2.50 },
  { id: "stracciata", name: "Stracciata", price: 2.50 },
  { id: "stracchino", name: "Stracchino", price: 2.00 },
  // Funghi e verdure A
  { id: "funghi-champignon", name: "Funghi champignon", price: 1.40 },
  { id: "gorgonzola", name: "Gorgonzola", price: 1.50 },
  { id: "olive", name: "Olive", price: 1.50 },
  { id: "patatine", name: "Patatine", price: 1.50 },
  // Verdure B
  { id: "rucola", name: "Rucola", price: 0.70 },
  { id: "melanzane", name: "Melanzane", price: 1.50 },
  { id: "peperoni", name: "Peperoni", price: 1.50 },
  { id: "zucchine", name: "Zucchine", price: 1.50 },
  // Verdure C e pesce
  { id: "pomodorini", name: "Pomodorini", price: 1.50 },
  { id: "acciughe", name: "Acciughe", price: 1.50 },
  { id: "porcini", name: "Porcini", price: 3.00 },
  { id: "bresaola", name: "Bresaola", price: 3.00 },
  // Carni
  { id: "prosciutto-cotto", name: "Prosciutto cotto", price: 2.00 },
  { id: "prosciutto-crudo", name: "Prosciutto crudo", price: 3.00 },
  { id: "salsiccia", name: "Salsiccia", price: 2.00 },
  { id: "spianata", name: "Spianata", price: 2.00 },
  { id: "tonno", name: "Tonno", price: 3.00 },
];
// ═══════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════
// IMPASTO SENZA GLUTINE
// ═══════════════════════════════════════════════════════════════════════════
const GLUTEN_FREE_PRICE = 3.00;
const PIZZA_CATEGORIES = ["top-ten", "pizart", "le-classiche", "baby-pizze"]; // Categorie pizze
const EXCLUDED_CATEGORIES = ["le-focacce"]; // Categorie escluse
// ═══════════════════════════════════════════════════════════════════════════

// Parse ingredients from description
function parseIngredients(desc: string): string[] {
  return desc
    .split(",")
    .map((s) => s.trim())
    .filter((s) => {
      // Filtra stringhe vuote o troppo lunghe
      if (s.length === 0 || s.length > 50) return false;
      
      // Filtra se contiene pattern della blacklist
      for (const pattern of BLACKLIST_PATTERNS) {
        if (pattern.test(s)) return false;
      }
      
      return true;
    });
}

export function ItemDetailModal({ item, isOpen, onClose, editingCartItem, categoryId }: ItemDetailModalProps) {
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
  const [selectedExtras, setSelectedExtras] = useState<Set<string>>(new Set());
  const [glutenFreeOption, setGlutenFreeOption] = useState(false);

  // Controlla se la categoria è esclusa dalla rimozione ingredienti
  const categoryHasIngredients = !categoryId || !CATEGORIE_SENZA_INGREDIENTI.includes(categoryId);
  
  // Controlla se la categoria può avere ingredienti extra
  const canHaveExtras = !categoryId || !EXCLUDED_EXTRA_CATEGORIES.includes(categoryId);
  
  // Controlla se l'item può avere l'opzione senza glutine
  const canHaveGlutenFree = 
    categoryId && 
    PIZZA_CATEGORIES.includes(categoryId) && 
    !EXCLUDED_CATEGORIES.includes(categoryId) &&
    !item?.excludeGlutenFree;

  const ingredients = useMemo(() => {
    if (!item || !categoryHasIngredients) return [];
    return parseIngredients(item.desc);
  }, [item, categoryHasIngredients]);

  const isEditing = !!editingCartItem;

  // Reset state when modal opens with new item or editing item
  useEffect(() => {
    if (isOpen && item) {
      if (editingCartItem) {
        setQuantity(editingCartItem.quantity);
        setRemovedIngredients(new Set(editingCartItem.removedIngredients));
        // Ripristina gli extra già selezionati
        if (editingCartItem.selectedExtras && editingCartItem.selectedExtras.length > 0) {
          // Converti i nomi degli extra in ID
          const extraIds = editingCartItem.selectedExtras
            .map(name => INGREDIENTI_EXTRA.find(e => e.name === name)?.id)
            .filter(Boolean) as string[];
          setSelectedExtras(new Set(extraIds));
        } else {
          setSelectedExtras(new Set());
        }
        // Ripristina lo stato senza glutine
        setGlutenFreeOption(editingCartItem.glutenFree || false);
      } else {
        setQuantity(1);
        setRemovedIngredients(new Set());
        setSelectedExtras(new Set());
        setGlutenFreeOption(false);
      }
    }
  }, [isOpen, item, editingCartItem]);

  // Focus trap and escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    // Salva la posizione scroll corrente
    const scrollY = window.scrollY;
    
    document.addEventListener("keydown", handleKeyDown);
    
    // Blocca scroll del body (fix per iOS)
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.overflow = "hidden";
    
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      
      // Ripristina scroll del body
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
      
      // Ripristina posizione scroll
      window.scrollTo(0, scrollY);
    };
  }, [isOpen, onClose]);

  if (!item) return null;

  // Calcola il prezzo totale degli extra selezionati
  const extrasPrice = Array.from(selectedExtras).reduce((sum, extraId) => {
    const extra = INGREDIENTI_EXTRA.find((e) => e.id === extraId);
    return sum + (extra?.price ?? 0);
  }, 0);
  
  // Aggiungi prezzo impasto senza glutine se selezionato
  const glutenFreePrice = glutenFreeOption ? GLUTEN_FREE_PRICE : 0;

  const totalPrice = (item.price + extrasPrice + glutenFreePrice) * quantity;

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

  const handleToggleExtra = (extraId: string) => {
    setSelectedExtras((prev) => {
      const next = new Set(prev);
      if (next.has(extraId)) {
        next.delete(extraId);
      } else {
        next.add(extraId);
      }
      return next;
    });
  };

  const handleAddToCart = () => {
    // Converti gli ID degli extra in nomi per il carrello
    const extraNames = Array.from(selectedExtras).map((id) => {
      const extra = INGREDIENTI_EXTRA.find((e) => e.id === id);
      return extra?.name || id;
    });
    
    // Assicurati che i prezzi siano numeri
    const finalExtrasPrice = Number(extrasPrice) || 0;
    const finalGlutenFreePrice = Number(glutenFreePrice) || 0;
    
    if (isEditing && editingCartItem) {
      // Remove old item and add updated one
      removeItem(editingCartItem.id);
      addItem(item, quantity, Array.from(removedIngredients), extraNames, finalExtrasPrice, glutenFreeOption, finalGlutenFreePrice);
      // Rimosso toast per UX più fluida
    } else {
      addItem(item, quantity, Array.from(removedIngredients), extraNames, finalExtrasPrice, glutenFreeOption, finalGlutenFreePrice);
      // Rimosso toast per UX più fluida
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
              "relative w-full",
              // Sempre fullscreen su mobile, sia menu base che menu locale
              "h-[100dvh] max-h-[100dvh] rounded-t-2xl",
              // Desktop: dimensioni contenute
              "sm:h-auto sm:max-h-[85vh] sm:max-w-[720px] lg:max-w-[840px] sm:rounded-2xl",
              "bg-card shadow-modal",
              "flex flex-col overflow-hidden"
            )}
          >
            {/* Banner chiusura solo se chiuso e in consultazione */}
            {readOnlyMode && !isRestaurantOpen && (
              <ClosedBanner />
            )}
            {/* Close Button - Fixed position on mobile */}
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className={cn(
                "absolute top-3 left-3 z-50",
                "w-9 h-9 sm:w-10 sm:h-10 rounded-full",
                "bg-card/95 backdrop-blur-sm shadow-sm",
                "flex items-center justify-center",
                "text-card-foreground hover:bg-secondary",
                "transition-colors duration-160",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              )}
              aria-label="Chiudi"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Scroll Container - contiene immagine + dettagli */}
            <div className="flex-1 min-h-0 overflow-y-auto" style={{ scrollbarGutter: "stable" }}>
              {/* Image / Fallback Cover - sticky top-0 con z-index basso */}
              <div className="sticky top-0 z-0">
                <ProductCover imageUrl={item.image} name={item.name} />
              </div>

              {/* Details: sfondo solido che copre l'immagine quando scrolla */}
              <div
                className={cn(
                  "relative z-20",
                  "bg-card",
                  "rounded-t-3xl",
                  "-mt-6",
                  "p-5 sm:p-6 lg:p-8 space-y-6"
                )}
              >
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

                {/* Allergens - moved here for better visual hierarchy */}
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
                          className="px-3 py-1 text-sm bg-card rounded-full text-card-foreground capitalize"
                        >
                          {allergen}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Gluten Free Option - visible in both modes when applicable */}
                {isRestaurantOpen && canHaveGlutenFree && (
                  <div className="bg-amber-50 dark:bg-amber-950/20 rounded-xl p-4 border border-amber-200 dark:border-amber-900">
                    <h3 className="text-lg font-bold text-card-foreground mb-2">
                      Intollerante al glutine?
                    </h3>
                    <p className="text-[14px] text-muted-foreground italic mb-4 leading-relaxed">
                      Attenzione: non siamo certificati gluten-free. Pur adottando tutte le accortezze possibili, 
                      in ambiente di lavoro possono verificarsi contaminazioni. Ingredienti e condimenti sono 
                      gli stessi utilizzati per le altre pizze.
                    </p>
                    
                    {readOnlyMode ? (
                      // Menù Consultazione: Solo testo statico informativo
                      <div className="flex items-center justify-between py-3 px-3 rounded-lg border border-border bg-secondary/10">
                        <span className="text-card-foreground flex-1 font-medium">
                          Impasto senza glutine
                        </span>
                        <span className="text-muted-foreground text-sm font-semibold">
                          +{formatPrice(GLUTEN_FREE_PRICE)}
                        </span>
                      </div>
                    ) : (
                      // Menù Asporto: Checkbox interattiva funzionante
                      <label
                        htmlFor="gluten-free-option"
                        className={cn(
                          "flex items-center justify-between",
                          "py-3 px-3 rounded-lg border border-border",
                          "cursor-pointer select-none",
                          "min-h-[56px]",
                          "transition-colors duration-160",
                          "hover:bg-secondary/50 active:bg-secondary/70",
                          glutenFreeOption && "bg-secondary/30"
                        )}
                      >
                        <span className="text-card-foreground flex-1 font-medium">
                          Impasto senza glutine
                        </span>
                        
                        <div className="flex items-center gap-3">
                          <span className="text-muted-foreground text-sm">
                            +{formatPrice(GLUTEN_FREE_PRICE)}
                          </span>
                          <input
                            type="checkbox"
                            id="gluten-free-option"
                            checked={glutenFreeOption}
                            onChange={() => setGlutenFreeOption(!glutenFreeOption)}
                            className="sr-only"
                            aria-label="Aggiungi impasto senza glutine"
                          />
                          <div
                            className={cn(
                              "w-6 h-6 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0",
                              glutenFreeOption
                                ? "bg-primary border-primary"
                                : "border-border"
                            )}
                            aria-hidden="true"
                          >
                            {glutenFreeOption && (
                              <svg className="w-4 h-4 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </div>
                      </label>
                    )}
                  </div>
                )}

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

                {/* Ingredienti Extra Section - only in order mode when open */}
                {showOrderingControls && isRestaurantOpen && canHaveExtras && (
                  <div>
                    <h3 className="text-lg font-bold text-card-foreground mb-4">
                      Ingredienti Extra
                    </h3>
                    <div className="border-t border-border">
                      {INGREDIENTI_EXTRA.map((extra) => {
                        const isSelected = selectedExtras.has(extra.id);
                        const inputId = `extra-${extra.id}`;
                        return (
                          <label
                            key={extra.id}
                            htmlFor={inputId}
                            className={cn(
                              "flex items-center justify-between",
                              "py-4 px-2 -mx-2 border-b border-border",
                              "cursor-pointer select-none",
                              "min-h-[56px]",
                              "rounded-lg transition-colors duration-160",
                              "hover:bg-secondary/50 active:bg-secondary/70",
                              isSelected && "bg-secondary/30"
                            )}
                          >
                            <span className="text-card-foreground flex-1">
                              {extra.name}
                            </span>
                            
                            {/* Blocco Prezzo + Checkbox a destra */}
                            <div className="flex items-center gap-3">
                              <span className="text-muted-foreground text-sm">
                                +{formatPrice(extra.price)}
                              </span>
                              <input
                                type="checkbox"
                                id={inputId}
                                checked={isSelected}
                                onChange={() => handleToggleExtra(extra.id)}
                                className="sr-only"
                                aria-label={`Aggiungi ${extra.name}`}
                              />
                              <div
                                className={cn(
                                  "w-6 h-6 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0",
                                  isSelected
                                    ? "bg-primary border-primary"
                                    : "border-border"
                                )}
                                aria-hidden="true"
                              >
                                {isSelected && (
                                  <svg className="w-4 h-4 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Box - at the very bottom before action buttons */}
            <div className="bg-secondary/50 border-t border-border p-4 sm:p-6">
              <p className="text-sm text-muted-foreground">
                Hai delle domande su allergeni, ingredienti o metodi di preparazione?{" "}
                <a
                  href={`tel:${item.contact.tel}`}
                  className="text-link font-medium hover:underline"
                >
                  Contatta il ristorante.
                </a>
              </p>
            </div>

            {/* Fixed Bottom - Quantity & Add to Cart - only in order mode when open */}
            {showOrderingControls && isRestaurantOpen && (
              <div
                className={cn(
                  "flex-shrink-0",
                  "bg-card border-t border-border",
                  "p-4 pt-4 sm:p-6 lg:p-8 pb-[calc(1rem+env(safe-area-inset-bottom))]",
                  "space-y-3"
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
                  "flex-shrink-0",
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

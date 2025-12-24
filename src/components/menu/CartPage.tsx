import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Trash2, 
  ChevronRight, 
  Plus, 
  Minus,
  Clock,
  Check,
  User,
  MessageCircle,
  RotateCcw,
  X
} from "lucide-react";
import { useCart, CartItem } from "@/contexts/CartContext";
import { menuCategories, restaurantInfo, MenuItem } from "@/data/menuData";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { ProductImage } from "./ProductImage";

interface CartPageProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenInfo: () => void;
  onEditItem: (item: MenuItem, cartItem: CartItem) => void;
}

interface CustomerData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
}

interface PendingOrder {
  time: number;
  locale: string;
  numeroWhatsApp: string;
  riepilogo: string;
  customerData: CustomerData;
  selectedTime: string;
  totalPrice: number;
}

const PENDING_ORDER_KEY = "ordine-in-attesa";
const PENDING_ORDER_TIMEOUT = 3600000; // 60 minutes

// Generate available time slots based on current time and restaurant hours
function generateTimeSlots(): string[] {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();
  
  // Simple implementation: generate slots from 18:00 to 22:30
  const slots: string[] = [];
  const startHour = Math.max(18, currentHour + (currentMinutes > 30 ? 2 : 1));
  
  for (let hour = startHour; hour <= 22; hour++) {
    slots.push(`${hour.toString().padStart(2, "0")}:00`);
    if (hour < 22) {
      slots.push(`${hour.toString().padStart(2, "0")}:30`);
    }
  }
  
  return slots.slice(0, 8); // Max 8 slots
}

// Get suggested items for upsell (contorni, bevande, dolci)
function getSuggestedItems(): MenuItem[] {
  const suggestions: MenuItem[] = [];
  const targetCategories = ["contorni", "bevande", "dolci"];
  
  for (const category of menuCategories) {
    if (targetCategories.includes(category.id)) {
      suggestions.push(...category.items.slice(0, 2));
    }
  }
  
  return suggestions.slice(0, 6);
}

// Validate Italian phone number
function validatePhone(phone: string): boolean {
  // Remove spaces and dashes
  const cleaned = phone.replace(/[\s\-]/g, "");
  // Allow optional +39 or 39 prefix, then 10 digits starting with 3
  const regex = /^(\+?39)?3[0-9]{9}$/;
  return regex.test(cleaned);
}

// Validate email
function validateEmail(email: string): boolean {
  if (!email.trim()) return true; // Empty is valid (optional field)
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Build WhatsApp message with pro formatting
function buildWhatsAppMessage(
  items: CartItem[],
  customerData: CustomerData,
  selectedTime: string,
  notes: string,
  totalPrice: number
): string {
  const formatPrice = (price: number) => price.toFixed(2).replace(".", ",") + " €";

  let message = `🧾 *Ordine Asporto — ${restaurantInfo.name.toUpperCase()}*\n`;
  message += `👤 *Nome:* ${customerData.firstName} ${customerData.lastName}\n`;
  message += `📞 *Telefono:* ${customerData.phone}\n`;
  message += `✉️ *Email:* ${customerData.email.trim() || "—"}\n\n`;
  message += `🕒 *Ritiro:* ${selectedTime}\n`;
  message += `📍 *Modalità:* Asporto\n\n`;
  message += `*Dettagli d'ordine:*\n`;
  
  items.forEach((item) => {
    message += `x${item.quantity} *${item.name.toUpperCase()}* — ${formatPrice(item.price * item.quantity)}\n`;
    if (item.removedIngredients.length > 0) {
      item.removedIngredients.forEach(ingredient => {
        message += `_❌ No ${ingredient}_\n`;
      });
    }
    message += "\n";
  });
  
  // Only include notes section if notes are not empty
  if (notes.trim().length > 0) {
    message += `📝 *Note:* ${notes.trim()}\n\n`;
  }
  
  message += `💶 *Totale indicativo:* ${formatPrice(totalPrice)}\n`;
  message += `✅ *Consenso privacy:* Sì`;
  
  return message;
}

export function CartPage({ isOpen, onClose, onOpenInfo, onEditItem }: CartPageProps) {
  const navigate = useNavigate();
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart, addItem } = useCart();
  const prefersReduced = useReducedMotion();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showPendingOrderModal, setShowPendingOrderModal] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<PendingOrder | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(() => {
    try {
      return localStorage.getItem("cart-selected-time");
    } catch {
      return null;
    }
  });
  const [notes, setNotes] = useState(() => {
    try {
      return localStorage.getItem("cart-notes") || "";
    } catch {
      return "";
    }
  });
  const [consent1, setConsent1] = useState(false);
  const [consent2, setConsent2] = useState(false);
  
  // Customer data
  const [customerData, setCustomerData] = useState<CustomerData>(() => {
    try {
      const stored = localStorage.getItem("cart-customer-data");
      return stored ? JSON.parse(stored) : { firstName: "", lastName: "", phone: "", email: "" };
    } catch {
      return { firstName: "", lastName: "", phone: "", email: "" };
    }
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const timeSlots = useMemo(() => generateTimeSlots(), []);
  const suggestedItems = useMemo(() => getSuggestedItems(), []);

  const formatPrice = (price: number) => {
    return price.toFixed(2).replace(".", ",") + " €";
  };

  // Check for pending order on visibility change
  const checkPendingOrder = useCallback(() => {
    try {
      const stored = localStorage.getItem(PENDING_ORDER_KEY);
      if (stored) {
        const order: PendingOrder = JSON.parse(stored);
        const isExpired = Date.now() - order.time > PENDING_ORDER_TIMEOUT;
        setPendingOrder(order);
        if (!isExpired) {
          setShowPendingOrderModal(true);
        }
      }
    } catch {
      // Ignore errors
    }
  }, []);

  // Listen for page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && isOpen) {
        checkPendingOrder();
      }
    };

    const handleFocus = () => {
      if (isOpen) {
        checkPendingOrder();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [isOpen, checkPendingOrder]);

  // Persist data
  useEffect(() => {
    if (selectedTime) {
      localStorage.setItem("cart-selected-time", selectedTime);
    }
  }, [selectedTime]);

  useEffect(() => {
    localStorage.setItem("cart-notes", notes);
  }, [notes]);

  useEffect(() => {
    localStorage.setItem("cart-customer-data", JSON.stringify(customerData));
  }, [customerData]);

  // Validate form
  useEffect(() => {
    const errors: FormErrors = {};
    
    if (touched.firstName && !customerData.firstName.trim()) {
      errors.firstName = "Il nome è obbligatorio";
    }
    
    if (touched.lastName && !customerData.lastName.trim()) {
      errors.lastName = "Il cognome è obbligatorio";
    }
    
    if (touched.phone) {
      if (!customerData.phone.trim()) {
        errors.phone = "Il telefono è obbligatorio";
      } else if (!validatePhone(customerData.phone)) {
        errors.phone = "Inserisci un numero di telefono italiano valido";
      }
    }
    
    if (touched.email && customerData.email.trim() && !validateEmail(customerData.email)) {
      errors.email = "Inserisci un indirizzo email valido";
    }
    
    setFormErrors(errors);
  }, [customerData, touched]);

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

  const handleClearCart = () => {
    clearCart();
    setShowClearConfirm(false);
    setSelectedTime(null);
    setConsent1(false);
    setConsent2(false);
    localStorage.removeItem("cart-selected-time");
    localStorage.removeItem(PENDING_ORDER_KEY);
    onClose();
    toast({ title: "Carrello svuotato" });
  };

  const handleAddUpsell = (item: MenuItem) => {
    addItem(item, 1, []);
    toast({ title: `${item.name} aggiunto` });
  };

  const findMenuItem = (productId: string): MenuItem | undefined => {
    for (const category of menuCategories) {
      const item = category.items.find(i => i.id === productId);
      if (item) return item;
    }
    return undefined;
  };

  const handleBlur = (field: keyof CustomerData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const updateCustomerField = (field: keyof CustomerData, value: string) => {
    setCustomerData(prev => ({ ...prev, [field]: value }));
  };

  // Validation check
  const isCustomerDataValid = () => {
    const hasFirstName = customerData.firstName.trim().length > 0;
    const hasLastName = customerData.lastName.trim().length > 0;
    const hasValidPhone = validatePhone(customerData.phone);
    const hasValidEmail = !customerData.email.trim() || validateEmail(customerData.email);
    return hasFirstName && hasLastName && hasValidPhone && hasValidEmail;
  };

  const canOrder = items.length > 0 && selectedTime && consent1 && consent2 && isCustomerDataValid();

  const validateAndFocusFirst = (): boolean => {
    const newTouched: Record<string, boolean> = {
      firstName: true,
      lastName: true,
      phone: true,
      email: true,
    };
    setTouched(newTouched);

    if (!customerData.firstName.trim()) {
      firstNameRef.current?.focus();
      return false;
    }
    return true;
  };

  const openWhatsApp = (message: string) => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = "393914272540";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleOrder = () => {
    if (!validateAndFocusFirst()) return;
    if (!canOrder || !selectedTime) return;
    
    // Build WhatsApp message with pro format
    const message = buildWhatsAppMessage(items, customerData, selectedTime, notes, totalPrice);
    
    // Save pending order to localStorage
    const pendingOrderData: PendingOrder = {
      time: Date.now(),
      locale: restaurantInfo.name,
      numeroWhatsApp: "393914272540",
      riepilogo: message,
      customerData,
      selectedTime,
      totalPrice,
    };
    localStorage.setItem(PENDING_ORDER_KEY, JSON.stringify(pendingOrderData));
    
    // Open WhatsApp
    openWhatsApp(message);
    
    toast({
      title: "Si sta aprendo WhatsApp",
      description: "Ricorda di premere Invia per confermare il tuo ordine."
    });
  };

  // Pending order modal handlers
  const handleConfirmSent = () => {
    // Save order summary for thank you page
    if (pendingOrder) {
      localStorage.setItem("order-summary", JSON.stringify({
        firstName: pendingOrder.customerData.firstName,
        lastName: pendingOrder.customerData.lastName,
        phone: pendingOrder.customerData.phone,
        selectedTime: pendingOrder.selectedTime,
        totalPrice: pendingOrder.totalPrice,
      }));
    }
    
    // Clear pending order and cart
    localStorage.removeItem(PENDING_ORDER_KEY);
    localStorage.removeItem("cart-selected-time");
    localStorage.removeItem("cart-notes");
    clearCart();
    setShowPendingOrderModal(false);
    setPendingOrder(null);
    onClose();
    
    // Navigate to thank you page
    navigate("/grazie");
  };

  const handleReopenWhatsApp = () => {
    if (pendingOrder) {
      openWhatsApp(pendingOrder.riepilogo);
    }
  };

  const handleCancelPendingOrder = () => {
    localStorage.removeItem(PENDING_ORDER_KEY);
    localStorage.removeItem("cart-selected-time");
    localStorage.removeItem("cart-notes");
    clearCart();
    setShowPendingOrderModal(false);
    setPendingOrder(null);
    onClose();
    toast({ title: "Ordine annullato" });
  };

  // Check if pending order is expired (for banner display)
  const isPendingOrderExpired = pendingOrder ? Date.now() - pendingOrder.time > PENDING_ORDER_TIMEOUT : false;

  const panelVariants = {
    hidden: { x: "100%" },
    visible: { x: 0 },
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cart-page-title"
        >
          {/* Backdrop */}
          <motion.div
            variants={prefersReduced ? undefined : backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-foreground/50"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            variants={prefersReduced ? undefined : panelVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
            className={cn(
              "absolute right-0 top-0 bottom-0",
              "w-full max-w-md",
              "bg-background",
              "flex flex-col",
              "shadow-2xl"
            )}
          >
            {/* Header */}
            <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-10">
              <button
                ref={closeButtonRef}
                onClick={onClose}
                className={cn(
                  "w-10 h-10 rounded-full",
                  "flex items-center justify-center",
                  "text-foreground hover:bg-secondary",
                  "transition-colors duration-160",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                )}
                aria-label="Chiudi carrello"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              
              <div className="text-center">
                <h1 id="cart-page-title" className="text-lg font-bold text-foreground">
                  Il tuo ordine
                </h1>
                <p className="text-xs text-muted-foreground">{restaurantInfo.name}</p>
              </div>
              
              <button
                onClick={() => items.length > 0 && setShowClearConfirm(true)}
                disabled={items.length === 0}
                className={cn(
                  "w-10 h-10 rounded-full",
                  "flex items-center justify-center",
                  "text-muted-foreground hover:text-destructive hover:bg-destructive/10",
                  "transition-colors duration-160",
                  "disabled:opacity-40 disabled:pointer-events-none",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-destructive"
                )}
                aria-label="Svuota carrello"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-y-auto pb-32">
              
              {/* Cart Section */}
              <section className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-base font-bold text-foreground">Carrello</h2>
                </div>
                
                {/* Allergen Note */}
                <button
                  onClick={onOpenInfo}
                  className="flex items-center gap-2 text-sm text-muted-foreground mb-4 hover:text-primary transition-colors"
                >
                  <span>Per comunicare eventuali allergie, contatta il ristorante</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                {items.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Il carrello è vuoto</p>
                  </div>
                ) : (
                  <div className="bg-card rounded-xl border border-border divide-y divide-border">
                    {items.map((item) => {
                      const menuItem = findMenuItem(item.productId);
                      return (
                        <div key={item.id} className="p-3">
                          <div className="flex items-start gap-3">
                            {/* Quantity controls */}
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleQuantityChange(item, -1)}
                                className={cn(
                                  "w-6 h-6 rounded-full",
                                  "flex items-center justify-center",
                                  "border border-border",
                                  "text-foreground hover:bg-secondary",
                                  "transition-colors duration-160"
                                )}
                                aria-label="Riduci quantità"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-5 text-center text-sm font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item, 1)}
                                className={cn(
                                  "w-6 h-6 rounded-full",
                                  "flex items-center justify-center",
                                  "bg-primary text-primary-foreground",
                                  "hover:bg-primary/90",
                                  "transition-colors duration-160"
                                )}
                                aria-label="Aumenta quantità"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            
                            {/* Item details */}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-foreground">{item.name}</p>
                              {item.removedIngredients.length > 0 && (
                                <div className="mt-1 space-y-0.5">
                                  {item.removedIngredients.map((ingredient, idx) => (
                                    <p key={idx} className="text-xs text-muted-foreground">
                                      -No {ingredient}
                                    </p>
                                  ))}
                                </div>
                              )}
                            </div>
                            
                            {/* Price and edit */}
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-foreground">
                                {formatPrice(item.price * item.quantity)}
                              </span>
                              {menuItem && (
                                <button
                                  onClick={() => onEditItem(menuItem, item)}
                                  className="text-muted-foreground hover:text-primary transition-colors"
                                  aria-label="Modifica prodotto"
                                >
                                  <ChevronRight className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Totals */}
                {items.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Subtotale</span>
                      <span className="text-foreground">{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-foreground">Totale indicativo</span>
                      <span className="text-primary text-lg">{formatPrice(totalPrice)}</span>
                    </div>
                  </div>
                )}
              </section>

              {/* Upsell Section */}
              {items.length > 0 && suggestedItems.length > 0 && (
                <section className="py-4">
                  <h2 className="text-base font-bold text-foreground px-4 mb-3">
                    Altri clienti hanno ordinato anche
                  </h2>
                  
                  <div className="flex gap-3 overflow-x-auto px-4 pb-2 snap-x snap-mandatory scrollbar-hide">
                    {suggestedItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col flex-shrink-0 w-36 snap-start bg-card rounded-xl overflow-hidden"
                      >
                        <ProductImage
                          src={item.image}
                          alt={item.name}
                          className="w-full aspect-square"
                        />
                        <div className="p-2">
                          <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-sm font-semibold text-primary">
                              {formatPrice(item.price)}
                            </span>
                            <button
                              onClick={() => handleAddUpsell(item)}
                              className={cn(
                                "w-7 h-7 rounded-full",
                                "flex items-center justify-center",
                                "bg-primary text-primary-foreground",
                                "hover:bg-primary/90",
                                "transition-colors duration-160"
                              )}
                              aria-label={`Aggiungi ${item.name}`}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Time Selection */}
              {items.length > 0 && (
                <section className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <h2 className="text-base font-bold text-foreground">Seleziona orario</h2>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    Scegli l'orario in cui venire a ritirare il tuo ordine. L'orario è indicativo: riceverai conferma dal nostro staff su WhatsApp.
                  </p>
                  
                  {timeSlots.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setSelectedTime(slot)}
                          className={cn(
                            "px-4 py-2 rounded-full text-sm font-medium",
                            "border transition-colors duration-160",
                            selectedTime === slot
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-card text-foreground border-border hover:border-primary/50"
                          )}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Nessun orario disponibile al momento
                    </p>
                  )}
                </section>
              )}

              {/* Customer Data Section */}
              {items.length > 0 && (
                <section className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <h2 className="text-base font-bold text-foreground">Dati cliente</h2>
                  </div>
                  
                  <div className="space-y-3">
                    {/* First Name */}
                    <div>
                      <label htmlFor="firstName" className="text-sm text-muted-foreground block mb-1">
                        Nome *
                      </label>
                      <input
                        ref={firstNameRef}
                        id="firstName"
                        type="text"
                        value={customerData.firstName}
                        onChange={(e) => updateCustomerField("firstName", e.target.value)}
                        onBlur={() => handleBlur("firstName")}
                        placeholder="Il tuo nome"
                        aria-invalid={!!formErrors.firstName}
                        aria-describedby={formErrors.firstName ? "firstName-error" : undefined}
                        className={cn(
                          "w-full px-3 py-2.5 rounded-lg",
                          "bg-card border",
                          "text-foreground placeholder:text-muted-foreground",
                          "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                          "text-sm",
                          formErrors.firstName ? "border-destructive" : "border-border"
                        )}
                      />
                      {formErrors.firstName && (
                        <p id="firstName-error" className="text-xs text-destructive mt-1" role="alert">
                          {formErrors.firstName}
                        </p>
                      )}
                    </div>
                    
                    {/* Last Name */}
                    <div>
                      <label htmlFor="lastName" className="text-sm text-muted-foreground block mb-1">
                        Cognome *
                      </label>
                      <input
                        id="lastName"
                        type="text"
                        value={customerData.lastName}
                        onChange={(e) => updateCustomerField("lastName", e.target.value)}
                        onBlur={() => handleBlur("lastName")}
                        placeholder="Il tuo cognome"
                        aria-invalid={!!formErrors.lastName}
                        aria-describedby={formErrors.lastName ? "lastName-error" : undefined}
                        className={cn(
                          "w-full px-3 py-2.5 rounded-lg",
                          "bg-card border",
                          "text-foreground placeholder:text-muted-foreground",
                          "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                          "text-sm",
                          formErrors.lastName ? "border-destructive" : "border-border"
                        )}
                      />
                      {formErrors.lastName && (
                        <p id="lastName-error" className="text-xs text-destructive mt-1" role="alert">
                          {formErrors.lastName}
                        </p>
                      )}
                    </div>
                    
                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="text-sm text-muted-foreground block mb-1">
                        Telefono *
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        value={customerData.phone}
                        onChange={(e) => updateCustomerField("phone", e.target.value)}
                        onBlur={() => handleBlur("phone")}
                        placeholder="es. 3331234567"
                        aria-invalid={!!formErrors.phone}
                        aria-describedby={formErrors.phone ? "phone-error" : undefined}
                        className={cn(
                          "w-full px-3 py-2.5 rounded-lg",
                          "bg-card border",
                          "text-foreground placeholder:text-muted-foreground",
                          "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                          "text-sm",
                          formErrors.phone ? "border-destructive" : "border-border"
                        )}
                      />
                      {formErrors.phone && (
                        <p id="phone-error" className="text-xs text-destructive mt-1" role="alert">
                          {formErrors.phone}
                        </p>
                      )}
                    </div>
                    
                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="text-sm text-muted-foreground block mb-1">
                        Email (facoltativa)
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={customerData.email}
                        onChange={(e) => updateCustomerField("email", e.target.value)}
                        onBlur={() => handleBlur("email")}
                        placeholder="esempio@email.com"
                        aria-invalid={!!formErrors.email}
                        aria-describedby={formErrors.email ? "email-error" : undefined}
                        className={cn(
                          "w-full px-3 py-2.5 rounded-lg",
                          "bg-card border",
                          "text-foreground placeholder:text-muted-foreground",
                          "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                          "text-sm",
                          formErrors.email ? "border-destructive" : "border-border"
                        )}
                      />
                      {formErrors.email && (
                        <p id="email-error" className="text-xs text-destructive mt-1" role="alert">
                          {formErrors.email}
                        </p>
                      )}
                    </div>
                  </div>
                </section>
              )}

              {/* Notes */}
              {items.length > 0 && (
                <section className="px-4 pb-4">
                  <label htmlFor="order-notes" className="text-sm text-muted-foreground block mb-2">
                    Note per la cucina (es. allergie, richieste)
                  </label>
                  <textarea
                    id="order-notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    onBlur={() => {
                      // Fix iOS zoom residue on blur
                      setTimeout(() => {
                        window.scrollTo({ top: window.scrollY, behavior: 'instant' });
                      }, 100);
                    }}
                    placeholder="Scrivi eventuali note..."
                    rows={2}
                    className={cn(
                      "w-full px-3 py-2.5 rounded-lg",
                      "bg-card border border-border",
                      "text-foreground placeholder:text-muted-foreground",
                      "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                      "resize-none",
                      "min-h-[56px]"
                    )}
                  />
                </section>
              )}

              {/* Consents */}
              {items.length > 0 && (
                <section className="p-4 space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <div
                      onClick={() => setConsent1(!consent1)}
                      className={cn(
                        "w-5 h-5 mt-0.5 rounded flex-shrink-0",
                        "border-2 flex items-center justify-center",
                        "transition-colors duration-160",
                        consent1
                          ? "bg-primary border-primary"
                          : "border-border hover:border-primary/50"
                      )}
                      role="checkbox"
                      aria-checked={consent1}
                      tabIndex={0}
                      onKeyDown={(e) => e.key === "Enter" && setConsent1(!consent1)}
                    >
                      {consent1 && <Check className="w-3 h-3 text-primary-foreground" />}
                    </div>
                    <span className="text-sm text-muted-foreground leading-relaxed">
                      Ho preso visione del mio ordine e confermo che è corretto. Sono consapevole che dovrò ritirarlo in locale all'orario scelto.
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <div
                      onClick={() => setConsent2(!consent2)}
                      className={cn(
                        "w-5 h-5 mt-0.5 rounded flex-shrink-0",
                        "border-2 flex items-center justify-center",
                        "transition-colors duration-160",
                        consent2
                          ? "bg-primary border-primary"
                          : "border-border hover:border-primary/50"
                      )}
                      role="checkbox"
                      aria-checked={consent2}
                      tabIndex={0}
                      onKeyDown={(e) => e.key === "Enter" && setConsent2(!consent2)}
                    >
                      {consent2 && <Check className="w-3 h-3 text-primary-foreground" />}
                    </div>
                    <span className="text-sm text-muted-foreground leading-relaxed">
                      Accetto l'{" "}
                      <a
                        href="/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-link hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        informativa privacy
                      </a>{" "}
                      e acconsento a essere contattato per finalità inerenti all'ordine e comunicazioni sul ritiro.
                    </span>
                  </label>
                </section>
              )}
            </div>

            {/* Footer CTA */}
            {items.length > 0 && (
              <footer className="absolute bottom-0 left-0 right-0 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] bg-background border-t border-border">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <p className="text-xs text-muted-foreground">Totale</p>
                    <p className="text-lg font-bold text-foreground">{formatPrice(totalPrice)}</p>
                  </div>
                  <button
                    onClick={handleOrder}
                    disabled={!canOrder}
                    className={cn(
                      "flex-1 py-3 rounded-xl",
                      "font-semibold text-sm",
                      "transition-all duration-160",
                      canOrder
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.99]"
                        : "bg-muted text-muted-foreground cursor-not-allowed"
                    )}
                  >
                    Ordina da asporto
                  </button>
                </div>
              </footer>
            )}
          </motion.div>

          {/* Remove confirmation dialog */}
          <AnimatePresence>
            {itemToRemove && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 flex items-center justify-center bg-foreground/40"
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

          {/* Clear cart confirmation dialog */}
          <AnimatePresence>
            {showClearConfirm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 flex items-center justify-center bg-foreground/40"
                onClick={() => setShowClearConfirm(false)}
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
                      Svuotare il carrello?
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Tutti i prodotti verranno rimossi.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowClearConfirm(false)}
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
                      onClick={handleClearCart}
                      className={cn(
                        "flex-1 py-2.5 rounded-lg",
                        "bg-destructive text-destructive-foreground",
                        "font-medium",
                        "hover:bg-destructive/90 transition-colors"
                      )}
                    >
                      Svuota
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pending order confirmation modal */}
          <AnimatePresence>
            {showPendingOrderModal && pendingOrder && !isPendingOrderExpired && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-30 flex items-center justify-center bg-foreground/50"
                onClick={() => setShowPendingOrderModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="bg-card rounded-xl p-5 shadow-xl mx-4 max-w-sm w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <MessageCircle className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold text-card-foreground">
                        Conferma ordine
                      </h3>
                    </div>
                    <button
                      onClick={() => setShowPendingOrderModal(false)}
                      className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-5">
                    Hai inviato il messaggio su WhatsApp?
                  </p>
                  
                  <div className="space-y-2">
                    <button
                      onClick={handleConfirmSent}
                      className={cn(
                        "w-full py-3 rounded-xl",
                        "bg-primary text-primary-foreground",
                        "font-semibold text-sm",
                        "hover:bg-primary/90 transition-colors",
                        "flex items-center justify-center gap-2"
                      )}
                    >
                      <Check className="w-4 h-4" />
                      Sì, ho inviato il messaggio
                    </button>
                    
                    <button
                      onClick={handleReopenWhatsApp}
                      className={cn(
                        "w-full py-3 rounded-xl",
                        "border border-border",
                        "font-semibold text-sm text-foreground",
                        "hover:bg-secondary transition-colors",
                        "flex items-center justify-center gap-2"
                      )}
                    >
                      <RotateCcw className="w-4 h-4" />
                      Riapri WhatsApp
                    </button>
                    
                    <button
                      onClick={handleCancelPendingOrder}
                      className={cn(
                        "w-full py-3 rounded-xl",
                        "text-destructive",
                        "font-medium text-sm",
                        "hover:bg-destructive/10 transition-colors",
                        "flex items-center justify-center gap-2"
                      )}
                    >
                      <X className="w-4 h-4" />
                      Annulla ordine
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Expired pending order banner */}
          <AnimatePresence>
            {pendingOrder && isPendingOrderExpired && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-16 left-4 right-4 z-20"
              >
                <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4">
                  <p className="text-sm font-medium text-destructive mb-3">
                    Ordine non completato
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleReopenWhatsApp}
                      className={cn(
                        "flex-1 py-2 rounded-lg",
                        "bg-primary text-primary-foreground",
                        "text-xs font-medium",
                        "hover:bg-primary/90 transition-colors"
                      )}
                    >
                      Riapri WhatsApp
                    </button>
                    <button
                      onClick={handleCancelPendingOrder}
                      className={cn(
                        "flex-1 py-2 rounded-lg",
                        "border border-border",
                        "text-xs font-medium text-foreground",
                        "hover:bg-secondary transition-colors"
                      )}
                    >
                      Annulla ordine
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  );
}

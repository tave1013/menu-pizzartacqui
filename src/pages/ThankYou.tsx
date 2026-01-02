import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { restaurantInfo } from "@/data/menuData";
import { CartItem } from "@/contexts/CartContext";

interface OrderSummary {
  firstName: string;
  lastName: string;
  phone: string;
  selectedTime: string;
  totalPrice: number;
  items?: CartItem[];
}

export default function ThankYou() {
  const navigate = useNavigate();
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);

  useEffect(() => {
    // Load order summary from localStorage
    try {
      const stored = localStorage.getItem("order-summary");
      if (stored) {
        setOrderSummary(JSON.parse(stored));
      }
    } catch {
      // Ignore errors
    }
  }, []);

  const formatPrice = (price: number) => {
    return price.toFixed(2).replace(".", ",") + " €";
  };

  const handleNewOrder = () => {
    // Clean up any leftover data
    localStorage.removeItem("order-summary");
    localStorage.removeItem("ordine-in-attesa");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md text-center"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center"
        >
          <CheckCircle className="w-10 h-10 text-primary" />
        </motion.div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Ordine inviato ✅
        </h1>
        
        <p className="text-muted-foreground mb-6">
          Abbiamo ricevuto il tuo ordine su WhatsApp. Riceverai conferma dal nostro staff.
        </p>

        {/* Order Summary Card */}
        {orderSummary && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-xl p-4 mb-6 text-left"
          >
            <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
              Riepilogo
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nome:</span>
                <span className="text-foreground font-medium">
                  {orderSummary.firstName} {orderSummary.lastName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Telefono:</span>
                <span className="text-foreground font-medium">{orderSummary.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Orario:</span>
                <span className="text-foreground font-medium">{orderSummary.selectedTime}</span>
              </div>
              
              {/* Riepilogo prodotti ordinati */}
              {orderSummary.items && orderSummary.items.length > 0 && (
                <div className="mt-4 border-t border-border pt-3">
                  <h3 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                    Prodotti Ordinati
                  </h3>
                  <div className="space-y-3">
                    {orderSummary.items.map((item, idx) => (
                      <div key={idx} className="text-sm">
                        {/* Nome prodotto e quantità */}
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-foreground font-medium">
                            {item.quantity}x {item.name}
                          </span>
                          <span className="text-foreground font-medium">
                            {formatPrice(
                              ((Number(item.price) || 0) + (Number(item.extrasPrice) || 0) + (Number(item.glutenFreePrice) || 0)) * Number(item.quantity || 1)
                            )}
                          </span>
                        </div>
                        
                        {/* Badge Senza Glutine */}
                        {item.glutenFree && (
                          <div className="inline-block px-2 py-0.5 mt-0.5 bg-yellow-100 dark:bg-yellow-900/30 rounded-full text-xs font-medium text-yellow-800 dark:text-yellow-200">
                            Senza glutine
                          </div>
                        )}
                        
                        {/* Ingredienti Extra */}
                        {item.selectedExtras && item.selectedExtras.length > 0 && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {item.selectedExtras.map((extra, i) => (
                              <div key={i}>+ {extra}</div>
                            ))}
                          </div>
                        )}
                        
                        {/* Ingredienti Rimossi */}
                        {item.removedIngredients && item.removedIngredients.length > 0 && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {item.removedIngredients.map((ingredient, i) => (
                              <div key={i}>-No {ingredient}</div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-between border-t border-border pt-2 mt-2">
                <span className="text-foreground font-semibold">Totale:</span>
                <span className="text-primary font-bold">{formatPrice(orderSummary.totalPrice)}</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Restaurant Info */}
        <p className="text-sm text-muted-foreground mb-6">
          Ritiro presso <strong>{restaurantInfo.name}</strong>
        </p>

        {/* CTA Button */}
        <button
          onClick={handleNewOrder}
          className={cn(
            "w-full py-3.5 rounded-xl",
            "bg-primary text-primary-foreground",
            "font-semibold text-sm",
            "hover:bg-primary/90 transition-colors",
            "flex items-center justify-center gap-2"
          )}
        >
          <Home className="w-4 h-4" />
          Nuovo ordine
        </button>
      </motion.div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { restaurantInfo } from "@/data/menuData";

interface OrderSummary {
  firstName: string;
  lastName: string;
  phone: string;
  selectedTime: string;
  totalPrice: number;
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

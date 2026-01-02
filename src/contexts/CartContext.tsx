import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { MenuItem } from "@/data/menuData";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  removedIngredients: string[];
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (item: MenuItem, quantity: number, removedIngredients: string[]) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "newcastle-pub-cart";
const CART_EXPIRY_MS = 24 * 60 * 60 * 1000;

function loadCartFromStorage(): CartItem[] {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);

    // Backward compatibility: old structure was just an array
    if (Array.isArray(parsed)) {
      return parsed;
    }

    if (parsed && Array.isArray(parsed.items)) {
      const { items, updatedAt } = parsed;
      if (typeof updatedAt === "number") {
        const isExpired = Date.now() - updatedAt > CART_EXPIRY_MS;
        if (isExpired) {
          localStorage.removeItem(CART_STORAGE_KEY);
          return [];
        }
      }
      return items;
    }
  } catch {
    // ignore broken storage
  }
  return [];
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => loadCartFromStorage());

  // Persist to localStorage with timestamp for expiry
  useEffect(() => {
    if (!items.length) {
      localStorage.removeItem(CART_STORAGE_KEY);
      return;
    }

    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify({ items, updatedAt: Date.now() })
    );
  }, [items]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const addItem = (menuItem: MenuItem, quantity: number, removedIngredients: string[]) => {
    const cartItemId = `${menuItem.id}-${removedIngredients.sort().join(",")}`;
    
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.id === cartItemId);
      
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }
      
      return [
        ...prev,
        {
          id: cartItemId,
          productId: menuItem.id,
          name: menuItem.name,
          price: menuItem.price,
          image: menuItem.image,
          quantity,
          removedIngredients,
        },
      ];
    });
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(cartItemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.id === cartItemId ? { ...item, quantity } : item
      )
    );
  };

  const removeItem = (cartItemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalPrice,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

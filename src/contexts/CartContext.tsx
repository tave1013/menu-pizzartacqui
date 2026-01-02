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
  selectedExtras: string[];
  extrasPrice: number;
  glutenFree: boolean;
  glutenFreePrice: number;
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (item: MenuItem, quantity: number, removedIngredients: string[], selectedExtras?: string[], extrasPrice?: number, glutenFree?: boolean, glutenFreePrice?: number) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "newcastle-pub-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (!stored) return [];
      
      const parsed = JSON.parse(stored);
      // Supporta sia array diretto che oggetto con proprietà items
      if (Array.isArray(parsed)) {
        return parsed;
      }
      if (parsed && Array.isArray(parsed.items)) {
        return parsed.items;
      }
      return [];
    } catch {
      return [];
    }
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => {
    const basePrice = Number(item.price) || 0;
    const extrasPrice = Number(item.extrasPrice) || 0;
    const glutenPrice = Number(item.glutenFreePrice) || 0;
    const qty = Number(item.quantity) || 1;
    const itemTotal = (basePrice + extrasPrice + glutenPrice) * qty;
    return sum + itemTotal;
  }, 0);

  const addItem = (menuItem: MenuItem, quantity: number, removedIngredients: string[], selectedExtras: string[] = [], extrasPrice: number = 0, glutenFree: boolean = false, glutenFreePrice: number = 0) => {
    const cartItemId = `${menuItem.id}-${removedIngredients.sort().join(",")}-${selectedExtras.sort().join(",")}-${glutenFree ? "gf" : ""}`;
    
    // Assicurati che i prezzi siano numeri
    const safeExtrasPrice = Number(extrasPrice) || 0;
    const safeGlutenFreePrice = Number(glutenFreePrice) || 0;
    
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
          selectedExtras,
          extrasPrice: safeExtrasPrice,
          glutenFree,
          glutenFreePrice: safeGlutenFreePrice,
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

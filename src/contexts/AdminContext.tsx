import { createContext, useContext, useState, ReactNode } from "react";
import {
  AdminCategory,
  AdminProduct,
  AdminHours,
  AdminSettings,
  RecentActivity,
  initialCategories,
  initialProducts,
  initialHours,
  initialSettings,
  initialActivities,
} from "@/data/adminMockData";

interface AdminContextType {
  categories: AdminCategory[];
  products: AdminProduct[];
  hours: AdminHours;
  settings: AdminSettings;
  activities: RecentActivity[];
  
  // Categories
  addCategory: (name: string) => void;
  updateCategory: (id: string, name: string) => void;
  deleteCategory: (id: string) => void;
  reorderCategories: (categories: AdminCategory[]) => void;
  
  // Products
  addProduct: (product: Omit<AdminProduct, "id">) => void;
  updateProduct: (id: string, product: Partial<AdminProduct>) => void;
  deleteProduct: (id: string) => void;
  duplicateProduct: (id: string) => void;
  
  // Hours
  updateHours: (hours: AdminHours) => void;
  addSpecialClosure: (date: string, note: string) => void;
  removeSpecialClosure: (date: string) => void;
  
  // Settings
  updateSettings: (settings: Partial<AdminSettings>) => void;
  
  // Activities
  addActivity: (action: string, target: string) => void;
}

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<AdminCategory[]>(initialCategories);
  const [products, setProducts] = useState<AdminProduct[]>(initialProducts);
  const [hours, setHours] = useState<AdminHours>(initialHours);
  const [settings, setSettings] = useState<AdminSettings>(initialSettings);
  const [activities, setActivities] = useState<RecentActivity[]>(initialActivities);

  const addActivity = (action: string, target: string) => {
    const newActivity: RecentActivity = {
      id: `a${Date.now()}`,
      action,
      target,
      timestamp: new Date(),
    };
    setActivities((prev) => [newActivity, ...prev.slice(0, 4)]);
  };

  // Categories
  const addCategory = (name: string) => {
    const newCategory: AdminCategory = {
      id: `c${Date.now()}`,
      name,
      sort: categories.length + 1,
    };
    setCategories((prev) => [...prev, newCategory]);
    addActivity("Categoria creata", name);
  };

  const updateCategory = (id: string, name: string) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, name } : cat))
    );
    addActivity("Categoria rinominata", name);
  };

  const deleteCategory = (id: string) => {
    const cat = categories.find((c) => c.id === id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
    if (cat) addActivity("Categoria eliminata", cat.name);
  };

  const reorderCategories = (newCategories: AdminCategory[]) => {
    setCategories(newCategories.map((cat, i) => ({ ...cat, sort: i + 1 })));
  };

  // Products
  const addProduct = (product: Omit<AdminProduct, "id">) => {
    const newProduct: AdminProduct = {
      ...product,
      id: `p${Date.now()}`,
    };
    setProducts((prev) => [...prev, newProduct]);
    addActivity("Prodotto aggiunto", product.name);
  };

  const updateProduct = (id: string, product: Partial<AdminProduct>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...product } : p))
    );
    const p = products.find((p) => p.id === id);
    if (p) addActivity("Prodotto modificato", p.name);
  };

  const deleteProduct = (id: string) => {
    const p = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (p) addActivity("Prodotto eliminato", p.name);
  };

  const duplicateProduct = (id: string) => {
    const original = products.find((p) => p.id === id);
    if (original) {
      const duplicate: AdminProduct = {
        ...original,
        id: `p${Date.now()}`,
        name: `${original.name} (copia)`,
      };
      setProducts((prev) => [...prev, duplicate]);
      addActivity("Prodotto duplicato", original.name);
    }
  };

  // Hours
  const updateHours = (newHours: AdminHours) => {
    setHours(newHours);
    addActivity("Orari aggiornati", "Settimanali");
  };

  const addSpecialClosure = (date: string, note: string) => {
    setHours((prev) => ({
      ...prev,
      special: [...prev.special, { date, note }],
    }));
    addActivity("Chiusura speciale aggiunta", date);
  };

  const removeSpecialClosure = (date: string) => {
    setHours((prev) => ({
      ...prev,
      special: prev.special.filter((s) => s.date !== date),
    }));
    addActivity("Chiusura speciale rimossa", date);
  };

  // Settings
  const updateSettings = (newSettings: Partial<AdminSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    addActivity("Impostazioni aggiornate", "Locale");
  };

  return (
    <AdminContext.Provider
      value={{
        categories,
        products,
        hours,
        settings,
        activities,
        addCategory,
        updateCategory,
        deleteCategory,
        reorderCategories,
        addProduct,
        updateProduct,
        deleteProduct,
        duplicateProduct,
        updateHours,
        addSpecialClosure,
        removeSpecialClosure,
        updateSettings,
        addActivity,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within AdminProvider");
  }
  return context;
}

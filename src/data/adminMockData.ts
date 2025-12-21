// Admin Dashboard Mock Data

export interface AdminCategory {
  id: string;
  name: string;
  sort: number;
}

export interface AdminProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  active: boolean;
  badges: string[];
  allergens: string[];
}

export interface DayHours {
  open: string;
  close: string;
  closed: boolean;
}

export interface SpecialClosure {
  date: string;
  note: string;
}

export interface AdminHours {
  mon: DayHours;
  tue: DayHours;
  wed: DayHours;
  thu: DayHours;
  fri: DayHours;
  sat: DayHours;
  sun: DayHours;
  special: SpecialClosure[];
}

export interface AdminSettings {
  localeName: string;
  address: string;
  whatsapp: string;
  email: string;
  instagram: string;
  facebook: string;
  brandColor: string;
}

export interface RecentActivity {
  id: string;
  action: string;
  target: string;
  timestamp: Date;
}

export const initialCategories: AdminCategory[] = [
  { id: "c1", name: "Pizze", sort: 1 },
  { id: "c2", name: "Hamburger", sort: 2 },
  { id: "c3", name: "Bevande", sort: 3 },
  { id: "c4", name: "Antipasti", sort: 4 },
  { id: "c5", name: "Dolci", sort: 5 },
];

export const initialProducts: AdminProduct[] = [
  { id: "p1", name: "Margherita", description: "Pomodoro, fiordilatte, basilico fresco", price: 7.5, imageUrl: "", categoryId: "c1", active: true, badges: ["vegetariano"], allergens: ["glutine", "latte"] },
  { id: "p2", name: "Big Angus", description: "200g Angus, cheddar, bacon, salsa BBQ", price: 12, imageUrl: "https://picsum.photos/seed/angus/300/200", categoryId: "c2", active: true, badges: ["halal"], allergens: ["glutine", "uova", "senape"] },
  { id: "p3", name: "Acqua Frizzante", description: "50cl", price: 1.5, imageUrl: "", categoryId: "c3", active: true, badges: [], allergens: [] },
  { id: "p4", name: "Diavola", description: "Pomodoro, mozzarella, salame piccante", price: 9, imageUrl: "https://picsum.photos/seed/diavola/300/200", categoryId: "c1", active: true, badges: [], allergens: ["glutine", "latte"] },
  { id: "p5", name: "Veggie Burger", description: "Burger vegetale, avocado, pomodoro", price: 11, imageUrl: "https://picsum.photos/seed/veggie/300/200", categoryId: "c2", active: true, badges: ["vegano", "senza_lattosio"], allergens: ["glutine", "soia"] },
  { id: "p6", name: "Coca Cola", description: "33cl", price: 3, imageUrl: "", categoryId: "c3", active: false, badges: [], allergens: [] },
  { id: "p7", name: "Bruschette", description: "Pomodoro fresco, basilico, olio EVO", price: 5.5, imageUrl: "https://picsum.photos/seed/bruschette/300/200", categoryId: "c4", active: true, badges: ["vegano"], allergens: ["glutine"] },
  { id: "p8", name: "Tiramisù", description: "Mascarpone, savoiardi, caffè", price: 6, imageUrl: "https://picsum.photos/seed/tiramisu/300/200", categoryId: "c5", active: true, badges: [], allergens: ["glutine", "latte", "uova"] },
];

export const initialHours: AdminHours = {
  mon: { open: "11:00", close: "22:00", closed: false },
  tue: { open: "11:00", close: "22:00", closed: true },
  wed: { open: "11:00", close: "22:00", closed: false },
  thu: { open: "11:00", close: "22:00", closed: false },
  fri: { open: "11:00", close: "00:00", closed: false },
  sat: { open: "11:00", close: "00:00", closed: false },
  sun: { open: "11:00", close: "22:00", closed: false },
  special: [
    { date: "2025-12-25", note: "Natale - Chiuso" },
    { date: "2025-12-31", note: "Capodanno - Chiusura anticipata" },
  ],
};

export const initialSettings: AdminSettings = {
  localeName: "New Castle Pub",
  address: "Via Cassarogna 64, Acqui Terme (AL)",
  whatsapp: "+393914272540",
  email: "info@newcastlepub.it",
  instagram: "https://instagram.com/newcastlepubacqui",
  facebook: "https://facebook.com/newcastlepubacqui",
  brandColor: "#d4efa2",
};

export const initialActivities: RecentActivity[] = [
  { id: "a1", action: "Prodotto aggiunto", target: "Tiramisù", timestamp: new Date(Date.now() - 1000 * 60 * 30) },
  { id: "a2", action: "Prezzo modificato", target: "Big Angus", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) },
  { id: "a3", action: "Categoria creata", target: "Dolci", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5) },
  { id: "a4", action: "Orari aggiornati", target: "Venerdì", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) },
  { id: "a5", action: "Prodotto nascosto", target: "Coca Cola", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48) },
];

export const BADGE_OPTIONS = [
  { value: "vegano", label: "Vegano", color: "bg-green-100 text-green-800" },
  { value: "vegetariano", label: "Vegetariano", color: "bg-emerald-100 text-emerald-800" },
  { value: "senza_glutine", label: "Senza Glutine", color: "bg-amber-100 text-amber-800" },
  { value: "halal", label: "Halal", color: "bg-teal-100 text-teal-800" },
  { value: "senza_lattosio", label: "Senza Lattosio", color: "bg-blue-100 text-blue-800" },
];

export const DAY_LABELS: Record<string, string> = {
  mon: "Lunedì",
  tue: "Martedì",
  wed: "Mercoledì",
  thu: "Giovedì",
  fri: "Venerdì",
  sat: "Sabato",
  sun: "Domenica",
};

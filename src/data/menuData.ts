// Percorsi pubblici per le immagini
const burgerAmericano = "/assets/food/burger-americano.jpg";
const burgerClassico = "/assets/food/burger-classico.jpg";
const patatine = "/assets/food/patatine.jpg";
const margheritaImg = "/assets/food/Margherita.png";
const caronteImg = "/assets/food/Caronte.png";
const formaggiImg = "/assets/food/ai-formaggi.png";
const reginaImg = "/assets/food/la-regina.png";
const raffinataImg = "/assets/food/Raffinata.png";
const anciovaImg = "/assets/food/anciova.png";
const monetImg = "/assets/food/Monet.png";
const picassoImg = "/assets/food/Picasso.png";
const renoirImg = "/assets/food/Renoir.png";
const chagallImg = "/assets/food/Chagall.png";
const cimabueImg = "/assets/food/Cimabue.png";
const vanGoghImg = "/assets/food/van-gogh.png";
const daliImg = "/assets/food/Dalì.png";
const michelangeloImg = "/assets/food/Michelangelo.png";
const daVinciImg = "/assets/food/da-vinci.png";
const sfiziosaImg = "/assets/food/Sfiziosa.png";
const zenaImg = "/assets/food/Zena.png";

export type DietaryTag = "vegan" | "vegetarian" | "gluten-free";

export interface MenuItem {
  id: string;
  name: string;
  desc: string;
  price: number;
  image: string;
  allergens?: string[];
  dietaryTags?: DietaryTag[];
  isHalal?: boolean;
  isLactoseFree?: boolean;
  featured?: boolean;
  featuredOrder?: number;
  contact: {
    tel: string;
    mail: string;
    whatsapp?: string;
  };
}

export interface Category {
  id: string;
  name: string;
  items: MenuItem[];
}

export interface DayHours {
  day: string;
  hours: string;
  closed?: boolean;
}

export interface RestaurantInfo {
  name: string;
  description?: string;
  rating: number;
  reviewCount: number;
  priceRange: string;
  cuisine: string;
  address: string;
  coordinates?: { lat: number; lng: number };
  heroImage: string;
  openingHours: string;
  weeklyHours: DayHours[];
  deliveryTime: string;
  deliverooUrl?: string;
  bookingUrl?: string;
  bookingPhone?: string;
  phone?: string;
  email?: string;
  facebookUrl?: string;
  facebookName?: string;
  instagramUrl?: string;
  instagramHandle?: string;
}

export const restaurantInfo: RestaurantInfo = {
  name: "PizzArt",
  description: "Pub tradizionale con hamburger artigianali e birre selezionate dal 2015.",
  rating: 4.6,
  reviewCount: 387,
  priceRange: "€€€",
  cuisine: "Hamburger • Pub • Birra artigianale",
  address: "Via Guglielmo Marconi, 18, 15011 Acqui Terme (AL)",
  coordinates: { lat: 44.6765, lng: 8.4659 },
  heroImage: "",
  openingHours: "12:00 - 23:00",
  weeklyHours: [
    { day: "Lunedì", hours: "12:00 - 14:30, 19:00 - 23:00" },
    { day: "Martedì", hours: "", closed: true },
    { day: "Mercoledì", hours: "12:00 - 14:30, 19:00 - 23:00" },
    { day: "Giovedì", hours: "12:00 - 14:30, 19:00 - 23:00" },
    { day: "Venerdì", hours: "12:00 - 14:30, 19:00 - 00:00" },
    { day: "Sabato", hours: "11:00 - 00:00" },
    { day: "Domenica", hours: "11:00 - 22:00" },
  ],
  deliveryTime: "25-40 min",
  deliverooUrl: "https://deliveroo.it",
  bookingPhone: "+39 333 1234567",
  phone: "+39 0144 123456",
  email: "info@newcastlepub.it",
  facebookUrl: "https://facebook.com/newcastlepub",
  facebookName: "New Castle Pub",
  instagramUrl: "https://instagram.com/newcastlepub",
  instagramHandle: "@newcastlepub",
};

export const menuCategories: Category[] = [
  {
    id: "top-ten",
    name: "Le Top Ten",
    items: [
      {
        id: "margherita",
        name: "Margherita",
        desc: "Pomodoro, mozzarella fiordilatte, basilico",
        price: 8.0,
        image: margheritaImg,
        dietaryTags: ["vegetarian"],
        allergens: ["Glutine", "Lattosio"],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "caronte",
        name: "Caronte",
        desc: "Pomodoro, mozzarella fiordilatte, spianata calabra",
        price: 10.5,
        image: caronteImg,
        allergens: ["Glutine", "Lattosio"],
        featured: true,
        featuredOrder: 1,
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it", whatsapp: "+39 333 1234567" },
      },
      {
        id: "insuperabile",
        name: "Insuperabile",
        desc: "Pomodoro, mozzarella fiordilatte, prosciutto cotto insuperabile Barabino fuori cottura",
        price: 12.5,
        image: "",
        allergens: ["Glutine", "Lattosio"],
        featured: true,
        featuredOrder: 2,
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it", whatsapp: "+39 333 1234567" },
      },
      {
        id: "ai-formagi",
        name: "Ai formaggi",
        desc: "Mozzarella fiordilatte, gorgonzola DOP, squacquerone, toma piemontese",
        price: 13.5,
        image: formaggiImg,
        allergens: ["Glutine", "Lattosio"],
        dietaryTags: ["vegetarian"],
        featured: true,
        featuredOrder: 3,
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it", whatsapp: "+39 333 1234567" },
      },
      {
        id: "la-regina",
        name: "La Regina",
        desc: "Pomodoro, bufala campana DOP, basilico, olio e.v.o.",
        price: 12.0,
        image: reginaImg,
        allergens: ["Glutine", "Lattosio"],
        dietaryTags: ["vegetarian"],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "la-tonnara",
        name: "La Tonnara",
        desc: "Pomodoro, mozzarella fiordilatte, filetti di tonno sott'olio, cipolla rossa di Tropea",
        price: 12.5,
        image: "",
        allergens: ["Glutine", "Lattosio", "Pesce"],
        featured: true,
        featuredOrder: 4,
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "raffinata",
        name: "Raffinata",
        desc: "Pomodoro, mozzarella fiordilatte, in uscita prosciutto crudo brado Barabino, stracciatella di burrata, pomodorini datterini e rucola",
        price: 16.5,
        image: raffinataImg,
        allergens: ["Glutine", "Lattosio"],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "stracciata",
        name: "Stracciata",
        desc: "Pomodoro, stracciatella di burrata DOP, basilico, olio E.V.O.",
        price: 12.0,
        image: "",
        allergens: ["Glutine", "Lattosio"],
        dietaryTags: ["vegetarian"],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "vegana",
        name: "Vegana",
        desc: "Crema di patate, carpaccio di verdure, intingolo d’aglio, olive taggiasche, origano",
        price: 12.0,
        image: "",
        allergens: ["Glutine"],
        dietaryTags: ["vegan"],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "anciova",
        name: "L'anciova",
        desc: "Pomodoro, bufala campana DOP, acciughe, origano",
        price: 13.0,
        image: anciovaImg,
        allergens: ["Glutine", "Lattosio"],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
    ],
  },
  {
    id: "pizart",
    name: "Pizzart",
    items: [
      {
        id: "monet",
        name: "Monet",
        desc: "Pomodoro, crema di pomodori secchi, cipolle di Tropea, burrata, acciughe del Cantabrico, olive, intingolo d'aglio, origano, basilico",
        price: 21.0,
        image: monetImg,
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
        allergens: ["Glutine", "Lattosio", "Pesce"],
      },
      {
        id: "picasso",
        name: "Picasso",
        desc: "Mozzarella fiordilatte, burrata, mortadella fuori cottura, crema di pistacchio, granella di pistacchio",
        price: 18.0,
        image: picassoImg,
        allergens: ["Glutine", "Lattosio", "Frutta a guscio"],
        featured: true,
        featuredOrder: 5,
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "renoir",
        name: "Renoir",
        desc: "Bufala, 'nduja calabrese, peperoni, salame piccante, origano, pomodori datterini, basilico",
        price: 17.0,
        image: renoirImg,
        allergens: ["Glutine", "Lattosio"],
        featured: true,
        featuredOrder: 6,
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "chagal",
        name: "Chagall",
        desc: "Fiordilatte, burrata, pancetta arrostita aromatizzata, uovo all’occhio di bue, crumble croccante di pecorino, pepe",
        price: 18.0,
        image: chagallImg,
        allergens: ["Glutine", "Lattosio", "Uova"],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "cimabue",
        name: "Cimabue",
        desc: "Pomodoro, funghi porcini, stracciatella di burrata, prosciutto cotto fuori cottura",
        price: 17.0,
        image: cimabueImg,
        allergens: ["Glutine", "Lattosio"],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "van-gogh",
        name: "Van Gogh",
        desc: "Fiordilatte, salsiccia marinata nel vino Porto, olive, pinoli, pesto",
        price: 18.0,
        image: vanGoghImg,
        allergens: ["Glutine", "Lattosio", "Frutta a guscio"],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "dali",
        name: "Dalì",
        desc: "Fiordilatte, toma piemontese, gorgonzola, pere caramellate",
        price: 17.0,
        image: daliImg,
        dietaryTags: ["vegetarian"],
        allergens: ["Glutine", "Lattosio"],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "michelangelo",
        name: "Michelangelo",
        desc: "Crema di patate, fagiolini, stracciatella di burrata, pesto.",
        price: 1800.0,
        image: michelangeloImg,
        allergens: ["Glutine", "Lattosio", "Frutta a guscio"],
        dietaryTags: ["vegetarian"],
        featured: true,
        featuredOrder: 7,
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "da-vinci",
        name: "Da Vinci",
        desc: "Fiordilatte, gamberi*, rucola, emulsione di agrumi, stracciata, galssa dolce di aceto balsamico",
        price: 19.0,
        image: daVinciImg,
        allergens: ["Glutine", "Lattosio", "Crostacei"],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
    ],
  },
  {
    id: "le-focacce",
    name: "Le Focacce",
    items: [
      {
        id: "sfiziosa",
        name: "Sfiziosa",
        desc: "Bresaola o prosciutto crudo a scelta, rucola, scaglie di grana, pomodorini",
        price: 14.5,
        image: sfiziosaImg,
        allergens: ["Glutine", "Lattosio"],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "zena",
        name: "Zena",
        desc: "Stracchino, fagiolini, pesto",
        price: 13.0,
        image: zenaImg,
        dietaryTags: ["vegetarian"],
        allergens: ["Glutine", "Lattosio", "Frutta a guscio"],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
    ],
  },
  {
    id: "secondi",
    name: "Secondi Piatti",
    items: [
      {
        id: "costata",
        name: "Costata di Manzo",
        desc: "Costata alla griglia 400g con patate arrosto e verdure di stagione",
        price: 22.0,
        image: burgerAmericano,
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "tagliata",
        name: "Tagliata di Black Angus",
        desc: "Tagliata su letto di rucola con scaglie di parmigiano e aceto balsamico",
        price: 18.0,
        image: burgerClassico,
        allergens: ["Lattosio"],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
    ],
  },
  {
    id: "dolci",
    name: "Dolci & Dessert",
    items: [
      {
        id: "cheesecake",
        name: "Cheesecake NY Style",
        desc: "Cheesecake cremosa con base di biscotto e topping ai frutti di bosco",
        price: 6.0,
        image: burgerClassico,
        allergens: ["Glutine", "Lattosio", "Uova"],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "gelato",
        name: "Coppa Gelato Artigianale",
        desc: "Tre gusti a scelta con panna montata, granella e topping",
        price: 5.0,
        image: patatine,
        allergens: ["Lattosio", "Frutta a guscio"],
        dietaryTags: ["gluten-free"],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
    ],
  },
];
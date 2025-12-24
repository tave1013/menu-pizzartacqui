import burgerAmericano from "@/assets/food/burger-americano.jpg";
import burgerClassico from "@/assets/food/burger-classico.jpg";
import burgerBbq from "@/assets/food/burger-bbq.jpg";
import patatine from "@/assets/food/patatine.jpg";
import onionRings from "@/assets/food/onion-rings.jpg";
import insalata from "@/assets/food/insalata.jpg";
import birra from "@/assets/food/birra.jpg";

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
        image: "src/assets/food/Margherita.png",
        dietaryTags: ["vegan"],
        allergens: ["Glutine", "Lattosio"],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "caronte",
        name: "Caronte",
        desc: "Pomodoro, mozzarella fiordilatte, spianata calabra",
        price: 10.5,
        image: "/src/assets/food/Caronte.png",
        allergens: ["Glutine", "Lattosio",],
        featured: true,
        featuredOrder: 1,
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it", whatsapp: "+39 333 1234567" },
      },
      {
        id: "insuperabile",
        name: "Insuperabile",
        desc: "Pomodoro, mozzarella fiordilatte, prosciutto cotto insuperabile Barabino fuori cottura",
        price: 10.5,
        image:"",
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
        image: "/src/assets/food/ai-formaggi.png",
        allergens: ["Glutine", "Lattosio",],
        dietaryTags: ["vegan", "vegetarian"],
        featured: true,
        featuredOrder: 3,
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it", whatsapp: "+39 333 1234567" },
      },
      {
        id: "la-regina",
        name: "La Regina",
        desc: "Pomodoro, bufala campana DOP, basilico, olio e.v.o.",
        price: 12.0,
        image: "/src/assets/food/la-regina.png",
        allergens: ["Glutine", "Lattosio",],
        dietaryTags: ["vegan", "vegetarian"],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "la-tonnara",
        name: "La Tonnara",
        desc: "Pomodoro, mozzarella fiordilatte, filetti di tonno sott'olio, cipolla rossa di Tropea",
        price: 12.5,
        image: "",
        allergens: ["Glutine", "Latte", "Pesce"],
        featured: true,
        featuredOrder: 4,
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "raffinata",
        name: "Raffinata",
        desc: "Pomodoro, mozzarella fiordilatte, in uscita prosciutto crudo brado Barabino, stracciatella di burrata, pomodorini datterini e rucola",
        price: 16.5,
        image: "src/assets/food/Raffinata.png",
        allergens: ["Glutine", "Lattosio",],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "stracciata",
        name: "Stracciata",
        desc: "Pomodoro, stracciatella di burrata DOP, basilico, olio E.V.O.",
        price: 12.0,
        image: "",
        allergens: ["Glutine", "Lattosio"],
        dietaryTags: ["vegan", "vegetarian"],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "vegana",
        name: "Vegana",
        desc: "Crema di patate, carpaccio di verdure, intingolo d’aglio, olive taggiasche, origano",
        price: 12.0,
        image: "",
        allergens: ["Glutine"],
        dietaryTags: ["vegan", "vegetarian"],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "anciova",
        name: "L'anciova",
        desc: "Pomodoro, bufala campana DOP, acciughe, origano",
        price: 13.0,
        image: "src/assets/food/anciova.png",
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
        image: "/src/assets/food/Monet.png",
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
        allergens: ["Glutine", "Lattosio", "Pesce"],
      },
      {
        id: "picasso",
        name: "Picasso",
        desc: "Mozzarella fiordilatte, burrata, mortadella fuori cottura, crema di pistacchio, granella di pistacchio",
        price: 18.0,
        image: "src/assets/food/Picasso.png",
        allergens: ["Glutine", "Lattosio", "Noci"],
        featured: true,
        featuredOrder: 5,
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "renoir",
        name: "Renoir",
        desc: "Bufala, 'nduja calabrese, peperoni, salame piccante, origano, pomodori datterini, basilico",
        price: 17.0,
        image: "src/assets/food/Renoir.png",
        allergens: ["Glutine", "Latte"],
        featured: true,
        featuredOrder: 6,
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "chagal",
        name: "Chagall",
        desc: "Fiordilatte, burrata, pancetta arrostita aromatizzata, uovo all’occhio di bue, crumble croccante di pecorino, pepe",
        price: 18.0,
        image: "src/assets/food/Chagall.png",
        allergens: ["Glutine", "Lattosio", "Uovo"],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "cimabue",
        name: "Cimabue",
        desc: "Pomodoro, funghi porcini, stracciatella di burrata, prosciutto cotto fuori cottura",
        price: 17.00,
        image: "src/assets/food/Cimabue.png",
        allergens: ["Glutine", "Lattosio",],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "van-gogh",
        name: "Van Gogh",
        desc: "Fiordilatte, salsiccia marinata nel vino Porto, olive, pinoli, pesto",
        price: 18.0,
        image: "src/assets/food/van-gogh.png",
        allergens: ["Glutine", "Lattosio", "Noci",],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "dali",
        name: "Dalì",
        desc: "Fiordilatte, toma piemontese, gorgonzola, pere caramellate",
        price: 17.0,
        image: "src/assets/food/Dalì.png",
        dietaryTags: ["vegan", "vegetarian"],
        allergens: ["Glutine", "Lattosio"],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "michelangelo",
        name: "Michelangelo",
        desc: "Crema di patate, fagiolini, stracciatella di burrata, pesto.",
        price: 17.0,
        image: "src/assets/food/Michelangelo.png",
        allergens: ["Glutine", "Lattosio", "Noci"],
        dietaryTags: ["vegan", "vegetarian"],
        featured: true,
        featuredOrder: 7,
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "da-vinci",
        name: "Da Vinci",
        desc: "Fiordilatte, gamberi*, rucola, emulsione di agrumi, stracciata, galssa dolce di aceto balsamico",
        price: 19.0,
        image: "src/assets/food/da-vinci.png",
        allergens: ["Glutine", "Lattosio","Crostacei"],
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
        price: 14.50,
        image: "src/assets/food/Sfiziosa.png",
        allergens: ["Glutine", "Lattosio"],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "zena",
        name: "Zena",
        desc: "Stracchino, fagiolini, pesto",
        price: 13.0,
        image: "src/assets/food/Zena.png",
        dietaryTags: ["vegan", "vegetarian"],
        allergens: ["Glutine", "Lattosio","Noci"],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "focaccia-bianca",
        name: "Focaccia Bianca",
        desc: "Focaccia, olio, sale",
        price: 5.0,
        image: "",
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
    ],
  },
  {
    id: "le-classiche",
    name: "Le Classiche",
    items: [
      {
        id: "zena",
        name: "Zena",
        desc: "Stracchino, fagiolini, pesto",
        price: 13.0,
        image: "src/assets/food/Zena.png",
        dietaryTags: ["vegan", "vegetarian"],
        allergens: ["Glutine", "Lattosio","Noci"],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "zena",
        name: "Zena",
        desc: "Stracchino, fagiolini, pesto",
        price: 13.0,
        image: "src/assets/food/Zena.png",
        dietaryTags: ["vegan", "vegetarian"],
        allergens: ["Glutine", "Lattosio","Noci"],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "zena",
        name: "Zena",
        desc: "Stracchino, fagiolini, pesto",
        price: 13.0,
        image: "src/assets/food/Zena.png",
        dietaryTags: ["vegan", "vegetarian"],
        allergens: ["Glutine", "Lattosio","Noci"],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "zena",
        name: "Zena",
        desc: "Stracchino, fagiolini, pesto",
        price: 13.0,
        image: "src/assets/food/Zena.png",
        dietaryTags: ["vegan", "vegetarian"],
        allergens: ["Glutine", "Lattosio","Noci"],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "zena",
        name: "Zena",
        desc: "Stracchino, fagiolini, pesto",
        price: 13.0,
        image: "src/assets/food/Zena.png",
        dietaryTags: ["vegan", "vegetarian"],
        allergens: ["Glutine", "Lattosio","Noci"],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "zena",
        name: "Zena",
        desc: "Stracchino, fagiolini, pesto",
        price: 13.0,
        image: "src/assets/food/Zena.png",
        dietaryTags: ["vegan", "vegetarian"],
        allergens: ["Glutine", "Lattosio","Noci"],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "zena",
        name: "Zena",
        desc: "Stracchino, fagiolini, pesto",
        price: 13.0,
        image: "src/assets/food/Zena.png",
        dietaryTags: ["vegan", "vegetarian"],
        allergens: ["Glutine", "Lattosio","Noci"],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "zena",
        name: "Zena",
        desc: "Stracchino, fagiolini, pesto",
        price: 13.0,
        image: "src/assets/food/Zena.png",
        dietaryTags: ["vegan", "vegetarian"],
        allergens: ["Glutine", "Lattosio","Noci"],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "zena",
        name: "Zena",
        desc: "Stracchino, fagiolini, pesto",
        price: 13.0,
        image: "src/assets/food/Zena.png",
        dietaryTags: ["vegan", "vegetarian"],
        allergens: ["Glutine", "Lattosio","Noci"],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "zena",
        name: "Zena",
        desc: "Stracchino, fagiolini, pesto",
        price: 13.0,
        image: "src/assets/food/Zena.png",
        dietaryTags: ["vegan", "vegetarian"],
        allergens: ["Glutine", "Lattosio","Noci"],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "zena",
        name: "Zena",
        desc: "Stracchino, fagiolini, pesto",
        price: 13.0,
        image: "src/assets/food/Zena.png",
        dietaryTags: ["vegan", "vegetarian"],
        allergens: ["Glutine", "Lattosio","Noci"],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "zena",
        name: "Zena",
        desc: "Stracchino, fagiolini, pesto",
        price: 13.0,
        image: "src/assets/food/Zena.png",
        dietaryTags: ["vegan", "vegetarian"],
        allergens: ["Glutine", "Lattosio","Noci"],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "zena",
        name: "Zena",
        desc: "Stracchino, fagiolini, pesto",
        price: 13.0,
        image: "src/assets/food/Zena.png",
        dietaryTags: ["vegan", "vegetarian"],
        allergens: ["Glutine", "Lattosio","Noci"],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "zena",
        name: "Zena",
        desc: "Stracchino, fagiolini, pesto",
        price: 13.0,
        image: "src/assets/food/Zena.png",
        dietaryTags: ["vegan", "vegetarian"],
        allergens: ["Glutine", "Lattosio","Noci"],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "zena",
        name: "Zena",
        desc: "Stracchino, fagiolini, pesto",
        price: 13.0,
        image: "src/assets/food/Zena.png",
        dietaryTags: ["vegan", "vegetarian"],
        allergens: ["Glutine", "Lattosio","Noci"],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "zena",
        name: "Zena",
        desc: "Stracchino, fagiolini, pesto",
        price: 13.0,
        image: "src/assets/food/Zena.png",
        dietaryTags: ["vegan", "vegetarian"],
        allergens: ["Glutine", "Lattosio","Noci"],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "zena",
        name: "Zena",
        desc: "Stracchino, fagiolini, pesto",
        price: 13.0,
        image: "src/assets/food/Zena.png",
        dietaryTags: ["vegan", "vegetarian"],
        allergens: ["Glutine", "Lattosio","Noci"],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "zena",
        name: "Zena",
        desc: "Stracchino, fagiolini, pesto",
        price: 13.0,
        image: "src/assets/food/Zena.png",
        dietaryTags: ["vegan", "vegetarian"],
        allergens: ["Glutine", "Lattosio","Noci"],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "zena",
        name: "Zena",
        desc: "Stracchino, fagiolini, pesto",
        price: 13.0,
        image: "src/assets/food/Zena.png",
        dietaryTags: ["vegan", "vegetarian"],
        allergens: ["Glutine", "Lattosio","Noci"],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "zena",
        name: "Zena",
        desc: "Stracchino, fagiolini, pesto",
        price: 13.0,
        image: "src/assets/food/Zena.png",
        dietaryTags: ["vegan", "vegetarian"],
        allergens: ["Glutine", "Lattosio","Noci"],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
    ],
  },
  {
    id: "secondi",
    name: "Secondi Piatti",
    items: [
      {
        id: "spezzatino",
        name: "Spezzatino di Manzo",
        desc: "Bocconcini di manzo brasati lentamente con patate, carote e piselli",
        price: 14.0,
        image: burgerBbq,
        allergens: ["Sedano"],
        isHalal: true,
        isLactoseFree: true,
        featured: true,
        featuredOrder: 8,
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
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
      {
        id: "brasato-barolo",
        name: "Brasato al Barolo",
        desc: "Brasato di manzo cotto nel Barolo con purea di patate",
        price: 16.0,
        image: burgerBbq,
        allergens: ["Solfiti", "Sedano"],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "pollo-arrosto",
        name: "Pollo Arrosto",
        desc: "Mezzo pollo ruspante arrosto con patate e rosmarino",
        price: 13.0,
        image: burgerAmericano,
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "saltimbocca",
        name: "Saltimbocca alla Romana",
        desc: "Fettine di vitello con prosciutto crudo e salvia in salsa al vino bianco",
        price: 15.0,
        image: burgerClassico,
        allergens: ["Lattosio", "Solfiti"],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "cotoletta-milanese",
        name: "Cotoletta alla Milanese",
        desc: "Cotoletta di vitello impanata con osso, fritta nel burro chiarificato",
        price: 16.0,
        image: burgerAmericano,
        allergens: ["Glutine", "Uova", "Lattosio"],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "salsiccia",
        name: "Salsiccia",
        desc: "Salsiccia di suino alla brace servita con contorno di verdure",
        price: 10.0,
        image: "", // No image demo
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "salsiccia-grigliate",
        name: "Salsicce Grigliate",
        desc: "Salsicce di suino alla brace con peperoni e cipolle grigliate",
        price: 12.0,
        image: burgerBbq,
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "stinco-maiale",
        name: "Stinco di Maiale",
        desc: "Stinco arrosto croccante con crauti e senape in grani",
        price: 15.0,
        image: burgerClassico,
        allergens: ["Senape"],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "arrosticini",
        name: "Arrosticini di Pecora",
        desc: "Spiedini di carne di pecora alla griglia, ricetta abruzzese tradizionale",
        price: 14.0,
        image: burgerAmericano,
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
        id: "brownie",
        name: "Brownie al Cioccolato",
        desc: "Brownie caldo con cuore fondente, gelato alla vaniglia e salsa al caramello",
        price: 7.0,
        image: burgerBbq,
        allergens: ["Glutine", "Lattosio", "Uova", "Frutta a guscio"],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "tiramisu",
        name: "Tiramisù della Casa",
        desc: "Classico tiramisù con mascarpone, savoiardi e cacao amaro",
        price: 5.5,
        image: burgerAmericano,
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
      {
        id: "pancakes",
        name: "Pancakes Stack",
        desc: "Torre di pancakes con sciroppo d'acero, banana caramellata e Nutella",
        price: 8.0,
        image: onionRings,
        allergens: ["Glutine", "Lattosio", "Uova", "Frutta a guscio"],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
    ],
  },
];

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
  priceRange: "€€",
  cuisine: "Hamburger • Pub • Birra artigianale",
  address: "Via Guglielmo Marconi, 18, 15011 Acqui Terme (AL)",
  coordinates: { lat: 44.6765, lng: 8.4659 },
  heroImage: "",
  openingHours: "12:00 - 23:00",
  weeklyHours: [
    { day: "Lunedì", hours: "12:00 - 14:30" },
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
    id: "burgers",
    name: "Burgers con Punta di Manzo",
    items: [
      {
        id: "bufala",
        name: "Bufala",
        desc: "Burger di manzo 180g con mozzarella di bufala DOP, pomodoro pachino e basilico fresco",
        price: 12.0,
        image: "", // No image demo
        allergens: ["Glutine", "Lattosio"],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "americano",
        name: "Tu vuo' fa' l'americano",
        desc: "Punta di manzo 180g, cipolla caramellata, bacon croccante, pomodoro fresco, salsa yogurt, Cheddar fuso, insalata iceberg",
        price: 10.5,
        image: burgerAmericano,
        allergens: ["Glutine", "Lattosio", "Uova"],
        isHalal: true,
        featured: true,
        featuredOrder: 1,
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it", whatsapp: "+39 333 1234567" },
      },
      {
        id: "classico",
        name: "Il Classicone",
        desc: "Doppio smash burger di punta di manzo, formaggio filante, cetriolini, salsa segreta della casa",
        price: 12.0,
        image: burgerClassico,
        allergens: ["Glutine", "Lattosio", "Senape"],
        isLactoseFree: false,
        featured: true,
        featuredOrder: 2,
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it", whatsapp: "+39 333 1234567" },
      },
      {
        id: "bbq",
        name: "BBQ Master",
        desc: "Pulled pork cotto 8 ore, coleslaw cremoso, jalapeños, salsa BBQ affumicata, pan brioche tostato",
        price: 13.5,
        image: burgerBbq,
        allergens: ["Glutine", "Lattosio", "Sedano"],
        isLactoseFree: true,
        featured: true,
        featuredOrder: 3,
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it", whatsapp: "+39 333 1234567" },
      },
      {
        id: "texano",
        name: "Il Texano",
        desc: "Burger 200g con bacon affumicato, anelli di cipolla fritti, formaggio pepper jack, salsa chipotle",
        price: 14.0,
        image: burgerAmericano,
        allergens: ["Glutine", "Lattosio", "Uova"],
        isHalal: true,
        isLactoseFree: true,
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "vegetariano",
        name: "Green Power",
        desc: "Burger vegetale con avocado, pomodori secchi, rucola, maionese vegana e formaggio fuso",
        price: 11.5,
        image: burgerClassico,
        allergens: ["Soia"],
        dietaryTags: ["vegan", "vegetarian", "gluten-free"],
        isHalal: true,
        isLactoseFree: true,
        featured: true,
        featuredOrder: 4,
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "bluecheese",
        name: "Blue Moon",
        desc: "Burger con gorgonzola DOP, noci caramellate, rucola selvatica e riduzione di aceto balsamico",
        price: 13.0,
        image: burgerBbq,
        allergens: ["Glutine", "Lattosio", "Frutta a guscio"],
        isHalal: true,
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "mexican",
        name: "Fuego Mexicano",
        desc: "Burger piccante con guacamole, pico de gallo, jalapeños freschi e sour cream",
        price: 12.5,
        image: burgerAmericano,
        allergens: ["Glutine", "Lattosio"],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "truffle",
        name: "Tartufo Nero",
        desc: "Burger gourmet con crema di tartufo, funghi trifolati, scamorza affumicata e rucola",
        price: 16.0,
        image: burgerClassico,
        allergens: ["Glutine", "Lattosio"],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "bacon-lover",
        name: "Bacon Lover",
        desc: "Triplo bacon croccante, doppio cheddar, cipolla caramellata e salsa barbecue homemade",
        price: 14.5,
        image: burgerBbq,
        allergens: ["Glutine", "Lattosio"],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "chicken-crispy",
        name: "Crispy Chicken",
        desc: "Petto di pollo croccante, insalata iceberg, pomodoro, maionese al lime e salsa sriracha",
        price: 11.0,
        image: burgerAmericano,
        allergens: ["Glutine", "Uova"],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
    ],
  },
  {
    id: "contorni",
    name: "Contorni & Sfizi",
    items: [
      {
        id: "patatine",
        name: "Patatine",
        desc: "Patatine fritte croccanti con sale marino e ketchup",
        price: 4.5,
        image: "", // No image demo
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "patatine-loaded",
        name: "Loaded Fries",
        desc: "Patatine croccanti con cheese sauce, bacon sbriciolato e erba cipollina",
        price: 6.5,
        image: patatine,
        allergens: ["Lattosio"],
        isLactoseFree: false,
        featured: true,
        featuredOrder: 5,
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "onion-rings",
        name: "Onion Rings",
        desc: "Anelli di cipolla in pastella croccante con salsa rosa piccante",
        price: 5.5,
        image: onionRings,
        allergens: ["Glutine", "Uova"],
        isHalal: true,
        isLactoseFree: true,
        featured: true,
        featuredOrder: 6,
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "caesar-salad",
        name: "Caesar Salad",
        desc: "Lattuga romana, parmigiano a scaglie, crostini, salsa Caesar homemade",
        price: 8.0,
        image: insalata,
        allergens: ["Glutine", "Lattosio", "Pesce"],
        dietaryTags: ["vegetarian"],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
    ],
  },
  {
    id: "bevande",
    name: "Bevande & Birre",
    items: [
      {
        id: "birra-chiara",
        name: "Birra Artigianale Chiara",
        desc: "Lager non filtrata, produzione locale, leggermente luppolata con note agrumate",
        price: 5.0,
        image: birra,
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "birra-ambrata",
        name: "Birra Artigianale Ambrata",
        desc: "Amber Ale con sentori di caramello e malto tostato, corpo medio",
        price: 5.5,
        image: birra,
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "birra-ipa",
        name: "IPA Artigianale",
        desc: "India Pale Ale intensamente luppolata con note tropicali e agrumate",
        price: 6.0,
        image: birra,
        isHalal: false,
        isLactoseFree: true,
        featured: true,
        featuredOrder: 7,
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "birra-stout",
        name: "Stout Irlandese",
        desc: "Birra scura cremosa con note di caffè, cioccolato e malto tostato",
        price: 6.0,
        image: birra,
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "cocktail-spritz",
        name: "Aperol Spritz",
        desc: "Classico aperitivo italiano con Aperol, prosecco e soda",
        price: 7.0,
        image: birra,
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "cocktail-mojito",
        name: "Mojito Cubano",
        desc: "Rum bianco, lime fresco, menta, zucchero di canna e soda",
        price: 8.0,
        image: birra,
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "soft-drink",
        name: "Soft Drink",
        desc: "Coca-Cola, Fanta, Sprite o Acqua Tonica alla spina",
        price: 3.0,
        image: birra,
        dietaryTags: ["vegan", "gluten-free"],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
    ],
  },
  {
    id: "birre-vini",
    name: "Birre & Vini",
    items: [
      {
        id: "menabrea",
        name: "Menabrea",
        desc: "Birra artigianale laziale, corpo pieno con note di malto e luppolo locale",
        price: 5.0,
        image: "menabrea.png",
        dietaryTags: ["vegan"],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "peroni",
        name: "Peroni Nastro Azzurro",
        desc: "Birra lager italiana premium, fresca e leggera con note di luppolo",
        price: 4.5,
        image: birra,
        dietaryTags: ["vegan"],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "guinness",
        name: "Guinness Draught",
        desc: "Birra stout irlandese cremosa con note di caffè e cioccolato",
        price: 6.0,
        image: birra,
        dietaryTags: ["vegan"],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "heineken",
        name: "Heineken",
        desc: "Birra lager olandese premium, gusto equilibrato e rinfrescante",
        price: 5.0,
        image: birra,
        dietaryTags: ["vegan"],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "corona",
        name: "Corona Extra",
        desc: "Birra messicana leggera, servita con spicchio di lime",
        price: 5.5,
        image: birra,
        dietaryTags: ["vegan"],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "weissbier",
        name: "Weissbier Bavarese",
        desc: "Birra di frumento tedesca non filtrata con note di banana e chiodi di garofano",
        price: 6.0,
        image: birra,
        dietaryTags: ["vegan"],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "prosecco",
        name: "Prosecco DOC",
        desc: "Prosecco extra dry del Veneto, bollicine fini e fresche",
        price: 5.0,
        image: birra,
        allergens: ["Solfiti"],
        dietaryTags: ["vegan"],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "rosso-monferrato",
        name: "Rosso del Monferrato",
        desc: "Vino rosso piemontese corposo con note di frutti rossi e spezie",
        price: 5.5,
        image: birra,
        allergens: ["Solfiti"],
        dietaryTags: ["vegan"],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "barbera-asti",
        name: "Barbera d'Asti DOCG",
        desc: "Vino rosso piemontese intenso con sentori di ciliegia e viola",
        price: 6.0,
        image: birra,
        allergens: ["Solfiti"],
        dietaryTags: ["vegan"],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "moscato-asti",
        name: "Moscato d'Asti DOCG",
        desc: "Vino bianco dolce e aromatico con bollicine delicate",
        price: 5.5,
        image: birra,
        allergens: ["Solfiti"],
        dietaryTags: ["vegan"],
        contact: { tel: "+39 333 1234567", mail: "info@newcastlepub.it" },
      },
      {
        id: "gavi-cortese",
        name: "Gavi di Gavi DOCG",
        desc: "Vino bianco elegante del Piemonte con note di mela verde e fiori",
        price: 6.5,
        image: birra,
        allergens: ["Solfiti"],
        dietaryTags: ["vegan"],
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

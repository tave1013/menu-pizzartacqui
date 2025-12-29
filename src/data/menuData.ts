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
const gorgoImg = "/assets/food/Gorgo.png";
const crudoImg = "/assets/food/Crudo.png";
const marinataImg = "/assets/food/Marinara.png";
const speckBrieImg = "/assets/food/Speck e Brie.png";
const burgerBbqImg = "/assets/food/burger-bbq.jpg";
const insalataImg = "/assets/food/insalata.jpg";
const onionRingsImg = "/assets/food/onion-rings.jpg";
const acquaGasataImg = "/assets/food/acqua-gasata.png";
const acquaNaturaleImg = "/assets/food/acqua-naturale.png";
const cocaImg = "/assets/food/coca.png";
const cocaZeroImg = "/assets/food/coca-zero.png";
const fantaImg = "/assets/food/fanta.png";
const theLinoneImg = "/assets/food/the-limone.png";
const thePescaImg = "/assets/food/the-pesca.png";
const spriteImg = "/assets/food/sprite.png";
const birraImg = "/assets/food/birra.jpg";
const ichnusaImg = "/assets/food/ichnusa.png";
const menabreaImg = "/assets/food/menabrea.png";
const tuborgenImg = "/assets/food/tuborg.png";
const aiformaggiImg = "/assets/food/ai-formaggi.png";

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
  description?: string;
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
  googleBusinessUrl?: string;
  googleReviewUrl?: string;
  googleMapsUrl?: string;
}

export const restaurantInfo: RestaurantInfo = {
  name: "PizzArt",
  description: "Pub tradizionale con hamburger artigianali e birre selezionate dal 2015.",
  rating: 4.6,
  reviewCount: 387,
  priceRange: "€€€",
  cuisine: "Pizzeria ad Acqui Terme",
  address: "Via Guglielmo Marconi, 18, 15011 Acqui Terme (AL)",
  coordinates: { lat: 44.6765, lng: 8.4659 },
  heroImage: "",
  openingHours: "18:00 - 22:30",
  weeklyHours: [
    { day: "Lunedì", hours: "12:30 - 22:30" },
    { day: "Martedì", hours: "", closed: true },
    { day: "Mercoledì", hours: "18:30 - 22:30," },
    { day: "Giovedì", hours: "18:30 - 22:30," },
    { day: "Venerdì", hours: "18:30 - 22:30," },
    { day: "Sabato", hours: "18:30 - 22:30," },
    { day: "Domenica", hours: "18:00 - 22:30" },
  ],
  deliveryTime: "25-40 min",
  deliverooUrl: "https://deliveroo.it/it/menu/Alessandria/acqui-terme/pizzart-acqui-terme/?geohash=spyn0tjdewgp",
  bookingPhone: "+39 3914272540",
  phone: "+39 0144 123456",
  email: "info@pizzartacquiterme.com",
  facebookUrl: "https://www.facebook.com/profile.php?id=100083643546473",
  facebookName: "PizzArt",
  instagramUrl: "https://www.instagram.com/pizzartacquiterme/",
  instagramHandle: "@pizzartacquiterme",
  googleBusinessUrl: "https://www.google.com/search?q=pizzart+acqui+terme",
  googleReviewUrl: "https://g.page/r/CcMEQOqoXLdfEBM/review",
  googleMapsUrl: "https://www.google.com/maps/place/PizzArt/@44.67656,8.4659474,16z/data=!3m1!4b1!4m6!3m5!1s0x12d2d54a5b7562a5:0x5fb75ca8ea4004c3!8m2!3d44.67656!4d8.4659474",
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
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
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
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com", whatsapp: "+39 3914272540" },
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
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com", whatsapp: "+39 3914272540" },
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
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com", whatsapp: "+39 3914272540" },
      },
      {
        id: "la-regina",
        name: "La Regina",
        desc: "Pomodoro, bufala campana DOP, basilico, olio e.v.o.",
        price: 12.0,
        image: reginaImg,
        allergens: ["Glutine", "Lattosio"],
        dietaryTags: ["vegetarian"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
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
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "raffinata",
        name: "Raffinata",
        desc: "Pomodoro, mozzarella fiordilatte, in uscita prosciutto crudo brado Barabino, stracciatella di burrata, pomodorini datterini e rucola",
        price: 16.5,
        image: raffinataImg,
        allergens: ["Glutine", "Lattosio"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "stracciata",
        name: "Stracciata",
        desc: "Pomodoro, stracciatella di burrata DOP, basilico, olio E.V.O.",
        price: 12.0,
        image: "",
        allergens: ["Glutine", "Lattosio"],
        dietaryTags: ["vegetarian"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "vegana",
        name: "Vegana",
        desc: "Crema di patate, carpaccio di verdure, intingolo d’aglio, olive taggiasche, origano",
        price: 12.0,
        image: "",
        allergens: ["Glutine"],
        dietaryTags: ["vegan"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "anciova",
        name: "L'anciova",
        desc: "Pomodoro, bufala campana DOP, acciughe, origano",
        price: 13.0,
        image: anciovaImg,
        allergens: ["Glutine", "Lattosio"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
    ],
  },
  {
    id: "pizart",
    name: "Pizzart",
      description: "Pizze artistiche, con abbinamenti saporiti e particolari",
    items: [
      {
        id: "monet",
        name: "Monet",
        desc: "Pomodoro, crema di pomodori secchi, cipolle di Tropea, burrata, acciughe del Cantabrico, olive, intingolo d'aglio, origano, basilico",
        price: 21.0,
        image: monetImg,
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
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
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
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
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "chagal",
        name: "Chagall",
        desc: "Fiordilatte, burrata, pancetta arrostita aromatizzata, uovo all’occhio di bue, crumble croccante di pecorino, pepe",
        price: 18.0,
        image: chagallImg,
        allergens: ["Glutine", "Lattosio", "Uova"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "cimabue",
        name: "Cimabue",
        desc: "Pomodoro, funghi porcini, stracciatella di burrata, prosciutto cotto fuori cottura",
        price: 17.0,
        image: cimabueImg,
        allergens: ["Glutine", "Lattosio"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "van-gogh",
        name: "Van Gogh",
        desc: "Fiordilatte, salsiccia marinata nel vino Porto, olive, pinoli, pesto",
        price: 18.0,
        image: vanGoghImg,
        allergens: ["Glutine", "Lattosio", "Frutta a guscio"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "dali",
        name: "Dalì",
        desc: "Fiordilatte, toma piemontese, gorgonzola, pere caramellate",
        price: 17.0,
        image: daliImg,
        dietaryTags: ["vegetarian"],
        allergens: ["Glutine", "Lattosio"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
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
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "da-vinci",
        name: "Da Vinci",
        desc: "Fiordilatte, gamberi*, rucola, emulsione di agrumi, stracciata, galssa dolce di aceto balsamico",
        price: 19.0,
        image: daVinciImg,
        allergens: ["Glutine", "Lattosio", "Crostacei"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
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
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "zena",
        name: "Zena",
        desc: "Stracchino, fagiolini, pesto",
        price: 13.0,
        image: zenaImg,
        dietaryTags: ["vegetarian"],
        allergens: ["Glutine", "Lattosio", "Frutta a guscio"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "focaccia-bianca",
        name: "Focaccia Bianca",
        desc: "Olio, sale",
        price: 5.0,
        image: "",
        dietaryTags: ["vegetarian"],
        allergens: ["Glutine", "Lattosio", "Frutta a guscio"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
    ],
  },
  {
    id: "le-classiche",
    name: "Le Classiche",
    description: "Le nostre deliziose pizze classiche, le più famose e conosciute in Italia e nel resto del mondo. Abbinamenti sfiziosi che ne non tramontano mai!",
    items: [
      {
        id: "quattro-stagioni",
        name: "4 Stagioni",
        desc: "Pomodoro, fior di latte, funghi champignon, carciofini, olive, prosciutto cotto fuori cottura",
        price: 12.0,
        image: "",
        allergens: ["Glutine", "Lattosio"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "bismark",
        name: "Bismark",
        desc: "Pomodoro, fiordilatte, uovo, prosciutto cotto fuori cottura",
        price: 12.0,
        image: "",
        allergens: ["Glutine", "Lattosio", "Uova"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "calzone",
        name: "Calzone",
        desc: "Pomodoro, fiordilatte, prosciutto cotto",
        price: 10.5,
        image: "",
        allergens: ["Glutine", "Lattosio"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "capricciosa",
        name: "Capricciosa",
        desc: "Pomodoro, fiordilatte, funghi champignon, carciofini, olive, prosciutto cotto fuori cottura",
        price: 13.0,
        image: "",
        allergens: ["Glutine", "Lattosio"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "gorgonzola",
        name: "Gorgonzola",
        desc: "Pomodoro, fiordilatte, gorgonzola",
        price: 10.0,
        image: gorgoImg,
        allergens: ["Glutine", "Lattosio"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "contadina",
        name: "Contadina",
        desc: "Pomodoro, fiordilatte, funghi champignon, salsiccia, cipolle, olive",
        price: 14.5,
        image: "",
        allergens: ["Glutine", "Lattosio"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "crudo",
        name: "Crudo",
        desc: "Pomodoro, fiordilatte, prosciutto crudo fuori cottura",
        price: 12.0,
        image: crudoImg,
        allergens: ["Glutine", "Lattosio"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "marinara",
        name: "Marinara",
        desc: "Pomodoro, intingolo d'aglio, origano",
        price: 6.5,
        image: marinataImg,
        allergens: ["Glutine"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "la-piemontese",
        name: "La Piemontese",
        desc: "Pomodoro, fior di latte, toma piemontese, cotto",
        price: 12.0,
        image: "",
        allergens: ["Glutine", "Lattosio"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "panna-speck",
        name: "Panna e Speck",
        desc: "Mozzarella fiordilatte, panna, speck in uscita",
        price: 12.0,
        image: "",
        allergens: ["Lattosio"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "prosciutto-funghi",
        name: "Prosciutto e Funghi",
        desc: "Pomodoro, mozzarella fiordilatte, funghi champignon, prosciutto cotto Barabino fuori cottura",
        price: 11.0,
        image: "",
        allergens: ["Glutine", "Lattosio"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "pugliese",
        name: "Pugliese",
        desc: "Pomodoro, mozzarella fiordilatte, cipolle di Tropea",
        price: 10.0,
        image: "",
        allergens: ["Glutine", "Lattosio"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "siciliana",
        name: "Siciliana",
        desc: "Pomodoro, mozzarella fiordilatte, acciughe, capperi, olive, origano",
        price: 13.0,
        image: "",
        allergens: ["Glutine", "Lattosio", "Pesce"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "vegetariana",
        name: "Vegetariana",
        desc: "Pomodoro, mozzarella fiordilatte, melanzane, zucchine, peperoni",
        price: 11.0,
        image: "",
        allergens: ["Glutine", "Lattosio"],
        dietaryTags: ["vegetarian"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "napoli",
        name: "Napoli",
        desc: "Pomodoro, fiordilatte, acciughe, origano",
        price: 10.0,
        image: "",
        allergens: ["Glutine", "Lattosio", "Pesce"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "patatine",
        name: "Patatine",
        desc: "Pomodoro, fiordilatte, patatine fritte",
        price: 10.5,
        image: "",
        allergens: ["Glutine", "Lattosio"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "wurstel-patatine",
        name: "Würstel e Patatine",
        desc: "Pomodoro, fiordilatte, wurstel, patatine fritte",
        price: 13.0,
        image: "",
        allergens: ["Glutine", "Lattosio"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "salsiccia",
        name: "Salsiccia",
        desc: "Pomodoro, fiordilatte, salsiccia",
        price: 11.0,
        image: "",
        allergens: ["Glutine", "Lattosio"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "speck-brie",
        name: "Speck e Brie",
        desc: "Fiordilatte, brie, speck fuori cottura",
        price: 12.0,
        image: speckBrieImg,
        allergens: ["Glutine", "Lattosio"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "vegana-classica",
        name: "Vegana",
        desc: "Crema di patate, carpaccio di verdure, intingolo d'aglio, olive taggiasche, origano",
        price: 12.0,
        image: "",
        allergens: ["Glutine"],
        dietaryTags: ["vegan"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "margherita-classica",
        name: "Margherita",
        desc: "Pomodoro, mozzarella fiordilatte, basilico",
        price: 8.0,
        image: margheritaImg,
        allergens: ["Glutine", "Lattosio"],
        dietaryTags: ["vegetarian"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "ai-formaggi-classica",
        name: "Ai Formaggi",
        desc: "Mozzarella fiordilatte, gorgonzola DOP, squacquerone e toma piemontese",
        price: 13.0,
        image: aiformaggiImg,
        allergens: ["Glutine", "Lattosio"],
        dietaryTags: ["vegetarian"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
    ],
  },
  /* CATEGORIA DOLCI RIMOSSA TEMPORANEAMENTE
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
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "gelato",
        name: "Coppa Gelato Artigianale",
        desc: "Tre gusti a scelta con panna montata, granella e topping",
        price: 5.0,
        image: patatine,
        allergens: ["Lattosio", "Frutta a guscio"],
        dietaryTags: ["gluten-free"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
    ],
  },*/
  {
    id: "bevande",
    name: "Bevande",
    items: [
      {
        id: "coca-zero",
        name: "Coca Cola 0",
        desc: "Lattina 33 cl",
        price: 4.0,
        image: cocaZeroImg,
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "coca",
        name: "Coca Cola",
        desc: "Lattina 33 cl",
        price: 4.0,
        image: cocaImg,
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "estath-limone",
        name: "Estathé Limone",
        desc: "Lattina 33 cl",
        price: 4.0,
        image: theLinoneImg,
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "fanta",
        name: "Fanta",
        desc: "Lattina 33 cl",
        price: 4.0,
        image: fantaImg,
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "acqua-naturale",
        name: "Acqua Naturale",
        desc: "Bottiglietta da 0,5 cl",
        price: 1.5,
        image: acquaNaturaleImg,
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "acqua-frizzante",
        name: "Acqua Frizzante",
        desc: "Bottiglietta da 0,5 cl",
        price: 1.5,
        image: acquaGasataImg,
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "estath-pesca",
        name: "Estathé Pesca",
        desc: "Lattina 33 cl",
        price: 4.0,
        image: thePescaImg,
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "sprite",
        name: "Sprite",
        desc: "Lattina 33 cl",
        price: 4.0,
        image: spriteImg,
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
    ],
  },
  {
    id: "birre",
    name: "Birre",
    items: [
      {
        id: "menabrea",
        name: "Menabrea",
        desc: "33 cl",
        price: 4.5,
        image: menabreaImg,
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "tuborg",
        name: "Tuborg",
        desc: "66 cl",
        price: 5.5,
        image: tuborgenImg,
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "ichnusa-non-filtrata",
        name: "Ichnusa Non Filtrata",
        desc: "33 cl",
        price: 4.5,
        image: ichnusaImg,
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "birra-senza-glutine",
        name: "Birra Senza Glutine",
        desc: "33 cl",
        price: 5.0,
        image: "",
        allergens: [],
        dietaryTags: ["gluten-free"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "birra-analcolica",
        name: "Birra Analcolica",
        desc: "33 cl",
        price: 5.0,
        image: "",
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
    ],
  },
  {
    id: "vini",
    name: "Vini",
    items: [
      {
        id: "nebbiolo-tonino",
        name: "Nebbiolo Tonino",
        desc: "Vino rosso piemontese",
        price: 35.0,
        image: "",
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "arneis-tonino",
        name: "Arneis Tonino",
        desc: "Vino bianco piemontese",
        price: 28.0,
        image: "",
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "barbera-boidina",
        name: "Barbera Boidina",
        desc: "Vino rosso",
        price: 28.0,
        image: "",
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "barbera-cascina-castlet",
        name: "Barbera Cascina Castlet",
        desc: "Vino rosso",
        price: 34.0,
        image: "",
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "spumante-orsola",
        name: "Spumante Orsola",
        desc: "Spumante",
        price: 18.0,
        image: "",
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "ribolla-gialla",
        name: "Ribolla Gialla",
        desc: "Vino bianco",
        price: 26.0,
        image: "",
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
    ],
  },
];

// Utility: trova la categoria di un item dato il suo ID
export function findCategoryByItemId(itemId: string): string | undefined {
  for (const category of menuCategories) {
    if (category.items.some(item => item.id === itemId)) {
      return category.id;
    }
  }
  return undefined;
}
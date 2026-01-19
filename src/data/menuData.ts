// Percorsi pubblici per le immagini
const margheritaImg = "/assets/food/Margherita.webp";
const caronteImg = "/assets/food/Caronte.webp";
const formaggiImg = "/assets/food/ai-formaggi.webp";
const reginaImg = "/assets/food/la-regina.webp";
const raffinataImg = "/assets/food/Raffinata.webp";
const anciovaImg = "/assets/food/anciova.webp";
const monetImg = "/assets/food/Monet.webp";
const picassoImg = "/assets/food/Picasso.webp";
const renoirImg = "/assets/food/Renoir.webp";
const chagallImg = "/assets/food/Chagall.webp";
const cimabueImg = "/assets/food/Cimabue.webp";
const vanGoghImg = "/assets/food/van-gogh.webp";
const daliImg = "/assets/food/Dalì.webp";
const michelangeloImg = "/assets/food/Michelangelo.webp";
const daVinciImg = "/assets/food/da-vinci.webp";
const sfiziosaImg = "/assets/food/Sfiziosa.webp";
const zenaImg = "/assets/food/Zena.webp";
const gorgoImg = "/assets/food/Gorgo.webp";
const crudoImg = "/assets/food/Crudo.webp";
const marinataImg = "/assets/food/Marinara.webp";
const speckBrieImg = "/assets/food/Speck e Brie.webp";
const acquaGasataImg = "/assets/food/acqua-gasata.webp";
const acquaNaturaleImg = "/assets/food/acqua-naturale.webp";
const cocaImg = "/assets/food/coca.webp";
const cocaZeroImg = "/assets/food/coca-zero.webp";
const cocaVetroImg = "/assets/food/Coca-cola-vetro.webp";
const cocaZeroVetroImg = "/assets/food/coca-cola-zero-vetro.webp";
const fantaImg = "/assets/food/fanta.webp";
const theLinoneImg = "/assets/food/the-limone.webp";
const thePescaImg = "/assets/food/the-pesca.webp";
const spriteImg = "/assets/food/sprite.webp";
const birraImg = "/assets/food/birra.jpg";
const ichnusaImg = "/assets/food/ichnusa.webp";
const ichnusaNonFiltrataImg = "/assets/food/ichnusa-non-filtrata.webp";
const menabreaImg = "/assets/food/menabrea.webp";
const menabreaAmbrataImg = "/assets/food/menabrea ambrata.webp";
const menabreaRossaImg = "/assets/food/menabrea rossa.webp";
const tuborgImg = "/assets/food/Tuborg.webp";
const hoegardenImg = "/assets/food/hoegarden.webp";
const canePacificImg = "/assets/food/pacific.webp";
const canePilsnerImg = "/assets/food/pilsner.webp";
const caneLagerImg = "/assets/food/lager.webp";
const aiformaggiImg = "/assets/food/ai-formaggi.webp";
// Birre alla spina
const birraBiondaPiccolaImg = "/assets/food/Birra-bionda-piccola.png";
const birraBiondaMediaImg = "/assets/food/Birra-bionda-media.png";
const birraRossaPiccolaImg = "/assets/food/Birra-rossa-piccola.png";
const birraRossaMediaImg = "/assets/food/Birra-rossa-media.png";
// Birre bicicletta
const biciPiccolaBiondaImg = "/assets/food/Bici-piccola-bionda.png";
const biciMediaBiondaImg = "/assets/food/Bici-media-bionda.png";
const biciPiccolaRossaImg = "/assets/food/Bici-piccola-rossa.png";
const biciMediaRossaImg = "/assets/food/Bici-media-rossa.png";
// Vini sfusi
const quartinoRossoSfusoImg = "/assets/food/Quartino-rosso-sfuso.png";
const mezzoRossoSfusoImg = "/assets/food/Mezzo-rosso-sfuso.png";
const litroRossoSfusoImg = "/assets/food/Litro-rosso-sfuso.png";
const quartinoBiancoSfusoImg = "/assets/food/Quartino-bianco-sfuso.png";
const mezzoBiancoSfusoImg = "/assets/food/Mezzo-bianco-sfuso.png";
const litroBiancoSfusoImg = "/assets/food/Litro-bianco-sfuso.png";

export type DietaryTag = "vegan" | "vegetarian" | "gluten-free" | "spicy";

// ═══════════════════════════════════════════════════════════════════════════
// GESTIONE SEZIONI POPUP PER PRODOTTO E CATEGORIA
// ═══════════════════════════════════════════════════════════════════════════
//
// Puoi escludere sezioni specifiche dal popup dei prodotti in due modi:
//
// 1️⃣ ESCLUSIONE PER CATEGORIA (nel file src/components/menu/ItemDetailModal.tsx):
//
//    Modifica le costanti per escludere sezioni da intere categorie:
//    - EXCLUDED_EXTRA_CATEGORIES: esclude "Ingredienti Extra" dalla categoria
//    - CATEGORIE_SENZA_INGREDIENTI: esclude "Rimuovi Ingredienti" dalla categoria
//
//    Esempio aggiunto: "le-focacce" è stata esclusa da EXCLUDED_EXTRA_CATEGORIES
//    quindi tutti i prodotti in "Le Focacce" non mostreranno "Ingredienti Extra"
//
// 2️⃣ ESCLUSIONE PER PRODOTTO SINGOLO (nel MenuItem qui in menuData.ts):
//
//    Aggiungi proprietà booleane nel MenuItem:
//    - excludeGlutenFree: true        // Nasconde "Impasto senza glutine"
//    - excludeExtraIngredients: true  // Nasconde "Ingredienti Extra"
//
//    Esempio:
//    {
//      id: "focaccia-bianca",
//      name: "Focaccia Bianca",
//      desc: "Olio, sale",
//      price: 4.0,
//      excludeExtraIngredients: true,  // Non mostra Ingredienti Extra
//      excludeGlutenFree: true,         // Non mostra Senza Glutine
//      contact: { tel: "...", mail: "..." }
//    }
//
// ═══════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════
// GESTIONE PRODOTTI ESAURITI
// ═══════════════════════════════════════════════════════════════════════════
// 
// Per disattivare temporaneamente un prodotto (renderlo "esaurito"):
// Aggiungi la proprietà: isAvailable: false
// 
// Esempio:
// {
//   id: "margherita",
//   name: "Margherita",
//   desc: "Pomodoro, mozzarella, basilico",
//   price: 6.50,
//   isAvailable: false, // ← Prodotto esaurito
//   ...
// }
// 
// Quando isAvailable è false:
// - La card appare in grigio (grayscale + opacity ridotta)
// - Mostra "Prodotto esaurito" al posto della descrizione
// - Il pulsante "Aggiungi" viene disabilitato
// - Nel popup, il pulsante ordine è sostituito da "Al momento non disponibile"
// 
// Per riattivare il prodotto, rimuovi la proprietà o impostala a true.
// ═══════════════════════════════════════════════════════════════════════════

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
  excludeGlutenFree?: boolean; // Se true, nasconde opzione senza glutine per questo prodotto
  excludeExtraIngredients?: boolean; // Se true, nasconde sezione ingredienti extra per questo prodotto
  isAvailable?: boolean; // Se false, il prodotto appare come "esaurito" (default: true)
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

export interface SpecialHoliday {
  date: string; // Formato: YYYY-MM-DD
  name: string; // Nome della festività
  hours?: string; // Orario speciale (se aperto)
  closed?: boolean; // true se chiuso
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
  description: "Pizzeria artigianale  ad Acqui Terme",
  rating: 4.8,
  reviewCount: 405,
  priceRange: "€€€",
  cuisine: "Pizzeria ad Acqui Terme",
  address: "Via Guglielmo Marconi, 18, 15011 Acqui Terme (AL)",
  coordinates: { lat: 44.6765, lng: 8.4659 },
  heroImage: "",
  openingHours: "18:30 - 22:30",
  weeklyHours: [
    { day: "Lunedì", hours: "8:30 - 22:30" },
    { day: "Martedì", hours:"8:30 - 22:30" },
    { day: "Mercoledì", hours: "8:30 - 22:30" },
    { day: "Giovedì", hours: "8:30 - 22:30" },
    { day: "Venerdì", hours: "8:30 - 22:30" },
    { day: "Sabato", hours: "8:30 - 22:30" },
    { day: "Domenica", hours: "8:00 - 22:30" },
  ],
  deliveryTime: "25-40 min",
  deliverooUrl: "https://deliveroo.it/it/menu/Alessandria/acqui-terme/pizzart-acqui-terme/?geohash=spyn0tjdewgp",
  bookingPhone: "366 990 4236",
  phone: "+39 366 990 4236",
  email: "vanessapizzart@gmail.com",
  facebookUrl: "https://www.facebook.com/profile.php?id=100083643546473",
  facebookName: "PizzArt",
  instagramUrl: "https://www.instagram.com/pizzartacquiterme/",
  instagramHandle: "@pizzartacquiterme",
  googleBusinessUrl: "https://www.google.com/search?q=pizzart+acqui+terme",
  googleReviewUrl: "https://g.page/r/CcMEQOqoXLdfEBM/review",
  googleMapsUrl: "https://www.google.com/maps?ll=44.67656,8.465947&z=15&t=m&hl=it&gl=IT&mapclient=embed&cid=6897083234895529155",
};

/**
 * ORARI SPECIALI FESTIVITÀ
 * 
 * Sistema intelligente per gestire orari festivi.
 * Le festività nei prossimi 7 giorni appariranno automaticamente nel popup orari.
 * 
 * FORMATO:
 * - date: 'YYYY-MM-DD' (es. '2026-01-06' per Epifania)
 * - name: Nome della festività da mostrare
 * - hours: Orario speciale (se aperto), es. '12:00 - 22:00'
 * - closed: true (se chiuso per quella festività)
 * 
 * ESEMPI:
 * { date: '2026-01-01', name: 'Capodanno', closed: true }
 * { date: '2026-01-06', name: 'Epifania', hours: '18:30 - 22:30' }
 * { date: '2026-04-25', name: 'Festa della Liberazione', hours: '12:00 - 23:00' }
 */
export const SPECIAL_OPENING_HOURS: SpecialHoliday[] = [
  // Gennaio
  { date: '2026-01-01', name: 'Capodanno', closed: true },
  { date: '2026-01-06', name: 'Epifania', hours: '18:30 - 22:30' },
  
  // Aprile (Pasqua e Pasquetta - DATE VARIABILI, aggiornare ogni anno)
  { date: '2026-04-05', name: 'Pasqua', hours: '12:00 - 22:30' },
  { date: '2026-04-06', name: 'Pasquetta', hours: '12:00 - 22:30' },
  { date: '2026-04-25', name: 'Festa della Liberazione', hours: '18:30 - 22:30' },
  
  // Maggio
  { date: '2026-05-01', name: 'Festa del Lavoro', closed: true },
  
  // Giugno
  { date: '2026-06-02', name: 'Festa della Repubblica', hours: '18:30 - 22:30' },
  
  // Agosto
  { date: '2026-08-15', name: 'Ferragosto', hours: '19:00 - 23:00' },
  
  // Novembre
  { date: '2026-11-01', name: 'Tutti i Santi', closed: true },
  
  // Dicembre
  { date: '2026-12-08', name: "Immacolata Concezione", hours: '18:30 - 22:30' },
  { date: '2026-12-25', name: 'Natale', closed: true },
  { date: '2026-12-26', name: 'Santo Stefano', hours: '12:00 - 22:30' },
  { date: '2026-12-31', name: 'San Silvestro', hours: '18:30 - 01:00' },
];

export const menuCategories: Category[] = [
  {
    id: "top-ten",
    name: "Le Top Ten",
    items: [
      {
        id: "margherita",
        name: "Margherita",
        desc: "Pomodoro, fiordilatte, basilico",
        price: 6.0,
        image: margheritaImg,
        dietaryTags: ["vegetarian"],
        allergens: ["Glutine", "Lattosio"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "caronte",
        name: "Caronte",
        desc: "Pomodoro, fiordilatte, spianata piccante fuori cottura",
        price: 8.0,
        image: caronteImg,
        dietaryTags: ["spicy"],
        allergens: ["Glutine", "Lattosio"],
        featured: true,
        featuredOrder: 1,
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com", whatsapp: "+39 3914272540" },
      },
      {
        id: "anciova",
        name: "L'anciova",
        desc: "Pomodoro, bufala, acciughe, origano",
        price: 10.0,
        image: anciovaImg,
        allergens: ["Glutine", "Lattosio", "Pesce"],
        featured: true,
        featuredOrder: 2,
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com", whatsapp: "+39 3914272540" },
      },
      {
        id: "ai-formagi",
        name: "Ai formaggi",
        desc: "Fiordilatte, gorgonzola, squacquerone, toma piemontese",
        price: 9.5,
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
        desc: "Pomodoro, bufala, basilico, olio e.v.o.",
        price: 9.0,
        image: reginaImg,
        allergens: ["Glutine", "Lattosio"],
        dietaryTags: ["vegetarian"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "sfiziosa",
        name: "Sfiziosa",
        desc: "Rucola, scaglie di grana, pomodorini",
        price: 11.0,
        image: sfiziosaImg,
        allergens: ["Glutine", "Lattosio"],
        featured: true,
        featuredOrder: 4,
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "verace",
        name: "Verace",
        desc: "Fiordilatte, provola affumicata, salsiccia, friarielli*",
        price: 10.0,
        image: "",
        allergens: ["Glutine", "Lattosio"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "raffinata",
        name: "Raffinata",
        desc: "Pomodoro, fiordilatte, prosciutto crudo fuori cottura, stracciatella di burrata, pomodorini datterini e rucola",
        price: 13.0,
        image: raffinataImg,
        allergens: ["Glutine", "Lattosio"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "stracciata",
        name: "Stracciata",
        desc: "Pomodoro, stracciatella di burrata, basilico, olio E.V.O.",
        price: 9.0,
        image: "",
        allergens: ["Glutine", "Lattosio"],
        dietaryTags: ["vegetarian"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "vegana",
        name: "Vegana",
        desc: "Crema di patate, carpaccio di verdure, intingolo d’aglio, olive taggiasche, origano",
        price: 9.0,
        image: "",
        allergens: ["Glutine"],
        dietaryTags: ["vegan", "vegetarian"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "anciova",
        name: "L'anciova",
        desc: "Pomodoro, bufala, acciughe, origano",
        price: 10.0,
        image: anciovaImg,
        allergens: ["Glutine", "Lattosio", "Pesce"],
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
        id: "raffaello",
        name: "Raffaello",
        desc: "Fiordilatte, funghi porcini*, prosciutto crudo fuori cottura, burrata, polvere di porcini*, basilico",
        price: 16.0,
        image: "",
        allergens: ["Glutine", "Lattosio"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "bosch",
        name: "Bosch",
        desc: "Fiordilatte, funghi porcini*, patate al forno sottili, salsiccia, salsa all'aglio e prezzemolo, prezzemolo",
        price: 14.0,
        image: "",
        allergens: ["Glutine", "Lattosio"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "artemisia",
        name: "Artemisia",
        desc: "Fiordilatte, scamorza affumicata, porchetta, patate al forno, rosmarino, maionese al tartufo",
        price: 15.0,
        image: "",
        allergens: ["Glutine", "Lattosio", "Frutta a guscio"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "monet",
        name: "Monet",
        desc: "Pomodoro, crema di pomodori secchi, cipolle di Tropea, burrata, acciughe del Cantabrico, olive, intingolo d'aglio, origano, basilico",
        price: 16.0,
        image: monetImg,
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
        allergens: ["Glutine", "Lattosio", "Pesce"],
      },
      {
        id: "picasso",
        name: "Picasso",
        desc: "Fiordilatte, burrata, mortadella fuori cottura, crema di pistacchio, granella di pistacchio, basilico",
        price: 14.0,
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
        price: 13.0,
        image: renoirImg,
        dietaryTags: ["spicy"],
        allergens: ["Glutine", "Lattosio"],
        featured: true,
        featuredOrder: 6,
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "chagal",
        name: "Chagall",
        desc: "Fiordilatte, burrata, pancetta arrostita aromatizzata fuori cottura, uovo all’occhio di bue, crumble croccante di pecorino, pepe",
        price: 14.0,
        image: chagallImg,
        allergens: ["Glutine", "Lattosio", "Uova"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "cimabue",
        name: "Cimabue",
        desc: "Pomodoro, funghi porcini*, stracciatella di burrata, prosciutto cotto fuori cottura, basilico",
        price: 13.0,
        image: cimabueImg,
        allergens: ["Glutine", "Lattosio"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "van-gogh",
        name: "Van Gogh",
        desc: "Fiordilatte, salsiccia marinata nel vino, olive, pinoli, pesto, basilico",
        price: 14.0,
        image: vanGoghImg,
        allergens: ["Glutine", "Lattosio", "Frutta a guscio", "Solfiti"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "dali",
        name: "Dalì",
        desc: "Fiordilatte, toma piemontese, gorgonzola, pere caramellate, noci",
        price: 13.0,
        image: daliImg,
        dietaryTags: ["vegetarian"],
        allergens: ["Glutine", "Lattosio", "Frutta a guscio"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "michelangelo",
        name: "Michelangelo",
        desc: "Crema di patate, fagiolini*, stracciatella di burrata, pesto, basilico",
        price: 13.0,
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
        desc: "Fiordilatte, gamberetti*, rucola, emulsione agli agrumi, glassa di aceto balsamico",
        price: 15.0,
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
        id: "fugassa-sottile-al-formaggio",
        name: "Fugassa Sottile al Formaggio",
        desc: "Stracchino",
        price: 12.0,
        image: "",
        allergens: ["Glutine", "Lattosio"],
        dietaryTags: ["vegetarian"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "pataccia",
        name: "Pataccia - Focaccia tonda",
        desc: "Patate al forno sottili, rosmarino, olio extravergine",
        price: 6.0,
        image: "",
        allergens: ["Glutine"],
        dietaryTags: ["vegetarian", "vegan"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "focaccia-tonnaro",
        name: "Focaccia Tonnarò",
        desc: "Vitello sottile, tradizionale salsa tonnata, capperi",
        price: 15.0,
        image: "",
        allergens: ["Glutine", "Pesce", "Uova"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "patatine",
        name: "Porzione di patatine",
        desc: "-",
        price: 5.0,
        image: "",
        dietaryTags: ["vegetarian", "vegan"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "sfiziosa",
        name: "Sfiziosa",
        desc: "Rucola, scaglie di grana, pomodorini",
        price: 11.0,
        image: sfiziosaImg,
        allergens: ["Glutine", "Lattosio"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "zena",
        name: "Zena",
        desc: "Stracchino, fagiolini*, pesto, basilico",
        price: 10.0,
        image: zenaImg,
        dietaryTags: ["vegetarian"],
        allergens: ["Glutine", "Lattosio", "Frutta a guscio"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "focaccia-bianca",
        name: "Focaccia Bianca",
        desc: "Olio, sale",
        price: 4.0,
        image: "",
        dietaryTags: ["vegetarian", "vegan"],
        allergens: ["Glutine"],
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
        id: "stracchino-rucola",
        name: "Stracchino e Rucola",
        desc: "Fior di latte, stracchino, rucola",
        price: 8.0,
        image: "",
        allergens: ["Glutine", "Lattosio"],
        dietaryTags: ["vegetarian"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "rustica",
        name: "Rustica",
        desc: "Pomodoro, fiordilatte, salsiccia, peperoni, cipolle, scamorza affumicata, basilico",
        price: 12.0,
        image: "",
        allergens: ["Glutine", "Lattosio"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "pro-marinara",
        name: "Pro Marinara",
        desc: "Crema di pomodori secchi, pomodoro, olive, intingolo d'aglio, origano, basilico",
        price: 8.0,
        image: "",
        allergens: ["Glutine"],
        dietaryTags: ["vegetarian", "vegan"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "piu-margherita",
        name: "Più Margherita",
        desc: "Pomodoro, basilico in cottura, fiordilatte, parmigiano, olio extravergine, basilico fuori cottura",
        price: 7.5,
        image: "",
        allergens: ["Glutine", "Lattosio"],
        dietaryTags: ["vegetarian"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "funghi",
        name: "Funghi",
        desc: "Pomodoro, fiordilatte, funghi champignon*",
        price: 7.5,
        image: "",
        allergens: ["Glutine", "Lattosio"],
        dietaryTags: ["vegetarian"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "quattro-stagioni",
        name: "4 Stagioni",
        desc: "Pomodoro, fiordilatte, funghi champignon*, carciofini, olive, prosciutto cotto fuori cottura",
        price: 9.0,
        image: "",
        allergens: ["Glutine", "Lattosio"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "bismark",
        name: "Bismark",
        desc: "Pomodoro, fiordilatte, uovo, prosciutto cotto fuori cottura",
        price: 9.0,
        image: "",
        allergens: ["Glutine", "Lattosio", "Uova"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "calzone",
        name: "Calzone",
        desc: "Pomodoro, fiordilatte, prosciutto cotto fuori cottura",
        price: 8.0,
        image: "",
        allergens: ["Glutine", "Lattosio"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "capricciosa",
        name: "Capricciosa",
        desc: "Pomodoro, fiordilatte, funghi champignon*, carciofini, olive, prosciutto cotto fuori cottura",
        price: 10.0,
        image: "",
        allergens: ["Glutine", "Lattosio"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "gorgonzola",
        name: "Gorgonzola",
        desc: "Pomodoro, fiordilatte, gorgonzola",
        price: 7.5,
        image: gorgoImg,
        dietaryTags: ["vegetarian"],
        allergens: ["Glutine", "Lattosio"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "contadina",
        name: "Contadina",
        desc: "Pomodoro, fiordilatte, funghi champignon*, salsiccia, cipolle, olive",
        price: 12.0,
        image: "",
        allergens: ["Glutine", "Lattosio"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "crudo",
        name: "Crudo",
        desc: "Pomodoro, fiordilatte, prosciutto crudo fuori cottura",
        price: 9.0,
        image: crudoImg,
        allergens: ["Glutine", "Lattosio"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "marinara",
        name: "Marinara",
        desc: "Pomodoro, intingolo d'aglio, origano, basilico",
        price: 5.0,
        image: marinataImg,
        allergens: ["Glutine"],
        dietaryTags: ["vegan"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "la-piemontese",
        name: "La Piemontese",
        desc: "Pomodoro, fiordilatte, toma piemontese, cotto",
        price: 9.0,
        image: "",
        allergens: ["Glutine", "Lattosio"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "panna-speck",
        name: "Panna e Speck",
        desc: "Fiordilatte, panna, speck fuori cottura",
        price: 9.0,
        image: "",
        allergens: ["Glutine", "Lattosio"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "prosciutto-funghi",
        name: "Prosciutto e Funghi",
        desc: "Pomodoro, fiordilatte, funghi champignon*, prosciutto cotto fuori cottura",
        price: 9.0,
        image: "",
        allergens: ["Glutine", "Lattosio"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "pugliese",
        name: "Pugliese",
        desc: "Pomodoro, fiordilatte, cipolle di Tropea",
        price: 7.5,
        image: "",
        dietaryTags: ["vegetarian"],
        allergens: ["Glutine", "Lattosio"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "siciliana",
        name: "Siciliana",
        desc: "Pomodoro, fiordilatte, acciughe, capperi, olive, origano",
        price: 10.0,
        image: "",
        allergens: ["Glutine", "Lattosio", "Pesce"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "vegetariana",
        name: "Vegetariana",
        desc: "Pomodoro, fiordilatte, verdure di stagione, basilico",
        price: 8.5,
        image: "",
        allergens: ["Glutine", "Lattosio"],
        dietaryTags: ["vegetarian"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "napoli",
        name: "Napoli",
        desc: "Pomodoro, fiordilatte, acciughe, origano",
        price: 7.5,
        image: "",
        allergens: ["Glutine", "Lattosio", "Pesce"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "patatine",
        name: "Patatine",
        desc: "Pomodoro, fiordilatte, patatine fritte",
        price: 8.0,
        image: "",
        allergens: ["Glutine", "Lattosio"],
        dietaryTags: ["vegetarian"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "wurstel-patatine",
        name: "Würstel e Patatine",
        desc: "Pomodoro, fiordilatte, wurstel, patatine fritte",
        price: 9.5,
        image: "",
        allergens: ["Glutine", "Lattosio"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "wurstel",
        name: "Würstel",
        desc: "Pomodoro, fiordilatte, wurstel",
        price: 7.5,
        image: "",
        allergens: ["Glutine", "Lattosio"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "salsiccia",
        name: "Salsiccia",
        desc: "Pomodoro, fiordilatte, salsiccia",
        price: 8.5,
        image: "",
        allergens: ["Glutine", "Lattosio"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "speck-brie",
        name: "Speck e Brie",
        desc: "Fiordilatte, brie, speck fuori cottura",
        price: 9.00,
        image: speckBrieImg,
        allergens: ["Glutine", "Lattosio"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "vegana-classica",
        name: "Vegana",
        desc: "Crema di patate, verdure miste, intingolo d'aglio, olive taggiasche, origano, basilico",
        price: 9.0,
        image: "",
        allergens: ["Glutine"],
        dietaryTags: ["vegan",],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "margherita-classica",
        name: "Margherita",
        desc: "Pomodoro, fiordilatte, basilico",
        price: 6.0,
        image: margheritaImg,
          allergens: ["Glutine", "Lattosio"],
          dietaryTags: ["vegetarian"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
    ],
  },
  {
    id: "baby-pizze",
    name: "Baby Pizze",
    description: "Pizze baby con forme particolari e simpatiche",
    items: [
      {
        id: "pluto",
        name: "Pluto",
        desc: "Pomodoro, fiordilatte, würstel, patatine",
        price: 6.0,
        image: "",
        allergens: ["Glutine", "Lattosio"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "topolino",
        name: "Topolino",
        desc: "Pomodoro, fiordilatte",
        price: 4.5,
        image: "",
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
        price: 3.0,
        image: cocaZeroImg,
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "coca",
        name: "Coca Cola",
        desc: "Lattina 33 cl",
        price: 3.0,
        image: cocaImg,
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "coca-vetro",
        name: "Coca Cola Vetro",
        desc: "Bottiglietta di vetro 33 cl",
        price: 4.0,
        image: cocaVetroImg,
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "coca-zero-vetro",
        name: "Coca Cola 0 Vetro",
        desc: "Bottiglietta di vetro 33 cl",
        price: 4.0,
        image: cocaZeroVetroImg,
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
        price: 3.0,
        image: fantaImg,
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "acqua-naturale",
        name: "Acqua Naturale",
        desc: "Bottiglietta da 0,5 cl",
        price: 1.0,
        image: acquaNaturaleImg,
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "acqua-frizzante",
        name: "Acqua Frizzante",
        desc: "Bottiglietta da 0,5 cl",
        price: 1.0,
        image: acquaGasataImg,
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "acqua-naturale-vetro",
        name: "Acqua Naturale Vetro",
        desc: "Bottiglia di Vetro da 0,5 cl",
        price: 1.5,
        image: acquaNaturaleImg,
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "acqua-frizzante-vetro",
        name: "Acqua Frizzante Vetro",
        desc: "Bottiglia di Vetro da 0,5 cl",
        price: 1.5,
        image: acquaGasataImg,
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "estath-pesca",
        name: "Estathé Pesca",
        desc: "Lattina 33 cl",
        price: 3.0,
        image: thePescaImg,
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "sprite",
        name: "Sprite",
        desc: "Lattina 33 cl",
        price: 3.0,
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
        price: 4.0,
        image: menabreaImg,
        allergens: ["glutine"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "menabrea-ambrata",
        name: "Menabrea Ambrata",
        desc: "33 cl",
        price: 4.0,
        image: menabreaAmbrataImg,
        allergens: ["glutine"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "menabrea-rossa",
        name: "Menabrea Rossa",
        desc: "33 cl",
        price: 4.0,
        image: menabreaRossaImg,
        allergens: ["glutine"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "ichnusa-non-filtrata",
        name: "Ichnusa Non Filtrata",
        desc: "33 cl",
        price: 4.0,
        image: ichnusaNonFiltrataImg,
        allergens: ["glutine"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "ichnusa",
        name: "Ichnusa",
        desc: "33 cl",
        price: 4.0,
        image: ichnusaImg,
        allergens: ["glutine"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "hoegarden",
        name: "Hoegarden",
        desc: "33 cl",
        price: 5.0,
        image: hoegardenImg,
        allergens: ["glutine"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "tuborg",
        name: "Tuborg",
        desc: "66 cl",
        price: 5.0,
        image: tuborgImg,
        allergens: ["glutine"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "birra-senza-glutine",
        name: "Birra Senza Glutine",
        desc: "33 cl",
        price: 4.5,
        image: "",
        allergens: [],
        dietaryTags: ["gluten-free"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "birra-analcolica",
        name: "Birra Analcolica",
        desc: "33 cl",
        price: 4.5,
        image: "",
        allergens: ["glutine"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
    ],
  },
  {
    id: "birra-alla-spina",
    name: "Birra alla spina",
    items: [
      {
        id: "birra-bionda-piccola",
        name: "Birra Bionda Piccola",
        desc: "Birra alla spina",
        price: 3.5,
        image: birraBiondaPiccolaImg,
        allergens: ["glutine"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "birra-bionda-media",
        name: "Birra Bionda Media",
        desc: "Birra alla spina",
        price: 5.5,
        image: birraBiondaMediaImg,
        allergens: ["glutine"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "birra-rossa-piccola",
        name: "Birra Rossa Piccola",
        desc: "Birra alla spina",
        price: 4.0,
        image: birraRossaPiccolaImg,
        allergens: ["glutine"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "birra-rossa-media",
        name: "Birra Rossa Media",
        desc: "Birra alla spina",
        price: 6.0,
        image: birraRossaMediaImg,
        allergens: ["glutine"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
    ],
  },
  {
    id: "birra-bicicletta",
    name: "Birra bicicletta",
    items: [
      {
        id: "bici-piccola-bionda",
        name: "Bici Piccola Bionda",
        desc: "Birra bicicletta",
        price: 4.0,
        image: biciPiccolaBiondaImg,
        allergens: ["glutine"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "bici-media-bionda",
        name: "Bici Media Bionda",
        desc: "Birra bicicletta",
        price: 6.0,
        image: biciMediaBiondaImg,
        allergens: ["glutine"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "bici-piccola-rossa",
        name: "Bici Piccola Rossa",
        desc: "Birra bicicletta",
        price: 5.0,
        image: biciPiccolaRossaImg,
        allergens: ["glutine"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "bici-media-rossa",
        name: "Bici Media Rossa",
        desc: "Birra bicicletta",
        price: 7.0,
        image: biciMediaRossaImg,
        allergens: ["glutine"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
    ],
  },
  {
    id: "birre-artigianali",
    name: "Birre artigianali",
    items: [
      {
        id: "alba-aura-bionda",
        name: "Alba Aura Bionda",
        desc: "Birra artigianale",
        price: 6.5,
        image: "",
        allergens: ["glutine"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "alba-iga",
        name: "Alba IGA",
        desc: "Birra artigianale",
        price: 6.5,
        image: "",
        allergens: ["glutine"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "cane-pacific",
        name: "Cane di guerra Pacific",
        desc: "Birra artigianale",
        price: 6.5,
        image: canePacificImg,
        allergens: ["glutine"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "cane-pilsner",
        name: "Cane di guerra Pilsner",
        desc: "Birra artigianale",
        price: 6.5,
        image: canePilsnerImg,
        allergens: ["glutine"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "cane-lager",
        name: "Cane di guerra Lager",
        desc: "Birra artigianale",
        price: 6.5,
        image: caneLagerImg,
        allergens: ["glutine"],
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
        price: 28.0,
        image: "",
        allergens: ["solfiti"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "arneis-tonino",
        name: "Arneis Tonino",
        desc: "Vino bianco piemontese",
        price: 22.0,
        image: "",
        allergens: ["solfiti"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "barbera-boidina",
        name: "Barbera Boidina",
        desc: "Vino rosso",
        price: 22.0,
        image: "",
        allergens: ["solfiti"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "barbera-cascina-castlet",
        name: "Barbera Cascina Castlet",
        desc: "Vino rosso",
        price: 26.0,
        image: "",
        allergens: ["solfiti"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "spumante-orsola",
        name: "Spumante Orsola",
        desc: "Spumante",
        price: 14.0,
        image: "",
        allergens: ["solfiti"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "ribolla-gialla",
        name: "Ribolla Gialla",
        desc: "Vino bianco",
        price: 20.0,
        image: "",
        allergens: ["solfiti"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
    ],
  },
  {
    id: "vini-sfusi",
    name: "Vini sfusi",
    items: [
      {
        id: "quartino-rosso-sfuso",
        name: "Quartino Rosso Sfuso",
        desc: "Vino rosso sfuso",
        price: 3.5,
        image: quartinoRossoSfusoImg,
        allergens: ["solfiti"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "mezzo-rosso-sfuso",
        name: "Mezzo Rosso Sfuso",
        desc: "Vino rosso sfuso",
        price: 5.5,
        image: mezzoRossoSfusoImg,
        allergens: ["solfiti"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "litro-rosso-sfuso",
        name: "Litro Rosso Sfuso",
        desc: "Vino rosso sfuso",
        price: 10.0,
        image: litroRossoSfusoImg,
        allergens: ["solfiti"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "quartino-bianco-sfuso",
        name: "Quartino Bianco Sfuso",
        desc: "Vino bianco sfuso",
        price: 3.5,
        image: quartinoBiancoSfusoImg,
        allergens: ["solfiti"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "mezzo-bianco-sfuso",
        name: "Mezzo Bianco Sfuso",
        desc: "Vino bianco sfuso",
        price: 5.5,
        image: mezzoBiancoSfusoImg,
        allergens: ["solfiti"],
        contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
      },
      {
        id: "litro-bianco-sfuso",
        name: "Litro Bianco Sfuso",
        desc: "Vino bianco sfuso",
        price: 10.0,
        image: litroBiancoSfusoImg,
        allergens: ["solfiti"],
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
import { useState, lazy, Suspense, useRef, useEffect, useMemo } from "react";
import { restaurantInfo, menuCategories, MenuItem } from "@/data/menuData";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { useQueryParam } from "@/hooks/useQueryParam";
import { useCart, CartItem } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { ReadOnlyModeProvider } from "@/contexts/ReadOnlyModeContext";
import { OpenStateProvider } from "@/contexts/OpenStateContext";
import { RestaurantHero } from "@/components/menu/RestaurantHero";
import { CategoryNav } from "@/components/menu/CategoryNav";
import { MenuSection } from "@/components/menu/MenuSection";
import { MobileHeader } from "@/components/menu/MobileHeader";
import { SearchOverlay } from "@/components/menu/SearchOverlay";
import { DesktopHeader } from "@/components/menu/DesktopHeader";
import { DesktopSearchResults } from "@/components/menu/DesktopSearchResults";
import { CartBar } from "@/components/menu/CartBar";
import { CartPage } from "@/components/menu/CartPage";
import { InfoModal } from "@/components/menu/InfoModal";
import { ClosedBanner } from "@/components/menu/ClosedBanner";
import { ClosedPopup } from "@/components/menu/ClosedPopup";
import { FeaturedCarousel } from "@/components/menu/FeaturedCarousel";
import { Footer } from "@/components/menu/Footer";
import ReviewBanner from "@/components/menu/ReviewBanner";

// Categorie da escludere dal menu asporto (solo consultazione locale)
const TAKEAWAY_EXCLUDED_CATEGORIES = ["birra-alla-spina", "birra-bicicletta", "vini-sfusi"];

const ItemDetailModal = lazy(() =>
  import("@/components/menu/ItemDetailModal").then((mod) => ({
    default: mod.ItemDetailModal,
  })),
);

const Index = () => {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [editingCartItem, setEditingCartItem] = useState<CartItem | null>(null);
  const [editingFromCart, setEditingFromCart] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDesktopSearchOpen, setIsDesktopSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useQueryParam("q");
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const { totalItems } = useCart();
  const { language } = useLanguage();
  
  // Filtra le categorie per escludere quelle non disponibili per asporto
  const takeawayCategories = useMemo(() => 
    menuCategories.filter(cat => !TAKEAWAY_EXCLUDED_CATEGORIES.includes(cat.id)),
    []
  );
  
  const categoryIds = takeawayCategories.map((cat) => cat.id);
  const activeCategory = useScrollSpy(categoryIds, 140);

  useEffect(() => {
    if (searchQuery && searchQuery.length >= 2) {
      if (window.innerWidth >= 1024) {
        setIsDesktopSearchOpen(true);
      }
    }
  }, []);

  const handleItemClick = (item: MenuItem, categoryId?: string) => {
    setSelectedItem(item);
    setSelectedCategoryId(categoryId || null);
    setEditingCartItem(null);
    setEditingFromCart(false);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
    setSelectedCategoryId(null);
    setEditingCartItem(null);
    // Se stava modificando dal carrello, riapri il carrello
    if (editingFromCart) {
      setIsCartOpen(true);
      setEditingFromCart(false);
    }
  };

  const handleEditCartItem = (item: MenuItem, cartItem: CartItem) => {
    setSelectedItem(item);
    setEditingCartItem(cartItem);
    setEditingFromCart(true);
    setIsCartOpen(false);
    // Trova la categoria del prodotto per la sezione Senza Glutine
    const category = menuCategories.find(cat => 
      cat.items.some(i => i.id === item.id)
    );
    setSelectedCategoryId(category?.id || null);
  };

  const handleOpenSearch = () => {
    setIsSearchOpen(true);
  };

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
    setTimeout(() => {
      searchButtonRef.current?.focus();
    }, 100);
  };

  const handleDesktopQueryChange = (query: string) => {
    setSearchQuery(query, false);
  };

  const handleDesktopSearch = (query: string) => {
    setSearchQuery(query, true);
  };

  const handleShowAllResults = () => {
    setIsDesktopSearchOpen(true);
  };

  const handleCloseDesktopSearch = () => {
    setIsDesktopSearchOpen(false);
    setSearchQuery("", true);
  };

  return (
    <ReadOnlyModeProvider readOnly={false}>
      <OpenStateProvider onOpenInfo={() => setIsInfoOpen(true)}>
        <div className="min-h-screen bg-background">
          <title>Menu - {restaurantInfo.name} | Acqui Terme</title>
          <meta
            name="description"
            content={`Scopri il menu di ${restaurantInfo.name} a ${restaurantInfo.address}. ${restaurantInfo.cuisine}. Consulta i nostri piatti e ingredienti.`}
          />

          <DesktopHeader
            title="PizzArt"
            query={searchQuery}
            onQueryChange={handleDesktopQueryChange}
            onSearch={handleDesktopSearch}
            onItemClick={handleItemClick}
            onShowAllResults={handleShowAllResults}
          />

          <DesktopSearchResults
            isOpen={isDesktopSearchOpen}
            initialQuery={searchQuery}
            onClose={handleCloseDesktopSearch}
            onItemClick={handleItemClick}
            onQueryChange={(q) => setSearchQuery(q, true)}
            excludedCategories={TAKEAWAY_EXCLUDED_CATEGORIES}
          />

          <MobileHeader ref={searchButtonRef} title="PizzArt" onSearchClick={handleOpenSearch} />

          <SearchOverlay isOpen={isSearchOpen} onClose={handleCloseSearch} onItemClick={handleItemClick} excludedCategories={TAKEAWAY_EXCLUDED_CATEGORIES} />

          <div className="lg:pt-16">
            <RestaurantHero info={restaurantInfo} />
          </div>

          <ClosedBanner />

          {/* Google Reviews Banner */}
          <ReviewBanner className="mt-4 mb-2" />

          {/* Featured Section - I più amati */}
          <FeaturedCarousel onItemClick={handleItemClick} />

          <CategoryNav categories={takeawayCategories} activeCategory={activeCategory} onCategoryClick={() => {}} />

          <main className={`container py-6 pb-4 space-y-8 ${totalItems > 0 ? "pb-24" : ""}`}>
            {takeawayCategories.map((category) => (
              <MenuSection key={category.id} category={category} onItemClick={handleItemClick} />
            ))}
          </main>

          <Footer />

          <Suspense fallback={null}>
            <ItemDetailModal
              item={selectedItem}
              isOpen={selectedItem !== null}
              onClose={handleCloseModal}
              editingCartItem={editingCartItem}
              categoryId={selectedCategoryId || undefined}
            />
          </Suspense>

          <CartBar onViewCart={() => setIsCartOpen(true)} />

          <CartPage
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            onOpenInfo={() => setIsInfoOpen(true)}
            onEditItem={handleEditCartItem}
          />

          <InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} restaurantInfo={restaurantInfo} />

          <ClosedPopup />
        </div>
      </OpenStateProvider>
    </ReadOnlyModeProvider>
  );
};

export default Index;

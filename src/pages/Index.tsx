import { useState, lazy, Suspense, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
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

const ItemDetailModal = lazy(() =>
  import("@/components/menu/ItemDetailModal").then((mod) => ({
    default: mod.ItemDetailModal,
  })),
);

const Index = () => {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [editingCartItem, setEditingCartItem] = useState<CartItem | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDesktopSearchOpen, setIsDesktopSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useQueryParam("q");
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const { totalItems } = useCart();
  const { language } = useLanguage();
  const categoryIds = menuCategories.map((cat) => cat.id);
  const activeCategory = useScrollSpy(categoryIds, 140);

  const baseMenuLink = `/menu-base?lang=${language}`;

  useEffect(() => {
    if (searchQuery && searchQuery.length >= 2) {
      if (window.innerWidth >= 1024) {
        setIsDesktopSearchOpen(true);
      }
    }
  }, []);

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
    setEditingCartItem(null);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
    setEditingCartItem(null);
  };

  const handleEditCartItem = (item: MenuItem, cartItem: CartItem) => {
    setSelectedItem(item);
    setEditingCartItem(cartItem);
    setIsCartOpen(false);
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
          />

          <MobileHeader ref={searchButtonRef} title="Newcastle Pub" onSearchClick={handleOpenSearch} />

          <SearchOverlay isOpen={isSearchOpen} onClose={handleCloseSearch} onItemClick={handleItemClick} />

          <div className="lg:pt-16">
            <RestaurantHero info={restaurantInfo} />
          </div>

          <ClosedBanner />

          {/* Featured Section - I più amati */}
          <FeaturedCarousel onItemClick={handleItemClick} />

          <CategoryNav categories={menuCategories} activeCategory={activeCategory} onCategoryClick={() => {}} />

          <main className={`container py-6 space-y-8 ${totalItems > 0 ? "pb-28" : ""}`}>
            {menuCategories.map((category) => (
              <MenuSection key={category.id} category={category} onItemClick={handleItemClick} />
            ))}

            <footer className="text-center py-8 border-t border-border">
              <p className="text-sm text-muted-foreground mb-3">
                Menu di consultazione – Per ordinare visita il locale o contattaci
              </p>
              <Link
                to={baseMenuLink}
                className="inline-flex items-center gap-2 text-xs text-muted-foreground/70 hover:text-muted-foreground transition-colors"
              >
                <Eye className="w-3 h-3" />
                Vedi versione base
              </Link>
              <p className="text-xs text-muted-foreground mt-3">
                © {new Date().getFullYear()} {restaurantInfo.name}
              </p>
            </footer>
          </main>

          <Suspense fallback={null}>
            <ItemDetailModal
              item={selectedItem}
              isOpen={selectedItem !== null}
              onClose={handleCloseModal}
              editingCartItem={editingCartItem}
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

import { useState, lazy, Suspense, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye } from "lucide-react";
import { restaurantInfo, menuCategories, MenuItem } from "@/data/menuData";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { useQueryParam } from "@/hooks/useQueryParam";
import { useLanguage } from "@/contexts/LanguageContext";
import { ReadOnlyModeProvider } from "@/contexts/ReadOnlyModeContext";
import { RestaurantHero } from "@/components/menu/RestaurantHero";
import { CategoryNav } from "@/components/menu/CategoryNav";
import { MenuSection } from "@/components/menu/MenuSection";
import { MobileHeader } from "@/components/menu/MobileHeader";
import { SearchOverlay } from "@/components/menu/SearchOverlay";
import { DesktopHeader } from "@/components/menu/DesktopHeader";
import { DesktopSearchResults } from "@/components/menu/DesktopSearchResults";
import { InfoModal } from "@/components/menu/InfoModal";
import { FeaturedCarousel } from "@/components/menu/FeaturedCarousel";

const ItemDetailModal = lazy(() =>
  import("@/components/menu/ItemDetailModal").then((mod) => ({
    default: mod.ItemDetailModal,
  }))
);

const MenuBase = () => {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDesktopSearchOpen, setIsDesktopSearchOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useQueryParam("q");
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  
  const categoryIds = menuCategories.map((cat) => cat.id);
  const activeCategory = useScrollSpy(categoryIds, 140);

  useEffect(() => {
    if (searchQuery && searchQuery.length >= 2) {
      if (window.innerWidth >= 1024) {
        setIsDesktopSearchOpen(true);
      }
    }
  }, []);

  // Redirect if trying to access cart/thank you pages from base mode
  useEffect(() => {
    if (location.pathname === "/grazie" || location.pathname === "/carrello") {
      navigate(`/menu-base?lang=${language}`, { replace: true });
    }
  }, [location.pathname, navigate, language]);

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
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

  const fullMenuLink = `/?lang=${language}`;

  return (
    <ReadOnlyModeProvider readOnly={true}>
      <div className="min-h-screen bg-background">
        <title>Menu — Versione base | {restaurantInfo.name}</title>
        <meta
          name="description"
          content={`Consulta il menu di ${restaurantInfo.name} a ${restaurantInfo.address}. ${restaurantInfo.cuisine}. Solo consultazione.`}
        />
        <link rel="canonical" href="/" />

        <DesktopHeader
          title="Newcastle Pub"
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

        <MobileHeader
          ref={searchButtonRef}
          title="Newcastle Pub"
          onSearchClick={handleOpenSearch}
        />

        <SearchOverlay
          isOpen={isSearchOpen}
          onClose={handleCloseSearch}
          onItemClick={handleItemClick}
        />

        <div className="lg:pt-16">
          <RestaurantHero info={restaurantInfo} />
        </div>

        {/* Featured Section - I più amati */}
        <FeaturedCarousel onItemClick={handleItemClick} />

        <CategoryNav
          categories={menuCategories}
          activeCategory={activeCategory}
          onCategoryClick={() => {}}
        />

        <main className="container py-6 space-y-8">
          {menuCategories.map((category) => (
            <MenuSection
              key={category.id}
              category={category}
              onItemClick={handleItemClick}
            />
          ))}

          <footer className="text-center py-8 border-t border-border">
            <p className="text-sm text-muted-foreground mb-4">
              Menu di sola consultazione
            </p>
            <Link
              to={fullMenuLink}
              className="inline-flex items-center gap-2 text-sm font-medium text-link hover:underline"
            >
              <Eye className="w-4 h-4" />
              Passa alla versione completa
            </Link>
            <p className="text-xs text-muted-foreground mt-4">
              © {new Date().getFullYear()} {restaurantInfo.name}
            </p>
          </footer>
        </main>

        <Suspense fallback={null}>
          <ItemDetailModal
            item={selectedItem}
            isOpen={selectedItem !== null}
            onClose={handleCloseModal}
          />
        </Suspense>

        <InfoModal
          isOpen={isInfoOpen}
          onClose={() => setIsInfoOpen(false)}
          restaurantInfo={restaurantInfo}
        />
      </div>
    </ReadOnlyModeProvider>
  );
};

export default MenuBase;

import { useMemo, useState } from "react";
import { MenuItem, menuCategories } from "@/data/menuData";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { ProductImage } from "./ProductImage";

interface DesktopSearchDropdownProps {
  query: string;
  isOpen: boolean;
  onItemClick: (item: MenuItem) => void;
  onShowAll: () => void;
}

// Normalize string for search (remove accents, lowercase)
function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// Get all menu items flattened
function getAllItems(): MenuItem[] {
  return menuCategories.flatMap((cat) => cat.items);
}

export function DesktopSearchDropdown({
  query,
  isOpen,
  onItemClick,
  onShowAll,
}: DesktopSearchDropdownProps) {
  const allItems = useMemo(() => getAllItems(), []);

  // Filter results based on query (minimum 2 characters, max 8)
  const results = useMemo(() => {
    if (query.length < 2) return [];

    const normalizedQuery = normalizeString(query);
    return allItems
      .filter((item) => {
        const normalizedName = normalizeString(item.name);
        const normalizedDesc = normalizeString(item.desc);
        return (
          normalizedName.includes(normalizedQuery) ||
          normalizedDesc.includes(normalizedQuery)
        );
      })
      .slice(0, 8);
  }, [query, allItems]);

  const totalResults = useMemo(() => {
    if (query.length < 2) return 0;

    const normalizedQuery = normalizeString(query);
    return allItems.filter((item) => {
      const normalizedName = normalizeString(item.name);
      const normalizedDesc = normalizeString(item.desc);
      return (
        normalizedName.includes(normalizedQuery) ||
        normalizedDesc.includes(normalizedQuery)
      );
    }).length;
  }, [query, allItems]);

  if (!isOpen || query.length < 2) return null;

  return (
    <div
      className={cn(
        "absolute top-full left-0 right-0 mt-2",
        "bg-popover border border-border rounded-xl shadow-lg",
        "overflow-hidden z-50",
        "animate-in fade-in-0 slide-in-from-top-2 duration-200"
      )}
    >
      {results.length > 0 ? (
        <>
          <ul className="divide-y divide-border/50">
            {results.map((item) => (
              <DropdownItem key={item.id} item={item} onClick={() => onItemClick(item)} />
            ))}
          </ul>
          {totalResults > 8 && (
            <button
              onClick={onShowAll}
              className="flex items-center justify-center gap-2 w-full py-3 text-sm font-medium text-primary hover:bg-secondary/50 transition-colors border-t border-border/50"
            >
              Vedi tutti i risultati ({totalResults})
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </>
      ) : (
        <div className="p-6 text-center text-muted-foreground">
          Nessun risultato per «<span className="font-medium text-foreground">{query}</span>»
        </div>
      )}
    </div>
  );
}

interface DropdownItemProps {
  item: MenuItem;
  onClick: () => void;
}

function DropdownItem({ item, onClick }: DropdownItemProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <li>
      <button
        onClick={onClick}
        className="flex items-center gap-3 w-full p-3 text-left hover:bg-secondary/50 transition-colors"
      >
        {/* Thumbnail */}
        <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
          <ProductImage
            src={item.image}
            alt={item.name}
            className="w-full h-full"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-popover-foreground truncate">
            {item.name}
          </h4>
          <p className="text-xs text-muted-foreground truncate">{item.desc}</p>
        </div>

        {/* Price */}
        <span className="text-sm font-semibold text-primary flex-shrink-0">
          € {item.price.toFixed(2).replace(".", ",")}
        </span>
      </button>
    </li>
  );
}

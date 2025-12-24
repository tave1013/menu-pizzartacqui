import { useState, useRef, useEffect, useCallback } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { DesktopSearchDropdown } from "./DesktopSearchDropdown";
import { ShareMenu } from "./ShareMenu";
import { LanguageSelector } from "./LanguageSelector";
import { MenuItem } from "@/data/menuData";

interface DesktopHeaderProps {
  title: string;
  query: string;
  onQueryChange: (query: string) => void;
  onSearch: (query: string) => void;
  onItemClick: (item: MenuItem) => void;
  onShowAllResults: () => void;
}

export function DesktopHeader({
  title,
  query,
  onQueryChange,
  onSearch,
  onItemClick,
  onShowAllResults,
}: DesktopHeaderProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrolled = useScrollPosition(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === "/" && !isFocused) ||
        ((e.metaKey || e.ctrlKey) && e.key === "k")
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape" && isFocused) {
        inputRef.current?.blur();
        setShowDropdown(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFocused]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFocus = () => {
    setIsFocused(true);
    if (query.length >= 2) {
      setShowDropdown(true);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onQueryChange(value);
    setShowDropdown(value.length >= 2);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (query.length >= 2) {
        onSearch(query);
        setShowDropdown(false);
        onShowAllResults();
      }
    }
    if (e.key === "Escape") {
      setShowDropdown(false);
      inputRef.current?.blur();
    }
  };

  const handleClear = useCallback(() => {
    onQueryChange("");
    setShowDropdown(false);
    inputRef.current?.focus();
  }, [onQueryChange]);

  const handleItemClick = (item: MenuItem) => {
    onItemClick(item);
    setShowDropdown(false);
  };

  const handleShowAll = () => {
    onSearch(query);
    setShowDropdown(false);
    onShowAllResults();
  };

  return (
    <header
      className={cn(
        "hidden lg:block fixed top-0 left-0 right-0 z-50",
        "bg-background/95 backdrop-blur-md",
        "transition-all duration-200 ease-out",
        isScrolled ? "border-b border-border/50 shadow-sm" : ""
      )}
    >
      <div className="container flex items-center justify-between h-16 gap-6">
        {/* Logo/Title */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-2xl">🍺</span>
          <span className="text-lg font-bold text-foreground">{title}</span>
        </div>

        {/* Search Box */}
        <div ref={containerRef} className="relative flex-1 max-w-xl">
          <div
            className={cn(
              "relative flex items-center",
              "bg-secondary/60 rounded-full",
              "border transition-all duration-200",
              isFocused
                ? "border-primary/40 ring-2 ring-primary/20"
                : "border-transparent hover:border-border/50"
            )}
          >
            <Search className="absolute left-4 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              placeholder="Cerca nel menu…"
              className="w-full h-10 pl-10 pr-16 rounded-full bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
            />
            {!isFocused && query.length === 0 && (
              <div className="absolute right-12 flex items-center gap-1 text-xs text-muted-foreground">
                <kbd className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono">/</kbd>
              </div>
            )}
            {query.length > 0 && (
              <button
                onClick={handleClear}
                className="absolute right-3 flex items-center justify-center w-6 h-6 rounded-full hover:bg-muted transition-colors"
                aria-label="Cancella ricerca"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>

          <DesktopSearchDropdown
            query={query}
            isOpen={showDropdown}
            onItemClick={handleItemClick}
            onShowAll={handleShowAll}
          />
        </div>

        {/* Right: Language + Share */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <LanguageSelector />
          <ShareMenu title={title} query={query} />
        </div>
      </div>
    </header>
  );
}

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ALLERGENS_LIST, getAllergenLabel } from '@/data/allergensList';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

interface AllergenDropdownProps {
  selected: string[];
  onChange: (selected: string[]) => void;
}

export function AllergenDropdown({ selected, onChange }: AllergenDropdownProps) {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredAllergens = search.trim()
    ? ALLERGENS_LIST.filter(a => 
        a.label.toLowerCase().includes(search.toLowerCase().trim())
      )
    : ALLERGENS_LIST;

  const toggleAllergen = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter(v => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  // Close on click outside (desktop only)
  useEffect(() => {
    if (!isOpen || isMobile) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, isMobile]);

  // Close on ESC
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

  // Display pills (max 3 + count)
  const displayPills = selected.slice(0, 3);
  const remainingCount = selected.length - 3;

  const dropdownContent = (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Cerca allergeni..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-8"
            autoFocus={!isMobile}
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Allergen List */}
      <ScrollArea className="flex-1 max-h-[320px]">
        <div className="p-2">
          {filteredAllergens.map((allergen, index) => {
            const isSelected = selected.includes(allergen.value);
            return (
              <label
                key={allergen.value}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors',
                  isSelected 
                    ? 'bg-primary/10 text-foreground' 
                    : 'hover:bg-secondary',
                  index !== filteredAllergens.length - 1 && 'border-b border-border/30'
                )}
              >
                {/* Square checkbox */}
                <div 
                  className={cn(
                    'w-4 h-4 rounded-[3px] border-2 flex items-center justify-center transition-colors shrink-0',
                    isSelected 
                      ? 'bg-primary border-primary' 
                      : 'border-muted-foreground/40 bg-background'
                  )}
                >
                  {isSelected && (
                    <svg className="w-3 h-3 text-primary-foreground" viewBox="0 0 12 12" fill="none">
                      <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span className="text-sm flex-1 select-none">{allergen.label}</span>
              </label>
            );
          })}
          {filteredAllergens.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-8">
              Nessun allergene trovato per "{search}"
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );

  // Mobile: use Sheet
  if (isMobile) {
    return (
      <div className="space-y-2">
        {/* Trigger Button */}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={cn(
            'w-full flex items-center justify-between px-3 py-2.5 rounded-xl border transition-colors',
            'bg-background text-left',
            isOpen ? 'border-primary ring-2 ring-primary/20' : 'border-input hover:border-primary/50'
          )}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <div className="flex-1 flex items-center gap-2 flex-wrap min-h-[24px]">
            {selected.length === 0 ? (
              <span className="text-muted-foreground text-sm">Seleziona allergeni...</span>
            ) : (
              <>
                {displayPills.map(value => (
                  <span key={value} className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-md font-medium">
                    {getAllergenLabel(value)}
                  </span>
                ))}
                {remainingCount > 0 && (
                  <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-md font-medium">
                    +{remainingCount}
                  </span>
                )}
              </>
            )}
          </div>
          <ChevronDown className={cn('w-4 h-4 text-muted-foreground transition-transform', isOpen && 'rotate-180')} />
        </button>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent side="bottom" className="h-[80vh] p-0 rounded-t-2xl">
            <SheetHeader className="p-4 border-b border-border flex-row items-center justify-between">
              <SheetTitle>Seleziona allergeni</SheetTitle>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-secondary"
              >
                <X className="w-5 h-5" />
              </button>
            </SheetHeader>
            {dropdownContent}
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  // Desktop: use dropdown
  return (
    <div ref={containerRef} className="relative">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between px-3 py-2.5 rounded-xl border transition-colors',
          'bg-background text-left',
          isOpen ? 'border-primary ring-2 ring-primary/20' : 'border-input hover:border-primary/50'
        )}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="flex-1 flex items-center gap-2 flex-wrap min-h-[24px]">
          {selected.length === 0 ? (
            <span className="text-muted-foreground text-sm">Seleziona allergeni...</span>
          ) : (
            <>
              {displayPills.map(value => (
                <span key={value} className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-md font-medium">
                  {getAllergenLabel(value)}
                </span>
              ))}
              {remainingCount > 0 && (
                <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-md font-medium">
                  +{remainingCount}
                </span>
              )}
            </>
          )}
        </div>
        <ChevronDown className={cn('w-4 h-4 text-muted-foreground transition-transform', isOpen && 'rotate-180')} />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div 
          className="absolute z-50 left-0 right-0 mt-2 rounded-xl border border-border bg-popover shadow-lg overflow-hidden"
          role="listbox"
          aria-label="Allergeni"
        >
          {dropdownContent}
        </div>
      )}
    </div>
  );
}

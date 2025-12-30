import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { ALLERGENS_LIST } from '@/data/allergensList';
import { cn } from '@/lib/utils';

interface AllergenSelectorProps {
  selected: string[];
  onChange: (selected: string[]) => void;
}

export function AllergenSelector({ selected, onChange }: AllergenSelectorProps) {
  const [search, setSearch] = useState('');

  const filteredAllergens = useMemo(() => {
    if (!search.trim()) return ALLERGENS_LIST;
    const query = search.toLowerCase().trim();
    return ALLERGENS_LIST.filter(a => 
      a.label.toLowerCase().includes(query)
    );
  }, [search]);

  const toggleAllergen = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter(v => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const selectAll = () => {
    onChange(ALLERGENS_LIST.map(a => a.value));
  };

  const selectNone = () => {
    onChange([]);
  };

  return (
    <div className="space-y-3">
      {/* Search and Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Cerca allergeni..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-8"
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
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={selectAll}>
            Seleziona tutti
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={selectNone}>
            Nessuno
          </Button>
        </div>
      </div>

      {/* Selected count */}
      {selected.length > 0 && (
        <p className="text-sm text-muted-foreground">
          {selected.length} allergeni selezionati
        </p>
      )}

      {/* Allergen list */}
      <ScrollArea className="h-[200px] sm:h-[240px] rounded-xl border border-border bg-secondary/30 p-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 p-2">
          {filteredAllergens.map((allergen) => {
            const isSelected = selected.includes(allergen.value);
            return (
              <label
                key={allergen.value}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors',
                  isSelected 
                    ? 'bg-primary/20 text-foreground' 
                    : 'hover:bg-secondary'
                )}
              >
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => toggleAllergen(allergen.value)}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <span className="text-sm select-none">{allergen.label}</span>
              </label>
            );
          })}
          {filteredAllergens.length === 0 && (
            <p className="col-span-2 text-center text-sm text-muted-foreground py-4">
              Nessun allergene trovato per "{search}"
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdmin } from "@/contexts/AdminContext";
import { useToast } from "@/hooks/use-toast";
import { AdminProduct, BADGE_OPTIONS } from "@/data/adminMockData";
import { AllergenDropdown } from "./AllergenDropdown";
import { ImageUploader } from "./ImageUploader";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: AdminProduct | null;
}

export function ProductModal({ open, onOpenChange, product }: ProductModalProps) {
  const isMobile = useIsMobile();
  const { categories, addProduct, updateProduct, addCategory } = useAdmin();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    categoryId: "",
    active: true,
    badges: [] as string[],
    allergens: [] as string[],
  });
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        imageUrl: product.imageUrl,
        categoryId: product.categoryId,
        active: product.active,
        badges: product.badges,
        allergens: product.allergens || [],
      });
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        imageUrl: "",
        categoryId: categories[0]?.id || "",
        active: true,
        badges: [],
        allergens: [],
      });
    }
    setErrors({});
    setShowNewCategory(false);
    setNewCategoryName("");
  }, [product, open, categories]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Nome obbligatorio";
    if (!formData.categoryId && !newCategoryName.trim()) newErrors.category = "Categoria obbligatoria";
    const price = parseFloat(formData.price);
    if (isNaN(price) || price < 0.1) newErrors.price = "Prezzo minimo €0.10";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    let categoryId = formData.categoryId;
    
    if (showNewCategory && newCategoryName.trim()) {
      addCategory(newCategoryName.trim());
      categoryId = `c${Date.now()}`;
    }

    const productData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: parseFloat(formData.price),
      imageUrl: formData.imageUrl.trim(),
      categoryId,
      active: formData.active,
      badges: formData.badges,
      allergens: formData.allergens,
    };

    if (product) {
      updateProduct(product.id, productData);
      toast({ title: "Prodotto aggiornato", duration: 2000 });
    } else {
      addProduct(productData);
      toast({ title: "Prodotto creato", duration: 2000 });
    }

    onOpenChange(false);
  };

  const toggleBadge = (badge: string) => {
    setFormData((prev) => ({
      ...prev,
      badges: prev.badges.includes(badge)
        ? prev.badges.filter((b) => b !== badge)
        : [...prev.badges, badge],
    }));
  };

  const isFormValid = formData.name.trim() && (formData.categoryId || newCategoryName.trim()) && parseFloat(formData.price) >= 0.1;

  const content = (
    <div className="space-y-6 p-1">
      {/* 1. Image Upload - FIRST */}
      <div>
        <Label className="mb-2 block">Immagine</Label>
        <ImageUploader
          imageUrl={formData.imageUrl}
          onImageChange={(url) => setFormData((p) => ({ ...p, imageUrl: url }))}
        />
      </div>

      {/* Form Fields */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* 2. Nome */}
        <div className="sm:col-span-2">
          <Label htmlFor="name">Nome *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
            className={cn(errors.name && "border-destructive")}
          />
          {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
        </div>

        {/* 3. Categoria */}
        <div>
          <Label htmlFor="category">Categoria *</Label>
          {showNewCategory ? (
            <div className="flex gap-2">
              <Input
                placeholder="Nuova categoria"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className={cn(errors.category && "border-destructive")}
              />
              <Button variant="outline" onClick={() => setShowNewCategory(false)}>
                Annulla
              </Button>
            </div>
          ) : (
            <Select
              value={formData.categoryId}
              onValueChange={(v) => {
                if (v === "new") {
                  setShowNewCategory(true);
                } else {
                  setFormData((p) => ({ ...p, categoryId: v }));
                }
              }}
            >
              <SelectTrigger className={cn(errors.category && "border-destructive")}>
                <SelectValue placeholder="Seleziona categoria" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
                <SelectItem value="new">+ Nuova categoria</SelectItem>
              </SelectContent>
            </Select>
          )}
          {errors.category && <p className="text-xs text-destructive mt-1">{errors.category}</p>}
        </div>

        {/* 4. Prezzo */}
        <div>
          <Label htmlFor="price">Prezzo (€) *</Label>
          <Input
            id="price"
            type="number"
            min="0.10"
            step="0.10"
            value={formData.price}
            onChange={(e) => setFormData((p) => ({ ...p, price: e.target.value }))}
            className={cn(errors.price && "border-destructive")}
          />
          {errors.price && <p className="text-xs text-destructive mt-1">{errors.price}</p>}
        </div>

        {/* 5. Descrizione */}
        <div className="sm:col-span-2">
          <Label htmlFor="description">Descrizione</Label>
          <Textarea
            id="description"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
          />
        </div>

        {/* 6. Badge Alimentari */}
        <div className="sm:col-span-2">
          <Label>Badge Alimentari</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {BADGE_OPTIONS.map((badge) => (
              <button
                key={badge.value}
                type="button"
                onClick={() => toggleBadge(badge.value)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                  formData.badges.includes(badge.value)
                    ? badge.color
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                )}
              >
                {badge.label}
              </button>
            ))}
          </div>
        </div>

        {/* 7. Allergeni - Dropdown multi-select */}
        <div className="sm:col-span-2">
          <Label className="mb-2 block">Allergeni</Label>
          <AllergenDropdown
            selected={formData.allergens}
            onChange={(allergens) => setFormData((p) => ({ ...p, allergens }))}
          />
        </div>

        {/* 8. Active Switch */}
        <div className="sm:col-span-2 flex items-center justify-between p-4 bg-secondary rounded-xl">
          <div>
            <p className="font-medium text-foreground">Visibilità</p>
            <p className="text-sm text-muted-foreground">
              {formData.active ? "Il prodotto è visibile nel menu" : "Il prodotto è nascosto"}
            </p>
          </div>
          <Switch
            checked={formData.active}
            onCheckedChange={(checked) => setFormData((p) => ({ ...p, active: checked }))}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-border">
        <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
          Annulla
        </Button>
        <Button className="flex-1" onClick={handleSubmit} disabled={!isFormValid}>
          {product ? "Salva Modifiche" : "Crea Prodotto"}
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="h-[90vh] overflow-y-auto rounded-t-2xl">
          <SheetHeader className="mb-4">
            <SheetTitle>{product ? "Modifica Prodotto" : "Nuovo Prodotto"}</SheetTitle>
          </SheetHeader>
          {content}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-card">
        <DialogHeader>
          <DialogTitle>{product ? "Modifica Prodotto" : "Nuovo Prodotto"}</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}

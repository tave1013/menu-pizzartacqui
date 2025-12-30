import { useState, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useAdmin } from "@/contexts/AdminContext";
import { ProductBadges } from "@/components/admin/ProductBadge";
import { ProductImageFallback } from "@/components/admin/ProductImageFallback";
import { EmptyState } from "@/components/admin/EmptyState";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ProductModal } from "@/components/admin/ProductModal";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Copy, Trash2, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AdminProduct } from "@/data/adminMockData";
import { cn } from "@/lib/utils";

type SortOption = "name-asc" | "price-asc" | "price-desc" | "manual";
type StatusFilter = "all" | "active" | "hidden";

export default function AdminProducts() {
  const { onMenuClick } = useOutletContext<{ onMenuClick: () => void }>();
  const { products, categories, updateProduct, deleteProduct, duplicateProduct } = useAdmin();
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }

    // Category filter
    if (categoryFilter !== "all") {
      result = result.filter((p) => p.categoryId === categoryFilter);
    }

    // Status filter
    if (statusFilter === "active") {
      result = result.filter((p) => p.active);
    } else if (statusFilter === "hidden") {
      result = result.filter((p) => !p.active);
    }

    // Sort
    switch (sortBy) {
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
    }

    return result;
  }, [products, search, categoryFilter, statusFilter, sortBy]);

  const handleEdit = (product: AdminProduct) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleDuplicate = (id: string) => {
    duplicateProduct(id);
    toast({ title: "Prodotto duplicato", duration: 2000 });
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
    setDeleteConfirm(null);
    toast({ title: "Prodotto eliminato", duration: 2000 });
  };

  const handleToggleActive = (id: string, active: boolean) => {
    updateProduct(id, { active });
    toast({ 
      title: active ? "Prodotto attivato" : "Prodotto nascosto",
      duration: 2000 
    });
  };

  const getCategoryName = (id: string) => {
    return categories.find((c) => c.id === id)?.name || "—";
  };

  return (
    <div className="flex-1">
      <AdminHeader
        title="Prodotti"
        subtitle={`${products.length} prodotti totali`}
        searchPlaceholder="Cerca prodotti..."
        searchValue={search}
        onSearchChange={setSearch}
        primaryAction={{
          label: "Nuovo Prodotto",
          onClick: () => {
            setEditingProduct(null);
            setModalOpen(true);
          },
        }}
        onMenuClick={onMenuClick}
      />

      <div className="p-4 lg:p-6">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40 bg-card">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="all">Tutte le categorie</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
            <SelectTrigger className="w-32 bg-card">
              <SelectValue placeholder="Stato" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="all">Tutti</SelectItem>
              <SelectItem value="active">Attivi</SelectItem>
              <SelectItem value="hidden">Nascosti</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
            <SelectTrigger className="w-40 bg-card">
              <SelectValue placeholder="Ordina per" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="name-asc">Nome A–Z</SelectItem>
              <SelectItem value="price-asc">Prezzo ↑</SelectItem>
              <SelectItem value="price-desc">Prezzo ↓</SelectItem>
              <SelectItem value="manual">Ordine manuale</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredProducts.length === 0 ? (
          <EmptyState
            icon={Package}
            title="Nessun prodotto trovato"
            description={search || categoryFilter !== "all" || statusFilter !== "all" 
              ? "Prova a modificare i filtri di ricerca"
              : "Inizia creando il tuo primo prodotto"}
            actionLabel={!search && categoryFilter === "all" && statusFilter === "all" ? "Crea Prodotto" : undefined}
            onAction={() => {
              setEditingProduct(null);
              setModalOpen(true);
            }}
          />
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block bg-card rounded-2xl border border-border shadow-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/50">
                    <TableHead className="w-20">Immagine</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Prezzo</TableHead>
                    <TableHead>Badge</TableHead>
                    <TableHead className="w-24">Stato</TableHead>
                    <TableHead className="w-32 text-right">Azioni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id} className="group">
                      <TableCell>
                        <ProductImageFallback
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-14 h-14 rounded-lg"
                        />
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-foreground">{product.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{product.description}</p>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {getCategoryName(product.categoryId)}
                      </TableCell>
                      <TableCell className="font-medium">€{product.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <ProductBadges badges={product.badges} />
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={product.active}
                          onCheckedChange={(checked) => handleToggleActive(product.id, checked)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDuplicate(product.id)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => setDeleteConfirm(product.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-3">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className={cn(
                    "bg-card rounded-2xl border border-border p-4 shadow-card",
                    !product.active && "opacity-60"
                  )}
                >
                  <div className="flex gap-4">
                    <ProductImageFallback
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-20 h-20 rounded-xl flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-foreground">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{getCategoryName(product.categoryId)}</p>
                        </div>
                        <p className="font-semibold text-foreground">€{product.price.toFixed(2)}</p>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{product.description}</p>
                      <div className="mt-2">
                        <ProductBadges badges={product.badges} />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={product.active}
                        onCheckedChange={(checked) => handleToggleActive(product.id, checked)}
                      />
                      <span className="text-sm text-muted-foreground">
                        {product.active ? "Attivo" : "Nascosto"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDuplicate(product.id)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteConfirm(product.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Product Modal */}
      <ProductModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        product={editingProduct}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteConfirm}
        onOpenChange={(open) => !open && setDeleteConfirm(null)}
        title="Elimina Prodotto"
        description="Sei sicuro di voler eliminare questo prodotto? L'azione non può essere annullata."
        confirmLabel="Elimina"
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        variant="destructive"
      />
    </div>
  );
}

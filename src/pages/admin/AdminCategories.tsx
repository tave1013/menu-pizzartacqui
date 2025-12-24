import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useAdmin } from "@/contexts/AdminContext";
import { EmptyState } from "@/components/admin/EmptyState";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FolderOpen, Pencil, Trash2, GripVertical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function AdminCategories() {
  const { onMenuClick } = useOutletContext<{ onMenuClick: () => void }>();
  const { categories, products, addCategory, updateCategory, deleteCategory, reorderCategories } = useAdmin();
  const { toast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [error, setError] = useState("");

  // Drag state
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const getProductCount = (categoryId: string) => {
    return products.filter((p) => p.categoryId === categoryId).length;
  };

  const handleOpenModal = (id?: string) => {
    if (id) {
      const cat = categories.find((c) => c.id === id);
      setCategoryName(cat?.name || "");
      setEditingId(id);
    } else {
      setCategoryName("");
      setEditingId(null);
    }
    setError("");
    setModalOpen(true);
  };

  const handleSubmit = () => {
    const name = categoryName.trim();
    if (!name) {
      setError("Nome obbligatorio");
      return;
    }

    const duplicate = categories.find(
      (c) => c.name.toLowerCase() === name.toLowerCase() && c.id !== editingId
    );
    if (duplicate) {
      setError("Categoria già esistente");
      return;
    }

    if (editingId) {
      updateCategory(editingId, name);
      toast({ title: "Categoria rinominata", duration: 2000 });
    } else {
      addCategory(name);
      toast({ title: "Categoria creata", duration: 2000 });
    }

    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    const count = getProductCount(id);
    if (count > 0) {
      toast({
        title: "Impossibile eliminare",
        description: `La categoria contiene ${count} prodotti`,
        variant: "destructive",
        duration: 3000,
      });
      setDeleteConfirm(null);
      return;
    }
    deleteCategory(id);
    setDeleteConfirm(null);
    toast({ title: "Categoria eliminata", duration: 2000 });
  };

  const handleDragStart = (id: string) => {
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) return;

    const draggedIndex = categories.findIndex((c) => c.id === draggedId);
    const targetIndex = categories.findIndex((c) => c.id === targetId);

    const newCategories = [...categories];
    const [removed] = newCategories.splice(draggedIndex, 1);
    newCategories.splice(targetIndex, 0, removed);

    reorderCategories(newCategories);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
  };

  return (
    <div className="flex-1">
      <AdminHeader
        title="Categorie"
        subtitle={`${categories.length} categorie`}
        primaryAction={{
          label: "Nuova Categoria",
          onClick: () => handleOpenModal(),
        }}
        onMenuClick={onMenuClick}
      />

      <div className="p-4 lg:p-6">
        {categories.length === 0 ? (
          <EmptyState
            icon={FolderOpen}
            title="Nessuna categoria"
            description="Crea la tua prima categoria per organizzare i prodotti"
            actionLabel="Crea Categoria"
            onAction={() => handleOpenModal()}
          />
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block bg-card rounded-2xl border border-border shadow-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/50">
                    <TableHead className="w-10"></TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Prodotti</TableHead>
                    <TableHead>Ordine</TableHead>
                    <TableHead className="w-32 text-right">Azioni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow
                      key={category.id}
                      className={cn("group cursor-move", draggedId === category.id && "opacity-50")}
                      draggable
                      onDragStart={() => handleDragStart(category.id)}
                      onDragOver={(e) => handleDragOver(e, category.id)}
                      onDragEnd={handleDragEnd}
                    >
                      <TableCell>
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                      </TableCell>
                      <TableCell className="font-medium text-foreground">
                        {category.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {getProductCount(category.id)} prodotti
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        #{category.sort}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" onClick={() => handleOpenModal(category.id)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => setDeleteConfirm(category.id)}>
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
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="bg-card rounded-2xl border border-border p-4 shadow-card"
                  draggable
                  onDragStart={() => handleDragStart(category.id)}
                  onDragOver={(e) => handleDragOver(e, category.id)}
                  onDragEnd={handleDragEnd}
                >
                  <div className="flex items-center gap-3">
                    <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{category.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {getProductCount(category.id)} prodotti • Ordine #{category.sort}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenModal(category.id)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteConfirm(category.id)}>
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

      {/* Category Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-sm bg-card">
          <DialogHeader>
            <DialogTitle>{editingId ? "Rinomina Categoria" : "Nuova Categoria"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Input
                placeholder="Nome categoria"
                value={categoryName}
                onChange={(e) => {
                  setCategoryName(e.target.value);
                  setError("");
                }}
                className={cn(error && "border-destructive")}
                autoFocus
              />
              {error && <p className="text-xs text-destructive mt-1">{error}</p>}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setModalOpen(false)}>
                Annulla
              </Button>
              <Button className="flex-1" onClick={handleSubmit}>
                {editingId ? "Salva" : "Crea"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteConfirm}
        onOpenChange={(open) => !open && setDeleteConfirm(null)}
        title="Elimina Categoria"
        description="Sei sicuro di voler eliminare questa categoria? L'azione non può essere annullata."
        confirmLabel="Elimina"
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        variant="destructive"
      />
    </div>
  );
}

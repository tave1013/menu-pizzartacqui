import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useAdmin } from "@/contexts/AdminContext";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, Trash2, Plus, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DAY_LABELS, AdminHours, DayHours } from "@/data/adminMockData";
import { cn } from "@/lib/utils";

type DayKey = keyof Omit<AdminHours, 'special'>;

export default function AdminHoursPage() {
  const { onMenuClick } = useOutletContext<{ onMenuClick: () => void }>();
  const { hours, updateHours, addSpecialClosure, removeSpecialClosure } = useAdmin();
  const { toast } = useToast();

  const [localHours, setLocalHours] = useState<AdminHours>(hours);
  const [addClosureOpen, setAddClosureOpen] = useState(false);
  const [newClosureDate, setNewClosureDate] = useState("");
  const [newClosureNote, setNewClosureNote] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const handleDayChange = (day: DayKey, field: keyof DayHours, value: string | boolean) => {
    setLocalHours((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
    setHasChanges(true);
  };

  const validateHours = () => {
    const days = Object.keys(DAY_LABELS) as DayKey[];
    for (const day of days) {
      const dayHours = localHours[day];
      if (!dayHours.closed) {
        if (dayHours.open >= dayHours.close && dayHours.close !== "00:00") {
          toast({
            title: "Errore orari",
            description: `${DAY_LABELS[day]}: l'orario di chiusura deve essere dopo l'apertura`,
            variant: "destructive",
            duration: 3000,
          });
          return false;
        }
      }
    }
    return true;
  };

  const handleSave = () => {
    if (!validateHours()) return;
    updateHours(localHours);
    setHasChanges(false);
    toast({ title: "Orari salvati", duration: 2000 });
  };

  const handleAddClosure = () => {
    if (!newClosureDate) {
      toast({ title: "Seleziona una data", variant: "destructive", duration: 2000 });
      return;
    }
    addSpecialClosure(newClosureDate, newClosureNote || "Chiusura speciale");
    setLocalHours((prev) => ({
      ...prev,
      special: [...prev.special, { date: newClosureDate, note: newClosureNote || "Chiusura speciale" }],
    }));
    setAddClosureOpen(false);
    setNewClosureDate("");
    setNewClosureNote("");
    toast({ title: "Chiusura aggiunta", duration: 2000 });
  };

  const handleRemoveClosure = (date: string) => {
    removeSpecialClosure(date);
    setLocalHours((prev) => ({
      ...prev,
      special: prev.special.filter((s) => s.date !== date),
    }));
    setDeleteConfirm(null);
    toast({ title: "Chiusura rimossa", duration: 2000 });
  };

  return (
    <div className="flex-1">
      <AdminHeader
        title="Orari di Apertura"
        subtitle="Gestisci gli orari del locale"
        onMenuClick={onMenuClick}
      />

      <div className="p-4 lg:p-6 space-y-6">
        {/* Weekly Hours */}
        <div className="bg-card rounded-2xl border border-border p-5 lg:p-6 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-foreground">Orari Settimanali</h2>
            {hasChanges && (
              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                Salva Modifiche
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {(Object.keys(DAY_LABELS) as DayKey[]).map((day) => {
              const dayHours = localHours[day];
              return (
                <div
                  key={day}
                  className={cn(
                    "grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 rounded-xl",
                    dayHours.closed ? "bg-red-50" : "bg-secondary"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id={`closed-${day}`}
                      checked={dayHours.closed}
                      onCheckedChange={(checked) => handleDayChange(day, "closed", !!checked)}
                    />
                    <Label htmlFor={`closed-${day}`} className="font-medium text-foreground">
                      {DAY_LABELS[day]}
                    </Label>
                  </div>

                  {!dayHours.closed && (
                    <>
                      <div className="flex items-center gap-2">
                        <Label className="text-sm text-muted-foreground w-16">Apre:</Label>
                        <Input
                          type="time"
                          value={dayHours.open}
                          onChange={(e) => handleDayChange(day, "open", e.target.value)}
                          className="w-32"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="text-sm text-muted-foreground w-16">Chiude:</Label>
                        <Input
                          type="time"
                          value={dayHours.close}
                          onChange={(e) => handleDayChange(day, "close", e.target.value)}
                          className="w-32"
                        />
                      </div>
                    </>
                  )}

                  {dayHours.closed && (
                    <div className="sm:col-span-3 flex items-center">
                      <span className="text-sm font-medium text-red-600">Chiuso</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Special Closures */}
        <div className="bg-card rounded-2xl border border-border p-5 lg:p-6 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-foreground">Chiusure Speciali</h2>
            <Button variant="outline" onClick={() => setAddClosureOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Aggiungi
            </Button>
          </div>

          {localHours.special.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Nessuna chiusura speciale programmata</p>
            </div>
          ) : (
            <div className="space-y-3">
              {localHours.special.map((closure) => (
                <div
                  key={closure.date}
                  className="flex items-center justify-between p-4 rounded-xl bg-secondary"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      {new Date(closure.date).toLocaleDateString("it-IT", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground">{closure.note}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteConfirm(closure.date)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Closure Modal */}
      <Dialog open={addClosureOpen} onOpenChange={setAddClosureOpen}>
        <DialogContent className="max-w-sm bg-card">
          <DialogHeader>
            <DialogTitle>Aggiungi Chiusura Speciale</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="closure-date">Data</Label>
              <Input
                id="closure-date"
                type="date"
                value={newClosureDate}
                onChange={(e) => setNewClosureDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div>
              <Label htmlFor="closure-note">Nota (opzionale)</Label>
              <Input
                id="closure-note"
                placeholder="Es. Natale, Ferragosto..."
                value={newClosureNote}
                onChange={(e) => setNewClosureNote(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setAddClosureOpen(false)}>
                Annulla
              </Button>
              <Button className="flex-1" onClick={handleAddClosure}>
                Aggiungi
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteConfirm}
        onOpenChange={(open) => !open && setDeleteConfirm(null)}
        title="Rimuovi Chiusura"
        description="Sei sicuro di voler rimuovere questa chiusura speciale?"
        confirmLabel="Rimuovi"
        onConfirm={() => deleteConfirm && handleRemoveClosure(deleteConfirm)}
        variant="destructive"
      />
    </div>
  );
}

import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, ExternalLink, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function AdminSettings() {
  const { onMenuClick } = useOutletContext<{ onMenuClick: () => void }>();
  const { settings, updateSettings } = useAdmin();
  const { toast } = useToast();

  const [formData, setFormData] = useState(settings);
  const [hasChanges, setHasChanges] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.localeName.trim()) {
      newErrors.localeName = "Nome locale obbligatorio";
    }
    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = "Numero WhatsApp obbligatorio";
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email non valida";
    }
    if (formData.instagram && !formData.instagram.startsWith("http")) {
      newErrors.instagram = "URL non valido";
    }
    if (formData.facebook && !formData.facebook.startsWith("http")) {
      newErrors.facebook = "URL non valido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    updateSettings(formData);
    setHasChanges(false);
    toast({ title: "Impostazioni salvate", duration: 2000 });
  };

  const handlePublish = () => {
    toast({ title: "Menu pubblicato con successo!", duration: 2000 });
  };

  return (
    <div className="flex-1">
      <AdminHeader
        title="Impostazioni"
        subtitle="Configura il tuo locale"
        onMenuClick={onMenuClick}
      />

      <div className="p-4 lg:p-6 space-y-6 max-w-3xl">
        {/* Locale Info */}
        <div className="bg-card rounded-2xl border border-border p-5 lg:p-6 shadow-card">
          <h2 className="font-semibold text-foreground mb-6">Dati del Locale</h2>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="localeName">Nome Locale *</Label>
              <Input
                id="localeName"
                value={formData.localeName}
                onChange={(e) => handleChange("localeName", e.target.value)}
                className={cn(errors.localeName && "border-destructive")}
              />
              {errors.localeName && <p className="text-xs text-destructive mt-1">{errors.localeName}</p>}
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="address">Indirizzo</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="whatsapp">WhatsApp *</Label>
              <Input
                id="whatsapp"
                type="tel"
                placeholder="+39..."
                value={formData.whatsapp}
                onChange={(e) => handleChange("whatsapp", e.target.value)}
                className={cn(errors.whatsapp && "border-destructive")}
              />
              {errors.whatsapp && <p className="text-xs text-destructive mt-1">{errors.whatsapp}</p>}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={cn(errors.email && "border-destructive")}
              />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
            </div>
          </div>
        </div>

        {/* Social */}
        <div className="bg-card rounded-2xl border border-border p-5 lg:p-6 shadow-card">
          <h2 className="font-semibold text-foreground mb-6">Social</h2>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="instagram">Instagram URL</Label>
              <Input
                id="instagram"
                type="url"
                placeholder="https://instagram.com/..."
                value={formData.instagram}
                onChange={(e) => handleChange("instagram", e.target.value)}
                className={cn(errors.instagram && "border-destructive")}
              />
              {errors.instagram && <p className="text-xs text-destructive mt-1">{errors.instagram}</p>}
            </div>

            <div>
              <Label htmlFor="facebook">Facebook URL</Label>
              <Input
                id="facebook"
                type="url"
                placeholder="https://facebook.com/..."
                value={formData.facebook}
                onChange={(e) => handleChange("facebook", e.target.value)}
                className={cn(errors.facebook && "border-destructive")}
              />
              {errors.facebook && <p className="text-xs text-destructive mt-1">{errors.facebook}</p>}
            </div>
          </div>
        </div>

        {/* Style */}
        <div className="bg-card rounded-2xl border border-border p-5 lg:p-6 shadow-card">
          <h2 className="font-semibold text-foreground mb-6">Stile</h2>
          
          <div>
            <Label htmlFor="brandColor">Colore Brand</Label>
            <div className="flex items-center gap-4 mt-2">
              <input
                type="color"
                id="brandColor"
                value={formData.brandColor}
                onChange={(e) => handleChange("brandColor", e.target.value)}
                className="w-12 h-12 rounded-lg border border-border cursor-pointer"
              />
              <Input
                value={formData.brandColor}
                onChange={(e) => handleChange("brandColor", e.target.value)}
                className="w-32"
              />
              <div
                className="h-10 flex-1 rounded-lg"
                style={{ backgroundColor: formData.brandColor }}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-card rounded-2xl border border-border p-5 lg:p-6 shadow-card">
          <h2 className="font-semibold text-foreground mb-6">Azioni</h2>
          
          <div className="flex flex-wrap gap-3">
            <a href="/menu" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="gap-2">
                <ExternalLink className="h-4 w-4" />
                Anteprima Menu
              </Button>
            </a>
            <Button onClick={handlePublish} className="gap-2">
              <Check className="h-4 w-4" />
              Pubblica
            </Button>
          </div>
        </div>

        {/* Save Button */}
        {hasChanges && (
          <div className="fixed bottom-6 right-6 z-50">
            <Button onClick={handleSave} size="lg" className="gap-2 shadow-lg">
              <Save className="h-5 w-5" />
              Salva Modifiche
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

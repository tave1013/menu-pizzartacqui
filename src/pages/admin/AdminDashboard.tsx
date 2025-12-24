import { useOutletContext } from "react-router-dom";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatsCard } from "@/components/admin/StatsCard";
import { useAdmin } from "@/contexts/AdminContext";
import { Package, FolderOpen, Clock, Calendar, ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { DAY_LABELS } from "@/data/adminMockData";
import { formatDistanceToNow } from "date-fns";
import { it } from "date-fns/locale";

export default function AdminDashboard() {
  const { onMenuClick } = useOutletContext<{ onMenuClick: () => void }>();
  const { products, categories, hours, activities } = useAdmin();

  const activeProducts = products.filter((p) => p.active).length;
  
  // Calculate if currently open
  const now = new Date();
  const dayKeys = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;
  const todayKey = dayKeys[now.getDay()];
  const todayHours = hours[todayKey];
  const isOpen = !todayHours.closed;

  // Next special closure
  const nextClosure = hours.special
    .filter((s) => new Date(s.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  return (
    <div className="flex-1">
      <AdminHeader
        title="Dashboard"
        subtitle="Panoramica del tuo menu"
        onMenuClick={onMenuClick}
      />

      <div className="p-4 lg:p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Prodotti Attivi"
            value={activeProducts}
            subtitle={`${products.length} totali`}
            icon={Package}
          />
          <StatsCard
            title="Categorie"
            value={categories.length}
            icon={FolderOpen}
          />
          <StatsCard
            title="Stato Attuale"
            value={isOpen ? "Aperto" : "Chiuso"}
            subtitle={todayHours.closed ? "Chiuso oggi" : `${todayHours.open} - ${todayHours.close}`}
            icon={Clock}
            variant={isOpen ? "success" : "danger"}
          />
          <StatsCard
            title="Prossima Chiusura"
            value={nextClosure ? new Date(nextClosure.date).toLocaleDateString("it-IT", { day: "numeric", month: "short" }) : "—"}
            subtitle={nextClosure?.note || "Nessuna chiusura programmata"}
            icon={Calendar}
            variant={nextClosure ? "warning" : "default"}
          />
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-card rounded-2xl border border-border p-5 lg:p-6 shadow-card">
            <h2 className="font-semibold text-foreground mb-4">Attività Recenti</h2>
            <div className="space-y-3">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.target}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true, locale: it })}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-card rounded-2xl border border-border p-5 lg:p-6 shadow-card">
            <h2 className="font-semibold text-foreground mb-4">Guida Rapida</h2>
            <div className="space-y-3">
              <Link
                to="/admin/prodotti"
                className="flex items-center justify-between p-4 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Plus className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Aggiungi Prodotto</p>
                    <p className="text-xs text-muted-foreground">Crea un nuovo piatto o bevanda</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/admin/categorie"
                className="flex items-center justify-between p-4 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <FolderOpen className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Crea Categoria</p>
                    <p className="text-xs text-muted-foreground">Organizza i tuoi prodotti</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/admin/orari"
                className="flex items-center justify-between p-4 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Imposta Orari</p>
                    <p className="text-xs text-muted-foreground">Configura aperture e chiusure</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Weekly Hours Preview */}
        <div className="bg-card rounded-2xl border border-border p-5 lg:p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Orari Settimanali</h2>
            <Link to="/admin/orari">
              <Button variant="ghost" size="sm" className="gap-1">
                Modifica <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {(Object.keys(DAY_LABELS) as Array<keyof typeof hours>).filter(k => k !== 'special').map((day) => {
              const dayHours = hours[day as keyof Omit<typeof hours, 'special'>];
              if (typeof dayHours === 'object' && 'closed' in dayHours) {
                return (
                  <div
                    key={day}
                    className={`p-3 rounded-xl text-center ${
                      dayHours.closed ? "bg-red-50 border border-red-200" : "bg-secondary"
                    }`}
                  >
                    <p className="text-xs font-medium text-muted-foreground mb-1">
                      {DAY_LABELS[day]}
                    </p>
                    {dayHours.closed ? (
                      <p className="text-sm font-semibold text-red-600">Chiuso</p>
                    ) : (
                      <p className="text-sm font-semibold text-foreground">
                        {dayHours.open}–{dayHours.close}
                      </p>
                    )}
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

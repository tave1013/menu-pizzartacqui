import { Phone, Mail, MapPin } from "lucide-react";
import { restaurantInfo } from "@/data/menuData";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";

// Icone social custom (SVG inline per evitare dipendenze esterne)
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { totalItems } = useCart();
  
  // Se c'è il carrello visibile, aggiungi padding extra in fondo
  const hasCartBar = totalItems > 0;
  
  // Costruisci URL Google Maps
  const mapsUrl = restaurantInfo.coordinates 
    ? `https://www.google.com/maps?q=${restaurantInfo.coordinates.lat},${restaurantInfo.coordinates.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurantInfo.address)}`;

  return (
    <footer className={cn(
      "bg-card border-t border-border mt-auto",
      hasCartBar && "pb-20" // Padding extra quando c'è la barra carrello
    )}>
      <div className="container py-8 lg:py-12">
        {/* Grid principale */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Colonna 1: Info locale */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-card-foreground">
              {restaurantInfo.name}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {restaurantInfo.cuisine}. Pizzeria artigianale nel cuore di Acqui Terme, 
              dove tradizione e qualità si incontrano per offrirti un'esperienza unica.
            </p>
          </div>

          {/* Colonna 2: Contatti */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-card-foreground uppercase tracking-wide">
              Contatti
            </h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href={`tel:${restaurantInfo.bookingPhone}`}
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors group"
                >
                  <Phone className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                  <span>{restaurantInfo.bookingPhone}</span>
                </a>
              </li>
              <li>
                <a 
                  href={`mailto:${restaurantInfo.email}`}
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors group"
                >
                  <Mail className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                  <span>{restaurantInfo.email}</span>
                </a>
              </li>
              <li>
                <a 
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-sm text-muted-foreground hover:text-primary transition-colors group"
                >
                  <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <span>{restaurantInfo.address}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Colonna 3: Orari */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-card-foreground uppercase tracking-wide">
              Orari di apertura
            </h4>
            <ul className="space-y-2">
              {restaurantInfo.weeklyHours.map((schedule) => (
                <li 
                  key={schedule.day}
                  className="flex justify-between text-sm"
                >
                  <span className="text-muted-foreground">{schedule.day}</span>
                  <span className={cn(
                    "font-medium",
                    schedule.closed ? "text-destructive" : "text-card-foreground"
                  )}>
                    {schedule.closed ? "Chiuso" : schedule.hours.replace(",", "")}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonna 4: Social */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-card-foreground uppercase tracking-wide">
              Seguici
            </h4>
            <div className="flex gap-4">
              {restaurantInfo.facebookUrl && (
                <a
                  href={restaurantInfo.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "w-10 h-10 rounded-full",
                    "bg-secondary hover:bg-primary",
                    "flex items-center justify-center",
                    "text-muted-foreground hover:text-primary-foreground",
                    "transition-all duration-200 hover:scale-110"
                  )}
                  aria-label="Facebook"
                >
                  <FacebookIcon className="w-5 h-5" />
                </a>
              )}
              {restaurantInfo.instagramUrl && (
                <a
                  href={restaurantInfo.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "w-10 h-10 rounded-full",
                    "bg-secondary hover:bg-primary",
                    "flex items-center justify-center",
                    "text-muted-foreground hover:text-primary-foreground",
                    "transition-all duration-200 hover:scale-110"
                  )}
                  aria-label="Instagram"
                >
                  <InstagramIcon className="w-5 h-5" />
                </a>
              )}
              {restaurantInfo.googleBusinessUrl && (
                <a
                  href={restaurantInfo.googleBusinessUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "w-10 h-10 rounded-full",
                    "bg-secondary hover:bg-primary",
                    "flex items-center justify-center",
                    "text-muted-foreground hover:text-primary-foreground",
                    "transition-all duration-200 hover:scale-110"
                  )}
                  aria-label="Google My Business"
                >
                  <GoogleIcon className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Divider e sezione legale */}
        <div className="border-t border-border mt-8 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">
              © {currentYear} {restaurantInfo.name}. Tutti i diritti riservati.
            </p>
            
            {/* Link legali */}
            <div className="flex items-center gap-4">
              <a 
                href="/privacy-policy" 
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                Privacy Policy
              </a>
              <span className="text-muted-foreground/50">|</span>
              <a 
                href="/cookie-policy" 
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

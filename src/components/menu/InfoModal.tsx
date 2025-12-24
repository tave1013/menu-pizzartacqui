import { useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  ExternalLink,
  Facebook,
  Instagram,
  AlertTriangle
} from "lucide-react";
import { RestaurantInfo, DayHours } from "@/data/menuData";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantInfo: RestaurantInfo;
}

// Helper to get today's day name in Italian
function getTodayDayName(): string {
  const days = ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"];
  return days[new Date().getDay()];
}

// Helper to parse time string to minutes
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

// Helper to check if currently open
function isCurrentlyOpen(weeklyHours: DayHours[]): { isOpen: boolean; closingTime?: string; nextOpening?: string } {
  const today = getTodayDayName();
  const todayData = weeklyHours.find(d => d.day === today);
  
  if (!todayData || todayData.closed) {
    // Find next opening
    const daysOrder = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"];
    const todayIndex = daysOrder.indexOf(today);
    for (let i = 1; i <= 7; i++) {
      const nextDayIndex = (todayIndex + i) % 7;
      const nextDay = weeklyHours.find(d => d.day === daysOrder[nextDayIndex]);
      if (nextDay && !nextDay.closed && nextDay.hours) {
        const firstSlot = nextDay.hours.split(",")[0].trim().split(" - ")[0];
        return { isOpen: false, nextOpening: `${nextDay.day} ${firstSlot}` };
      }
    }
    return { isOpen: false };
  }
  
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  // Check each time slot
  const slots = todayData.hours.split(",").map(s => s.trim());
  for (const slot of slots) {
    const [start, end] = slot.split(" - ").map(s => s.trim());
    const startMin = timeToMinutes(start);
    let endMin = timeToMinutes(end);
    
    // Handle midnight crossing
    if (endMin < startMin) endMin += 24 * 60;
    
    if (currentMinutes >= startMin && currentMinutes < endMin) {
      return { isOpen: true, closingTime: end };
    }
  }
  
  // Not open now, find next slot today or tomorrow
  for (const slot of slots) {
    const [start] = slot.split(" - ").map(s => s.trim());
    const startMin = timeToMinutes(start);
    if (currentMinutes < startMin) {
      return { isOpen: false, nextOpening: `Oggi ${start}` };
    }
  }
  
  // Find next day opening
  const daysOrder = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"];
  const todayIndex = daysOrder.indexOf(today);
  for (let i = 1; i <= 7; i++) {
    const nextDayIndex = (todayIndex + i) % 7;
    const nextDay = weeklyHours.find(d => d.day === daysOrder[nextDayIndex]);
    if (nextDay && !nextDay.closed && nextDay.hours) {
      const firstSlot = nextDay.hours.split(",")[0].trim().split(" - ")[0];
      return { isOpen: false, nextOpening: `${nextDay.day} ${firstSlot}` };
    }
  }
  
  return { isOpen: false };
}

export function InfoModal({ isOpen, onClose, restaurantInfo }: InfoModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const prefersReduced = useReducedMotion();

  const openStatus = useMemo(() => isCurrentlyOpen(restaurantInfo.weeklyHours), [restaurantInfo.weeklyHours]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { opacity: 1, scale: 1 },
  };

  const googleMapsUrl = restaurantInfo.coordinates 
    ? `https://www.google.com/maps/search/?api=1&query=${restaurantInfo.coordinates.lat},${restaurantInfo.coordinates.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurantInfo.address)}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="info-modal-title"
        >
          {/* Backdrop */}
          <motion.div
            variants={prefersReduced ? undefined : backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.18 }}
            className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            variants={prefersReduced ? undefined : modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2, ease: [0.22, 0.61, 0.36, 1] }}
            className="relative w-full max-w-lg bg-card rounded-2xl shadow-modal overflow-hidden max-h-[85vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 pb-0 flex-shrink-0">
              <h2 id="info-modal-title" className="text-lg font-bold text-card-foreground">
                Informazioni su {restaurantInfo.name}
              </h2>
              <button
                ref={closeButtonRef}
                onClick={onClose}
                className={cn(
                  "w-10 h-10 rounded-full flex-shrink-0",
                  "flex items-center justify-center",
                  "text-muted-foreground hover:text-card-foreground hover:bg-secondary",
                  "transition-colors duration-160",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                )}
                aria-label="Chiudi"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 space-y-6 overflow-y-auto flex-1">
              
              {/* Hours Section */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <h3 className="font-semibold text-card-foreground">Orari</h3>
                  </div>
                  {/* Open/Closed Status Badge */}
                  {openStatus.isOpen ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-green-500/15 text-green-600 rounded-full">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      Aperto ora · chiude alle {openStatus.closingTime}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-full">
                      Chiuso {openStatus.nextOpening && `· apre ${openStatus.nextOpening}`}
                    </span>
                  )}
                </div>
                
                {/* Weekly Hours Table */}
                <div className="bg-secondary/30 rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <tbody>
                      {restaurantInfo.weeklyHours.map((dayData) => {
                        const isToday = dayData.day === getTodayDayName();
                        return (
                          <tr 
                            key={dayData.day} 
                            className={cn(
                              "border-b border-border/30 last:border-0",
                              isToday && "bg-primary/5"
                            )}
                          >
                            <td className={cn(
                              "py-2.5 px-3 font-medium",
                              isToday ? "text-primary" : "text-card-foreground"
                            )}>
                              {dayData.day}
                              {isToday && <span className="text-xs ml-1.5 text-primary/70">(oggi)</span>}
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              {dayData.closed ? (
                                <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-destructive/15 text-destructive rounded-md">
                                  Chiuso
                                </span>
                              ) : (
                                <div className="text-muted-foreground">
                                  {dayData.hours.split(",").map((slot, i) => (
                                    <div key={i}>{slot.trim()}</div>
                                  ))}
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Contacts Section */}
              {(restaurantInfo.phone || restaurantInfo.email || restaurantInfo.facebookUrl || restaurantInfo.instagramUrl) && (
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <h3 className="font-semibold text-card-foreground">Contatti</h3>
                  </div>
                  
                  <div className="space-y-2">
                    {restaurantInfo.phone && (
                      <a 
                        href={`tel:${restaurantInfo.phone.replace(/\s/g, "")}`}
                        className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors group"
                        aria-label={`Chiama ${restaurantInfo.phone}`}
                      >
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                          <Phone className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-card-foreground group-hover:text-primary transition-colors">
                          {restaurantInfo.phone}
                        </span>
                      </a>
                    )}
                    
                    {restaurantInfo.email && (
                      <a 
                        href={`mailto:${restaurantInfo.email}`}
                        className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors group"
                        aria-label={`Invia email a ${restaurantInfo.email}`}
                      >
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                          <Mail className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-card-foreground group-hover:text-primary transition-colors">
                          {restaurantInfo.email}
                        </span>
                      </a>
                    )}
                    
                    {restaurantInfo.facebookUrl && (
                      <a 
                        href={restaurantInfo.facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors group"
                        aria-label={`Apri ${restaurantInfo.name} su Facebook`}
                      >
                        <div className="w-9 h-9 rounded-full bg-[#1877F2]/10 flex items-center justify-center">
                          <Facebook className="w-4 h-4 text-[#1877F2]" />
                        </div>
                        <span className="text-card-foreground group-hover:text-[#1877F2] transition-colors flex-1">
                          {restaurantInfo.facebookName || "Facebook"}
                        </span>
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                      </a>
                    )}
                    
                    {restaurantInfo.instagramUrl && (
                      <a 
                        href={restaurantInfo.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors group"
                        aria-label={`Apri ${restaurantInfo.name} su Instagram`}
                      >
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#F58529]/10 via-[#DD2A7B]/10 to-[#8134AF]/10 flex items-center justify-center">
                          <Instagram className="w-4 h-4 text-[#DD2A7B]" />
                        </div>
                        <span className="text-card-foreground group-hover:text-[#DD2A7B] transition-colors flex-1">
                          {restaurantInfo.instagramHandle || "Instagram"}
                        </span>
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                      </a>
                    )}
                  </div>
                </section>
              )}

              {/* Address Section */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <h3 className="font-semibold text-card-foreground">Indirizzo</h3>
                </div>
                
                {/* Map */}
                <div className="rounded-xl overflow-hidden mb-3 bg-secondary/30">
                  <iframe
                    title={`Mappa di ${restaurantInfo.name}`}
                    width="100%"
                    height="180"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(restaurantInfo.address)}&zoom=15`}
                  />
                </div>
                
                {/* Address Text */}
                <p className="text-sm text-muted-foreground mb-2">
                  {restaurantInfo.address}
                </p>
                
                {/* View Map Link */}
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-link hover:underline"
                >
                  <MapPin className="w-4 h-4" />
                  Apri in Google Maps
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </section>

              {/* Allergens Section */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-muted-foreground" />
                  <h3 className="font-semibold text-card-foreground">Allergeni</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Le informazioni sugli allergeni sono indicate nelle schede dei singoli prodotti. 
                  Per maggiori informazioni o in caso di dubbi, contatta il ristorante al numero{" "}
                  {restaurantInfo.phone ? (
                    <a 
                      href={`tel:${restaurantInfo.phone.replace(/\s/g, "")}`}
                      className="text-link hover:underline font-medium"
                    >
                      {restaurantInfo.phone}
                    </a>
                  ) : (
                    "indicato nella sezione Contatti"
                  )}
                  .
                </p>
              </section>

              {/* Footer Note */}
              <p className="text-xs text-muted-foreground text-center pt-2 border-t border-border/50">
                Menu di consultazione – nessun acquisto online
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

import { Star, Clock, MapPin, Info, Calendar } from "lucide-react";
import { RestaurantInfo } from "@/data/menuData";
import heroImage from "../../assets/heropizzart.png";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { InfoModal } from "./InfoModal";
import { Button } from "@/components/ui/button";
interface RestaurantHeroProps {
  info: RestaurantInfo;
}

function getTodayHours(weeklyHours: RestaurantInfo["weeklyHours"]) {
  const dayIndex = new Date().getDay();
  const italianDayIndex = dayIndex === 0 ? 6 : dayIndex - 1;
  return weeklyHours[italianDayIndex];
}

function isCurrentlyOpen(todayHours: { hours: string; closed?: boolean }): boolean {
  if (todayHours.closed) return false;
  
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  const [openTime, closeTime] = todayHours.hours.split(" - ");
  const [openH, openM] = openTime.split(":").map(Number);
  const [closeH, closeM] = closeTime.split(":").map(Number);
  
  const openMinutes = openH * 60 + openM;
  let closeMinutes = closeH * 60 + closeM;
  
  if (closeMinutes === 0) closeMinutes = 24 * 60;
  
  return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
}

export function RestaurantHero({ info }: RestaurantHeroProps) {
  const navigate = useNavigate();
  const [showInfo, setShowInfo] = useState(false);

  const todayHours = useMemo(
    () => getTodayHours(info.weeklyHours),
    [info.weeklyHours]
  );

  const isOpen = useMemo(() => isCurrentlyOpen(todayHours), [todayHours]);

  return (
    <>
      <header className="relative">
        {/* Hero Image */}
        <div className="relative h-[220px] sm:h-[280px] lg:h-[320px] overflow-hidden">
          <img
            src={heroImage}
            alt={`${info.name} - interno del ristorante`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
        </div>

        {/* Restaurant Info */}
        <div className="container relative -mt-16 pb-4">
          <div className="bg-card rounded-2xl shadow-card p-4 sm:p-6">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-card-foreground">
                {info.name}
              </h1>
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                  isOpen
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                    : "bg-destructive/15 text-destructive"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                    isOpen ? "bg-emerald-500" : "bg-destructive"
                  }`}
                />
                {isOpen ? "Aperto" : "Chiuso"}
              </span>
            </div>

            {/* Rating & Reviews */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-primary text-primary" />
                <span className="font-semibold text-card-foreground">{info.rating}</span>
                <span>({info.reviewCount}+ recensioni)</span>
              </div>
              <span className="text-card-foreground font-medium">{info.priceRange}</span>
              <span>{info.cuisine}</span>
            </div>

            {/* Address & Hours */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                <span>{info.address}</span>
              </div>
              
              <button 
                onClick={() => setShowInfo(true)}
                className="flex items-center gap-1.5 hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
              >
                <Clock className="w-4 h-4" />
                <span>{todayHours.closed ? "Chiuso oggi" : todayHours.hours}</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {info.deliverooUrl && (
                <Button
                  asChild
                  className="bg-[#00CCBC] hover:bg-[#00b8a9] text-white font-semibold"
                >
                  <a href={info.deliverooUrl} target="_blank" rel="noopener noreferrer">
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.5 0h-11C2.9 0 0 2.9 0 6.5v11C0 21.1 2.9 24 6.5 24h11c3.6 0 6.5-2.9 6.5-6.5v-11C24 2.9 21.1 0 17.5 0zm-5.4 18.9c-3.8 0-6.9-3.1-6.9-6.9s3.1-6.9 6.9-6.9 6.9 3.1 6.9 6.9-3.1 6.9-6.9 6.9zm0-11.3c-2.4 0-4.4 2-4.4 4.4s2 4.4 4.4 4.4 4.4-2 4.4-4.4-2-4.4-4.4-4.4z"/>
                    </svg>
                    Ordina con Deliveroo
                  </a>
                </Button>
              )}
              <Button
                variant="outline"
                className="font-semibold"
                onClick={() => navigate('/prenota')}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Riserva un tavolo
              </Button>
            </div>

            {/* Info Link */}
            <button
              onClick={() => setShowInfo(true)}
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
            >
              <Info className="w-4 h-4" />
              Info e allergeni
            </button>
          </div>
        </div>
      </header>

      <InfoModal
        isOpen={showInfo}
        onClose={() => setShowInfo(false)}
        restaurantInfo={info}
      />
    </>
  );
}

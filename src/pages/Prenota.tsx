import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CalendarDays, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { restaurantInfo } from "@/data/menuData";
import { motion, AnimatePresence } from "framer-motion";
import { FullscreenCalendar } from "@/components/menu/FullscreenCalendar";

type Step = 1 | 2 | 3;

interface BookingData {
  date: Date | undefined;
  adults: number;
  children: number;
  time: string;
  notes: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  privacyConsent: boolean;
  contactConsent: boolean;
}

interface PendingBooking {
  time: number;
  tipo: string;
  locale: string;
  numeroWhatsApp: string;
  payload: {
    data: string;
    orario: string;
    adulti: number;
    bambini: number;
    note: string;
    nome: string;
    cognome: string;
    telefono: string;
    email: string;
  };
  messaggio: string;
}

const TIME_SLOTS = ["19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30"];
const WHATSAPP_NUMBER = "393914272540";
const MAX_BOOKING_DAYS = 20;
const PENDING_TIMEOUT = 3600000; // 1 hour
const MIN_BOOKING_MINUTES_AHEAD = 30; // Minimum minutes before slot to allow booking

function getItalianDayIndex(date: Date): number {
  const dayIndex = date.getDay();
  return dayIndex === 0 ? 6 : dayIndex - 1;
}

function isDayClosed(date: Date): boolean {
  const italianIndex = getItalianDayIndex(date);
  return restaurantInfo.weeklyHours[italianIndex]?.closed === true;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function timeSlotToMinutes(slot: string): number {
  const [hours, minutes] = slot.split(":").map(Number);
  return hours * 60 + minutes;
}

function getAvailableTimeSlots(date: Date, now: Date): string[] {
  const italianIndex = getItalianDayIndex(date);
  const dayHours = restaurantInfo.weeklyHours[italianIndex];
  
  if (dayHours?.closed) return [];
  
  // If it's today, filter out past slots
  if (isSameDay(date, now)) {
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const minBookableMinutes = nowMinutes + MIN_BOOKING_MINUTES_AHEAD;
    
    return TIME_SLOTS.filter(slot => {
      const slotMinutes = timeSlotToMinutes(slot);
      return slotMinutes > minBookableMinutes;
    });
  }
  
  return TIME_SLOTS;
}

// Check if today still has bookable slots
function hasTodayAvailableSlots(now: Date): boolean {
  if (isDayClosed(now)) return false;
  return getAvailableTimeSlots(now, now).length > 0;
}

function formatDateItalian(date: Date): string {
  return date.toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

function isDateValid(dateStr: string, today: Date, maxDate: Date): boolean {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return false;
    if (date < today) return false;
    if (date > maxDate) return false;
    if (isDayClosed(date)) return false;
    return true;
  } catch {
    return false;
  }
}

export default function Prenota() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [pendingBooking, setPendingBooking] = useState<PendingBooking | null>(null);
  
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const maxDate = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + MAX_BOOKING_DAYS);
    return d;
  }, [today]);

  const [bookingData, setBookingData] = useState<BookingData>(() => {
    // Load draft from localStorage
    const draft = localStorage.getItem("prenotaDraft");
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        let date: Date | undefined;
        if (parsed.date && isDateValid(parsed.date, today, maxDate)) {
          date = new Date(parsed.date);
        }
        return {
          date,
          adults: parsed.adults || 1,
          children: parsed.children || 0,
          time: parsed.time || "",
          notes: parsed.notes || "",
          firstName: parsed.firstName || "",
          lastName: parsed.lastName || "",
          phone: parsed.phone || "",
          email: parsed.email || "",
          privacyConsent: false,
          contactConsent: false
        };
      } catch {
        // Invalid draft
      }
    }
    return {
      date: undefined,
      adults: 1,
      children: 0,
      time: "",
      notes: "",
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      privacyConsent: false,
      contactConsent: false
    };
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Save draft to localStorage with debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      const draftData = {
        date: bookingData.date?.toISOString(),
        adults: bookingData.adults,
        children: bookingData.children,
        time: bookingData.time,
        notes: bookingData.notes,
        firstName: bookingData.firstName,
        lastName: bookingData.lastName,
        phone: bookingData.phone,
        email: bookingData.email
      };
      localStorage.setItem("prenotaDraft", JSON.stringify(draftData));
    }, 200);
    return () => clearTimeout(timeout);
  }, [bookingData]);

  // Check for pending booking on mount and visibility change
  useEffect(() => {
    const checkPending = () => {
      const pending = localStorage.getItem("prenotazioneInAttesa");
      if (pending) {
        try {
          const parsed: PendingBooking = JSON.parse(pending);
          setPendingBooking(parsed);
          
          // Check if expired (> 1 hour)
          if (Date.now() - parsed.time > PENDING_TIMEOUT) {
            // Show banner instead of modal for expired
            toast("Prenotazione in sospeso", {
              description: "Hai una prenotazione non completata.",
              duration: 5000,
            });
          } else {
            setShowPendingModal(true);
          }
        } catch {
          localStorage.removeItem("prenotazioneInAttesa");
        }
      }
    };

    checkPending();

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        checkPending();
      }
    };

    const handleFocus = () => {
      checkPending();
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  // Scroll to top on step change
  useEffect(() => {
    if (step === 2 || step === 3) {
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
        const container = document.querySelector("[data-page-scroll]");
        if (container) container.scrollTop = 0;
      });
    }
  }, [step]);

  const now = useMemo(() => new Date(), []);
  
  const availableSlots = useMemo(() => {
    if (!bookingData.date) return [];
    return getAvailableTimeSlots(bookingData.date, now);
  }, [bookingData.date, now]);

  const canProceedStep1 = !!bookingData.date && !isDayClosed(bookingData.date);
  const canProceedStep2 = bookingData.adults >= 1 && !!bookingData.time;
  const canProceedStep3 = 
    bookingData.firstName.trim() && 
    bookingData.lastName.trim() && 
    bookingData.phone.trim() && 
    bookingData.email.trim() &&
    bookingData.privacyConsent && 
    bookingData.contactConsent &&
    !errors.phone && !errors.email;

  const validatePhone = (value: string): string => {
    const cleaned = value.replace(/[\s\-\(\)]/g, '');
    if (!/^(\+39)?[0-9]{9,11}$/.test(cleaned)) {
      return "Numero di telefono non valido";
    }
    return "";
  };

  const validateEmail = (value: string): string => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Email non valida";
    }
    return "";
  };

  const handleNext = () => {
    if (step < 3) {
      setDirection(1);
      setStep((s) => (s + 1) as Step);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setDirection(-1);
      setStep((s) => (s - 1) as Step);
    } else {
      navigate(-1);
    }
  };

  const buildWhatsAppMessage = useCallback(() => {
    if (!bookingData.date) return "";
    
    const childrenLine = bookingData.children > 0 ? ` + ${bookingData.children} bambini` : "";
    const notesLine = bookingData.notes.trim() ? `\n\n📝 Note: ${bookingData.notes.trim()}` : "";
    
    return `📅 *Richiesta Prenotazione Tavolo* — ${restaurantInfo.name}

🗓️ Data: ${formatDateItalian(bookingData.date)}
🕒 Orario: ${bookingData.time}
👥 Persone: ${bookingData.adults} adulti${childrenLine}${notesLine}

👤 *Nome:* ${bookingData.firstName} ${bookingData.lastName}
📞 *Telefono:* ${bookingData.phone}
✉️ *Email:* ${bookingData.email}

✅ Consensi: Privacy accettata, ok a ricontatto.`;
  }, [bookingData]);

  const handleSubmit = () => {
    if (!canProceedStep3 || !bookingData.date) return;

    const message = buildWhatsAppMessage();
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    
    // Save pending booking
    const pendingData: PendingBooking = {
      time: Date.now(),
      tipo: "tavolo",
      locale: restaurantInfo.name,
      numeroWhatsApp: WHATSAPP_NUMBER,
      payload: {
        data: bookingData.date.toISOString().split('T')[0],
        orario: bookingData.time,
        adulti: bookingData.adults,
        bambini: bookingData.children,
        note: bookingData.notes,
        nome: bookingData.firstName,
        cognome: bookingData.lastName,
        telefono: bookingData.phone,
        email: bookingData.email
      },
      messaggio: message
    };
    
    localStorage.setItem("prenotazioneInAttesa", JSON.stringify(pendingData));
    
    window.open(whatsappUrl, '_blank');
    
    toast("WhatsApp aperto. Premi Invia per completare la richiesta.", {
      duration: 4000,
    });
  };

  const handleConfirmSent = () => {
    if (pendingBooking) {
      localStorage.setItem("prenotazioneConfermata", JSON.stringify(pendingBooking));
      localStorage.removeItem("prenotazioneInAttesa");
      localStorage.removeItem("prenotaDraft");
      setShowPendingModal(false);
      navigate("/prenota/grazie");
    }
  };

  const handleReopenWhatsApp = () => {
    if (pendingBooking) {
      const whatsappUrl = `https://wa.me/${pendingBooking.numeroWhatsApp}?text=${encodeURIComponent(pendingBooking.messaggio)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const handleModifyBooking = () => {
    if (pendingBooking) {
      // Prefill data from pending booking
      const payload = pendingBooking.payload;
      let date: Date | undefined;
      if (payload.data && isDateValid(payload.data, today, maxDate)) {
        date = new Date(payload.data);
      }
      
      setBookingData({
        date,
        adults: payload.adulti,
        children: payload.bambini,
        time: payload.orario,
        notes: payload.note,
        firstName: payload.nome,
        lastName: payload.cognome,
        phone: payload.telefono,
        email: payload.email,
        privacyConsent: false,
        contactConsent: false
      });
      
      localStorage.removeItem("prenotazioneInAttesa");
      setShowPendingModal(false);
      setStep(1);
    }
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (dir: number) => ({
      x: dir > 0 ? "-100%" : "100%",
      opacity: 0
    })
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Pending booking modal */}
      <Dialog open={showPendingModal} onOpenChange={setShowPendingModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Hai inviato il messaggio?</DialogTitle>
            <DialogDescription>
              Conferma se hai completato l'invio su WhatsApp.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 pt-4">
            <Button onClick={handleConfirmSent} className="w-full">
              ✅ Sì, ho inviato su WhatsApp
            </Button>
            <Button variant="outline" onClick={handleReopenWhatsApp} className="w-full">
              🔁 Riapri WhatsApp
            </Button>
            <Button variant="ghost" onClick={handleModifyBooking} className="w-full">
              ✏️ Modifica prenotazione
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container flex items-center h-14">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded p-1"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="sr-only sm:not-sr-only text-sm font-medium">Indietro</span>
          </button>
          <h1 className="flex-1 text-center font-semibold text-foreground">
            {step === 1 && "Seleziona data"}
            {step === 2 && "Dettagli prenotazione"}
            {step === 3 && "I tuoi dati"}
          </h1>
          <div className="w-10" />
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col overflow-hidden" data-page-scroll>
        <AnimatePresence mode="wait" custom={direction}>
{step === 1 && (
            <motion.div
              key="step1"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="grid min-h-0 px-4"
              style={{ 
                gridTemplateRows: "auto auto 1fr",
                height: "calc(100vh - 56px - 80px)",
              }}
            >
              {/* Info text */}
              <p className="text-xs text-muted-foreground text-center py-2">
                È possibile prenotare fino a 20 giorni in anticipo.
              </p>
              
              {/* Selected date display */}
              <p className="text-sm text-center pb-2">
                <span className="text-muted-foreground">Data selezionata: </span>
                <span className="font-medium text-foreground">
                  {bookingData.date ? formatDateItalian(bookingData.date) : "—"}
                </span>
              </p>

              {/* Fullscreen calendar - fills remaining space */}
              <div className="min-h-0 overflow-hidden">
                <FullscreenCalendar
                  selectedDate={bookingData.date}
                  onSelectDate={(date) => setBookingData(prev => ({ ...prev, date }))}
                  today={today}
                  maxDate={maxDate}
                  isDateDisabled={(date) => {
                    if (date < today) return true;
                    if (date > maxDate) return true;
                    if (isDayClosed(date)) return true;
                    // If it's today, check if there are still bookable slots
                    if (isSameDay(date, today) && !hasTodayAvailableSlots(new Date())) return true;
                    return false;
                  }}
                />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="py-6 px-4 space-y-6 pb-24"
            >
              {/* Adults selector */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Adulti</Label>
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-full"
                    onClick={() => setBookingData(prev => ({ ...prev, adults: Math.max(1, prev.adults - 1) }))}
                    disabled={bookingData.adults <= 1}
                    aria-label="Diminuisci adulti"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="text-xl font-semibold w-8 text-center">{bookingData.adults}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-full"
                    onClick={() => setBookingData(prev => ({ ...prev, adults: Math.min(12, prev.adults + 1) }))}
                    disabled={bookingData.adults >= 12}
                    aria-label="Aumenta adulti"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Children selector */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Bambini</Label>
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-full"
                    onClick={() => setBookingData(prev => ({ ...prev, children: Math.max(0, prev.children - 1) }))}
                    disabled={bookingData.children <= 0}
                    aria-label="Diminuisci bambini"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="text-xl font-semibold w-8 text-center">{bookingData.children}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-full"
                    onClick={() => setBookingData(prev => ({ ...prev, children: Math.min(12, prev.children + 1) }))}
                    disabled={bookingData.children >= 12}
                    aria-label="Aumenta bambini"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Time slots */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Seleziona orario</Label>
                <div className="grid grid-cols-4 gap-2">
                  {TIME_SLOTS.map((slot) => {
                    const isAvailable = availableSlots.includes(slot);
                    const isSelected = bookingData.time === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => isAvailable && setBookingData(prev => ({ ...prev, time: slot }))}
                        disabled={!isAvailable}
                        className={cn(
                          "py-2.5 px-3 rounded-lg text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : isAvailable
                              ? "bg-muted hover:bg-muted/80 text-foreground"
                              : "bg-muted/50 text-muted-foreground cursor-not-allowed opacity-50"
                        )}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-3">
                <Label htmlFor="notes" className="text-base font-medium">Aggiungi note</Label>
                <Textarea
                  id="notes"
                  value={bookingData.notes}
                  onChange={(e) => {
                    if (e.target.value.length <= 300) {
                      setBookingData(prev => ({ ...prev, notes: e.target.value }));
                    }
                  }}
                  placeholder="Es. 2 persone intolleranti al glutine; seggiolino per bambino"
                  className="min-h-[100px] resize-none"
                  maxLength={300}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {bookingData.notes.length}/300
                </p>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="py-6 px-4 space-y-4 pb-24"
            >
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="firstName">Nome *</Label>
                <Input
                  id="firstName"
                  value={bookingData.firstName}
                  onChange={(e) => setBookingData(prev => ({ ...prev, firstName: e.target.value }))}
                  placeholder="Mario"
                  className="h-11"
                />
              </div>

              {/* Surname */}
              <div className="space-y-2">
                <Label htmlFor="lastName">Cognome *</Label>
                <Input
                  id="lastName"
                  value={bookingData.lastName}
                  onChange={(e) => setBookingData(prev => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Rossi"
                  className="h-11"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Telefono *</Label>
                <Input
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  value={bookingData.phone}
                  onChange={(e) => {
                    const value = e.target.value;
                    setBookingData(prev => ({ ...prev, phone: value }));
                    if (value.trim()) {
                      setErrors(prev => ({ ...prev, phone: validatePhone(value) }));
                    } else {
                      setErrors(prev => ({ ...prev, phone: "" }));
                    }
                  }}
                  placeholder="+39 333 1234567"
                  className={cn("h-11", errors.phone && "border-destructive")}
                />
                {errors.phone && (
                  <p className="text-xs text-destructive">{errors.phone}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  inputMode="email"
                  value={bookingData.email}
                  onChange={(e) => {
                    const value = e.target.value;
                    setBookingData(prev => ({ ...prev, email: value }));
                    if (value.trim()) {
                      setErrors(prev => ({ ...prev, email: validateEmail(value) }));
                    } else {
                      setErrors(prev => ({ ...prev, email: "" }));
                    }
                  }}
                  placeholder="mario.rossi@email.it"
                  className={cn("h-11", errors.email && "border-destructive")}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email}</p>
                )}
              </div>

              {/* Consents */}
              <div className="space-y-4 pt-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <Checkbox
                    checked={bookingData.privacyConsent}
                    onCheckedChange={(checked) => 
                      setBookingData(prev => ({ ...prev, privacyConsent: checked === true }))
                    }
                    className="mt-0.5 rounded-sm"
                  />
                  <span className="text-sm text-muted-foreground">
                    Ho letto e accetto l'Informativa Privacy. *
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <Checkbox
                    checked={bookingData.contactConsent}
                    onCheckedChange={(checked) => 
                      setBookingData(prev => ({ ...prev, contactConsent: checked === true }))
                    }
                    className="mt-0.5 rounded-sm"
                  />
                  <span className="text-sm text-muted-foreground">
                    Acconsento a essere ricontattato per la conferma della prenotazione. *
                  </span>
                </label>
              </div>

              {/* Info text */}
              <p className="text-xs text-muted-foreground pt-2">
                La prenotazione verrà confermata dal nostro staff via telefono o WhatsApp entro 24 ore.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border p-4 pb-safe">
        <div className="container">
          {step === 1 && (
            <Button
              onClick={handleNext}
              disabled={!canProceedStep1}
              className="w-full h-12 text-base font-semibold"
            >
              Avanti
            </Button>
          )}
          {step === 2 && (
            <Button
              onClick={handleNext}
              disabled={!canProceedStep2}
              className="w-full h-12 text-base font-semibold"
            >
              Avanti
            </Button>
          )}
          {step === 3 && (
            <Button
              onClick={handleSubmit}
              disabled={!canProceedStep3}
              className="w-full h-12 text-base font-semibold"
            >
              <CalendarDays className="w-5 h-5 mr-2" />
              Prenota tavolo
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

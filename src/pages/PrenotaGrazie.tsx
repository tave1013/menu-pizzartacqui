import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface ConfirmedBooking {
  data: string;
  orario: string;
  adulti: number;
  bambini: number;
  note: string;
  nome: string;
  cognome: string;
  telefono: string;
  email: string;
}

export default function PrenotaGrazie() {
  const navigate = useNavigate();
  const [booking, setBooking] = useState<ConfirmedBooking | null>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("prenotazioneConfermata");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setBooking(parsed.payload || parsed);
      } catch {
        // No valid booking data
      }
    }
  }, []);

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("it-IT", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      });
    } catch {
      return dateStr;
    }
  };

  const handleSendFeedback = () => {
    if (rating === 0) {
      toast.error("Seleziona almeno una stella");
      return;
    }

    const feedbackData = {
      rating,
      comment: comment.trim(),
      timestamp: Date.now(),
      booking: booking
    };

    // Save to localStorage
    const existingFeedback = localStorage.getItem("feedbackPrenotazione");
    const feedbackArray = existingFeedback ? JSON.parse(existingFeedback) : [];
    feedbackArray.push(feedbackData);
    localStorage.setItem("feedbackPrenotazione", JSON.stringify(feedbackArray));

    setFeedbackSent(true);
    toast.success("Grazie per il tuo feedback!");
  };

  const handleNewBooking = () => {
    // Clear draft
    localStorage.removeItem("prenotaDraft");
    navigate("/prenota");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container flex items-center h-14">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded p-1"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="sr-only sm:not-sr-only text-sm font-medium">Torna al menu</span>
          </button>
          <h1 className="flex-1 text-center font-semibold text-foreground">
            Prenotazione
          </h1>
          <div className="w-10" />
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 container py-8 px-4 max-w-lg mx-auto">
        {/* Success message */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Richiesta inviata ✅
          </h2>
          <p className="text-muted-foreground">
            Abbiamo ricevuto la tua richiesta su WhatsApp. Ti confermeremo entro 24 ore.
          </p>
        </div>

        {/* Booking summary */}
        {booking && (
          <div className="bg-muted/50 rounded-xl p-4 mb-8 space-y-3">
            <h3 className="font-semibold text-foreground mb-3">Riepilogo prenotazione</h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Data:</span>
                <span className="font-medium text-foreground">{formatDate(booking.data)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Orario:</span>
                <span className="font-medium text-foreground">{booking.orario}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Persone:</span>
                <span className="font-medium text-foreground">
                  {booking.adulti} adulti{booking.bambini > 0 && ` + ${booking.bambini} bambini`}
                </span>
              </div>
              {booking.note && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Note:</span>
                  <span className="font-medium text-foreground text-right max-w-[60%]">{booking.note}</span>
                </div>
              )}
              <div className="border-t border-border pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nome:</span>
                  <span className="font-medium text-foreground">{booking.nome} {booking.cognome}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Telefono:</span>
                  <span className="font-medium text-foreground">{booking.telefono}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium text-foreground">{booking.email}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Feedback section */}
        {!feedbackSent ? (
          <div className="bg-muted/30 rounded-xl p-4 space-y-4">
            <h3 className="font-semibold text-foreground">Come ti è sembrata l'esperienza?</h3>
            
            {/* Star rating */}
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded transition-transform hover:scale-110"
                  aria-label={`${star} stelle`}
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoverRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Comment */}
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Lascia un commento (opzionale)"
              className="min-h-[80px] resize-none"
              maxLength={500}
            />

            <Button
              onClick={handleSendFeedback}
              className="w-full"
              disabled={rating === 0}
            >
              Invia feedback
            </Button>
          </div>
        ) : (
          <div className="bg-primary/10 rounded-xl p-4 text-center">
            <p className="text-primary font-medium">Grazie per il tuo feedback! 🎉</p>
          </div>
        )}

        {/* New booking CTA */}
        <Button
          variant="outline"
          onClick={handleNewBooking}
          className="w-full mt-6"
        >
          Nuova prenotazione
        </Button>
      </main>
    </div>
  );
}

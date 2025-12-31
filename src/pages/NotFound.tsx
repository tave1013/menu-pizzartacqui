import { useNavigate } from "react-router-dom";
import { Footer } from "@/components/menu/Footer";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header con logo */}
      <header className="w-full flex items-center justify-start lg:justify-start p-4 lg:p-6">
        <img
          src="/logo-pizzart.webp"
          alt="PizzArt Logo"
          className="h-10 w-auto object-contain mx-auto lg:mx-0"
          style={{ maxWidth: 120 }}
        />
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <img
          src="/assets/food/404-custom.png"
          alt="404"
          className="mx-auto mb-6 w-40 h-40 object-contain"
          style={{ maxWidth: 180 }}
        />
        <h1 className="text-5xl font-bold mb-2 text-foreground">404</h1>
        <h2 className="text-xl font-semibold mb-2 text-foreground">Qualcosa manca.</h2>
        <p className="text-base text-muted-foreground mb-8">
          Questa pagina non esiste oppure il link non è corretto.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs mx-auto">
          <button
            onClick={() => navigate("/menu-base")}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-base font-semibold transition-all hover:bg-primary/90"
          >
            Visualizza Menu
          </button>
          <button
            onClick={() => navigate("/menu")}
            className="w-full py-3 rounded-xl bg-secondary text-foreground text-base font-semibold border border-border transition-all hover:bg-secondary/80"
          >
            Ordina da Asporto
          </button>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

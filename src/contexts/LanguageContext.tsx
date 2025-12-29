import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { type Language, getInitialLanguage } from "@/i18n";
import { 
  loadGoogleTranslateScript, 
  setGoogleTranslateLanguage 
} from "@/hooks/useGoogleTranslate";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isTranslating: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);

  // Carica Google Translate all'avvio (una sola volta)
  useEffect(() => {
    let mounted = true;
    
    loadGoogleTranslateScript()
      .then(() => {
        if (mounted) {
          setIsGoogleLoaded(true);
          
          // Se c'è una lingua salvata diversa da italiano, applica la traduzione
          const savedLang = getInitialLanguage();
          if (savedLang !== "it") {
            setTimeout(() => {
              setGoogleTranslateLanguage(savedLang);
            }, 1000);
          }
        }
      })
      .catch((err) => {
        console.warn("Google Translate non caricato:", err);
      });
      
    return () => { mounted = false; };
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    // Aggiorna lo stato locale immediatamente
    setLanguageState(lang);
    localStorage.setItem("lang", lang);
    
    // Aggiorna URL senza ricaricare
    const url = new URL(window.location.href);
    url.searchParams.set("lang", lang);
    window.history.replaceState({}, "", url.toString());
    
    // Se Google Translate è caricato, cambia lingua
    if (isGoogleLoaded) {
      setIsTranslating(true);
      
      // Piccolo delay per UX fluida
      setTimeout(() => {
        setGoogleTranslateLanguage(lang);
        setIsTranslating(false);
      }, 100);
    }
  }, [isGoogleLoaded]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isTranslating }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

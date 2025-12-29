import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { type Language, getInitialLanguage } from "@/i18n";
import { 
  loadGoogleTranslateScript, 
  initGoogleTranslate, 
  setGoogleTranslateLanguage,
  getCurrentGoogleTranslateLanguage 
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

  // Carica Google Translate all'avvio
  useEffect(() => {
    loadGoogleTranslateScript()
      .then(() => {
        initGoogleTranslate();
        setIsGoogleLoaded(true);
        
        // Sincronizza con la lingua salvata
        const savedLang = getInitialLanguage();
        if (savedLang !== "it") {
          // Aspetta che Google Translate sia pronto
          setTimeout(() => {
            setGoogleTranslateLanguage(savedLang);
          }, 1000);
        }
      })
      .catch((err) => {
        console.warn("Google Translate non caricato:", err);
      });
  }, []);

  // Sincronizza con il cookie di Google Translate all'avvio
  useEffect(() => {
    const googleLang = getCurrentGoogleTranslateLanguage();
    if (googleLang !== "it" && googleLang !== language) {
      setLanguageState(googleLang);
      localStorage.setItem("lang", googleLang);
    }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    const previousLang = language;
    
    // Aggiorna lo stato locale immediatamente
    setLanguageState(lang);
    localStorage.setItem("lang", lang);
    
    // Aggiorna URL
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
  }, [language, isGoogleLoaded]);

  useEffect(() => {
    const initialLang = getInitialLanguage();
    setLanguageState(initialLang);
    localStorage.setItem("lang", initialLang);
  }, []);

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

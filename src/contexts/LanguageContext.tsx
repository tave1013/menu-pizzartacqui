import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { type Language, getInitialLanguage } from "@/i18n";
import { 
  loadGoogleTranslateScript, 
  setGoogleTranslateLanguage,
  getCurrentGoogleTranslateLanguage
} from "@/hooks/useGoogleTranslate";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);

  // Carica Google Translate all'avvio
  useEffect(() => {
    loadGoogleTranslateScript().then(() => {
      setIsGoogleLoaded(true);
      
      // Sincronizza con la lingua dal cookie di Google Translate
      const googleLang = getCurrentGoogleTranslateLanguage();
      if (googleLang !== "it") {
        setLanguageState(googleLang);
        localStorage.setItem("lang", googleLang);
      }
    });
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("lang", lang);
    
    const url = new URL(window.location.href);
    url.searchParams.set("lang", lang);
    window.history.replaceState({}, "", url.toString());
    
    // Attiva Google Translate
    if (isGoogleLoaded) {
      setGoogleTranslateLanguage(lang);
    }
  }, [isGoogleLoaded]);

  useEffect(() => {
    const initialLang = getInitialLanguage();
    setLanguageState(initialLang);
    localStorage.setItem("lang", initialLang);
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
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

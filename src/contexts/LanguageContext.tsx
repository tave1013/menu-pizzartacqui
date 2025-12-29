import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { type Language, getInitialLanguage } from "@/i18n";

// Extend Window interface for Google Translate
declare global {
  interface Window {
    changeGoogleTranslateLanguage?: (langCode: string) => void;
    resetGoogleTranslate?: () => void;
  }
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Function to trigger Google Translate
function triggerGoogleTranslate(langCode: Language) {
  if (langCode === "it") {
    // Reset to original Italian
    if (window.resetGoogleTranslate) {
      window.resetGoogleTranslate();
    }
    // Also try to remove the google translate cookie
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + window.location.hostname;
    // Reload to reset translation
    window.location.reload();
    return;
  }
  
  // Set Google Translate cookie for persistence
  const langPath = `/it/${langCode}`;
  document.cookie = `googtrans=${langPath}; path=/`;
  document.cookie = `googtrans=${langPath}; path=/; domain=${window.location.hostname}`;
  
  // Try to use the Google Translate combo box directly
  const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
  if (selectElement) {
    selectElement.value = langCode;
    selectElement.dispatchEvent(new Event('change'));
  } else {
    // If combo not ready, use our custom function
    if (window.changeGoogleTranslateLanguage) {
      window.changeGoogleTranslateLanguage(langCode);
    }
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("lang", lang);
    
    const url = new URL(window.location.href);
    url.searchParams.set("lang", lang);
    window.history.replaceState({}, "", url.toString());
    
    // Trigger Google Translate
    triggerGoogleTranslate(lang);
  }, []);

  // On mount, apply saved language to Google Translate
  useEffect(() => {
    const initialLang = getInitialLanguage();
    setLanguageState(initialLang);
    localStorage.setItem("lang", initialLang);
    
    // Apply Google Translate after a short delay to ensure it's loaded
    if (initialLang !== "it") {
      const timer = setTimeout(() => {
        triggerGoogleTranslate(initialLang);
      }, 1000);
      return () => clearTimeout(timer);
    }
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

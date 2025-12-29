/**
 * Google Translate Integration Hook
 * 
 * Integra Google Translate senza modificare il layout del sito.
 * La traduzione avviene automaticamente quando si cambia lingua.
 */

export type TranslateLanguage = "it" | "en" | "fr" | "de" | "es";

// Mappa le nostre lingue ai codici Google Translate
const GOOGLE_LANG_CODES: Record<TranslateLanguage, string> = {
  it: "it",
  en: "en",
  fr: "fr", 
  de: "de",
  es: "es",
};

let isScriptLoaded = false;
let isInitialized = false;

/**
 * Carica lo script di Google Translate (una sola volta)
 */
export function loadGoogleTranslateScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (isScriptLoaded) {
      resolve();
      return;
    }

    // Definisci la callback globale
    (window as any).googleTranslateElementInit = () => {
      isInitialized = true;
      resolve();
    };

    // Crea e inserisci lo script
    const script = document.createElement("script");
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    script.onerror = () => reject(new Error("Failed to load Google Translate"));
    
    document.head.appendChild(script);
    isScriptLoaded = true;
  });
}

/**
 * Cambia la lingua di traduzione tramite Google Translate
 */
export function setGoogleTranslateLanguage(lang: TranslateLanguage): void {
  const targetLang = GOOGLE_LANG_CODES[lang];
  
  // Se italiano, rimuovi la traduzione
  if (lang === "it") {
    removeGoogleTranslation();
    return;
  }

  // Imposta il cookie di Google Translate
  const domain = window.location.hostname;
  document.cookie = `googtrans=/it/${targetLang}; path=/; domain=${domain}`;
  document.cookie = `googtrans=/it/${targetLang}; path=/`;

  // Forza il refresh della traduzione
  if (isInitialized && (window as any).google?.translate) {
    // Trigger re-translation by updating the cookie and refreshing
    const frame = document.querySelector('.goog-te-menu-frame') as HTMLIFrameElement;
    if (frame?.contentWindow) {
      try {
        const innerDoc = frame.contentDocument || frame.contentWindow.document;
        const items = innerDoc.querySelectorAll('.goog-te-menu2-item span.text');
        
        items.forEach((item: Element) => {
          if (item.textContent?.toLowerCase().includes(getLanguageName(targetLang))) {
            (item as HTMLElement).click();
          }
        });
      } catch (e) {
        // Cross-origin error, use cookie approach
        window.location.reload();
      }
    } else {
      // Se non c'è il frame, ricarica per applicare il cookie
      window.location.reload();
    }
  }
}

/**
 * Rimuove la traduzione di Google Translate (torna all'italiano)
 */
export function removeGoogleTranslation(): void {
  // Rimuovi i cookie
  const domain = window.location.hostname;
  document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain}`;
  document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  
  // Prova a cliccare "Show original" se disponibile
  const showOriginal = document.querySelector('.goog-te-banner-frame');
  if (showOriginal) {
    try {
      const frame = showOriginal as HTMLIFrameElement;
      const innerDoc = frame.contentDocument || frame.contentWindow?.document;
      const restoreBtn = innerDoc?.querySelector('.goog-te-button button');
      if (restoreBtn) {
        (restoreBtn as HTMLElement).click();
        return;
      }
    } catch (e) {
      // Cross-origin, reload
    }
  }
  
  // Reload per rimuovere la traduzione
  window.location.reload();
}

/**
 * Inizializza Google Translate in modo invisibile
 */
export function initGoogleTranslate(): void {
  if ((window as any).google?.translate?.TranslateElement) {
    // Crea un elemento nascosto per Google Translate
    let container = document.getElementById('google_translate_element');
    if (!container) {
      container = document.createElement('div');
      container.id = 'google_translate_element';
      container.style.display = 'none';
      container.style.position = 'absolute';
      container.style.top = '-9999px';
      container.style.left = '-9999px';
      document.body.appendChild(container);
    }

    new (window as any).google.translate.TranslateElement({
      pageLanguage: 'it',
      includedLanguages: 'en,es,fr,de',
      layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
      autoDisplay: false,
    }, 'google_translate_element');
  }
}

/**
 * Ottieni il nome della lingua per Google Translate
 */
function getLanguageName(code: string): string {
  const names: Record<string, string> = {
    en: "english",
    es: "spanish",
    fr: "french",
    de: "german",
    it: "italian",
  };
  return names[code] || code;
}

/**
 * Controlla se Google Translate è attivo
 */
export function isGoogleTranslateActive(): boolean {
  const cookies = document.cookie;
  return cookies.includes('googtrans=') && !cookies.includes('googtrans=;');
}

/**
 * Ottieni la lingua corrente di Google Translate dal cookie
 */
export function getCurrentGoogleTranslateLanguage(): TranslateLanguage {
  const match = document.cookie.match(/googtrans=\/it\/(\w+)/);
  if (match) {
    const lang = match[1] as TranslateLanguage;
    if (["en", "es", "fr", "de"].includes(lang)) {
      return lang;
    }
  }
  return "it";
}

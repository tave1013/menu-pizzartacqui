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
let translateSelectElement: HTMLSelectElement | null = null;

/**
 * Carica lo script di Google Translate (una sola volta)
 */
export function loadGoogleTranslateScript(): Promise<void> {
  return new Promise((resolve) => {
    if (isScriptLoaded) {
      resolve();
      return;
    }

    // Definisci la callback globale
    (window as any).googleTranslateElementInit = () => {
      try {
        // Crea un elemento nascosto per Google Translate
        let container = document.getElementById('google_translate_element');
        if (!container) {
          container = document.createElement('div');
          container.id = 'google_translate_element';
          container.style.cssText = 'position:absolute;top:-9999px;left:-9999px;visibility:hidden;';
          document.body.appendChild(container);
        }

        new (window as any).google.translate.TranslateElement({
          pageLanguage: 'it',
          includedLanguages: 'en,es,fr,de',
          autoDisplay: false,
        }, 'google_translate_element');

        isInitialized = true;
        
        // Trova il select element dopo un breve delay
        setTimeout(() => {
          translateSelectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
          resolve();
        }, 500);
      } catch (e) {
        console.warn('Google Translate init error:', e);
        resolve();
      }
    };

    // Crea e inserisci lo script
    const script = document.createElement("script");
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    script.onerror = () => {
      console.warn("Failed to load Google Translate");
      resolve();
    };
    
    document.head.appendChild(script);
    isScriptLoaded = true;
  });
}

/**
 * Cambia la lingua di traduzione tramite Google Translate
 * SENZA ricaricare la pagina
 */
export function setGoogleTranslateLanguage(lang: TranslateLanguage): void {
  // Se italiano, rimuovi la traduzione
  if (lang === "it") {
    removeGoogleTranslation();
    return;
  }

  const targetLang = GOOGLE_LANG_CODES[lang];
  
  // Metodo 1: Usa il select element se disponibile
  if (translateSelectElement) {
    translateSelectElement.value = targetLang;
    translateSelectElement.dispatchEvent(new Event('change', { bubbles: true }));
    return;
  }
  
  // Metodo 2: Cerca il select element
  const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
  if (select) {
    translateSelectElement = select;
    select.value = targetLang;
    select.dispatchEvent(new Event('change', { bubbles: true }));
    return;
  }
  
  // Metodo 3: Usa i cookie (senza reload)
  const domain = window.location.hostname;
  document.cookie = `googtrans=/it/${targetLang}; path=/; domain=${domain}`;
  document.cookie = `googtrans=/it/${targetLang}; path=/`;
  
  // Prova a re-inizializzare Google Translate
  if ((window as any).google?.translate?.TranslateElement) {
    try {
      const container = document.getElementById('google_translate_element');
      if (container) {
        container.innerHTML = '';
        new (window as any).google.translate.TranslateElement({
          pageLanguage: 'it',
          includedLanguages: 'en,es,fr,de',
          autoDisplay: false,
        }, 'google_translate_element');
        
        // Aspetta e cambia lingua
        setTimeout(() => {
          const newSelect = document.querySelector('.goog-te-combo') as HTMLSelectElement;
          if (newSelect) {
            translateSelectElement = newSelect;
            newSelect.value = targetLang;
            newSelect.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }, 300);
      }
    } catch (e) {
      console.warn('Google Translate re-init error:', e);
    }
  }
}

/**
 * Rimuove la traduzione di Google Translate (torna all'italiano)
 * SENZA ricaricare la pagina
 */
export function removeGoogleTranslation(): void {
  // Rimuovi i cookie
  const domain = window.location.hostname;
  document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain}`;
  document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  
  // Metodo 1: Seleziona "Select Language" nel dropdown (valore vuoto)
  const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
  if (select) {
    select.value = '';
    select.dispatchEvent(new Event('change', { bubbles: true }));
  }
  
  // Metodo 2: Clicca sul pulsante "Show original" se esiste
  const showOriginalBtn = document.querySelector('.goog-te-banner-frame');
  if (showOriginalBtn) {
    try {
      const frame = showOriginalBtn as HTMLIFrameElement;
      const innerDoc = frame.contentDocument || frame.contentWindow?.document;
      const btn = innerDoc?.querySelector('button');
      if (btn) btn.click();
    } catch (e) {
      // Ignora errori cross-origin
    }
  }
  
  // Metodo 3: Rimuovi le classi di traduzione dal body
  document.body.classList.remove('translated-ltr', 'translated-rtl');
  const html = document.documentElement;
  html.classList.remove('translated-ltr', 'translated-rtl');
}

/**
 * Inizializza Google Translate in modo invisibile
 */
export function initGoogleTranslate(): void {
  // Già gestito in loadGoogleTranslateScript
}

/**
 * Controlla se Google Translate è attivo
 */
export function isGoogleTranslateActive(): boolean {
  const cookies = document.cookie;
  return cookies.includes('googtrans=/it/') && !cookies.includes('googtrans=;');
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

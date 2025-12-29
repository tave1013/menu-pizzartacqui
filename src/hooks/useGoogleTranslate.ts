/**
 * Google Translate Integration Hook
 * 
 * Integra Google Translate senza modificare il layout del sito.
 * Gli elementi con classe "notranslate" NON vengono tradotti.
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
let translateSelectElement: HTMLSelectElement | null = null;

/**
 * Carica lo script di Google Translate (una sola volta)
 */
export function loadGoogleTranslateScript(): Promise<void> {
  return new Promise((resolve) => {
    if (isScriptLoaded) {
      // Se già caricato, cerca il select
      setTimeout(() => {
        translateSelectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
        resolve();
      }, 100);
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
          container.style.cssText = 'position:absolute;top:-9999px;left:-9999px;visibility:hidden;height:0;width:0;overflow:hidden;';
          document.body.appendChild(container);
        }

        new (window as any).google.translate.TranslateElement({
          pageLanguage: 'it',
          includedLanguages: 'en,es,fr,de',
          autoDisplay: false,
        }, 'google_translate_element');
        
        // Trova il select element dopo un breve delay
        setTimeout(() => {
          translateSelectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
          resolve();
        }, 800);
      } catch (e) {
        console.warn('Google Translate init error:', e);
        resolve();
      }
    };

    // Crea e inserisci lo script (usa https per Safari)
    const script = document.createElement("script");
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    script.crossOrigin = "anonymous";
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
  
  // Cerca il select element
  const select = translateSelectElement || document.querySelector('.goog-te-combo') as HTMLSelectElement;
  
  if (select) {
    translateSelectElement = select;
    select.value = targetLang;
    select.dispatchEvent(new Event('change', { bubbles: true }));
  } else {
    // Se non c'è il select, imposta i cookie e ricarica UNA SOLA VOLTA
    const currentCookie = document.cookie;
    const targetCookie = `/it/${targetLang}`;
    
    // Controlla se il cookie è già impostato correttamente
    if (!currentCookie.includes(targetCookie)) {
      document.cookie = `googtrans=${targetCookie}; path=/`;
      document.cookie = `googtrans=${targetCookie}; path=/; domain=${window.location.hostname}`;
      // Ricarica solo se necessario
      window.location.reload();
    }
  }
}

/**
 * Rimuove la traduzione di Google Translate (torna all'italiano)
 */
export function removeGoogleTranslation(): void {
  // Rimuovi i cookie
  document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
  document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname}`;
  
  // Prova prima con il select
  const select = translateSelectElement || document.querySelector('.goog-te-combo') as HTMLSelectElement;
  if (select && select.value !== '') {
    select.value = '';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    
    // Aspetta un po' e se non ha funzionato, ricarica
    setTimeout(() => {
      const stillTranslated = document.cookie.includes('googtrans=/it/');
      if (stillTranslated) {
        window.location.reload();
      }
    }, 500);
  } else {
    // Se non c'è il select o è già vuoto, ricarica per essere sicuri
    window.location.reload();
  }
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

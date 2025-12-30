/**
 * 🎛️ SITE ACCESSIBILITY CONFIGURATION
 * 
 * Modifica questo file per controllare i 3 stati del sito:
 * - public: Sito pubblico, accesso libero
 * - password-protected: Accesso con password
 * - maintenance: Mostra pagina Coming Soon
 * 
 * ISTRUZIONI:
 * 1. Cambia SITE_MODE al valore desiderato
 * 2. Imposta la PASSWORD se usi password-protected
 * 3. Salva il file
 * 4. Il sito si aggiornerà automaticamente
 */

export type SiteMode = "public" | "password-protected" | "maintenance";

export interface SiteConfig {
  mode: SiteMode;
  password: string;
}

// ============================================
// ⚙️ CONFIGURAZIONE PRINCIPALE
// ============================================
export const siteConfig: SiteConfig = {
  // Cambia questo valore tra:
  // "public" - Sito pubblico normale
  // "password-protected" - Accesso con password
  // "maintenance" - Mostra Coming Soon
  mode: "maintenance",

  // Password per l'accesso (usata solo se mode = "password-protected")
  password: "pizzart205",
};

// ============================================
// 📋 GUIDA RAPIDA
// ============================================
/*

MOSTRARE IL SITO AL CLIENTE CON PASSWORD:
- Cambia: mode: "password-protected"
- Password: pizzart2025 (o quella che preferisci)
- Salva il file

MANUTENZIONE/COMING SOON:
- Cambia: mode: "maintenance"
- Salva il file

RITORNO AL SITO PUBBLICO:
- Cambia: mode: "public"
- Salva il file

*/

// ============================================
// 🎨 COLORI CUSTOMIZZABILI
// ============================================
export const brandColors = {
  // Colore verde PizzArt usato nella Coming Soon
  primaryGreen: "#82b856",
  primaryGreenDark: "#4a5f3f",
};

// ============================================
// 📱 TESTI PERSONALIZZABILI
// ============================================
export const comingSoonTexts = {
  header: "PizzArt",
  subtitle: "Novità in arrivo",
  mainTitle: "Stiamo finendo\ndi sistemare qualcosa",
  description: "Stiamo preparando un'esperienza ancora migliore per te",
};

export const passwordLoginTexts = {
  header: "PizzArt",
  subheader: "Accesso riservato",
  inputPlaceholder: "Inserisci la password",
  submitButton: "Accedi",
  errorMessage: "Password non corretta. Riprova.",
  infoText: "Questa pagina è protetta. Contatta l'amministratore per la password.",
};

// ============================================
// 🔒 VALIDAZIONE
// ============================================
export const validateConfig = (config: SiteConfig): boolean => {
  if (!config.mode || !["public", "password-protected", "maintenance"].includes(config.mode)) {
    console.error("❌ Mode non valido. Usa: 'public' | 'password-protected' | 'maintenance'");
    return false;
  }

  if (config.mode === "password-protected" && !config.password) {
    console.error("❌ Password richiesta per mode 'password-protected'");
    return false;
  }

  console.log(`✅ Configurazione caricata: ${config.mode}`);
  return true;
};

// Validazione automatica al caricamento
validateConfig(siteConfig);

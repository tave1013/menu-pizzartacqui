export type Language = "it" | "en" | "fr" | "de" | "es";

export const languageNames: Record<Language, string> = {
  it: "Italiano",
  en: "English",
  fr: "Français",
  de: "Deutsch",
  es: "Español",
};

export const languageFlags: Record<Language, string> = {
  it: "🇮🇹",
  en: "🇬🇧",
  fr: "🇫🇷",
  de: "🇩🇪",
  es: "🇪🇸",
};

// Get initial language from URL or localStorage
export function getInitialLanguage(): Language {
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get("lang");
    if (urlLang && ["it", "en", "fr", "de", "es"].includes(urlLang)) {
      return urlLang as Language;
    }
  }
  
  if (typeof localStorage !== "undefined") {
    const storedLang = localStorage.getItem("lang");
    if (storedLang && ["it", "en", "fr", "de", "es"].includes(storedLang)) {
      return storedLang as Language;
    }
  }
  
  return "it";
}

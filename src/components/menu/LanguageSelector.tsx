import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Language, languageFlags, languageNames } from "@/i18n";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

const languages: Language[] = ["it", "en", "fr", "de", "es"];

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-center w-10 h-10 rounded-full",
          "hover:bg-secondary/80 active:bg-secondary transition-colors",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        )}
        aria-label={`Cambia lingua in ${languageNames[language]}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="text-xl" role="img" aria-label={languageNames[language]}>
          {languageFlags[language]}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={prefersReduced ? { opacity: 1 } : { opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute top-full left-0 mt-2",
              "bg-popover border border-border rounded-xl shadow-lg",
              "min-w-[160px] py-1 z-[100]",
              "overflow-hidden"
            )}
            role="menu"
          >
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => handleLanguageSelect(lang)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2.5",
                  "text-left text-sm",
                  "hover:bg-secondary/80 transition-colors",
                  "focus:outline-none focus-visible:bg-secondary",
                  language === lang && "bg-secondary/60"
                )}
                role="menuitem"
                aria-pressed={language === lang}
              >
                <span className="text-lg" role="img" aria-hidden="true">
                  {languageFlags[lang]}
                </span>
                <span className={cn(
                  "text-foreground",
                  language === lang && "font-medium"
                )}>
                  {languageNames[lang]}
                </span>
                {language === lang && (
                  <span className="ml-auto text-primary">✓</span>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

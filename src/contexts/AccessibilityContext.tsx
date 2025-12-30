import { useState, useEffect, ReactNode } from "react";
import { siteConfig } from "@/config/siteConfig";
import { AccessibilityContext, type SiteMode } from "./AccessibilityContextDef";

export const AccessibilityProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<SiteMode>(siteConfig.mode);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Carica lo stato di autenticazione da localStorage
  useEffect(() => {
    const stored = localStorage.getItem("site_authenticated");
    if (stored === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const authenticate = (password: string): boolean => {
    if (password === siteConfig.password) {
      setIsAuthenticated(true);
      localStorage.setItem("site_authenticated", "true");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("site_authenticated");
  };

  return (
    <AccessibilityContext.Provider value={{ mode, isAuthenticated, authenticate, logout, setMode }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

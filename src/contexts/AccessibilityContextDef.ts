import { createContext } from "react";

export type SiteMode = "public" | "password-protected" | "maintenance";

export interface AccessibilityContextType {
  mode: SiteMode;
  isAuthenticated: boolean;
  authenticate: (password: string) => boolean;
  logout: () => void;
  setMode: (mode: SiteMode) => void;
}

export const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

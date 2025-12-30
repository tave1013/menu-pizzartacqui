import { ReactNode } from "react";
import { useAccessibility } from "@/hooks/useAccessibility";
import { useLocation } from "react-router-dom";
import ComingSoon from "@/pages/ComingSoon";
import PasswordLogin from "@/pages/PasswordLogin";

interface AccessibilityWrapperProps {
  children: ReactNode;
}

/**
 * AccessibilityWrapper intercetta il rendering e applica le modalità di accesso
 * - public: mostra tutto normalmente
 * - password-protected: mostra login, se autenticato mostra il contenuto
 * - maintenance: mostra pagina coming soon
 */
export const AccessibilityWrapper = ({ children }: AccessibilityWrapperProps) => {
  const { mode, isAuthenticated } = useAccessibility();
  const location = useLocation();

  // Non applicare limitazioni alle pagine di auth/admin
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isAuthRoute = location.pathname.startsWith("/auth");

  if (isAdminRoute || isAuthRoute) {
    return <>{children}</>;
  }

  // Modalità MANUTENZIONE - mostra Coming Soon
  if (mode === "maintenance") {
    return <ComingSoon />;
  }

  // Modalità PASSWORD-PROTECTED
  if (mode === "password-protected" && !isAuthenticated) {
    return <PasswordLogin />;
  }

  // Modalità PUBLIC - mostra tutto normalmente
  return <>{children}</>;
};

export default AccessibilityWrapper;

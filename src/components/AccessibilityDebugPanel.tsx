import { useAccessibility } from "@/hooks/useAccessibility";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

/**
 * 🛠️ DEBUG PANEL - Visibile solo in sviluppo
 * 
 * Permette di cambiare il modo del sito senza modificare il codice
 * Utile per testare i 3 stati
 * 
 * Visibile solo se: import.meta.env.DEV === true
 */
export const AccessibilityDebugPanel = () => {
  const { mode, setMode, isAuthenticated, authenticate, logout } = useAccessibility();
  const [isOpen, setIsOpen] = useState(false);
  const [testPassword, setTestPassword] = useState("");

  // Mostra solo in modalità sviluppo
  if (!import.meta.env.DEV) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Button Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-800 flex items-center gap-2 text-sm font-medium transition-all"
      >
        🛠️ Debug
        <ChevronDown
          className="w-4 h-4 transition-transform"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="absolute bottom-full mb-2 right-0 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-80">
          <h3 className="font-bold text-gray-900 mb-3 text-sm">🎛️ Site Accessibility Control</h3>

          {/* Current Mode */}
          <div className="mb-4 p-3 bg-gray-50 rounded border border-gray-200">
            <p className="text-xs text-gray-600 font-medium mb-1">Current Mode:</p>
            <p className="text-sm font-bold text-gray-900">{mode}</p>
          </div>

          {/* Mode Selection */}
          <div className="space-y-2 mb-4">
            <p className="text-xs text-gray-600 font-medium">Change Mode:</p>
            <div className="grid grid-cols-3 gap-2">
              <Button
                size="sm"
                variant={mode === "public" ? "default" : "outline"}
                onClick={() => setMode("public")}
                className="text-xs h-8"
              >
                Public
              </Button>
              <Button
                size="sm"
                variant={mode === "password-protected" ? "default" : "outline"}
                onClick={() => setMode("password-protected")}
                className="text-xs h-8"
              >
                Password
              </Button>
              <Button
                size="sm"
                variant={mode === "maintenance" ? "default" : "outline"}
                onClick={() => setMode("maintenance")}
                className="text-xs h-8"
              >
                Maintenance
              </Button>
            </div>
          </div>

          {/* Auth Status */}
          <div className="mb-4 p-3 bg-gray-50 rounded border border-gray-200">
            <p className="text-xs text-gray-600 font-medium mb-1">Auth Status:</p>
            <p className="text-sm font-bold text-gray-900">
              {isAuthenticated ? "✅ Authenticated" : "❌ Not Authenticated"}
            </p>
          </div>

          {/* Test Authentication */}
          {mode === "password-protected" && !isAuthenticated && (
            <div className="mb-4 space-y-2">
              <p className="text-xs text-gray-600 font-medium">Test Login (pizzart2025):</p>
              <div className="flex gap-2">
                <input
                  type="password"
                  placeholder="Password"
                  value={testPassword}
                  onChange={(e) => setTestPassword(e.target.value)}
                  className="text-xs flex-1 px-2 py-1 border border-gray-300 rounded"
                  defaultValue="pizzart2025"
                />
                <Button
                  size="sm"
                  onClick={() => {
                    if (authenticate(testPassword)) {
                      alert("✅ Login successful!");
                      setTestPassword("");
                    } else {
                      alert("❌ Login failed!");
                    }
                  }}
                  className="text-xs h-8"
                >
                  Login
                </Button>
              </div>
            </div>
          )}

          {/* Logout Button */}
          {isAuthenticated && (
            <div className="mb-4">
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  logout();
                  alert("Logged out!");
                }}
                className="w-full text-xs h-8"
              >
                Logout
              </Button>
            </div>
          )}

          {/* Notes */}
          <div className="p-3 bg-blue-50 rounded border border-blue-200">
            <p className="text-xs text-blue-700">
              💡 <strong>Nota:</strong> Questo pannello è visibile solo in sviluppo.
            </p>
          </div>

          {/* Close Info */}
          <p className="text-xs text-gray-500 text-center mt-2">
            Modifica permanente in <code className="bg-gray-100 px-1">src/config/siteConfig.ts</code>
          </p>
        </div>
      )}
    </div>
  );
};

export default AccessibilityDebugPanel;

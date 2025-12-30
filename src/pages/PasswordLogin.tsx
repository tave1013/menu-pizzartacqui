import { useState } from "react";
import { useAccessibility } from "@/hooks/useAccessibility";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export const PasswordLogin = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { authenticate } = useAccessibility();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate async authentication
    setTimeout(() => {
      if (authenticate(password)) {
        navigate("/");
      } else {
        setError("Password non corretta. Riprova.");
        setPassword("");
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">PizzArt</h1>
          <p className="text-gray-600">Accesso riservato</p>
        </div>

        {/* Card Login */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Password Input */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Inserisci la password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                autoFocus
                className="h-12 border-gray-300 text-base"
              />
            </div>

            {/* Error Message */}
            {error && (
              <Alert variant="destructive" className="bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || !password.trim()}
              className="w-full h-12 bg-green-700 hover:bg-green-800 text-white font-medium text-base"
            >
              {isLoading ? "Accesso in corso..." : "Accedi"}
            </Button>
          </form>

          {/* Info Text */}
          <p className="mt-8 text-center text-xs text-gray-500">
            Questa pagina è protetta. Contatta l'amministratore per la password.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PasswordLogin;

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, AuthSession, User } from '@/services/authService';

interface AuthContextType {
  user: User | null;
  session: AuthSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (token: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  getResetRateLimitRemaining: () => number;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const existingSession = authService.getSession();
    setSession(existingSession);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const result = await authService.login(email, password);
    if (result.session) {
      setSession(result.session);
      return { success: true };
    }
    return { success: false, error: result.error?.message };
  };

  const register = async (name: string, email: string, password: string) => {
    const result = await authService.register(name, email, password);
    if (result.success) {
      return { success: true };
    }
    return { success: false, error: result.error?.message };
  };

  const requestPasswordReset = async (email: string) => {
    const result = await authService.requestPasswordReset(email);
    if (result.success) {
      return { success: true };
    }
    return { success: false, error: result.error?.message };
  };

  const resetPassword = async (token: string, newPassword: string) => {
    const result = await authService.resetPassword(token, newPassword);
    if (result.success) {
      return { success: true };
    }
    return { success: false, error: result.error?.message };
  };

  const logout = () => {
    authService.logout();
    setSession(null);
  };

  const getResetRateLimitRemaining = () => {
    return authService.getResetRateLimitRemaining();
  };

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        session,
        isLoading,
        isAuthenticated: session !== null,
        login,
        register,
        requestPasswordReset,
        resetPassword,
        logout,
        getResetRateLimitRemaining,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, LogIn, Mail, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/services/authService';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

type RecoveryState = 'idle' | 'form' | 'loading' | 'success';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  // Recovery state
  const [recoveryState, setRecoveryState] = useState<RecoveryState>('idle');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryError, setRecoveryError] = useState('');
  const [sentEmail, setSentEmail] = useState('');
  const recoveryInputRef = useRef<HTMLInputElement>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email obbligatoria';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Formato email non valido';
    }
    
    if (!password) {
      newErrors.password = 'Password obbligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    const result = await login(email, password);

    setIsLoading(false);

    if (result.success) {
      toast({ title: 'Accesso effettuato', duration: 2000 });
      const from = (location.state as any)?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    } else {
      setErrors({ general: 'Email o password non corretti' });
      toast({ 
        title: 'Errore di accesso', 
        description: 'Email o password non corretti',
        variant: 'destructive',
        duration: 3000 
      });
    }
  };

  const handleOpenRecovery = () => {
    setRecoveryState('form');
    setRecoveryEmail('');
    setRecoveryError('');
    // Focus the recovery input after animation
    setTimeout(() => recoveryInputRef.current?.focus(), 150);
  };

  const handleCloseRecovery = () => {
    setRecoveryState('idle');
    setRecoveryEmail('');
    setRecoveryError('');
  };

  const handleRecoverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!recoveryEmail.trim()) {
      setRecoveryError('Inserisci la tua email');
      return;
    }
    
    if (!validateEmail(recoveryEmail)) {
      setRecoveryError('Formato email non valido');
      return;
    }

    setRecoveryError('');
    setRecoveryState('loading');

    const result = await authService.requestPasswordReset(recoveryEmail);

    if (result.success) {
      setSentEmail(recoveryEmail);
      setRecoveryState('success');
    } else {
      setRecoveryError(result.error?.message || 'Errore durante la richiesta');
      setRecoveryState('form');
      
      if (result.error?.code === 'rate_limited') {
        toast({
          title: 'Richiesta limitata',
          description: result.error.message,
          variant: 'destructive',
          duration: 4000
        });
      }
    }
  };

  const isFormValid = email.trim() && password && validateEmail(email);
  const showRecoveryPanel = recoveryState !== 'idle';

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary p-4">
      <div className="w-full max-w-[420px]">
        <div className="bg-card rounded-2xl shadow-lg border border-border p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🏰</span>
            </div>
            <h1 className="text-xl font-bold text-foreground">Accedi al pannello</h1>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.general && (
              <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-sm text-center">
                {errors.general}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nome@esempio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={cn(errors.email && 'border-destructive focus-visible:ring-destructive')}
                autoComplete="email"
                autoFocus
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <p id="email-error" className="text-xs text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={cn('pr-10', errors.password && 'border-destructive focus-visible:ring-destructive')}
                  autoComplete="current-password"
                  aria-describedby={errors.password ? 'password-error' : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm"
                  aria-label={showPassword ? 'Nascondi password' : 'Mostra password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="text-xs text-destructive">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember" className="text-sm cursor-pointer font-normal text-muted-foreground">
                  Ricordami su questo dispositivo
                </Label>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Accesso in corso...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Accedi
                </span>
              )}
            </Button>

            {/* Password Recovery Trigger */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleOpenRecovery}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus-visible:underline"
                aria-expanded={showRecoveryPanel}
                aria-controls="recovery-panel"
              >
                Password dimenticata?
              </button>
            </div>
          </form>

          {/* Inline Password Recovery Panel */}
          <AnimatePresence>
            {showRecoveryPanel && (
              <motion.div
                id="recovery-panel"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="pt-4 mt-4 border-t border-border">
                  {recoveryState === 'success' ? (
                    // Success state
                    <div className="text-center space-y-4">
                      <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
                        <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-foreground font-medium">
                          Abbiamo inviato un link di reimpostazione a:
                        </p>
                        <p className="text-sm text-primary font-semibold break-all">
                          {sentEmail}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Controlla la posta in arrivo e la cartella spam.
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleCloseRecovery}
                        className="w-full"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Torna al login
                      </Button>
                    </div>
                  ) : (
                    // Form state
                    <form onSubmit={handleRecoverySubmit} className="space-y-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">Recupera password</span>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="recovery-email" className="sr-only">Email</Label>
                        <Input
                          ref={recoveryInputRef}
                          id="recovery-email"
                          type="email"
                          placeholder="Inserisci la tua email"
                          value={recoveryEmail}
                          onChange={(e) => {
                            setRecoveryEmail(e.target.value);
                            setRecoveryError('');
                          }}
                          className={cn(recoveryError && 'border-destructive focus-visible:ring-destructive')}
                          autoComplete="email"
                          aria-describedby={recoveryError ? 'recovery-error' : undefined}
                          disabled={recoveryState === 'loading'}
                        />
                        {recoveryError && (
                          <p id="recovery-error" className="text-xs text-destructive">{recoveryError}</p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleCloseRecovery}
                          className="flex-1"
                          disabled={recoveryState === 'loading'}
                        >
                          Annulla
                        </Button>
                        <Button
                          type="submit"
                          size="sm"
                          className="flex-1"
                          disabled={!recoveryEmail.trim() || !validateEmail(recoveryEmail) || recoveryState === 'loading'}
                        >
                          {recoveryState === 'loading' ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            'Invia link di reset'
                          )}
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Demo credentials hint */}
          <div className="mt-6 p-3 rounded-xl bg-secondary text-center">
            <p className="text-xs text-muted-foreground">
              <strong>Demo:</strong> admin@newcastlepub.it / admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
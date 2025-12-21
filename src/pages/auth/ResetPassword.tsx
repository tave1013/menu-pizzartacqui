import { useState, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Lock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const { resetPassword } = useAuth();
  const { toast } = useToast();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: '', color: '' };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { score: 1, label: 'Debole', color: 'bg-red-500' };
    if (score <= 4) return { score: 2, label: 'Media', color: 'bg-yellow-500' };
    return { score: 3, label: 'Forte', color: 'bg-green-500' };
  }, [password]);

  const validatePassword = (value: string) => {
    const hasMinLength = value.length >= 8;
    const hasLetter = /[a-zA-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    return hasMinLength && hasLetter && hasNumber;
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!password) {
      newErrors.password = 'Password obbligatoria';
    } else if (!validatePassword(password)) {
      newErrors.password = 'La password deve avere almeno 8 caratteri, 1 lettera e 1 numero';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Le password non corrispondono';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    if (!token) {
      setErrors({ general: 'Token non valido o mancante' });
      return;
    }

    setIsLoading(true);
    setErrors({});

    const result = await resetPassword(token, password);

    setIsLoading(false);

    if (result.success) {
      toast({ 
        title: 'Password aggiornata', 
        description: 'Ora puoi accedere con la nuova password',
        duration: 3000 
      });
      navigate('/auth/login');
    } else {
      setErrors({ general: result.error || 'Errore durante il reset' });
      toast({ 
        title: 'Errore', 
        description: result.error,
        variant: 'destructive',
        duration: 3000 
      });
    }
  };

  const isFormValid = validatePassword(password) && password === confirmPassword;

  // Invalid token state
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-2xl shadow-lg border border-border p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Link non valido</h1>
            <p className="text-muted-foreground mb-6">
              Il link per reimpostare la password non è valido o è scaduto.
            </p>
            <Link to="/auth/forgot-password">
              <Button className="w-full">Richiedi un nuovo link</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-lg border border-border p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Nuova Password</h1>
            <p className="text-muted-foreground mt-1">
              Scegli una password sicura per il tuo account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {errors.general && (
              <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-sm text-center">
                {errors.general}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Nuova Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={cn('pr-10', errors.password && 'border-destructive')}
                  autoComplete="new-password"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? 'Nascondi password' : 'Mostra password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password}</p>
              )}
              
              {/* Password strength meter */}
              {password && (
                <div className="space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3].map((level) => (
                      <div
                        key={level}
                        className={cn(
                          'h-1 flex-1 rounded-full transition-colors',
                          passwordStrength.score >= level
                            ? passwordStrength.color
                            : 'bg-secondary'
                        )}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Forza: {passwordStrength.label}
                  </p>
                </div>
              )}

              {/* Password requirements */}
              <div className="text-xs text-muted-foreground space-y-1 mt-2">
                <p className="flex items-center gap-1.5">
                  <CheckCircle className={cn('w-3.5 h-3.5', password.length >= 8 ? 'text-green-500' : 'text-muted-foreground/40')} />
                  Almeno 8 caratteri
                </p>
                <p className="flex items-center gap-1.5">
                  <CheckCircle className={cn('w-3.5 h-3.5', /[a-zA-Z]/.test(password) ? 'text-green-500' : 'text-muted-foreground/40')} />
                  Almeno 1 lettera
                </p>
                <p className="flex items-center gap-1.5">
                  <CheckCircle className={cn('w-3.5 h-3.5', /[0-9]/.test(password) ? 'text-green-500' : 'text-muted-foreground/40')} />
                  Almeno 1 numero
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Conferma Password</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={cn(errors.confirmPassword && 'border-destructive')}
                autoComplete="new-password"
              />
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">{errors.confirmPassword}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Aggiornamento...
                </span>
              ) : (
                'Imposta Password'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const validatePassword = (value: string) => {
    return value.length >= 8;
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'Nome obbligatorio';
    }

    if (!email.trim()) {
      newErrors.email = 'Email obbligatoria';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Formato email non valido';
    }
    
    if (!password) {
      newErrors.password = 'Password obbligatoria';
    } else if (!validatePassword(password)) {
      newErrors.password = 'La password deve avere almeno 8 caratteri';
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

    setIsLoading(true);
    setErrors({});

    const result = await register(name, email, password);

    setIsLoading(false);

    if (result.success) {
      toast({ 
        title: 'Registrazione completata', 
        description: 'Ora puoi accedere con le tue credenziali',
        duration: 3000 
      });
      navigate('/auth/login');
    } else {
      setErrors({ general: result.error || 'Errore durante la registrazione' });
      toast({ 
        title: 'Errore', 
        description: result.error,
        variant: 'destructive',
        duration: 3000 
      });
    }
  };

  const isFormValid = 
    name.trim() && 
    email.trim() && 
    validateEmail(email) && 
    password.length >= 8 && 
    password === confirmPassword;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-lg border border-border p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🏰</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Crea Account</h1>
            <p className="text-muted-foreground mt-1">Registrati per accedere al pannello</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {errors.general && (
              <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-sm text-center">
                {errors.general}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                type="text"
                placeholder="Mario Rossi"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={cn(errors.name && 'border-destructive')}
                autoComplete="name"
                autoFocus
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="mario@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={cn(errors.email && 'border-destructive')}
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={cn('pr-10', errors.password && 'border-destructive')}
                  autoComplete="new-password"
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
              <p className="text-xs text-muted-foreground">Minimo 8 caratteri</p>
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
                  Registrazione...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Crea Account
                </span>
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Hai già un account?{' '}
              <Link to="/auth/login" className="text-primary-foreground hover:underline font-medium">
                Accedi
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

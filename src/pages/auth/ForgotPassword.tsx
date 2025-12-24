import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function ForgotPassword() {
  const { requestPasswordReset, getResetRateLimitRemaining } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    // Check initial rate limit
    const remaining = getResetRateLimitRemaining();
    if (remaining > 0) {
      setCountdown(remaining);
    }
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !validateEmail(email)) {
      setError('Inserisci un indirizzo email valido');
      return;
    }

    setIsLoading(true);
    setError('');

    const result = await requestPasswordReset(email);

    setIsLoading(false);

    if (result.success) {
      setIsSuccess(true);
      toast({ 
        title: 'Email inviata', 
        description: 'Controlla la tua casella di posta',
        duration: 3000 
      });
    } else {
      if (result.error?.includes('Attendi')) {
        // Rate limited
        const seconds = parseInt(result.error.match(/\d+/)?.[0] || '30', 10);
        setCountdown(seconds);
      }
      setError(result.error || 'Si è verificato un errore');
    }
  };

  const isFormValid = email.trim() && validateEmail(email) && countdown === 0;

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-2xl shadow-lg border border-border p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Controlla la tua email</h1>
            <p className="text-muted-foreground mb-6">
              Se l'email <strong>{email}</strong> è registrata, ti abbiamo inviato un link per reimpostare la password.
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Non hai ricevuto l'email? Controlla la cartella spam o{' '}
              <button
                onClick={() => setIsSuccess(false)}
                className="text-primary-foreground hover:underline"
              >
                prova di nuovo
              </button>
            </p>
            <Link to="/auth/login">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Torna al login
              </Button>
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
              <Mail className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Password dimenticata?</h1>
            <p className="text-muted-foreground mt-1">
              Inserisci la tua email e ti invieremo un link per reimpostare la password
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-sm text-center">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={cn(error && 'border-destructive')}
                autoComplete="email"
                autoFocus
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Invio in corso...
                </span>
              ) : countdown > 0 ? (
                <span>Riprova tra {countdown}s</span>
              ) : (
                'Invia link di reset'
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <Link 
              to="/auth/login" 
              className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Torna al login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

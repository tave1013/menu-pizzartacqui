import { useState, useEffect } from 'react';
import { Eye, EyeOff, Check, AlertCircle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/authService';
import { cn } from '@/lib/utils';

// Validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

// Password strength calculator
function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  if (!password) return { score: 0, label: '', color: '' };
  
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { score: 1, label: 'Debole', color: 'bg-red-500' };
  if (score <= 3) return { score: 2, label: 'Media', color: 'bg-yellow-500' };
  if (score <= 4) return { score: 3, label: 'Buona', color: 'bg-green-400' };
  return { score: 4, label: 'Forte', color: 'bg-green-600' };
}

export default function AdminProfile() {
  const { toast } = useToast();
  const { user, session } = useAuth();

  // Personal info state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [originalEmail, setOriginalEmail] = useState('');
  const [personalErrors, setPersonalErrors] = useState<{ firstName?: string; lastName?: string; email?: string }>({});
  const [isSavingPersonal, setIsSavingPersonal] = useState(false);
  const [personalDisabledUntil, setPersonalDisabledUntil] = useState(0);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<{ current?: string; new?: string; confirm?: string }>({});
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordDisabledUntil, setPasswordDisabledUntil] = useState(0);

  // Load user data
  useEffect(() => {
    if (user) {
      const nameParts = (user.name || '').split(' ');
      setFirstName(nameParts[0] || '');
      setLastName(nameParts.slice(1).join(' ') || '');
      setEmail(user.email);
      setOriginalEmail(user.email);
    }
  }, [user]);

  // Rate limit countdown
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      if (personalDisabledUntil > now) {
        setPersonalDisabledUntil(personalDisabledUntil);
      } else if (personalDisabledUntil > 0) {
        setPersonalDisabledUntil(0);
      }
      if (passwordDisabledUntil > now) {
        setPasswordDisabledUntil(passwordDisabledUntil);
      } else if (passwordDisabledUntil > 0) {
        setPasswordDisabledUntil(0);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [personalDisabledUntil, passwordDisabledUntil]);

  const emailChanged = email.toLowerCase() !== originalEmail.toLowerCase();

  // Validate personal info
  const validatePersonalInfo = () => {
    const errors: typeof personalErrors = {};
    
    if (!firstName || firstName.trim().length < 2) {
      errors.firstName = 'Il nome deve avere almeno 2 caratteri';
    }
    if (!lastName || lastName.trim().length < 2) {
      errors.lastName = 'Il cognome deve avere almeno 2 caratteri';
    }
    if (!email || !EMAIL_REGEX.test(email)) {
      errors.email = 'Inserisci un indirizzo email valido';
    }

    setPersonalErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate password
  const validatePassword = () => {
    const errors: typeof passwordErrors = {};

    if (!currentPassword) {
      errors.current = 'Inserisci la password attuale';
    }
    if (!newPassword) {
      errors.new = 'Inserisci la nuova password';
    } else if (!PASSWORD_REGEX.test(newPassword)) {
      errors.new = 'La password deve avere almeno 8 caratteri, 1 lettera e 1 numero';
    }
    if (!confirmPassword) {
      errors.confirm = 'Conferma la nuova password';
    } else if (newPassword !== confirmPassword) {
      errors.confirm = 'Le password non corrispondono';
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save personal info
  const handleSavePersonal = async () => {
    if (!validatePersonalInfo()) return;

    setIsSavingPersonal(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Update session in localStorage (mock)
      if (session) {
        const updatedSession = {
          ...session,
          user: {
            ...session.user,
            name: `${firstName.trim()} ${lastName.trim()}`.trim(),
            email: email.trim(),
          },
        };
        localStorage.setItem('admin_session', JSON.stringify(updatedSession));
        setOriginalEmail(email);
      }

      toast({ 
        title: 'Profilo aggiornato',
        description: emailChanged ? 'Ti invieremo una mail di conferma al nuovo indirizzo.' : undefined,
        duration: 3000 
      });

      // Rate limit
      setPersonalDisabledUntil(Date.now() + 10000);
    } catch {
      toast({ 
        title: 'Errore',
        description: 'Impossibile aggiornare il profilo',
        variant: 'destructive' 
      });
    } finally {
      setIsSavingPersonal(false);
    }
  };

  // Save password
  const handleSavePassword = async () => {
    if (!validatePassword()) return;

    setIsSavingPassword(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Mock: verify current password (admin@newcastlepub.it / admin123)
      const isCurrentPasswordValid = currentPassword === 'admin123';
      
      if (!isCurrentPasswordValid) {
        setPasswordErrors({ current: 'Password attuale non corretta' });
        toast({ 
          title: 'Password attuale non corretta',
          variant: 'destructive',
          duration: 3000 
        });
        return;
      }

      // Success
      toast({ 
        title: 'Password aggiornata con successo',
        duration: 3000 
      });

      // Clear fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordErrors({});

      // Rate limit
      setPasswordDisabledUntil(Date.now() + 10000);
    } catch {
      toast({ 
        title: 'Errore',
        description: 'Impossibile aggiornare la password',
        variant: 'destructive' 
      });
    } finally {
      setIsSavingPassword(false);
    }
  };

  // Handle email verification
  const handleVerifyEmail = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    toast({ 
      title: 'Link di verifica inviato',
      description: 'Controlla la tua casella email',
      duration: 3000 
    });
  };

  const passwordStrength = getPasswordStrength(newPassword);
  const isPersonalValid = firstName.trim().length >= 2 && lastName.trim().length >= 2 && EMAIL_REGEX.test(email);
  const isPasswordValid = currentPassword && PASSWORD_REGEX.test(newPassword) && newPassword === confirmPassword;
  const personalRemainingSeconds = Math.max(0, Math.ceil((personalDisabledUntil - Date.now()) / 1000));
  const passwordRemainingSeconds = Math.max(0, Math.ceil((passwordDisabledUntil - Date.now()) / 1000));

  return (
    <div className="max-w-3xl mx-auto p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-semibold text-foreground">Il tuo profilo</h1>
        <p className="text-muted-foreground mt-1">Gestisci le tue informazioni di accesso</p>
      </div>

      {/* Personal Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Dati personali</CardTitle>
          <CardDescription>Aggiorna le tue informazioni di base</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="firstName">Nome *</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  if (personalErrors.firstName) setPersonalErrors(prev => ({ ...prev, firstName: undefined }));
                }}
                placeholder="Mario"
                className={cn(personalErrors.firstName && 'border-destructive')}
                aria-describedby={personalErrors.firstName ? 'firstName-error' : undefined}
              />
              {personalErrors.firstName && (
                <p id="firstName-error" className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {personalErrors.firstName}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label htmlFor="lastName">Cognome *</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  if (personalErrors.lastName) setPersonalErrors(prev => ({ ...prev, lastName: undefined }));
                }}
                placeholder="Rossi"
                className={cn(personalErrors.lastName && 'border-destructive')}
                aria-describedby={personalErrors.lastName ? 'lastName-error' : undefined}
              />
              {personalErrors.lastName && (
                <p id="lastName-error" className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {personalErrors.lastName}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <div className="flex gap-2">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (personalErrors.email) setPersonalErrors(prev => ({ ...prev, email: undefined }));
                }}
                placeholder="mario@esempio.it"
                className={cn('flex-1', personalErrors.email && 'border-destructive')}
                aria-describedby={personalErrors.email ? 'email-error' : emailChanged ? 'email-info' : undefined}
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleVerifyEmail}
                className="shrink-0"
              >
                <Mail className="w-4 h-4 mr-2" />
                Verifica
              </Button>
            </div>
            {personalErrors.email && (
              <p id="email-error" className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {personalErrors.email}
              </p>
            )}
            {emailChanged && !personalErrors.email && (
              <p id="email-info" className="text-sm text-muted-foreground">
                Ti invieremo una mail di conferma al nuovo indirizzo. Alcune modifiche potrebbero richiedere la verifica.
              </p>
            )}
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              onClick={handleSavePersonal}
              disabled={!isPersonalValid || isSavingPersonal || personalRemainingSeconds > 0}
            >
              {isSavingPersonal ? 'Salvataggio...' : personalRemainingSeconds > 0 ? `Attendi ${personalRemainingSeconds}s` : 'Salva modifiche'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Password Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sicurezza</CardTitle>
          <CardDescription>Modifica la tua password di accesso</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Password */}
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Password attuale *</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  if (passwordErrors.current) setPasswordErrors(prev => ({ ...prev, current: undefined }));
                }}
                placeholder="••••••••"
                className={cn('pr-10', passwordErrors.current && 'border-destructive')}
                aria-describedby={passwordErrors.current ? 'currentPassword-error' : undefined}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showCurrentPassword ? 'Nascondi password' : 'Mostra password'}
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {passwordErrors.current && (
              <p id="currentPassword-error" className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {passwordErrors.current}
              </p>
            )}
          </div>

          <Separator />

          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="newPassword">Nuova password *</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (passwordErrors.new) setPasswordErrors(prev => ({ ...prev, new: undefined }));
                }}
                placeholder="••••••••"
                className={cn('pr-10', passwordErrors.new && 'border-destructive')}
                aria-describedby="newPassword-requirements"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showNewPassword ? 'Nascondi password' : 'Mostra password'}
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            
            {/* Password Strength Meter */}
            {newPassword && (
              <div className="space-y-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={cn(
                        'h-1.5 flex-1 rounded-full transition-colors',
                        level <= passwordStrength.score ? passwordStrength.color : 'bg-muted'
                      )}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Forza: <span className={cn(
                    passwordStrength.score >= 3 ? 'text-green-600' : 
                    passwordStrength.score >= 2 ? 'text-yellow-600' : 'text-red-600'
                  )}>{passwordStrength.label}</span>
                </p>
              </div>
            )}
            
            <p id="newPassword-requirements" className="text-xs text-muted-foreground">
              Minimo 8 caratteri, almeno 1 lettera e 1 numero
            </p>
            {passwordErrors.new && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {passwordErrors.new}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Conferma nuova password *</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (passwordErrors.confirm) setPasswordErrors(prev => ({ ...prev, confirm: undefined }));
                }}
                placeholder="••••••••"
                className={cn('pr-10', passwordErrors.confirm && 'border-destructive')}
                aria-describedby={passwordErrors.confirm ? 'confirmPassword-error' : undefined}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showConfirmPassword ? 'Nascondi password' : 'Mostra password'}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {confirmPassword && newPassword === confirmPassword && (
              <p className="text-sm text-green-600 flex items-center gap-1">
                <Check className="w-3 h-3" />
                Le password corrispondono
              </p>
            )}
            {passwordErrors.confirm && (
              <p id="confirmPassword-error" className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {passwordErrors.confirm}
              </p>
            )}
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              onClick={handleSavePassword}
              disabled={!isPasswordValid || isSavingPassword || passwordRemainingSeconds > 0}
            >
              {isSavingPassword ? 'Aggiornamento...' : passwordRemainingSeconds > 0 ? `Attendi ${passwordRemainingSeconds}s` : 'Aggiorna password'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

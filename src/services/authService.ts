/**
 * Authentication Service
 * 
 * This service encapsulates all authentication logic.
 * Currently uses MockAuth implementation.
 * 
 * TODO: For future integration:
 * - SupabaseAuth: Replace mock methods with Supabase Auth SDK calls
 * - FirebaseAuth: Replace mock methods with Firebase Auth SDK calls
 */

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: number;
}

export interface AuthError {
  code: string;
  message: string;
}

// Mock user database
const MOCK_USERS: Array<User & { password: string }> = [
  {
    id: 'u1',
    email: 'admin@newcastlepub.it',
    name: 'Admin',
    password: 'admin123',
    role: 'admin',
  },
];

const SESSION_KEY = 'admin_session';
const LAST_RESET_REQUEST_KEY = 'last_reset_request';

// Rate limiting for password reset (30 seconds)
const RESET_RATE_LIMIT_MS = 30 * 1000;

class AuthService {
  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<{ session: AuthSession | null; error: AuthError | null }> {
    // Simulate network delay
    await this.delay(800);

    const user = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!user) {
      return {
        session: null,
        error: { code: 'invalid_credentials', message: 'Email o password non validi' },
      };
    }

    const session: AuthSession = {
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      token: `mock_token_${Date.now()}`,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(session));

    return { session, error: null };
  }

  /**
   * Register a new user
   */
  async register(
    name: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; error: AuthError | null }> {
    await this.delay(800);

    const existingUser = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (existingUser) {
      return {
        success: false,
        error: { code: 'email_exists', message: 'Questa email è già registrata' },
      };
    }

    // Add to mock database
    MOCK_USERS.push({
      id: `u${Date.now()}`,
      email,
      name,
      password,
      role: 'user',
    });

    return { success: true, error: null };
  }

  /**
   * Check if email exists in the database
   */
  emailExists(email: string): boolean {
    return MOCK_USERS.some((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  /**
   * Request password reset
   * Checks if email exists and applies rate limiting
   */
  async requestPasswordReset(email: string): Promise<{ success: boolean; emailFound: boolean; error: AuthError | null }> {
    // Check rate limit per email
    const rateLimitKey = `${LAST_RESET_REQUEST_KEY}_${email.toLowerCase()}`;
    const lastRequest = localStorage.getItem(rateLimitKey);
    if (lastRequest) {
      const timeSince = Date.now() - parseInt(lastRequest, 10);
      if (timeSince < RESET_RATE_LIMIT_MS) {
        const remainingSeconds = Math.ceil((RESET_RATE_LIMIT_MS - timeSince) / 1000);
        return {
          success: false,
          emailFound: false,
          error: {
            code: 'rate_limited',
            message: `Hai già richiesto un link poco fa. Riprova tra ${remainingSeconds} secondi.`,
          },
        };
      }
    }

    await this.delay(800 + Math.random() * 400);

    // Check if email exists
    const emailFound = this.emailExists(email);
    
    // Store rate limit timestamp
    localStorage.setItem(rateLimitKey, Date.now().toString());

    if (!emailFound) {
      return {
        success: false,
        emailFound: false,
        error: {
          code: 'email_not_found',
          message: 'Non abbiamo trovato alcun utente con questa email.',
        },
      };
    }

    // In a real implementation, this would send an email
    console.log(`[Mock] Password reset requested for: ${email}`);

    return { success: true, emailFound: true, error: null };
  }

  /**
   * Reset password with token
   */
  async resetPassword(
    token: string,
    newPassword: string
  ): Promise<{ success: boolean; error: AuthError | null }> {
    await this.delay(800);

    // In a real implementation, validate the token
    if (!token || token.length < 10) {
      return {
        success: false,
        error: { code: 'invalid_token', message: 'Token non valido o scaduto' },
      };
    }

    // Mock: Update password for first user (in real app, decode token to get user)
    console.log(`[Mock] Password reset with token: ${token}`);

    return { success: true, error: null };
  }

  /**
   * Get current session
   */
  getSession(): AuthSession | null {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      if (!stored) return null;

      const session: AuthSession = JSON.parse(stored);

      // Check if session is expired
      if (session.expiresAt < Date.now()) {
        this.logout();
        return null;
      }

      return session;
    } catch {
      return null;
    }
  }

  /**
   * Logout current user
   */
  logout(): void {
    localStorage.removeItem(SESSION_KEY);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.getSession() !== null;
  }

  /**
   * Get remaining rate limit time for password reset
   */
  getResetRateLimitRemaining(): number {
    const lastRequest = localStorage.getItem(LAST_RESET_REQUEST_KEY);
    if (!lastRequest) return 0;

    const timeSince = Date.now() - parseInt(lastRequest, 10);
    if (timeSince >= RESET_RATE_LIMIT_MS) return 0;

    return Math.ceil((RESET_RATE_LIMIT_MS - timeSince) / 1000);
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const authService = new AuthService();

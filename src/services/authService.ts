import { User, AuthProvider } from '../types';

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
  error?: string;
}

export interface GoogleProfilePayload {
  credential?: string;
  email?: string;
  name?: string;
  picture?: string;
  googleId?: string;
}

export interface EmailRegisterPayload {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export const authService = {
  /**
   * Google Sign-In via Server-Side OAuth verification
   */
  async signInWithGoogle(payload: GoogleProfilePayload): Promise<AuthResponse> {
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return {
          success: true,
          token: data.token,
          user: {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            phone: data.user.phone || '',
            username: data.user.email.split('@')[0],
            avatar: data.user.avatar || '',
            role: 'customer',
            membership: data.user.membership || 'Free',
            authProvider: 'google',
            savedDealIds: [],
            notifications: [],
            walletBalanceAED: 50,
            walletEarnedTotalAED: 50,
            walletUsedTotalAED: 0,
            walletTransactions: [],
          },
        };
      }
      return {
        success: false,
        message: data.error || data.message || 'Google Sign-In failed. Please try again.',
      };
    } catch (err: any) {
      console.error('Google Auth Error:', err);
      return {
        success: false,
        message: err.message || 'Network error during Google Sign-In.',
      };
    }
  },

  /**
   * Email/Password Login
   */
  async signInWithEmail(email: string, pass: string): Promise<AuthResponse> {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: pass, requestedRole: 'CUSTOMER' }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return {
          success: true,
          token: data.token,
          user: {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            phone: data.user.phone || '',
            username: data.user.email.split('@')[0],
            avatar: data.user.avatar || '',
            role: (data.user.role?.toLowerCase() as any) || 'customer',
            membership: data.user.membership || 'Free',
            authProvider: 'email',
            savedDealIds: [],
            notifications: [],
            walletBalanceAED: 50,
            walletEarnedTotalAED: 50,
            walletUsedTotalAED: 0,
            walletTransactions: [],
          },
        };
      }
      return {
        success: false,
        message: data.error || data.message || 'Invalid email or password.',
      };
    } catch (err: any) {
      console.error('Email Login Error:', err);
      return {
        success: false,
        message: err.message || 'Network error during sign-in.',
      };
    }
  },

  /**
   * Email/Password Registration
   */
  async signUpWithEmail(payload: EmailRegisterPayload): Promise<AuthResponse> {
    try {
      const cleanEmail = payload.email.trim().toLowerCase();
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          password: payload.password,
          name: payload.name.trim() || cleanEmail.split('@')[0],
          phone: payload.phone?.trim() || '',
          role: 'CUSTOMER',
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return {
          success: true,
          token: data.token,
          user: {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            phone: data.user.phone || payload.phone || '',
            username: cleanEmail.split('@')[0],
            avatar: '',
            role: 'customer',
            membership: 'Free',
            authProvider: 'email',
            savedDealIds: [],
            notifications: [],
            walletBalanceAED: 50,
            walletEarnedTotalAED: 50,
            walletUsedTotalAED: 0,
            walletTransactions: [],
          },
        };
      }
      return {
        success: false,
        message: data.error || data.message || 'Registration failed.',
      };
    } catch (err: any) {
      console.error('Registration Error:', err);
      return {
        success: false,
        message: err.message || 'Network error during registration.',
      };
    }
  },

  /**
   * Verify and restore session from token
   */
  async verifySession(token: string): Promise<AuthResponse> {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return { success: false };
      const data = await res.json();
      if (data.authenticated && data.user) {
        return {
          success: true,
          token,
          user: {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            phone: data.user.phone || '',
            username: data.user.email.split('@')[0],
            avatar: data.user.avatar || '',
            role: (data.user.role?.toLowerCase() as any) || 'customer',
            membership: data.user.membership || 'Free',
            authProvider: data.user.authProvider || 'email',
            savedDealIds: [],
            notifications: [],
            walletBalanceAED: 50,
            walletEarnedTotalAED: 50,
            walletUsedTotalAED: 0,
            walletTransactions: [],
          },
        };
      }
      return { success: false };
    } catch (e) {
      return { success: false };
    }
  },

  /**
   * Server session logout
   */
  async logout(token?: string | null): Promise<void> {
    if (!token) return;
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (e) {
      // ignore
    }
  },

  /**
   * Future-proof Apple Sign-In signature.
   * Currently disabled as per specifications.
   */
  async signInWithApple(): Promise<AuthResponse> {
    return {
      success: false,
      message: 'Apple Sign-In is not enabled yet for this release.',
    };
  },
};

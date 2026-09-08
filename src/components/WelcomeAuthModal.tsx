import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  ChevronLeft,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { SpoteraLogo } from './SpoteraLogo';
import { GoogleSignInButton } from './GoogleSignInButton';
import { authService } from '../services/authService';

interface WelcomeAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WelcomeAuthModal: React.FC<WelcomeAuthModalProps> = ({ isOpen, onClose }) => {
  const { handleAuthSuccess, continueAsGuest, authModalReason } = useApp();
  const { showToast } = useToast();

  const [authView, setAuthView] = useState<'main' | 'email-login' | 'email-register'>('main');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSuccess = (user: any, token?: string) => {
    handleAuthSuccess(user, token);
    showToast.success(`Welcome to SpoteraDeals, ${user.name || 'Member'}!`);
    onClose();
  };

  const handleGoogleError = (err: string) => {
    setErrorMsg(err);
    showToast.error(err);
  };

  const handleAppleAuth = () => {
    const mockAppleUser = {
      id: 'apple_' + Date.now(),
      email: email && email.includes('@') ? email : 'apple.member@icloud.com',
      name: 'Apple Member',
      phone: '',
      role: 'customer' as const,
      membership: 'Free' as const,
      savedDealIds: [],
      notifications: [],
      avatar: '',
      authProvider: 'apple' as const,
      username: 'apple_member',
    };
    handleAuthSuccess(mockAppleUser);
    showToast.success('Signed in with Apple ID');
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);

    if (authView === 'email-register') {
      const res = await authService.signUpWithEmail({
        email: cleanEmail.includes('@') ? cleanEmail : `${cleanEmail}@spotera.ae`,
        password,
        name: fullName.trim() || cleanEmail.split('@')[0],
        phone: '',
      });

      setIsSubmitting(false);

      if (res.success && res.user) {
        handleAuthSuccess(res.user, res.token);
        showToast.success(`Welcome to SpoteraDeals, ${res.user.name}!`);
        onClose();
      } else {
        setErrorMsg(res.message || 'Registration failed.');
        showToast.error(res.message || 'Registration failed.');
      }
    } else {
      const res = await authService.signInWithEmail(
        cleanEmail.includes('@') ? cleanEmail : `${cleanEmail}@spotera.ae`,
        password
      );

      setIsSubmitting(false);

      if (res.success && res.user) {
        handleAuthSuccess(res.user, res.token);
        showToast.success(`Welcome back, ${res.user.name || 'Member'}!`);
        onClose();
      } else {
        setErrorMsg(res.message || 'Invalid email or password.');
        showToast.error(res.message || 'Invalid credentials.');
      }
    }
  };

  const handleGuest = () => {
    continueAsGuest();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-md bg-white text-slate-900 rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-7 space-y-5 my-6 font-sans select-none">
        
        {/* Top navigation row */}
        <div className="flex items-center justify-between">
          {authView !== 'main' ? (
            <button
              onClick={() => {
                setAuthView('main');
                setErrorMsg(null);
              }}
              className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleGuest}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Close / Continue as Guest"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Logo & Headline */}
        <div className="text-center flex flex-col items-center space-y-1.5">
          <SpoteraLogo size="md" variant="light" showTagline={false} />
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            {authView === 'email-register'
              ? 'Create Your Account'
              : authView === 'email-login'
              ? 'Log In'
              : 'Sign in to SpoteraDeals'}
          </h2>
          <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
            {authModalReason || 'Access your vouchers, save favorite deals, and book instantly.'}
          </p>
        </div>

        {/* Reason Banner if triggered by action */}
        {authModalReason && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 flex items-center gap-2 text-amber-800 text-xs font-medium">
            <Sparkles className="w-4 h-4 text-[#FD9302] shrink-0" />
            <span>{authModalReason}</span>
          </div>
        )}

        {/* Error Message */}
        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl px-3.5 py-2 text-rose-700 text-xs font-semibold text-center">
            {errorMsg}
          </div>
        )}

        {/* MAIN VIEW: 4 Direct Options */}
        {authView === 'main' ? (
          <div className="space-y-3 pt-1">
            {/* Register */}
            <button
              onClick={() => {
                setAuthView('email-register');
                setErrorMsg(null);
              }}
              className="w-full py-2.5 px-4 bg-[#0D9CFD] hover:bg-[#0b8de5] active:scale-[0.99] text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <User className="w-4 h-4" />
              <span>Register</span>
            </button>

            {/* Log In */}
            <button
              onClick={() => {
                setAuthView('email-login');
                setErrorMsg(null);
              }}
              className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 active:scale-[0.99] text-slate-800 rounded-xl text-xs sm:text-sm font-bold border border-slate-300 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Mail className="w-4 h-4 text-slate-600" />
              <span>Log In</span>
            </button>

            {/* Divider */}
            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-[11px] text-slate-400">
                <span className="bg-white px-2">or continue with</span>
              </div>
            </div>

            {/* Continue with Apple */}
            <button
              onClick={handleAppleAuth}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.08-7.7-7.92-12.04-14.5-5.99-9.13-10.66-19.48-14.01-31.06-3.35-11.57-5.03-22.75-5.03-33.52 0-14.35 3.63-26.33 10.89-35.95 7.26-9.62 16.5-14.52 27.71-14.7 4.9.12 10.3 1.34 16.2 3.68 5.9 2.34 9.58 3.56 11.04 3.68 2.02-.34 5.99-1.63 11.91-3.86 5.92-2.24 11.13-3.26 15.63-3.07 10.89.73 19.86 4.75 26.91 12.06-9.51 5.75-14.18 13.9-14.01 24.45.18 8.44 3.32 15.53 9.42 21.28 6.1 5.75 13.36 9.07 21.78 9.96-2.12 6.52-4.78 13.06-7.99 19.61zM119.22 31.02c0-7.25 2.66-13.9 7.98-19.95 5.32-6.05 11.75-9.69 19.29-10.92.23 1.36.35 2.61.35 3.75 0 7.25-2.77 14.12-8.31 20.61-5.54 6.49-12.18 10.13-19.91 10.92-.2-1.36-.31-2.61-.31-3.75z" />
              </svg>
              <span>Continue with Apple</span>
            </button>

            {/* Continue with Google */}
            <div className="w-full">
              <GoogleSignInButton
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                size="md"
              />
            </div>

            {/* Continue as Guest */}
            <button
              onClick={handleGuest}
              className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 active:scale-[0.99] text-slate-700 rounded-xl text-xs sm:text-sm font-semibold border border-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer mt-1"
            >
              <span>Continue as Guest</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        ) : (
          /* EMAIL FORM VIEW */
          <form onSubmit={handleSubmit} className="space-y-3 pt-1">
            {authView === 'email-register' && (
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. Sarah Al Hashimi"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full px-3 py-2 pl-9 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0D9CFD]"
                  />
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 pl-9 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0D9CFD]"
                />
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 pl-9 pr-9 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0D9CFD]"
                />
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-[#0D9CFD] hover:bg-[#0b8de5] active:scale-[0.99] text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Processing...' : authView === 'email-register' ? 'Create Account' : 'Log In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-between pt-1 text-xs">
              <button
                type="button"
                onClick={() => setAuthView(authView === 'email-login' ? 'email-register' : 'email-login')}
                className="font-semibold text-[#0D9CFD] hover:underline cursor-pointer"
              >
                {authView === 'email-login'
                  ? "Don't have an account? Register"
                  : 'Already have an account? Log In'}
              </button>

              <button
                type="button"
                onClick={handleGuest}
                className="font-medium text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Continue as Guest →
              </button>
            </div>
          </form>
        )}

        <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5 text-slate-400 text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>SpoteraDeals Verified UAE Platform</span>
        </div>
      </div>
    </div>
  );
};

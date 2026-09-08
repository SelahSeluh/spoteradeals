import React, { useState } from 'react';
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  Ticket,
  Users,
  Compass,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { SpoteraLogo } from '../components/SpoteraLogo';
import { GoogleSignInButton } from '../components/GoogleSignInButton';
import { authService } from '../services/authService';

export const AuthPage: React.FC = () => {
  const { handleAuthSuccess, continueAsGuest, setActiveView, authModalReason, hasEnteredApp } = useApp();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'register' | 'login'>('register');
  const [showOtherMethods, setShowOtherMethods] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGoogleSuccess = (user: any, token?: string) => {
    handleAuthSuccess(user, token);
    showToast.success(`Welcome to SpoteraDeals, ${user.name || 'Member'}!`);
    setActiveView('home');
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
    setActiveView('home');
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

    if (activeTab === 'register') {
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
        setActiveView('home');
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
        setActiveView('home');
      } else {
        setErrorMsg(res.message || 'Invalid email or password.');
        showToast.error(res.message || 'Invalid credentials.');
      }
    }
  };

  const handleGuest = () => {
    continueAsGuest();
    setActiveView('home');
    showToast.info('Welcome! Browsing UAE family deals as a Guest.');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 font-sans select-none relative spotera-mesh-canvas">
      {/* Soft Ambient Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#0D9CFD]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-1/3 w-[500px] h-[300px] bg-[#FD9302]/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-[430px] bg-white rounded-3xl border border-[#D9E3F0] shadow-[0_12px_40px_rgba(13,79,165,0.09)] p-6 sm:p-8 space-y-5 relative z-10">
        {/* Top Branding */}
        <div className="text-center flex flex-col items-center">
          <SpoteraLogo
            size="lg"
            variant="light"
            showTagline={true}
            taglineText="UAE DEALS & TICKETS"
            onClick={hasEnteredApp ? () => setActiveView('home') : undefined}
          />
          <h1 className="text-xl sm:text-2xl font-black text-[#0D1B3E] tracking-tight mt-3">
            Welcome to SpoteraDeals
          </h1>
          <p className="text-xs text-[#5F6B82] mt-1 max-w-xs leading-relaxed">
            More Fun, More Together. Discover UAE family attractions, play areas, waterparks, and exclusive passes.
          </p>
        </div>

        {/* Action Trigger Banner if user was prompted to auth */}
        {authModalReason && (
          <div className="bg-[#FFF8E6] border border-[#FFE082] rounded-2xl px-3.5 py-2.5 flex items-center gap-2 text-[#8C5800] text-xs font-semibold">
            <Ticket className="w-4 h-4 text-[#F5820A] shrink-0" />
            <span>{authModalReason}</span>
          </div>
        )}

        {/* Error message */}
        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl px-3.5 py-2 text-rose-700 text-xs font-semibold text-center">
            {errorMsg}
          </div>
        )}

        {/* PRIMARY AUTHENTICATION ACTIONS: Sign in with Apple & Continue as Guest */}
        <div className="space-y-3 pt-1">
          {/* Sign in with Apple Button */}
          <button
            type="button"
            onClick={handleAppleAuth}
            className="w-full py-3.5 px-5 bg-black hover:bg-neutral-900 active:scale-[0.99] text-white rounded-2xl text-sm font-semibold transition-all flex items-center justify-center gap-3 cursor-pointer shadow-md"
          >
            <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 170 170">
              <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.08-7.7-7.92-12.04-14.5-5.99-9.13-10.66-19.48-14.01-31.06-3.35-11.57-5.03-22.75-5.03-33.52 0-14.35 3.63-26.33 10.89-35.95 7.26-9.62 16.5-14.52 27.71-14.7 4.9.12 10.3 1.34 16.2 3.68 5.9 2.34 9.58 3.56 11.04 3.68 2.02-.34 5.99-1.63 11.91-3.86 5.92-2.24 11.13-3.26 15.63-3.07 10.89.73 19.86 4.75 26.91 12.06-9.51 5.75-14.18 13.9-14.01 24.45.18 8.44 3.32 15.53 9.42 21.28 6.1 5.75 13.36 9.07 21.78 9.96-2.12 6.52-4.78 13.06-7.99 19.61zM119.22 31.02c0-7.25 2.66-13.9 7.98-19.95 5.32-6.05 11.75-9.69 19.29-10.92.23 1.36.35 2.61.35 3.75 0 7.25-2.77 14.12-8.31 20.61-5.54 6.49-12.18 10.13-19.91 10.92-.2-1.36-.31-2.61-.31-3.75z" />
            </svg>
            <span>Sign in with Apple</span>
          </button>

          {/* Continue as Guest Button */}
          <button
            type="button"
            onClick={handleGuest}
            className="w-full py-3.5 px-5 bg-[#F1F6FB] hover:bg-[#E5F0FA] active:scale-[0.99] text-[#0D1B3E] rounded-2xl text-sm font-bold border-2 border-[#D9E3F0] hover:border-[#0D9CFD]/40 transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-xs"
          >
            <Compass className="w-4 h-4 text-[#0D9CFD]" />
            <span>Continue as Guest</span>
            <ArrowRight className="w-4 h-4 text-[#8D98AA]" />
          </button>
        </div>

        {/* Collapsible toggle for more options (Google & Email) */}
        <div className="pt-2 border-t border-[#F0F4F8]">
          <button
            type="button"
            onClick={() => setShowOtherMethods(!showOtherMethods)}
            className="w-full py-2 text-xs font-semibold text-[#5F6B82] hover:text-[#0D1B3E] flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <span>{showOtherMethods ? 'Hide other sign-in methods' : 'Or use Google or Email'}</span>
            {showOtherMethods ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showOtherMethods && (
            <div className="space-y-4 pt-3 mt-1 border-t border-slate-100 animate-fadeIn">
              {/* Google Button */}
              <div className="w-full">
                <GoogleSignInButton
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  size="md"
                />
              </div>

              {/* Segmented Switch: Create Account vs Log In */}
              <div className="flex bg-[#F0F4F8] p-1 rounded-2xl border border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register');
                    setErrorMsg(null);
                  }}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'register'
                      ? 'bg-white text-[#0D1B3E] shadow-xs'
                      : 'text-[#5F6B82] hover:text-[#0D1B3E]'
                  }`}
                >
                  Create Account
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setErrorMsg(null);
                  }}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'login'
                      ? 'bg-white text-[#0D1B3E] shadow-xs'
                      : 'text-[#5F6B82] hover:text-[#0D1B3E]'
                  }`}
                >
                  Log In
                </button>
              </div>

              {/* Compact Email/Password Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                {activeTab === 'register' && (
                  <div>
                    <label className="block text-[11px] font-bold text-[#0D1B3E] uppercase tracking-wider mb-1">
                      Full Name / Family Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8D98AA]" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Sarah & Family"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-[#F8FAFC] border border-[#D9E3F0] rounded-xl text-xs sm:text-sm text-[#0D1B3E] placeholder-[#8D98AA] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0D9CFD] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-[#0D1B3E] uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8D98AA]" />
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-[#F8FAFC] border border-[#D9E3F0] rounded-xl text-xs sm:text-sm text-[#0D1B3E] placeholder-[#8D98AA] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0D9CFD] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold text-[#0D1B3E] uppercase tracking-wider">
                      Password
                    </label>
                    {activeTab === 'login' && (
                      <button
                        type="button"
                        onClick={() => showToast.info('Password reset instructions sent to your email.')}
                        className="text-[11px] font-semibold text-[#0D9CFD] hover:underline"
                      >
                        Forgot?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8D98AA]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      placeholder="Minimum 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2 bg-[#F8FAFC] border border-[#D9E3F0] rounded-xl text-xs sm:text-sm text-[#0D1B3E] placeholder-[#8D98AA] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0D9CFD] focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8D98AA] hover:text-[#0D1B3E] cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-[#0C5CAB] to-[#0D9CFD] hover:from-[#0B5096] hover:to-[#0C8FE8] active:scale-[0.99] text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Processing...</span>
                    </span>
                  ) : (
                    <span>
                      {activeTab === 'register' ? 'Create Free Account' : 'Log In with Email'}
                    </span>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Value Highlights for Family Trust */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#F0F4F8] text-center">
          <div className="p-2 rounded-xl bg-[#F8FAFC] flex flex-col items-center">
            <Users className="w-4 h-4 text-[#0D9CFD] mb-1" />
            <span className="text-[10px] font-bold text-[#0D1B3E]">Family First</span>
            <span className="text-[9px] text-[#8D98AA]">Verified picks</span>
          </div>
          <div className="p-2 rounded-xl bg-[#F8FAFC] flex flex-col items-center">
            <Ticket className="w-4 h-4 text-[#F5820A] mb-1" />
            <span className="text-[10px] font-bold text-[#0D1B3E]">Instant Passes</span>
            <span className="text-[9px] text-[#8D98AA]">Mobile QR codes</span>
          </div>
          <div className="p-2 rounded-xl bg-[#F8FAFC] flex flex-col items-center">
            <ShieldCheck className="w-4 h-4 text-emerald-600 mb-1" />
            <span className="text-[10px] font-bold text-[#0D1B3E]">Best Rates</span>
            <span className="text-[9px] text-[#8D98AA]">Direct UAE savings</span>
          </div>
        </div>
      </div>
    </div>
  );
};

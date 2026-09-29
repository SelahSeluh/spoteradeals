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
  Globe,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { SpoteraLogo } from '../components/SpoteraLogo';
import { GoogleSignInButton } from '../components/GoogleSignInButton';
import { authService } from '../services/authService';
import { Language } from '../types';

export const AuthPage: React.FC = () => {
  const {
    handleAuthSuccess,
    continueAsGuest,
    setActiveView,
    authModalReason,
    hasEnteredApp,
    activeView,
    selectedDealId,
    deals,
    language,
    setLanguage,
    isRtl,
    adminLoginWithCreds,
    t,
  } = useApp();
  const { showToast } = useToast();

  const targetDeal = selectedDealId ? deals.find((d) => d.id === selectedDealId) : null;

  const [activeTab, setActiveTab] = useState<'register' | 'login'>('register');
  const [showOtherMethods, setShowOtherMethods] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigateToDestination = () => {
    if (selectedDealId) {
      setActiveView('deal-detail');
    } else {
      const target = (activeView && activeView !== 'auth') ? activeView : 'home';
      setActiveView(target);
    }
  };

  const handleGoogleSuccess = (user: any, token?: string) => {
    handleAuthSuccess(user, token);
    showToast.success(`Welcome to SpoteraDeals, ${user.name || 'Member'}!`);
    navigateToDestination();
  };

  const handleGoogleError = (err: string) => {
    setErrorMsg(err);
    showToast.error(err);
  };

  const handleAppleAuth = () => {
    const appleUser = {
      id: 'usr_apple_' + Date.now(),
      email: email && email.includes('@') ? email : 'member.apple@spoteradeals.com',
      name: email && email.includes('@') ? email.split('@')[0] : 'Spotera Member',
      phone: '',
      role: 'CUSTOMER' as const,
      membership: 'Free' as const,
      savedDealIds: [],
      notifications: [],
      avatar: '',
      authProvider: 'apple' as const,
      username: 'spotera_member',
    };
    handleAuthSuccess(appleUser);
    showToast.success('Signed in with Apple ID');
    navigateToDestination();
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

    // If logging in as admin
    if (activeTab === 'login' && (cleanEmail === 'admin@spoteradeals.com' || cleanEmail.startsWith('admin@'))) {
      const adminRes = await adminLoginWithCreds(cleanEmail, password);
      setIsSubmitting(false);
      if (adminRes.success) {
        showToast.success('Admin authentication verified.');
        setActiveView('admin');
        return;
      } else {
        setErrorMsg(adminRes.message);
        showToast.error(adminRes.message);
        return;
      }
    }

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
        navigateToDestination();
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
        if (res.user.role === 'ADMIN') {
          showToast.success('Admin authentication verified.');
          setActiveView('admin');
        } else {
          showToast.success(`Welcome back, ${res.user.name || 'Member'}!`);
          navigateToDestination();
        }
      } else {
        setErrorMsg(res.message || 'Invalid email or password.');
        showToast.error(res.message || 'Invalid credentials.');
      }
    }
  };

  const handleGuest = () => {
    continueAsGuest();
    navigateToDestination();
    showToast.info('Welcome! Browsing UAE family deals as a Guest.');
  };

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'ar', label: 'العربية', flag: '🇦🇪' },
    { code: 'zh', label: '中文', flag: '🇨🇳' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  ];

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-3 sm:p-6 font-sans select-none relative spotera-mesh-canvas py-6">
      {/* Top Bar with Back Link & Language Selector */}
      <div className="w-full max-w-[400px] flex items-center justify-between mb-3 z-20 px-1">
        <button
          type="button"
          onClick={handleGuest}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200 text-xs font-semibold text-slate-700 hover:text-[#0C5CAB] transition-colors cursor-pointer shadow-xs active:scale-95"
        >
          <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? '' : 'rotate-180'} text-slate-500`} />
          <span>{t('home')}</span>
        </button>
        <div className="relative inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 shadow-xs text-xs font-semibold text-slate-700">
          <Globe className="w-3.5 h-3.5 text-[#0C5CAB]" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="bg-transparent border-none text-xs font-bold text-slate-800 cursor-pointer focus:outline-hidden"
          >
            {languages.map((l) => (
              <option key={l.code} value={l.code}>
                {l.flag} {l.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* Soft Ambient Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#0D9CFD]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-1/3 w-[450px] h-[250px] bg-[#FD9302]/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-[400px] bg-white rounded-2xl sm:rounded-3xl border border-[#D9E3F0] shadow-[0_8px_30px_rgba(13,79,165,0.08)] p-4 sm:p-6 space-y-4 relative z-10">
        {/* Top Branding */}
        <div className="text-center flex flex-col items-center">
          <SpoteraLogo
            size="md"
            variant="light"
            showTagline={true}
            taglineText="UAE DEALS & TICKETS"
          />
          <h1 className="text-lg sm:text-xl font-black text-[#0D1B3E] tracking-tight mt-2.5">
            {t('authWelcome')}
          </h1>
          <p className="text-[11px] sm:text-xs text-[#5F6B82] mt-0.5 max-w-xs leading-relaxed">
            {t('authTagline')}
          </p>
        </div>

        {/* Action Trigger Banner if user was prompted to auth */}
        {targetDeal && (
          <div className="bg-[#EBF6FF] border border-[#B8E2FF] rounded-xl p-2.5 flex items-center gap-2.5">
            {targetDeal.images?.[0] && (
              <img
                src={targetDeal.images[0]}
                alt={targetDeal.title}
                className="w-10 h-10 rounded-lg object-cover shrink-0 border border-blue-100"
              />
            )}
            <div className="min-w-0 flex-1 text-start">
              <div className="text-[9px] uppercase font-black tracking-wider text-[#0D9CFD]">{t('specialOffer') || 'Special Offer Pass'}</div>
              <div className="text-xs font-bold text-slate-900 truncate">{targetDeal.title}</div>
              <div className="text-[10px] text-slate-500">{targetDeal.city} • {t('save')} AED {targetDeal.originalPrice - targetDeal.discountPrice}</div>
            </div>
          </div>
        )}

        {authModalReason && (
          <div className="bg-[#FFF8E6] border border-[#FFE082] rounded-xl px-3 py-2 flex items-center gap-2 text-[#8C5800] text-xs font-semibold">
            <Ticket className="w-3.5 h-3.5 text-[#F5820A] shrink-0" />
            <span className="text-[11px]">{authModalReason}</span>
          </div>
        )}

        {/* Error message */}
        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl px-3 py-1.5 text-rose-700 text-xs font-semibold text-center">
            {errorMsg}
          </div>
        )}

        {/* PRIMARY AUTHENTICATION ACTIONS */}
        <div className="space-y-2 pt-0.5">
          {/* Continue with Apple Button */}
          <button
            type="button"
            onClick={handleAppleAuth}
            className="w-full h-10 sm:h-11 px-4 bg-black hover:bg-neutral-900 active:scale-[0.99] text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-xs"
          >
            <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 170 170">
              <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.08-7.7-7.92-12.04-14.5-5.99-9.13-10.66-19.48-14.01-31.06-3.35-11.57-5.03-22.75-5.03-33.52 0-14.35 3.63-26.33 10.89-35.95 7.26-9.62 16.5-14.52 27.71-14.7 4.9.12 10.3 1.34 16.2 3.68 5.9 2.34 9.58 3.56 11.04 3.68 2.02-.34 5.99-1.63 11.91-3.86 5.92-2.24 11.13-3.26 15.63-3.07 10.89.73 19.86 4.75 26.91 12.06-9.51 5.75-14.18 13.9-14.01 24.45.18 8.44 3.32 15.53 9.42 21.28 6.1 5.75 13.36 9.07 21.78 9.96-2.12 6.52-4.78 13.06-7.99 19.61zM119.22 31.02c0-7.25 2.66-13.9 7.98-19.95 5.32-6.05 11.75-9.69 19.29-10.92.23 1.36.35 2.61.35 3.75 0 7.25-2.77 14.12-8.31 20.61-5.54 6.49-12.18 10.13-19.91 10.92-.2-1.36-.31-2.61-.31-3.75z" />
            </svg>
            <span>{t('continueWithApple')}</span>
          </button>

          {/* Continue with Google Button */}
          <div className="w-full">
            <GoogleSignInButton
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              label={t('continueWithGoogle')}
              size="md"
            />
          </div>

          {/* Continue as Guest Button */}
          <button
            type="button"
            onClick={handleGuest}
            className="w-full h-10 sm:h-11 px-4 bg-[#F1F6FB] hover:bg-[#E5F0FA] active:scale-[0.99] text-[#0D1B3E] rounded-xl text-xs font-bold border border-[#D9E3F0] hover:border-[#0D9CFD]/40 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
          >
            <Compass className="w-3.5 h-3.5 text-[#0D9CFD]" />
            <span>{t('continueAsGuest')}</span>
            <ArrowRight className={`w-3.5 h-3.5 text-[#8D98AA] ${isRtl ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center pt-1">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-2.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider absolute">
            {t('authOrEmail')}
          </span>
        </div>

        {/* Email & Password Authentication: Sign In / Sign Up */}
        <div className="space-y-3">
          {/* Segmented Switch: Sign In vs Sign Up */}
          <div className="flex bg-[#F0F4F8] p-1 rounded-xl border border-[#E2E8F0]">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setErrorMsg(null);
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-white text-[#0D1B3E] shadow-xs'
                  : 'text-[#5F6B82] hover:text-[#0D1B3E]'
              }`}
            >
              {t('signInTab')}
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setErrorMsg(null);
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'register'
                  ? 'bg-white text-[#0D1B3E] shadow-xs'
                  : 'text-[#5F6B82] hover:text-[#0D1B3E]'
              }`}
            >
              {t('signUpTab')}
            </button>
          </div>

          {/* Compact Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-2.5">
            {activeTab === 'register' && (
              <div>
                <label className="block text-[10px] font-bold text-[#0D1B3E] uppercase tracking-wider mb-1">
                  {t('fullNameLabel')}
                </label>
                <div className="relative">
                  <User className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-[#8D98AA] ${isRtl ? 'right-3' : 'left-3'}`} />
                  <input
                    type="text"
                    required
                    placeholder={t('fullNamePlaceholder')}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={`w-full py-2 bg-[#F8FAFC] border border-[#D9E3F0] rounded-xl text-xs text-[#0D1B3E] placeholder-[#8D98AA] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0D9CFD] focus:border-transparent transition-all ${isRtl ? 'pr-9 pl-3 text-right' : 'pl-9 pr-3 text-left'}`}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold text-[#0D1B3E] uppercase tracking-wider mb-1">
                {t('emailLabel')}
              </label>
              <div className="relative">
                <Mail className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-[#8D98AA] ${isRtl ? 'right-3' : 'left-3'}`} />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full py-2 bg-[#F8FAFC] border border-[#D9E3F0] rounded-xl text-xs text-[#0D1B3E] placeholder-[#8D98AA] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0D9CFD] focus:border-transparent transition-all ${isRtl ? 'pr-9 pl-3 text-right' : 'pl-9 pr-3 text-left'}`}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[10px] font-bold text-[#0D1B3E] uppercase tracking-wider">
                  {t('passwordLabel')}
                </label>
                {activeTab === 'login' && (
                  <button
                    type="button"
                    onClick={() => showToast.info(t('forgotPasswordMsg'))}
                    className="text-[10px] font-semibold text-[#0D9CFD] hover:underline"
                  >
                    {t('forgotPasswordLink')}
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-[#8D98AA] ${isRtl ? 'right-3' : 'left-3'}`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  placeholder={t('passwordPlaceholder')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full py-2 bg-[#F8FAFC] border border-[#D9E3F0] rounded-xl text-xs text-[#0D1B3E] placeholder-[#8D98AA] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0D9CFD] focus:border-transparent transition-all ${isRtl ? 'pr-9 pl-9 text-right' : 'pl-9 pr-9 text-left'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute top-1/2 -translate-y-1/2 text-[#8D98AA] hover:text-[#0D1B3E] cursor-pointer ${isRtl ? 'left-2.5' : 'right-2.5'}`}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-10 px-4 bg-gradient-to-r from-[#0C5CAB] to-[#0D9CFD] hover:from-[#0B5096] hover:to-[#0C8FE8] active:scale-[0.99] text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{t('processing')}</span>
                </span>
              ) : (
                <span>
                  {activeTab === 'register' ? t('signUpTab') : t('signInTab')}
                </span>
              )}
            </button>
          </form>
        </div>

        {/* Value Highlights for Family Trust */}
        <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-[#F0F4F8] text-center">
          <div className="p-1.5 rounded-xl bg-[#F8FAFC] flex flex-col items-center">
            <Users className="w-3.5 h-3.5 text-[#0D9CFD] mb-0.5" />
            <span className="text-[9px] font-bold text-[#0D1B3E]">{t('familyFirst')}</span>
            <span className="text-[8px] text-[#8D98AA]">{t('familyFirstDesc')}</span>
          </div>
          <div className="p-1.5 rounded-xl bg-[#F8FAFC] flex flex-col items-center">
            <Ticket className="w-3.5 h-3.5 text-[#F5820A] mb-0.5" />
            <span className="text-[9px] font-bold text-[#0D1B3E]">{t('instantPasses')}</span>
            <span className="text-[8px] text-[#8D98AA]">{t('instantPassesDesc')}</span>
          </div>
          <div className="p-1.5 rounded-xl bg-[#F8FAFC] flex flex-col items-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 mb-0.5" />
            <span className="text-[9px] font-bold text-[#0D1B3E]">{t('bestRates')}</span>
            <span className="text-[8px] text-[#8D98AA]">{t('bestRatesDesc')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

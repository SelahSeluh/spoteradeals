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
import { safeSessionStorage } from '../utils/storage';
import { PaperWordmark } from '../components/Navbar';
import { ExpeditionSkyline } from '../components/ExpeditionScenery';
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
    setErrorMsg('Apple sign-in is not available yet. Please use email, Google, or continue as a guest.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    if (!password || password.length < (activeTab==='register'?12:1)) {
      setErrorMsg(activeTab==='register' ? 'Use at least 12 characters when creating an account.' : 'Please enter your password.');
      return;
    }

    setIsSubmitting(true);

    // If logging in as admin
    if (activeTab === 'login' && cleanEmail === 'admin@spoteradeals.com') {
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
        if(res.user.role==='PARTNER'){setActiveView('partners');return;}
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
    safeSessionStorage.setItem("paper_guest_entered", "true");
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

  return <div className="expedition-auth">
    <aside className="expedition-auth-aside" aria-hidden="true"><div className="expedition-auth-map"/><p>Explore. Discover. Together.</p><h2>Your next adventure<br/>starts right here.</h2><ExpeditionSkyline/></aside>
    <div className="expedition-auth-main">
      <div className="expedition-auth-tools"><button type="button" onClick={handleGuest}>← Explore as a guest</button><label><Globe size={15}/><select aria-label="Choose language" value={language} onChange={e=>setLanguage(e.target.value as Language)}>{languages.map(l=><option key={l.code} value={l.code}>{l.label}</option>)}</select></label></div>
      <section className="expedition-auth-card"><PaperWordmark/><span className="expedition-eyebrow">YOUR FAMILY ADVENTURE STARTS HERE</span><h1>Welcome, explorer.</h1><p className="expedition-auth-description">Find your next great day out in the UAE.</p>
        {authModalReason && <p className="expedition-auth-notice">{authModalReason}</p>}
        {targetDeal && <p className="expedition-auth-notice">Continue to {targetDeal.title}</p>}
        {errorMsg && <p role="alert" className="expedition-form-error">{errorMsg}</p>}
        <div className="expedition-auth-actions"><GoogleSignInButton onSuccess={handleGoogleSuccess} onError={handleGoogleError} label={t('continueWithGoogle')} size="md"/>
          <button type="button" onClick={handleAppleAuth}><svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true"><path fill="currentColor" d="M16.4 1c.1 1.3-.4 2.4-1.1 3.2-.8.9-1.9 1.4-3 1.3-.1-1.2.4-2.4 1.1-3.2.8-.8 2-1.3 3-1.3Zm3.8 16.3c-.5 1.2-.8 1.8-1.4 2.8-.9 1.3-2.2 2.9-3.8 2.9-1.4 0-1.8-.9-3.8-.9s-2.4.9-3.8.9c-1.6 0-2.8-1.5-3.7-2.8C1.2 16.6.8 12 2.3 9.5c1.1-1.8 2.8-2.8 4.4-2.8s2.6.9 3.9.9c1.3 0 2.1-.9 3.9-.9 1.4 0 2.9.8 3.9 2.1-3.5 1.9-2.9 6.8 1.8 8.5Z"/></svg>{t('continueWithApple')}</button>
          <button type="button" aria-expanded={showOtherMethods} onClick={()=>setShowOtherMethods(!showOtherMethods)}><Mail size={18}/>Continue with email<ChevronDown size={14}/></button>
          <button type="button" className="expedition-guest-button" onClick={handleGuest}><Compass size={18}/>{t('continueAsGuest')}<ArrowRight size={16}/></button>
        </div>
        {showOtherMethods && <div className="expedition-email"><div className="expedition-auth-tabs"><button type="button" aria-pressed={activeTab==='login'} onClick={()=>{setActiveTab('login');setErrorMsg(null)}}>Sign in</button><button type="button" aria-pressed={activeTab==='register'} onClick={()=>{setActiveTab('register');setErrorMsg(null)}}>Create account</button></div><form onSubmit={handleSubmit}>
          {activeTab==='register' && <label>Full name<input required autoComplete="name" value={fullName} onChange={e=>setFullName(e.target.value)}/></label>}
          <label>Email<input type="email" required autoComplete="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)}/></label>
          <label>Password<span className="expedition-password"><input type={showPassword?'text':'password'} required minLength={activeTab==='register'?12:1} autoComplete={activeTab==='login'?'current-password':'new-password'} value={password} onChange={e=>setPassword(e.target.value)}/><button type="button" aria-label={showPassword?'Hide password':'Show password'} onClick={()=>setShowPassword(!showPassword)}>{showPassword?<EyeOff size={18}/>:<Eye size={18}/>}</button></span></label>
          <button type="submit" disabled={isSubmitting}>{isSubmitting?'Please wait…':activeTab==='login'?'Sign in':'Create account'}</button>
        </form></div>}
        <p className="expedition-auth-legal">By continuing, you agree to our <button onClick={()=>setActiveView('terms')}>Terms</button> and <button onClick={()=>setActiveView('privacy')}>Privacy Policy</button>.</p>
      </section><ExpeditionSkyline/><small className="expedition-auth-caption">More discovery. More together.</small>
    </div>
  </div>;
};

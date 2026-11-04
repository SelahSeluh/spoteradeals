import {LanguagePicker,MapArtwork,useDesignText} from '../components/DesignPrimitives';
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
  const d=useDesignText();
  const [consent,setConsent]=useState(false);

  const targetDeal = selectedDealId ? deals.find((d) => d.id === selectedDealId) : null;

  const [activeTab, setActiveTab] = useState<'register' | 'login'>('login');
  const [showOtherMethods, setShowOtherMethods] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetMode,setResetMode]=useState(false);
  const [resetToken,setResetToken]=useState(()=>new URLSearchParams(window.location.search).get('reset_token')||'');
  const [resetPassword,setResetPassword]=useState('');

  const navigateToDestination = () => {
    if (selectedDealId) {
      setActiveView('deal-detail');
    } else {
      const target = (activeView && !['auth','admin','partners'].includes(activeView)) ? activeView : 'home';
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
    setErrorMsg('Apple sign-in is not available yet. Please use email or continue as a guest.');
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
      setErrorMsg(activeTab==='register'?d('passwordRule'):t('enterPassword'));
      return;
    }

    setIsSubmitting(true);

    if(activeTab==='register'&&!consent){setErrorMsg(d('consent'));setIsSubmitting(false);return;}
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
        setActiveView(selectedDealId ? 'deal-detail' : 'home');
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
          setActiveView(selectedDealId ? 'deal-detail' : 'home');
        }
      } else {
        setErrorMsg(res.message || 'Invalid email or password.');
        showToast.error(res.message || 'Invalid credentials.');
      }
    }
  };

  const handlePasswordRecovery = async (e:React.FormEvent) => {
    e.preventDefault();setIsSubmitting(true);setErrorMsg(null);
    try{
      const endpoint=resetToken?'/api/auth/reset-password':'/api/auth/forgot-password';
      const payload=resetToken?{token:resetToken,password:resetPassword}:{email:email.trim().toLowerCase()};
      const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      const contentType=response.headers.get('content-type')||'';
      const result=contentType.includes('application/json')?await response.json().catch(()=>({})):{};
      if(!response.ok)throw new Error(result.message|| (response.status===503?'Password recovery is not available yet. Email delivery must be configured by the site administrator.':'The password reset service could not respond. Please try again later.'));
      if(!contentType.includes('application/json'))throw new Error('The password reset service returned an unexpected response. Please try again later.');
      showToast.success(result.message||'Request received.');
      if(resetToken){setResetToken('');setResetMode(false);setActiveTab('login');window.history.replaceState(null,'',window.location.pathname+'#auth')}
      else setErrorMsg(result.message||'If your email is registered, check your inbox.');
    }catch(error){setErrorMsg(error instanceof Error?error.message:'Please try again.')}
    finally{setIsSubmitting(false)}
  };
  const handleGuest = () => {
    safeSessionStorage.setItem("paper_guest_entered", "true");
    continueAsGuest();
    navigateToDestination();
    showToast.info('Welcome! Browsing UAE family deals as a Guest.');
  };

  return <div className="fn-auth">
    <aside className="fn-auth-art"><MapArtwork/><div><PaperWordmark/><h2>{d('headline')}</h2><p>{d('tagline')}</p></div></aside>
    <div className="fn-auth-main"><div className="fn-auth-toolbar"><button onClick={handleGuest}>← {d('guest')}</button><LanguagePicker/></div>
      <section className="fn-auth-card"><div className="fn-auth-brand"><PaperWordmark/></div><h1>{resetToken?d('choosePassword'):resetMode?d('forgot'):activeTab==='login'?d('welcome'):d('createAccount')}</h1><p>{d('discovery')}</p>
      {targetDeal&&<p className="fn-notice">{targetDeal.title}</p>}{authModalReason&&<p className="fn-notice">{authModalReason}</p>}{errorMsg&&<p role="alert" className="fn-error">{errorMsg}</p>}
      {(resetMode||resetToken)?<form onSubmit={handlePasswordRecovery}>
        {!resetToken?<label>{d('email')}<input type="email" required autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)}/></label>:<label>{d('newPassword')}<input type="password" required minLength={12} maxLength={128} autoComplete="new-password" value={resetPassword} onChange={e=>setResetPassword(e.target.value)}/></label>}
        <button className="fn-primary" disabled={isSubmitting}>{isSubmitting?d('wait'):resetToken?d('reset'):d('resetLink')}</button><button type="button" className="fn-text-button" onClick={()=>{setResetMode(false);setResetToken('');setErrorMsg(null)}}>{d('back')}</button>
      </form>:<form onSubmit={handleSubmit}>
        {activeTab==='register'&&<label>{d('name')}<input required maxLength={120} autoComplete="name" value={fullName} onChange={e=>setFullName(e.target.value)}/></label>}
        <label>{d('email')}<input type="email" required maxLength={254} autoComplete="email" placeholder="you@example.com" dir="ltr" value={email} onChange={e=>setEmail(e.target.value)}/></label>
        <label>{d('password')}<span className="fn-password"><input type={showPassword?'text':'password'} required minLength={activeTab==='register'?12:1} maxLength={128} autoComplete={activeTab==='login'?'current-password':'new-password'} value={password} onChange={e=>setPassword(e.target.value)}/><button type="button" aria-label={showPassword?d('hidePassword'):d('showPassword')} onClick={()=>setShowPassword(!showPassword)}>{showPassword?<EyeOff size={18}/>:<Eye size={18}/>}</button></span></label>
        {activeTab==='register'&&<label className="fn-consent"><input type="checkbox" required checked={consent} onChange={e=>setConsent(e.target.checked)}/><span>{d('consent')}</span></label>}
        <button className="fn-primary" type="submit" disabled={isSubmitting}>{isSubmitting?d('wait'):activeTab==='login'?d('login'):d('register')}</button>
        {activeTab==='login'&&<button className="fn-text-button" type="button" onClick={()=>{setResetMode(true);setErrorMsg(null)}}>{d('forgot')}</button>}
      </form>}
      {!resetMode&&!resetToken&&<div className="fn-auth-alternatives"><button className="fn-outline" aria-pressed={activeTab==='register'} onClick={()=>{setActiveTab(activeTab==='login'?'register':'login');setErrorMsg(null)}}>{activeTab==='login'?d('register'):d('login')}</button><button className="fn-guest" onClick={handleGuest}>{d('guest')}</button></div>}
      <div className="fn-auth-legal"><button onClick={()=>setActiveView('terms')}>{d('terms')}</button><span> · </span><button onClick={()=>setActiveView('privacy')}>{d('privacy')}</button></div>
      </section><p className="fn-auth-caption">{d('tagline')}</p>
    </div>
  </div>;
};

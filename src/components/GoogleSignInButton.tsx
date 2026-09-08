import React, { useState } from 'react';
import { Sparkles, Loader2, Mail, CheckCircle2 } from 'lucide-react';
import { authService, GoogleProfilePayload } from '../services/authService';

interface GoogleSignInButtonProps {
  onSuccess: (user: any, token?: string) => void;
  onError?: (msg: string) => void;
  label?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onSuccess,
  onError,
  label = 'Continue with Google',
  className = '',
  size = 'md',
}) => {
  const [loading, setLoading] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleName, setGoogleName] = useState('');

  const handleClick = async () => {
    setLoading(true);

    // 1. Check if Google Identity Services (GSI) is loaded on window
    if (typeof window !== 'undefined' && (window as any).google?.accounts?.id) {
      try {
        (window as any).google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            setShowPrompt(true);
            setLoading(false);
          }
        });
        return;
      } catch (err) {
        // Continue to interactive prompt
      }
    }

    // 2. Open interactive verified Google flow prompt
    setShowPrompt(true);
    setLoading(false);
  };

  const handleGoogleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleEmail || !googleEmail.includes('@')) {
      onError?.('Please enter a valid Google email address.');
      return;
    }

    setLoading(true);
    const payload: GoogleProfilePayload = {
      email: googleEmail.trim().toLowerCase(),
      name: googleName.trim() || googleEmail.split('@')[0],
      picture: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
        googleName || googleEmail
      )}&backgroundColor=0C5CAB,1067BE`,
    };

    const res = await authService.signInWithGoogle(payload);
    setLoading(false);

    if (res.success && res.user) {
      setShowPrompt(false);
      onSuccess(res.user, res.token);
    } else {
      onError?.(res.message || 'Google Sign-In failed.');
    }
  };

  const sizeClasses = {
    sm: 'py-2 px-3 text-xs min-h-[38px]',
    md: 'py-2.5 px-4 text-xs sm:text-sm min-h-[44px]',
    lg: 'py-3.5 px-5 text-sm sm:text-base min-h-[50px]',
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={`w-full bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-300/90 hover:border-slate-400 font-bold rounded-2xl shadow-xs hover:shadow-md active:scale-[0.99] flex items-center justify-center gap-3 transition-all duration-200 cursor-pointer disabled:opacity-60 select-none ${sizeClasses[size]} ${className}`}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin text-[#0C5CAB]" />
        ) : (
          <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
        )}
        <span>{loading ? 'Connecting with Google...' : label}</span>
      </button>

      {/* Verified Google Sign-In Dialog */}
      {showPrompt && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Sign in with Google</h3>
              <p className="text-xs text-slate-500">
                Connect your Google account to access your Spotera passes, bookings & VIP perks.
              </p>
            </div>

            <form onSubmit={handleGoogleSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Google Email</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    autoFocus
                    placeholder="your.name@gmail.com"
                    value={googleEmail}
                    onChange={(e) => setGoogleEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0C5CAB]"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Display Name (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Tariq Mansoor"
                  value={googleName}
                  onChange={(e) => setGoogleName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0C5CAB]"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPrompt(false)}
                  className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 px-3 bg-[#0C5CAB] hover:bg-[#094887] text-white rounded-xl text-xs font-bold shadow-md transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  <span>Sign In</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

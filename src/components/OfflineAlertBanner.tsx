import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, RefreshCw, X, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const OfflineAlertBanner: React.FC = () => {
  const { language, isRtl, user } = useApp();
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [showReconnectedNotice, setShowReconnectedNotice] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setIsDismissed(false);
      setShowReconnectedNotice(true);
      const timer = setTimeout(() => {
        setShowReconnectedNotice(false);
      }, 4000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setIsDismissed(false);
      setShowReconnectedNotice(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const savedCount = user?.savedDealIds?.length || 0;

  // Reconnected Toast
  if (showReconnectedNotice) {
    return (
      <div
        id="spotera-reconnected-toast"
        dir={isRtl ? 'rtl' : 'ltr'}
        className="fixed bottom-20 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-xl z-50 flex items-center gap-3 border border-emerald-500 animate-in fade-in slide-in-from-bottom-3 duration-300"
      >
        <div className="w-8 h-8 rounded-full bg-emerald-500/50 flex items-center justify-center shrink-0">
          <Wifi className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-bold">
            {isRtl ? 'تمت استعادة الاتصال بالإنترنت' : 'Back online!'}
          </p>
          <p className="text-[11px] text-emerald-100">
            {isRtl ? 'تمت مزامنة بيانات العروض والحجوزات بنجاح.' : 'Data synchronized successfully.'}
          </p>
        </div>
      </div>
    );
  }

  // Offline Sticky Warning Banner
  if (isOffline && !isDismissed) {
    return (
      <div
        id="spotera-offline-banner"
        dir={isRtl ? 'rtl' : 'ltr'}
        className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-slate-950 px-4 py-2.5 shadow-md border-b border-amber-600 flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold transition-all duration-300"
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-7 h-7 rounded-full bg-amber-600/30 flex items-center justify-center shrink-0">
            <WifiOff className="w-4 h-4 text-slate-950" />
          </div>
          <div className="truncate">
            <span className="font-bold">
              {isRtl
                ? "أنت غير متصل بالإنترنت. العروض المحفوظة ما زالت متاحة."
                : "You're offline. Saved deals are still available."}
            </span>
            {savedCount > 0 && (
              <span className="opacity-90 ml-1.5 text-[11px] hidden sm:inline">
                {isRtl ? `(${savedCount} عرض محفوظ)` : `(${savedCount} saved in offline cache)`}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-2.5 py-1 rounded-lg bg-white/40 hover:bg-white/60 text-slate-950 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden sm:inline">{isRtl ? 'إعادة المحاولة' : 'Retry'}</span>
          </button>
          <button
            type="button"
            aria-label="Dismiss offline notice"
            onClick={() => setIsDismissed(true)}
            className="p-1 rounded-full text-slate-900/70 hover:text-slate-950 hover:bg-white/30 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return null;
};

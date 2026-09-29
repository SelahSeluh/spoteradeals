import React, { useState, useEffect } from 'react';
import { Flame, Clock, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface FlashDealCountdownProps {
  targetDate: string | number | Date;
  variant?: 'badge' | 'inline' | 'banner' | 'pill';
  className?: string;
  showIcon?: boolean;
  onExpire?: () => void;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
  isExpired: boolean;
}

function calculateRemaining(target: string | number | Date): TimeRemaining {
  const targetTime = typeof target === 'number' ? target : new Date(target).getTime();
  if (isNaN(targetTime)) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0, isExpired: true };
  }
  const now = Date.now();
  const diff = targetTime - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0, isExpired: true };
  }

  const seconds = Math.floor((diff / 1000) % 60);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  return {
    days,
    hours,
    minutes,
    seconds,
    total: diff,
    isExpired: false,
  };
}

export const FlashDealCountdown: React.FC<FlashDealCountdownProps> = ({
  targetDate,
  variant = 'badge',
  className = '',
  showIcon = true,
  onExpire,
}) => {
  const { language, isRtl } = useApp();
  const [time, setTime] = useState<TimeRemaining>(() => calculateRemaining(targetDate));

  useEffect(() => {
    // Initial check
    const current = calculateRemaining(targetDate);
    setTime(current);
    if (current.isExpired && onExpire) {
      onExpire();
      return;
    }

    const timer = setInterval(() => {
      const updated = calculateRemaining(targetDate);
      setTime(updated);
      if (updated.isExpired) {
        clearInterval(timer);
        onExpire?.();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onExpire]);

  // Localized label helpers
  const labels = {
    expired: {
      en: 'Deal Expired',
      ar: 'انتهى العرض',
      zh: '优惠已结束',
      ru: 'Акция завершена',
      fr: 'Offre expirée',
      am: 'ቅናሹ አልቋል',
    }[language] || 'Deal Expired',
    endsIn: {
      en: 'Deal ends in',
      ar: 'ينتهي العرض خلال',
      zh: '优惠截止还有',
      ru: 'Акция завершится через',
      fr: 'Offre se termine dans',
      am: 'ቅናሹ የሚያበቃው በ',
    }[language] || 'Deal ends in',
    d: {
      en: 'd',
      ar: 'يوم',
      zh: '天',
      ru: 'д',
      fr: 'j',
      am: 'ቀን',
    }[language] || 'd',
    h: {
      en: 'h',
      ar: 'س',
      zh: '时',
      ru: 'ч',
      fr: 'h',
      am: 'ሰ',
    }[language] || 'h',
    m: {
      en: 'm',
      ar: 'د',
      zh: '分',
      ru: 'м',
      fr: 'm',
      am: 'ደ',
    }[language] || 'm',
    s: {
      en: 's',
      ar: 'ث',
      zh: '秒',
      ru: 'с',
      fr: 's',
      am: 'ሰ',
    }[language] || 's',
  };

  const pad = (num: number) => String(num).padStart(2, '0');

  // If expired, show clear expired state
  if (time.isExpired) {
    if (variant === 'badge' || variant === 'pill') {
      return (
        <div
          className={`inline-flex items-center gap-1 bg-slate-800/85 text-slate-200 text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs tracking-tight select-none ${className}`}
        >
          <AlertCircle className="w-3 h-3 text-slate-400" />
          <span>{labels.expired}</span>
        </div>
      );
    }
    return (
      <div
        className={`bg-slate-100 border border-slate-200 text-slate-600 rounded-xl p-3 flex items-center justify-center gap-2 text-xs font-semibold ${className}`}
      >
        <AlertCircle className="w-4 h-4 text-slate-500" />
        <span>{labels.expired}</span>
      </div>
    );
  }

  // Variant: Badge (for deal card overlays)
  if (variant === 'badge') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 bg-gradient-to-r from-rose-600 to-amber-600 text-white text-[10.5px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs tracking-tight select-none ${className}`}
        dir="ltr"
      >
        {showIcon && <Flame className="w-3 h-3 text-yellow-200 animate-pulse" />}
        <span>
          {time.days > 0 && `${time.days}${labels.d} `}
          {pad(time.hours)}:{pad(time.minutes)}:{pad(time.seconds)}
        </span>
      </div>
    );
  }

  // Variant: Pill (inline compact indicator)
  if (variant === 'pill') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold px-2.5 py-1 rounded-full select-none ${className}`}
      >
        {showIcon && <Clock className="w-3.5 h-3.5 text-rose-500" />}
        <span className="text-[11px] font-medium text-rose-500">{labels.endsIn}:</span>
        <span className="font-mono font-bold" dir="ltr">
          {time.days > 0 && `${time.days}${labels.d} `}
          {pad(time.hours)}:{pad(time.minutes)}:{pad(time.seconds)}
        </span>
      </div>
    );
  }

  // Variant: Inline / Bar
  if (variant === 'inline') {
    return (
      <div
        className={`flex items-center gap-2 text-xs text-rose-600 font-bold select-none ${className}`}
      >
        {showIcon && <Flame className="w-4 h-4 text-rose-500 fill-rose-500/20" />}
        <span className="text-slate-600 font-medium">{labels.endsIn}</span>
        <span className="font-mono text-rose-600 font-extrabold" dir="ltr">
          {time.days > 0 && `${time.days}${labels.d} `}
          {pad(time.hours)}:{pad(time.minutes)}:{pad(time.seconds)}
        </span>
      </div>
    );
  }

  // Variant: Banner (Rich countdown blocks for Spotlight / Detail page / Hero)
  return (
    <div
      className={`bg-gradient-to-br from-rose-50 via-amber-50/70 to-orange-50/80 border border-rose-200/80 rounded-2xl p-3.5 sm:p-4 shadow-xs select-none ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-xs">
            <Flame className="w-4 h-4 text-white fill-white/20 animate-bounce" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-black text-rose-900 leading-tight flex items-center gap-1.5">
              <span>{isRtl ? 'عرض لفترة محدودة' : 'Limited-Time Flash Deal'}</span>
            </div>
            <div className="text-[11px] text-rose-700 font-medium leading-none mt-0.5">
              {labels.endsIn}
            </div>
          </div>
        </div>

        {/* Digital blocks */}
        <div className="flex items-center gap-1 sm:gap-1.5" dir="ltr">
          {time.days > 0 && (
            <>
              <div className="flex flex-col items-center bg-white/95 border border-rose-200 shadow-2xs rounded-xl px-2 py-1 min-w-[36px]">
                <span className="font-mono text-sm sm:text-base font-black text-rose-900 leading-none">
                  {pad(time.days)}
                </span>
                <span className="text-[9px] font-bold text-rose-500 uppercase">{labels.d}</span>
              </div>
              <span className="text-rose-400 font-bold text-xs">:</span>
            </>
          )}

          <div className="flex flex-col items-center bg-white/95 border border-rose-200 shadow-2xs rounded-xl px-2 py-1 min-w-[36px]">
            <span className="font-mono text-sm sm:text-base font-black text-rose-900 leading-none">
              {pad(time.hours)}
            </span>
            <span className="text-[9px] font-bold text-rose-500 uppercase">{labels.h}</span>
          </div>

          <span className="text-rose-400 font-bold text-xs">:</span>

          <div className="flex flex-col items-center bg-white/95 border border-rose-200 shadow-2xs rounded-xl px-2 py-1 min-w-[36px]">
            <span className="font-mono text-sm sm:text-base font-black text-rose-900 leading-none">
              {pad(time.minutes)}
            </span>
            <span className="text-[9px] font-bold text-rose-500 uppercase">{labels.m}</span>
          </div>

          <span className="text-rose-400 font-bold text-xs">:</span>

          <div className="flex flex-col items-center bg-white/95 border border-rose-200 shadow-2xs rounded-xl px-2 py-1 min-w-[36px]">
            <span className="font-mono text-sm sm:text-base font-black text-rose-600 leading-none animate-pulse">
              {pad(time.seconds)}
            </span>
            <span className="text-[9px] font-bold text-rose-500 uppercase">{labels.s}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Tag, Sparkles, ArrowRight, Gift } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';

export const PromoCouponBanner: React.FC = () => {
  const { setActiveView, requireUserAuth } = useApp();
  const { showToast } = useToast();

  const handleGrabDeal = () => {
    navigator.clipboard.writeText('SPOTERA10');
    showToast.success('Promo Code SPOTERA10 copied!', '10% discount ready to apply at checkout.');
    setActiveView('explore');
  };

  return (
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#0052CC] via-[#0D9CFD] to-[#0070BA] p-4 sm:p-6 text-white shadow-xl select-none">
      {/* Background playful doodle stars & smileys */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-25">
        <div className="absolute top-2 left-6 text-white">
          <Sparkles className="w-8 h-8" />
        </div>
        <div className="absolute bottom-1 right-28 text-white">
          <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 14a4 4 0 0 1-4-4h8a4 4 0 0 1-4 4z" />
          </svg>
        </div>
        <div className="absolute top-1/2 right-1/4 text-yellow-300">
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
          </svg>
        </div>
      </div>

      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Left: Text & Code */}
        <div className="flex items-center gap-3 sm:gap-4 text-center sm:text-left">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30">
            <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300" />
          </div>

          <div>
            <h3 className="text-base sm:text-lg lg:text-xl font-black text-white tracking-tight">
              Extra 10% OFF on your first booking!
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 font-medium">
              Use Code: <span className="font-black text-amber-300 tracking-wider bg-white/15 px-2 py-0.5 rounded-md border border-white/20">SPOTERA10</span>
            </p>
          </div>
        </div>

        {/* Right: Grab Deal Action Button */}
        <button
          onClick={handleGrabDeal}
          className="px-6 py-2.5 sm:py-3 bg-[#FD9302] hover:bg-[#e68400] active:scale-95 text-white text-xs sm:text-sm font-black rounded-full shadow-lg transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <span>Grab Deal</span>
          <span className="text-base leading-none font-bold">+</span>
        </button>

      </div>
    </div>
  );
};

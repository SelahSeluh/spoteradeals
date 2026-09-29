import React from 'react';
import { Tag, ArrowRight, Gift } from 'lucide-react';
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

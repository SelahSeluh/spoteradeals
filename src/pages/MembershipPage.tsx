import React, { useState } from 'react';
import { Crown, CheckCircle2, Sparkles, ShieldCheck, Zap, Gift } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MembershipPage: React.FC = () => {
  const { user, upgradeMembership } = useApp();
  const [successMsg, setSuccessMsg] = useState(false);

  const handleUpgrade = (tier: string) => {
    upgradeMembership(tier);
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#0C5CAB] via-[#1067BE] to-[#0A4D92] text-white p-10 rounded-3xl shadow-xl text-center space-y-4 relative overflow-hidden">
        <div className="w-16 h-16 rounded-2xl bg-white text-[#0C5CAB] mx-auto flex items-center justify-center shadow-lg">
          <Crown className="w-8 h-8 text-[#0C5CAB]" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-amber-300">
            SpoteraDeals VIP Family Pass
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-sans text-white">
            Save Up to 50% More on Every Family Activity
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 font-medium max-w-2xl mx-auto">
            One membership for the entire family. Enjoy priority camp seats, exclusive VIP vouchers, and zero activity booking fees across Dubai and all 7 Emirates.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-2xl text-center font-bold text-xs">
          🎉 Congratulations! Your SpoteraDeals VIP Family Pass has been activated!
        </div>
      )}

      {/* Pricing Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Free Plan */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Standard Pass</span>
            <div className="text-3xl font-black text-slate-900">
              FREE
            </div>
            <p className="text-xs text-slate-500">Perfect for occasional weekend family outings.</p>

            <ul className="space-y-3 text-xs text-slate-700 pt-4 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Browse & claim standard coupons
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Book venue activity time slots
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Digital QR code wallet
              </li>
            </ul>
          </div>

          <button
            disabled
            className="w-full py-3 bg-slate-100 text-slate-400 font-bold rounded-2xl text-xs"
          >
            {user.membership === 'Free' ? 'Current Active Plan' : 'Free Plan'}
          </button>
        </div>

        {/* VIP Premium Plan */}
        <div className="bg-gradient-to-br from-[#0C5CAB] via-[#094887] to-[#063462] text-white p-8 rounded-3xl shadow-xl border border-blue-400/40 space-y-6 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-4 right-4 bg-amber-400 text-slate-950 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
            Best Value
          </div>

          <div className="space-y-4">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block flex items-center gap-1">
              <Crown className="w-4 h-4 text-amber-300" /> SpoteraDeals VIP Pass
            </span>
            <div className="text-3xl font-black text-white flex items-baseline gap-1">
              <span>AED 199</span>
              <span className="text-xs text-blue-200 font-medium">/ year</span>
            </div>
            <p className="text-xs text-blue-100">Covers 2 Adults + up to 4 Children.</p>

            <ul className="space-y-3 text-xs text-blue-50 pt-4 border-t border-white/10">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-300" /> Extra 10% - 50% discount on all deals
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-300" /> Priority summer & holiday camp registration
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-300" /> Zero activity booking convenience fees
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-300" /> VIP Birthday venue voucher booklet
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-300" /> SpoteraDeals concierge support
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleUpgrade('VIP Family Pass')}
            className="w-full py-3.5 bg-white hover:bg-blue-50 text-[#0C5CAB] font-extrabold rounded-2xl text-xs shadow-xl transition-all cursor-pointer"
          >
            {user.membership === 'VIP Family Pass' ? '✓ You Are VIP Member' : 'Subscribe to VIP (AED 199/yr)'}
          </button>
        </div>
      </div>
    </div>
  );
};

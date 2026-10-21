import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Trophy,
  Ticket,
  Share2,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Star,
  ShieldCheck,
  Award,
  Zap,
  Gift,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';

export const RewardsPage: React.FC = () => {
  const {
    user,
    bookings,
    coupons,
    loyaltyRules,
    loyaltyTiers,
    loyaltyHistory,
    awardLoyaltyPoints,
    setActiveView,
    t,
    isRtl,
  } = useApp();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'progress' | 'history' | 'ways_to_earn'>('progress');

  const points = user.rewardsPoints ?? 0;
  const vipThreshold = loyaltyTiers.vipThreshold || 1000;
  const premiumThreshold = loyaltyTiers.premiumThreshold || 2500;

  // Determine current tier
  const isPremium = points >= premiumThreshold;
  const isVip = points >= vipThreshold && !isPremium;
  const isBronze = points < vipThreshold;

  const currentTierLabel = isPremium ? 'Premium VIP' : isVip ? 'Spotera VIP' : 'Spotera Member';

  // Calculate remaining points until next level and progress percentage
  let pointsRemaining = 0;
  let nextLevelName = 'VIP';
  let progressPercent = 0;

  if (isBronze) {
    pointsRemaining = Math.max(0, vipThreshold - points);
    nextLevelName = 'VIP';
    progressPercent = Math.min(100, Math.round((points / vipThreshold) * 100));
  } else if (isVip) {
    pointsRemaining = Math.max(0, premiumThreshold - points);
    nextLevelName = 'Premium';
    const tierRange = premiumThreshold - vipThreshold;
    const progressInTier = points - vipThreshold;
    progressPercent = Math.min(100, Math.round((progressInTier / tierRange) * 100));
  } else {
    pointsRemaining = 0;
    nextLevelName = 'Max Level';
    progressPercent = 100;
  }

  // Combined real points history
  const historyList = useMemo(() => {
    if (loyaltyHistory && loyaltyHistory.length > 0) {
      return loyaltyHistory;
    }

    // Fallback display from bookings and coupons if empty
    const fallback: any[] = [];
    bookings.forEach((b) => {
      fallback.push({
        id: `fb_bk_${b.id}`,
        actionType: 'BOOKING_COMPLETED',
        referenceId: b.id,
        points: loyaltyRules.bookingPoints || 100,
        description: `Booking Pass: ${b.dealTitle || b.businessName}`,
        createdAt: b.date ? `${b.date}T10:00:00Z` : new Date().toISOString(),
      });
    });

    coupons.forEach((c) => {
      if (c.status === 'redeemed') {
        fallback.push({
          id: `fb_cp_${c.id}`,
          actionType: 'DEAL_REDEMPTION',
          referenceId: c.id,
          points: loyaltyRules.redemptionPoints || 50,
          description: `Voucher Redeemed: ${c.dealTitle}`,
          createdAt: c.claimedAt ? `${c.claimedAt}T12:00:00Z` : new Date().toISOString(),
        });
      }
    });

    return fallback;
  }, [loyaltyHistory, bookings, coupons, loyaltyRules]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'SpoteraDeals VIP Family Rewards',
          text: `Join SpoteraDeals with my referral link and earn ${loyaltyRules.referralPoints} bonus points toward VIP family passes in the UAE!`,
          url: window.location.origin,
        });
      } catch (err) {
        // User dismissed
      }
    } else {
      navigator.clipboard?.writeText(window.location.origin);
      showToast('Referral invitation link copied to clipboard!', 'success');
    }
  };

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="paper-rewards min-h-screen bg-[#F0F5FB] pb-28 pt-4 px-4 sm:px-6" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-2xl mx-auto flex flex-col gap-5">
        {/* Navigation Top Bar */}
        <div className="flex items-center justify-between min-h-[46px]">
          <button
            onClick={() => setActiveView('profile')}
            aria-label={t('back') || 'Go back to profile'}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#0D1B3E] shadow-xs border border-[#E7EBF2] hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <ArrowLeft className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
          </button>
          <div className="text-center">
            <h1 className="text-lg font-black text-[#0D1B3E] tracking-tight">
              {t('navRewards') || 'Loyalty & VIP Membership'}
            </h1>
            <p className="text-[11px] font-semibold text-slate-500">
              UAE Family Savings & Perks
            </p>
          </div>
          <div className="w-10" />
        </div>

        {/* 1. HERO MEMBERSHIP PROGRESS CARD */}
        <div className="bg-gradient-to-br from-[#0A2540] via-[#0E3D6E] to-[#125492] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
          {/* Background Ambient Glows */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FD9302]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#0D9CFD]/20 rounded-full blur-2xl pointer-events-none" />

          {/* Top Row: Current Points & Current Status Badge */}
          <div className="relative z-10 flex items-start justify-between gap-4">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-blue-200 block mb-1">
                CURRENT LOYALTY POINTS
              </span>
              <div className="text-4xl sm:text-5xl font-black tracking-tight text-white flex items-baseline gap-2">
                <span>{points.toLocaleString()}</span>
                <span className="text-sm sm:text-base font-bold text-amber-400">Points</span>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase font-bold text-blue-200 tracking-wider mb-1">
                Current Status
              </span>
              <div
                className={`px-3.5 py-1.5 rounded-full text-xs font-black shadow-md flex items-center gap-1.5 border ${
                  isPremium
                    ? 'bg-purple-600/90 text-white border-purple-400'
                    : isVip
                    ? 'bg-[#F5820A] text-white border-amber-300'
                    : 'bg-white/20 text-white border-white/30 backdrop-blur-md'
                }`}
              >
                {isPremium ? (
                  <ShieldCheck className="w-4 h-4 text-amber-300" />
                ) : isVip ? (
                  <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
                ) : (
                  <Award className="w-4 h-4 text-blue-200" />
                )}
                <span>{currentTierLabel}</span>
              </div>
            </div>
          </div>

          {/* Tiers Milestone Stepper: Current Points → VIP → Premium */}
          <div className="relative z-10 mt-6 pt-5 border-t border-white/15">
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <span className={isBronze ? 'text-amber-300 font-black' : 'text-blue-100'}>
                Member
              </span>
              <span className="text-blue-300/80">→</span>
              <span className={isVip ? 'text-amber-300 font-black' : isPremium ? 'text-blue-200' : 'text-blue-300'}>
                VIP ({vipThreshold.toLocaleString()} pts)
              </span>
              <span className="text-blue-300/80">→</span>
              <span className={isPremium ? 'text-amber-300 font-black' : 'text-blue-300'}>
                Premium ({premiumThreshold.toLocaleString()} pts)
              </span>
            </div>

            {/* Visual Progress Bar (Matches the user requirement: ████████████░░░░░░) */}
            <div className="w-full bg-black/40 h-4 rounded-full p-0.5 overflow-hidden border border-white/20 shadow-inner relative">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-[#FD9302] via-[#FFAE33] to-[#FFD54F] shadow-sm"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Remaining Points Display */}
            <div className="mt-3 flex items-center justify-between text-xs">
              <div className="font-extrabold text-amber-300 flex items-center gap-1.5">
                {isPremium ? (
                  <>
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span>🏆 Top Premium VIP Tier Unlocked!</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span>
                      {pointsRemaining.toLocaleString()} points until {nextLevelName}
                    </span>
                  </>
                )}
              </div>

              <span className="text-[11px] font-semibold text-blue-200">
                {isPremium
                  ? 'All Exclusive VIP Perks Active'
                  : `${progressPercent}% Progress toward ${nextLevelName}`}
              </span>
            </div>
          </div>
        </div>

        {/* View Mode Tabs: Membership Benefits | Ways to Earn | Points History */}
        <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-slate-200 shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTab('progress')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'progress'
                ? 'bg-[#1A4FBF] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tier Benefits
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ways_to_earn')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'ways_to_earn'
                ? 'bg-[#1A4FBF] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Ways to Earn
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-[#1A4FBF] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Points History</span>
            {historyList.length > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeTab === 'history' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {historyList.length}
              </span>
            )}
          </button>
        </div>

        {/* TAB 1: TIER BENEFITS COMPARISON */}
        {activeTab === 'progress' && (
          <div className="space-y-4 animate-in fade-in">
            {/* VIP Tier Details */}
            <div
              className={`bg-white rounded-3xl p-5 border transition-all ${
                isVip || isPremium
                  ? 'border-amber-400 bg-amber-50/20 ring-1 ring-amber-400/40 shadow-sm'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-sm">
                      Spotera VIP Membership
                    </h3>
                    <span className="text-[11px] text-slate-500 font-semibold">
                      Threshold: {vipThreshold.toLocaleString()} Points
                    </span>
                  </div>
                </div>

                {isVip && (
                  <span className="text-xs bg-amber-100 text-amber-800 font-black px-2.5 py-1 rounded-full border border-amber-300">
                    Active Tier
                  </span>
                )}
                {isBronze && (
                  <span className="text-xs text-slate-500 font-bold bg-slate-100 px-2.5 py-1 rounded-full">
                    {vipThreshold - points} pts needed
                  </span>
                )}
                {isPremium && (
                  <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Unlocked
                  </span>
                )}
              </div>

              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Extra 15% discount on all family activity bookings across UAE</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Instant priority reservation window for weekend theme parks</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>AED 50 birthday voucher on child registered birthday month</span>
                </li>
              </ul>
            </div>

            {/* Premium VIP Tier Details */}
            <div
              className={`bg-white rounded-3xl p-5 border transition-all ${
                isPremium
                  ? 'border-purple-500 bg-purple-50/20 ring-1 ring-purple-500/40 shadow-sm'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-sm">
                      Spotera Premium VIP Tier
                    </h3>
                    <span className="text-[11px] text-slate-500 font-semibold">
                      Threshold: {premiumThreshold.toLocaleString()} Points
                    </span>
                  </div>
                </div>

                {isPremium ? (
                  <span className="text-xs bg-purple-100 text-purple-800 font-black px-2.5 py-1 rounded-full border border-purple-300">
                    Active Tier
                  </span>
                ) : (
                  <span className="text-xs text-slate-500 font-bold bg-slate-100 px-2.5 py-1 rounded-full">
                    {Math.max(0, premiumThreshold - points)} pts needed
                  </span>
                )}
              </div>

              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Extra 25% VIP pass discount on all UAE venues & dining</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Free family pass upgrades at partnering attractions</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Dedicated concierge WhatsApp support for instant bookings</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Guaranteed access to exclusive UAE holiday event tickets</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* TAB 2: WAYS TO EARN POINTS */}
        {activeTab === 'ways_to_earn' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 animate-in fade-in">
            {/* 1. Complete Booking */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between gap-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#1A4FBF] flex items-center justify-center">
                    <Ticket className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-black text-[#1A4FBF] bg-blue-50 px-2.5 py-0.5 rounded-full">
                    +{loyaltyRules.bookingPoints} pts
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-xs">Book Experiences</h4>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Earn {loyaltyRules.bookingPoints} points instantly whenever you book tickets or passes online.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveView('explore')}
                className="text-xs font-bold text-[#1A4FBF] hover:text-blue-800 flex items-center gap-1 cursor-pointer pt-1"
              >
                <span>Browse Deals</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 2. Redeem Deals */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between gap-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-[#F5820A] flex items-center justify-center">
                    <Gift className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-black text-[#F5820A] bg-amber-50 px-2.5 py-0.5 rounded-full">
                    +{loyaltyRules.redemptionPoints} pts
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-xs">Redeem Vouchers</h4>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Present your QR code pass at venue desks to earn {loyaltyRules.redemptionPoints} bonus points.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveView('coupons')}
                className="text-xs font-bold text-[#F5820A] hover:text-amber-700 flex items-center gap-1 cursor-pointer pt-1"
              >
                <span>View My Vouchers</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 3. Friend Referrals */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between gap-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    +{loyaltyRules.referralPoints} pts
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-xs">Invite UAE Families</h4>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Share SpoteraDeals with friends. Earn {loyaltyRules.referralPoints} points when they join.
                </p>
              </div>
              <button
                type="button"
                onClick={handleShare}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer pt-1"
              >
                <span>Share Referral Link</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 4. Purchases Per AED */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between gap-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Zap className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-black text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full">
                    {loyaltyRules.purchasePointsPerAED} pt / AED
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-xs">Spend & Earn</h4>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Every 1 AED spent on tickets and exclusive family passes accumulates loyalty points.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveView('explore')}
                className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 cursor-pointer pt-1"
              >
                <span>Explore Passes</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: REAL POINTS HISTORY & DUPLICATE-FREE LOG */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Verified Points Ledger</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-semibold">
                Protected against duplicate awards
              </span>
            </div>

            {historyList.length === 0 ? (
              <div className="text-center py-8 space-y-2">
                <Award className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-slate-600">No points activity yet</p>
                <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                  Book an experience pass or redeem a deal coupon to earn your first loyalty points!
                </p>
                <button
                  type="button"
                  onClick={() => setActiveView('explore')}
                  className="mt-2 text-xs font-bold text-white bg-[#1A4FBF] hover:bg-blue-800 px-4 py-2 rounded-xl transition-colors cursor-pointer"
                >
                  Explore UAE Deals
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {historyList.map((item) => (
                  <div
                    key={item.id}
                    className="py-3 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-900">
                        {item.description || 'Loyalty Activity'}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-2">
                        <span>{formatDate(item.createdAt)}</span>
                        <span>•</span>
                        <span className="font-mono text-slate-500">Ref: {item.referenceId}</span>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <span className="font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full text-xs">
                        +{item.points} pts
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

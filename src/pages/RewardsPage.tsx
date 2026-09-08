import React, { useMemo } from 'react';
import { ArrowLeft, Trophy, Ticket, Share2, Sparkles, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';

export const RewardsPage: React.FC = () => {
  const { user, bookings, setActiveView } = useApp();
  const { showToast } = useToast();

  const points = user.rewardsPoints ?? 120;
  const progressPercent = Math.min((points / 200) * 100, 100);

  const history = useMemo(() => {
    const list = [
      {
        id: 'hist_1',
        title: 'Spotera Welcome Bonus',
        date: 'Aug 1, 2026',
        points: '+50 pts',
        type: 'bonus',
      },
      {
        id: 'hist_2',
        title: 'Family Profile Completed',
        date: 'Aug 10, 2026',
        points: '+20 pts',
        type: 'bonus',
      },
    ];

    bookings.forEach((b, idx) => {
      list.push({
        id: `hist_bk_${b.id}`,
        title: `Booked: ${b.dealTitle}`,
        date: b.date || 'Aug 20, 2026',
        points: `+${Math.max(25, Math.floor(b.totalPrice * 0.1))} pts`,
        type: 'booking',
      });
    });

    return list;
  }, [bookings]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'SpoteraDeals Rewards',
          text: 'Join SpoteraDeals with my code to get 20 free points and huge family discounts in the UAE!',
          url: window.location.origin,
        });
      } catch (err) {
        // user cancelled
      }
    } else {
      navigator.clipboard?.writeText(window.location.origin);
      showToast('Referral link copied to clipboard!', 'success');
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F5FB] pb-28 pt-4 px-4 sm:px-6">
      <div className="max-w-xl mx-auto flex flex-col gap-4">
        {/* Page Header */}
        <div className="flex items-center justify-between min-h-[46px]">
          <button
            onClick={() => setActiveView('profile')}
            aria-label="Go back to profile"
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#0D1B3E] shadow-xs border border-[#E7EBF2] hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold text-[#0D1B3E] tracking-tight">Rewards</h1>
          <div className="w-10" />
        </div>

        {/* Balance Card */}
        <div className="bg-white rounded-[20px] border border-[#E7EBF2] p-5 shadow-xs flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5F6B82]">
                YOUR BALANCE
              </span>
              <div className="text-3xl font-extrabold text-[#0D1B3E] mt-0.5 tracking-tight">
                {points}
              </div>
              <p className="text-xs font-semibold text-[#5F6B82]">Spotera points</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#FFF4EB] flex items-center justify-center text-[#F5820A]">
              <Trophy className="w-6 h-6" />
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex flex-col gap-1.5">
            <div className="w-full h-2 rounded-full bg-[#E7EBF2] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#F5820A] transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-[11px] font-semibold text-[#5F6B82]">
              {points >= 200
                ? '🎉 You unlocked your next reward!'
                : `${200 - points} points until your next AED 20 voucher`}
            </p>
          </div>
        </div>

        {/* Section Header: How to earn */}
        <div className="flex flex-col gap-0.5 mt-1">
          <h2 className="text-base font-bold text-[#0D1B3E]">How to earn</h2>
          <p className="text-xs text-[#5F6B82]">Little moments add up</p>
        </div>

        {/* Earn Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-[18px] border border-[#E7EBF2] p-4 shadow-xs flex flex-col gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#FFF4EB] text-[#F5820A] flex items-center justify-center">
              <Ticket className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-[#0D1B3E]">Book a deal</h3>
            <p className="text-[11px] text-[#5F6B82] leading-tight">
              Earn 1 point for every AED spent on passes & vouchers.
            </p>
          </div>

          <div
            onClick={handleShare}
            className="bg-white rounded-[18px] border border-[#E7EBF2] p-4 shadow-xs flex flex-col gap-2 cursor-pointer hover:border-[#1A4FBF] transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-[#E8F8F5] text-[#00B5A5] flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-[#0D1B3E]">Share with friends</h3>
            <p className="text-[11px] text-[#5F6B82] leading-tight">
              Give a friend 20 points and earn 20 too when they book.
            </p>
          </div>
        </div>

        {/* Section Header: Points history */}
        <div className="flex items-center justify-between mt-2">
          <h2 className="text-base font-bold text-[#0D1B3E]">Points history</h2>
          <span className="text-xs font-semibold text-[#5F6B82]">
            {bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'}
          </span>
        </div>

        {/* Points History Card */}
        <div className="bg-white rounded-[18px] border border-[#E7EBF2] divide-y divide-[#F0F5FB] shadow-xs overflow-hidden">
          {history.map((item) => (
            <div key={item.id} className="p-3.5 flex items-center justify-between">
              <div className="min-w-0 pr-3">
                <h3 className="text-xs font-bold text-[#0D1B3E] truncate">{item.title}</h3>
                <p className="text-[10px] text-[#5F6B82] mt-0.5">{item.date}</p>
              </div>
              <span className="text-xs font-bold text-[#10B981] whitespace-nowrap">
                {item.points}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

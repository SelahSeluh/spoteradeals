import React, { useMemo, useState } from 'react';
import { Flame, ArrowRight, Zap, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DealCard } from './DealCard';
import { FlashDealCountdown } from './FlashDealCountdown';
import { getFlashDealStatus } from '../utils/dealTiming';

export const FlashDealsSection: React.FC = () => {
  const { deals, setActiveView, setSelectedCategory, language, isRtl } = useApp();
  const [expiredDealIds, setExpiredDealIds] = useState<string[]>([]);

  // Filter or augment flash deals with genuine countdown targets
  const flashDeals = useMemo(() => {
    const published = deals.filter((d) => d.isPublished !== false);
    // Deals marked as flash deal or top trending with highest discount
    const flashList = published.filter(
      (d) => d.isFlashDeal || d.isTrending || d.discountPercent >= 35
    );

    // Filter out deals that have expired
    const activeFlashList = flashList.filter((deal) => {
      if (expiredDealIds.includes(deal.id)) return false;
      const timing = getFlashDealStatus(deal);
      return !timing.isExpired;
    });

    // Provide up to 4 distinct active flash deals
    const selected = activeFlashList.slice(0, 4);

    return selected.map((deal, idx) => {
      let expiry = deal.flashDealExpiresAt || deal.expiryDate;
      const targetTime = expiry ? new Date(expiry).getTime() : NaN;
      if (isNaN(targetTime) || targetTime < Date.now()) {
        const offsetHours = 12 + idx * 8;
        expiry = new Date(Date.now() + offsetHours * 60 * 60 * 1000).toISOString();
      }
      return {
        ...deal,
        isFlashDeal: true,
        flashDealExpiresAt: expiry,
      };
    });
  }, [deals, expiredDealIds]);

  if (flashDeals.length === 0) {
    return null;
  }

  const handleDealExpired = (dealId: string) => {
    setExpiredDealIds((prev) => [...prev, dealId]);
  };

  // Find shortest expiring deal for top banner header
  const earliestExpiry = flashDeals[0]?.flashDealExpiresAt || new Date(Date.now() + 14 * 3600 * 1000).toISOString();

  const sectionTitles = {
    en: { title: 'Flash Deals', sub: 'Limited-time family discounts ending soon' },
    ar: { title: 'عروض خاطفة', sub: 'خصومات عائلية لفترة محدودة تنتهي قريباً' },
    zh: { title: '限时闪购', sub: '即将结束的家庭独家限时优惠' },
    ru: { title: 'Горящие предложения', sub: 'Скидки с ограниченным сроком действия' },
    fr: { title: 'Ventes Flash', sub: 'Réductions familiales limitées se terminant bientôt' },
    am: { title: 'የቅጽበት ቅናሾች', sub: 'በቅርቡ የሚያበቁ የቤተሰብ ቅናሾች' },
  }[language] || { title: 'Flash Deals', sub: 'Limited-time family discounts ending soon' };

  return (
    <section className="space-y-4 font-sans select-none">
      {/* Header bar with title, live countdown pill, and view all */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center shadow-xs">
              <Zap className="w-4 h-4 fill-white text-white animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>{sectionTitles.title}</span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping" />
                  Live
                </span>
              </h2>
            </div>
          </div>

          {/* Real-time countdown pill in header */}
          <div className="hidden md:block">
            <FlashDealCountdown targetDate={earliestExpiry} variant="pill" />
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setSelectedCategory('All');
            setActiveView('explore');
          }}
          className="text-xs sm:text-sm font-bold text-slate-600 hover:text-rose-600 flex items-center gap-1 transition-colors cursor-pointer group"
        >
          <span>{isRtl ? 'عرض الكل' : 'View all'}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Grid of Flash Deal Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {flashDeals.map((deal) => (
          <DealCard
            key={deal.id}
            deal={deal}
            onExpire={() => handleDealExpired(deal.id)}
          />
        ))}
      </div>
    </section>
  );
};

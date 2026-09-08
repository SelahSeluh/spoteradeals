import React from 'react';
import { Sparkles, RefreshCw, Lightbulb, Compass, MapPin, Tag, ChevronRight, Gift } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Deal } from '../types';
import { getLocalizedTitle } from '../utils/i18nHelper';

interface DailySpotlightSectionProps {
  onClaimCoupon: (deal: Deal) => void;
  onBookNow: (deal: Deal) => void;
}

export const DailySpotlightSection: React.FC<DailySpotlightSectionProps> = ({
  onClaimCoupon,
}) => {
  const { dailySpotlight, refreshDailySpotlight, deals, setActiveView, setSelectedDealId, language } = useApp();

  const matchingDeals = deals
    .filter((d) => d.category === dailySpotlight.featuredCategory || d.isFeatured)
    .slice(0, 3);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-gradient-to-br from-[#07244C] via-[#0C5CAB] to-[#0A4580] rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-blue-400/20 relative overflow-hidden">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-[11px] font-black uppercase tracking-wider shadow-sm">
                <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                <span>AI Daily Family Spotlight</span>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-tight">
                {dailySpotlight.title}
              </h2>
              <p className="text-xs sm:text-sm text-blue-100/90 font-medium">
                {dailySpotlight.tagline}
              </p>
            </div>

            <button
              onClick={() => refreshDailySpotlight()}
              disabled={dailySpotlight.isLoading}
              className="self-start sm:self-center px-4 py-2 bg-white/15 hover:bg-white/25 active:scale-95 text-white rounded-2xl text-xs font-bold flex items-center gap-2 border border-white/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${dailySpotlight.isLoading ? 'animate-spin' : ''}`} />
              <span>{dailySpotlight.isLoading ? 'Curating Offers...' : 'Refresh AI Spotlight'}</span>
            </button>
          </div>

          {/* AI Family Pro-Tip Box */}
          {dailySpotlight.familyTip && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/15 flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-md">
                <Lightbulb className="w-5 h-5 fill-slate-950" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-extrabold text-amber-300 uppercase tracking-wide">
                  UAE Family Insider Tip
                </h4>
                <p className="text-xs sm:text-sm text-blue-50 leading-relaxed font-normal">
                  {dailySpotlight.familyTip}
                </p>
              </div>
            </div>
          )}

          {/* Spotlight Deals Mini-Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {matchingDeals.map((deal) => (
              <div
                key={deal.id}
                onClick={() => {
                  setSelectedDealId(deal.id);
                  setActiveView('deal-detail');
                }}
                className="bg-white text-slate-900 rounded-2xl p-3.5 flex gap-3 items-center hover:shadow-lg hover:scale-[1.01] transition-all cursor-pointer group border border-blue-100"
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-100 relative">
                  <img
                    src={deal.images[0]}
                    alt={deal.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute bottom-1 right-1 bg-emerald-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded">
                    -{deal.discountPercent}%
                  </span>
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <span className="text-[10px] font-extrabold text-[#0C5CAB] uppercase tracking-wider block truncate">
                    {deal.businessName}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-[#0C5CAB] transition-colors">
                    {getLocalizedTitle(deal, language)}
                  </h4>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-sm font-black text-slate-950">
                      AED {deal.discountPrice}
                    </span>
                    <span className="text-[10px] text-slate-400 line-through">
                      AED {deal.originalPrice}
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClaimCoupon(deal);
                  }}
                  className="p-2 rounded-xl bg-[#0C5CAB]/10 hover:bg-[#0C5CAB] text-[#0C5CAB] hover:text-white transition-all shrink-0"
                  title="Claim Digital Coupon"
                >
                  <Gift className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Footer Highlights */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-blue-100 border-t border-white/10 font-medium">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-amber-300" />
              <span>{dailySpotlight.savingsHighlight}</span>
            </div>
            <button
              onClick={() => setActiveView('explore')}
              className="text-white hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Explore all {dailySpotlight.featuredCategory} deals</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

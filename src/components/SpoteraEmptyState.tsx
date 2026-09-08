import React from 'react';
import {
  Heart,
  Ticket,
  Search,
  RotateCcw,
  Compass,
  Sparkles,
  ArrowRight,
  MapPin,
  Tag,
  Star,
  ChevronRight,
  Flame,
  CheckCircle2,
  SlidersHorizontal,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Category, Deal } from '../types';
import { DealCard } from './DealCard';

export interface SpoteraEmptyStateProps {
  type: 'favorites' | 'my-deals' | 'search-results' | 'notifications' | 'generic';
  title?: string;
  description?: string;
  searchQuery?: string;
  activeCategory?: string;
  activeCity?: string;
  onPrimaryAction?: () => void;
  primaryActionLabel?: string;
  onSecondaryAction?: () => void;
  secondaryActionLabel?: string;
  onCategorySelect?: (category: Category) => void;
  showSuggestions?: boolean;
  showTrendingDeals?: boolean;
  onClaimCoupon?: (deal: Deal) => void;
  onBookNow?: (deal: Deal) => void;
  className?: string;
}

export const SpoteraEmptyState: React.FC<SpoteraEmptyStateProps> = ({
  type,
  title,
  description,
  searchQuery,
  activeCategory,
  activeCity,
  onPrimaryAction,
  primaryActionLabel,
  onSecondaryAction,
  secondaryActionLabel,
  onCategorySelect,
  showSuggestions = true,
  showTrendingDeals = true,
  onClaimCoupon,
  onBookNow,
  className = '',
}) => {
  const { deals, setSelectedCategory, setSelectedCity, setActiveView, t } = useApp();

  // Pick default titles & descriptions based on type if not provided
  const getDefaultTitle = () => {
    switch (type) {
      case 'favorites':
        return t('emptyStateFavoritesTitle') || 'Your Saved Favorites is Empty';
      case 'my-deals':
        return t('emptyStateMyDealsTitle') || 'No Active Vouchers or Bookings';
      case 'search-results':
        return t('emptyStateSearchTitle') || 'No Matching Deals Found';
      case 'notifications':
        return 'No Notifications Yet';
      default:
        return 'Nothing to Display';
    }
  };

  const getDefaultDescription = () => {
    switch (type) {
      case 'favorites':
        return (
          t('emptyStateFavoritesDesc') ||
          'Tap the heart icon on any UAE deal to save it for later, track seasonal price drops, and plan memorable family outings.'
        );
      case 'my-deals':
        return (
          t('emptyStateMyDealsDesc') ||
          'When you claim a Buy 1 Get 1 voucher or book an attraction, your digital QR pass and confirmation code will appear here for instant venue check-in.'
        );
      case 'search-results':
        return (
          t('emptyStateSearchDesc') ||
          'We couldn’t find deals matching your exact search filters. Try adjusting your keywords, price range, or explore our handpicked categories below.'
        );
      case 'notifications':
        return 'You are all caught up! New offers, voucher expiry alerts, and cashback credits will appear right here.';
      default:
        return 'Explore our curated verified UAE family experiences and offers.';
    }
  };

  const displayTitle = title || getDefaultTitle();
  const displayDesc = description || getDefaultDescription();

  // Suggested popular categories for quick navigation
  const suggestedCategories: { name: Category; icon: string; tag: string }[] = [
    { name: 'Kids Play Areas', icon: '🏰', tag: 'Top Indoor' },
    { name: 'Attractions', icon: '🎢', tag: 'Waterparks & Rides' },
    { name: 'Restaurants', icon: '🍽️', tag: 'Buy 1 Get 1' },
    { name: 'Hotels', icon: '🏖️', tag: 'Staycations' },
    { name: 'Birthday Parties', icon: '🎂', tag: 'VIP Packages' },
    { name: 'Workshops', icon: '🎨', tag: 'STEAM & Crafts' },
  ];

  // Pick top 3 trending deals from global state to guarantee the page never feels bare
  const trendingDeals = deals
    .filter((d) => d.rating >= 4.7 || d.discountPercent >= 40)
    .slice(0, 3);

  const handleCategoryClick = (cat: Category) => {
    if (onCategorySelect) {
      onCategorySelect(cat);
    } else {
      setSelectedCategory(cat);
      setActiveView('explore');
    }
  };

  const handleDefaultPrimaryAction = () => {
    if (onPrimaryAction) {
      onPrimaryAction();
    } else {
      setSelectedCategory('All');
      setSelectedCity('All');
      setActiveView('explore');
    }
  };

  return (
    <div className={`space-y-8 font-sans ${className}`}>
      {/* 1. MAIN HERO SPOTERA BLUE & WHITE EMPTY STATE CARD */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#F0F7FF] via-white to-[#F8FAFC] rounded-3xl border border-[#D3E5FB] p-6 sm:p-10 text-center shadow-[0_4px_25px_rgba(29,111,224,0.06)]">
        {/* Soft Decorative Ambient Background Glows */}
        <div className="absolute top-0 right-1/4 -mt-10 w-56 h-56 bg-[#1D6FE0]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-10 w-56 h-56 bg-[#0B3D75]/5 rounded-full blur-3xl pointer-events-none" />
        
        {/* Clean solid surface backdrop */}

        <div className="relative z-10 max-w-xl mx-auto space-y-5">
          {/* ========================================================================= */}
          {/* MULTI-LAYERED SPOTERA ICON MEDALLION */}
          {/* ========================================================================= */}
          <div className="relative inline-flex items-center justify-center">
            {/* Outer Glowing Halo Ring */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-[#1D6FE0]/20 via-[#4293FF]/15 to-[#0B3D75]/10 p-1.5 flex items-center justify-center shadow-inner animate-pulse">
              {/* Inner White Medallion */}
              <div className="w-full h-full bg-white rounded-2xl border border-[#1D6FE0]/20 shadow-[0_10px_25px_rgba(29,111,224,0.18)] flex items-center justify-center relative overflow-hidden group">
                {/* Subtle Inner Gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent" />

                {/* Specific Vector Visuals */}
                {type === 'favorites' && (
                  <div className="relative flex items-center justify-center">
                    <Heart className="w-10 h-10 sm:w-12 sm:h-12 text-[#FF6A55] fill-[#FF6A55]/20 stroke-[2.2px] drop-shadow-xs" />
                    <Sparkles className="w-4 h-4 text-amber-400 absolute -top-2 -right-2 animate-bounce" />
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400 absolute -bottom-1 -left-2" />
                  </div>
                )}

                {type === 'my-deals' && (
                  <div className="relative flex items-center justify-center">
                    <Ticket className="w-10 h-10 sm:w-12 sm:h-12 text-[#1D6FE0] stroke-[2.2px] -rotate-6 drop-shadow-xs" />
                    <div className="absolute -bottom-1 -right-2 px-1.5 py-0.5 rounded-md bg-[#1FAE7B] text-white text-[9px] font-black shadow-xs">
                      1+1
                    </div>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 absolute -top-2 -left-1" />
                  </div>
                )}

                {type === 'search-results' && (
                  <div className="relative flex items-center justify-center">
                    <Search className="w-10 h-10 sm:w-12 sm:h-12 text-[#1D6FE0] stroke-[2.2px] drop-shadow-xs" />
                    <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full ring-2 ring-white flex items-center justify-center text-[8px] font-black text-slate-950">
                      !
                    </div>
                    <Compass className="w-4 h-4 text-indigo-500 absolute -bottom-2 -left-2 animate-spin [animation-duration:8s]" />
                  </div>
                )}

                {type === 'notifications' && (
                  <div className="relative flex items-center justify-center">
                    <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-[#1D6FE0] stroke-[2.2px]" />
                  </div>
                )}

                {type === 'generic' && (
                  <div className="relative flex items-center justify-center">
                    <Compass className="w-10 h-10 sm:w-12 sm:h-12 text-[#1D6FE0] stroke-[2.2px]" />
                  </div>
                )}
              </div>
            </div>

            {/* Floating Mini Decorative Chips */}
            <div className="absolute -top-2 -right-3 bg-white px-2.5 py-1 rounded-full text-[10px] font-extrabold text-[#1D6FE0] border border-[#1D6FE0]/20 shadow-md flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#1D6FE0]" />
              <span>SpoteraDeals</span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* TITLE & DESCRIPTION WITH HIGH-CONTRAST TYPOGRAPHY */}
          {/* ========================================================================= */}
          <div className="space-y-2.5">
            <h3 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight font-sans">
              {displayTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-md mx-auto">
              {displayDesc}
            </p>
          </div>

          {/* Active Filter Indicators (For Search Results) */}
          {(searchQuery || (activeCategory && activeCategory !== 'All') || (activeCity && activeCity !== 'All')) && (
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              {searchQuery && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-blue-200 text-xs font-bold text-slate-800 rounded-full shadow-2xs">
                  <Search className="w-3 h-3 text-[#1D6FE0]" />
                  <span>Keyword: "{searchQuery}"</span>
                </span>
              )}
              {activeCategory && activeCategory !== 'All' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-blue-200 text-xs font-bold text-slate-800 rounded-full shadow-2xs">
                  <Tag className="w-3 h-3 text-[#1D6FE0]" />
                  <span>Category: {activeCategory}</span>
                </span>
              )}
              {activeCity && activeCity !== 'All' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-blue-200 text-xs font-bold text-slate-800 rounded-full shadow-2xs">
                  <MapPin className="w-3 h-3 text-[#1D6FE0]" />
                  <span>City: {activeCity}</span>
                </span>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* ACTION BUTTONS (PRIMARY & SECONDARY) */}
          {/* ========================================================================= */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <button
              onClick={handleDefaultPrimaryAction}
              className="px-6 py-3 bg-gradient-to-r from-[#1D6FE0] to-[#0B3D75] hover:from-[#155fc7] hover:to-[#082e5b] text-white rounded-2xl text-xs sm:text-sm font-extrabold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Compass className="w-4 h-4" />
              <span>{primaryActionLabel || t('emptyStateBrowseDeals') || 'Explore Top UAE Deals'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {onSecondaryAction && secondaryActionLabel ? (
              <button
                onClick={onSecondaryAction}
                className="px-5 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-2xl text-xs sm:text-sm font-bold shadow-2xs transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>{secondaryActionLabel}</span>
              </button>
            ) : type === 'search-results' ? (
              <button
                onClick={handleDefaultPrimaryAction}
                className="px-5 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-2xl text-xs sm:text-sm font-bold shadow-2xs transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#1D6FE0]" />
                <span>{t('emptyStateResetFilters') || 'Reset Filters'}</span>
              </button>
            ) : null}
          </div>

          {/* Guaranteed Benefits Trust Markers */}
          <div className="pt-4 border-t border-blue-100/80 grid grid-cols-3 gap-2 text-[11px] font-bold text-slate-500">
            <div className="flex items-center justify-center gap-1.5 text-slate-600">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#1FAE7B] shrink-0" />
              <span className="truncate">Instant Digital Passes</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 text-slate-600">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#1FAE7B] shrink-0" />
              <span className="truncate">100% Verified Partners</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 text-slate-600">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#1FAE7B] shrink-0" />
              <span className="truncate">0 Booking Fees</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SUGGESTED QUICK CATEGORY PILLS */}
      {showSuggestions && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 space-y-3.5 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-blue-50 text-[#1D6FE0] flex items-center justify-center">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
              <h4 className="text-xs sm:text-sm font-black text-slate-900 font-sans tracking-tight">
                {t('emptyStateQuickCategories') || 'Quick Browse by Category'}
              </h4>
            </div>
            <button
              onClick={() => setActiveView('categories')}
              className="text-[11px] font-extrabold text-[#1D6FE0] hover:underline flex items-center gap-1"
            >
              <span>{t('seeAll') || 'View All Categories'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Category Chips Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
            {suggestedCategories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => handleCategoryClick(cat.name)}
                className="p-3 bg-slate-50/90 hover:bg-blue-50/90 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all text-left group flex flex-col justify-between space-y-1.5 cursor-pointer shadow-2xs hover:shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl group-hover:scale-110 transition-transform">
                    {cat.icon}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#1D6FE0] group-hover:translate-x-0.5 transition-all" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-800 group-hover:text-[#1D6FE0] transition-colors leading-tight font-sans truncate">
                    {cat.name}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium truncate">
                    {cat.tag}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. TRENDING OFFERS CAROUSEL / MINI GRID (PREVENTS ANY PAGE FROM LOOKING BARE) */}
      {showTrendingDeals && trendingDeals.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-black text-slate-900 font-sans tracking-tight">
                  {t('emptyStateTrendingUAE') || 'Trending Offers Across UAE'}
                </h4>
                <p className="text-[11px] text-slate-500 font-medium">
                  Verified customer favorites with instant Buy 1 Get 1 and discounts
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveView('explore')}
              className="text-xs font-extrabold text-[#1D6FE0] hover:underline flex items-center gap-1"
            >
              <span>{t('viewAll') || 'View All Deals'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {trendingDeals.map((deal) => (
              <DealCard
                key={deal.id}
                deal={deal}
                onClaimCoupon={onClaimCoupon || (() => {})}
                onBookNow={onBookNow || (() => {})}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

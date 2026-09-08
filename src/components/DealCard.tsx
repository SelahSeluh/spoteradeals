import React, { useState } from 'react';
import { Star, Heart, MapPin, Users, Link2 } from 'lucide-react';
import { Deal } from '../types';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { getLocalizedTitle } from '../utils/i18nHelper';

interface DealCardProps {
  deal: Deal;
  compact?: boolean;
  saved?: boolean;
  onPress?: () => void;
  onToggleFavorite?: () => void;
  onClaimCoupon?: (deal: Deal) => void;
  onBookNow?: (deal: Deal) => void;
  className?: string;
}

export const DealCard: React.FC<DealCardProps> = ({
  deal,
  compact = false,
  saved,
  onPress,
  onToggleFavorite,
  className = '',
}) => {
  const { user, toggleFavoriteDeal, setSelectedDealId, setActiveView, language, isRtl } = useApp();
  const { showToast } = useToast();
  const [isPopping, setIsPopping] = useState(false);

  const isFavorite =
    saved !== undefined ? saved : user.savedDealIds ? user.savedDealIds.includes(deal.id) : false;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPopping(true);
    setTimeout(() => setIsPopping(false), 420);

    if (onToggleFavorite) {
      onToggleFavorite();
    } else {
      toggleFavoriteDeal(deal.id);
      if (!isFavorite) {
        showToast.success(isRtl ? 'تمت الإضافة إلى المفضلة' : 'Saved to your favorites');
      } else {
        showToast.info(isRtl ? 'تمت الإزالة من المفضلة' : 'Removed from favorites');
      }
    }
  };

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const dealUrl = `${window.location.origin}${window.location.pathname}#deal/${deal.id}`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(dealUrl);
      } else {
        const input = document.createElement('input');
        input.value = dealUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      showToast.success(isRtl ? 'تم نسخ الرابط!' : 'Link copied!');
    } catch {
      showToast.error('Could not copy link');
    }
  };

  const handleCardClick = () => {
    if (onPress) {
      onPress();
    } else {
      setSelectedDealId(deal.id);
      setActiveView('deal-detail');
    }
  };

  const displayTitle = getLocalizedTitle(deal, language);

  const dealImage =
    (deal.images && deal.images[0]) ||
    deal.imageUrl ||
    'https://images.unsplash.com/photo-1511882150382-421056c89033?auto=format&fit=crop&q=80&w=800';

  const locationText = deal.district
    ? `${deal.district}, ${deal.city}`
    : deal.city || deal.location || 'Dubai';

  const ageText = deal.ageRange || (deal as any).ageGroup || 'Ages 2+';

  return (
    <div
      onClick={handleCardClick}
      className={`group bg-white rounded-2xl border border-[#E7EBF2] hover:border-[#0D9CFD]/40 shadow-[0_2px_10px_rgba(13,27,62,0.05)] hover:shadow-[0_6px_20px_rgba(13,27,62,0.09)] transition-all duration-200 flex flex-col font-sans select-none cursor-pointer overflow-hidden relative ${
        compact ? 'w-[230px] sm:w-[245px] shrink-0' : 'w-full'
      } ${className}`}
    >
      {/* 1. IMAGE CONTAINER WITH OPTIMAL NATURAL ASPECT RATIO */}
      <div
        className={`relative ${
          compact ? 'h-[135px] sm:h-[145px]' : 'h-[160px] sm:h-[190px]'
        } overflow-hidden bg-[#EBF3FB]`}
      >
        <img
          src={dealImage}
          alt={deal.title}
          referrerPolicy="no-referrer"
          onError={(e) => {
            const target = e.currentTarget;
            if (!target.src.includes('photo-1511882150382')) {
              target.src =
                'https://images.unsplash.com/photo-1511882150382-421056c89033?auto=format&fit=crop&q=80&w=800';
            }
          }}
          className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300 ease-out"
          loading="lazy"
        />

        {/* Top-Left: Discount Badge in Brand Orange + Availability */}
        <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5 flex-wrap">
          <span className="bg-[#F5820A] text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs tracking-tight">
            {deal.discountPercent}% OFF
          </span>

          {deal.availability === 'limited' && (
            <span className="bg-amber-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-xs tracking-tight uppercase">
              Limited
            </span>
          )}
          {deal.availability === 'fully-booked' && (
            <span className="bg-rose-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-xs tracking-tight uppercase">
              Booked
            </span>
          )}
          {deal.availability === 'not-available' && (
            <span className="bg-slate-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-xs tracking-tight uppercase">
              Unavailable
            </span>
          )}
          {(deal.availability === 'available' || !deal.availability) && (
            <span className="bg-emerald-600/95 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs tracking-tight flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-white" />
              Available
            </span>
          )}
          {deal.isFeatured && (
            <span className="bg-[#0C5CAB] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs tracking-tight hidden sm:inline-block">
              FEATURED
            </span>
          )}
        </div>

        {/* Top-Right: Quick Actions (Copy Link & Wishlist Heart) */}
        <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleCopyLink}
            className="w-8 h-8 rounded-full bg-white/90 hover:bg-white backdrop-blur-xs flex items-center justify-center shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer text-slate-700 hover:text-[#0D9CFD]"
            title={isRtl ? 'نسخ الرابط' : 'Copy Link'}
            aria-label={isRtl ? 'نسخ الرابط' : 'Copy Link'}
          >
            <Link2 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleFavoriteClick}
            className={`w-8 h-8 rounded-full bg-white/90 hover:bg-white backdrop-blur-xs flex items-center justify-center shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer ${
              isPopping ? 'animate-heart-pop' : ''
            }`}
            title={isRtl ? 'حفظ العرض' : 'Save Deal'}
            aria-label={isRtl ? 'حفظ العرض' : 'Save Deal'}
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isFavorite
                  ? 'text-rose-500 fill-rose-500 scale-110'
                  : 'text-[#0D1B3E] hover:text-rose-500'
              }`}
            />
          </button>
        </div>

        {/* Bottom tags on image (Category & Age Pill) */}
        <div className="absolute bottom-2 left-2.5 right-2.5 z-10 flex items-center justify-between text-[10px] font-semibold text-white pointer-events-none">
          <span className="bg-black/55 backdrop-blur-xs px-2 py-0.5 rounded-md truncate max-w-[130px]">
            {deal.category}
          </span>
          <span className="bg-black/55 backdrop-blur-xs px-2 py-0.5 rounded-md shrink-0 flex items-center gap-1">
            <Users className="w-2.5 h-2.5" />
            <span>{ageText}</span>
          </span>
        </div>
      </div>

      {/* 2. BODY CONTENT */}
      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
        <div>
          {/* Title (max 2 lines, bold, readable) */}
          <h3 className="text-[14px] font-bold text-[#0D1B3E] leading-snug line-clamp-2 group-hover:text-[#0C5CAB] transition-colors">
            {displayTitle}
          </h3>

          {/* Location Indicator */}
          <div className="flex items-center gap-1 text-[11.5px] text-[#5F6B82] mt-1 line-clamp-1">
            <MapPin className="w-3 h-3 text-[#0D9CFD] shrink-0" />
            <span className="truncate">{locationText}</span>
          </div>
        </div>

        {/* 3. PRICE & RATING ROW */}
        <div className="flex items-center justify-between pt-2 border-t border-[#F0F4F8]">
          {/* Price with clear 'From' label and struck-through original */}
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-[#8D98AA] leading-none">From</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-[15px] font-black text-[#0C5CAB] leading-none">
                AED {deal.discountPrice}
              </span>
              {deal.originalPrice > deal.discountPrice && (
                <span className="text-[11px] text-[#8D98AA] line-through font-normal">
                  AED {deal.originalPrice}
                </span>
              )}
            </div>
          </div>

          {/* Star Rating with Review Count */}
          <div className="flex items-center gap-1 bg-[#FFF9F0] border border-[#FFE7C2] px-2 py-1 rounded-lg">
            <Star className="w-3 h-3 fill-[#F5820A] text-[#F5820A]" />
            <span className="text-[11.5px] font-bold text-[#0D1B3E] leading-none">
              {deal.rating || 4.8}
            </span>
            <span className="text-[10px] text-[#8D98AA] font-medium leading-none">
              ({deal.reviewCount || 34})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

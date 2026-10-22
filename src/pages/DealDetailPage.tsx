import {PublicBusinessProfile} from '../components/BusinessOperations';
import React, { useState, useMemo, useEffect } from 'react';
import {
  ChevronLeft,
  Share2,
  Heart,
  Star,
  CheckCircle2,
  Users,
  Package,
  Waves,
  Ticket,
  Clock,
  MapPin,
  ChevronRight,
  ShieldCheck,
  Calendar,
  X,
  Plus,
  Minus,
  Link2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { Deal } from '../types';
import { getLocalizedTitle, getLocalizedDescription } from '../utils/i18nHelper';
import { FlashDealCountdown } from '../components/FlashDealCountdown';
import { getFlashDealStatus, validateDealBooking } from '../utils/dealTiming';

interface DealDetailPageProps {
  onClaimCoupon: (deal: Deal) => void;
  onBookNow: (deal: Deal) => void;
}

export const DealDetailPage: React.FC<DealDetailPageProps> = ({ onClaimCoupon, onBookNow }) => {
  const {
    deals,
    selectedDealId,
    setSelectedDealId,
    setActiveView,
    goBack,
    user,
    toggleFavoriteDeal,
    createBooking,
    setSelectedBookingId,
    requireUserAuth,
    language,
    isRtl,
    t,
  } = useApp();
  const { showToast } = useToast();

  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDate, setBookingDate] = useState(() => new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Dubai',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date()));
  const [bookingTime, setBookingTime] = useState('11:00');
  const [guestsCount, setGuestsCount] = useState(2);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPopping, setIsPopping] = useState(false);
  const [hasExpiredLive, setHasExpiredLive] = useState(false);

  // Parse active deal (respects selectedDealId, query params, hash, and route paths)
  const deal = useMemo(() => {
    // 1. Try selectedDealId from context
    if (selectedDealId) {
      const found = deals.find(
        (d) => d.id === selectedDealId || d.id.toLowerCase() === selectedDealId.toLowerCase()
      );
      if (found) return found;
    }

    // 2. Try URL search params (?deal=, ?id=, ?dealId=)
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const queryId = urlParams.get('deal') || urlParams.get('dealId') || urlParams.get('id');
      if (queryId) {
        const found = deals.find(
          (d) => d.id === queryId || d.id.toLowerCase() === queryId.toLowerCase()
        );
        if (found) return found;
      }
    } catch (_) {}

    // 3. Try Hash (#deal/..., #/deal/..., #deal-detail?id=...)
    try {
      const hash = window.location.hash.replace(/^[#\/]+/, '').trim();
      let extractedId = '';
      if (hash.toLowerCase().startsWith('deal/')) {
        extractedId = hash.replace(/^deal\//i, '').split('?')[0].split('&')[0];
      } else if (hash.includes('id=')) {
        extractedId = hash.split('id=')[1]?.split('&')[0];
      } else if (hash.toLowerCase().startsWith('deal-detail/')) {
        extractedId = hash.replace(/^deal-detail\//i, '').split('?')[0];
      }
      if (extractedId) {
        const found = deals.find(
          (d) => d.id === extractedId || d.id.toLowerCase() === extractedId.toLowerCase()
        );
        if (found) return found;
      }
    } catch (_) {}

    // 4. Try Pathname (/deal/:id or /deals/:id)
    try {
      const path = window.location.pathname.replace(/^\/+/, '').trim();
      if (path.toLowerCase().startsWith('deal/')) {
        const pId = path.replace(/^deal\//i, '').split('/')[0];
        const found = deals.find(
          (d) => d.id === pId || d.id.toLowerCase() === pId.toLowerCase()
        );
        if (found) return found;
      }
    } catch (_) {}

    // Fallback: AquaPlay or first active deal
    return (
      deals.find((d) => d.id === 'deal_aquaplay') ||
      deals.find((d) => d.title.toLowerCase().includes('aquaplay')) ||
      deals[0]
    );
  }, [selectedDealId, deals]);

  useEffect(() => {
    if (deal && selectedDealId !== deal.id) {
      setSelectedDealId(deal.id);
    }
  }, [deal?.id, selectedDealId, setSelectedDealId]);

  const images = deal?.images && deal.images.length > 0 ? deal.images : deal?.imageUrl?[deal.imageUrl]:[
    'https://images.unsplash.com/photo-1566454544259-f4b94c96a464?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=800',
  ];

  const isSaved = user.savedDealIds?.includes(deal?.id || '');

  const handleFavoriteClick = () => {
    if (!deal) return;
    requireUserAuth('Sign in or register to save deals to your favorites.', () => {
      setIsPopping(true);
      setTimeout(() => setIsPopping(false), 420);
      toggleFavoriteDeal(deal.id);
      if (!isSaved) {
        showToast.success(t('toastAddedFavorite'));
      } else {
        showToast.info(t('toastRemovedFavorite'));
      }
    });
  };

  const handleCopyLink = async () => {
    if (!deal) return;
    const dealUrl = `${window.location.origin}/#deal/${deal.id}`;
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
      showToast.success(t('toastInfoCopied'));
    } catch {
      showToast.error(t('errorGeneric'));
    }
  };

  const handleShare = async () => {
    if (!deal) return;
    const dealUrl = `${window.location.origin}/#deal/${deal.id}`;
    const shareData = {
      title: getLocalizedTitle(deal, language),
      text: `${getLocalizedTitle(deal, language)} on SpoteraDeals for AED ${deal.discountPrice}!`,
      url: dealUrl,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // cancelled
      }
    } else {
      handleCopyLink();
    }
  };

  const dealTiming = useMemo(() => {
    if (!deal) return null;
    return getFlashDealStatus(deal);
  }, [deal]);

  const isDealExpired = hasExpiredLive || (dealTiming ? dealTiming.isExpired : false);
  const isDealUpcoming = dealTiming ? dealTiming.isUpcoming : false;

  const [showBusiness,setShowBusiness]=useState(false);
  const handleConfirmBooking = async () => {
    if (!deal||isProcessing) return;

    // Strict validation: Reject expired or not-started deals
    const validation = validateDealBooking(deal);
    if (!validation.allowed || isDealExpired) {
      showToast.error(
        validation.message || t('offerExpiredNonRedeemable')
      );
      setShowBookingModal(false);
      return;
    }

    setIsProcessing(true);

    try {
      const newBooking=await createBooking(deal,bookingDate,bookingTime,guestsCount,deal.title,deal.discountPrice*(deal.priceMode==='guest'?guestsCount:1));
      setSelectedBookingId(newBooking.id);setShowBookingModal(false);window.scrollTo({top:0});setActiveView('booking-confirm');
    } catch(error){showToast.error(error instanceof Error?error.message:'Booking failed.');} finally{setIsProcessing(false);}

  };

  if (!deal) {
    return (
      <div className="paper-experience min-h-screen bg-[#F7FAFD] flex flex-col items-center justify-center p-6 text-center font-sans">
        <h2 className="text-base font-bold text-[#0D1B3E]">{t('emptyNoDealsFound')}</h2>
        <button
          onClick={() => setActiveView('home')}
          className="mt-4 px-5 py-2.5 rounded-full bg-[#1060E2] text-white text-xs font-bold"
        >
          {t('backToHome')}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7FAFD] text-[#0D1B3E] font-sans pb-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-6">
        {/* 1. TOP NAV BAR: Back chevron, "Deal Details", Share & Wishlist */}
        <div className="flex items-center justify-between pt-1 pb-4">
          <button
            onClick={() => goBack()}
            aria-label="Back"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-[#E8EEF5] flex items-center justify-center text-[#0D1B3E] shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.4px] rtl:rotate-180" />
          </button>

          <h1 className="text-base sm:text-lg font-bold text-[#0D1B3E] tracking-tight">
            {t('dealDetails')}
          </h1>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              title={t('copyLink')}
              aria-label={t('copyLink')}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-[#E8EEF5] flex items-center justify-center text-[#0D1B3E] shadow-2xs hover:text-[#0D9CFD] hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Link2 className="w-4 h-4 stroke-[2.2px]" />
            </button>

            <button
              onClick={handleShare}
              title={t('share')}
              aria-label={t('share')}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-[#E8EEF5] flex items-center justify-center text-[#0D1B3E] shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4 stroke-[2.2px]" />
            </button>

            <button
              onClick={handleFavoriteClick}
              title={t('favorite')}
              aria-label={t('favorite')}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-[#E8EEF5] flex items-center justify-center text-[#0D1B3E] shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer ${
                isPopping ? 'animate-heart-pop' : ''
              }`}
            >
              <Heart
                className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${
                  isSaved ? 'fill-[#EF4444] text-[#EF4444] scale-110' : 'text-[#0D1B3E] hover:text-rose-500'
                }`}
              />
            </button>
          </div>
        </div>

        {/* 2-COLUMN GRID ON DESKTOP */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-start">
          {/* LEFT COLUMN: Media & Information */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            <button className="text-blue-700 underline font-bold" onClick={()=>setShowBusiness(true)}>View {deal.businessName} profile & all offers</button>
            {showBusiness&&<PublicBusinessProfile businessId={deal.businessId} onClose={()=>setShowBusiness(false)}/>}
            {/* 2. IMAGE CAROUSEL: Kids on yellow inflatable water raft */}
            <div className="space-y-2">
              <div className="relative aspect-[16/10] rounded-3xl overflow-hidden bg-slate-100 shadow-xs">
                {deal.videoUrl ? <video src={deal.videoUrl} poster={images[0]} className="w-full h-full object-cover" controls playsInline preload="metadata" /> : <img
                  src={images[activeImgIndex]}
                  alt={getLocalizedTitle(deal, language)}
                  className="w-full h-full object-cover"
                />}
                {deal.availability && (
                  <span className={`absolute top-4 ${isRtl ? 'right-4' : 'left-4'} px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-xs ${
                    deal.availability === 'available'
                      ? 'bg-[#10B981]/90 text-white'
                      : deal.availability === 'limited'
                      ? 'bg-[#F59E0B]/90 text-white'
                      : 'bg-slate-800/90 text-white'
                  }`}>
                    {deal.availability === 'limited' ? t('limitedAvailability') : deal.availability === 'fully-booked' ? t('dealExpired') : t('instantConfirmation')}
                  </span>
                )}
              </div>

              {/* Carousel Pagination Indicator Dots */}
              <div className="flex items-center justify-center gap-1.5 pt-1">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImgIndex(idx)}
                    className={`h-1.5 transition-all rounded-full cursor-pointer ${
                      activeImgIndex === idx ? 'w-5 bg-[#1060E2]' : 'w-1.5 bg-slate-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Real-time Flash Deal Countdown Banner */}
            {(deal.isFlashDeal || deal.flashDealExpiresAt || deal.expiryDate) && (
              <FlashDealCountdown
                targetDate={deal.flashDealExpiresAt || deal.expiryDate}
                variant="banner"
                onExpire={() => setHasExpiredLive(true)}
              />
            )}

            {/* 3. DEAL TITLE & PRICING HEADER */}
            <div className="space-y-2 pt-1">
              <h2 className="text-lg sm:text-2xl font-bold text-[#0D1B3E] leading-snug tracking-tight">
                {getLocalizedTitle(deal, language)}
              </h2>

              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-semibold text-[#5F6B82]">
                <span>{deal.businessName || 'AquaPlay Waterpark'}</span>
                <span>·</span>
                <span>{deal.district || deal.city || 'Dubai Marina'}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1060E2] fill-[#1060E2]/15 ml-0.5" />
              </div>

              <div className="flex items-center gap-2 text-xs sm:text-sm text-[#5F6B82] font-semibold pt-0.5">
                <div className="flex items-center gap-1 text-[#F59E0B] font-bold">
                  <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                  <span>4.8</span>
                </div>
                <span>({deal.reviewCount || 412} {t('verifiedReviews')})</span>
              </div>

              <div className="flex items-center gap-2.5 pt-1">
                <span className="text-sm sm:text-base text-slate-400 line-through">
                  AED {deal.originalPrice || 160}
                </span>
                <span className="text-xl sm:text-2xl font-black text-[#F5820A]">
                  AED {deal.discountPrice * (deal.priceMode==='guest'?guestsCount:1)}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#FFF3E8] text-[#F5820A] border border-[#F5820A]/30 text-xs font-bold">
                  {t('save')} {deal.discountPercent || 38}%
                </span>
              </div>
            </div>

            {/* 4. WHAT'S INCLUDED CARD */}
            <div className="bg-white rounded-2xl border border-[#E8EEF5] p-4 sm:p-5 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold tracking-tight uppercase text-slate-400">
                {t('whatsIncluded')}
              </h3>

              <p className="text-sm leading-relaxed whitespace-pre-line">{getLocalizedDescription(deal,language)}</p>
              {deal.terms?.length ? <ul className="space-y-2 text-xs">{deal.terms.map((term,index)=><li key={index} className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 shrink-0"/>{term}</li>)}</ul> : null}
            </div>

            {/* 5. KEY INFO ROWS */}
            <div className="bg-white rounded-2xl border border-[#E8EEF5] p-4 sm:p-5 shadow-2xs space-y-3">
              {/* Row 1: Hours */}
              <div className="flex items-center justify-between text-xs sm:text-sm font-medium text-[#0D1B3E]">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#F0F6FE] text-[#1060E2] flex items-center justify-center shrink-0">
                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <span>{deal.openingHours || 'Contact the venue for opening hours'}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 rtl:rotate-180" />
              </div>

              {/* Row 2: Age group */}
              <div className="flex items-center justify-between text-xs sm:text-sm font-medium text-[#0D1B3E]">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#F0F6FE] text-[#1060E2] flex items-center justify-center shrink-0">
                    <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <span>{deal.targetAgeGroup || deal.ageRange || 'See the venue’s age policy'}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 rtl:rotate-180" />
              </div>

              {/* Row 3: Location & Distance */}
              <div className="flex items-center justify-between text-xs sm:text-sm font-medium text-[#0D1B3E]">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#F0F6FE] text-[#1060E2] flex items-center justify-center shrink-0">
                    <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <span>{deal.location || [deal.district,deal.city].filter(Boolean).join(', ')}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 rtl:rotate-180" />
              </div>
            </div>

            {/* 6. INTERACTIVE MINI MAP PREVIEW */}
            <div className="rounded-2xl overflow-hidden border border-[#E8EEF5] bg-white shadow-2xs">
              <div className="relative h-32 sm:h-40 w-full bg-[#E5EEF8] overflow-hidden flex items-center justify-center">
                {/* Subtle stylized vector map roads / grid */}
                <div className="absolute inset-0 opacity-20">
                  <div className="w-full h-full bg-[radial-gradient(#1060E2_1px,transparent_1px)] [background-size:16px_16px]" />
                </div>

                {/* Waterfront line simulating Dubai Marina Walk */}
                <div className="absolute top-1/2 left-0 right-0 h-5 bg-[#C2DCF7] -rotate-3" />

                {/* Map Pin Marker */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-9 h-9 rounded-full bg-[#1060E2] text-white flex items-center justify-center shadow-md animate-bounce">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span className="mt-1 px-2.5 py-0.5 rounded-md bg-white/95 text-[11px] font-bold text-[#0D1B3E] shadow-2xs border border-slate-200">
                    {deal.location || [deal.district,deal.city].filter(Boolean).join(', ')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Desktop Sticky Booking Widget (Visible on Desktop) */}
          <div className="hidden lg:block lg:col-span-5 sticky top-20">
            <div className="bg-white rounded-3xl border border-[#E8EEF5] p-6 shadow-sm space-y-5">
              <div className="flex items-baseline justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">{t('specialPassRate')}</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-black text-[#0D1B3E]">AED {deal.discountPrice * (deal.priceMode==='guest'?guestsCount:1)}</span>
                    <span className="text-sm text-slate-400 line-through">AED {deal.originalPrice || 160}</span>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#FFF3E8] text-[#F5820A] text-xs font-black border border-[#F5820A]/30">
                  {t('save')} {deal.discountPercent || 38}%
                </span>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">{t('selectDate')}</label>
                  <input
                    type="date"
                    min={new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Dubai',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())}
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 font-semibold focus:outline-none focus:border-[#1060E2]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">{t('selectTime')}</label>
                  <select
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 font-semibold focus:outline-none focus:border-[#1060E2]"
                  >
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="14:00">02:00 PM</option>
                    <option value="16:00">04:00 PM</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">{t('guestsCount')}</label>
                  <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-800">{guestsCount}</span>
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        disabled={guestsCount <= 1}
                        onClick={() => setGuestsCount((c) => Math.max(1, c - 1))}
                        className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center disabled:opacity-40 cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-bold text-sm">{guestsCount}</span>
                      <button
                        type="button"
                        disabled={guestsCount >= 6}
                        onClick={() => setGuestsCount((c) => c + 1)}
                        className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center disabled:opacity-40 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">{t('subtotal')}</span>
                    <span className="font-bold text-slate-700">AED {deal.discountPrice * (deal.priceMode==='guest'?guestsCount:1)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">{t('vatIncluded')}</span>
                    <span className="text-slate-500 font-medium">{t('included') || '5%'}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-sm">
                    <span className="font-bold text-[#0D1B3E]">{t('totalDue')}</span>
                    <span className="font-black text-xl text-[#F5820A]">AED {deal.discountPrice * (deal.priceMode==='guest'?guestsCount:1)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  requireUserAuth(t('signInToBook') || 'Sign in or register to book your tickets.', () => {
                    handleConfirmBooking();
                  });
                }}
                disabled={isProcessing || isDealExpired || isDealUpcoming}
                className={`w-full py-4 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                  isDealExpired
                    ? 'bg-slate-200 text-slate-500 cursor-not-allowed shadow-none'
                    : isDealUpcoming
                    ? 'bg-amber-100 text-amber-800 cursor-not-allowed shadow-none'
                    : 'bg-[#1060E2] text-white shadow-[#1060E2]/25 hover:bg-[#0C4EBD] cursor-pointer'
                }`}
              >
                {isProcessing
                  ? t('issuingTicket')
                  : isDealExpired
                  ? t('dealExpired')
                  : isDealUpcoming
                  ? t('offerStartsSoon')
                  : `${t('bookNow')} — AED ${deal.discountPrice * (deal.priceMode==='guest'?guestsCount:1)}`}
              </button>

              <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 font-medium pt-1">
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#1060E2]" />
                  <span>{t('instantDigitalPass')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>{t('freeCancellation')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 7. STICKY BOTTOM BAR (MOBILE/TABLET): AED 99 Total Price + Book Now Button */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E8EEF5] px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom,12px))] shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
        <div className="max-w-md mx-auto flex items-center justify-between gap-4">
          <div>
            <div className="text-xl font-black text-[#0D1B3E] tracking-tight">
              AED {deal.discountPrice * (deal.priceMode==='guest'?guestsCount:1)}
            </div>
            <div className="text-[10px] font-semibold text-[#8D98AA]">{t('totalPrice')}</div>
          </div>

          <button
            onClick={() => {
              requireUserAuth(t('signInToBook') || 'Sign in or register to book your tickets.', () => {
                setShowBookingModal(true);
              });
            }}
            disabled={isDealExpired || isDealUpcoming}
            className={`flex-1 max-w-[200px] py-3.5 px-6 rounded-2xl text-sm font-bold text-center transition-transform active:scale-95 shadow-md ${
              isDealExpired
                ? 'bg-slate-200 text-slate-500 cursor-not-allowed shadow-none'
                : isDealUpcoming
                ? 'bg-amber-100 text-amber-800 cursor-not-allowed shadow-none'
                : 'bg-[#1060E2] hover:bg-[#0C4EBD] text-white shadow-[#1060E2]/25 cursor-pointer'
            }`}
          >
            {isDealExpired
              ? t('dealExpired')
              : isDealUpcoming
              ? t('offerStartsSoon')
              : t('bookNow')}
          </button>
        </div>
      </div>

      {/* QUICK BOOKING MODAL */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 space-y-4 animate-in slide-in-from-bottom-6 duration-200 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#0D1B3E]">{t('confirmYourBooking')}</h3>
              <button
                onClick={() => setShowBookingModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-600 block mb-1">{t('selectDate')}</label>
                <input
                  type="date"
                    min={new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Dubai',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())}
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">{t('selectTime')}</label>
                <select
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 font-semibold"
                >
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="14:00">02:00 PM</option>
                  <option value="16:00">04:00 PM</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">{t('guestsCount')}</label>
                <div className="flex items-center justify-between px-3 py-2 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-800">{guestsCount}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={guestsCount <= 1}
                      onClick={() => setGuestsCount((c) => Math.max(1, c - 1))}
                      className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center disabled:opacity-40"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-bold">{guestsCount}</span>
                    <button
                      type="button"
                      disabled={guestsCount >= 6}
                      onClick={() => setGuestsCount((c) => c + 1)}
                      className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center disabled:opacity-40"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="font-bold text-slate-600">{t('totalDue')}</span>
                <span className="text-base font-black text-[#F5820A]">
                  AED {deal.discountPrice * (deal.priceMode==='guest'?guestsCount:1)}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                requireUserAuth(t('signInToBook') || 'Sign in or register to book your tickets.', () => {
                  handleConfirmBooking();
                });
              }}
              disabled={isProcessing}
              className="w-full py-3.5 rounded-2xl bg-[#1060E2] text-white font-bold text-sm shadow-md shadow-[#1060E2]/25 hover:bg-[#0C4EBD] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-75"
            >
              {isProcessing ? t('issuingTicket') : t('confirmAndGenerateTicket')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

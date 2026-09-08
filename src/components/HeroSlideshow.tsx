import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  MapPin,
  Tag,
  ShieldCheck,
  Flame,
  Ticket,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { HeroSlide } from '../types';

export const defaultHeroSlides: HeroSlide[] = [
  {
    id: 'slide-dubai-skyline',
    title: 'Iconic Dubai Skyline & City Attractions',
    subtitle: 'Save up to 50% on Burj Khalifa decks, Dubai Frame, luxury cruises & desert safaris.',
    badge: 'DUBAI HIGHLIGHTS • EXCLUSIVE PASSES',
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1920&q=80',
    buttonText: 'Explore Dubai Deals',
    buttonLink: 'explore',
    enabled: true,
    order: 1,
  },
  {
    id: 'slide-dubai-marina',
    title: 'Dubai Marina & Waterfront Dining',
    subtitle: 'Savor Michelin-star meals, family brunches & luxury yacht rentals across Dubai & Abu Dhabi.',
    badge: 'GOURMET & FAMILY DINING',
    imageUrl: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1920&q=80',
    buttonText: 'Discover Dining Offers',
    buttonLink: 'category:Restaurants',
    enabled: true,
    order: 2,
  },
  {
    id: 'slide-palm-jumeirah',
    title: 'Palm Jumeirah & Beach Staycations',
    subtitle: 'Unwind at world-class 5-star beachfront resorts, Aquaventure waterpark & private beach clubs.',
    badge: 'RESORTS & STAYCATIONS',
    imageUrl: 'https://images.unsplash.com/photo-1578895101408-1a36b834405b?auto=format&fit=crop&w=1920&q=80',
    buttonText: 'View Staycation Deals',
    buttonLink: 'category:Hotels',
    enabled: true,
    order: 3,
  },
  {
    id: 'slide-yas-island',
    title: 'Yas Island & Abu Dhabi Mega Parks',
    subtitle: 'Unlimited thrill passes for Ferrari World, Yas Waterworld, Warner Bros & SeaWorld Abu Dhabi.',
    badge: 'YAS ISLAND PASSES',
    imageUrl: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1920&q=80',
    buttonText: 'Get Theme Park Passes',
    buttonLink: 'category:Attractions',
    enabled: true,
    order: 4,
  },
  {
    id: 'slide-kids-play',
    title: 'Kids Soft Play & Family Entertainment',
    subtitle: 'All-day access to top trampoline parks, indoor snow parks, VR arcades & creative workshops.',
    badge: 'KIDS & FAMILY EXPERIENCES',
    imageUrl: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=1920&q=80',
    buttonText: 'Explore Kids Passes',
    buttonLink: 'category:Kids Play Areas',
    enabled: true,
    order: 5,
  },
];

interface HeroSlideshowProps {
  customSlides?: HeroSlide[];
  autoPlayIntervalMs?: number;
}

export const HeroSlideshow: React.FC<HeroSlideshowProps> = ({
  customSlides,
  autoPlayIntervalMs,
}) => {
  const { homepageConfig, setActiveView, setSelectedCategory, setSelectedDealId } = useApp();

  // Get active slides from AppContext / config or fallback
  const slides = (customSlides || homepageConfig?.heroSlides || defaultHeroSlides)
    .filter((s) => s.enabled !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const safeSlides = slides.length > 0 ? slides : defaultHeroSlides;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartXRef = useRef<number | null>(null);

  const durationMs =
    autoPlayIntervalMs ||
    (homepageConfig?.heroAutoPlaySpeedSeconds ? homepageConfig.heroAutoPlaySpeedSeconds * 1000 : 5500);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % safeSlides.length);
  }, [safeSlides.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + safeSlides.length) % safeSlides.length);
  }, [safeSlides.length]);

  // Autoplay timer
  useEffect(() => {
    if (isPaused || safeSlides.length <= 1) return;
    const timer = setInterval(() => {
      goToNext();
    }, durationMs);

    return () => clearInterval(timer);
  }, [isPaused, durationMs, goToNext, safeSlides.length]);

  const handleButtonClick = (link: string, dealId?: string) => {
    if (dealId) {
      setSelectedDealId(dealId);
      setActiveView('deal-detail');
      return;
    }

    if (link.startsWith('category:')) {
      const catName = link.replace('category:', '') as any;
      setSelectedCategory(catName);
      setActiveView('home');
      window.scrollTo({ top: 400, behavior: 'smooth' });
      return;
    }

    if (link.startsWith('deal:')) {
      const dId = link.replace('deal:', '');
      setSelectedDealId(dId);
      setActiveView('deal-detail');
      return;
    }

    if (link === 'explore' || link === 'coupons' || link === 'membership') {
      setActiveView(link);
      return;
    }

    // Default: explore
    setActiveView('explore');
  };

  // Mobile Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const diffX = touchStartXRef.current - e.changedTouches[0].clientX;
    if (diffX > 50) {
      goToNext();
    } else if (diffX < -50) {
      goToPrev();
    }
    touchStartXRef.current = null;
  };

  const activeSlide = safeSlides[currentIndex] || safeSlides[0];

  return (
    <div
      className="relative w-full overflow-hidden bg-slate-950 font-sans select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides Container */}
      <div className="relative w-full h-[380px] sm:h-[460px] md:h-[520px] lg:h-[560px] max-h-[75vh]">
        {safeSlides.map((slide, index) => {
          const isActive = index === currentIndex;

          return (
            <div
              key={slide.id || index}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Background Image with subtle Ken Burns effect */}
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <img
                  src={slide.imageUrl}
                  alt={slide.title}
                  referrerPolicy="no-referrer"
                  className={`w-full h-full object-cover transition-transform duration-7000 ease-out ${
                    isActive ? 'scale-105' : 'scale-100'
                  }`}
                  loading={index === 0 ? 'eager' : 'lazy'}
                />

                {/* Dark Gradient Scrim Overlay for maximum readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-slate-950/20" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/30 to-transparent" />
              </div>

              {/* Slide Content */}
              <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12 sm:pb-16 md:pb-20">
                <div className="max-w-2xl space-y-3 sm:space-y-4">
                  {/* Badge */}
                  {slide.badge && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FD9302] text-white text-[11px] sm:text-xs font-black tracking-wider shadow-md uppercase animate-fadeIn">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{slide.badge}</span>
                    </div>
                  )}

                  {/* Title */}
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-sm">
                    {slide.title}
                  </h1>

                  {/* Subtitle / Description */}
                  <p className="text-xs sm:text-sm md:text-base text-slate-200 font-medium leading-relaxed drop-shadow-sm line-clamp-2 sm:line-clamp-3">
                    {slide.subtitle}
                  </p>

                  {/* Action Buttons */}
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => handleButtonClick(slide.buttonLink, slide.dealId)}
                      className="px-5 sm:px-6 py-2.5 sm:py-3 bg-[#0D9CFD] hover:bg-[#0b8de5] active:scale-[0.98] text-white text-xs sm:text-sm font-extrabold rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <span>{slide.buttonText || 'Claim Deal'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setActiveView('explore')}
                      className="px-4 sm:px-5 py-2.5 sm:py-3 bg-white/15 hover:bg-white/25 active:scale-[0.98] backdrop-blur-xs text-white border border-white/30 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <MapPin className="w-3.5 h-3.5 text-[#FD9302]" />
                      <span>Explore UAE Map</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Previous Button (Desktop) */}
        <button
          onClick={goToPrev}
          aria-label="Previous Slide"
          className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white items-center justify-center backdrop-blur-xs border border-white/20 transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-md"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Next Button (Desktop) */}
        <button
          onClick={goToNext}
          aria-label="Next Slide"
          className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white items-center justify-center backdrop-blur-xs border border-white/20 transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-md"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Navigation Dots & Progress */}
        <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 z-30 flex items-center justify-center gap-2">
          {safeSlides.map((_, dotIdx) => (
            <button
              key={dotIdx}
              onClick={() => setCurrentIndex(dotIdx)}
              aria-label={`Go to slide ${dotIdx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                dotIdx === currentIndex
                  ? 'w-7 sm:w-8 bg-[#0D9CFD] shadow-xs'
                  : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

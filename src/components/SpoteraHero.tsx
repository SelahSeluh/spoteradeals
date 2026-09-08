import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Crown,
  Utensils,
  Ticket,
  Users,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface HeroSlide {
  id: string;
  badge: string;
  badgeIcon: any;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaAction: 'explore' | 'family' | 'membership' | 'deals';
  bgImage: string;
  accentGradient: string;
}

export const SpoteraHero: React.FC = () => {
  const { setActiveView, setSelectedCategory, t } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: HeroSlide[] = [
    {
      id: 'family-attractions',
      badge: 'Top UAE Family Attractions',
      badgeIcon: Users,
      title: 'Create Unforgettable UAE Family Memories',
      subtitle: 'Indoor play zones, waterparks, aquariums, and discovery hubs across Dubai & Abu Dhabi.',
      ctaText: 'Explore Family Deals',
      ctaAction: 'family',
      bgImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=85',
      accentGradient: 'from-[#071A38]/90 via-[#0C2A5C]/60 to-transparent',
    },
    {
      id: 'dining-offers',
      badge: 'Best Dining Deals & BOGO',
      badgeIcon: Utensils,
      title: 'Taste The Finest UAE Cuisine For Less',
      subtitle: 'Buy-1-Get-1 free dining and up to 50% discount at premier cafes, brunches, and restaurants.',
      ctaText: 'Discover Dining Deals',
      ctaAction: 'explore',
      bgImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=85',
      accentGradient: 'from-[#1A0B2E]/90 via-[#0C2A5C]/60 to-transparent',
    },
    {
      id: 'theme-parks',
      badge: 'Theme Parks & Adventure',
      badgeIcon: Ticket,
      title: 'Adrenaline, Splash Parks & Safari Thrills',
      subtitle: 'Instant digital vouchers for IMG Worlds, Ferrari World, Desert Safaris & Aquaventure.',
      ctaText: 'View Attraction Passes',
      ctaAction: 'explore',
      bgImage: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1600&q=85',
      accentGradient: 'from-[#0A1B38]/90 via-[#0C326E]/60 to-transparent',
    },
    {
      id: 'vip-pass',
      badge: 'Spotera VIP Pass',
      badgeIcon: Crown,
      title: 'Unlock Unlimited UAE VIP Savings',
      subtitle: 'Gain 12 months of unlimited premium discounts, family perks, and VIP priority bookings.',
      ctaText: 'Get VIP Pass',
      ctaAction: 'membership',
      bgImage: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1600&q=85',
      accentGradient: 'from-[#2A1702]/90 via-[#0C2A5C]/60 to-transparent',
    },
  ];

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleCta = (action: HeroSlide['ctaAction']) => {
    if (action === 'family') {
      setActiveView('family' as any);
    } else if (action === 'membership') {
      setActiveView('membership');
    } else {
      setActiveView('explore');
    }
  };

  const slide = slides[currentSlide];
  const BadgeIcon = slide.badgeIcon;

  return (
    <div className="relative w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-2 sm:pt-4 select-none">
      <div className="relative rounded-3xl overflow-hidden shadow-xl border border-white/15 bg-slate-950 min-h-[340px] sm:min-h-[420px] flex flex-col justify-end p-5 sm:p-10 lg:p-12 text-white">
        
        {/* SLIDE IMAGE & TRANSITION */}
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0 z-0"
          >
            <img
              src={slide.bgImage}
              alt={slide.title}
              className="w-full h-full object-cover object-center"
            />
            {/* Ambient Multi-Layer Gradients for High Readability */}
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.accentGradient}`} />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-slate-950/20" />
          </motion.div>
        </AnimatePresence>

        {/* HERO CONTENT */}
        <div className="relative z-10 max-w-2xl space-y-3 sm:space-y-4">
          <motion.div
            key={`badge-${slide.id}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-bold shadow-sm"
          >
            <BadgeIcon className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span>{slide.badge}</span>
          </motion.div>

          <motion.h1
            key={`title-${slide.id}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight"
          >
            {slide.title}
          </motion.h1>

          <motion.p
            key={`sub-${slide.id}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xs sm:text-base text-blue-100/90 font-normal leading-relaxed max-w-xl"
          >
            {slide.subtitle}
          </motion.p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleCta(slide.ctaAction)}
              className="px-6 py-3 bg-[#0C5CAB] hover:bg-[#094887] active:scale-95 text-white text-xs sm:text-sm font-extrabold rounded-2xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>{slide.ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveView('explore')}
              className="px-5 py-3 bg-white/15 hover:bg-white/25 backdrop-blur-md active:scale-95 text-white text-xs sm:text-sm font-bold rounded-2xl transition-all border border-white/20 cursor-pointer"
            >
              {t('allDeals') || 'Browse All Deals'}
            </button>
          </div>
        </div>

        {/* CONTROLS: PREV / NEXT & INDICATOR DOTS */}
        <div className="relative z-10 flex items-center justify-between mt-6 pt-3 border-t border-white/10">
          {/* Indicators */}
          <div className="flex items-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentSlide === idx
                    ? 'w-7 bg-[#38BDF8] shadow-sm'
                    : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Nav Arrows */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={prevSlide}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 active:scale-95 text-white flex items-center justify-center backdrop-blur-xs transition-all cursor-pointer"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextSlide}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 active:scale-95 text-white flex items-center justify-center backdrop-blur-xs transition-all cursor-pointer"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

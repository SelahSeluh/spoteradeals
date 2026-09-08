import React, { useState } from 'react';
import {
  Search,
  MapPin,
  ChevronDown,
  Sparkles,
  Baby,
  Utensils,
  Gamepad2,
  Compass,
  ShoppingBag,
  LayoutGrid,
  ArrowRight,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { City } from '../types';
import { PromoSlotRenderer } from './PromoSlotRenderer';

export const SpoteraPlayfulHero: React.FC = () => {
  const {
    selectedCity,
    setSelectedCity,
    searchQuery,
    setSearchQuery,
    setSelectedCategory,
    setActiveView,
    homepageConfig,
  } = useApp();

  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);

  const uaeEmirates: (City | 'all')[] = [
    'all',
    'Dubai',
    'Abu Dhabi',
    'Sharjah',
    'Ajman',
    'Ras Al Khaimah',
    'Fujairah',
    'Umm Al Quwain',
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveView('explore');
  };

  const handleCategoryClick = (categoryName: string) => {
    if (categoryName === 'More') {
      setActiveView('categories');
    } else {
      setSelectedCategory(categoryName as any);
      setActiveView('explore');
    }
  };

  // Quick categories as seen in the mockup
  const quickCategories = [
    {
      id: 'kids',
      name: 'Kids',
      icon: Baby,
      categoryKey: 'Kids Play Areas',
      bgColor: 'bg-[#E0F2FE]',
      iconColor: 'text-[#0284C7]',
      borderColor: 'border-[#BAE6FD]',
    },
    {
      id: 'restaurants',
      name: 'Restaurants',
      icon: Utensils,
      categoryKey: 'Restaurants',
      bgColor: 'bg-[#FFEDD5]',
      iconColor: 'text-[#EA580C]',
      borderColor: 'border-[#FED7AA]',
    },
    {
      id: 'entertainment',
      name: 'Entertainment',
      icon: Gamepad2,
      categoryKey: 'Attractions',
      bgColor: 'bg-[#F3E8FF]',
      iconColor: 'text-[#9333EA]',
      borderColor: 'border-[#E9D5FF]',
    },
    {
      id: 'activities',
      name: 'Activities',
      icon: Compass,
      categoryKey: 'Desert & Water Safaris',
      bgColor: 'bg-[#CCFBF1]',
      iconColor: 'text-[#0D9488]',
      borderColor: 'border-[#99F6E4]',
    },
    {
      id: 'shopping',
      name: 'Shopping',
      icon: ShoppingBag,
      categoryKey: 'Retail & Wellness',
      bgColor: 'bg-[#EDE9FE]',
      iconColor: 'text-[#7C3AED]',
      borderColor: 'border-[#DDD6FE]',
    },
    {
      id: 'more',
      name: 'More',
      icon: LayoutGrid,
      categoryKey: 'More',
      bgColor: 'bg-[#F1F5F9]',
      iconColor: 'text-[#475569]',
      borderColor: 'border-[#E2E8F0]',
    },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#F0F6FC] via-[#F8FAFC] to-[#F1F6FB] select-none pt-2 pb-6 sm:pb-10 border-b border-slate-200/60">
      {/* BACKGROUND ORGANIC BLUE & ORANGE FLUID WAVES */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Top-Right Big Blue Flow */}
        <svg
          className="absolute -top-12 -right-12 w-[650px] lg:w-[900px] h-[450px] lg:h-[620px] text-[#0D9CFD]/15"
          viewBox="0 0 900 620"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 250,0 C 450,150 700,50 900,120 L 900,0 Z"
            fill="currentColor"
          />
          <path
            d="M 120,0 C 350,220 600,180 900,320 L 900,0 Z"
            fill="#0D9CFD"
            fillOpacity="0.08"
          />
        </svg>

        {/* Playful Orange Wave Swirl underneath */}
        <svg
          className="absolute top-1/3 -right-20 w-[550px] lg:w-[750px] h-[350px] lg:h-[480px] text-[#FD9302]"
          viewBox="0 0 750 480"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 150,240 C 300,120 480,260 750,160 L 750,480 L 0,480 Z"
            fill="#FD9302"
            fillOpacity="0.88"
          />
          <path
            d="M 0,320 C 220,200 450,340 750,220 L 750,480 L 0,480 Z"
            fill="#0D9CFD"
            fillOpacity="0.95"
          />
        </svg>

        {/* Playful Doodle Decor 1: Orange 4-Point Star */}
        <div className="absolute top-8 left-[38%] text-[#FD9302] hidden sm:block animate-pulse">
          <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
            <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
          </svg>
        </div>

        {/* Playful Doodle Decor 2: Floating Blue Sparkle Ring */}
        <div className="absolute top-12 left-6 text-[#0D9CFD] hidden md:block">
          <div className="w-6 h-6 rounded-full border-2 border-[#0D9CFD]/60 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[#0D9CFD]" />
          </div>
        </div>

        {/* Playful Doodle Decor 3: Curved Wave Arc */}
        <div className="absolute top-20 left-[48%] text-[#FD9302]/70 hidden lg:block">
          <svg className="w-10 h-6" viewBox="0 0 40 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M2 12C8 4 16 4 22 12C28 20 36 20 38 12" />
          </svg>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          
          {/* LEFT COLUMN: HEADLINE, SUBHEADLINE, SEARCH BAR & QUICK CATEGORY ICONS */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8 pt-2 sm:pt-4">
            
            {/* 1. Main Heading & Subtitle */}
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-black text-slate-900 tracking-tight leading-[1.1]">
                {homepageConfig?.heroTitle || 'More Fun.'} <br />
                <span className="text-[#FD9302]">{homepageConfig?.heroHighlightText || 'More Together.'}</span>
              </h1>
              
              <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-lg">
                {homepageConfig?.heroSubtitle || 'Amazing deals for every family moment. Discover. Explore. Save More.'}
              </p>
            </div>

            {/* 2. Integrated Search & Location Bar (Pill Shape) */}
            <div className="relative max-w-xl">
              <form
                onSubmit={handleSearch}
                className="bg-white rounded-full border-2 border-slate-200 hover:border-[#0D9CFD] focus-within:border-[#0D9CFD] shadow-lg focus-within:shadow-xl transition-all flex items-center p-1.5 sm:p-2"
              >
                {/* Location Select Pill */}
                <div className="relative shrink-0">
                  <button
                    type="button"
                    onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                    className="flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-[#0D9CFD] rounded-full transition-colors cursor-pointer"
                  >
                    <MapPin className="w-4 h-4 text-[#FD9302] shrink-0" />
                    <span className="capitalize">
                      {String(selectedCity).toLowerCase() === 'all' ? 'Dubai, UAE' : `${selectedCity}, UAE`}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {cityDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-2xl py-2 z-50">
                      <div className="px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Choose Emirate
                      </div>
                      {uaeEmirates.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => {
                            setSelectedCity(c as any);
                            setCityDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                            selectedCity.toLowerCase() === c.toLowerCase()
                              ? 'text-[#0D9CFD] font-bold bg-blue-50/70'
                              : 'text-slate-700'
                          }`}
                        >
                          <span className="capitalize">{c === 'all' ? 'All UAE (Default)' : c}</span>
                          {selectedCity.toLowerCase() === c.toLowerCase() && (
                            <Check className="w-3.5 h-3.5 text-[#0D9CFD]" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="h-6 w-px bg-slate-200 shrink-0" />

                {/* Query Input */}
                <div className="flex-1 min-w-0 px-2 sm:px-3">
                  <input
                    type="text"
                    placeholder="What are you looking for?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent border-none text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none font-medium truncate"
                  />
                </div>

                {/* Orange Search Action Button */}
                <button
                  type="submit"
                  className="px-5 sm:px-7 py-2.5 sm:py-3 bg-[#FD9302] hover:bg-[#e68400] active:scale-95 text-white text-xs sm:text-sm font-black rounded-full shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Search className="w-4 h-4" />
                  <span className="hidden sm:inline">Search</span>
                </button>
              </form>
            </div>

            {/* 3. Quick Category Circular Icons Bar */}
            <div className="pt-1 sm:pt-2">
              <div className="grid grid-cols-6 gap-2 sm:gap-3 max-w-xl">
                {quickCategories.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleCategoryClick(item.categoryKey)}
                      className="group flex flex-col items-center gap-1.5 cursor-pointer transition-transform hover:-translate-y-1 active:scale-95"
                    >
                      <div
                        className={`w-11 h-11 sm:w-13 sm:h-13 rounded-full ${item.bgColor} border ${item.borderColor} flex items-center justify-center shadow-xs group-hover:shadow-md transition-all`}
                      >
                        <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${item.iconColor}`} />
                      </div>
                      <span className="text-[11px] sm:text-xs font-bold text-slate-700 group-hover:text-[#0D9CFD] transition-colors text-center truncate w-full">
                        {item.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: FAMILY LIFESTYLE PHOTO COLLAGE & "UP TO 50% OFF" BADGE */}
          <div className="lg:col-span-6 relative mt-4 lg:mt-0">
            <div className="relative w-full max-w-lg mx-auto">
              
              {/* Slot 1: Main Featured Frame (Single Image / Slideshow / Video) */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900 aspect-[4/3] sm:aspect-[16/11]">
                <PromoSlotRenderer
                  slot={homepageConfig?.promoSlot1}
                  fallbackImage="https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=85"
                  className="w-full h-full"
                />
                {/* Subtle soft gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Slot 2: Overlapping Top-Right Accent Frame (Single Image / Slideshow / Video) */}
              <div className="absolute -top-6 -right-3 sm:-right-6 w-28 sm:w-36 h-28 sm:h-36 rounded-full overflow-hidden border-4 border-white shadow-xl bg-slate-100 hidden sm:block transform hover:rotate-3 transition-transform">
                <PromoSlotRenderer
                  slot={homepageConfig?.promoSlot2}
                  fallbackImage="https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?auto=format&fit=crop&w=600&q=85"
                  className="w-full h-full"
                />
              </div>

              {/* Slot 3: Overlapping Bottom-Left Accent Frame (Single Image / Slideshow / Video) */}
              <div className="absolute -bottom-6 -left-3 sm:-left-6 w-32 sm:w-40 h-32 sm:h-40 rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-slate-100 hidden sm:block transform hover:-rotate-2 transition-transform">
                <PromoSlotRenderer
                  slot={homepageConfig?.promoSlot3}
                  fallbackImage="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=85"
                  className="w-full h-full"
                />
              </div>

              {/* PLAYFUL "UP TO 50% OFF" BADGE */}
              <div className="absolute -bottom-4 right-4 sm:right-8 z-20 transform rotate-[-6deg] hover:rotate-0 transition-transform cursor-pointer">
                <div className="relative bg-gradient-to-br from-[#FF9F1C] to-[#FD9302] text-white p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-white/80 flex flex-col items-center justify-center text-center">
                  
                  {/* Decorative Sparkle */}
                  <div className="absolute -top-2 -right-2 text-yellow-200">
                    <Sparkles className="w-5 h-5 fill-current animate-bounce" />
                  </div>

                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider drop-shadow-xs">
                    {homepageConfig?.discountBadgeTextTop || 'UP TO'}
                  </span>
                  <span className="text-2xl sm:text-4xl font-black tracking-tight leading-none drop-shadow-md py-0.5">
                    {homepageConfig?.discountBadgePercent || '50%'}
                  </span>
                  <span className="text-xs sm:text-sm font-black uppercase tracking-widest drop-shadow-xs">
                    {homepageConfig?.discountBadgeTextBottom || 'OFF'}
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

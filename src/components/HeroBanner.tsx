import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Tag,
  Star,
  Building2,
  Ticket,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Deal } from '../types';

export const HeroBanner: React.FC = () => {
  const { deals, setSelectedDealId, setActiveView } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Pick top 4 featured deals
  const featuredDeals = deals.filter((d) => d.isFeatured).slice(0, 4);
  const slides = featuredDeals.length > 0 ? featuredDeals : deals.slice(0, 4);

  if (slides.length === 0) return null;

  const currentDeal = slides[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleSelectDeal = (deal: Deal) => {
    setSelectedDealId(deal.id);
    setActiveView('deal-detail');
  };

  return (
    <div className="w-full bg-white py-4 sm:py-6 border-b border-slate-100 font-sans select-none">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Large Ticket-Stub Style Featured Card */}
        <div className="relative bg-white rounded-2xl sm:rounded-3xl border border-slate-200 hover:border-[#0D9CFD] shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[300px] sm:min-h-[360px]">
            
            {/* Left Col: High-Res Image with Orange Discount Badge */}
            <div className="lg:col-span-7 relative overflow-hidden bg-slate-100 min-h-[220px] sm:min-h-[280px]">
              <img
                src={currentDeal.images[0]}
                alt={currentDeal.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />

              {/* Orange Discount Badge #FD9302 */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                <span className="bg-[#FD9302] text-white text-xs sm:text-sm font-black px-3.5 py-1.5 rounded-xl shadow-md flex items-center gap-1.5 tracking-tight">
                  <Tag className="w-4 h-4 text-white" />
                  <span>{currentDeal.discountPercent}% OFF</span>
                </span>

                <span className="bg-[#0D9CFD] text-white text-[11px] sm:text-xs font-bold px-3 py-1.5 rounded-xl shadow-md">
                  FEATURED DEAL
                </span>
              </div>

              {/* Category Pill */}
              <div className="absolute bottom-3 left-4 z-10">
                <span className="bg-slate-900/80 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1 rounded-lg">
                  {currentDeal.category}
                </span>
              </div>
            </div>

            {/* Vertical Ticket Divider for desktop (perforated dash + cutouts) */}
            <div className="hidden lg:block lg:col-span-1 relative">
              <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 border-l-2 border-dashed border-slate-200" />
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white border border-slate-200 rounded-full" />
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white border border-slate-200 rounded-full" />
            </div>

            {/* Right Col: Ticket Details & Action */}
            <div className="lg:col-span-4 p-5 sm:p-7 flex flex-col justify-between bg-white space-y-4">
              <div className="space-y-2.5">
                {/* Business Name & Rating */}
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#0D9CFD] text-xs uppercase tracking-wider flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{currentDeal.businessName}</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  </span>

                  <div className="flex items-center gap-1 bg-amber-50 text-slate-900 px-2 py-0.5 rounded-lg border border-amber-200 font-bold text-xs">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{currentDeal.rating || 4.9}</span>
                  </div>
                </div>

                {/* Deal Title */}
                <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                  {currentDeal.title}
                </h2>

                {/* Short Description */}
                <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed">
                  {currentDeal.description}
                </p>

                {/* Location with Orange Pin #FD9302 */}
                <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                  <MapPin className="w-4 h-4 text-[#FD9302] shrink-0" />
                  <span>
                    {currentDeal.district ? `${currentDeal.district}, ${currentDeal.city}` : `${currentDeal.city}, UAE`}
                  </span>
                </div>
              </div>

              {/* Price & Action Row */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Ticket Price</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-slate-900 tracking-tight">
                        <span className="text-xs font-bold text-[#0D9CFD] mr-1">AED</span>
                        {currentDeal.discountPrice}
                      </span>
                      {currentDeal.originalPrice > currentDeal.discountPrice && (
                        <span className="text-xs sm:text-sm text-slate-400 line-through">
                          AED {currentDeal.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                    Save AED {currentDeal.originalPrice - currentDeal.discountPrice}
                  </span>
                </div>

                <button
                  onClick={() => handleSelectDeal(currentDeal)}
                  className="w-full py-3 bg-[#0D9CFD] hover:bg-[#0b8de5] active:scale-[0.99] text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Ticket className="w-4 h-4" />
                  <span>View Ticket Deal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>

          {/* Navigation Controls (Arrows & Slide Indicators) */}
          <div className="absolute bottom-3 right-4 lg:bottom-4 lg:left-4 z-20 flex items-center gap-2 bg-white/90 backdrop-blur-xs p-1.5 rounded-full border border-slate-200 shadow-xs">
            <button
              onClick={handlePrev}
              className="p-1 rounded-full hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
              title="Previous Deal"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1 px-1">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    idx === currentIndex ? 'w-5 bg-[#0D9CFD]' : 'w-1.5 bg-slate-300 hover:bg-slate-400'
                  }`}
                  title={`Slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="p-1 rounded-full hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
              title="Next Deal"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

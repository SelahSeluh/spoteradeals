import React, { useState } from 'react';
import {
  Sparkles,
  MapPin,
  Smile,
  Users,
  Compass,
  Calendar,
  Sun,
  Flame,
  Utensils,
  PartyPopper,
  GraduationCap,
  Filter,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DealCard } from '../components/DealCard';
import { Deal, City, Category } from '../types';

interface FamilyPageProps {
  onClaimCoupon: (deal: Deal) => void;
  onBookNow: (deal: Deal) => void;
}

export const FamilyPage: React.FC<FamilyPageProps> = ({ onClaimCoupon, onBookNow }) => {
  const { deals, selectedCity, setSelectedCity, setActiveView, t } = useApp();

  const [activeSection, setActiveSection] = useState<string>('all');
  const [selectedAge, setSelectedAge] = useState<string>('all');
  const [selectedEnvironment, setSelectedEnvironment] = useState<'all' | 'indoor' | 'outdoor'>('all');
  const [selectedTiming, setSelectedTiming] = useState<'all' | 'today' | 'weekend'>('all');
  const [maxPrice, setMaxPrice] = useState<number>(1000);

  const familyCategories = [
    { id: 'all', label: 'All Family Deals', icon: Sparkles },
    { id: 'kids-activities', label: 'Kids Activities', icon: Smile },
    { id: 'indoor-play', label: 'Indoor Play', icon: PartyPopper },
    { id: 'outdoor-fun', label: 'Outdoor Fun', icon: Sun },
    { id: 'family-dining', label: 'Family Restaurants', icon: Utensils },
    { id: 'weekend-ideas', label: 'Weekend Ideas', icon: Calendar },
    { id: 'camps-workshops', label: 'Holiday Workshops', icon: GraduationCap },
  ];

  const ageFilters = [
    { id: 'all', label: 'All Ages' },
    { id: 'toddler', label: '0–3 Yrs (Toddlers)' },
    { id: 'kids', label: '4–8 Yrs (Kids)' },
    { id: 'preteen', label: '9–12 Yrs (Pre-Teens)' },
    { id: 'teens', label: '13+ Yrs (Teens & Family)' },
  ];

  const filteredDeals = deals.filter((deal) => {
    // City filter
    if (selectedCity !== 'All' && deal.city !== selectedCity) return false;

    // Category / Section filter
    if (activeSection === 'kids-activities' && deal.category !== 'Kids Play Areas' && deal.category !== 'Attractions') {
      return false;
    }
    if (activeSection === 'indoor-play' && !deal.isIndoor && deal.category !== 'Kids Play Areas') {
      return false;
    }
    if (activeSection === 'outdoor-fun' && !deal.isOutdoor && deal.category !== 'Attractions') {
      return false;
    }
    if (activeSection === 'family-dining' && deal.category !== 'Restaurants' && (deal.category as string) !== 'Cafés') {
      return false;
    }
    if (activeSection === 'camps-workshops' && deal.category !== 'Workshops' && deal.category !== 'Summer Camps' && deal.category !== 'Holiday Camps') {
      return false;
    }

    // Environment filter
    if (selectedEnvironment === 'indoor' && deal.isIndoor === false) return false;
    if (selectedEnvironment === 'outdoor' && deal.isOutdoor === false) return false;

    // Price filter
    if (deal.discountPrice > maxPrice) return false;

    // Age group filter
    if (selectedAge === 'toddler' && !deal.targetAgeGroup.toLowerCase().includes('0') && !deal.targetAgeGroup.toLowerCase().includes('toddler') && !deal.targetAgeGroup.toLowerCase().includes('all')) {
      return false;
    }
    if (selectedAge === 'kids' && !deal.targetAgeGroup.toLowerCase().includes('4') && !deal.targetAgeGroup.toLowerCase().includes('6') && !deal.targetAgeGroup.toLowerCase().includes('all') && !deal.targetAgeGroup.toLowerCase().includes('kid')) {
      return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-[#F0F5FB] font-sans pb-24">
      {/* 1. FAMILY HERO HEADER */}
      <div className="bg-gradient-to-b from-[#0C5CAB] via-[#1067BE] to-[#0A4D92] text-white pt-8 pb-12 px-4 sm:px-8 shadow-md relative overflow-hidden">
        <div className="max-w-5xl mx-auto space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-bold border border-white/20">
            <Users className="w-3.5 h-3.5 text-cyan-200" />
            <span>UAE Family Hub</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Family
          </h1>
          <p className="text-sm sm:text-base text-blue-100 max-w-xl font-normal leading-relaxed">
            Find something everyone will love. Verified play areas, kid-friendly restaurants, waterparks, and weekend adventures across the UAE.
          </p>
        </div>
      </div>

      {/* 2. FAMILY CATEGORY PILLS */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-6 relative z-20">
        <div className="bg-white p-2 sm:p-3 rounded-2xl sm:rounded-3xl border border-[#D8E6F8] shadow-sm flex items-center gap-2 overflow-x-auto no-scrollbar">
          {familyCategories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeSection === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveSection(cat.id)}
                className={`px-4 py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-extrabold whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#0C5CAB] text-white shadow-xs'
                    : 'bg-[#F0F5FB] text-slate-700 hover:bg-[#E2EDF9]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-200' : 'text-[#0C5CAB]'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. INTERACTIVE FILTERS BAR */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-6 space-y-4">
        <div className="bg-white p-4 rounded-2xl border border-[#D8E6F8] shadow-2xs flex flex-wrap items-center justify-between gap-3">
          {/* Age Filters */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
            <span className="text-slate-500 mr-1 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-[#0C5CAB]" /> Age:
            </span>
            {ageFilters.map((age) => (
              <button
                key={age.id}
                onClick={() => setSelectedAge(age.id)}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  selectedAge === age.id
                    ? 'bg-[#0C5CAB] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {age.label}
              </button>
            ))}
          </div>

          {/* Environment & Timing Filters */}
          <div className="flex items-center gap-2 text-xs font-bold">
            <button
              onClick={() =>
                setSelectedEnvironment(
                  selectedEnvironment === 'indoor' ? 'all' : 'indoor'
                )
              }
              className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                selectedEnvironment === 'indoor'
                  ? 'bg-blue-50 border-[#0C5CAB] text-[#0C5CAB]'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              🏢 Indoor Play
            </button>
            <button
              onClick={() =>
                setSelectedEnvironment(
                  selectedEnvironment === 'outdoor' ? 'all' : 'outdoor'
                )
              }
              className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                selectedEnvironment === 'outdoor'
                  ? 'bg-blue-50 border-[#0C5CAB] text-[#0C5CAB]'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              ☀️ Outdoor Fun
            </button>
          </div>
        </div>

        {/* 4. RESULTS SECTION */}
        <div className="flex items-center justify-between pt-2">
          <h2 className="text-base sm:text-xl font-black text-slate-900">
            {filteredDeals.length} Family Offers in {selectedCity === 'All' ? 'UAE' : selectedCity}
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            Updated today with instant QR passes
          </span>
        </div>

        {filteredDeals.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#D8E6F8] space-y-4 max-w-lg mx-auto my-8">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#0C5CAB] flex items-center justify-center mx-auto">
              <Smile className="w-8 h-8 text-[#0C5CAB]" />
            </div>
            <h3 className="text-lg font-black text-slate-900">No matching family deals found</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Try adjusting your age filters or choose "All Emirates" to see more family passes and play areas.
            </p>
            <button
              onClick={() => {
                setActiveSection('all');
                setSelectedAge('all');
                setSelectedEnvironment('all');
                setSelectedCity('All');
              }}
              className="px-5 py-2.5 bg-[#0C5CAB] text-white rounded-xl text-xs font-bold hover:bg-[#094887] transition-all cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredDeals.map((deal) => (
              <DealCard
                key={deal.id}
                deal={deal}
                onClaimCoupon={onClaimCoupon}
                onBookNow={onBookNow}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

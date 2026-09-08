import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, Heart, Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/PageHeader';
import { DealCard } from '../components/DealCard';
import { EmptyState } from '../components/EmptyState';
import { Deal } from '../types';

interface ExplorePageProps {
  onClaimCoupon: (deal: Deal) => void;
  onBookNow: (deal: Deal) => void;
}

export const ExplorePage: React.FC<ExplorePageProps> = () => {
  const {
    deals,
    selectedCity,
    selectedCategory,
    setSelectedCategory,
    user,
    toggleFavoriteDeal,
    setActiveView,
    setSelectedDealId,
  } = useApp();

  const [filter, setFilter] = useState<'All' | 'Nearby' | 'Featured' | 'Popular'>('All');
  const [onlyFavorites, setOnlyFavorites] = useState<boolean>(false);
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'limited'>('all');
  const [sortHigh, setSortHigh] = useState(false);

  const filters: ('All' | 'Nearby' | 'Featured' | 'Popular')[] = [
    'All',
    'Nearby',
    'Featured',
    'Popular',
  ];

  const savedDealIds = user.savedDealIds || [];

  const filteredDeals = useMemo(() => {
    // 1. Base published deals
    let list = deals.filter((d) => d.isPublished !== false);

    // 2. Favorites only toggle
    if (onlyFavorites) {
      list = list.filter((deal) => savedDealIds.includes(deal.id));
    }

    // 3. Category filtering
    if (selectedCategory && selectedCategory !== 'All') {
      list = list.filter((deal) =>
        deal.category.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    // 4. Availability filtering
    if (availabilityFilter === 'available') {
      list = list.filter((deal) => !deal.availability || deal.availability === 'available');
    } else if (availabilityFilter === 'limited') {
      list = list.filter((deal) => deal.availability === 'limited');
    }

    // 5. Chip filters
    const cityStr = String(selectedCity).toLowerCase();
    list = list.filter((deal) => {
      if (filter === 'Nearby') {
        return cityStr === 'all' || deal.city.toLowerCase() === cityStr;
      }
      if (filter === 'Featured') {
        return deal.isFeatured;
      }
      if (filter === 'Popular') {
        return (deal.rating || 4.5) >= 4.7 || (deal.discountPercent || 0) >= 30;
      }
      return true;
    });

    // 6. Sorting
    return [...list].sort((a, b) =>
      sortHigh
        ? b.discountPercent - a.discountPercent
        : a.discountPrice - b.discountPrice
    );
  }, [deals, selectedCategory, selectedCity, filter, onlyFavorites, availabilityFilter, sortHigh, savedDealIds]);

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-28">
      {/* Header */}
      <PageHeader
        title={onlyFavorites ? 'My Saved Favorites' : (selectedCategory && selectedCategory !== 'All' ? selectedCategory : 'Deals')}
        rightAction={
          <button
            type="button"
            onClick={() => setSortHigh(!sortHigh)}
            aria-label="Sort deals"
            className="w-10 h-10 rounded-full bg-white border border-[#E7EBF2] shadow-xs flex items-center justify-center text-[#0D1B3E] hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-1 space-y-4">
        {/* Filter Pills & Quick Controls */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {/* Favorites Only Toggle */}
          <button
            type="button"
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            className={`min-h-[38px] px-3.5 rounded-full text-[13px] font-bold flex items-center gap-1.5 transition-all cursor-pointer select-none shrink-0 ${
              onlyFavorites
                ? 'bg-[#F5820A] text-white shadow-xs'
                : 'bg-white text-[#5F6B82] border border-[#E7EBF2] hover:bg-slate-50'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-white text-white' : 'text-[#F5820A]'}`} />
            <span>Favorites {savedDealIds.length > 0 ? `(${savedDealIds.length})` : ''}</span>
          </button>

          {/* Core filters */}
          {filters.map((item) => {
            const active = filter === item && !onlyFavorites;
            return (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setFilter(item);
                  if (onlyFavorites) setOnlyFavorites(false);
                }}
                className={`min-h-[38px] px-4 rounded-full text-[13px] font-bold transition-all cursor-pointer select-none shrink-0 ${
                  active
                    ? 'bg-[#1A4FBF] text-white shadow-xs'
                    : 'bg-white text-[#5F6B82] border border-[#E7EBF2] hover:bg-slate-50'
                }`}
              >
                {item}
              </button>
            );
          })}

          {/* Availability Filter Toggle */}
          <button
            type="button"
            onClick={() => {
              if (availabilityFilter === 'all') setAvailabilityFilter('available');
              else if (availabilityFilter === 'available') setAvailabilityFilter('limited');
              else setAvailabilityFilter('all');
            }}
            className={`min-h-[38px] px-3 rounded-full text-[12px] font-bold border transition-all cursor-pointer select-none shrink-0 flex items-center gap-1 ${
              availabilityFilter !== 'all'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-white text-[#5F6B82] border-[#E7EBF2]'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              {availabilityFilter === 'all' ? 'All Spots' : availabilityFilter === 'available' ? 'Available Only' : 'Limited Spots'}
            </span>
          </button>

          {selectedCategory && selectedCategory !== 'All' && (
            <button
              type="button"
              onClick={() => setSelectedCategory('All')}
              className="min-h-[38px] px-3.5 rounded-full text-[12px] font-bold bg-[#FFF1E3] text-[#F5820A] border border-[#F5820A]/30 hover:bg-[#ffe6cc] transition-all cursor-pointer shrink-0"
            >
              Clear Category ×
            </button>
          )}
        </div>

        {/* Result Row */}
        <div className="flex items-center justify-between text-[12px] text-[#5F6B82] px-0.5">
          <span>{filteredDeals.length} family-friendly deals</span>
          <span className="font-bold text-[#1A4FBF]">
            {sortHigh ? 'Biggest discount' : 'Best value'}
          </span>
        </div>

        {/* Responsive Deals Grid (1 col mobile, 2 col tablet, 3-4 col desktop) */}
        {filteredDeals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredDeals.map((deal) => (
              <DealCard
                key={deal.id}
                deal={deal}
                saved={savedDealIds.includes(deal.id)}
                onPress={() => {
                  setSelectedDealId(deal.id);
                  setActiveView('deal-detail');
                }}
                onToggleFavorite={() => toggleFavoriteDeal(deal.id)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="search"
            title="No deals found"
            description={onlyFavorites ? "You haven't saved any deals to your favorites yet. Browse deals and tap the heart icon to save!" : "Try another category or switch your location to discover more UAE favourites."}
            actionText={onlyFavorites ? "Browse All Deals" : "Clear filters"}
            onAction={() => {
              setFilter('All');
              setOnlyFavorites(false);
              setAvailabilityFilter('all');
              setSelectedCategory('All');
            }}
          />
        )}
      </div>
    </div>
  );
};

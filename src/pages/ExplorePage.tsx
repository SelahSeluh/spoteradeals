import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, Heart, CheckCircle2, Map, LayoutGrid } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/PageHeader';
import { DealCard } from '../components/DealCard';
import { DealsMap } from '../components/DealsMap';
import { EmptyState } from '../components/EmptyState';
import { DateRangeFilter } from '../components/DateRangeFilter';
import { Deal, DateFilterPreset } from '../types';

interface ExplorePageProps {
  onClaimCoupon: (deal: Deal) => void;
  onBookNow: (deal: Deal) => void;
}

export const ExplorePage: React.FC<ExplorePageProps> = ({ onClaimCoupon, onBookNow }) => {
  const {
    deals,
    selectedCity,
    selectedCategory,
    setSelectedCategory,
    user,
    toggleFavoriteDeal,
    setActiveView,
    setSelectedDealId,
    holidays,
    isRtl,
    t,
  } = useApp();

  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [filter, setFilter] = useState<'All' | 'Nearby' | 'Featured' | 'Popular'>('All');
  const [onlyFavorites, setOnlyFavorites] = useState<boolean>(false);
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'limited'>('all');
  const [sortHigh, setSortHigh] = useState(false);

  // Date Range Filter State
  const [dateFilter, setDateFilter] = useState<{
    startDate: string;
    endDate: string;
    preset: DateFilterPreset;
    selectedHolidayId?: string;
  }>({
    startDate: '',
    endDate: '',
    preset: 'all',
  });

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

    // 6. Date Range & Availability filtering
    if (dateFilter.startDate) {
      list = list.filter((deal) => {
        // Exclude expired deals before selected start date
        if (deal.expiryDate && deal.expiryDate < dateFilter.startDate) {
          return false;
        }
        // Exclude deals that start after selected end date
        if (deal.startDate && dateFilter.endDate && deal.startDate > dateFilter.endDate) {
          return false;
        }
        // Exclude unavailable deals
        if (deal.availability === 'not-available' || deal.availability === 'fully-booked') {
          return false;
        }
        return true;
      });
    }

    // 7. Sorting
    return [...list].sort((a, b) =>
      sortHigh
        ? b.discountPercent - a.discountPercent
        : a.discountPrice - b.discountPrice
    );
  }, [deals, selectedCategory, selectedCity, filter, onlyFavorites, availabilityFilter, dateFilter, sortHigh, savedDealIds]);

  return (
    <div className="paper-explore min-h-screen bg-[#F5F7FA] pb-28">
      {/* Header */}
      <PageHeader
        title={onlyFavorites ? t('savedFavoritesTitle') : (selectedCategory && selectedCategory !== 'All' ? selectedCategory : (isRtl ? 'استكشف التجارب' : 'Explore experiences'))}
        rightAction={
          <div className="flex items-center gap-2">
            {/* View Mode Segmented Switcher */}
            <div className="flex items-center bg-white border border-[#E7EBF2] p-0.5 rounded-full shadow-xs">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-full text-[12px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-[#1A4FBF] text-white shadow-xs'
                    : 'text-[#5F6B82] hover:text-[#0D1B3E]'
                }`}
                title={t('gridMode')}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('gridMode')}</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('map')}
                className={`px-3 py-1.5 rounded-full text-[12px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'map'
                    ? 'bg-[#1A4FBF] text-white shadow-xs'
                    : 'text-[#5F6B82] hover:text-[#0D1B3E]'
                }`}
                title={t('mapMode')}
              >
                <Map className="w-3.5 h-3.5" />
                <span>{t('mapMode')}</span>
              </button>
            </div>

            {/* Sort button */}
            <button
              type="button"
              onClick={() => setSortHigh(!sortHigh)}
              aria-label={t('sortBy')}
              className="w-10 h-10 rounded-full bg-white border border-[#E7EBF2] shadow-xs flex items-center justify-center text-[#0D1B3E] hover:bg-slate-50 transition-colors cursor-pointer shrink-0"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
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
            <span>{t('favorites')} {savedDealIds.length > 0 ? `(${savedDealIds.length})` : ''}</span>
          </button>

          {/* Core filters */}
          {filters.map((item) => {
            const active = filter === item && !onlyFavorites;
            const filterLabel =
              item === 'All' ? t('filterAll') :
              item === 'Nearby' ? t('filterNearby') :
              item === 'Featured' ? t('filterFeatured') :
              t('filterPopular');
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
                {filterLabel}
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
              {availabilityFilter === 'all' ? t('filterAll') : availabilityFilter === 'available' ? t('filterAvailable') : t('filterLimited')}
            </span>
          </button>

          {selectedCategory && selectedCategory !== 'All' && (
            <button
              type="button"
              onClick={() => setSelectedCategory('All')}
              className="min-h-[38px] px-3.5 rounded-full text-[12px] font-bold bg-[#FFF1E3] text-[#F5820A] border border-[#F5820A]/30 hover:bg-[#ffe6cc] transition-all cursor-pointer shrink-0"
            >
              {t('clearFilters')} ×
            </button>
          )}
        </div>

        {/* Date Range & UAE Holiday Period Picker */}
        <DateRangeFilter
          startDate={dateFilter.startDate}
          endDate={dateFilter.endDate}
          preset={dateFilter.preset}
          selectedHolidayId={dateFilter.selectedHolidayId}
          holidays={holidays}
          onApplyFilter={(range) => setDateFilter(range)}
          onClearFilter={() =>
            setDateFilter({
              startDate: '',
              endDate: '',
              preset: 'all',
              selectedHolidayId: undefined,
            })
          }
          resultsCount={filteredDeals.length}
        />

        {/* Result Row */}
        <div className="flex items-center justify-between text-[12px] text-[#5F6B82] px-0.5">
          <span>{filteredDeals.length} {t('dealsCount')}</span>
          <span className="font-bold text-[#1A4FBF]">
            {sortHigh ? t('sortDiscount') : t('sortPopular')}
          </span>
        </div>

        {/* View Mode Switching: Interactive Map or Deals Grid */}
        {viewMode === 'map' ? (
          <div className="w-full">
            <DealsMap
              deals={filteredDeals}
              onSelectDeal={(deal) => {
                setSelectedDealId(deal.id);
                setActiveView('deal-detail');
              }}
              onClaimCoupon={onClaimCoupon}
              onBookNow={onBookNow}
              onCloseMap={() => setViewMode('grid')}
            />
          </div>
        ) : (
          /* Responsive Deals Grid (1 col mobile, 2 col tablet, 3-4 col desktop) */
          filteredDeals.length > 0 ? (
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
              title={t('noOffersFound')}
              description={onlyFavorites ? t('emptyStateFavoritesDesc') : t('noOffersDesc')}
              actionText={onlyFavorites ? t('emptyStateBrowseDeals') : t('emptyStateResetFilters')}
              onAction={() => {
                setFilter('All');
                setOnlyFavorites(false);
                setAvailabilityFilter('all');
                setSelectedCategory('All');
              }}
            />
          )
        )}
      </div>

      {/* Floating View Switcher Pill for quick thumb access */}
      <div className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-30">
        <button
          type="button"
          onClick={() => setViewMode(viewMode === 'grid' ? 'map' : 'grid')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0D1B3E] hover:bg-[#1A4FBF] text-white font-bold text-xs shadow-xl hover:shadow-2xl transition-all duration-200 active:scale-95 cursor-pointer border border-white/20 select-none"
        >
          {viewMode === 'grid' ? (
            <>
              <Map className="w-4 h-4 text-[#0D9CFD]" />
              <span>{t('openMap')}</span>
            </>
          ) : (
            <>
              <LayoutGrid className="w-4 h-4 text-[#FD9302]" />
              <span>{t('gridMode')}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

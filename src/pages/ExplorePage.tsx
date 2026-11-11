import {discoveryPathForFilters,publicSeoPages} from '../lib/publicSeo';
import {offerSearchText} from '../utils/i18nHelper';
import {translateLiteral} from '../components/LocaleText';
import {useDesignText} from '../components/DesignPrimitives';
import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Heart, CheckCircle2, Map, LayoutGrid } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/PageHeader';
import { DealCard } from '../components/DealCard';
import { DealsMap } from '../components/DealsMap';
import { EmptyState } from '../components/EmptyState';
import { DateRangeFilter } from '../components/DateRangeFilter';
import { Deal, DateFilterPreset } from '../types';
import {isOfferAvailable} from '../utils/offerAvailability';

interface ExplorePageProps {
  onClaimCoupon: (deal: Deal) => void;
  onBookNow: (deal: Deal) => void;
}

export const ExplorePage: React.FC<ExplorePageProps> = ({ onClaimCoupon, onBookNow }) => {
  const {
    deals,
    selectedCity,
    setSelectedCity,
    selectedCategory,
    setSelectedCategory,
    user,
    toggleFavoriteDeal,
    setActiveView,
    setSelectedDealId,
    holidays,
    language,
    isRtl,
    t,
  } = useApp();

  const d=useDesignText();
  const discoveryPath=discoveryPathForFilters(selectedCity,selectedCategory);
  const landing=publicSeoPages[discoveryPath];
  const [query,setQuery]=useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [filter, setFilter] = useState<'All' | 'Nearby' | 'Featured' | 'Popular'>('All');
  const [onlyFavorites, setOnlyFavorites] = useState<boolean>(false);
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'limited'>('all');
  const [sortHigh, setSortHigh] = useState(false);
  const [filterResetKey,setFilterResetKey]=useState(0);

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
    let list = deals.filter((d) => isOfferAvailable(d));
    if (String(selectedCity).toLowerCase() !== 'all') {
      list = list.filter(d => d.city.toLowerCase() === String(selectedCity).toLowerCase());
    }

    if(query.trim())list=list.filter(d=>offerSearchText(d).includes(query.trim().toLocaleLowerCase()));
    // 2. Favorites only toggle
    if (onlyFavorites) {
      list = list.filter((deal) => savedDealIds.includes(deal.id));
    }

    // 3. Category filtering
    if (selectedCategory && selectedCategory !== 'All') {
      list = list.filter((deal) =>
        String(selectedCategory)==='Waterparks' ? /waterpark|water park|aquatic|aquaplay/i.test(`${deal.title} ${deal.description} ${deal.category}`) : selectedCategory==='Restaurants' ? /restaurant|cafe|café|dining|brunch|food & beverage/i.test(`${deal.title} ${deal.category}`) : deal.category.toLowerCase().includes(selectedCategory.toLowerCase())
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
  }, [deals, selectedCategory, selectedCity, query, filter, onlyFavorites, availabilityFilter, dateFilter, sortHigh, savedDealIds]);

  return (
    <div className="paper-explore min-h-screen bg-[#F5F7FA] pb-28">
      <div className="pp-explore-title"><h1>{language==='en'?(discoveryPath==='/dubai'?<>Explore Dubai<br/>Deals & Experiences</>:discoveryPath==='/abu-dhabi'?<>Explore Abu Dhabi<br/>Deals & Experiences</>:discoveryPath==='/dining'?<>Discover<br/>Dining Offers</>:<>Explore<br/>Amazing Experiences</>):d('explore')}</h1><span aria-hidden="true">☀</span></div><p className="pp-discovery-description">{language==='en'?landing.description:d('discovery')}</p><div className="fn-explore-search"><label className="fn-search"><Search size={18}/><input aria-label={d('search')} placeholder={d('search')} value={query} onChange={e=>setQuery(e.target.value)}/></label></div>
      <div className="pp-city-chips" aria-label="Filter by city">{['All','Dubai','Abu Dhabi','Sharjah'].map(city=><button key={city} aria-pressed={selectedCity===city} onClick={()=>setSelectedCity(city as any)}>{city==='All'?t('filterAll'):translateLiteral(city,language)}</button>)}<label><span>{language==='en'?'More':d('allCities')}</span><select aria-label={translateLiteral('Choose city',language)} value={selectedCity} onChange={e=>setSelectedCity(e.target.value as any)}>{['All','Dubai','Abu Dhabi','Sharjah','Ajman','Ras Al Khaimah','Fujairah','Umm Al Quwain'].map(city=><option key={city} value={city}>{city==='All'?d('allCities'):translateLiteral(city,language)}</option>)}</select></label></div>
      {/* Header */}
      <PageHeader
        title={onlyFavorites ? t('savedFavoritesTitle') : (selectedCategory && selectedCategory !== 'All' ? translateLiteral(selectedCategory,language) : d('explore'))}
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
        <details className="pp-date-picker"><summary>{language==='en'?'Date':t('date')} <span>⌄</span></summary><DateRangeFilter
          key={filterResetKey}
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
        /></details>

        {/* Result Row */}
        <div className="flex items-center justify-between text-[12px] text-[#5F6B82] px-0.5">
          <span>{filteredDeals.length} {t('dealsCount')}</span>
          <span className="font-bold text-[#1A4FBF]">
            {sortHigh ? t('sortDiscount') : translateLiteral('Sort: Price low to high',language)}
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
                setFilterResetKey(key=>key+1);
                setQuery('');
                setSelectedCity('All');
                setDateFilter({startDate:'',endDate:'',preset:'all'});
                setSortHigh(false);
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
      <div className="pp-map-shortcut fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-30">
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

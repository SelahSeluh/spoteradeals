import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  ArrowLeft,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DealCard } from '../components/DealCard';
import { SmartFilterChips, FilterState } from '../components/SmartFilterChips';
import { SearchHistoryDropdown } from '../components/SearchHistoryDropdown';
import { useSearchHistory } from '../hooks/useSearchHistory';

export const SearchPage: React.FC = () => {
  const {
    deals,
    searchQuery,
    setSearchQuery,
    setActiveView,
    setSelectedDealId,
    toggleFavoriteDeal,
    user,
    language,
    isRtl,
  } = useApp();

  const [localQuery, setLocalQuery] = useState(searchQuery || '');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [filterState, setFilterState] = useState<FilterState>({});
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const { history, addSearch, removeSearch, clearAll } = useSearchHistory(user?.id);

  // Close history dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsHistoryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectSearch = (query: string) => {
    setLocalQuery(query);
    setSearchQuery(query);
    addSearch(query);
    setIsHistoryOpen(false);
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (localQuery.trim()) {
      addSearch(localQuery.trim());
      setSearchQuery(localQuery.trim());
    }
    setIsHistoryOpen(false);
  };

  const handleClear = () => {
    setLocalQuery('');
    setSearchQuery('');
    setFilterState({});
  };

  // Comprehensive multi-filter matching logic
  const results = useMemo(() => {
    let list = deals;

    // 1. Text keyword search across title, description, category, business, location, tags
    const q = localQuery.trim().toLowerCase();
    if (q) {
      const keywords = q.split(/\s+/).filter((k) => k.length > 0);
      list = list.filter((deal) => {
        const haystack = [
          deal.title,
          deal.title_ar || '',
          deal.category,
          deal.city,
          deal.district || '',
          deal.businessName,
          deal.description,
          deal.description_ar || '',
          ...(deal.tags || []),
        ]
          .join(' ')
          .toLowerCase();

        return keywords.every((kw) => haystack.includes(kw));
      });
    }

    // 2. Smart Filter Chips evaluation
    if (filterState.nearMe) {
      list = list.filter((d) => d.isNearYou || (d.distanceKm && d.distanceKm <= 10));
    }
    if (filterState.mostPopular) {
      list = list.filter((d) => d.isTrending || d.isFeatured || (d.reviewCount && d.reviewCount > 200));
    }
    if (filterState.bestRated) {
      list = list.filter((d) => (d.rating || 4.5) >= 4.7);
    }
    if (filterState.kidsOnly) {
      list = list.filter(
        (d) =>
          d.category.toLowerCase().includes('kids') ||
          d.category.toLowerCase().includes('play') ||
          (d.tags && d.tags.some((t) => t.toLowerCase().includes('kids')))
      );
    }
    if (filterState.familyOnly) {
      list = list.filter(
        (d) =>
          d.category.toLowerCase().includes('family') ||
          (d.tags && d.tags.some((t) => t.toLowerCase().includes('family')))
      );
    }
    if (filterState.attractionsOnly) {
      list = list.filter((d) => d.category.toLowerCase().includes('attraction'));
    }
    if (filterState.foodOnly) {
      list = list.filter(
        (d) =>
          d.category.toLowerCase().includes('restaurant') ||
          d.category.toLowerCase().includes('food') ||
          d.category.toLowerCase().includes('dining')
      );
    }
    if (filterState.activitiesOnly) {
      list = list.filter(
        (d) =>
          d.category.toLowerCase().includes('activit') ||
          d.category.toLowerCase().includes('sport') ||
          d.category.toLowerCase().includes('entertain')
      );
    }
    if (filterState.under100Aed) {
      list = list.filter((d) => (d.discountPrice || 0) < 100);
    }
    if (filterState.highDiscount) {
      list = list.filter((d) => (d.discountPercent || 0) >= 35);
    }
    if (filterState.isNew) {
      list = list.filter((d) => d.isFeatured || d.isTrending);
    }

    return list;
  }, [deals, localQuery, filterState]);

  return (
    <div
      className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-24"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Search Header Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-16 sm:top-20 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveView('home')}
              className="p-2.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label={isRtl ? 'العودة للرئيسية' : 'Back to Home'}
            >
              <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
            </button>

            {/* Input Container with Search History Dropdown */}
            <div ref={searchContainerRef} className="flex-1 relative">
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center bg-slate-100 rounded-2xl px-3.5 py-2.5 border border-slate-200/80 focus-within:border-[#0D9CFD] focus-within:bg-white transition-all shadow-inner"
              >
                <Search className="w-4 h-4 text-slate-400 mr-2 rtl:mr-0 rtl:ml-2 shrink-0" />
                <input
                  type="text"
                  value={localQuery}
                  onFocus={() => setIsHistoryOpen(true)}
                  onChange={(e) => {
                    setLocalQuery(e.target.value);
                    setSearchQuery(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearchSubmit();
                    }
                  }}
                  placeholder={
                    isRtl
                      ? 'ابحث عن العروض، المعالم، ألعاب الأطفال، المطاعم...'
                      : 'Search deals, venues, kids play areas, dining...'
                  }
                  className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none"
                  autoFocus
                />
                {localQuery && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer ml-1 rtl:ml-0 rtl:mr-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </form>

              {/* Search History Dropdown */}
              <SearchHistoryDropdown
                isOpen={isHistoryOpen}
                history={history}
                onSelectSearch={handleSelectSearch}
                onRemoveSearch={removeSearch}
                onClearAll={clearAll}
                isRtl={isRtl}
              />
            </div>
          </div>

          {/* Smart Filter Chips Bar */}
          <div className="mt-3">
            <SmartFilterChips
              filterState={filterState}
              onFilterChange={setFilterState}
              totalResultsCount={results.length}
              isRtl={isRtl}
            />
          </div>
        </div>
      </div>

      {/* Main Results Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              {localQuery
                ? isRtl
                  ? `نتائج البحث عن "${localQuery}"`
                  : `Results for “${localQuery}”`
                : isRtl
                ? 'جميع عروض وباقات الإمارات'
                : 'All UAE Deals & Passes'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {isRtl
                ? `تم العثور على ${results.length} عرض مميز في الإمارات`
                : `Found ${results.length} exclusive offers across UAE`}
            </p>
          </div>
        </div>

        {/* Responsive Grid for Deals */}
        {results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {results.map((deal) => {
              const isSaved = user.savedDealIds?.includes(deal.id);
              return (
                <DealCard
                  key={deal.id}
                  deal={deal}
                  saved={isSaved}
                  onPress={() => {
                    setSelectedDealId(deal.id);
                    setActiveView('deal-detail');
                  }}
                  onToggleFavorite={() => toggleFavoriteDeal(deal.id)}
                />
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center flex flex-col items-center justify-center gap-4 shadow-xs max-w-xl mx-auto my-6">
            <div className="w-16 h-16 rounded-3xl bg-blue-50 text-[#0D9CFD] flex items-center justify-center">
              <Search className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {isRtl
                  ? `لم يتم العثور على عروض لـ "${localQuery}"`
                  : `No deals found for “${localQuery}”`}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                {isRtl
                  ? 'جرب البحث عن كلمة رئيسية أخرى مثل "مدينة مائية"، "بوفيه"، أو "ألعاب أطفال"، أو قم بمسح الفلاتر المحددة.'
                  : 'Try searching for a different keyword like "waterpark", "brunch", or "kids play area", or clear your filter.'}
              </p>
            </div>

            <button
              onClick={handleClear}
              className="px-5 py-2.5 rounded-xl bg-[#0D9CFD] hover:bg-[#0284C7] text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              {isRtl ? 'استعراض كافة العروض' : 'Browse All Deals'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

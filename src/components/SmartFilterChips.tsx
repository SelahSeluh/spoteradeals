import React from 'react';
import {
  Sparkles,
  MapPin,
  Flame,
  Clock,
  Users,
  Baby,
  Utensils,
  Smile,
  Compass,
  Star,
  DollarSign,
  Percent,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export interface FilterState {
  category?: string;
  nearMe?: boolean;
  mostPopular?: boolean;
  isNew?: boolean;
  familyOnly?: boolean;
  kidsOnly?: boolean;
  foodOnly?: boolean;
  activitiesOnly?: boolean;
  attractionsOnly?: boolean;
  bestRated?: boolean; // rating >= 4.7
  under100Aed?: boolean;
  highDiscount?: boolean; // discount >= 35%
}

interface SmartFilterChipsProps {
  filterState: FilterState;
  onFilterChange: (newState: FilterState) => void;
  totalResultsCount?: number;
  className?: string;
  isRtl?: boolean;
}

export const SmartFilterChips: React.FC<SmartFilterChipsProps> = ({
  filterState,
  onFilterChange,
  totalResultsCount,
  className = '',
  isRtl = false,
}) => {
  const { t } = useApp();
  const activeFiltersCount = Object.values(filterState).filter(Boolean).length;

  const handleClearAll = () => {
    onFilterChange({});
  };

  const toggleBoolean = (key: keyof FilterState) => {
    onFilterChange({
      ...filterState,
      [key]: !filterState[key],
    });
  };

  const chips = [
    {
      id: 'all',
      label: t('filterAll') || 'All',
      icon: SlidersHorizontal,
      active: activeFiltersCount === 0,
      onClick: handleClearAll,
    },
    {
      id: 'nearMe',
      label: t('filterNearby') || 'Near Me',
      icon: MapPin,
      active: !!filterState.nearMe,
      onClick: () => toggleBoolean('nearMe'),
    },
    {
      id: 'mostPopular',
      label: t('filterPopular') || 'Most Popular',
      icon: Flame,
      active: !!filterState.mostPopular,
      onClick: () => toggleBoolean('mostPopular'),
    },
    {
      id: 'bestRated',
      label: `${t('rating') || 'Rated'} 4.7+`,
      icon: Star,
      active: !!filterState.bestRated,
      onClick: () => toggleBoolean('bestRated'),
    },
    {
      id: 'kidsOnly',
      label: t('familyExperiences') || 'Kids & Family',
      icon: Baby,
      active: !!filterState.kidsOnly,
      onClick: () => toggleBoolean('kidsOnly'),
    },
    {
      id: 'attractionsOnly',
      label: t('exploreUae') || 'Attractions',
      icon: Compass,
      active: !!filterState.attractionsOnly,
      onClick: () => toggleBoolean('attractionsOnly'),
    },
    {
      id: 'foodOnly',
      label: t('filterByCategory') || 'Dining',
      icon: Utensils,
      active: !!filterState.foodOnly,
      onClick: () => toggleBoolean('foodOnly'),
    },
    {
      id: 'under100Aed',
      label: `< 100 ${t('currency') || 'AED'}`,
      icon: DollarSign,
      active: !!filterState.under100Aed,
      onClick: () => toggleBoolean('under100Aed'),
    },
    {
      id: 'highDiscount',
      label: `35%+ ${t('off') || 'OFF'}`,
      icon: Percent,
      active: !!filterState.highDiscount,
      onClick: () => toggleBoolean('highDiscount'),
    },
    {
      id: 'isNew',
      label: t('filterFeatured') || 'Featured',
      icon: Sparkles,
      active: !!filterState.isNew,
      onClick: () => toggleBoolean('isNew'),
    },
  ];

  return (
    <div
      id="spotera-smart-filter-chips-bar"
      className={`w-full ${className}`}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 px-1 scroll-smooth">
        {/* Clear Filter Chip if active */}
        {activeFiltersCount > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-all shrink-0 min-h-[44px] cursor-pointer shadow-2xs"
            title={t('resetFilters') || 'Reset'}
          >
            <X className="w-3.5 h-3.5" />
            <span>
              {`${t('resetFilters') || 'Clear'} (${activeFiltersCount})`}
            </span>
          </button>
        )}

        {chips.map((chip) => {
          const Icon = chip.icon;
          return (
            <button
              key={chip.id}
              type="button"
              onClick={chip.onClick}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-[13px] font-semibold transition-all shrink-0 min-h-[44px] cursor-pointer whitespace-nowrap select-none ${
                chip.active
                  ? 'bg-[#0D9CFD] text-white shadow-md shadow-[#0D9CFD]/25 border border-[#0D9CFD]'
                  : 'bg-white text-slate-700 hover:text-slate-950 hover:bg-slate-50/90 border border-slate-200/80 shadow-2xs'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${chip.active ? 'text-white' : 'text-slate-500'}`} />
              <span>{chip.label}</span>
            </button>
          );
        })}

        {typeof totalResultsCount === 'number' && (
          <span className="text-[11px] font-medium text-slate-400 shrink-0 px-2">
            {`${totalResultsCount} ${t('dealsCount') || 'deals'}`}
          </span>
        )}
      </div>
    </div>
  );
};

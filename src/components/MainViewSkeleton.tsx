import React from 'react';
import { SkeletonCard, SkeletonCategoryPill, SkeletonHero, SkeletonDetail } from './Skeleton';
import { ViewMode } from '../context/AppContext';

export interface MainViewSkeletonProps {
  /**
   * Layout presentation variant.
   * Defaults to 'auto', which automatically derives the layout from activeView.
   */
  variant?: 'auto' | 'home' | 'grid' | 'detail' | 'profile' | 'requests';
  /**
   * The current active view if passed directly.
   */
  activeView?: ViewMode | string;
  /**
   * Optional custom helper message displayed in the subtle status pill.
   */
  message?: string;
  /**
   * Additional root container CSS classes.
   */
  className?: string;
}

export const MainViewSkeleton: React.FC<MainViewSkeletonProps> = ({
  variant = 'auto',
  activeView = 'home',
  message,
  className = '',
}) => {
  // Resolve effective variant from activeView if 'auto'
  const resolvedVariant = React.useMemo(() => {
    if (variant !== 'auto') return variant;
    if (activeView === 'deal-detail' || activeView === 'business-detail') return 'detail';
    if (
      activeView === 'profile' ||
      activeView === 'bookings' ||
      activeView === 'rewards' ||
      activeView === 'admin' ||
      activeView === 'partners' ||
      activeView === 'membership'
    ) {
      return 'profile';
    }
    if (activeView === 'requests') return 'requests';
    if (
      activeView === 'explore' ||
      activeView === 'categories' ||
      activeView === 'wishlist' ||
      activeView === 'search' ||
      activeView === 'coupons'
    ) {
      return 'grid';
    }
    return 'home';
  }, [variant, activeView]);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading SpoteraDeals content..."
      className={`min-h-[75vh] w-full max-w-full overflow-x-hidden pb-16 transition-opacity duration-300 ${className}`}
    >
      {/* Screen-reader announcement */}
      <span className="sr-only">Loading SpoteraDeals UAE experiences and passes...</span>

      {/* Subtle Top Loading Status Pill */}
      <div className="w-full flex justify-center py-2.5 px-4 sticky top-16 sm:top-20 z-20 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-xs text-xs font-medium text-slate-600 animate-pulse">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
          </span>
          <span>{message || 'SpoteraDeals UAE • Preparing verified family passes & offers...'}</span>
        </div>
      </div>

      {/* Variant 1: Home View Skeleton */}
      {resolvedVariant === 'home' && (
        <div className="space-y-8 sm:space-y-12">
          {/* Playful Hero Banner */}
          <SkeletonHero />

          {/* Value Proposition Strip */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-2xs">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3 p-2">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 shrink-0 animate-pulse" />
                  <div className="space-y-1.5 w-full">
                    <div className="h-3.5 w-20 bg-slate-200 rounded" />
                    <div className="h-2.5 w-28 bg-slate-200/60 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Categories Carousel Skeleton */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="h-6 w-36 sm:w-48 bg-slate-200 rounded-lg" />
                <div className="h-3.5 w-52 sm:w-64 bg-slate-200/70 rounded" />
              </div>
              <div className="h-8 w-20 bg-slate-200 rounded-full hidden sm:block" />
            </div>

            <div className="flex items-center gap-3 overflow-x-hidden pb-2">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <SkeletonCategoryPill key={i} className="shrink-0" />
              ))}
            </div>
          </div>

          {/* Featured Deals Grid Skeleton */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="h-6 w-44 sm:w-56 bg-slate-200 rounded-lg" />
                <div className="h-3.5 w-60 sm:w-72 bg-slate-200/70 rounded" />
              </div>
              <div className="h-9 w-24 bg-slate-200 rounded-xl hidden sm:block" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </div>

          {/* Promotional Banner Placeholder */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-36 sm:h-44 rounded-3xl bg-gradient-to-r from-blue-100/70 to-indigo-100/70 border border-blue-200/60 p-6 flex items-center justify-between animate-shimmer overflow-hidden">
              <div className="space-y-3 max-w-lg">
                <div className="h-6 w-48 bg-blue-200/80 rounded-lg" />
                <div className="h-4 w-72 bg-blue-200/60 rounded" />
                <div className="h-9 w-32 bg-blue-500/30 rounded-xl" />
              </div>
              <div className="h-24 w-24 rounded-2xl bg-white/40 hidden md:block" />
            </div>
          </div>
        </div>
      )}

      {/* Variant 2: Deals / Explore / Search / Categories Grid Skeleton */}
      {resolvedVariant === 'grid' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 space-y-6">
          {/* Header Title + Filter Chips */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="h-7 w-48 bg-slate-200 rounded-lg" />
              <div className="h-4 w-64 bg-slate-200/70 rounded" />
            </div>

            <div className="flex items-center gap-2 overflow-x-hidden pt-1 pb-1">
              {[60, 80, 72, 90, 84, 76].map((w, idx) => (
                <div
                  key={idx}
                  style={{ width: `${w}px` }}
                  className="h-9 rounded-full bg-slate-200/80 shrink-0 animate-pulse"
                />
              ))}
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      )}

      {/* Variant 3: Deal Detail View Skeleton */}
      {resolvedVariant === 'detail' && <SkeletonDetail />}

      {/* Variant 4: User Profile / Bookings / Rewards Skeleton */}
      {resolvedVariant === 'profile' && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          {/* Profile Card Header */}
          <div className="rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-5 shadow-xs">
            <div className="h-20 w-20 rounded-full bg-slate-200 animate-pulse shrink-0" />
            <div className="space-y-2 text-center sm:text-left flex-1">
              <div className="h-6 w-44 bg-slate-200 rounded-md mx-auto sm:mx-0" />
              <div className="h-4 w-32 bg-slate-200/70 rounded mx-auto sm:mx-0" />
              <div className="h-5 w-24 bg-blue-100 rounded-full mx-auto sm:mx-0 mt-2" />
            </div>
          </div>

          {/* Metric Cards Strip */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl bg-white border border-slate-100 p-4 text-center space-y-2 shadow-2xs"
              >
                <div className="h-6 w-12 bg-slate-200 rounded-md mx-auto" />
                <div className="h-3 w-16 bg-slate-200/70 rounded mx-auto" />
              </div>
            ))}
          </div>

          {/* Content Rows */}
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-2xl bg-white border border-slate-100 p-4 sm:p-5 flex items-center justify-between shadow-2xs"
              >
                <div className="space-y-2">
                  <div className="h-4 w-48 bg-slate-200 rounded" />
                  <div className="h-3 w-32 bg-slate-200/60 rounded" />
                </div>
                <div className="h-8 w-20 bg-slate-200 rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Variant 5: Requests Page Skeleton */}
      {resolvedVariant === 'requests' && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1.5">
              <div className="h-7 w-48 bg-slate-200 rounded-lg" />
              <div className="h-4 w-64 bg-slate-200/70 rounded" />
            </div>
            <div className="h-10 w-36 bg-blue-500/30 rounded-xl" />
          </div>

          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl bg-white border border-slate-200/80 p-5 space-y-3 shadow-xs"
              >
                <div className="flex justify-between items-center">
                  <div className="h-5 w-40 bg-slate-200 rounded" />
                  <div className="h-6 w-20 bg-slate-200 rounded-full" />
                </div>
                <div className="h-4 w-full bg-slate-100 rounded" />
                <div className="h-4 w-2/3 bg-slate-100 rounded" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  shimmer?: boolean;
}

/**
 * Primitive Skeleton component with accessible role and subtle animated pulse/shimmer.
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  shimmer = true,
  ...props
}) => {
  return (
    <div
      aria-hidden="true"
      className={`bg-slate-200/80 rounded-md animate-pulse ${
        shimmer ? 'animate-shimmer' : ''
      } ${className}`}
      {...props}
    />
  );
};

/**
 * Deal Card Skeleton replicating the exact layout, aspect ratio, and typography rhythm of Spotera Deal Cards.
 */
export const SkeletonCard: React.FC<{ compact?: boolean; className?: string }> = ({
  compact = false,
  className = '',
}) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-100/90 shadow-sm overflow-hidden flex flex-col transition-all ${className}`}
    >
      {/* Image Banner Skeleton */}
      <div className="relative w-full h-44 sm:h-52 bg-slate-200/90 animate-shimmer overflow-hidden">
        {/* Floating Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <div className="h-5 w-16 bg-slate-300/80 rounded-full" />
          <div className="h-5 w-20 bg-slate-300/60 rounded-full hidden sm:block" />
        </div>
        {/* Favorite Icon Placeholder */}
        <div className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/80 shadow-xs" />
      </div>

      {/* Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          {/* Category & Rating Row */}
          <div className="flex items-center justify-between">
            <div className="h-4 w-24 bg-slate-200 rounded-md" />
            <div className="flex items-center gap-1">
              <div className="h-3.5 w-3.5 rounded-full bg-amber-200" />
              <div className="h-3 w-8 bg-slate-200 rounded" />
            </div>
          </div>

          {/* Title Placeholder */}
          <div className="space-y-1.5 pt-1">
            <div className="h-4 sm:h-5 bg-slate-200 rounded-md w-11/12" />
            <div className="h-4 sm:h-5 bg-slate-200 rounded-md w-3/4" />
          </div>

          {/* Location & Audience Indicator */}
          <div className="flex items-center gap-2 pt-1">
            <div className="h-3.5 w-28 bg-slate-200/80 rounded" />
            <div className="h-1 w-1 rounded-full bg-slate-300" />
            <div className="h-3.5 w-20 bg-slate-200/80 rounded" />
          </div>
        </div>

        {/* Pricing & Call To Action */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="h-3 w-14 bg-slate-200 rounded" />
            <div className="h-5 sm:h-6 w-20 bg-slate-300 rounded-md" />
          </div>
          <div className="h-9 w-24 sm:w-28 rounded-xl bg-blue-100/80" />
        </div>
      </div>
    </div>
  );
};

/**
 * Category Pill Skeleton for Category Carousel & Navigation.
 */
export const SkeletonCategoryPill: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`h-10 sm:h-11 px-4 rounded-xl border border-slate-100 bg-white shadow-2xs flex items-center gap-2.5 animate-pulse ${className}`}
    >
      <div className="h-5 w-5 rounded-md bg-slate-200" />
      <div className="h-3.5 w-20 bg-slate-200 rounded" />
    </div>
  );
};

/**
 * Playful Hero Banner Skeleton matching SpoteraPlayfulHero.
 */
export const SkeletonHero: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`relative w-full overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-slate-50 border-b border-slate-100/80 pt-6 sm:pt-10 pb-10 sm:pb-14 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top UAE Verified Pill */}
        <div className="flex items-center justify-center sm:justify-start">
          <div className="h-7 w-52 rounded-full bg-blue-100/70 animate-shimmer" />
        </div>

        {/* Headline & Subtitle */}
        <div className="space-y-3 text-center sm:text-left max-w-3xl">
          <div className="h-8 sm:h-12 bg-slate-200/90 rounded-xl w-4/5 sm:w-2/3 mx-auto sm:mx-0 animate-shimmer" />
          <div className="h-4 sm:h-5 bg-slate-200/70 rounded-md w-full sm:w-3/4 mx-auto sm:mx-0 animate-shimmer" />
        </div>

        {/* Emirate Filter Pills Strip */}
        <div className="flex items-center gap-2 overflow-x-hidden pt-2 pb-1">
          {[52, 64, 72, 60, 56, 68].map((w, idx) => (
            <div
              key={idx}
              style={{ width: `${w}px` }}
              className="h-8 rounded-full bg-slate-200/70 shrink-0"
            />
          ))}
        </div>

        {/* Search Bar Skeleton Box */}
        <div className="w-full max-w-2xl bg-white p-2 sm:p-2.5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="h-6 w-6 rounded-full bg-slate-200 shrink-0 ml-2" />
          <div className="h-5 bg-slate-200 rounded w-1/2" />
          <div className="ml-auto h-10 w-24 sm:w-28 rounded-xl bg-blue-500/30 shrink-0" />
        </div>
      </div>
    </div>
  );
};

/**
 * Deal Detail Skeleton representing full experience information, photo gallery, and reservation sidebar.
 */
export const SkeletonDetail: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 ${className}`}>
      {/* Breadcrumb row */}
      <div className="flex items-center gap-2">
        <div className="h-4 w-16 bg-slate-200 rounded" />
        <div className="h-3 w-3 bg-slate-200 rounded-full" />
        <div className="h-4 w-28 bg-slate-200 rounded" />
      </div>

      {/* Main Gallery + Title */}
      <div className="space-y-4">
        <div className="w-full h-64 sm:h-96 rounded-3xl bg-slate-200/90 animate-shimmer overflow-hidden" />
        <div className="grid grid-cols-4 gap-2 sm:gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 sm:h-24 rounded-xl bg-slate-200" />
          ))}
        </div>
      </div>

      {/* Two Column Layout: Details & Booking Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-2">
            <div className="h-8 sm:h-10 bg-slate-200 rounded-lg w-3/4" />
            <div className="h-4 bg-slate-200 rounded w-1/3" />
          </div>
          <div className="space-y-3 pt-4">
            <div className="h-4 bg-slate-200 rounded w-full" />
            <div className="h-4 bg-slate-200 rounded w-11/12" />
            <div className="h-4 bg-slate-200 rounded w-4/5" />
          </div>
          <div className="h-48 rounded-2xl bg-slate-100 border border-slate-200/60 p-6 space-y-3">
            <div className="h-5 w-40 bg-slate-200 rounded" />
            <div className="grid grid-cols-2 gap-3 pt-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-4 bg-slate-200 rounded w-5/6" />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Box */}
        <div className="h-80 rounded-3xl bg-white border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div className="h-6 w-24 bg-slate-200 rounded" />
            <div className="h-8 w-28 bg-slate-300 rounded-md" />
          </div>
          <div className="h-12 rounded-xl bg-slate-100" />
          <div className="h-12 rounded-xl bg-slate-100" />
          <div className="h-12 rounded-xl bg-blue-500/40 w-full mt-4" />
        </div>
      </div>
    </div>
  );
};

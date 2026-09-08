import React from 'react';
import { ArrowRight, Sparkles, Flame } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DealCard } from './DealCard';

export const FeaturedDealsSection: React.FC = () => {
  const { deals, setActiveView, setSelectedCategory } = useApp();

  // Get top 4 featured deals matching the mockup layout
  const featuredDeals = React.useMemo(() => {
    const published = deals.filter((d) => d.isPublished !== false);
    const featured = published.filter((d) => d.isFeatured || d.isTrending || (d.rating && d.rating >= 4.8));
    if (featured.length >= 4) {
      return featured.slice(0, 4);
    }
    return published.slice(0, 4);
  }, [deals]);

  return (
    <section className="space-y-4 font-sans select-none">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Featured Deals
          </h2>
        </div>

        <button
          onClick={() => {
            setSelectedCategory('All');
            setActiveView('explore');
          }}
          className="text-xs sm:text-sm font-bold text-slate-600 hover:text-[#0D9CFD] flex items-center gap-1 transition-colors cursor-pointer group"
        >
          <span>View all</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Grid of 4 Deal Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {featuredDeals.map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}
      </div>
    </section>
  );
};

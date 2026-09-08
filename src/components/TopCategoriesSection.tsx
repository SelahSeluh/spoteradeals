import React from 'react';
import {
  Baby,
  Utensils,
  Gamepad2,
  Compass,
  ShoppingBag,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const TopCategoriesSection: React.FC = () => {
  const { setSelectedCategory, setActiveView } = useApp();

  const categories = [
    {
      id: 'kids',
      name: 'Kids',
      categoryKey: 'Kids Play Areas',
      icon: Baby,
      imageUrl: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=600&q=80',
      badgeColor: 'bg-[#0D9CFD] text-white',
      badgeBorder: 'border-white',
    },
    {
      id: 'restaurants',
      name: 'Restaurants',
      categoryKey: 'Restaurants',
      icon: Utensils,
      imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
      badgeColor: 'bg-[#FD9302] text-white',
      badgeBorder: 'border-white',
    },
    {
      id: 'entertainment',
      name: 'Entertainment',
      categoryKey: 'Attractions',
      icon: Gamepad2,
      imageUrl: 'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?auto=format&fit=crop&w=600&q=80',
      badgeColor: 'bg-[#9333EA] text-white',
      badgeBorder: 'border-white',
    },
    {
      id: 'activities',
      name: 'Activities',
      categoryKey: 'Desert & Water Safaris',
      icon: Compass,
      imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
      badgeColor: 'bg-[#0D9488] text-white',
      badgeBorder: 'border-white',
    },
    {
      id: 'shopping',
      name: 'Shopping',
      categoryKey: 'Retail & Wellness',
      icon: ShoppingBag,
      imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80',
      badgeColor: 'bg-[#EA580C] text-white',
      badgeBorder: 'border-white',
    },
  ];

  const handleCategorySelect = (categoryKey: string) => {
    setSelectedCategory(categoryKey as any);
    setActiveView('explore');
  };

  return (
    <section className="space-y-4 font-sans select-none">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Top Categories
        </h2>

        <button
          onClick={() => setActiveView('categories')}
          className="text-xs sm:text-sm font-bold text-slate-600 hover:text-[#0D9CFD] flex items-center gap-1 transition-colors cursor-pointer group"
        >
          <span>View all</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Grid of 5 Category Image Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.id}
              onClick={() => handleCategorySelect(cat.categoryKey)}
              className="group relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 hover:border-[#0D9CFD] shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer aspect-[4/3] sm:aspect-[4/3.5] flex flex-col justify-end p-2.5 sm:p-3"
            >
              {/* Background Lifestyle Image */}
              <img
                src={cat.imageUrl}
                alt={cat.name}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
              />

              {/* Gradient Scrim for Contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />

              {/* Bottom Pill Badge with Icon */}
              <div className="relative z-10 flex items-center justify-center">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${cat.badgeColor} border ${cat.badgeBorder} text-xs font-black shadow-md backdrop-blur-xs`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.name}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

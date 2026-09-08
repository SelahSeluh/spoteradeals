import React, { useState, useMemo } from 'react';
import { Compass } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/PageHeader';
import { SearchField } from '../components/SearchField';
import { CategoryCard, CategoryInfo } from '../components/CategoryCard';
import { EmptyState } from '../components/EmptyState';

export const CategoriesPage: React.FC = () => {
  const { setSelectedCategory, setActiveView } = useApp();
  const [query, setQuery] = useState('');

  const initialCategories: CategoryInfo[] = [
    {
      id: 'kids',
      name: 'Kids',
      imageUrl: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=900&q=85',
      dealCount: 18,
      color: '#1A4FBF',
    },
    {
      id: 'restaurants',
      name: 'Restaurants',
      imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85',
      dealCount: 26,
      color: '#F5820A',
    },
    {
      id: 'entertainment',
      name: 'Entertainment',
      imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=85',
      dealCount: 14,
      color: '#E94C78',
    },
    {
      id: 'activities',
      name: 'Activities',
      imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=900&q=85',
      dealCount: 22,
      color: '#00B5A5',
    },
    {
      id: 'shopping',
      name: 'Shopping',
      imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=85',
      dealCount: 31,
      color: '#7655D5',
    },
    {
      id: 'beauty',
      name: 'Beauty & Spa',
      imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=85',
      dealCount: 16,
      color: '#E94C78',
    },
    {
      id: 'travel',
      name: 'Travel & Hotels',
      imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=900&q=85',
      dealCount: 12,
      color: '#1A4FBF',
    },
    {
      id: 'health',
      name: 'Fitness & Sport',
      imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=85',
      dealCount: 15,
      color: '#00B5A5',
    },
  ];

  const filteredCategories = useMemo(() => {
    if (!query.trim()) return initialCategories;
    const q = query.trim().toLowerCase();
    return initialCategories.filter((c) => c.name.toLowerCase().includes(q));
  }, [query]);

  const handleCategoryPress = (category: CategoryInfo) => {
    // Map to app context category
    let mappedCategory = 'All';
    if (category.id === 'kids') mappedCategory = 'Kids Play Areas';
    else if (category.id === 'restaurants') mappedCategory = 'Restaurants';
    else if (category.id === 'entertainment') mappedCategory = 'Entertainment';
    else if (category.id === 'activities') mappedCategory = 'Family Experiences';
    else if (category.id === 'travel') mappedCategory = 'Hotels';

    setSelectedCategory(mappedCategory as any);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveView('explore');
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-28">
      {/* Page Header */}
      <PageHeader title="Categories" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-1 space-y-5">
        {/* Intro */}
        <p className="text-[13px] text-[#5F6B82] font-normal leading-5">
          Find your next reason to get together across UAE family attractions and dining.
        </p>

        {/* Search Field */}
        <div className="max-w-md">
          <SearchField
            value={query}
            onChangeText={setQuery}
            onSubmit={() => {}}
            placeholder="Search categories"
          />
        </div>

        {/* Categories Grid (2 cols mobile, 3 tablet, 4 desktop) */}
        {filteredCategories.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 sm:gap-5 pt-1">
            {filteredCategories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onPress={() => handleCategoryPress(category)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="search"
            title="No category found"
            description="Try a shorter search or browse all of our family-friendly categories."
            actionText="Show all categories"
            onAction={() => setQuery('')}
          />
        )}

        {/* Help Card */}
        <div
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setActiveView('explore');
          }}
          className="rounded-[18px] bg-white border border-[#E7EBF2] p-4 flex items-center gap-3.5 shadow-[0_4px_14px_rgba(16,43,100,0.08)] cursor-pointer hover:border-[#1A4FBF] transition-all"
        >
          <div className="w-10 h-10 rounded-[14px] bg-[#FFF1E3] flex items-center justify-center shrink-0">
            <Compass className="w-5 h-5 text-[#F5820A]" />
          </div>
          <div>
            <h4 className="text-[13px] font-bold text-[#0D1B3E]">
              Not sure where to start?
            </h4>
            <p className="text-[11px] text-[#5F6B82] mt-0.5">
              Browse our most-loved deals for a little inspiration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

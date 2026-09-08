import React from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/PageHeader';
import { DealCard } from '../components/DealCard';
import { EmptyState } from '../components/EmptyState';

export const FavoritesPage: React.FC = () => {
  const { deals, user, toggleFavoriteDeal, setActiveView, setSelectedDealId } = useApp();

  const savedDealIds = user.savedDealIds || [];
  const favoriteDeals = deals.filter((deal) => savedDealIds.includes(deal.id));

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-28">
      {/* Page Header */}
      <PageHeader
        title="Favorites"
        showBack={false}
      />

      <div className="max-w-2xl mx-auto px-5 pt-1">
        {/* Subtitle */}
        <p className="text-[13px] text-[#5F6B82] font-normal leading-5 mb-3.5">
          {favoriteDeals.length} saved {favoriteDeals.length === 1 ? 'deal' : 'deals'} ready for your next day out.
        </p>

        {favoriteDeals.length === 0 ? (
          <EmptyState
            icon="heart"
            title="Your favorites are waiting"
            description="Save the experiences your family loves so they are always easy to find."
            actionText="Browse deals"
            onAction={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setActiveView('explore');
            }}
          />
        ) : (
          <div className="flex flex-col gap-3.5">
            {favoriteDeals.map((deal) => (
              <DealCard
                key={deal.id}
                deal={deal}
                saved={true}
                onPress={() => {
                  setSelectedDealId(deal.id);
                  setActiveView('deal-detail');
                }}
                onToggleFavorite={() => toggleFavoriteDeal(deal.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

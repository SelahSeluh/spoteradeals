import React from 'react';
import { useApp } from '../context/AppContext';
import { Deal } from '../types';
import { SpoteraPlayfulHero } from '../components/SpoteraPlayfulHero';
import { WhySpoteraSection } from '../components/WhySpoteraSection';
import { TopCategoriesSection } from '../components/TopCategoriesSection';
import { FeaturedDealsSection } from '../components/FeaturedDealsSection';
import { DailySpotlightSection } from '../components/DailySpotlightSection';
import { PromoCouponBanner } from '../components/PromoCouponBanner';

interface HomePageProps {
  onClaimCoupon: (deal: Deal) => void;
  onBookNow: (deal: Deal) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onClaimCoupon, onBookNow }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20 sm:pb-24 space-y-8 sm:space-y-12">
      {/* 1. Main Spotera Playful Hero Banner with Search & Emirate Filter */}
      <SpoteraPlayfulHero />

      {/* 2. Value Proposition Strip: Best Prices, Trusted Partners, Easy Booking, Family Friendly, Rewards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <WhySpoteraSection />
      </div>

      {/* 3. Top Categories Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TopCategoriesSection />
      </div>

      {/* 4. Featured Deals Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FeaturedDealsSection />
      </div>

      {/* 5. Daily AI Family Spotlight Section */}
      <DailySpotlightSection
        onClaimCoupon={onClaimCoupon}
        onBookNow={onBookNow}
      />

      {/* 6. Promotional Voucher / Coupon Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PromoCouponBanner />
      </div>
    </div>
  );
};

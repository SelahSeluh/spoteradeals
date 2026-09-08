import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';
import { ToastContainer } from './components/ToastContainer';
import { OpeningAnimation } from './components/OpeningAnimation';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CouponModal } from './components/CouponModal';
import { BookingModal } from './components/BookingModal';
import { LinkShareModal } from './components/LinkShareModal';
import { BottomNav } from './components/BottomNav';
import { WhatsAppButton } from './components/WhatsAppButton';
import { WelcomeAuthModal } from './components/WelcomeAuthModal';
import { QrScannerModal } from './components/QrScannerModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { OfflineAlertBanner } from './components/OfflineAlertBanner';

import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { FamilyPage } from './pages/FamilyPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { DealDetailPage } from './pages/DealDetailPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { ProfilePage } from './pages/ProfilePage';
import { BookingsPage } from './pages/BookingsPage';
import { RewardsPage } from './pages/RewardsPage';
import { SearchPage } from './pages/SearchPage';
import { BookingConfirmPage } from './pages/BookingConfirmPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { PartnerDashboard } from './pages/PartnerDashboard';
import { MembershipPage } from './pages/MembershipPage';
import { AuthPage } from './pages/AuthPage';
import { RequestsPage } from './pages/RequestsPage';
import {
  AboutPage,
  ContactPage,
  FaqPage,
  PrivacyPage,
  TermsPage,
} from './pages/ContentPages';

import { Deal, Coupon } from './types';
import { safeSessionStorage } from './utils/storage';
import { MainViewSkeleton } from './components/MainViewSkeleton';

const MainAppContent: React.FC = () => {
  const {
    hasEnteredApp,
    activeView,
    isAppInitializing,
    isViewLoading,
    claimCoupon,
    requireUserAuth,
    showLinksModal,
    setShowLinksModal,
    showWelcomeModal,
    setShowWelcomeModal,
  } = useApp();

  const [claimedCouponModalData, setClaimedCouponModalData] = useState<Coupon | null>(null);
  const [bookingModalDeal, setBookingModalDeal] = useState<Deal | null>(null);

  const handleClaimCoupon = (deal: Deal) => {
    requireUserAuth('Sign in or register to claim this digital coupon voucher & QR pass.', () => {
      const coupon = claimCoupon(deal);
      setClaimedCouponModalData(coupon);
    });
  };

  const handleBookNow = (deal: Deal) => {
    requireUserAuth('Sign in or register to book your family activity tickets online.', () => {
      setBookingModalDeal(deal);
    });
  };

  // Pre-entry gate: Show startup splash animation & AuthPage (Apple / Guest)
  // Home/Deals bottom navigation and header controls are excluded before entry
  if (!hasEnteredApp) {
    return (
      <div className="min-h-screen w-full max-w-full overflow-x-hidden flex flex-col font-sans selection:bg-blue-600 selection:text-white transition-colors duration-300 relative spotera-mesh-canvas text-slate-900">
        {/* Startup Splash Animation Overlay */}
        <OpeningAnimation />

        {/* Authentication Gateway: Sign in with Apple & Continue as Guest */}
        <AuthPage />

        {/* Toast Notifications */}
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden flex flex-col font-sans selection:bg-blue-600 selection:text-white transition-colors duration-300 relative spotera-mesh-canvas text-slate-900">
      {/* Offline Alert Sticky Banner */}
      <OfflineAlertBanner />

      {/* Intro Animation (Overlay, if replayed or triggered) */}
      <OpeningAnimation />

      {/* Top Navbar */}
      <Navbar />

      {/* Main View Area */}
      <ErrorBoundary>
        <main className="flex-1 w-full max-w-full overflow-x-hidden pb-20 md:pb-8">
          {isAppInitializing || isViewLoading ? (
            <MainViewSkeleton activeView={activeView} />
          ) : (
            <React.Suspense fallback={<MainViewSkeleton activeView={activeView} />}>
              {(activeView === 'home' || activeView === 'deals' || (![
                'explore', 'requests', 'family', 'categories', 'wishlist', 'deal-detail',
                'profile', 'bookings', 'rewards', 'search', 'booking-confirm', 'coupons',
                'admin', 'partners', 'membership', 'auth', 'about', 'contact', 'faq',
                'privacy', 'terms'
              ].includes(activeView))) && (
                <HomePage onClaimCoupon={handleClaimCoupon} onBookNow={handleBookNow} />
              )}
              {activeView === 'explore' && (
                <ExplorePage onClaimCoupon={handleClaimCoupon} onBookNow={handleBookNow} />
              )}
              {activeView === 'requests' && <RequestsPage />}
              {activeView === 'family' && (
                <FamilyPage onClaimCoupon={handleClaimCoupon} onBookNow={handleBookNow} />
              )}
              {activeView === 'categories' && <CategoriesPage />}
              {activeView === 'wishlist' && <FavoritesPage />}
              {activeView === 'deal-detail' && (
                <DealDetailPage onClaimCoupon={handleClaimCoupon} onBookNow={handleBookNow} />
              )}
              {activeView === 'profile' && <ProfilePage />}
              {activeView === 'bookings' && <BookingsPage />}
              {activeView === 'rewards' && <RewardsPage />}
              {activeView === 'search' && <SearchPage />}
              {activeView === 'booking-confirm' && <BookingConfirmPage />}
              {activeView === 'coupons' && (
                <UserProfilePage onClaimCoupon={handleClaimCoupon} onBookNow={handleBookNow} />
              )}
              {activeView === 'admin' && <AdminDashboard />}
              {activeView === 'partners' && <PartnerDashboard />}
              {activeView === 'membership' && <MembershipPage />}
              {activeView === 'auth' && <AuthPage />}
              {activeView === 'about' && <AboutPage />}
              {activeView === 'contact' && <ContactPage />}
              {activeView === 'faq' && <FaqPage />}
              {activeView === 'privacy' && <PrivacyPage />}
              {activeView === 'terms' && <TermsPage />}
            </React.Suspense>
          )}
        </main>
      </ErrorBoundary>

      {/* Claimed Coupon Modal */}
      {claimedCouponModalData && (
        <CouponModal
          coupon={claimedCouponModalData}
          onClose={() => setClaimedCouponModalData(null)}
        />
      )}

      {/* Activity Booking Modal */}
      {bookingModalDeal && (
        <BookingModal
          deal={bookingModalDeal}
          onClose={() => setBookingModalDeal(null)}
        />
      )}

      {/* Access Links Modal for Users & Admin */}
      {showLinksModal && <LinkShareModal onClose={() => setShowLinksModal(false)} />}

      {/* Initial Onboarding & Auth Modal (Login / Sign Up) */}
      <WelcomeAuthModal
        isOpen={showWelcomeModal}
        onClose={() => {
          safeSessionStorage.setItem('spotera_welcome_modal_seen', 'true');
          setShowWelcomeModal(false);
        }}
      />

      {/* WhatsApp Floating Contact Button */}
      <WhatsAppButton />

      {/* Global QR Code Scanner Modal */}
      <QrScannerModal />

      {/* Global Toast Notifications Container */}
      <ToastContainer />

      {/* Footer (Desktop only) */}
      <div className="hidden md:block">
        <Footer />
      </div>

      {/* Mobile Floating Bottom Navigation Bar */}
      <BottomNav />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <MainAppContent />
      </ToastProvider>
    </AppProvider>
  );
}

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';
import { ToastContainer } from './components/ToastContainer';
import { OpeningAnimation } from './components/OpeningAnimation';
import { Navbar } from './components/Navbar';
import { ExpeditionSkyline } from './components/ExpeditionScenery';
import { Footer } from './components/Footer';
import { CouponModal } from './components/CouponModal';
import { BookingModal } from './components/BookingModal';
import { LinkShareModal } from './components/LinkShareModal';
import { BottomNav } from './components/BottomNav';
import { PaperChat } from './components/PaperChat';
import { WelcomeAuthModal } from './components/WelcomeAuthModal';
import { QrScannerModal } from './components/QrScannerModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { OfflineAlertBanner } from './components/OfflineAlertBanner';

import { SettingsPage } from './pages/SettingsPage';
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
    user,
    isLoggedIn,
    hasEnteredApp,
    activeView,
    isAppInitializing,
    isViewLoading,
    startupPhase,
    showOpeningAnimation,
    dismissOpeningAnimation,
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

  // Startup overlay takes precedence over the authentication page.
  if (startupPhase === 'intro' || showOpeningAnimation) {
    return <OpeningAnimation onPreviewClose={dismissOpeningAnimation} />;
  }

  // 1. AUTHENTICATION VIEW: Render full Auth Page when activeView is explicitly 'auth'
  if (activeView === 'auth') {
    return (
      <div id="spotera-auth-screen" className="min-h-screen w-full spotera-mesh-canvas flex flex-col justify-center items-center select-none relative">
        <AuthPage />
        <ToastContainer />
      </div>
    );
  }

  // 2. SECURE ADMIN APPLICATION: If signed in as Admin, strictly render the Admin Dashboard
  if (user && user.role === 'ADMIN') {
    return (
      <div className="min-h-screen w-full flex flex-col font-sans bg-slate-50 text-slate-900">
        <AdminDashboard />
        <QrScannerModal />
        <ToastContainer />
      </div>
    );
  }

  // 3. MAIN CUSTOMER & GUEST APPLICATION: Always mounted & rendered smoothly
  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden flex flex-col font-sans selection:bg-blue-600 selection:text-white transition-colors duration-300 relative spotera-mesh-canvas text-slate-900">
      {/* Offline Alert Sticky Banner */}
      <OfflineAlertBanner />

      {/* Top Navbar */}
      <Navbar />

      {/* Main View Area */}
      <ErrorBoundary>
        <main data-paper-page={activeView} className="flex-1 w-full max-w-full overflow-x-hidden pb-20 md:pb-8">
          {isAppInitializing || isViewLoading ? (
            <MainViewSkeleton activeView={activeView} />
          ) : (
            <React.Suspense fallback={<MainViewSkeleton activeView={activeView} />}>
              {(activeView === 'home' || activeView === 'deals' || (![
                'explore', 'requests', 'family', 'categories', 'wishlist', 'deal-detail',
                'profile', 'bookings', 'rewards', 'search', 'booking-confirm', 'coupons',
                'admin', 'partners', 'membership', 'auth', 'about', 'contact', 'faq',
                'privacy', 'terms', 'settings'
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
              {activeView === 'settings' && <SettingsPage />}
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
      <PaperChat />

      {/* Global QR Code Scanner Modal */}
      <QrScannerModal />

      {/* Global Toast Notifications Container */}
      <ToastContainer />

      {/* Shared footer remains accessible on every screen. */}
      <Footer />

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

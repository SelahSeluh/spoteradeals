import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import {
  User,
  Business,
  Deal,
  Coupon,
  Booking,
  Review,
  Language,
  City,
  Category,
  FamilyTheme,
  FooterConfig,
  FooterLink,
  SupportMessage,
  FamilyProfile,
  ReferralProgram,
  HomepageConfig,
  DailySpotlightData,
  HeroSlide,
  HomepageSection,
  SiteBrandingConfig,
  CategoryItem,
  LocationItem,
  MediaItem,
  UserRequest,
  RequestQuote,
  FindMeProduct,
  FindMeService,
  IntroAnimationConfig,
  StartupPhase,
  UaePublicHoliday,
  LoyaltyRuleConfig,
  LoyaltyTierConfig,
  LoyaltyHistoryItem,
  LoyaltyActionType,
} from '../types';
import {useCmsSync} from '../hooks/useCmsSync';
import { expeditionCatalog } from '../utils/expeditionImages';
import { defaultIntroConfig } from '../lib/defaultConfigs';
import {
  defaultUaeHolidays,
  defaultLoyaltyRules,
  defaultLoyaltyTiers,
} from '../lib/loyaltyAndHolidayDefaults';
import { safeTranslate } from '../utils/i18nHelper';
import {
  defaultGuestUser,
  initialBusinesses,
  initialDeals,
  initialHeroSlides,
  initialCategoriesList,
  initialLocationsList,
  initialMediaLibrary,
  initialBrandingConfig,
  initialFindMeProducts,
  initialFindMeServices,
} from '../lib/mockData';
import { translations } from '../lib/translations';
import { authService, GoogleProfilePayload, EmailRegisterPayload } from '../services/authService';
import { safeLocalStorage, safeSessionStorage, safeStorage } from '../utils/storage';

// Scope safe storage wrappers locally to prevent any SecurityError or DOMException in sandboxed iframes
const localStorage = safeLocalStorage;
const sessionStorage = safeSessionStorage;

function safeJsonParse<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export const defaultHomepageConfig: HomepageConfig = {
  heroTitle: "More Fun. More Together.",
  heroHighlightText: "Amazing deals for every family moment.",
  heroSubtitle: "Discover Dubai, Abu Dhabi & UAE's best kids play areas, theme parks, dining passes, and family entertainment.",
  heroBadgeText: "SpoteraDeals • UAE Family Passes & Deals",
  heroBgStyle: "blue-gradient",
  heroSlides: [],
  heroPostcardMode: 'slideshow',
  heroIncludeTopOffers: true,
  heroPostcardCaption: 'Explore. Play. Discover. Together.',
  heroAutoPlaySpeedSeconds: 5,
  sections: [
    { id: 'hero', title: 'Hero Family Deals', enabled: true, order: 1 },
    { id: 'categories', title: 'Top Categories', enabled: true, order: 2 },
    { id: 'trending', title: 'Trending UAE Deals', subtitle: 'Popular limited-time offers with instant redemption', enabled: true, order: 3 },
    { id: 'near-you', title: 'Deals Near You', subtitle: 'Discounts in your selected UAE Emirate & neighborhood', enabled: true, order: 4 },
    { id: 'all-deals', title: 'All Deals & Experiences', subtitle: 'Complete catalog of verified family experiences', enabled: true, order: 5 },
    { id: 'guest-cta', title: 'VIP Pass Banner', enabled: true, order: 6 },
  ],
  showTrialBanner: true,
  trialBannerTitle: "Unlock Unlimited VIP Family Savings",
  trialBannerText: "Join Spotera VIP for extra 20% off all kids play areas, theme parks, and family brunches across the UAE.",
  trialBadgeText: "Spotera VIP",
  showDailySpotlight: true,
  featuredSectionTitle: "Trending & Exclusive Offers",
  featuredSectionSubtitle: "Top-rated family deals handpicked by our curators",
  playAreaSectionTitle: "Kids Play Areas & Soft Play Zones",
  promoSlot1: {
    type: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=85',
    imageAlt: 'SpoteraDeals Happy Family in Dubai',
    slideshowImages: [
      'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1200&q=85',
    ],
    slideshowSpeedSeconds: 4,
    videoUrl: '',
  },
  promoSlot2: {
    type: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?auto=format&fit=crop&w=600&q=85',
    imageAlt: 'UAE Theme Park & Coasters',
    slideshowImages: [
      'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?auto=format&fit=crop&w=600&q=85',
      'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=600&q=85',
    ],
    slideshowSpeedSeconds: 4,
    videoUrl: '',
  },
  promoSlot3: {
    type: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=85',
    imageAlt: 'Family Dining and Desserts UAE',
    slideshowImages: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=85',
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=85',
    ],
    slideshowSpeedSeconds: 4,
    videoUrl: '',
  },
  discountBadgeTextTop: 'UP TO',
  discountBadgePercent: '50%',
  discountBadgeTextBottom: 'OFF',
};

export const defaultFooterConfig: FooterConfig = {
  companyName: 'SpoteraDeals',
  description:
    'SpoteraDeals connects families and adults with verified deals, dining offers, attractions, kids play areas, and instant passes in AED.',
  businessAddress: '',
  contactEmail: '',
  contactPhone: '',
  copyrightText: '© 2026 SpoteraDeals. All rights reserved.',
  socialLinks: {
    instagram: 'https://www.instagram.com',
    facebook: 'https://facebook.com',
    linkedin: 'https://linkedin.com',
    twitter: 'https://x.com',
  },
  sections: {
    showCities: true,
    showCategories: true,
    showPartnerLegal: true,
    showTrustBadges: true,
  },
  customLinks: [
    { id: '1', label: 'Partner Venue Portal', url: '#partners', targetView: 'partners', enabled: true },
    { id: '2', label: 'About Us', url: '#about', targetView: 'about', enabled: true },
    { id: '3', label: 'FAQ & Help', url: '#faq', targetView: 'faq', enabled: true },
    { id: '4', label: 'Privacy Policy', url: '#privacy', targetView: 'privacy', enabled: true },
    { id: '5', label: 'Terms & Conditions', url: '#terms', targetView: 'terms', enabled: true },
  ],
};


export type ViewMode =
  | 'home'
  | 'explore'
  | 'deals'
  | 'requests'
  | 'family'
  | 'categories'
  | 'deal-detail'
  | 'business-detail'
  | 'coupons'
  | 'bookings'
  | 'wishlist'
  | 'membership'
  | 'about'
  | 'contact'
  | 'faq'
  | 'privacy'
  | 'settings'
  | 'terms'
  | 'profile'
  | 'admin'
  | 'partners'
  | 'rewards'
  | 'search'
  | 'booking-confirm'
  | 'auth';

interface AppContextType {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  businesses: Business[];
  deals: Deal[];
  coupons: Coupon[];
  bookings: Booking[];
  reviews: Review[];
  // Requests & Sourcing System
  userRequests: UserRequest[];
  requestQuotes: RequestQuote[];
  postUserRequest: (req: Omit<UserRequest, 'id' | 'createdAt' | 'status' | 'quotesCount'>) => UserRequest;
  cancelUserRequest: (id: string) => void;
  acceptQuote: (quoteId: string) => void;
  products: FindMeProduct[];
  services: FindMeService[];
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRtl: boolean;
  familyTheme: FamilyTheme;
  setFamilyTheme: (theme: FamilyTheme) => void;
  showLinksModal: boolean;
  setShowLinksModal: (show: boolean) => void;
  activeView: ViewMode;
  setActiveView: (view: ViewMode) => void;
  previousView: ViewMode;
  goBack: () => void;
  selectedDealId: string | null;
  setSelectedDealId: (id: string | null) => void;
  selectedBookingId: string | null;
  setSelectedBookingId: (id: string | null) => void;
  selectedBusinessId: string | null;
  setSelectedBusinessId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCity: City | 'All';
  setSelectedCity: (city: City | 'All') => void;
  selectedCategory: Category | 'All';
  setSelectedCategory: (cat: Category | 'All') => void;
  startupPhase: StartupPhase;
  setStartupPhase: React.Dispatch<React.SetStateAction<StartupPhase>>;
  showOpeningAnimation: boolean;
  dismissOpeningAnimation: () => void;
  replaySplashAnimation: () => void;
  returnToAuthScreen: () => void;
  isQrScannerOpen: boolean;
  setIsQrScannerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isAppInitializing: boolean;
  isViewLoading: boolean;
  setIsViewLoading: (loading: boolean) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  hasEnteredApp: boolean;
  setHasEnteredApp: React.Dispatch<React.SetStateAction<boolean>>;
  isGuest: boolean;
  showWelcomeModal: boolean;
  setShowWelcomeModal: React.Dispatch<React.SetStateAction<boolean>>;
  authModalReason: string;
  setAuthModalReason: (reason: string) => void;
  requireUserAuth: (reason?: string, onAuthorized?: () => void) => boolean;
  handleAuthSuccess: (user: User, token?: string) => void;
  continueAsGuest: () => void;
  logout: () => void;
  // Admin & Partner Auth Security
  isAdminAuthenticated: boolean;
  adminEmail: string;
  adminSubRole?: string;
  hasAdminPasswordSet: boolean;
  sessionToken: string | null;
  adminLoginWithCreds: (email: string, pass: string) => Promise<{ success: boolean; message: string }>;
  setupAdminAccount: (email: string, pass: string) => void;
  changeAdminPassword: (newPass: string) => Promise<boolean>;
  adminLogout: () => void;

  isPartnerAuthenticated: boolean;
  partnerEmail: string;
  hasPartnerPasswordSet: boolean;
  partnerLoginWithCreds: (email: string, pass: string) => { success: boolean; message: string };
  setupPartnerAccount: (email: string, pass: string) => void;
  changePartnerPassword: (newPass: string) => void;
  partnerLogout: () => void;
  // Core domain actions
  claimCoupon: (deal: Deal) => Promise<Coupon>;
  redeemCoupon: (couponCode: string) => boolean;
  redeemCode: (code: string, businessName?: string) => Promise<{
    success: boolean;
    type?: 'booking' | 'coupon';
    title?: string;
    customerName?: string;
    code?: string;
    message: string;
  }>;
  createBooking: (
    deal: Deal,
    date: string,
    timeSlot: string,
    childrenCount: number,
    packageName: string,
    totalPrice: number
  ) => Promise<Booking>;
  cancelBooking: (bookingId: string) => Promise<boolean>;
  updateBookingStatus: (bookingId: string, status: Booking['status']) => void;
  toggleFavoriteDeal: (dealId: string) => void;
  addReview: (dealId: string, rating: number, comment: string) => void;
  upgradeMembership: (plan?: 'Free' | 'Spotera VIP' | 'Premium VIP' | 'VIP Family Pass' | string) => void;
  // Admin & Partner CRUD
  addBusiness: (business: Omit<Business, 'id' | 'rating' | 'reviewCount'>) => void;
  editBusiness: (business: Business) => void;
  deleteBusiness: (id: string) => void;
  updateBusinessStatus: (id: string, status: 'approved' | 'rejected', verified?: boolean) => void;
  addDeal: (deal: Omit<Deal, 'id' | 'rating' | 'reviewCount'>) => void;
  editDeal: (deal: Deal) => void;
  deleteDeal: (id: string) => void;
  deleteReview: (reviewId: string) => void;
  // Deal Extended Actions
  duplicateDeal: (id: string) => void;
  togglePublishDeal: (id: string) => void;
  toggleFeaturedDeal: (id: string) => void;
  toggleTrendingDeal: (id: string) => void;
  reorderDeals: (reorderedDeals: Deal[]) => void;
  // Geolocation & Distance
  userLocation: { lat: number; lng: number } | null;
  requestUserLocation: () => Promise<boolean>;
  calculateDistanceKm: (lat: number, lng: number) => number | null;
  // Dynamic Homepage & Branding Configuration
  cmsSaveStatus: string;
  retryCmsSave: () => void;
  homepageConfig: HomepageConfig;
  updateHomepageConfig: (config: Partial<HomepageConfig>) => void;
  // Hero Slides CMS
  addHeroSlide: (slide: Omit<HeroSlide, 'id'>) => void;
  editHeroSlide: (slide: HeroSlide) => void;
  deleteHeroSlide: (id: string) => void;
  reorderHeroSlides: (slides: HeroSlide[]) => void;
  toggleHeroSlide: (id: string) => void;
  // Homepage Sections CMS
  reorderHomepageSections: (sections: HomepageSection[]) => void;
  toggleHomepageSection: (sectionId: HomepageSection['id']) => void;
  // Dynamic Categories CMS
  categoriesList: CategoryItem[];
  addCategoryItem: (item: Omit<CategoryItem, 'id'>) => void;
  editCategoryItem: (item: CategoryItem) => void;
  deleteCategoryItem: (id: string) => void;
  reorderCategories: (categories: CategoryItem[]) => void;
  toggleCategoryItem: (id: string) => void;
  // Dynamic Locations CMS
  locationsList: LocationItem[];
  addLocationItem: (item: Omit<LocationItem, 'id'>) => void;
  editLocationItem: (item: LocationItem) => void;
  deleteLocationItem: (id: string) => void;
  toggleLocationItem: (id: string) => void;
  // Media Library CMS
  mediaLibrary: MediaItem[];
  addMediaItem: (item: Omit<MediaItem, 'id' | 'uploadedAt'>) => void;
  deleteMediaItem: (id: string) => void;
  // Site Branding CMS
  brandingConfig: SiteBrandingConfig;
  updateBrandingConfig: (config: Partial<SiteBrandingConfig>) => void;
  // Intro Animation Config
  introConfig: IntroAnimationConfig;
  updateIntroConfig: (config: Partial<IntroAnimationConfig>) => void;
  publishIntroConfig: (config: IntroAnimationConfig) => Promise<boolean>;
  // AI Daily Family Spotlight
  dailySpotlight: DailySpotlightData;
  refreshDailySpotlight: () => Promise<void>;
  // Dynamic Footer Management
  footerConfig: FooterConfig;
  updateFooterConfig: (config: FooterConfig) => void;

  // Support Messages & Helpdesk
  supportMessages: SupportMessage[];
  addSupportMessage: (message: string, subject?: string, role?: 'customer' | 'partner') => void;
  sendSupportMessage: (
    userId: string,
    userName: string,
    userEmail: string,
    role: 'customer' | 'partner',
    message: string,
    subject?: string
  ) => void;
  replyToSupportMessage: (messageId: string, reply: string) => void;

  // Referral Program
  referralConfig: { enabled: boolean; rewardAED: number };
  updateReferralConfig: (config: { enabled: boolean; rewardAED: number }) => void;
  sendReferralInvite: (email: string) => { success: boolean; message: string };

  // Family Profile Management
  updateFamilyProfile: (profile: FamilyProfile) => void;

  // UAE Public Holidays & Date Filtering
  holidays: UaePublicHoliday[];
  updateHolidays: (holidays: UaePublicHoliday[]) => void;

  // Loyalty Points & VIP Membership System
  loyaltyRules: LoyaltyRuleConfig;
  updateLoyaltyRules: (rules: LoyaltyRuleConfig) => void;
  loyaltyTiers: LoyaltyTierConfig;
  updateLoyaltyTiers: (tiers: LoyaltyTierConfig) => void;
  loyaltyHistory: LoyaltyHistoryItem[];
  awardLoyaltyPoints: (
    actionType: LoyaltyActionType,
    referenceId: string,
    customPoints?: number,
    description?: string
  ) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Helper to reliably check if a user stored in local storage is a genuinely authenticated user
  const getStoredAuthUser = (): User | null => {
    const saved = safeStorage.getItem('spotera_user');
    if (!saved) return null;
    try {
      const parsed = JSON.parse(saved);
      if (
        parsed &&
        parsed.email &&
        !parsed.email.includes('guest') &&
        Boolean(safeStorage.getItem('spotera_session_token'))
      ) {
        // Sanitize any legacy Google User label
        const rawName = (parsed.name || '').trim();
        if (!rawName || ['google user', 'google', 'g', 'guest user'].includes(rawName.toLowerCase())) {
          const handle = parsed.email.split('@')[0].replace(/[._-]/g, ' ');
          parsed.name = handle ? handle.charAt(0).toUpperCase() + handle.slice(1) : 'Spotera Member';
        }
        return parsed;
      }
    } catch (_) {}
    return null;
  };

  const initialAuthUser = getStoredAuthUser();

  const [user, setUser] = useState<User>(() => {
    if (initialAuthUser) {
      return {...initialAuthUser, role:'customer'};
    }
    safeStorage.removeItem('spotera_user');
    return defaultGuestUser;
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return false;
  });

  const [hasEnteredApp, setHasEnteredApp] = useState<boolean>(() => {
    return safeStorage.getItem('spotera_has_entered') === 'true';
  });

  const directAdminRoute = typeof window !== 'undefined' && (window.location.hash.replace(/^#\/?/,'') === 'admin' || window.location.pathname === '/admin');
  const [startupPhase, setStartupPhase] = useState<StartupPhase>(() => {
    const alreadySeen = safeSessionStorage.getItem('spotera_animated');
    return alreadySeen || directAdminRoute ? 'app' : 'intro';
  });

  const [showOpeningAnimation, setShowOpeningAnimation] = useState<boolean>(() => {
    const alreadySeen = safeSessionStorage.getItem('spotera_animated');
    return !alreadySeen && !directAdminRoute;
  });

  const [showWelcomeModal, setShowWelcomeModal] = useState<boolean>(false);

  const [isQrScannerOpen, setIsQrScannerOpen] = useState<boolean>(false);

  const [businesses, setBusinesses] = useState<Business[]>(() => {
    const saved = safeStorage.getItem('spotera_businesses');
    return expeditionCatalog(safeJsonParse(saved, initialBusinesses));
  });

  const [deals, setDeals] = useState<Deal[]>(() => {
    const saved = safeStorage.getItem('spotera_deals');
    return expeditionCatalog(safeJsonParse(saved, initialDeals));
  });

  const [coupons,setCoupons]=useState<Coupon[]>([]);
  const [bookings,setBookings]=useState<Booking[]>([]);

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = safeStorage.getItem('spotera_reviews');
    return safeJsonParse(saved, []);
  });

  const [language, setLanguageState] = useState<Language>(() => {
    const saved = safeStorage.getItem('spotera_lang') as Language;
    return saved || 'en';
  });

  const [familyTheme, setFamilyThemeState] = useState<FamilyTheme>(() => {
    const saved = safeStorage.getItem('spotera_family_theme') as FamilyTheme;
    return saved || 'sunshine';
  });

  const [showLinksModal, setShowLinksModal] = useState<boolean>(false);

  const [footerConfig, setFooterConfig] = useState<FooterConfig>(() => {
    const saved = safeStorage.getItem('spotera_footer_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        parsed.businessAddress = '';
        parsed.contactPhone = '';
        parsed.contactEmail = '';
        if (!parsed.socialLinks?.instagram || parsed.socialLinks.instagram.includes('instagram.com/spoteradeals')) {
          parsed.socialLinks = {
            ...parsed.socialLinks,
            instagram: 'https://www.instagram.com/spoteradealsae?igsh=MWZ5bXpqM2t2NXUzdw%3D%3D&utm_source=qr',
          };
        }
        return { ...defaultFooterConfig, ...parsed };
      } catch (e) {
        // ignore
      }
    }
    return defaultFooterConfig;
  });

  const updateFooterConfig = (newConfig: FooterConfig) => {
    setFooterConfig(newConfig);
    safeStorage.setItem('spotera_footer_config', JSON.stringify(newConfig));
  };

  // UAE Public Holidays State (Configurable by Admin)
  const [holidays, setHolidays] = useState<UaePublicHoliday[]>(() => {
    const saved = safeStorage.getItem('spotera_uae_holidays');
    return safeJsonParse(saved, defaultUaeHolidays);
  });

  const updateHolidays = (newHolidays: UaePublicHoliday[]) => {
    setHolidays(newHolidays);
    safeStorage.setItem('spotera_uae_holidays', JSON.stringify(newHolidays));
  };

  // Loyalty Points Rules State (Configurable by Admin)
  const [loyaltyRules, setLoyaltyRules] = useState<LoyaltyRuleConfig>(() => {
    const saved = safeStorage.getItem('spotera_loyalty_rules');
    return safeJsonParse(saved, defaultLoyaltyRules);
  });

  const updateLoyaltyRules = (newRules: LoyaltyRuleConfig) => {
    setLoyaltyRules(newRules);
    safeStorage.setItem('spotera_loyalty_rules', JSON.stringify(newRules));
  };

  // Membership Tier Thresholds State (Configurable by Admin)
  const [loyaltyTiers, setLoyaltyTiers] = useState<LoyaltyTierConfig>(() => {
    const saved = safeStorage.getItem('spotera_loyalty_tiers');
    return safeJsonParse(saved, defaultLoyaltyTiers);
  });

  const updateLoyaltyTiers = (newTiers: LoyaltyTierConfig) => {
    setLoyaltyTiers(newTiers);
    safeStorage.setItem('spotera_loyalty_tiers', JSON.stringify(newTiers));
  };

  const parseDealIdFromLocation = (): string | null => {
    try {
      if (typeof window === 'undefined') return null;

      // 1. Search params (?deal=, ?id=, ?dealId=)
      const urlParams = new URLSearchParams(window.location.search);
      const queryDeal = urlParams.get('deal') || urlParams.get('dealId') || urlParams.get('id');
      if (queryDeal) return queryDeal.trim();

      // 2. Hash (#deal/..., #/deal/..., #deal-detail?id=...)
      const rawHash = window.location.hash.replace(/^[#\/]+/, '').trim();
      if (rawHash.toLowerCase().startsWith('deal/')) {
        const id = rawHash.replace(/^deal\//i, '').split('?')[0].split('&')[0].trim();
        if (id) return id;
      }
      if (rawHash.toLowerCase().startsWith('deal-detail')) {
        if (rawHash.includes('id=')) {
          const id = rawHash.split('id=')[1]?.split('&')[0].trim();
          if (id) return id;
        }
        const parts = rawHash.split('/');
        if (parts.length > 1 && parts[1]) return parts[1].split('?')[0].trim();
      }

      // 3. Pathname (/deal/:id or /deals/:id)
      const rawPath = window.location.pathname.replace(/^\/+/, '').trim();
      if (rawPath.toLowerCase().startsWith('deal/')) {
        const id = rawPath.replace(/^deal\//i, '').split('/')[0].trim();
        if (id) return id;
      }
      if (rawPath.toLowerCase().startsWith('deals/')) {
        const id = rawPath.replace(/^deals\//i, '').split('/')[0].trim();
        if (id) return id;
      }
    } catch (_) {
      // ignore
    }
    return null;
  };

  const parseViewFromLocation = (): ViewMode => {
    const rawHash = window.location.hash.replace(/^[#\/]+/, '').replace(/\/+$/, '').trim();
    const rawPath = window.location.pathname.replace(/^\/+/, '').replace(/\/+$/, '').trim().toLowerCase();
    
    let queryView: string | null = null;
    let queryDeal: string | null = null;
    try {
      const urlParams = new URLSearchParams(window.location.search);
      queryView = urlParams.get('view') || urlParams.get('page');
      queryDeal = urlParams.get('deal') || urlParams.get('dealId') || urlParams.get('id');
    } catch (e) {
      // ignore
    }

    // Direct deal link support: ?deal=..., #deal/..., #/deal/..., /deal/...
    if (queryDeal || rawHash.toLowerCase().startsWith('deal/') || rawHash.toLowerCase().startsWith('deal-detail') || rawPath.startsWith('deal/') || rawPath.startsWith('deals/')) {
      return 'deal-detail';
    }

    const normalize = (str: string | null): ViewMode | null => {
      if (!str) return null;
      const s = str.toLowerCase().trim();
      if (s === 'admin' || s === 'dashboard' || s === 'admin-dashboard') return 'admin';
      if (s === 'partners' || s === 'partner' || s === 'vendors' || s === 'vendor') return 'partners';
      if (s === 'pwa' || s === 'wallet' || s === 'coupons' || s === 'vouchers') return 'coupons';
      if (s === 'membership' || s === 'vip' || s === 'vip-pass' || s === 'passport') return 'membership';
      if (s === 'rewards' || s === 'points') return 'rewards';
      if (s === 'search') return 'search';
      if (s === 'booking/confirm' || s === 'booking-confirm' || s === 'booking_confirm') return 'booking-confirm';
      if (s === 'deals') return 'explore';
      if (s === 'favorites' || s === 'saved') return 'wishlist';
      const validViews: ViewMode[] = [
        'home',
        'explore',
        'categories',
        'deal-detail',
        'business-detail',
        'coupons',
        'bookings',
        'wishlist',
        'membership',
        'about',
        'contact',
        'faq',
        'privacy',
        'settings',
        'terms',
        'profile',
        'admin',
        'partners',
        'rewards',
        'search',
        'booking-confirm',
        'auth',
      ];
      if (validViews.includes(s as ViewMode)) {
        return s as ViewMode;
      }
      return null;
    };

    return normalize(rawHash) || normalize(queryView) || normalize(rawPath) || 'home';
  };

  const [activeView, setActiveViewState] = useState<ViewMode>(() => {
    const locationView = parseViewFromLocation();
    if (locationView === 'admin') return 'admin';
    if (initialAuthUser) return locationView || 'home';
    if (safeSessionStorage.getItem('paper_guest_entered') === 'true') return locationView;
    return 'auth';
  });

  const [sessionToken, setSessionToken] = useState<string | null>(() => {
    return safeStorage.getItem('spotera_session_token');
  });

  const [authModalReason, setAuthModalReason] = useState<string>('');
  const pendingAuthCallbackRef = useRef<(() => void) | null>(null);

  const isGuest = !isLoggedIn || !user.email || user.email.includes('guest');

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return false;
  });

  const [isPartnerAuthenticated, setIsPartnerAuthenticated] = useState<boolean>(() => {
    return false;
  });

  const [adminEmail, setAdminEmail] = useState<string>(() => {
    return safeStorage.getItem('spotera_admin_email') || '';
  });

  const [hasAdminPasswordSet, setHasAdminPasswordSet] = useState<boolean>(() => {
    return !!safeStorage.getItem('spotera_admin_pass') || safeStorage.getItem('spotera_admin_configured') === 'true';
  });

  // Verify server session on app load
  useEffect(() => {
    const checkServerAuth = async () => {
      try {
        const res = await fetch('/api/auth/status');
        if (res.ok) {
          const data = await res.json();
          if (data.adminConfigured) {
            setHasAdminPasswordSet(true);
            safeStorage.setItem('spotera_admin_configured', 'true');
          }
        }
      } catch (e) {
        // Fallback
      }

      if (sessionToken) {
        try {
          const res = await fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${sessionToken}`, 'Content-Type':'application/json' },
          });
          if (res.ok) {
            const data = await res.json();
            if (data.authenticated && data.user) {
              setUser(prev=>({...prev,...data.user}));
              setIsLoggedIn(true);
              setIsAdminAuthenticated(data.user.role === 'ADMIN');
              setIsPartnerAuthenticated(data.user.role === 'PARTNER');
              if (data.user.role === 'ADMIN') {
                setIsAdminAuthenticated(true);
                setAdminEmail(data.user.email);
              } else if (data.user.role === 'PARTNER') {
                setIsPartnerAuthenticated(true);
                setPartnerEmail(data.user.email);
              } else {
                // Restore customer session
                setUser((prev) => {
                  const rawName = (data.user.name || prev.name || '').trim();
                  const isGoogleName = !rawName || ['google user', 'google', 'g', 'guest user'].includes(rawName.toLowerCase());
                  const emailHandle = data.user.email ? data.user.email.split('@')[0].replace(/[._-]/g, ' ') : '';
                  const cleanName = isGoogleName ? (emailHandle ? emailHandle.charAt(0).toUpperCase() + emailHandle.slice(1) : 'Spotera Member') : rawName;

                  return {
                    ...prev,
                    id: data.user.id,
                    name: cleanName,
                    email: data.user.email,
                    phone: data.user.phone || prev.phone,
                    avatar: data.user.avatar || prev.avatar,
                    role: 'customer',
                    membership: data.user.membership || prev.membership || 'Free',
                    authProvider: data.user.authProvider || 'email',
                  };
                });
                setIsLoggedIn(true);
              }
            } else {
              setIsLoggedIn(false); setUser(defaultGuestUser); setIsAdminAuthenticated(false); setIsPartnerAuthenticated(false);
              safeStorage.removeItem('spotera_user'); safeStorage.removeItem('spotera_session_token');
            }
          }
        } catch (e) {
          // Network failures cannot authenticate a cached profile.
        }
      }
    };

    void checkServerAuth();
    const refreshSession=()=>{if(!document.hidden)void checkServerAuth()};
    window.addEventListener('focus',refreshSession);
    document.addEventListener('visibilitychange',refreshSession);
    return()=>{window.removeEventListener('focus',refreshSession);document.removeEventListener('visibilitychange',refreshSession)};
  }, [sessionToken]);

  const requireUserAuth = (reason = 'Please sign in or create an account to proceed.', onAuthorized?: () => void): boolean => {
    if (isLoggedIn && user && user.email && !user.email.includes('guest')) {
      onAuthorized?.();
      return true;
    }
    setAuthModalReason(reason);
    if (onAuthorized) {
      pendingAuthCallbackRef.current = onAuthorized;
    }
    setStartupPhase('auth');
    setActiveViewState('auth');
    return false;
  };

  const handleAuthSuccess = (authUser: User, token?: string) => {
    setUser(authUser);
    setIsAdminAuthenticated(authUser.role==='ADMIN');
    setIsPartnerAuthenticated(authUser.role==='PARTNER');
    safeStorage.setItem('spotera_user', JSON.stringify(authUser));
    if (token) {
      setSessionToken(token);
      safeStorage.setItem('spotera_session_token', token);
    }
    setIsLoggedIn(true);
    setHasEnteredApp(true);
    setStartupPhase('app');
    safeStorage.setItem('spotera_has_entered', 'true');
    setShowWelcomeModal(false);
    setAuthModalReason('');
    safeSessionStorage.setItem('spotera_auth_chosen', 'true');
    if (authUser.role === 'ADMIN' || (authUser.role as string) === 'admin') {
      setActiveViewState('admin');
    } else if(authUser.role==='PARTNER'){setActiveViewState('partners');} else {
      setActiveViewState('home');
    }

    if (pendingAuthCallbackRef.current) {
      const cb = pendingAuthCallbackRef.current;
      pendingAuthCallbackRef.current = null;
      try {
        cb();
      } catch (err) {
        console.error('Failed to run pending action after auth:', err);
      }
    }
  };

  const continueAsGuest = () => {
    setUser(defaultGuestUser);
    setIsLoggedIn(false);
    setHasEnteredApp(true);
    setStartupPhase('app');
    setActiveViewState('home');
    setShowWelcomeModal(false);
    setAuthModalReason('');
    pendingAuthCallbackRef.current = null;
    safeSessionStorage.setItem('spotera_welcome_modal_seen', 'true');
    safeSessionStorage.setItem('spotera_auth_chosen', 'true');
  };

  const logout = () => {
    if (sessionToken) {
      authService.logout(sessionToken);
    }
    setUser(defaultGuestUser);
    setIsLoggedIn(false);
    setIsAdminAuthenticated(false);setIsPartnerAuthenticated(false);
    setHasEnteredApp(false);
    setStartupPhase('auth');
    setSessionToken(null);
    safeStorage.removeItem('spotera_session_token');
    safeStorage.removeItem('spotera_user');
    safeStorage.removeItem('spotera_has_entered');
    safeSessionStorage.removeItem('spotera_welcome_modal_seen');
    safeSessionStorage.removeItem('spotera_auth_chosen');
    safeSessionStorage.removeItem('paper_guest_entered');
    setActiveViewState('auth');
  };

  const setupAdminAccount = async (_email: string, _pass: string) => {
    throw new Error('Admin setup must be completed securely on the server.');
  };

  const adminLoginWithCreds = async (email: string, pass: string): Promise<{ success: boolean; message: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass;

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: cleanPass, requestedRole: 'ADMIN' }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.token) {
        setSessionToken(data.token);
        safeStorage.setItem('spotera_session_token', data.token);
        setAdminEmail(cleanEmail);
        setIsAdminAuthenticated(true);
        safeStorage.setItem('spotera_admin_auth', 'true');
        safeStorage.setItem('spotera_admin_email', cleanEmail);
        setHasAdminPasswordSet(true);
        return { success: true, message: 'Admin authentication verified.' };
      }
      if (data.message && !res.ok) return {success:false,message:data.message};
      if (data.error === 'SETUP_REQUIRED' || data.message === 'SETUP_REQUIRED') {
        return { success: false, message: 'SETUP_REQUIRED' };
      }
    } catch {
      // Server offline fallback
    }

    return { success: false, message: 'Admin sign-in is unavailable until the server is configured.' };
  };

  const changeAdminPassword = async (newPassword: string) => {
    try{const response=await fetch('/api/auth/change-password',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({newPassword})});return response.ok && (await response.json()).success===true;}catch{return false;}
  };

  const adminLogout = () => {
    if (sessionToken) {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${sessionToken}`, 'Content-Type':'application/json' },
      }).catch(() => {});
    }
    setIsAdminAuthenticated(false);
    safeStorage.removeItem('spotera_admin_auth');
    safeStorage.removeItem('spotera_session_token');
    setSessionToken(null);
  };

  const [partnerEmail, setPartnerEmail] = useState<string>(() => {
    return safeStorage.getItem('spotera_partner_email') || '';
  });

  const [hasPartnerPasswordSet, setHasPartnerPasswordSet] = useState<boolean>(() => {
    return !!safeStorage.getItem('spotera_partner_pass');
  });

  const setupPartnerAccount = () => {window.alert('Business accounts are created by the administrator in Business accounts & live bookings.');};
  const partnerLoginWithCreds = () => ({success:false,message:'Use the regular email sign-in screen with your administrator-provided business account.'});
  const changePartnerPassword = () => {window.alert('Ask the administrator to reset your business password.');};
  const partnerLogout = () => {
    if (sessionToken) {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${sessionToken}`, 'Content-Type':'application/json' },
      }).catch(() => {});
    }
    setIsPartnerAuthenticated(false);setIsLoggedIn(false);setUser(defaultGuestUser);
    safeStorage.removeItem('spotera_partner_auth');
    safeStorage.removeItem('spotera_session_token');
    setSessionToken(null);
  };

  const [selectedDealId, setSelectedDealIdState] = useState<string | null>(() => parseDealIdFromLocation());
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<City | 'All'>('All');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');

  const setSelectedDealId = (id: string | null) => {
    setSelectedDealIdState(id);
    if (id) {
      window.location.hash = `#deal/${id}`;
      setActiveViewState('deal-detail');
    }
  };

  const [isAppInitializing, setIsAppInitializing] = useState<boolean>(false);
  const [isViewLoading, setIsViewLoading] = useState<boolean>(false);

  const [previousView, setPreviousView] = useState<ViewMode>('home');

  const setActiveView = (view: ViewMode) => {
    setActiveViewState((current) => {
      if (current !== view) {
        setPreviousView(current);
        // Subtle view transition indicator
        setIsViewLoading(true);
        setTimeout(() => setIsViewLoading(false), 120);
      }
      return view;
    });
    const linkedDeal=view==='deal-detail'?(parseDealIdFromLocation()||selectedDealId):null;
    window.location.hash = linkedDeal?`#deal/${linkedDeal}`:`#${view}`;
  };

  const goBack = () => {
    if (previousView && previousView !== activeView) {
      setActiveView(previousView);
    } else {
      setActiveView('home');
    }
  };

  const setFamilyTheme = (theme: FamilyTheme) => {
    setFamilyThemeState(theme);
    safeStorage.setItem('spotera_family_theme', theme);
  };

  useEffect(() => {
    document.body.className = 'bg-[#F0F5FB] text-[#0A2540]';
  }, [familyTheme]);

  useEffect(() => {
    const handleLocationChange = () => {
      const matched = parseViewFromLocation();
      if (matched === 'admin' || initialAuthUser || safeSessionStorage.getItem('paper_guest_entered') === 'true') {
        setActiveViewState(matched);
      }

      // Extract deal ID if present
      const detectedDealId = parseDealIdFromLocation();
      if (detectedDealId) {
        setSelectedDealIdState(detectedDealId);
      }
    };

    // Initial check
    handleLocationChange();

    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  useEffect(() => {
    safeStorage.setItem('spotera_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    safeStorage.setItem('spotera_businesses', JSON.stringify(businesses));
  }, [businesses]);

  useEffect(() => {
    safeStorage.setItem('spotera_deals', JSON.stringify(deals));
  }, [deals]);

  useEffect(() => {
    safeStorage.setItem('spotera_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    safeStorage.setItem('spotera_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    safeStorage.setItem('spotera_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    safeStorage.setItem('spotera_lang', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const isRtl = language === 'ar';

  const t = (key: string): string => {
    return safeTranslate(key, language);
  };

  const dismissOpeningAnimation = useCallback(() => {
    setShowOpeningAnimation(false);
    setStartupPhase('app');
    safeSessionStorage.setItem('spotera_animated', 'true');
    setActiveViewState('auth');
    window.history.replaceState(null, '', '#auth');
  }, []);

  const replaySplashAnimation = () => {
    setStartupPhase('intro');
    setShowOpeningAnimation(true);
  };

  const returnToAuthScreen = () => {
    setActiveViewState('auth');
    setShowOpeningAnimation(false);
  };

  // Loyalty Points Engine: Award points with duplicate protection
  const loyaltyHistory = user.loyaltyHistory || [];

  const awardLoyaltyPoints = (
    actionType: LoyaltyActionType,
    referenceId: string,
    customPoints?: number,
    description?: string
  ): boolean => {
    if (!referenceId) return false;

    // Prevent duplicate points from being awarded for the same transaction or redemption
    const alreadyAwarded = (user.loyaltyHistory || []).some((item) => item.referenceId === referenceId);
    if (alreadyAwarded) {
      return false;
    }

    let pts = customPoints;
    if (pts === undefined) {
      switch (actionType) {
        case 'BOOKING_COMPLETED':
          pts = loyaltyRules.bookingPoints;
          break;
        case 'DEAL_REDEMPTION':
          pts = loyaltyRules.redemptionPoints;
          break;
        case 'REFERRAL':
          pts = loyaltyRules.referralPoints;
          break;
        case 'PROMOTION':
          pts = loyaltyRules.promotionPoints;
          break;
        case 'REVIEW_SUBMITTED':
          pts = loyaltyRules.reviewPoints;
          break;
        default:
          pts = 50;
      }
    }

    const defaultDesc =
      actionType === 'BOOKING_COMPLETED' ? 'Experience booking confirmed' :
      actionType === 'DEAL_REDEMPTION' ? 'Digital pass / voucher redeemed' :
      actionType === 'REFERRAL' ? 'Friend referral completed' :
      actionType === 'PROMOTION' ? 'Spotera promotion reward' :
      actionType === 'ADMIN_GRANT' ? 'VIP membership bonus' :
      actionType === 'REVIEW_SUBMITTED' ? 'Business review submitted' : 'Loyalty activity';

    const newItem: LoyaltyHistoryItem = {
      id: `loyalty_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      actionType,
      referenceId,
      points: pts,
      description: description || defaultDesc,
      createdAt: new Date().toISOString(),
    };

    const newTotal = (user.rewardsPoints || 0) + pts;
    const newHistory = [newItem, ...(user.loyaltyHistory || [])];

    let newTier: 'Free' | 'Spotera VIP' | 'Premium VIP' = 'Free';
    if (newTotal >= loyaltyTiers.premiumThreshold) {
      newTier = 'Premium VIP';
    } else if (newTotal >= loyaltyTiers.vipThreshold) {
      newTier = 'Spotera VIP';
    }

    setUser((prev) => ({
      ...prev,
      rewardsPoints: newTotal,
      membership: newTier,
      loyaltyHistory: newHistory,
    }));

    return true;
  };

  // Actions
  const apiAction = async (path:string, input?:unknown) => {
    const response=await fetch(path,input===undefined?{}:{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(input)});
    const data=await response.json();if(!response.ok||data.success===false)throw new Error(data.message||'Could not complete this request.');return data;
  };
  const refreshBookings = async () => { try{const data=await apiAction('/api/bookings');setBookings(data.bookings||[]);}catch{setBookings([])} };
  useEffect(()=>{if(!isLoggedIn&&!isAdminAuthenticated&&!isPartnerAuthenticated){setBookings([]);setCoupons([]);return}void refreshBookings();const timer=setInterval(()=>{if(!document.hidden)void refreshBookings()},30000);window.addEventListener('focus',refreshBookings);return()=>{clearInterval(timer);window.removeEventListener('focus',refreshBookings)}},[isLoggedIn,isAdminAuthenticated,isPartnerAuthenticated,user.id]);
  const createBooking = async (deal:Deal,date:string,timeSlot:string,childrenCount:number,packageName:string,totalPrice:number):Promise<Booking> => {
    const data=await apiAction('/api/bookings',{dealId:deal.id,date,timeSlot,childrenCount});setBookings(prev=>[data.booking,...prev.filter(b=>b.id!==data.booking.id)]);return data.booking;
  };
  const claimCoupon = async (deal:Deal):Promise<Coupon> => {
    const date=new Date(Date.now()+4*3600000).toISOString().slice(0,10);
    const b=await createBooking(deal,date,'During opening hours',1,deal.title,deal.discountPrice);
    const coupon:Coupon={id:b.id,code:b.bookingCode,dealId:deal.id,dealTitle:deal.title,businessName:deal.businessName,userId:user.id,userName:user.name,claimedAt:b.createdAt,expiryDate:date,status:'active',qrCodeData:b.bookingCode,redemptionInstructions:'Show this code at the venue. Pay at the venue; this reservation is not proof of payment.'};setCoupons(prev=>[coupon,...prev]);return coupon;
  };
  const redeemCode = async (code:string,businessName?:string) => {
    try{const data=await apiAction('/api/vouchers/redeem',{code:code.trim()});await refreshBookings();return data}catch(error){return {success:false,message:error instanceof Error?error.message:'Redemption failed.'}}
  };
  const redeemCoupon = (code:string):boolean => {void redeemCode(code);return false};
  const cancelBooking = async (id:string):Promise<boolean> => {try{await apiAction('/api/bookings/cancel',{id});await refreshBookings();return true}catch(error){window.alert(error instanceof Error?error.message:'Cancellation failed.');return false}};
  const updateBookingStatus = (id:string,status:Booking['status']) => {if(status==='cancelled')cancelBooking(id);else if(status==='redeemed'||status==='completed'){const booking=bookings.find(b=>b.id===id);if(booking)void redeemCode(booking.bookingCode).then(result=>{if(!result.success)window.alert(result.message)})}};

  const toggleFavoriteDeal = (dealId: string) => {
    setUser((prev) => {
      const current = prev.savedDealIds || [];
      const exists = current.includes(dealId);
      const newSaved = exists
        ? current.filter((id) => id !== dealId)
        : Array.from(new Set([...current, dealId]));
      return { ...prev, savedDealIds: newSaved };
    });
  };

  const addReview = (dealId: string, rating: number, comment: string) => {
    if (!isLoggedIn || !user.email || user.email.includes('guest')) {
      requireUserAuth('Sign in or register to leave a verified family review.', () => {
        addReview(dealId, rating, comment);
      });
      return;
    }

    const newRev: Review = {
      id: `rev_${Date.now()}`,
      dealId,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      rating,
      comment,
      date: new Date().toISOString().split('T')[0],
      verifiedPurchase: true,
    };
    setReviews((prev) => [newRev, ...prev]);

    // Update deal rating & review count
    setDeals((prev) =>
      prev.map((d) => {
        if (d.id === dealId) {
          const newCount = d.reviewCount + 1;
          const newRating = Number(((d.rating * d.reviewCount + rating) / newCount).toFixed(1));
          return { ...d, rating: newRating, reviewCount: newCount };
        }
        return d;
      })
    );
  };

  const upgradeMembership = (plan: 'Free' | 'Spotera VIP' | 'Premium VIP' | 'VIP Family Pass' | string = 'Spotera VIP') => {
    const validPlan: 'Free' | 'Spotera VIP' | 'Premium VIP' | 'VIP Family Pass' =
      plan === 'Premium VIP' || plan === 'VIP Family Pass' || plan === 'Free' ? plan : 'Spotera VIP';
    if (!isLoggedIn || !user.email || user.email.includes('guest')) {
      requireUserAuth('Sign in or register to activate your Spotera VIP Pass.', () => {
        upgradeMembership(validPlan);
      });
      return;
    }

    const expiry = new Date();
    expiry.setFullYear(expiry.getFullYear() + 1);

    setUser((prev) => ({
      ...prev,
      membership: validPlan,
      membershipExpiry: expiry.toISOString().split('T')[0],
      notifications: [
        {
          id: `notif_${Date.now()}`,
          title: 'VIP Pass Activated!',
          message: 'Welcome to Spotera VIP! You now get 50% extra discounts and priority camp access across all 7 UAE Emirates.',
          date: new Date().toISOString().split('T')[0],
          read: false,
        },
        ...prev.notifications,
      ],
    }));
  };

  // Deal Extended Actions
  const duplicateDeal = (id: string) => {
    const existing = deals.find((d) => d.id === id);
    if (!existing) return;
    const duplicated: Deal = {
      ...existing,
      id: `deal_${Date.now()}`,
      title: `${existing.title} (Copy)`,
      reviewCount: 0,
      rating: 5.0,
      isPublished: true,
    };
    setDeals((prev) => {
      const updated = [duplicated, ...prev];
      safeStorage.setItem('spotera_deals', JSON.stringify(updated));
      return updated;
    });
  };

  const togglePublishDeal = (id: string) => {
    setDeals((prev) => {
      const updated = prev.map((d) =>
        d.id === id ? { ...d, isPublished: d.isPublished === false ? true : false } : d
      );
      safeStorage.setItem('spotera_deals', JSON.stringify(updated));
      return updated;
    });
  };

  const toggleFeaturedDeal = (id: string) => {
    setDeals((prev) => {
      const updated = prev.map((d) => (d.id === id ? { ...d, isFeatured: !d.isFeatured } : d));
      safeStorage.setItem('spotera_deals', JSON.stringify(updated));
      return updated;
    });
  };

  const toggleTrendingDeal = (id: string) => {
    setDeals((prev) => {
      const updated = prev.map((d) => (d.id === id ? { ...d, isTrending: !d.isTrending } : d));
      safeStorage.setItem('spotera_deals', JSON.stringify(updated));
      return updated;
    });
  };

  const reorderDeals = (reorderedDeals: Deal[]) => {
    setDeals(reorderedDeals);
    safeStorage.setItem('spotera_deals', JSON.stringify(reorderedDeals));
  };

  // Homepage & Branding Config State
  const [homepageConfig, setHomepageConfig] = useState<HomepageConfig>(() => {
    const saved = safeStorage.getItem('spotera_homepage_config');
    if (saved) {
      try {
        return { ...defaultHomepageConfig, ...JSON.parse(saved) };
      } catch (e) {
        // fallback
      }
    }
    return defaultHomepageConfig;
  });

  const updateHomepageConfig = (newConfig: Partial<HomepageConfig>) => {
    setHomepageConfig((prev) => {
      const updated = { ...prev, ...newConfig };
      safeStorage.setItem('spotera_homepage_config', JSON.stringify(updated));
      return updated;
    });
  };

  // Hero Slides CMS
  const addHeroSlide = (slide: Omit<HeroSlide, 'id'>) => {
    const newSlide: HeroSlide = {
      ...slide,
      id: `slide_${Date.now()}`,
    };
    const currentSlides = homepageConfig.heroSlides || defaultHomepageConfig.heroSlides;
    updateHomepageConfig({
      heroSlides: [...currentSlides, newSlide],
    });
  };

  const editHeroSlide = (updatedSlide: HeroSlide) => {
    const currentSlides = homepageConfig.heroSlides || defaultHomepageConfig.heroSlides;
    const slides = currentSlides.map((s) => (s.id === updatedSlide.id ? updatedSlide : s));
    updateHomepageConfig({ heroSlides: slides });
  };

  const deleteHeroSlide = (slideId: string) => {
    const currentSlides = homepageConfig.heroSlides || defaultHomepageConfig.heroSlides;
    const slides = currentSlides.filter((s) => s.id !== slideId);
    updateHomepageConfig({ heroSlides: slides });
  };

  const reorderHeroSlides = (newSlides: HeroSlide[]) => {
    updateHomepageConfig({ heroSlides: newSlides });
  };

  const toggleHeroSlide = (slideId: string) => {
    const currentSlides = homepageConfig.heroSlides || defaultHomepageConfig.heroSlides;
    const slides = currentSlides.map((s) =>
      s.id === slideId ? { ...s, enabled: !s.enabled } : s
    );
    updateHomepageConfig({ heroSlides: slides });
  };

  const reorderHomepageSections = (newSections: HomepageSection[]) => {
    updateHomepageConfig({ sections: newSections });
  };

  const toggleHomepageSection = (sectionId: HomepageSection['id']) => {
    const currentSections = homepageConfig.sections || defaultHomepageConfig.sections;
    const sections = currentSections.map((s) =>
      s.id === sectionId ? { ...s, enabled: !s.enabled } : s
    );
    updateHomepageConfig({ sections });
  };

  // Dynamic Categories CMS
  const [categoriesList, setCategoriesList] = useState<CategoryItem[]>(() => {
    const saved = safeStorage.getItem('spotera_categories_list');
    return saved ? JSON.parse(saved) : initialCategoriesList;
  });

  const addCategoryItem = (item: Omit<CategoryItem, 'id'>) => {
    const newItem: CategoryItem = { ...item, id: `cat_${Date.now()}` };
    setCategoriesList((prev) => {
      const updated = [...prev, newItem];
      safeStorage.setItem('spotera_categories_list', JSON.stringify(updated));
      return updated;
    });
  };

  const editCategoryItem = (item: CategoryItem) => {
    setCategoriesList((prev) => {
      const updated = prev.map((c) => (c.id === item.id ? item : c));
      safeStorage.setItem('spotera_categories_list', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteCategoryItem = (id: string) => {
    setCategoriesList((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      safeStorage.setItem('spotera_categories_list', JSON.stringify(updated));
      return updated;
    });
  };

  const reorderCategories = (newCats: CategoryItem[]) => {
    setCategoriesList(newCats);
    safeStorage.setItem('spotera_categories_list', JSON.stringify(newCats));
  };

  const toggleCategoryItem = (id: string) => {
    setCategoriesList((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c));
      safeStorage.setItem('spotera_categories_list', JSON.stringify(updated));
      return updated;
    });
  };

  // Dynamic Locations CMS
  const [locationsList, setLocationsList] = useState<LocationItem[]>(() => {
    const saved = safeStorage.getItem('spotera_locations_list');
    return saved ? JSON.parse(saved) : initialLocationsList;
  });

  const addLocationItem = (item: Omit<LocationItem, 'id'>) => {
    const newItem: LocationItem = { ...item, id: `loc_${Date.now()}` };
    setLocationsList((prev) => {
      const updated = [...prev, newItem];
      safeStorage.setItem('spotera_locations_list', JSON.stringify(updated));
      return updated;
    });
  };

  const editLocationItem = (item: LocationItem) => {
    setLocationsList((prev) => {
      const updated = prev.map((l) => (l.id === item.id ? item : l));
      safeStorage.setItem('spotera_locations_list', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteLocationItem = (id: string) => {
    setLocationsList((prev) => {
      const updated = prev.filter((l) => l.id !== id);
      safeStorage.setItem('spotera_locations_list', JSON.stringify(updated));
      return updated;
    });
  };

  const toggleLocationItem = (id: string) => {
    setLocationsList((prev) => {
      const updated = prev.map((l) => (l.id === id ? { ...l, enabled: !l.enabled } : l));
      safeStorage.setItem('spotera_locations_list', JSON.stringify(updated));
      return updated;
    });
  };

  // Media Library CMS
  const [mediaLibrary, setMediaLibrary] = useState<MediaItem[]>(() => {
    const saved = safeStorage.getItem('spotera_media_library');
    return saved ? JSON.parse(saved) : initialMediaLibrary;
  });

  const addMediaItem = (item: Omit<MediaItem, 'id' | 'uploadedAt'>) => {
    const newItem: MediaItem = {
      ...item,
      id: `media_${Date.now()}`,
      uploadedAt: new Date().toISOString().split('T')[0],
    };
    setMediaLibrary((prev) => {
      const updated = [newItem, ...prev];
      safeStorage.setItem('spotera_media_library', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteMediaItem = (id: string) => {
    setMediaLibrary((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      safeStorage.setItem('spotera_media_library', JSON.stringify(updated));
      return updated;
    });
  };

  // Site Branding CMS
  const [brandingConfig, setBrandingConfig] = useState<SiteBrandingConfig>(() => {
    const saved = safeStorage.getItem('spotera_branding_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.siteName === 'FindMe') {
          parsed.siteName = 'SpoteraDeals';
          parsed.tagline = 'UAE Family Deals & Experiences';
          parsed.primaryColor = '#0D9CFD';
          parsed.accentColor = '#FD9302';
        }
        return { ...initialBrandingConfig, ...parsed };
      } catch (e) {
        // fallback
      }
    }
    return initialBrandingConfig;
  });

  const updateBrandingConfig = (newBranding: Partial<SiteBrandingConfig>) => {
    setBrandingConfig((prev) => {
      const updated = { ...prev, ...newBranding };
      safeStorage.setItem('spotera_branding_config', JSON.stringify(updated));

      return updated;
    });
  };

  // 4. Intro Animation CMS
  const [introConfig, setIntroConfig] = useState<IntroAnimationConfig>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = safeStorage.getItem('spotera_intro_config');
        if (stored) {
          const parsed = JSON.parse(stored);
          return { ...defaultIntroConfig, ...parsed };
        }
      } catch (e) {
        // fallback
      }
    }
    return defaultIntroConfig;
  });

  const updateIntroConfig = (patch: Partial<IntroAnimationConfig>) => {
    setIntroConfig((prev) => {
      const updated = { ...prev, ...patch, updatedAt: new Date().toISOString() };
      safeStorage.setItem('spotera_intro_config', JSON.stringify(updated));
      return updated;
    });
  };

  const publishIntroConfig = async (configToPublish: IntroAnimationConfig): Promise<boolean> => {
    try {
      const published = {
        ...configToPublish,
        updatedAt: new Date().toISOString(),
        publishedAt: new Date().toISOString(),
      };
      setIntroConfig(published);
      safeStorage.setItem('spotera_intro_config', JSON.stringify(published));

      const token = sessionToken || safeStorage.getItem('spotera_session_token');
      const res = await fetch('/api/admin/content/intro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          data: published,
          summary: `Published intro animation config (${published.durationSeconds}s, ${published.backgroundType})`,
        }),
      });
      const resData = await res.json();
      return Boolean(res.ok && resData.success);
    } catch (e) {
      console.error('Failed to publish intro config to server:', e);
      return false;
    }
  };

  // A single server-backed content source is shared by every page and visitor.
  const {cmsSaveStatus,retryCmsSave}=useCmsSync(
    {homepage:homepageConfig,branding:brandingConfig,footer:footerConfig,intro:introConfig,deals,categories:categoriesList,locations:locationsList,media:mediaLibrary,businesses,holidays,loyaltyRules,loyaltyTiers},
    {homepage:setHomepageConfig,branding:setBrandingConfig,footer:setFooterConfig,intro:setIntroConfig,deals:setDeals,categories:setCategoriesList,locations:setLocationsList,media:setMediaLibrary,businesses:setBusinesses,holidays:setHolidays,loyaltyRules:setLoyaltyRules,loyaltyTiers:setLoyaltyTiers},
    isAdminAuthenticated
  );

  // Synchronize CSS Typography variables whenever brandingConfig changes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.dataset.customTypography=brandingConfig.typographyEnabled?'true':'false';
      if (brandingConfig.headingFont) {
        root.style.setProperty('--font-heading', `'${brandingConfig.headingFont}', system-ui, sans-serif`);
      }
      if (brandingConfig.bodyFont) {
        root.style.setProperty('--font-body', `'${brandingConfig.bodyFont}', system-ui, sans-serif`);
      }
      if (brandingConfig.buttonFont) {
        root.style.setProperty('--font-button', `'${brandingConfig.buttonFont}', system-ui, sans-serif`);
      }
      if (brandingConfig.headingFontSize) {
        root.style.setProperty('--font-size-heading-scale', brandingConfig.headingFontSize);
      }
      if (brandingConfig.bodyFontSize) {
        root.style.setProperty('--font-size-body-scale', brandingConfig.bodyFontSize);
      }
      if (brandingConfig.buttonFontSize) {
        root.style.setProperty('--font-size-button-scale', brandingConfig.buttonFontSize);
      }
      if (brandingConfig.primaryColor) {
        root.style.setProperty('--color-findme-blue', brandingConfig.primaryColor);
      }
      if (brandingConfig.accentColor) {
        root.style.setProperty('--color-findme-orange', brandingConfig.accentColor);
      }
    }
  }, [brandingConfig]);

  // FindMe Sourcing & Requests State
  const [userRequests, setUserRequests] = useState<UserRequest[]>(() => {
    const saved = safeStorage.getItem('findme_requests');
    return saved ? JSON.parse(saved) : [];
  });

  const [requestQuotes, setRequestQuotes] = useState<RequestQuote[]>(() => {
    const saved = safeStorage.getItem('findme_quotes');
    return saved ? JSON.parse(saved) : [];
  });

  const [products] = useState<FindMeProduct[]>(initialFindMeProducts);
  const [services] = useState<FindMeService[]>(initialFindMeServices);

  const postUserRequest = (reqData: Omit<UserRequest, 'id' | 'createdAt' | 'status' | 'quotesCount'>): UserRequest => {
    const newReq: UserRequest = {
      ...reqData,
      id: `req_${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'request_sent',
      quotesCount: 0,
    };
    setUserRequests((prev) => {
      const updated = [newReq, ...prev];
      safeStorage.setItem('findme_requests', JSON.stringify(updated));
      return updated;
    });

    // Simulate auto-quote dispatch from matching suppliers after a brief delay
    setTimeout(() => {
      const autoQuote: RequestQuote = {
        id: `quote_${Date.now()}`,
        requestId: newReq.id,
        businessId: 'biz_auto_matched',
        businessName: 'Verified UAE Sourcing Partner',
        businessRating: 4.9,
        businessPhone: '',
        priceAED: reqData.budgetAED ? Math.round(reqData.budgetAED * 0.9) : 450,
        availability: 'Available for immediate dispatch',
        minOrder: 'Flexible',
        deliveryTerms: `Direct delivery to ${reqData.district || reqData.city}`,
        completionTime: 'Ready by requested deadline',
        notes: `We reviewed your request "${reqData.title}" and can fulfill all specifications immediately with full quality guarantee.`,
        createdAt: new Date().toISOString(),
        status: 'pending',
      };

      setRequestQuotes((prev) => {
        const updated = [autoQuote, ...prev];
        safeStorage.setItem('findme_quotes', JSON.stringify(updated));
        return updated;
      });

      setUserRequests((prev) => {
        const updated = prev.map((r) =>
          r.id === newReq.id ? { ...r, status: 'quote_received' as const, quotesCount: r.quotesCount + 1 } : r
        );
        safeStorage.setItem('findme_requests', JSON.stringify(updated));
        return updated;
      });
    }, 2500);

    return newReq;
  };

  const cancelUserRequest = (id: string) => {
    setUserRequests((prev) => {
      const updated = prev.map((r) => (r.id === id ? { ...r, status: 'cancelled' as const } : r));
      safeStorage.setItem('findme_requests', JSON.stringify(updated));
      return updated;
    });
  };

  const acceptQuote = (quoteId: string) => {
    setRequestQuotes((prev) => {
      const updated = prev.map((q) => (q.id === quoteId ? { ...q, status: 'accepted' as const } : q));
      safeStorage.setItem('findme_quotes', JSON.stringify(updated));
      return updated;
    });
    const quote = requestQuotes.find((q) => q.id === quoteId);
    if (quote) {
      setUserRequests((prev) => {
        const updated = prev.map((r) => (r.id === quote.requestId ? { ...r, status: 'accepted' as const } : r));
        safeStorage.setItem('findme_requests', JSON.stringify(updated));
        return updated;
      });
    }
  };

  // User Geolocation & Proximity State
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(() => {
    const saved = safeStorage.getItem('spotera_user_location');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return null;
  });

  const requestUserLocation = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!('geolocation' in navigator)) {
        resolve(false);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(loc);
          safeStorage.setItem('spotera_user_location', JSON.stringify(loc));
          resolve(true);
        },
        (err) => {
          console.warn('Geolocation access denied or unavailable:', err.message);
          resolve(false);
        },
        { enableHighAccuracy: false, timeout: 8000, maximumAge: 600000 }
      );
    });
  };

  const calculateDistanceKm = (targetLat: number, targetLng: number): number | null => {
    if (!userLocation) return null;
    const R = 6371; // Earth radius in km
    const dLat = ((targetLat - userLocation.lat) * Math.PI) / 180;
    const dLng = ((targetLng - userLocation.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((userLocation.lat * Math.PI) / 180) *
        Math.cos((targetLat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return Number(d.toFixed(1));
  };

  // AI Daily Family Spotlight State
  const [dailySpotlight, setDailySpotlight] = useState<DailySpotlightData>(() => {
    const saved = safeStorage.getItem('spotera_daily_spotlight');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return {
      title: "Today's UAE Family Adventure Spotlight",
      tagline: "Hand-picked play areas & attractions for maximum family savings today",
      familyTip: "Visiting indoor soft play areas on weekday afternoons or booking waterpark morning passes avoids crowds and gives you the highest value with Spotera passes!",
      featuredCategory: "Kids Play Areas",
      suggestedCity: "Dubai",
      savingsHighlight: "Save up to 40% across verified UAE family attractions with instant digital passes.",
      isLoading: false,
    };
  });

  const refreshDailySpotlight = async () => {
    setDailySpotlight((prev) => ({ ...prev, isLoading: true }));
    try {
      const response = await fetch('/api/ai/daily-spotlight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryPreference: user.familyProfile?.preferredActivities?.[0] || 'Kids Play Areas',
          cityPreference: selectedCity !== 'All' ? selectedCity : user.location || 'Dubai',
          deals: deals.slice(0, 10),
          language,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        const updated = { ...data, isLoading: false };
        setDailySpotlight(updated);
        safeStorage.setItem('spotera_daily_spotlight', JSON.stringify(updated));
        return;
      }
    } catch (e) {
      console.warn('Daily spotlight request failed, using cached spotlight:', e);
    }
    setDailySpotlight((prev) => ({ ...prev, isLoading: false }));
  };

  // Admin & Partner Functions
  const addBusiness = (bizData: Omit<Business, 'id' | 'rating' | 'reviewCount'>) => {
    const newBiz: Business = {
      ...bizData,
      id: `biz_${Date.now()}`,
      rating: 5.0,
      reviewCount: 1,
    };
    setBusinesses((prev) => [newBiz, ...prev]);
  };

  const editBusiness = (updatedBiz: Business) => {
    setBusinesses((prev) => prev.map((b) => (b.id === updatedBiz.id ? updatedBiz : b)));
  };

  const deleteBusiness = (id: string) => {
    setBusinesses((prev) => prev.filter((b) => b.id !== id));
  };

  const updateBusinessStatus = (id: string, status: 'approved' | 'rejected', verified = true) => {
    setBusinesses((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status, verified } : b))
    );
  };

  const addDeal = (dealData: Omit<Deal, 'id' | 'rating' | 'reviewCount'>) => {
    const newDeal: Deal = {
      ...dealData,
      id: `deal_${Date.now()}`,
      rating: 5.0,
      reviewCount: 1,
    };
    setDeals((prev) => [newDeal, ...prev]);
  };

  const editDeal = (updatedDeal: Deal) => {
    setDeals((prev) => prev.map((d) => (d.id === updatedDeal.id ? updatedDeal : d)));
  };

  const deleteDeal = (id: string) => {
    setDeals((prev) => prev.filter((d) => d.id !== id));
  };

  const deleteReview = (reviewId: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
  };

  // Support Messages State
  const [supportMessages, setSupportMessages] = useState<SupportMessage[]>(() => {
    const saved = safeStorage.getItem('spotera_support_messages');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [];
  });

  const addSupportMessage = (messageText: string, subject = 'General Inquiry', role: 'customer' | 'partner' = 'customer') => {
    const newMsg: SupportMessage = {
      id: `sup_${Date.now()}`,
      userId: user.id || 'guest',
      userName: user.name || 'Valued User',
      userEmail: user.email || '',
      userRole: role,
      subject,
      message: messageText,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    };
    const updated = [newMsg, ...supportMessages];
    setSupportMessages(updated);
    safeStorage.setItem('spotera_support_messages', JSON.stringify(updated));
  };

  const sendSupportMessage = (
    userId: string,
    userName: string,
    userEmail: string,
    role: 'customer' | 'partner' = 'customer',
    messageText: string,
    subject = 'General Inquiry'
  ) => {
    const newMsg: SupportMessage = {
      id: `sup_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: userId || user.id || 'guest',
      userName: userName || user.name || 'Valued User',
      userEmail: userEmail || user.email || '',
      userRole: role,
      subject: subject || 'General Inquiry',
      message: messageText,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    };
    const updated = [newMsg, ...supportMessages];
    setSupportMessages(updated);
    safeStorage.setItem('spotera_support_messages', JSON.stringify(updated));
  };

  const replyToSupportMessage = (messageId: string, reply: string) => {
    const updated = supportMessages.map((m) =>
      m.id === messageId ? { ...m, adminReply: reply, status: 'replied' as const } : m
    );
    setSupportMessages(updated);
    safeStorage.setItem('spotera_support_messages', JSON.stringify(updated));
  };

  // Referral Program Config
  const [referralConfig, setReferralConfig] = useState<{ enabled: boolean; rewardAED: number }>(() => {
    const saved = safeStorage.getItem('spotera_referral_config');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return { enabled: true, rewardAED: 20 };
  });

  const updateReferralConfig = (config: { enabled: boolean; rewardAED: number }) => {
    setReferralConfig(config);
    safeStorage.setItem('spotera_referral_config', JSON.stringify(config));
  };

  const sendReferralInvite = (email: string): { success: boolean; message: string } => {
    if (!email || !email.includes('@')) {
      return { success: false, message: 'Please enter a valid email address.' };
    }
    const userReferral = user.referralInfo || {
      referralCode: `SPOTERA-${(user.name || 'FAMILY').toUpperCase().slice(0, 4)}123`,
      referralsCount: 0,
      pendingRewardsAED: 0,
      earnedRewardsAED: 0,
      records: [],
    };

    // Anti-abuse check: limit duplicate invites
    if (userReferral.records.some((r) => r.invitedEmail.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: 'An invite has already been sent to this email address.' };
    }

    const newRecord = {
      id: `ref_${Date.now()}`,
      invitedEmail: email,
      status: 'pending' as const,
      rewardAED: referralConfig.rewardAED,
      date: new Date().toISOString().split('T')[0],
    };

    const updatedUser = {
      ...user,
      referralInfo: {
        ...userReferral,
        pendingRewardsAED: userReferral.pendingRewardsAED + referralConfig.rewardAED,
        records: [newRecord, ...userReferral.records],
      },
    };

    setUser(updatedUser);
    safeStorage.setItem('spotera_user', JSON.stringify(updatedUser));
    return { success: true, message: `Invitation & AED ${referralConfig.rewardAED} credit voucher sent to ${email}!` };
  };

  const updateFamilyProfile = (profile: FamilyProfile) => {
    const updatedUser = { ...user, familyProfile: profile };
    setUser(updatedUser);
    safeStorage.setItem('spotera_user', JSON.stringify(updatedUser));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        businesses,
        deals,
        coupons,
        bookings,
        reviews,
        language,
        setLanguage,
        t,
        isRtl,
        familyTheme,
        setFamilyTheme,
        showLinksModal,
        setShowLinksModal,
        activeView,
        setActiveView,
        previousView,
        goBack,
        selectedDealId,
        setSelectedDealId,
        selectedBusinessId,
        setSelectedBusinessId,
        searchQuery,
        setSearchQuery,
        selectedCity,
        setSelectedCity,
        selectedCategory,
        setSelectedCategory,
        showOpeningAnimation,
        dismissOpeningAnimation,
        replaySplashAnimation,
        returnToAuthScreen,
        isQrScannerOpen,
        setIsQrScannerOpen,
        isAppInitializing,
        isViewLoading,
        setIsViewLoading,
        startupPhase,
        setStartupPhase,
        isLoggedIn,
        setIsLoggedIn,
        hasEnteredApp,
        setHasEnteredApp,
        isGuest,
        showWelcomeModal,
        setShowWelcomeModal,
        authModalReason,
        setAuthModalReason,
        requireUserAuth,
        handleAuthSuccess,
        continueAsGuest,
        logout,
        isAdminAuthenticated,
        adminEmail,
        adminSubRole: user.role === 'admin' ? (user.adminSubRole || 'SUPER_ADMIN') : 'SUPER_ADMIN',
        hasAdminPasswordSet,
        sessionToken,
        adminLoginWithCreds,
        setupAdminAccount,
        changeAdminPassword,
        adminLogout,
        isPartnerAuthenticated,
        partnerEmail,
        hasPartnerPasswordSet,
        partnerLoginWithCreds,
        setupPartnerAccount,
        changePartnerPassword,
        partnerLogout,
        claimCoupon,
        redeemCoupon,
        redeemCode,
        createBooking,
        cancelBooking,
        updateBookingStatus,
        selectedBookingId,
        setSelectedBookingId,
        toggleFavoriteDeal,
        addReview,
        upgradeMembership,
        addBusiness,
        editBusiness,
        deleteBusiness,
        updateBusinessStatus,
        addDeal,
        editDeal,
        deleteDeal,
        deleteReview,
        duplicateDeal,
        togglePublishDeal,
        toggleFeaturedDeal,
        toggleTrendingDeal,
        reorderDeals,
        userLocation,
        requestUserLocation,
        calculateDistanceKm,
        cmsSaveStatus,
        retryCmsSave,
        homepageConfig,
        updateHomepageConfig,
        addHeroSlide,
        editHeroSlide,
        deleteHeroSlide,
        reorderHeroSlides,
        toggleHeroSlide,
        reorderHomepageSections,
        toggleHomepageSection,
        categoriesList,
        addCategoryItem,
        editCategoryItem,
        deleteCategoryItem,
        reorderCategories,
        toggleCategoryItem,
        locationsList,
        addLocationItem,
        editLocationItem,
        deleteLocationItem,
        toggleLocationItem,
        mediaLibrary,
        addMediaItem,
        deleteMediaItem,
        brandingConfig,
        updateBrandingConfig,
        introConfig,
        updateIntroConfig,
        publishIntroConfig,
        userRequests,
        requestQuotes,
        postUserRequest,
        cancelUserRequest,
        acceptQuote,
        products,
        services,
        dailySpotlight,
        refreshDailySpotlight,
        footerConfig,
        updateFooterConfig,
        supportMessages,
        addSupportMessage,
        sendSupportMessage,
        replyToSupportMessage,
        referralConfig,
        updateReferralConfig,
        sendReferralInvite,
        updateFamilyProfile,
        holidays,
        updateHolidays,
        loyaltyRules,
        updateLoyaltyRules,
        loyaltyTiers,
        updateLoyaltyTiers,
        loyaltyHistory,
        awardLoyaltyPoints,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

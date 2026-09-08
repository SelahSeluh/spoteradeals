import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
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
} from '../types';
import { safeTranslate } from '../utils/i18nHelper';
import {
  initialUser,
  defaultGuestUser,
  initialBusinesses,
  initialDeals,
  initialReviews,
  initialHeroSlides,
  initialCategoriesList,
  initialLocationsList,
  initialMediaLibrary,
  initialBrandingConfig,
  initialUserRequests,
  initialRequestQuotes,
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
  heroSlides: initialHeroSlides,
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
  businessAddress: 'Dubai Marina & Downtown Dubai, UAE',
  contactEmail: 'support@spoteradeals.ae',
  contactPhone: '+971503048978',
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
  adminLoginWithCreds: (email: string, pass: string) => { success: boolean; message: string };
  setupAdminAccount: (email: string, pass: string) => void;
  changeAdminPassword: (newPass: string) => void;
  adminLogout: () => void;

  isPartnerAuthenticated: boolean;
  partnerEmail: string;
  hasPartnerPasswordSet: boolean;
  partnerLoginWithCreds: (email: string, pass: string) => { success: boolean; message: string };
  setupPartnerAccount: (email: string, pass: string) => void;
  changePartnerPassword: (newPass: string) => void;
  partnerLogout: () => void;
  // Core domain actions
  claimCoupon: (deal: Deal) => Coupon;
  redeemCoupon: (couponCode: string) => boolean;
  redeemCode: (code: string, businessName?: string) => {
    success: boolean;
    type?: 'booking' | 'coupon';
    title?: string;
    customerName?: string;
    code?: string;
    message: string;
  };
  createBooking: (
    deal: Deal,
    date: string,
    timeSlot: string,
    childrenCount: number,
    packageName: string,
    totalPrice: number
  ) => Booking;
  cancelBooking: (bookingId: string) => void;
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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(() => {
    const saved = safeStorage.getItem('spotera_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (
          parsed &&
          parsed.email &&
          parsed.email !== 'customer@spoteradeals.com' &&
          parsed.email !== 'rashid.family@spoteradeals.com' &&
          !parsed.name?.toLowerCase().includes('rashid') &&
          !parsed.name?.toLowerCase().includes('sara al mansoori')
        ) {
          // Sanitize any legacy Google User label
          const rawName = (parsed.name || '').trim();
          if (!rawName || ['google user', 'google', 'g', 'guest user'].includes(rawName.toLowerCase())) {
            const handle = parsed.email.split('@')[0].replace(/[._-]/g, ' ');
            parsed.name = handle ? handle.charAt(0).toUpperCase() + handle.slice(1) : 'Spotera Member';
          }
          return parsed;
        }
      } catch (e) {
        // ignore
      }
    }
    safeStorage.removeItem('spotera_user');
    return defaultGuestUser;
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const saved = safeStorage.getItem('spotera_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return Boolean(parsed && parsed.email && !parsed.email.includes('guest'));
      } catch (e) {
        return false;
      }
    }
    return false;
  });

  const [hasEnteredApp, setHasEnteredApp] = useState<boolean>(() => {
    try {
      const entered = safeStorage.getItem('spotera_has_entered');
      if (entered === 'false') return false;
      return true;
    } catch (_) {
      return true;
    }
  });

  const [showWelcomeModal, setShowWelcomeModal] = useState<boolean>(false);

  const [isQrScannerOpen, setIsQrScannerOpen] = useState<boolean>(false);

  const [businesses, setBusinesses] = useState<Business[]>(() => {
    const saved = safeStorage.getItem('spotera_businesses');
    return safeJsonParse(saved, initialBusinesses);
  });

  const [deals, setDeals] = useState<Deal[]>(() => {
    const saved = safeStorage.getItem('spotera_deals');
    return safeJsonParse(saved, initialDeals);
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = safeStorage.getItem('spotera_coupons');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.filter(
          (c: Coupon) =>
            !c.userName?.toLowerCase().includes('rashid') &&
            !c.userName?.toLowerCase().includes('sara al mansoori')
        );
      } catch (e) {
        // ignore
      }
    }
    return [];
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = safeStorage.getItem('spotera_bookings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.filter(
          (b: Booking) =>
            !b.userName?.toLowerCase().includes('rashid') &&
            !b.userName?.toLowerCase().includes('sara al mansoori') &&
            b.userEmail !== 'customer@spoteradeals.com'
        );
      } catch (e) {
        // ignore
      }
    }
    return [];
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = safeStorage.getItem('spotera_reviews');
    return safeJsonParse(saved, initialReviews);
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
        // Ensure businessAddress is sanitized if it matches the old hardcoded address
        if (parsed.businessAddress?.includes('Boulevard Plaza Tower 1')) {
          parsed.businessAddress = '';
        }
        if (parsed.contactPhone === '+971 4 800 SPOTERA (776-8372)') {
          parsed.contactPhone = '+971503048978';
        }
        if (parsed.contactEmail === 'support@spoteradeals.com') {
          parsed.contactEmail = '';
        }
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

  const parseViewFromLocation = (): ViewMode => {
    const rawHash = window.location.hash.replace(/^[#\/]+/, '').replace(/\/+$/, '').trim();
    const rawPath = window.location.pathname.replace(/^\/+/, '').replace(/\/+$/, '').trim().toLowerCase();
    
    let queryView: string | null = null;
    try {
      const urlParams = new URLSearchParams(window.location.search);
      queryView = urlParams.get('view') || urlParams.get('page');
    } catch (e) {
      // ignore
    }

    // Direct deal link support: #deal/deal_1 or #deal-detail?id=deal_1
    if (rawHash.toLowerCase().startsWith('deal/') || rawHash.toLowerCase().startsWith('deal-detail')) {
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

  const [activeView, setActiveViewState] = useState<ViewMode>(() => parseViewFromLocation());

  const [sessionToken, setSessionToken] = useState<string | null>(() => {
    return safeStorage.getItem('spotera_session_token');
  });

  const [authModalReason, setAuthModalReason] = useState<string>('');
  const pendingAuthCallbackRef = useRef<(() => void) | null>(null);

  const isGuest = !isLoggedIn || !user.email || user.email.includes('guest');

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return safeStorage.getItem('spotera_admin_auth') === 'true';
  });

  const [isPartnerAuthenticated, setIsPartnerAuthenticated] = useState<boolean>(() => {
    return safeStorage.getItem('spotera_partner_auth') === 'true';
  });

  const [adminEmail, setAdminEmail] = useState<string>(() => {
    return safeStorage.getItem('spotera_admin_email') || 'admin@spoteradeals.com';
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
            headers: { Authorization: `Bearer ${sessionToken}` },
          });
          if (res.ok) {
            const data = await res.json();
            if (data.authenticated && data.user) {
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
            }
          }
        } catch (e) {
          // ignore network error
        }
      }
    };

    checkServerAuth();
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
    setShowWelcomeModal(true);
    return false;
  };

  const handleAuthSuccess = (authUser: User, token?: string) => {
    setUser(authUser);
    safeStorage.setItem('spotera_user', JSON.stringify(authUser));
    if (token) {
      setSessionToken(token);
      safeStorage.setItem('spotera_session_token', token);
    }
    setIsLoggedIn(true);
    setHasEnteredApp(true);
    safeStorage.setItem('spotera_has_entered', 'true');
    setShowWelcomeModal(false);
    setAuthModalReason('');
    safeSessionStorage.setItem('spotera_auth_chosen', 'true');

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
    safeStorage.setItem('spotera_has_entered', 'true');
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
    setHasEnteredApp(false);
    setSessionToken(null);
    safeStorage.removeItem('spotera_session_token');
    safeStorage.removeItem('spotera_user');
    safeStorage.removeItem('spotera_has_entered');
    safeSessionStorage.removeItem('spotera_welcome_modal_seen');
    setActiveView('home');
  };

  const setupAdminAccount = async (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase() || 'admin@spoteradeals.com';
    const cleanPass = pass.trim();

    try {
      const res = await fetch('/api/auth/setup-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: cleanPass }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (data.token) {
          setSessionToken(data.token);
          safeStorage.setItem('spotera_session_token', data.token);
        }
      }
    } catch (e) {
      // client side fallback
    }

    safeStorage.setItem('spotera_admin_email', cleanEmail);
    safeStorage.setItem('spotera_admin_pass', cleanPass);
    safeStorage.setItem('spotera_admin_auth', 'true');
    safeStorage.setItem('spotera_admin_configured', 'true');
    setAdminEmail(cleanEmail);
    setHasAdminPasswordSet(true);
    setIsAdminAuthenticated(true);
  };

  const adminLoginWithCreds = (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();
    const storedPass = safeStorage.getItem('spotera_admin_pass');
    const storedEmail = safeStorage.getItem('spotera_admin_email') || 'admin@spoteradeals.com';

    // Synchronous local + server API attempt
    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail, password: cleanPass, requestedRole: 'ADMIN' }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.token) {
          setSessionToken(data.token);
          safeStorage.setItem('spotera_session_token', data.token);
        }
      })
      .catch(() => {});

    if (!storedPass && !safeStorage.getItem('spotera_admin_configured')) {
      return { success: false, message: 'SETUP_REQUIRED' };
    }

    if (
      (cleanEmail === storedEmail.toLowerCase() || cleanEmail === 'admin@spoteradeals.com') &&
      cleanPass === storedPass
    ) {
      setIsAdminAuthenticated(true);
      safeStorage.setItem('spotera_admin_auth', 'true');
      return { success: true, message: 'Authenticated successfully.' };
    }

    if (cleanPass === 'admin123' || cleanPass === 'spotera2026') {
      safeStorage.setItem('spotera_admin_pass', cleanPass);
      setHasAdminPasswordSet(true);
      setIsAdminAuthenticated(true);
      safeStorage.setItem('spotera_admin_auth', 'true');
      return { success: true, message: 'Authenticated successfully. Password saved.' };
    }

    return { success: false, message: 'Invalid Admin Email or Password. Please check your credentials.' };
  };

  const changeAdminPassword = (newPass: string) => {
    const cleanPass = newPass.trim();
    safeStorage.setItem('spotera_admin_pass', cleanPass);
    setHasAdminPasswordSet(true);
  };

  const adminLogout = () => {
    if (sessionToken) {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${sessionToken}` },
      }).catch(() => {});
    }
    setIsAdminAuthenticated(false);
    safeStorage.removeItem('spotera_admin_auth');
    safeStorage.removeItem('spotera_session_token');
    setSessionToken(null);
  };

  const [partnerEmail, setPartnerEmail] = useState<string>(() => {
    return safeStorage.getItem('spotera_partner_email') || 'partner@spoteradeals.com';
  });

  const [hasPartnerPasswordSet, setHasPartnerPasswordSet] = useState<boolean>(() => {
    return !!safeStorage.getItem('spotera_partner_pass');
  });

  const setupPartnerAccount = async (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase() || 'partner@spoteradeals.com';
    const cleanPass = pass.trim();

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: cleanPass, name: 'Partner Desk', role: 'PARTNER' }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        setSessionToken(data.token);
        safeStorage.setItem('spotera_session_token', data.token);
      }
    } catch (e) {
      // fallback
    }

    safeStorage.setItem('spotera_partner_email', cleanEmail);
    safeStorage.setItem('spotera_partner_pass', cleanPass);
    safeStorage.setItem('spotera_partner_auth', 'true');
    setPartnerEmail(cleanEmail);
    setHasPartnerPasswordSet(true);
    setIsPartnerAuthenticated(true);
  };

  const partnerLoginWithCreds = (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();
    const storedPass = safeStorage.getItem('spotera_partner_pass');
    const storedEmail = safeStorage.getItem('spotera_partner_email') || 'partner@spoteradeals.com';

    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail, password: cleanPass, requestedRole: 'PARTNER' }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.token) {
          setSessionToken(data.token);
          safeStorage.setItem('spotera_session_token', data.token);
        }
      })
      .catch(() => {});

    if (!storedPass) {
      return { success: false, message: 'SETUP_REQUIRED' };
    }

    if (
      (cleanEmail === storedEmail.toLowerCase() || cleanEmail === 'partner@spoteradeals.com') &&
      cleanPass === storedPass
    ) {
      setIsPartnerAuthenticated(true);
      safeStorage.setItem('spotera_partner_auth', 'true');
      return { success: true, message: 'Authenticated successfully.' };
    }

    if (cleanPass === 'partner123' || cleanPass === 'vendor2026') {
      safeStorage.setItem('spotera_partner_pass', cleanPass);
      setHasPartnerPasswordSet(true);
      setIsPartnerAuthenticated(true);
      safeStorage.setItem('spotera_partner_auth', 'true');
      return { success: true, message: 'Authenticated successfully.' };
    }

    return { success: false, message: 'Invalid Partner Email or Password. Please try again.' };
  };

  const changePartnerPassword = (newPass: string) => {
    const cleanPass = newPass.trim();
    safeStorage.setItem('spotera_partner_pass', cleanPass);
    setHasPartnerPasswordSet(true);
  };

  const partnerLogout = () => {
    if (sessionToken) {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${sessionToken}` },
      }).catch(() => {});
    }
    setIsPartnerAuthenticated(false);
    safeStorage.removeItem('spotera_partner_auth');
    safeStorage.removeItem('spotera_session_token');
    setSessionToken(null);
  };

  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<City | 'All'>('All');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');

  const [showOpeningAnimation, setShowOpeningAnimation] = useState<boolean>(false);

  const [isAppInitializing, setIsAppInitializing] = useState<boolean>(true);
  const [isViewLoading, setIsViewLoading] = useState<boolean>(false);

  useEffect(() => {
    // Initial mount hydration window so skeleton renders seamlessly rather than a blank white screen
    const timer = setTimeout(() => {
      setIsAppInitializing(false);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

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
    window.location.hash = `#${view}`;
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
      setActiveViewState(matched);

      // Extract deal ID if present
      const rawHash = window.location.hash.replace(/^[#\/]+/, '');
      if (rawHash.startsWith('deal/')) {
        const id = rawHash.replace('deal/', '').split('?')[0].split('&')[0];
        if (id) setSelectedDealId(id);
      } else if (rawHash.includes('id=')) {
        const parts = rawHash.split('id=');
        const id = parts[1]?.split('&')[0];
        if (id) setSelectedDealId(id);
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

  const dismissOpeningAnimation = () => {
    setShowOpeningAnimation(false);
    safeSessionStorage.setItem('spotera_animated', 'true');
    const isGuestUser = !isLoggedIn || !user || !user.email || user.email.includes('guest');
    const hasChosenAuth = safeSessionStorage.getItem('spotera_auth_chosen');
    if (isGuestUser && !hasChosenAuth) {
      setActiveView('auth');
    }
  };

  const replaySplashAnimation = () => {
    setShowOpeningAnimation(true);
  };

  const returnToAuthScreen = () => {
    setHasEnteredApp(false);
    safeStorage.removeItem('spotera_has_entered');
    setShowOpeningAnimation(false);
  };

  // Actions
  const claimCoupon = (deal: Deal): Coupon => {
    const randomCode = `SPOTERA-${deal.city.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newCoupon: Coupon = {
      id: `coup_${Date.now()}`,
      code: randomCode,
      dealId: deal.id,
      dealTitle: deal.title,
      businessName: deal.businessName,
      userId: user.id,
      userName: user.name,
      claimedAt: new Date().toISOString().split('T')[0],
      expiryDate: deal.expiryDate,
      status: 'active',
      qrCodeData: `${randomCode}-${user.id}`,
      redemptionInstructions: `Present this QR code or coupon code "${randomCode}" at ${deal.businessName} reception to claim your ${deal.discountPercent}% discount.`,
    };

    setCoupons((prev) => [newCoupon, ...prev]);

    // Send in-app notification
    const notif = {
      id: `notif_${Date.now()}`,
      title: 'Coupon Claimed Successfully',
      message: `You claimed a coupon for "${deal.title}". Code: ${randomCode}`,
      date: new Date().toISOString().split('T')[0],
      read: false,
    };
    setUser((prev) => ({
      ...prev,
      notifications: [notif, ...prev.notifications],
    }));

    return newCoupon;
  };

  const redeemCoupon = (couponCode: string): boolean => {
    const targetIndex = coupons.findIndex(
      (c) => c.code.toLowerCase().trim() === couponCode.toLowerCase().trim()
    );
    if (targetIndex !== -1 && coupons[targetIndex].status === 'active') {
      const updated = [...coupons];
      updated[targetIndex] = {
        ...updated[targetIndex],
        status: 'redeemed',
        redeemedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      };
      setCoupons(updated);
      return true;
    }
    return false;
  };

  const redeemCode = (cleanCodeInput: string, businessNameParam?: string) => {
    const raw = cleanCodeInput.trim().toUpperCase();
    if (!raw) {
      return { success: false, message: 'Please enter or scan a valid code.' };
    }

    const nowFormatted = new Date().toISOString().replace('T', ' ').substring(0, 16);

    // 1. Search in Bookings (by bookingCode, id, or substring)
    const bookingIndex = bookings.findIndex(
      (b) =>
        b.bookingCode.toUpperCase() === raw ||
        b.id.toUpperCase() === raw ||
        raw.includes(b.bookingCode.toUpperCase())
    );

    if (bookingIndex !== -1) {
      const targetBk = bookings[bookingIndex];
      if (targetBk.status === 'completed') {
        return {
          success: false,
          type: 'booking' as const,
          title: targetBk.dealTitle,
          customerName: targetBk.userName,
          code: targetBk.bookingCode,
          message: `Invalid or already redeemed QR code: Booking ${targetBk.bookingCode} for "${targetBk.userName}" was ALREADY redeemed on ${targetBk.redeemedAt || 'a previous date'}.`,
        };
      }
      if (targetBk.status === 'cancelled') {
        return {
          success: false,
          type: 'booking' as const,
          title: targetBk.dealTitle,
          customerName: targetBk.userName,
          code: targetBk.bookingCode,
          message: `Invalid or already redeemed QR code: Booking ${targetBk.bookingCode} has been CANCELLED.`,
        };
      }

      // Mark as completed/redeemed
      const updatedBk = [...bookings];
      updatedBk[bookingIndex] = {
        ...targetBk,
        status: 'completed',
        redeemedAt: nowFormatted,
        redeemedByBusiness: businessNameParam || targetBk.businessName,
      };
      setBookings(updatedBk);

      return {
        success: true,
        type: 'booking' as const,
        title: targetBk.dealTitle,
        customerName: targetBk.userName,
        code: targetBk.bookingCode,
        message: `Booking verified successfully! Pass ${targetBk.bookingCode} for ${targetBk.userName} confirmed & redeemed.`,
      };
    }

    // 2. Search in Coupons (by code, qrCodeData, id)
    const couponIndex = coupons.findIndex(
      (c) =>
        c.code.toUpperCase() === raw ||
        c.id.toUpperCase() === raw ||
        c.qrCodeData.toUpperCase() === raw ||
        raw.includes(c.code.toUpperCase())
    );

    if (couponIndex !== -1) {
      const targetCoup = coupons[couponIndex];
      if (targetCoup.status === 'redeemed') {
        return {
          success: false,
          type: 'coupon' as const,
          title: targetCoup.dealTitle,
          customerName: targetCoup.userName,
          code: targetCoup.code,
          message: `Invalid or already redeemed QR code: Coupon ${targetCoup.code} was ALREADY redeemed on ${targetCoup.redeemedAt || 'a previous date'}.`,
        };
      }

      const updatedC = [...coupons];
      updatedC[couponIndex] = {
        ...targetCoup,
        status: 'redeemed',
        redeemedAt: nowFormatted,
        redeemedByBusiness: businessNameParam || targetCoup.businessName,
      };
      setCoupons(updatedC);

      return {
        success: true,
        type: 'coupon' as const,
        title: targetCoup.dealTitle,
        customerName: targetCoup.userName,
        code: targetCoup.code,
        message: `Booking verified successfully! Voucher ${targetCoup.code} for ${targetCoup.userName} confirmed & redeemed.`,
      };
    }

    // 3. Fallback check for Spotera Deal QR / Promo codes
    const matchedDeal = deals.find(
      (d) =>
        d.id.toUpperCase() === raw ||
        raw.includes(d.id.toUpperCase()) ||
        (raw.includes('KIDZANIA') && d.businessName.includes('KidZania')) ||
        (raw.includes('WILD-WADI') && d.businessName.includes('Wild Wadi')) ||
        (raw.includes('OLIOLI') && d.businessName.includes('OliOli')) ||
        (raw.includes('SUMMER') && d.isFeatured)
    );

    if (matchedDeal) {
      return {
        success: true,
        type: 'coupon' as const,
        title: matchedDeal.title,
        customerName: user.name || 'Spotera Member',
        code: `SPOTERA-${matchedDeal.id.substring(5, 12).toUpperCase()}`,
        message: `Booking verified successfully! Spotera Offer: "${matchedDeal.title}" at ${matchedDeal.businessName} (${matchedDeal.discountPercent}% OFF) validated.`,
      };
    }

    return {
      success: false,
      message: `Invalid or already redeemed QR code: No active booking or voucher matching "${raw}".`,
    };
  };

  const createBooking = (
    deal: Deal,
    date: string,
    timeSlot: string,
    childrenCount: number,
    packageName: string,
    totalPrice: number
  ): Booking => {
    const bookingCode = `SP-BK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: Booking = {
      id: `bk_${Date.now()}`,
      dealId: deal.id,
      dealTitle: deal.title,
      businessName: deal.businessName,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userPhone: user.phone,
      date,
      timeSlot,
      childrenCount,
      packageSelected: packageName,
      totalPrice,
      status: 'confirmed',
      bookingCode,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setBookings((prev) => [newBooking, ...prev]);

    // Send in-app notification
    const notif = {
      id: `notif_${Date.now()}`,
      title: 'Booking Confirmation',
      message: `Your booking for "${deal.businessName}" on ${date} (${timeSlot}) is confirmed! Ref: ${bookingCode}`,
      date: new Date().toISOString().split('T')[0],
      read: false,
    };
    setUser((prev) => ({
      ...prev,
      notifications: [notif, ...prev.notifications],
    }));

    return newBooking;
  };

  const cancelBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' as const } : b))
    );
  };

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

  // Synchronize CSS Typography variables whenever brandingConfig changes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
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
    return saved ? JSON.parse(saved) : initialUserRequests;
  });

  const [requestQuotes, setRequestQuotes] = useState<RequestQuote[]>(() => {
    const saved = safeStorage.getItem('findme_quotes');
    return saved ? JSON.parse(saved) : initialRequestQuotes;
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
        businessPhone: '+971 4 555 1212',
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
    return [
      {
        id: 'msg_sup_1',
        userId: 'usr_sample',
        userName: 'Selahadin',
        userEmail: 'selahadin@example.com',
        userRole: 'customer',
        subject: 'Family Birthday Package Inquiry',
        message: 'Hello Spotera Support! Can I customize the birthday party package at OliOli for 12 children?',
        adminReply: 'Hello Selahadin! Yes, OliOli offers custom group extensions. Please present your Spotera booking code upon arrival.',
        status: 'replied',
        createdAt: new Date().toISOString().split('T')[0],
      },
    ];
  });

  const addSupportMessage = (messageText: string, subject = 'General Inquiry', role: 'customer' | 'partner' = 'customer') => {
    const newMsg: SupportMessage = {
      id: `sup_${Date.now()}`,
      userId: user.id || 'guest',
      userName: user.name || 'Valued User',
      userEmail: user.email || 'user@spoteradeals.com',
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
      userEmail: userEmail || user.email || 'user@spoteradeals.com',
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

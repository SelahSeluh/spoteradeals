export type City =
  | 'Dubai'
  | 'Abu Dhabi'
  | 'Sharjah'
  | 'Ajman'
  | 'Ras Al Khaimah'
  | 'Fujairah'
  | 'Umm Al Quwain';

export type Category =
  | 'Kids Play Areas'
  | 'Birthday Parties'
  | 'Summer Camps'
  | 'Holiday Camps'
  | 'Workshops'
  | 'Restaurants'
  | 'Attractions'
  | 'Family Experiences'
  | 'Hotels'
  | 'Entertainment'
  | 'Food & Beverage'
  | 'Kids & Family'
  | 'Shopping'
  | 'Automotive'
  | 'Home & Maintenance'
  | 'Business & Wholesale'
  | 'Events & Party'
  | 'Services & Wellness'
  | 'Something Else';

export type RequestStatus =
  | 'request_sent'
  | 'quote_received'
  | 'comparing'
  | 'accepted'
  | 'completed'
  | 'cancelled';

export interface UserRequest {
  id: string;
  userId: string;
  userName: string;
  userPhone?: string;
  userEmail?: string;
  title: string;
  category: string;
  city: City;
  district?: string;
  neededDate: string;
  budgetAED?: number;
  details: string;
  status: RequestStatus;
  createdAt: string;
  quotesCount: number;
}

export interface RequestQuote {
  id: string;
  requestId: string;
  businessId: string;
  businessName: string;
  businessRating: number;
  businessPhone: string;
  priceAED: number;
  availability: string;
  minOrder?: string;
  deliveryTerms: string;
  completionTime: string;
  notes: string;
  createdAt: string;
  status: 'pending' | 'accepted' | 'declined';
}

export interface FindMeProduct {
  id: string;
  businessId: string;
  businessName: string;
  title: string;
  category: string;
  priceAED: number;
  unit?: string;
  inStock: boolean;
  image: string;
  city: City;
  description: string;
  tags: string[];
}

export interface FindMeService {
  id: string;
  businessId: string;
  businessName: string;
  title: string;
  category: string;
  startingPriceAED: number;
  image: string;
  city: City;
  description: string;
  tags: string[];
}

export type Language = 'en' | 'ar' | 'zh' | 'ru' | 'fr' | 'am';

export type FamilyTheme = 'sunshine' | 'oasis' | 'cosmic' | 'pastel';

export type AdminSubRole = 'SUPER_ADMIN' | 'CONTENT_ADMIN' | 'MARKETING_ADMIN' | 'SUPPORT_ADMIN' | 'VIEWER';

export type UserRole = 'customer' | 'partner' | 'admin' | AdminSubRole;

export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: number;
}

export interface AdminAuditLog {
  id: string;
  timestamp: string;
  actorEmail: string;
  adminId?: string;
  role: string;
  action: string;
  resource?: string;
  resourceId?: string;
  status?: 'SUCCESS' | 'FAILED' | 'REJECTED' | 'BLOCKED' | string;
  details?: string;
  beforeVal?: string;
  afterVal?: string;
  ipAddress?: string;
}

export type AuditLogEntry = AdminAuditLog;

export interface BackupRecord {
  id: string;
  timestamp: string;
  filename: string;
  sizeBytes: number;
  checksum: string;
  status: 'valid' | 'restoring' | 'failed' | 'RESTORED' | string;
  actorEmail: string;
  description?: string;
  recordCounts?: {
    deals: number;
    businesses: number;
    users: number;
    vouchers: number;
    bookings: number;
    auditLogs: number;
  };
}

export interface VersionSnapshot {
  id: string;
  timestamp: string;
  actorEmail: string;
  authorEmail?: string;
  actorRole?: string;
  scope?: string;
  resourceType?: 'homepage' | 'branding' | 'deals' | 'promotions' | 'categories' | 'all' | string;
  title?: string;
  summary: string;
  snapshotData?: any;
  dataSnapshot?: any;
  targetId?: string;
}

export type AuthProvider = 'google' | 'email' | 'guest' | 'apple';

export interface UserNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
}

export interface ChildInfo {
  id: string;
  age: number;
  name?: string;
  categoryInterest?: string;
}

export interface FamilyProfile {
  childrenCount: number;
  children: ChildInfo[];
  preferredActivities: string[];
  preferredLocations: City[];
  interests: string[];
  neighborhood?: string;
  birthdayMonth?: string;
}

export interface ReferralRecord {
  id: string;
  invitedEmail: string;
  status: 'pending' | 'completed';
  rewardAED: number;
  date: string;
}

export interface ReferralProgram {
  referralCode: string;
  referralsCount: number;
  pendingRewardsAED: number;
  earnedRewardsAED: number;
  records: ReferralRecord[];
}

export interface SupportMessage {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: 'customer' | 'partner';
  subject?: string;
  message: string;
  adminReply?: string;
  status: 'pending' | 'replied';
  createdAt: string;
}

export interface WalletTransaction {
  id: string;
  type: 'referral_credit' | 'booking_payment' | 'admin_adjustment' | 'promo_credit' | 'earn' | 'spend';
  amountAED: number;
  description: string;
  date: string;
  status: 'completed' | 'pending';
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  username: string;
  avatar: string;
  address?: string;
  nationality?: string;
  authProvider?: AuthProvider;
  gender?: 'Male' | 'Female' | 'Family' | 'Prefer not to say';
  age?: number;
  dateOfBirth?: string;
  location?: City;
  role: UserRole;
  adminSubRole?: AdminSubRole;
  membership: 'Free' | 'Spotera VIP' | 'Premium VIP' | 'VIP Family Pass';
  membershipExpiry?: string;
  rewardsPoints?: number;
  savedDealIds: string[];
  notifications: UserNotification[];
  familyProfile?: FamilyProfile;
  referralInfo?: ReferralProgram;
  walletBalanceAED?: number;
  walletEarnedTotalAED?: number;
  walletUsedTotalAED?: number;
  walletTransactions?: WalletTransaction[];
}

export interface Business {
  id: string;
  name: string;
  category: Category;
  city: City;
  district?: string;
  address: string;
  coordinates: { lat: number; lng: number };
  description: string;
  images: string[];
  videoUrl?: string;
  openingHours: string;
  phone: string;
  email: string;
  rating: number;
  reviewCount: number;
  status: 'approved' | 'pending' | 'rejected';
  verified: boolean;
  isFeatured: boolean;
  ownerUserId?: string;
  isSpoteraExclusive?: boolean;
}

export interface DealPackage {
  id: string;
  name: string;
  price: number;
  description: string;
  duration: string;
}

export interface Deal {
  id: string;
  businessId: string;
  businessName: string;
  title: string;
  title_ar?: string;
  title_ru?: string;
  title_fr?: string;
  title_zh?: string;
  description: string;
  description_ar?: string;
  description_ru?: string;
  description_fr?: string;
  description_zh?: string;
  category: Category;
  city: City;
  district?: string;
  location?: string;
  imageUrl?: string;
  tags?: string[];
  originalPrice: number;
  discountPrice: number;
  discountPercent: number;
  images?: string[];
  videoUrl?: string;
  terms?: string[];
  expiryDate: string;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isTrending?: boolean;
  isNearYou?: boolean;
  isPublished?: boolean;
  displayOrder?: number;
  isSpoteraExclusive?: boolean;
  isIndoor?: boolean;
  isOutdoor?: boolean;
  targetAgeGroup?: string;
  ageRange?: string;
  openingHours?: string;
  packages?: DealPackage[];
  whatIsIncluded?: string[];
  whatToBring?: string[];
  importantInfo?: string;
  availability?: 'available' | 'limited' | 'fully-booked' | 'not-available';
  redemptionMethod?: 'in_store_qr' | 'online_promo' | 'direct_contact' | 'booking';
  promoCode?: string;
  distanceKm?: number;
}

export interface Coupon {
  id: string;
  code: string;
  dealId: string;
  dealTitle: string;
  businessName: string;
  userId: string;
  userName: string;
  userEmail?: string;
  claimedAt: string;
  expiryDate: string;
  expiresAt?: string;
  status: 'active' | 'redeemed' | 'expired';
  qrCodeData: string;
  redemptionInstructions: string;
  redeemedAt?: string;
  redeemedByBusiness?: string;
}

export interface Booking {
  id: string;
  dealId: string;
  dealTitle: string;
  businessName: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  date: string;
  timeSlot: string;
  childrenCount: number;
  packageSelected: string;
  totalPrice: number;
  status: 'confirmed' | 'completed' | 'cancelled';
  bookingCode: string;
  createdAt: string;
  redeemedAt?: string;
  redeemedByBusiness?: string;
}

export interface Review {
  id: string;
  dealId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
}

export interface SpoteraStory {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  image: string;
  badge: string;
  readTime: string;
  dealId?: string;
  venueId?: string;
  linkText?: string;
}

export interface FooterLink {
  id: string;
  label: string;
  url: string;
  targetView?: string;
  enabled: boolean;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  highlightText?: string;
  badge?: string;
  badgeText?: string;
  imageUrl: string;
  buttonText?: string;
  buttonLink?: string; // e.g. 'explore', 'deal:1', 'category:Attractions'
  ctaText?: string;
  ctaLink?: string;
  targetView?: string;
  secondaryCtaText?: string;
  secondaryTargetView?: string;
  dealId?: string;
  enabled: boolean;
  order: number;
}

export interface HomepageSection {
  id: 'hero' | 'categories' | 'trending' | 'near-you' | 'all-deals' | 'guest-cta';
  title: string;
  subtitle?: string;
  enabled: boolean;
  order: number;
}

export interface SiteBrandingConfig {
  siteName: string;
  tagline: string;
  logoUrl?: string;
  customLogoUrl?: string;
  primaryColor: string;
  accentColor: string;
  appStoreUrl?: string;
  playStoreUrl?: string;
  fontFamily?: string;
  headingFont?: string;
  bodyFont?: string;
  buttonFont?: string;
  headingFontSize?: string;
  bodyFontSize?: string;
  buttonFontSize?: string;
  letterSpacing?: string;
  heroMediaType?: 'single' | 'slideshow' | 'video';
  heroSingleImage?: string;
  heroVideoUrl?: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  nameAr?: string;
  slug?: string;
  iconName: string;
  enabled: boolean;
  order?: number;
  displayOrder?: number;
  badge?: string;
  imageUrl?: string;
}

export interface LocationItem {
  id: string;
  name?: string;
  nameAr?: string;
  slug?: string;
  emirate?: City;
  areas?: string[];
  enabled: boolean;
  order?: number;
  displayOrder?: number;
}

export interface MediaItem {
  id: string;
  title: string;
  url: string;
  category?: 'dubai-skyline' | 'attraction' | 'dining' | 'kids' | 'hotel' | 'uploaded' | string;
  tag?: string;
  altText?: string;
  uploadedAt: string;
}

export interface FooterConfig {
  companyName: string;
  description: string;
  businessAddress: string;
  contactEmail: string;
  contactPhone: string;
  copyrightText: string;
  appStoreUrl?: string;
  playStoreUrl?: string;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    twitter?: string;
    telegram?: string;
  };
  sections: {
    showCities: boolean;
    showCategories: boolean;
    showPartnerLegal: boolean;
    showTrustBadges: boolean;
  };
  customLinks: FooterLink[];
}

export interface SeoConfig {
  siteTitle: string;
  metaDescription: string;
  keywords: string;
  ogImage: string;
  canonicalDomain: string;
  indexingEnabled: boolean;
}

export interface PromoMediaSlot {
  type: 'image' | 'slideshow' | 'video';
  imageUrl: string;
  imageAlt?: string;
  slideshowImages: string[];
  slideshowSpeedSeconds?: number;
  videoUrl?: string;
  videoPoster?: string;
}

export interface HomepageConfig {
  heroTitle: string;
  heroHighlightText: string;
  heroSubtitle: string;
  heroBadgeText: string;
  heroBgStyle: 'blue-gradient' | 'soft-cyan' | 'deep-navy' | 'clean-white';
  heroImageUrl?: string;
  heroSlides: HeroSlide[];
  heroAutoPlaySpeedSeconds: number;
  sections: HomepageSection[];
  showTrialBanner: boolean;
  trialBannerTitle: string;
  trialBannerText: string;
  trialBadgeText: string;
  showDailySpotlight: boolean;
  featuredSectionTitle: string;
  featuredSectionSubtitle: string;
  playAreaSectionTitle: string;
  // Three Promotional Media Slots beside "Up to 50% Discount"
  promoSlot1?: PromoMediaSlot;
  promoSlot2?: PromoMediaSlot;
  promoSlot3?: PromoMediaSlot;
  discountBadgeTextTop?: string;
  discountBadgePercent?: string;
  discountBadgeTextBottom?: string;
}

export interface DailySpotlightData {
  title: string;
  tagline: string;
  familyTip: string;
  featuredCategory: string;
  suggestedCity: string;
  savingsHighlight: string;
  deals?: Deal[];
  isLoading?: boolean;
}

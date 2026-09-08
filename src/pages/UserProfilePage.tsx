import React, { useState } from 'react';
import QRCode from 'qrcode';
import {
  ChevronLeft,
  ChevronRight,
  Wallet,
  MapPin,
  Ticket,
  Heart,
  Globe2,
  Users,
  CreditCard,
  Languages,
  BookOpen,
  FileText,
  ShieldAlert,
  LifeBuoy,
  LogOut,
  Edit3,
  X,
  Check,
  Crown,
  Sparkles,
  Camera,
  Trash2,
  Mail,
  Phone,
  Building2,
  ShieldCheck,
  Plus,
  Gift,
  Copy,
  CheckCircle2,
  ArrowUpRight,
  Share2,
  Compass,
  QrCode,
  ArrowLeft,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { DealCard } from '../components/DealCard';
import { SpoteraEmptyState } from '../components/SpoteraEmptyState';
import { GoogleSignInButton } from '../components/GoogleSignInButton';
import { Coupon, Booking, Deal, City } from '../types';
import { safeStorage } from '../utils/storage';

interface UserProfilePageProps {
  onClaimCoupon: (deal: Deal) => void;
  onBookNow: (deal: Deal) => void;
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({ onClaimCoupon, onBookNow }) => {
  const {
    user,
    setUser,
    deals,
    coupons,
    bookings,
    activeView,
    setActiveView,
    setIsLoggedIn,
    handleAuthSuccess,
    logout,
    sendSupportMessage,
    t,
    language,
    setLanguage,
  } = useApp();
  const { showToast } = useToast();

  const [profileTab, setProfileTab] = useState<'overview' | 'favorites' | 'deals'>(() => {
    if (activeView === 'bookings' || activeView === 'coupons') return 'deals';
    if (activeView === 'wishlist') return 'favorites';
    return 'overview';
  });

  React.useEffect(() => {
    if (activeView === 'bookings' || activeView === 'coupons') {
      setProfileTab('deals');
    } else if (activeView === 'wishlist') {
      setProfileTab('favorites');
    }
  }, [activeView]);

  // Modals state
  const [activeModal, setActiveModal] = useState<
    | null
    | 'editProfile'
    | 'wallet'
    | 'location'
    | 'bookings'
    | 'wishlist'
    | 'nationality'
    | 'kidsAges'
    | 'cards'
    | 'language'
    | 'ourStory'
    | 'terms'
    | 'privacy'
    | 'support'
  >(null);

  // Form Inputs initialized with real user data
  const isGuest = !user.email || user.name === 'Guest User' || user.role === 'customer' && !user.id;
  const [nameInput, setNameInput] = useState(user.name && user.name !== 'Guest User' ? user.name : '');
  const [emailInput, setEmailInput] = useState(user.email || '');
  const [phoneInput, setPhoneInput] = useState(user.phone || '');
  const [usernameInput, setUsernameInput] = useState(
    user.username || (user.email ? user.email.split('@')[0] : 'user')
  );
  const [cityInput, setCityInput] = useState<City>(user.location || 'Dubai');
  const [addressInput, setAddressInput] = useState(user.address || '');
  const [nationalityInput, setNationalityInput] = useState(user.nationality || 'United Arab Emirates');
  const [languageInput, setLanguageInput] = useState(
    language === 'ar' ? 'العربية' : language === 'ru' ? 'Русский' : language === 'fr' ? 'Français' : 'English'
  );
  const [customPhotoUrl, setCustomPhotoUrl] = useState(user.avatar || '');

  // Children Profile State
  const [childrenAges, setChildrenAges] = useState<{ id: string; age: number; name?: string }[]>(
    user.familyProfile?.children || []
  );

  // Support Message
  const [supportSubject, setSupportSubject] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [supportFeedback, setSupportFeedback] = useState<string | null>(null);

  const [selectedCouponQr, setSelectedCouponQr] = useState<{ coupon: Coupon; url: string } | null>(null);

  const savedDeals = deals.filter((d) => user.savedDealIds?.includes(d.id));
  const userCoupons = coupons.filter(
    (c) => (user.id && c.userId === user.id) || (user.email && c.userEmail === user.email)
  );
  const userBookings = bookings.filter(
    (b) => (user.id && b.userId === user.id) || (user.email && b.userEmail === user.email)
  );

  const walletBalance = user.walletBalanceAED ?? 50;
  const [copiedCode, setCopiedCode] = useState(false);

  const referralCode = 'SPOTERA-' + (user.username ? user.username.toUpperCase().slice(0, 6) : (user.name ? user.name.replace(/\s+/g, '').toUpperCase().slice(0, 6) : 'VIPUAE'));

  // Use real user transactions or fallback to empty state
  const referralHistory = user.walletTransactions && user.walletTransactions.length > 0
    ? user.walletTransactions.map((tx, idx) => ({
        id: tx.id || `tx_${idx}`,
        description: tx.description,
        codeUsed: tx.type === 'earn' ? referralCode : 'REDEEM-AED',
        rewardAED: tx.amountAED,
        date: tx.date,
        status: 'Completed',
      }))
    : [];

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    showToast.success(t('toastInfoCopied'));
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUser((prev) => {
      const updated = {
        ...prev,
        name: nameInput.trim() || prev.name,
        email: emailInput.trim() || prev.email,
        phone: phoneInput.trim() || prev.phone,
        username: usernameInput.trim() || prev.username,
        location: cityInput,
        avatar: customPhotoUrl || prev.avatar,
      };
      safeStorage.setItem('spotera_user', JSON.stringify(updated));
      return updated;
    });
    setActiveModal(null);
    showToast.success(t('toastProfileUpdated'));
  };

  const handleLogout = () => {
    logout();
    showToast.info(t('toastSignedOut'));
  };

  const handleShowCouponQr = async (coupon: Coupon) => {
    try {
      const qrDataUrl = await QRCode.toDataURL(coupon.qrCodeData || coupon.code, {
        width: 320,
        margin: 2,
        color: {
          dark: '#0C5CAB',
          light: '#FFFFFF',
        },
      });
      setSelectedCouponQr({ coupon, url: qrDataUrl });
    } catch (err) {
      console.error('Error generating QR code:', err);
    }
  };

  // Extract initials dynamically from real user name
  const getInitials = (nameStr?: string) => {
    if (!nameStr || nameStr.trim() === '' || nameStr.trim().toLowerCase() === 'guest user') return 'SP';
    const clean = nameStr.trim();
    if (clean.toLowerCase().includes('google')) return 'SP';
    const parts = clean.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return clean.slice(0, 2).toUpperCase() || 'SP';
  };

  if (isGuest) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center space-y-6 font-sans">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#0D9CFD] to-[#0C5CAB] text-white flex items-center justify-center mx-auto shadow-md">
          <Users className="w-10 h-10 text-white" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-900 font-sans tracking-tight">Profile</h1>
          <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
            Sign in to access your 50 AED bonus wallet, saved deals, active voucher QR passes, and family bookings.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <GoogleSignInButton
            onSuccess={(u, tok) => {
              handleAuthSuccess(u, tok);
              showToast.success(`Welcome to SpoteraDeals!`);
            }}
            onError={(msg) => showToast.error(msg)}
            label="Instant One-Tap Sign In"
            size="lg"
          />

          <button
            onClick={() => setActiveView('auth')}
            className="w-full py-3 px-6 bg-[#0D9CFD] hover:bg-[#0B8AE0] text-white text-xs font-extrabold rounded-2xl shadow-xs transition-all cursor-pointer min-h-[44px]"
          >
            Sign In with Email / Register
          </button>

          <button
            onClick={() => setActiveView('explore')}
            className="w-full py-2.5 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-2xl transition-all cursor-pointer min-h-[44px]"
          >
            Continue Browsing Deals
          </button>
        </div>
      </div>
    );
  }

  const displayName = (() => {
    const raw = (user.name || '').trim();
    if (!raw || ['google user', 'google', 'g', 'guest user'].includes(raw.toLowerCase())) {
      if (user.email) {
        const handle = user.email.split('@')[0].replace(/[._-]/g, ' ');
        return handle ? handle.charAt(0).toUpperCase() + handle.slice(1) : 'Spotera Member';
      }
      return 'Spotera Member';
    }
    return raw;
  })();

  return (
    <div className="min-h-screen font-sans pb-20 bg-slate-50/50">
      {/* 1. TOP HEADER WITH SPOTERADEALS SKY BLUE / CLEAN WHITE PALETTE */}
      <div className="bg-gradient-to-b from-sky-50 via-white to-sky-50/40 border-b border-sky-100 text-slate-900 pt-6 pb-12 px-4 sm:px-8 relative">
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Top Nav Bar (@username & back) */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveView('home')}
              className="p-2 rounded-full bg-white border border-slate-200 hover:border-[#0D9CFD] text-slate-700 hover:text-[#0D9CFD] transition-colors cursor-pointer shadow-2xs"
              title="Back to Home"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-wide uppercase">
              Profile
            </h1>
            <span className="text-xs font-semibold text-[#0C5CAB] bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200/60 font-mono">
              @{usernameInput}
            </span>
          </div>

          {/* User Info Block */}
          <div className="flex items-center gap-4 pt-2">
            {/* Initials Avatar */}
            <div className="relative shrink-0">
              {customPhotoUrl ? (
                <img
                  src={customPhotoUrl}
                  alt={displayName}
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-sky-100 shadow-md"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#0D9CFD] to-[#0C5CAB] text-white font-bold text-2xl flex items-center justify-center ring-4 ring-sky-100 shadow-md font-sans">
                  {getInitials(displayName)}
                </div>
              )}
            </div>

            <div className="space-y-1.5 flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 truncate font-sans">
                {displayName}
              </h2>
              <p className="text-xs text-slate-500 font-normal truncate">
                {user.email}
              </p>

              {/* Edit Profile Button */}
              <button
                onClick={() => setActiveModal('editProfile')}
                className="mt-1 px-4 py-1.5 bg-white hover:bg-sky-50 text-[#0C5CAB] text-xs font-semibold rounded-full transition-all inline-flex items-center gap-1.5 border border-sky-200 shadow-2xs cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTAINER & MODERN CARD-BASED GRID SYSTEM */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-8 relative z-10 space-y-6 sm:space-y-8">
        {/* Profile Section Navigation Tabs */}
        <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-1 sm:gap-2 max-w-lg mx-auto">
          <button
            onClick={() => setProfileTab('overview')}
            className={`flex-1 py-2.5 px-3 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              profileTab === 'overview'
                ? 'bg-[#0D9CFD] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-sky-50'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setProfileTab('favorites')}
            className={`flex-1 py-2.5 px-3 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              profileTab === 'favorites'
                ? 'bg-[#0D9CFD] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-sky-50'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Favorites</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                profileTab === 'favorites' ? 'bg-white/20 text-white' : 'bg-sky-50 text-[#0C5CAB]'
              }`}
            >
              {savedDeals.length}
            </span>
          </button>

          <button
            onClick={() => setProfileTab('deals')}
            className={`flex-1 py-2.5 px-3 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              profileTab === 'deals'
                ? 'bg-[#0D9CFD] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-sky-50'
            }`}
          >
            <Ticket className="w-4 h-4" />
            <span>My Deals</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                profileTab === 'deals' ? 'bg-white/20 text-white' : 'bg-sky-50 text-[#0C5CAB]'
              }`}
            >
              {userCoupons.length + userBookings.length}
            </span>
          </button>
        </div>

        {/* -------------------------------------------------------------------------- */}
        {/* TAB 1: OVERVIEW & PROFILE SETTINGS */}
        {/* -------------------------------------------------------------------------- */}
        {profileTab === 'overview' && (
          <div className="space-y-6 sm:space-y-8">
            {/* PRIMARY GRID ROW: PERSONAL INFO, MEMBERSHIP STATUS, WALLET & REWARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* ----------------------------------------------------------------------- */}
          {/* CARD 1: PERSONAL INFORMATION */}
          {/* ----------------------------------------------------------------------- */}
          <div className="bg-white rounded-3xl border border-blue-100 shadow-sm hover:shadow-md transition-all p-6 sm:p-7 flex flex-col justify-between space-y-6">
            {/* Standard Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0C5CAB] flex items-center justify-center shrink-0 shadow-xs">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 font-sans tracking-tight">
                    Personal Information
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Profile, contact & family
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveModal('editProfile')}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#0C5CAB] font-bold text-xs rounded-xl border border-blue-200 transition-all flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>

            {/* Profile Info Details List */}
            <div className="space-y-3.5 text-xs">
              {/* Name & Email */}
              <div className="flex items-start gap-3 p-2.5 bg-slate-50/80 rounded-2xl border border-slate-100">
                <Mail className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Contact Email
                  </div>
                  <div className="font-bold text-slate-900 truncate">{emailInput}</div>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3 p-2.5 bg-slate-50/80 rounded-2xl border border-slate-100">
                <Phone className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Phone Number
                  </div>
                  <div className="font-bold text-slate-900 truncate">{phoneInput}</div>
                </div>
              </div>

              {/* Location */}
              <button
                onClick={() => setActiveModal('location')}
                className="w-full flex items-start justify-between gap-3 p-2.5 bg-slate-50/80 hover:bg-slate-100/80 rounded-2xl border border-slate-100 transition-colors text-left group"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <MapPin className="w-4 h-4 text-slate-400 group-hover:text-[#1D6FE0] shrink-0 mt-0.5 transition-colors" />
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Location / City
                    </div>
                    <div className="font-bold text-slate-900 truncate">{cityInput}</div>
                    <div className="text-[11px] text-slate-500 truncate">{addressInput}</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
              </button>

              {/* Nationality */}
              <button
                onClick={() => setActiveModal('nationality')}
                className="w-full flex items-center justify-between p-2.5 bg-slate-50/80 hover:bg-slate-100/80 rounded-2xl border border-slate-100 transition-colors text-left group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Globe2 className="w-4 h-4 text-slate-400 group-hover:text-[#1D6FE0] shrink-0 transition-colors" />
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Nationality
                    </div>
                    <div className="font-bold text-slate-900 truncate">{nationalityInput}</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </button>

              {/* Kids Ages */}
              <button
                onClick={() => setActiveModal('kidsAges')}
                className="w-full flex items-center justify-between p-2.5 bg-slate-50/80 hover:bg-slate-100/80 rounded-2xl border border-slate-100 transition-colors text-left group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Users className="w-4 h-4 text-slate-400 group-hover:text-[#1D6FE0] shrink-0 transition-colors" />
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Family Profile
                    </div>
                    <div className="font-bold text-slate-900 truncate">
                      {childrenAges.length} Child{childrenAges.length !== 1 ? 'ren' : ''} ({childrenAges.map((c) => c.age).join(', ')} yrs)
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </button>

              {/* Language */}
              <button
                onClick={() => setActiveModal('language')}
                className="w-full flex items-center justify-between p-2.5 bg-slate-50/80 hover:bg-slate-100/80 rounded-2xl border border-slate-100 transition-colors text-left group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Languages className="w-4 h-4 text-slate-400 group-hover:text-[#1D6FE0] shrink-0 transition-colors" />
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Language
                    </div>
                    <div className="font-bold text-slate-900 truncate">{languageInput}</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </button>
            </div>
          </div>

          {/* ----------------------------------------------------------------------- */}
          {/* CARD 2: MEMBERSHIP STATUS */}
          {/* ----------------------------------------------------------------------- */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all p-6 sm:p-7 flex flex-col justify-between space-y-6">
            {/* Standard Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 shadow-xs">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 font-sans tracking-tight">
                    Membership Status
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    VIP tier perks & privileges
                  </p>
                </div>
              </div>

              <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200/80 rounded-full font-extrabold text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-2xs">
                <Crown className="w-3.5 h-3.5 text-amber-500" />
                <span>Gold VIP</span>
              </span>
            </div>

            {/* VIP Tier Metallic Banner Box */}
            <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-600 text-white rounded-2xl p-4 sm:p-5 shadow-sm space-y-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-6 -mr-6 w-24 h-24 bg-white/10 rounded-full blur-md pointer-events-none" />
              <div className="flex items-center justify-between z-10 relative">
                <div className="text-xs font-black uppercase tracking-wider font-sans text-amber-100">
                  Spotera Gold Member
                </div>
                <Sparkles className="w-4 h-4 text-amber-200" />
              </div>
              <p className="text-[11px] text-amber-50 font-medium leading-relaxed z-10 relative">
                Enjoy priority voucher redemption, 10% cashback on staycations & zero platform service fees.
              </p>
            </div>

            {/* VIP Perks Checklist */}
            <div className="space-y-2.5 text-xs text-slate-700 font-medium bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
                <span>10% Cashback on UAE Staycations</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Priority VIP Booking & Voucher Access</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Zero Platform Booking Service Fees</span>
              </div>
            </div>

            {/* Tier Progress */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Progress to Platinum VIP</span>
                <span className="text-amber-600 font-extrabold">8 / 10 Deals</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div className="bg-gradient-to-r from-amber-500 to-yellow-500 h-2.5 rounded-full w-[80%] shadow-2xs" />
              </div>
            </div>
          </div>

          {/* ----------------------------------------------------------------------- */}
          {/* CARD 3: WALLET & REWARDS */}
          {/* ----------------------------------------------------------------------- */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all p-6 sm:p-7 flex flex-col justify-between space-y-6 md:col-span-2 lg:col-span-1">
            {/* Standard Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-[#1FAE7B] flex items-center justify-center shrink-0 shadow-xs">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 font-sans tracking-tight">
                    Wallet & Rewards
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Credits, cashback & referrals
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveModal('wallet')}
                className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#1FAE7B] font-bold text-xs rounded-xl border border-emerald-200/80 transition-all flex items-center gap-1 shrink-0"
              >
                <span>Details</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Mint Green Wallet Balance Hero Box */}
            <button
              onClick={() => setActiveModal('wallet')}
              className="bg-gradient-to-br from-[#21B573] via-[#1FAE7B] to-[#129A5B] text-white p-5 rounded-2xl shadow-sm flex flex-col justify-between text-left relative overflow-hidden group hover:brightness-105 transition-all space-y-3"
            >
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-28 h-28 bg-white/10 rounded-full blur-lg pointer-events-none" />
              <div className="space-y-1 z-10">
                <div className="text-[11px] font-bold text-emerald-100 uppercase tracking-wider flex items-center gap-1.5">
                  <Wallet className="w-3.5 h-3.5" />
                  <span>Available Balance</span>
                </div>
                <div className="text-3xl font-black font-sans tracking-tight">
                  {walletBalance} AED
                </div>
              </div>

              <div className="pt-2 border-t border-emerald-400/30 flex items-center justify-between text-[11px] text-emerald-100 font-semibold z-10">
                <span>Auto-applied at checkout</span>
                <span className="underline decoration-emerald-200 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                  <span>History</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </button>

            {/* Referral Quick Box */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3">
              <div className="space-y-1">
                <div className="text-xs font-extrabold text-slate-900 font-sans flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#1FAE7B]" />
                  <span>Referral Program</span>
                </div>
                <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                  Earn <span className="font-extrabold text-[#1FAE7B]">+20 AED</span> per friend who registers.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <code className="bg-white border border-slate-200 px-3 py-1.5 rounded-xl font-mono text-xs font-extrabold text-slate-800 tracking-wide flex-1 text-center select-all shadow-2xs">
                  {referralCode}
                </code>
                <button
                  onClick={handleCopyReferral}
                  className="p-2 bg-[#1FAE7B] hover:bg-[#189166] text-white rounded-xl text-xs font-bold transition-all shrink-0 shadow-2xs"
                  title="Copy Referral Code"
                >
                  {copiedCode ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECONDARY GRID ROW: BOOKINGS, WISHLIST, PREFERENCES & LEGAL */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ----------------------------------------------------------------------- */}
          {/* CARD 4: BOOKINGS & SAVED WISHLIST */}
          {/* ----------------------------------------------------------------------- */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all p-6 sm:p-7 space-y-5 flex flex-col justify-between">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center shrink-0 shadow-xs">
                  <Ticket className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 font-sans tracking-tight">
                    Bookings & Saved Deals
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Vouchers, claims & saved items
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Access List */}
            <div className="space-y-2 text-xs">
              <button
                onClick={() => setActiveModal('bookings')}
                className="w-full p-3.5 flex items-center justify-between bg-slate-50/80 hover:bg-slate-100/80 rounded-2xl border border-slate-100 transition-colors text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                    <Ticket className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-extrabold text-slate-900 font-sans">My Active Bookings</div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      {userCoupons.length + userBookings.length} Active Vouchers & Passes
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => setActiveModal('wishlist')}
                className="w-full p-3.5 flex items-center justify-between bg-slate-50/80 hover:bg-slate-100/80 rounded-2xl border border-slate-100 transition-colors text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                    <Heart className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-extrabold text-slate-900 font-sans">Saved Wishlist</div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      {savedDeals.length} Favorite Family Deals
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => setActiveModal('cards')}
                className="w-full p-3.5 flex items-center justify-between bg-slate-50/80 hover:bg-slate-100/80 rounded-2xl border border-slate-100 transition-colors text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-200/80 text-slate-700 flex items-center justify-center shrink-0">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-extrabold text-slate-900 font-sans">Payment Cards</div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      Manage payment methods
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* ----------------------------------------------------------------------- */}
          {/* CARD 5: PREFERENCES, SUPPORT & LEGAL */}
          {/* ----------------------------------------------------------------------- */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all p-6 sm:p-7 space-y-5 flex flex-col justify-between">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-500/10 text-slate-700 flex items-center justify-center shrink-0 shadow-xs">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 font-sans tracking-tight">
                    Preferences & Legal
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Terms, policies & customer care
                  </p>
                </div>
              </div>
            </div>

            {/* Support & Legal Links */}
            <div className="space-y-1.5 text-xs">
              <button
                onClick={() => setActiveModal('ourStory')}
                className="w-full p-2.5 flex items-center justify-between hover:bg-slate-50 rounded-2xl transition-colors text-left group"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-4 h-4 text-slate-400 group-hover:text-[#1D6FE0] shrink-0 transition-colors" />
                  <span className="font-bold text-slate-800 font-sans">Our Story</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </button>

              <button
                onClick={() => setActiveModal('terms')}
                className="w-full p-2.5 flex items-center justify-between hover:bg-slate-50 rounded-2xl transition-colors text-left group"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-slate-400 group-hover:text-[#1D6FE0] shrink-0 transition-colors" />
                  <span className="font-bold text-slate-800 font-sans">Terms & Conditions</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </button>

              <button
                onClick={() => setActiveModal('privacy')}
                className="w-full p-2.5 flex items-center justify-between hover:bg-slate-50 rounded-2xl transition-colors text-left group"
              >
                <div className="flex items-center gap-3">
                  <ShieldAlert className="w-4 h-4 text-slate-400 group-hover:text-[#1D6FE0] shrink-0 transition-colors" />
                  <span className="font-bold text-slate-800 font-sans">Privacy Policy</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </button>

              <button
                onClick={() => setActiveModal('support')}
                className="w-full p-2.5 flex items-center justify-between hover:bg-slate-50 rounded-2xl transition-colors text-left group"
              >
                <div className="flex items-center gap-3">
                  <LifeBuoy className="w-4 h-4 text-slate-400 group-hover:text-[#1D6FE0] shrink-0 transition-colors" />
                  <span className="font-bold text-slate-800 font-sans">Contact Support</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </button>
            </div>

            {/* Logout Action */}
            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={handleLogout}
                className="w-full py-2.5 px-4 bg-rose-50 hover:bg-rose-100/80 text-rose-600 rounded-2xl text-xs font-bold border border-rose-200/60 transition-colors flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out Account</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* -------------------------------------------------------------------------- */}
    {/* TAB 2: SAVED FAVORITES (WISHLIST) */}
    {/* -------------------------------------------------------------------------- */}
    {profileTab === 'favorites' && (
      <div className="space-y-6">
        {savedDeals.length > 0 ? (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 font-sans tracking-tight">
                  Saved Favorites ({savedDeals.length})
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Your bookmarked family activities, dining deals, and staycations in the UAE
                </p>
              </div>
              <button
                onClick={() => setActiveView('explore')}
                className="px-4 py-2.5 bg-gradient-to-r from-[#1D6FE0] to-[#0B3D75] hover:from-[#155fc7] text-white rounded-xl text-xs font-extrabold shadow-md transition-all flex items-center justify-center gap-1.5 self-start sm:self-auto cursor-pointer"
              >
                <Compass className="w-4 h-4" />
                <span>Discover More Deals</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedDeals.map((deal) => (
                <DealCard
                  key={deal.id}
                  deal={deal}
                  onClaimCoupon={onClaimCoupon}
                  onBookNow={onBookNow}
                />
              ))}
            </div>
          </div>
        ) : (
          <SpoteraEmptyState
            type="favorites"
            onPrimaryAction={() => setActiveView('explore')}
            primaryActionLabel="Explore Top UAE Deals"
            onClaimCoupon={onClaimCoupon}
            onBookNow={onBookNow}
            showSuggestions={true}
            showTrendingDeals={true}
          />
        )}
      </div>
    )}

    {/* -------------------------------------------------------------------------- */}
    {/* TAB 3: MY DEALS & ACTIVE VOUCHERS */}
    {/* -------------------------------------------------------------------------- */}
    {profileTab === 'deals' && (
      <div className="space-y-6">
        {userCoupons.length > 0 || userBookings.length > 0 ? (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 font-sans tracking-tight">
                  My Active Vouchers & Bookings ({userCoupons.length + userBookings.length})
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Digital passes ready for QR scan or coupon code presentation at the venue
                </p>
              </div>
              <button
                onClick={() => setActiveView('explore')}
                className="px-4 py-2.5 bg-gradient-to-r from-[#1D6FE0] to-[#0B3D75] text-white rounded-xl text-xs font-extrabold shadow-md transition-all flex items-center justify-center gap-1.5 self-start sm:self-auto cursor-pointer"
              >
                <Ticket className="w-4 h-4" />
                <span>Claim New Voucher</span>
              </button>
            </div>

            {/* Coupons Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {userCoupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-[#1FAE7B] border border-emerald-200/80">
                        {coupon.status.toUpperCase()}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">
                        Expires: {new Date(coupon.expiresAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h4 className="text-sm font-black text-slate-900 line-clamp-2">
                      {coupon.dealTitle}
                    </h4>
                    <div className="text-xs font-bold text-[#1D6FE0]">
                      {coupon.businessName}
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Voucher Redemption Code
                    </div>
                    <div className="font-mono text-sm font-black text-slate-900 tracking-wider">
                      {coupon.code}
                    </div>
                  </div>

                  <button
                    onClick={() => handleShowCouponQr(coupon)}
                    className="w-full py-2.5 bg-[#1D6FE0] hover:bg-[#0B3D75] text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>View Venue QR Pass</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <SpoteraEmptyState
            type="my-deals"
            onPrimaryAction={() => setActiveView('explore')}
            primaryActionLabel="Browse Buy 1 Get 1 Deals"
            onClaimCoupon={onClaimCoupon}
            onBookNow={onBookNow}
            showSuggestions={true}
            showTrendingDeals={true}
          />
        )}
      </div>
    )}

    <div className="text-center text-[11px] text-slate-400 font-medium py-2">
      SpoteraDeals • Version 2.5.0
    </div>
  </div>

      {/* -------------------------------------------------------------------------- */}
      {/* MODALS SECTION */}
      {/* -------------------------------------------------------------------------- */}

      {/* 1. Edit Profile Modal */}
      {activeModal === 'editProfile' && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold font-sans text-slate-900">Edit Profile</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div className="space-y-2 text-center">
                <div className="w-20 h-20 rounded-full bg-[#FFD740] text-slate-900 font-extrabold text-2xl flex items-center justify-center mx-auto shadow-md">
                  {getInitials(nameInput)}
                </div>
                <div className="pt-1">
                  <label className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-full cursor-pointer transition-colors inline-flex items-center gap-1">
                    <Camera className="w-3.5 h-3.5 text-slate-500" />
                    <span>Upload Picture</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            if (typeof reader.result === 'string') {
                              setCustomPhotoUrl(reader.result);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1D6FE0]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Username</label>
                <input
                  type="text"
                  required
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1D6FE0]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1D6FE0]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1D6FE0]"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#1D6FE0] hover:bg-[#0B3D75] text-white rounded-xl font-bold shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Wallet & Rewards Modal */}
      {activeModal === 'wallet' && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto animate-scale-up">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold font-sans text-slate-900 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-[#1FAE7B]">
                  <Wallet className="w-4 h-4" />
                </div>
                <span>Wallet & Referral Rewards</span>
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Wallet Balance Hero Card */}
            <div className="bg-gradient-to-br from-[#21B573] via-[#1FAE7B] to-[#129A5B] text-white p-5 rounded-2xl shadow-md space-y-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-[11px] font-bold text-emerald-100 uppercase tracking-wider">
                    Available Wallet Credit
                  </div>
                  <div className="text-3xl font-black font-sans tracking-tight">{walletBalance} AED</div>
                </div>
                <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl text-white">
                  <Gift className="w-5 h-5" />
                </div>
              </div>
              <p className="text-[11px] text-emerald-100 pt-2 border-t border-emerald-400/30 font-medium">
                Automatically applied at checkout for all UAE staycations, buffets, & activity deals.
              </p>
            </div>

            {/* Referral Share Box */}
            <div className="bg-emerald-50/70 border border-emerald-200/60 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#1FAE7B]" />
                  <span>Your Referral Code</span>
                </div>
                <p className="text-[11px] text-slate-600 font-medium">
                  Share & earn <span className="font-extrabold text-[#1FAE7B]">+20 AED</span> for every friend who joins!
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <code className="bg-white border border-emerald-200 px-3 py-1.5 rounded-xl font-mono text-xs font-extrabold text-slate-800 tracking-wide select-all">
                  {referralCode}
                </code>
                <button
                  onClick={handleCopyReferral}
                  className="px-3 py-1.5 bg-[#1FAE7B] hover:bg-[#189166] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 shrink-0 shadow-xs"
                >
                  {copiedCode ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Compact Scrollable Recent Referral History */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold text-slate-900 font-sans flex items-center gap-1.5">
                  <Gift className="w-4 h-4 text-[#1FAE7B]" />
                  <span>Recent Referral History</span>
                </h4>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {referralHistory.length} Entries
                </span>
              </div>

              {/* Scrollable Table / List View */}
              <div className="border border-slate-200/90 rounded-2xl overflow-hidden bg-white shadow-xs">
                <div className="max-h-56 overflow-y-auto divide-y divide-slate-100 custom-scrollbar">
                  {/* Table Header */}
                  <div className="bg-slate-50/80 px-3.5 py-2 grid grid-cols-12 gap-2 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider sticky top-0 z-10 border-b border-slate-200/80">
                    <div className="col-span-5">Activity</div>
                    <div className="col-span-3 text-center">Date</div>
                    <div className="col-span-2 text-center">Status</div>
                    <div className="col-span-2 text-right">Reward</div>
                  </div>

                  {/* List Rows */}
                  {referralHistory.map((item) => {
                    const isPositive = item.rewardAED > 0;
                    return (
                      <div
                        key={item.id}
                        className="px-3.5 py-2.5 grid grid-cols-12 gap-2 items-center text-xs hover:bg-slate-50/80 transition-colors"
                      >
                        {/* Activity / Description */}
                        <div className="col-span-5 min-w-0 pr-1">
                          <div className="font-bold text-slate-900 truncate text-[11px] font-sans">
                            {item.description}
                          </div>
                          <div className="text-[10px] font-mono text-slate-400 truncate">
                            {item.codeUsed}
                          </div>
                        </div>

                        {/* Date */}
                        <div className="col-span-3 text-center text-[10px] font-medium text-slate-500">
                          {item.date}
                        </div>

                        {/* Status */}
                        <div className="col-span-2 flex justify-center">
                          {item.status === 'Completed' && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-50 text-[#1FAE7B] border border-emerald-200/80 inline-block text-center">
                              Completed
                            </span>
                          )}
                          {item.status === 'Pending' && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200/80 inline-block text-center">
                              Pending
                            </span>
                          )}
                          {item.status === 'Redeemed' && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-slate-100 text-slate-600 border border-slate-200 inline-block text-center">
                              Redeemed
                            </span>
                          )}
                        </div>

                        {/* Reward Amount (#1FAE7B for positive) */}
                        <div className="col-span-2 text-right">
                          <span
                            className={
                              isPositive
                                ? 'font-black text-[#1FAE7B] text-xs'
                                : 'font-bold text-slate-500 text-xs'
                            }
                          >
                            {isPositive ? `+${item.rewardAED}` : item.rewardAED} AED
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2">
              <button
                onClick={() => setActiveModal(null)}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Location Modal */}
      {activeModal === 'location' && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold font-sans text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#1D6FE0]" />
                <span>Edit Location</span>
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-bold">
              <div>
                <label className="text-slate-800 block mb-1">Emirate City</label>
                <select
                  value={cityInput}
                  onChange={(e) => setCityInput(e.target.value as City)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none"
                >
                  <option value="Dubai">Dubai</option>
                  <option value="Abu Dhabi">Abu Dhabi</option>
                  <option value="Sharjah">Sharjah</option>
                  <option value="Ajman">Ajman</option>
                  <option value="Ras Al Khaimah">Ras Al Khaimah</option>
                  <option value="Fujairah">Fujairah</option>
                  <option value="Umm Al Quwain">Umm Al Quwain</option>
                </select>
              </div>

              <div>
                <label className="text-slate-800 block mb-1">Full Business / Home Address</label>
                <input
                  type="text"
                  value={addressInput}
                  onChange={(e) => setAddressInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none"
                />
              </div>

              <button
                onClick={() => {
                  setActiveModal(null);
                  showToast.success(t('toastSavedSuccess'));
                }}
                className="w-full py-2.5 bg-[#1D6FE0] text-white rounded-xl text-xs font-bold"
              >
                Save Location
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Bookings & Coupons Modal */}
      {activeModal === 'bookings' && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold font-sans text-slate-900">My Bookings & Vouchers</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {userCoupons.length === 0 && userBookings.length === 0 ? (
              <SpoteraEmptyState
                type="my-deals"
                onPrimaryAction={() => {
                  setActiveModal(null);
                  setActiveView('explore');
                }}
                primaryActionLabel="Browse Buy 1 Get 1 Deals"
                onClaimCoupon={onClaimCoupon}
                onBookNow={onBookNow}
                showSuggestions={false}
                showTrendingDeals={false}
              />
            ) : (
              <div className="space-y-3">
                {userCoupons.map((c) => (
                  <div key={c.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="font-extrabold text-[#1D6FE0]">{c.businessName}</div>
                      <span className="text-[10px] font-bold text-slate-400">
                        {new Date(c.expiresAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="font-bold text-slate-900">{c.dealTitle}</div>
                    <div className="p-2.5 bg-white rounded-xl text-center font-mono font-bold border border-slate-200 text-slate-800">
                      Code: {c.code}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. Wishlist Modal */}
      {activeModal === 'wishlist' && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold font-sans text-slate-900">Wishlist & Saved Deals</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {savedDeals.length === 0 ? (
              <SpoteraEmptyState
                type="favorites"
                onPrimaryAction={() => {
                  setActiveModal(null);
                  setActiveView('explore');
                }}
                primaryActionLabel="Explore Top UAE Deals"
                onClaimCoupon={onClaimCoupon}
                onBookNow={onBookNow}
                showSuggestions={false}
                showTrendingDeals={false}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {savedDeals.map((deal) => (
                  <DealCard key={deal.id} deal={deal} onClaimCoupon={onClaimCoupon} onBookNow={onBookNow} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. Nationality Modal */}
      {activeModal === 'nationality' && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold font-sans text-slate-900">Select Nationality</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-bold">
              <input
                type="text"
                value={nationalityInput}
                onChange={(e) => setNationalityInput(e.target.value)}
                placeholder="Enter country name..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none"
              />

              <button
                onClick={() => {
                  setActiveModal(null);
                  showToast.success(t('toastSavedSuccess'));
                }}
                className="w-full py-2.5 bg-[#1D6FE0] text-white rounded-xl text-xs font-bold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Kids Ages Modal */}
      {activeModal === 'kidsAges' && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold font-sans text-slate-900">Manage Kids Profiles</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {childrenAges.map((child, idx) => (
                <div key={child.id} className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <span className="text-lg">👧</span>
                  <input
                    type="text"
                    placeholder="Child Name"
                    value={child.name || ''}
                    onChange={(e) => {
                      const updated = [...childrenAges];
                      updated[idx].name = e.target.value;
                      setChildrenAges(updated);
                    }}
                    className="bg-white text-xs font-bold border border-slate-200 rounded-xl p-2 flex-1 focus:outline-none"
                  />
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-slate-600">Age:</span>
                    <input
                      type="number"
                      min={0}
                      max={18}
                      value={child.age}
                      onChange={(e) => {
                        const updated = [...childrenAges];
                        updated[idx].age = parseInt(e.target.value) || 0;
                        setChildrenAges(updated);
                      }}
                      className="bg-white text-xs font-extrabold border border-slate-200 rounded-xl p-2 w-14 text-center focus:outline-none"
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => setChildrenAges([...childrenAges, { id: `ch_${Date.now()}`, age: 4, name: 'Child' }])}
                className="text-xs font-bold text-[#1D6FE0] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Child
              </button>

              <button
                onClick={() => {
                  setActiveModal(null);
                  showToast.success(t('toastSavedSuccess'));
                }}
                className="w-full py-2.5 bg-[#1D6FE0] text-white rounded-xl text-xs font-bold mt-2"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Cards Modal */}
      {activeModal === 'cards' && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl text-center">
            <CreditCard className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-extrabold font-sans text-slate-900">Saved Payment Cards</h3>
            <p className="text-xs text-slate-500 font-medium">No saved credit or debit cards on file. Spotera does not store payment card information directly.</p>
            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* 9. Language Modal */}
      {activeModal === 'language' && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold font-sans text-slate-900">{t('language')}</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs font-bold">
              {[
                { code: 'en', name: 'English', flag: '🇬🇧' },
                { code: 'ar', name: 'العربية (Arabic)', flag: '🇦🇪' },
                { code: 'ru', name: 'Русский (Russian)', flag: '🇷🇺' },
                { code: 'fr', name: 'Français (French)', flag: '🇫🇷' },
              ].map((item) => (
                <button
                  key={item.code}
                  onClick={() => {
                    setLanguage(item.code as any);
                    setLanguageInput(item.name);
                    setActiveModal(null);
                    showToast.success(t('toastLanguageChanged'));
                  }}
                  className={`w-full p-3 rounded-xl text-left flex items-center justify-between border transition-all ${
                    language === item.code ? 'bg-[#EAF2FF] border-[#1D6FE0] text-[#1D6FE0]' : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{item.flag}</span>
                    <span>{item.name}</span>
                  </div>
                  {language === item.code && <Check className="w-4 h-4 text-[#1D6FE0]" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 10. Our Story Modal */}
      {activeModal === 'ourStory' && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold font-sans text-slate-900">Our Story</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed font-medium">
              <p>
                <strong>SpoteraDeals</strong> was created in the United Arab Emirates to connect families and activity enthusiasts with authentic, 100% verified experiences at exclusive discounted rates.
              </p>
              <p>
                From waterparks in Dubai and desert safaris in Abu Dhabi to cozy family brunches and creative workshops, our mission is to make leisure and dining rewarding for everyone across all 7 Emirates.
              </p>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* 11. Terms & Conditions Modal */}
      {activeModal === 'terms' && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold font-sans text-slate-900">Terms & Conditions</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed font-medium">
              <h4 className="font-extrabold text-slate-900 text-sm">1. Voucher Redemption Terms</h4>
              <p>
                All digital coupons and vouchers generated through Spotera are subject to venue capacity and merchant rules. Vouchers must be presented at the venue entrance via smartphone screen or printed copy prior to service order.
              </p>

              <h4 className="font-extrabold text-slate-900 text-sm">2. Buy 1 Get 1 Free Offers</h4>
              <p>
                Buy 1 Get 1 Free (2-for-1) offers apply to the item of equal or lesser value. Unless explicitly stated, offers cannot be combined with existing merchant promotions, festive holidays, or private events.
              </p>

              <h4 className="font-extrabold text-slate-900 text-sm">3. Wallet Credits & Referral Rewards</h4>
              <p>
                Spotera Wallet credits are non-transferable for cash and are valid for 12 months from issuance. Referral rewards are credited once the referred user claims their first verified venue deal.
              </p>

              <h4 className="font-extrabold text-slate-900 text-sm">4. Cancellation & Refunds</h4>
              <p>
                Bookings made through third-party venue partners follow the individual venue's cancellation policy. If a venue cancels or closes unexpectedly, Spotera Support will refund full wallet credits.
              </p>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 bg-[#1D6FE0] text-white rounded-xl text-xs font-bold"
            >
              I Understand & Accept
            </button>
          </div>
        </div>
      )}

      {/* 12. Privacy Policy Modal */}
      {activeModal === 'privacy' && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold font-sans text-slate-900">Privacy Policy</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed font-medium">
              <p>
                SpoteraDeals values your family's privacy. We collect minimal personal information (such as name, email address, and general location) strictly to personalize deal recommendations and process voucher redemptions.
              </p>
              <p>
                We never sell or share your personal data with third-party advertisers. All location telemetry is kept client-side and encrypted.
              </p>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* 13. Support Modal */}
      {activeModal === 'support' && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold font-sans text-slate-900">Contact Spotera Support</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (supportMessage.trim()) {
                  sendSupportMessage(user.id || 'guest', user.name, user.email, 'customer', supportMessage, supportSubject);
                  setSupportFeedback('Message sent successfully! Our UAE support team will reach out shortly.');
                  setSupportSubject('');
                  setSupportMessage('');
                }
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-bold text-slate-700 block mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Booking inquiry, Voucher help..."
                  value={supportSubject}
                  onChange={(e) => setSupportSubject(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="How can we help you today?"
                  value={supportMessage}
                  onChange={(e) => setSupportMessage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium focus:outline-none"
                />
              </div>

              {supportFeedback && (
                <p className="text-emerald-700 font-bold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                  {supportFeedback}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-[#1FAE7B] hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 14. Coupon QR Code Pass Modal (Never trapped, Back & Close navigation) */}
      {selectedCouponQr && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Venue Digital Pass"
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedCouponQr(null);
          }}
        >
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 text-center space-y-4 shadow-2xl animate-scale-up border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <button
                type="button"
                onClick={() => setSelectedCouponQr(null)}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#0C5CAB] hover:text-[#094887] p-1 -ml-1 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-800">
                <QrCode className="w-4 h-4 text-[#0C5CAB]" />
                <span>Digital Pass</span>
              </div>
              <button
                onClick={() => setSelectedCouponQr(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Close pass"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                Active Pass • Ready to Redeem
              </span>
              <h4 className="font-black text-slate-900 text-base leading-tight pt-1">
                {selectedCouponQr.coupon.dealTitle}
              </h4>
              <p className="text-xs font-bold text-[#0C5CAB]">
                {selectedCouponQr.coupon.businessName}
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 inline-block shadow-2xs">
              <img
                src={selectedCouponQr.url}
                alt="QR Code Pass"
                className="w-48 h-48 mx-auto rounded-xl shadow-xs bg-white p-1"
              />
            </div>

            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="text-left">
                <div className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400">
                  Voucher / Pass Code
                </div>
                <div className="font-mono text-sm font-black text-slate-900 tracking-wider">
                  {selectedCouponQr.coupon.code}
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(selectedCouponQr.coupon.code);
                  showToast.success('Pass code copied to clipboard!');
                }}
                className="px-2.5 py-1.5 bg-white hover:bg-blue-50 text-[#0C5CAB] border border-blue-200 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </button>
            </div>

            <p className="text-[11px] font-bold text-slate-600">
              📲 Show this QR code to the cashier at the venue
            </p>

            <button
              type="button"
              onClick={() => setSelectedCouponQr(null)}
              className="w-full py-3 bg-[#0C5CAB] hover:bg-[#094887] text-white rounded-xl text-xs font-extrabold transition-colors cursor-pointer min-h-[44px]"
            >
              Done & Return to Passes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


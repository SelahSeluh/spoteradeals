import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Building2,
  Tag,
  Ticket,
  Users,
  BarChart3,
  Plus,
  CheckCircle2,
  XCircle,
  QrCode,
  Lock,
  Sparkles,
  TrendingUp,
  Trash2,
  Edit,
  DollarSign,
  Search,
  CalendarCheck,
  Check,
  Clock,
  Filter,
  Globe,
  Save,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  LayoutList,
  MapPin,
  Mail,
  Phone,
  Star,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { Business, Deal, City, Category, FooterConfig, FooterLink, HomepageConfig } from '../types';
import { defaultHomepageConfig } from '../context/AppContext';
import { VendorQrScanner } from '../components/VendorQrScanner';
import { AdminHeroManager } from '../components/admin/AdminHeroManager';
import { AdminHomepageSections } from '../components/admin/AdminHomepageSections';
import { AdminDealsManager } from '../components/admin/AdminDealsManager';
import { AdminCategoriesManager } from '../components/admin/AdminCategoriesManager';
import { AdminLocationsManager } from '../components/admin/AdminLocationsManager';
import { AdminMediaLibrary } from '../components/admin/AdminMediaLibrary';
import { AdminBrandingManager } from '../components/admin/AdminBrandingManager';
import { AdminBackupManager } from '../components/admin/AdminBackupManager';
import { AdminAuditLogsManager } from '../components/admin/AdminAuditLogsManager';
import { AdminRbacManager } from '../components/admin/AdminRbacManager';
import { Database, UserCog } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    businesses,
    deals,
    coupons,
    bookings,
    addBusiness,
    editBusiness,
    deleteBusiness,
    updateBusinessStatus,
    addDeal,
    editDeal,
    deleteDeal,
    reviews,
    deleteReview,
    redeemCoupon,
    redeemCode,
    isAdminAuthenticated,
    adminEmail: storedAdminEmail,
    hasAdminPasswordSet,
    adminLoginWithCreds,
    setupAdminAccount,
    changeAdminPassword,
    adminLogout,
    homepageConfig,
    updateHomepageConfig,
    footerConfig,
    updateFooterConfig,
    supportMessages,
    replyToSupportMessage,
    referralConfig,
    updateReferralConfig,
    sessionToken,
    adminSubRole = 'SUPER_ADMIN',
    t,
  } = useApp();
  const { showToast } = useToast();

  const [adminEmail, setAdminEmail] = useState(storedAdminEmail || '');
  const [adminPasscode, setAdminPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [isSetupMode, setIsSetupMode] = useState(!hasAdminPasswordSet);
  const [passError, setPassError] = useState<string | null>(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [settingsNotice, setSettingsNotice] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<
    | 'analytics'
    | 'bookings'
    | 'businesses'
    | 'deals'
    | 'coupons'
    | 'users'
    | 'hero'
    | 'sections'
    | 'categories'
    | 'locations'
    | 'media'
    | 'branding'
    | 'homepage'
    | 'reviews'
    | 'footer'
    | 'support'
    | 'referrals'
    | 'backups'
    | 'audit-logs'
    | 'rbac'
  >('bookings');
  const [replyInputMap, setReplyInputMap] = useState<Record<string, string>>({});

  // Homepage CMS State
  const [localHomepage, setLocalHomepage] = useState<HomepageConfig>(homepageConfig || defaultHomepageConfig);

  useEffect(() => {
    if (homepageConfig) {
      setLocalHomepage(homepageConfig);
    }
  }, [homepageConfig]);

  // Edit Business State
  const [editingBiz, setEditingBiz] = useState<Business | null>(null);

  // Edit Deal State
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);

  // Footer Management State
  const [localFooter, setLocalFooter] = useState<FooterConfig>(footerConfig);
  const [footerSaveNotice, setFooterSaveNotice] = useState<string | null>(null);

  // Sync local footer when footerConfig updates
  useEffect(() => {
    setLocalFooter(footerConfig);
  }, [footerConfig]);

  // New Custom Link Form State
  const [newLinkLabel, setNewLinkLabel] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkTargetView, setNewLinkTargetView] = useState('');
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingFilterStatus, setBookingFilterStatus] = useState<'all' | 'confirmed' | 'completed'>('all');

  // Scanner Simulator State
  const [scanInputCode, setScanInputCode] = useState('');
  const [scanResult, setScanResult] = useState<{ success: boolean; msg: string } | null>(null);

  // New Business Modal Form State
  const [showAddBizModal, setShowAddBizModal] = useState(false);
  const [newBizName, setNewBizName] = useState('');
  const [newBizCity, setNewBizCity] = useState<City>('Dubai');
  const [newBizCat, setNewBizCat] = useState<Category>('Kids Play Areas');
  const [newBizPhone, setNewBizPhone] = useState('+971 4 123 4567');
  const [newBizEmail, setNewBizEmail] = useState('info@vendor.ae');

  // New Deal Form State
  const [showAddDealModal, setShowAddDealModal] = useState(false);
  const [newDealTitle, setNewDealTitle] = useState('');
  const [newDealBizId, setNewDealBizId] = useState(businesses[0]?.id || '');
  const [newDealOrigPrice, setNewDealOrigPrice] = useState(200);
  const [newDealDiscPrice, setNewDealDiscPrice] = useState(120);
  const [newDealCat, setNewDealCat] = useState<Category>('Kids Play Areas');
  const [newDealCity, setNewDealCity] = useState<City>('Dubai');

  // Admin Auth Gate
  const handleAdminAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError(null);

    if (isSetupMode) {
      if (!adminPasscode.trim() || adminPasscode.length < 6) {
        setPassError('Password must be at least 6 characters long.');
        return;
      }
      if (adminPasscode !== confirmPasscode) {
        setPassError('Passwords do not match. Please retype carefully.');
        return;
      }
      setupAdminAccount(adminEmail, adminPasscode);
      setAdminPasscode('');
      setConfirmPasscode('');
      setIsSetupMode(false);
      return;
    }

    const res = adminLoginWithCreds(adminEmail, adminPasscode);
    if (res.success) {
      setAdminPasscode('');
    } else if (res.message === 'SETUP_REQUIRED') {
      setIsSetupMode(true);
      setPassError('No admin password set yet. Please initialize your admin account below.');
    } else {
      setPassError(res.message);
    }
  };

  const handleScanVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanInputCode.trim()) return;
    const res = redeemCoupon(scanInputCode);
    if (res) {
      setScanResult({ success: true, msg: `Coupon "${scanInputCode}" verified and redeemed successfully!` });
      showToast.success(`Coupon "${scanInputCode}" verified & redeemed!`);
    } else {
      setScanResult({ success: false, msg: `Invalid code or coupon already redeemed: "${scanInputCode}"` });
      showToast.error(`Invalid or already redeemed coupon code.`);
    }
    setScanInputCode('');
  };

  const handleCreateBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    addBusiness({
      name: newBizName,
      category: newBizCat,
      city: newBizCity,
      address: `Downtown ${newBizCity}, UAE`,
      coordinates: { lat: 25.2048, lng: 55.2708 },
      description: 'Verified family venue partner registered on SpoteraDeals platform.',
      images: ['https://images.unsplash.com/photo-1566454544259-f4b94c96a464?auto=format&fit=crop&q=80&w=800'],
      openingHours: 'Mon - Sun: 10:00 AM - 10:00 PM',
      phone: newBizPhone,
      email: newBizEmail,
      status: 'approved',
      verified: true,
      isFeatured: true,
    });
    setShowAddBizModal(false);
    setNewBizName('');
    showToast.success(`Business "${newBizName}" added and approved!`);
  };

  const handleCreateDeal = (e: React.FormEvent) => {
    e.preventDefault();
    const b = businesses.find((x) => x.id === newDealBizId) || businesses[0];
    const discountPct = Math.round(((newDealOrigPrice - newDealDiscPrice) / newDealOrigPrice) * 100);

    addDeal({
      businessId: b.id,
      businessName: b.name,
      title: newDealTitle,
      description: 'Exclusive family deal available for online claim and instant booking.',
      category: newDealCat,
      city: newDealCity,
      originalPrice: newDealOrigPrice,
      discountPrice: newDealDiscPrice,
      discountPercent: Math.max(5, discountPct),
      images: [b.images[0] || 'https://images.unsplash.com/photo-1566454544259-f4b94c96a464?auto=format&fit=crop&q=80&w=800'],
      terms: ['Present QR coupon at front desk reception', 'Subject to slot availability'],
      expiryDate: '2026-12-31',
      isFeatured: true,
      targetAgeGroup: '2 - 12 Years',
      openingHours: b.openingHours,
      packages: [{ id: `pkg_${Date.now()}`, name: 'Standard Ticket', price: newDealDiscPrice, description: 'Single entry', duration: '2 Hours' }],
    });
    setShowAddDealModal(false);
    setNewDealTitle('');
    showToast.success(`Deal "${newDealTitle}" published successfully!`);
  };

  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 bg-slate-50">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 text-amber-400 mx-auto flex items-center justify-center shadow-lg">
              <Lock className="w-8 h-8" />
            </div>
            <div className="inline-block px-3 py-1 rounded-full bg-slate-100 text-[10px] font-extrabold text-slate-700 tracking-wider uppercase border border-slate-200">
              Restricted Portal • spoteradeals.com
            </div>
            <h1 className="text-2xl font-black font-sans text-slate-900">
              {isSetupMode ? 'Create Master Admin Account' : 'Admin Control System'}
            </h1>
            <p className="text-xs text-slate-500">
              {isSetupMode
                ? 'First time setup: Set your private administrator password below. You will use this password to log in.'
                : 'Authorized SpoteraDeals administrators only. Log in with your email and password.'}
            </p>
          </div>

          <form onSubmit={handleAdminAuthSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Admin Email Address</label>
              <input
                type="email"
                required
                placeholder="admin@spoteradeals.com"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Note: This email is managed internally in your app system.
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {isSetupMode ? 'Set New Master Password' : 'Password'}
              </label>
              <input
                type="password"
                required
                placeholder={isSetupMode ? 'Create a secure password (min 6 chars)' : 'Enter your password'}
                value={adminPasscode}
                onChange={(e) => setAdminPasscode(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {isSetupMode && (
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  placeholder="Re-enter your password to confirm"
                  value={confirmPasscode}
                  onChange={(e) => setConfirmPasscode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {passError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-bold text-center leading-relaxed">
                {passError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-slate-900 hover:bg-black text-amber-300 font-black rounded-2xl text-xs shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>{isSetupMode ? 'Save Password & Authenticate Admin' : 'Authenticate Admin Session'}</span>
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsSetupMode(!isSetupMode);
                  setPassError(null);
                }}
                className="text-xs text-blue-600 font-bold hover:underline"
              >
                {isSetupMode ? 'Already set a password? Switch to Log In' : 'First time setup / Reset password? Click here'}
              </button>
            </div>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center text-[11px] text-slate-400">
            Protected by SSL 256-bit encryption • SpoteraDeals Management Engine
          </div>
        </div>
      </div>
    );
  }

  // Analytics Metrics
  const totalRevenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0) + coupons.length * 25;
  const totalRedemptions = coupons.filter((c) => c.status === 'redeemed').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2">
          <span className="text-amber-400 font-extrabold text-xs uppercase tracking-widest flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4" /> admin.SpoteraDeals.com • Admin System
          </span>
          <h1 className="text-3xl font-black font-sans">Marketplace Control Center</h1>
          <p className="text-xs text-slate-300">
            Manage businesses, approve deals, verify coupons, and analyze UAE family deal transactions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-400/30">
            2FA Active • Secure Node
          </span>
          <button
            onClick={() => {
              setShowSettingsModal(true);
              setSettingsNotice(null);
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl font-bold text-xs transition-all shadow-md flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Password Settings</span>
          </button>
          <button
            onClick={adminLogout}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 rounded-xl font-bold text-xs transition-all shadow-md"
          >
            Log Out Admin
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 no-scrollbar">
        {/* CMS & Content Section */}
        <button
          onClick={() => setActiveTab('hero')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'hero' ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" /> Hero & Skyline
        </button>

        <button
          onClick={() => setActiveTab('sections')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'sections' ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          <LayoutList className="w-4 h-4 text-blue-400" /> Homepage Sections
        </button>

        <button
          onClick={() => setActiveTab('deals')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'deals' ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Tag className="w-4 h-4 text-[#0D9CFD]" /> Deals & Passes ({deals.length})
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'categories' ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Filter className="w-4 h-4 text-indigo-400" /> Categories
        </button>

        <button
          onClick={() => setActiveTab('locations')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'locations' ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          <MapPin className="w-4 h-4 text-[#FD9302]" /> UAE Locations
        </button>

        <button
          onClick={() => setActiveTab('media')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'media' ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Globe className="w-4 h-4 text-emerald-400" /> Media Library
        </button>

        <button
          onClick={() => setActiveTab('branding')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'branding' ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4 text-amber-400" /> Site Branding
        </button>

        {/* Operations & Bookings */}
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'bookings' ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          <CalendarCheck className="w-4 h-4 text-emerald-400" /> Bookings ({bookings.length})
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'analytics' ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-cyan-400" /> Analytics
        </button>

        <button
          onClick={() => setActiveTab('businesses')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'businesses' ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4 text-blue-400" /> Businesses ({businesses.length})
        </button>

        <button
          onClick={() => setActiveTab('coupons')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'coupons' ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          <QrCode className="w-4 h-4 text-emerald-400" /> Scanner & Codes
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'users' ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4 text-indigo-400" /> Users
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'reviews' ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Star className="w-4 h-4 text-amber-400" /> Reviews ({reviews.length})
        </button>

        <button
          onClick={() => setActiveTab('footer')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'footer' ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Globe className="w-4 h-4 text-cyan-400" /> Footer
        </button>

        <button
          onClick={() => setActiveTab('support')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 relative cursor-pointer ${
            activeTab === 'support' ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Mail className="w-4 h-4 text-emerald-400" /> Support Desk ({supportMessages.length})
          {supportMessages.some((m) => m.status === 'pending') && (
            <span className="w-2 h-2 rounded-full bg-rose-500" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('referrals')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'referrals' ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" /> Referrals
        </button>

        <button
          onClick={() => setActiveTab('backups')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'backups' ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Database className="w-4 h-4 text-[#0D9CFD]" /> Backups & Recovery
        </button>

        <button
          onClick={() => setActiveTab('audit-logs')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'audit-logs' ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-emerald-400" /> Security & Audits
        </button>

        <button
          onClick={() => setActiveTab('rbac')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'rbac' ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          <UserCog className="w-4 h-4 text-purple-400" /> RBAC Permissions
        </button>
      </div>

      {/* TAB: Bookings & Redemptions Ledger */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          {/* Summary Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-1">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Bookings</div>
              <div className="text-2xl font-black text-slate-900">{bookings.length}</div>
              <div className="text-[10px] text-blue-600 font-bold">
                Value: AED {bookings.reduce((acc, b) => acc + b.totalPrice, 0)}
              </div>
            </div>

            <div className="bg-emerald-50 p-5 rounded-3xl border border-emerald-100 shadow-sm space-y-1">
              <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Redeemed / Completed</div>
              <div className="text-2xl font-black text-emerald-950">
                {bookings.filter((b) => b.status === 'completed').length}
              </div>
              <div className="text-[10px] text-emerald-700 font-bold">Scanned at partner venues</div>
            </div>

            <div className="bg-amber-50 p-5 rounded-3xl border border-amber-100 shadow-sm space-y-1">
              <div className="text-xs font-bold text-amber-800 uppercase tracking-wider">Pending Redemption</div>
              <div className="text-2xl font-black text-amber-950">
                {bookings.filter((b) => b.status === 'confirmed').length}
              </div>
              <div className="text-[10px] text-amber-700 font-bold">Awaiting QR scan on arrival</div>
            </div>
          </div>

          {/* Bookings Ledger Container */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-slate-900 font-sans">Customer Bookings & Redemption Tracker</h2>
                <p className="text-xs text-slate-500">
                  Real-time administration log of customer bookings, contact details, and venue redemptions.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('coupons')}
                className="px-4 py-2 bg-slate-900 hover:bg-black text-cyan-300 font-extrabold text-xs rounded-2xl flex items-center gap-1.5 shadow-md"
              >
                <QrCode className="w-4 h-4 text-cyan-400" /> Open QR Scanner Tool
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search customer name, email, phone, booking code, or venue..."
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl shrink-0">
                <button
                  onClick={() => setBookingFilterStatus('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    bookingFilterStatus === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All ({bookings.length})
                </button>
                <button
                  onClick={() => setBookingFilterStatus('confirmed')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    bookingFilterStatus === 'confirmed' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Pending ({bookings.filter((b) => b.status === 'confirmed').length})
                </button>
                <button
                  onClick={() => setBookingFilterStatus('completed')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    bookingFilterStatus === 'completed' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Redeemed ({bookings.filter((b) => b.status === 'completed').length})
                </button>
              </div>
            </div>

            {/* Roster Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="p-3">Ref Code</th>
                    <th className="p-3">Customer Info</th>
                    <th className="p-3">Venue & Activity</th>
                    <th className="p-3">Date & Time Slot</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Redemption Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings
                    .filter((b) => {
                      if (bookingFilterStatus !== 'all' && b.status !== bookingFilterStatus) return false;
                      if (bookingSearch.trim()) {
                        const q = bookingSearch.toLowerCase();
                        return (
                          b.userName.toLowerCase().includes(q) ||
                          b.userEmail.toLowerCase().includes(q) ||
                          b.userPhone.toLowerCase().includes(q) ||
                          b.bookingCode.toLowerCase().includes(q) ||
                          b.dealTitle.toLowerCase().includes(q) ||
                          b.businessName.toLowerCase().includes(q)
                        );
                      }
                      return true;
                    })
                    .map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50/80">
                        <td className="p-3 font-mono font-extrabold text-blue-600 whitespace-nowrap">
                          {b.bookingCode}
                        </td>
                        <td className="p-3 space-y-0.5">
                          <div className="font-extrabold text-slate-900">{b.userName}</div>
                          <div className="text-[10px] text-slate-500">{b.userEmail}</div>
                          <div className="text-[10px] text-slate-400">{b.userPhone}</div>
                        </td>
                        <td className="p-3 space-y-0.5">
                          <div className="font-bold text-slate-900 max-w-xs truncate">{b.dealTitle}</div>
                          <div className="text-[10px] text-blue-700 font-semibold">{b.businessName}</div>
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          <div className="font-bold text-slate-800">{b.date}</div>
                          <div className="text-[10px] text-slate-500">{b.timeSlot}</div>
                        </td>
                        <td className="p-3 whitespace-nowrap font-black text-slate-900">
                          AED {b.totalPrice}
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          <div className="space-y-1">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase inline-block ${
                                b.status === 'completed'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300/50'
                                  : b.status === 'cancelled'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-amber-100 text-amber-800 border border-amber-300/50'
                              }`}
                            >
                              {b.status === 'completed' ? 'Redeemed' : 'Pending Scan'}
                            </span>
                            {b.redeemedAt && (
                              <div className="text-[9px] text-emerald-700 font-bold">
                                On: {b.redeemedAt}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-3 text-right whitespace-nowrap">
                          {b.status === 'confirmed' ? (
                            <button
                              onClick={() => redeemCode(b.bookingCode, 'Admin Console')}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-[10px] shadow-sm transition-all"
                            >
                              Mark Redeemed
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-bold flex items-center justify-end gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Redeemed
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: Analytics Dashboard */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                <span>Total Marketplace Volume</span>
                <DollarSign className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">AED {totalRevenue}</div>
              <div className="text-[10px] text-emerald-600 font-extrabold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +24.5% vs last month
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                <span>Coupons Claimed</span>
                <Ticket className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">{coupons.length}</div>
              <div className="text-[10px] text-blue-600 font-bold">{totalRedemptions} Venue Redemptions</div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                <span>Activity Bookings</span>
                <Users className="w-5 h-5 text-amber-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">{bookings.length}</div>
              <div className="text-[10px] text-amber-700 font-bold">Confirmed Reservations</div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                <span>Partner Businesses</span>
                <Building2 className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">{businesses.length}</div>
              <div className="text-[10px] text-purple-600 font-bold">Across 7 UAE Cities</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: Business Management */}
      {activeTab === 'businesses' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 font-sans">UAE Business Partners</h2>
            <button
              onClick={() => setShowAddBizModal(true)}
              className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" /> Add Partner Business
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-3">Business Name</th>
                  <th className="p-3">City</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Contact</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {businesses.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80">
                    <td className="p-3 font-bold text-slate-900">{b.name}</td>
                    <td className="p-3">{b.city}</td>
                    <td className="p-3">{b.category}</td>
                    <td className="p-3">{b.phone}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          b.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {b.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => setEditingBiz(b)}
                        className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors cursor-pointer"
                        title="Edit Business"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to remove business "${b.name}"?`)) {
                            deleteBusiness(b.id);
                            showToast.success(`Business "${b.name}" removed.`);
                          }
                        }}
                        className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg transition-colors cursor-pointer"
                        title="Delete Business"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      {b.status === 'pending' && (
                        <button
                          onClick={() => updateBusinessStatus(b.id, 'approved', true)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px] cursor-pointer"
                        >
                          Approve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: Hero Slideshow Manager */}
      {activeTab === 'hero' && <AdminHeroManager />}

      {/* TAB: Homepage Sections Manager */}
      {activeTab === 'sections' && <AdminHomepageSections />}

      {/* TAB: Deal Management */}
      {activeTab === 'deals' && <AdminDealsManager />}

      {/* TAB: Categories Manager */}
      {activeTab === 'categories' && <AdminCategoriesManager />}

      {/* TAB: UAE Locations Manager */}
      {activeTab === 'locations' && <AdminLocationsManager />}

      {/* TAB: Media Library */}
      {activeTab === 'media' && <AdminMediaLibrary />}

      {/* TAB: Branding & Settings */}
      {activeTab === 'branding' && <AdminBrandingManager />}

      {/* TAB: Coupon Scanner Simulator */}
      {activeTab === 'coupons' && (
        <div className="space-y-8">
          <VendorQrScanner businessName="Admin Control Center" />

          {/* All Coupons List */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Issued Coupons Ledger ({coupons.length})</h3>
            <div className="space-y-3">
              {coupons.map((c) => (
                <div key={c.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                  <div className="space-y-1">
                    <div className="font-mono font-bold text-slate-900">{c.code}</div>
                    <div className="text-[11px] text-slate-500">{c.userName} • {c.businessName}</div>
                    {c.redeemedAt && (
                      <div className="text-[10px] text-emerald-700 font-bold">
                        Redeemed on {c.redeemedAt}
                      </div>
                    )}
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                      c.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {c.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Business Modal */}
      {showAddBizModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-3xl max-w-md w-full space-y-4 border border-slate-100 shadow-2xl">
            <h3 className="font-bold text-slate-900 text-base">Add New Partner Business</h3>
            <form onSubmit={handleCreateBusiness} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Business Name</label>
                <input
                  type="text"
                  required
                  value={newBizName}
                  onChange={(e) => setNewBizName(e.target.value)}
                  className="w-full bg-slate-50 border p-2.5 rounded-xl font-semibold"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">City</label>
                  <select
                    value={newBizCity}
                    onChange={(e) => setNewBizCity(e.target.value as any)}
                    className="w-full bg-slate-50 border p-2.5 rounded-xl font-semibold"
                  >
                    <option value="Dubai">Dubai</option>
                    <option value="Abu Dhabi">Abu Dhabi</option>
                    <option value="Sharjah">Sharjah</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1">Category</label>
                  <select
                    value={newBizCat}
                    onChange={(e) => setNewBizCat(e.target.value as any)}
                    className="w-full bg-slate-50 border p-2.5 rounded-xl font-semibold"
                  >
                    <option value="Kids Play Areas">Kids Play Areas</option>
                    <option value="Birthday Parties">Birthday Parties</option>
                    <option value="Summer Camps">Summer Camps</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Phone</label>
                  <input
                    type="text"
                    value={newBizPhone}
                    onChange={(e) => setNewBizPhone(e.target.value)}
                    className="w-full bg-slate-50 border p-2.5 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Email</label>
                  <input
                    type="email"
                    value={newBizEmail}
                    onChange={(e) => setNewBizEmail(e.target.value)}
                    className="w-full bg-slate-50 border p-2.5 rounded-xl"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddBizModal(false)}
                  className="py-2 px-4 bg-slate-100 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="py-2 px-4 bg-blue-600 text-white rounded-xl font-bold">
                  Save Business
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Deal Modal */}
      {showAddDealModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-3xl max-w-md w-full space-y-4 border border-slate-100 shadow-2xl">
            <h3 className="font-bold text-slate-900 text-base">Create New Marketplace Deal</h3>
            <form onSubmit={handleCreateDeal} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Select Partner Business</label>
                <select
                  value={newDealBizId}
                  onChange={(e) => setNewDealBizId(e.target.value)}
                  className="w-full bg-slate-50 border p-2.5 rounded-xl font-semibold"
                >
                  {businesses.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.city})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-bold block mb-1">Deal Title</label>
                <input
                  type="text"
                  required
                  value={newDealTitle}
                  onChange={(e) => setNewDealTitle(e.target.value)}
                  className="w-full bg-slate-50 border p-2.5 rounded-xl font-semibold"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Original Price (AED)</label>
                  <input
                    type="number"
                    value={newDealOrigPrice}
                    onChange={(e) => setNewDealOrigPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border p-2.5 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Discount Price (AED)</label>
                  <input
                    type="number"
                    value={newDealDiscPrice}
                    onChange={(e) => setNewDealDiscPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border p-2.5 rounded-xl"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddDealModal(false)}
                  className="py-2 px-4 bg-slate-100 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="py-2 px-4 bg-blue-600 text-white rounded-xl font-bold">
                  Publish Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB: Footer & Contact Info Management */}
      {activeTab === 'footer' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 text-cyan-800 text-[11px] font-bold border border-cyan-100 mb-2">
                <Globe className="w-3.5 h-3.5 text-cyan-600" />
                <span>Live Website Contact & Footer Control</span>
              </div>
              <h2 className="text-xl font-extrabold font-sans text-slate-900">Contact Information & Footer Settings</h2>
              <p className="text-xs text-slate-500">
                Update phone number, email, business location/address, and footer links. Changes instantly appear on the Contact page.
              </p>
            </div>

            <button
              onClick={() => {
                updateFooterConfig(localFooter);
                setFooterSaveNotice('Contact information and footer settings saved successfully!');
                setTimeout(() => setFooterSaveNotice(null), 4000);
              }}
              className="px-6 py-3 bg-[#1D6FE0] hover:bg-[#0B3D75] text-white font-extrabold rounded-2xl text-xs shadow-lg transition-all flex items-center gap-2 shrink-0"
            >
              <Save className="w-4 h-4 text-white" />
              <span>Save / Update Contact Details</span>
            </button>
          </div>

          {footerSaveNotice && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 font-bold text-xs flex items-center gap-2 shadow-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{footerSaveNotice}</span>
            </div>
          )}

          {/* DEDICATED CONTACT INFORMATION EDITING SECTION */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-black text-slate-900 text-base flex items-center gap-2 font-sans">
                  <Phone className="w-5 h-5 text-[#1D6FE0]" />
                  <span>Contact Information & Business Location</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  These details automatically populate the Contact Page, App Header, and Footer.
                </p>
              </div>

              <button
                onClick={() => {
                  updateFooterConfig(localFooter);
                  setFooterSaveNotice('Contact information updated successfully!');
                  setTimeout(() => setFooterSaveNotice(null), 4000);
                }}
                className="px-4 py-2 bg-[#1FAE7B] hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
              {/* Separate Editable Field: Phone Number */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <label className="font-extrabold text-slate-900 block flex items-center gap-2 text-xs">
                  <Phone className="w-4 h-4 text-[#1D6FE0]" />
                  <span>Phone Number</span>
                </label>
                <input
                  type="text"
                  placeholder="+971 4 000 0000"
                  value={localFooter.contactPhone}
                  onChange={(e) => setLocalFooter({ ...localFooter, contactPhone: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl p-3 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1D6FE0]"
                />
                <p className="text-[11px] text-slate-500">Official UAE contact number displayed for customer inquiries.</p>
              </div>

              {/* Separate Editable Field: Email Address */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <label className="font-extrabold text-slate-900 block flex items-center gap-2 text-xs">
                  <Mail className="w-4 h-4 text-[#1D6FE0]" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  placeholder="support@spoteradeals.com"
                  value={localFooter.contactEmail}
                  onChange={(e) => setLocalFooter({ ...localFooter, contactEmail: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl p-3 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1D6FE0]"
                />
                <p className="text-[11px] text-slate-500">Official support email for general support and vendor inquiries.</p>
              </div>

              {/* Separate Editable Field: Location / Address */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <label className="font-extrabold text-slate-900 block flex items-center gap-2 text-xs">
                  <MapPin className="w-4 h-4 text-[#1D6FE0]" />
                  <span>Business Location / Address</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Downtown Dubai, UAE"
                  value={localFooter.businessAddress}
                  onChange={(e) => setLocalFooter({ ...localFooter, businessAddress: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl p-3 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1D6FE0]"
                />
                <p className="text-[11px] text-slate-500">Physical office or hub location shown on the contact page.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Brand & Additional Info */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
                <Building2 className="w-4 h-4 text-[#1D6FE0]" /> Company Details & Copyright
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Company Display Name</label>
                  <input
                    type="text"
                    value={localFooter.companyName}
                    onChange={(e) => setLocalFooter({ ...localFooter, companyName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-semibold text-slate-900 focus:ring-2 focus:ring-[#1D6FE0]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Company Description</label>
                  <textarea
                    rows={3}
                    value={localFooter.description}
                    onChange={(e) => setLocalFooter({ ...localFooter, description: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-semibold text-slate-900 focus:ring-2 focus:ring-[#1D6FE0]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Copyright Line</label>
                  <input
                    type="text"
                    value={localFooter.copyrightText}
                    onChange={(e) => setLocalFooter({ ...localFooter, copyrightText: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Social Links & Section Toggles */}
            <div className="space-y-6">
              {/* Social Media Links */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Globe className="w-4 h-4 text-cyan-600" /> Social Media Links
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Instagram URL</label>
                    <input
                      type="text"
                      placeholder="https://instagram.com/..."
                      value={localFooter.socialLinks?.instagram || ''}
                      onChange={(e) =>
                        setLocalFooter({
                          ...localFooter,
                          socialLinks: { ...localFooter.socialLinks, instagram: e.target.value },
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Facebook URL</label>
                    <input
                      type="text"
                      placeholder="https://facebook.com/..."
                      value={localFooter.socialLinks?.facebook || ''}
                      onChange={(e) =>
                        setLocalFooter({
                          ...localFooter,
                          socialLinks: { ...localFooter.socialLinks, facebook: e.target.value },
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">LinkedIn URL</label>
                    <input
                      type="text"
                      placeholder="https://linkedin.com/..."
                      value={localFooter.socialLinks?.linkedin || ''}
                      onChange={(e) =>
                        setLocalFooter({
                          ...localFooter,
                          socialLinks: { ...localFooter.socialLinks, linkedin: e.target.value },
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Twitter/X URL</label>
                    <input
                      type="text"
                      placeholder="https://x.com/..."
                      value={localFooter.socialLinks?.twitter || ''}
                      onChange={(e) =>
                        setLocalFooter({
                          ...localFooter,
                          socialLinks: { ...localFooter.socialLinks, twitter: e.target.value },
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Section Visibility Toggles */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
                  <LayoutList className="w-4 h-4 text-indigo-600" /> Enable / Disable Footer Sections
                </h3>

                <div className="space-y-3 text-xs">
                  {[
                    { key: 'showCities', label: 'UAE Cities Column (Dubai, Abu Dhabi, etc.)' },
                    { key: 'showCategories', label: 'Top Categories Column' },
                    { key: 'showPartnerLegal', label: 'Partner & Custom Links Column' },
                    { key: 'showTrustBadges', label: 'Trust Badges (100% Verified Deals & Instant Redemptions)' },
                  ].map(({ key, label }) => {
                    const isChecked = localFooter.sections?.[key as keyof typeof localFooter.sections] !== false;
                    return (
                      <label key={key} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-all">
                        <span className="font-bold text-slate-800">{label}</span>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) =>
                            setLocalFooter({
                              ...localFooter,
                              sections: { ...localFooter.sections, [key]: e.target.checked },
                            })
                          }
                          className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Custom Footer Links Management */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cyan-600" /> Footer Navigation Links
                </h3>
                <p className="text-xs text-slate-500">
                  Add, reorder, or edit links shown in the Footer column.
                </p>
              </div>
            </div>

            {/* Links Table */}
            <div className="space-y-2">
              {localFooter.customLinks.map((link, idx) => (
                <div
                  key={link.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-2xl gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="font-bold text-slate-900">{link.label}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        URL: {link.url} {link.targetView ? `(Target View: ${link.targetView})` : ''}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {/* Move Up */}
                    <button
                      disabled={idx === 0}
                      onClick={() => {
                        const updated = [...localFooter.customLinks];
                        const temp = updated[idx];
                        updated[idx] = updated[idx - 1];
                        updated[idx - 1] = temp;
                        setLocalFooter({ ...localFooter, customLinks: updated });
                      }}
                      className="p-1.5 bg-white border rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>

                    {/* Move Down */}
                    <button
                      disabled={idx === localFooter.customLinks.length - 1}
                      onClick={() => {
                        const updated = [...localFooter.customLinks];
                        const temp = updated[idx];
                        updated[idx] = updated[idx + 1];
                        updated[idx + 1] = temp;
                        setLocalFooter({ ...localFooter, customLinks: updated });
                      }}
                      className="p-1.5 bg-white border rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>

                    {/* Toggle Enabled */}
                    <button
                      onClick={() => {
                        const updated = localFooter.customLinks.map((item, i) =>
                          i === idx ? { ...item, enabled: !item.enabled } : item
                        );
                        setLocalFooter({ ...localFooter, customLinks: updated });
                      }}
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1 ${
                        link.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {link.enabled ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{link.enabled ? 'Active' : 'Disabled'}</span>
                    </button>

                    {/* Delete Link */}
                    <button
                      onClick={() => {
                        const updated = localFooter.customLinks.filter((_, i) => i !== idx);
                        setLocalFooter({ ...localFooter, customLinks: updated });
                      }}
                      className="p-1.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-600 hover:bg-rose-100"
                      title="Delete Link"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Link Form */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Add New Footer Navigation Link</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Link Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Partner Support"
                    value={newLinkLabel}
                    onChange={(e) => setNewLinkLabel(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">URL or Hash Target</label>
                  <input
                    type="text"
                    placeholder="e.g. #contact or https://..."
                    value={newLinkUrl}
                    onChange={(e) => setNewLinkUrl(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Target View (Optional)</label>
                  <select
                    value={newLinkTargetView}
                    onChange={(e) => setNewLinkTargetView(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold"
                  >
                    <option value="">-- None (use URL) --</option>
                    <option value="about">About Page (#about)</option>
                    <option value="faq">FAQ Page (#faq)</option>
                    <option value="contact">Contact Support (#contact)</option>
                    <option value="privacy">Privacy Policy (#privacy)</option>
                    <option value="terms">Terms & Conditions (#terms)</option>
                    <option value="partners">Partner Portal (#partners)</option>
                  </select>
                </div>
              </div>

              <button
                disabled={!newLinkLabel.trim() || (!newLinkUrl.trim() && !newLinkTargetView)}
                onClick={() => {
                  const newLink: FooterLink = {
                    id: `link_${Date.now()}`,
                    label: newLinkLabel.trim(),
                    url: newLinkUrl.trim() || `#${newLinkTargetView}`,
                    targetView: newLinkTargetView || undefined,
                    enabled: true,
                  };
                  setLocalFooter({
                    ...localFooter,
                    customLinks: [...localFooter.customLinks, newLink],
                  });
                  setNewLinkLabel('');
                  setNewLinkUrl('');
                  setNewLinkTargetView('');
                }}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs shadow-md disabled:opacity-40 transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Footer Link</span>
              </button>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => {
                updateFooterConfig(localFooter);
                setFooterSaveNotice('Footer settings saved and published successfully!');
                setTimeout(() => setFooterSaveNotice(null), 4000);
              }}
              className="px-8 py-3.5 bg-slate-900 hover:bg-black text-amber-300 font-extrabold rounded-2xl text-xs shadow-xl transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4 text-emerald-400" />
              <span>Save & Publish All Footer Changes</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB: Support Messages & Desk */}
      {activeTab === 'support' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold font-sans text-slate-900">Customer & Partner Support Helpdesk</h2>
              <p className="text-xs text-slate-500">View inquiries from family customers and partner venues and reply directly.</p>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              {supportMessages.filter((m) => m.status === 'pending').length} Unanswered Messages
            </span>
          </div>

          <div className="space-y-4">
            {supportMessages.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No support messages yet.</p>
            ) : (
              supportMessages.map((msg) => (
                <div key={msg.id} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-900">{msg.userName}</span>
                        <span className="text-[10px] font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md uppercase">
                          {msg.userRole}
                        </span>
                        <span className="text-[10px] text-blue-600 font-bold bg-blue-100/80 px-2 py-0.5 rounded-md">
                          {msg.subject}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">{msg.userEmail}</p>
                    </div>

                    <div className="text-[10px] font-bold text-slate-400">
                      Sent on {msg.createdAt}
                    </div>
                  </div>

                  <p className="text-xs text-slate-800 font-medium leading-relaxed bg-white p-3 rounded-xl border border-slate-200/80">
                    "{msg.message}"
                  </p>

                  {msg.adminReply ? (
                    <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs space-y-1">
                      <span className="font-extrabold text-emerald-800 text-[10px] uppercase tracking-wider block">
                        Admin Reply Sent:
                      </span>
                      <p className="text-emerald-950 font-medium">{msg.adminReply}</p>
                    </div>
                  ) : (
                    <div className="space-y-2 pt-1">
                      <textarea
                        rows={2}
                        placeholder="Type your official reply to this user..."
                        value={replyInputMap[msg.id] || ''}
                        onChange={(e) => setReplyInputMap({ ...replyInputMap, [msg.id]: e.target.value })}
                        className="w-full text-xs font-medium bg-white border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />

                      <button
                        onClick={() => {
                          const replyText = replyInputMap[msg.id];
                          if (!replyText || !replyText.trim()) return;
                          replyToSupportMessage(msg.id, replyText);
                          setReplyInputMap({ ...replyInputMap, [msg.id]: '' });
                          showToast.success('Official reply sent to user.');
                        }}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
                      >
                        Send Official Reply
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB: Referral Settings */}
      {activeTab === 'referrals' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold font-sans text-slate-900">Family Referral Program Control</h2>
              <p className="text-xs text-slate-500">Configure viral referral incentives, reward AED amount, and anti-abuse limits.</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">Status:</span>
              <button
                onClick={() => {
                  const updated = !referralConfig.enabled;
                  updateReferralConfig({ ...referralConfig, enabled: updated });
                  showToast.success(`Referral program ${updated ? 'enabled' : 'disabled'}.`);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                  referralConfig.enabled ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {referralConfig.enabled ? 'Active / Enabled' : 'Disabled'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 block">Referral Voucher Reward (AED)</label>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">AED</span>
                <input
                  type="number"
                  min={5}
                  max={200}
                  value={referralConfig.rewardAED}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 20;
                    updateReferralConfig({ ...referralConfig, rewardAED: val });
                  }}
                  className="bg-white border border-slate-200 text-xs font-black text-slate-900 p-2.5 rounded-xl w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Both the inviting family and the invited friend receive this voucher credit.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 block">Anti-Abuse Safeguards</label>
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs font-medium text-slate-700 space-y-1">
                <p>✓ Duplicate email invitation block active</p>
                <p>✓ One voucher per family account rule active</p>
                <p>✓ Requires valid booking redemption before cashout</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: Homepage & Hero Visual CMS */}
      {activeTab === 'homepage' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#0C5CAB] text-[11px] font-extrabold uppercase tracking-wide mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Visual CMS Engine</span>
              </div>
              <h2 className="text-xl font-black text-slate-900 font-sans">Homepage & Hero Visual Control</h2>
              <p className="text-xs text-slate-500 font-medium">
                Customize titles, slogans, badges, announcement banners, and toggle AI features in real-time.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setLocalHomepage(defaultHomepageConfig);
                  updateHomepageConfig(defaultHomepageConfig);
                  showToast.info('Homepage settings reset to defaults.');
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Reset Defaults
              </button>
              <button
                onClick={() => {
                  updateHomepageConfig(localHomepage);
                  showToast.success('Homepage CMS published successfully!');
                }}
                className="px-5 py-2.5 bg-[#0C5CAB] hover:bg-[#094887] text-white rounded-xl text-xs font-black shadow-md flex items-center gap-2 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save & Publish</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Hero Controls */}
            <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#0C5CAB]" /> Primary Hero Banner
              </h3>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Hero Main Title (Prefix)</label>
                <input
                  type="text"
                  value={localHomepage.heroTitle}
                  onChange={(e) => setLocalHomepage({ ...localHomepage, heroTitle: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900"
                  placeholder="Discover UAE's Best Deals &"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Hero Highlight Word (Colored Gold)</label>
                <input
                  type="text"
                  value={localHomepage.heroHighlightText}
                  onChange={(e) => setLocalHomepage({ ...localHomepage, heroHighlightText: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-amber-600"
                  placeholder="Family Experiences"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Hero Badge Pill Text</label>
                <input
                  type="text"
                  value={localHomepage.heroBadgeText}
                  onChange={(e) => setLocalHomepage({ ...localHomepage, heroBadgeText: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800"
                  placeholder="SpoteraDeals • Verified Deals & Instant Digital Passes"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Hero Subtitle</label>
                <textarea
                  rows={2}
                  value={localHomepage.heroSubtitle}
                  onChange={(e) => setLocalHomepage({ ...localHomepage, heroSubtitle: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-medium"
                  placeholder="Save on indoor play areas, waterparks..."
                />
              </div>
            </div>

            {/* Right Column: AI Feature & Banner Toggles */}
            <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" /> Feature Widgets & VIP Banner
              </h3>

              <div className="p-4 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-slate-900">AI Daily Family Spotlight</div>
                  <div className="text-[11px] text-slate-500">
                    Displays Gemini-curated daily family deals, savings math & local tips
                  </div>
                </div>
                <button
                  onClick={() =>
                    setLocalHomepage({
                      ...localHomepage,
                      showDailySpotlight: !localHomepage.showDailySpotlight,
                    })
                  }
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                    localHomepage.showDailySpotlight !== false
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {localHomepage.showDailySpotlight !== false ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-slate-900">VIP Pass Free Trial Banner</div>
                  <div className="text-[11px] text-slate-500">
                    Displays the 14-day VIP pass promotion banner on the homepage
                  </div>
                </div>
                <button
                  onClick={() =>
                    setLocalHomepage({
                      ...localHomepage,
                      showTrialBanner: !localHomepage.showTrialBanner,
                    })
                  }
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                    localHomepage.showTrialBanner !== false
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {localHomepage.showTrialBanner !== false ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Section Title: Featured Deals</label>
                <input
                  type="text"
                  value={localHomepage.featuredSectionTitle || 'Trending & Exclusive Offers'}
                  onChange={(e) =>
                    setLocalHomepage({ ...localHomepage, featuredSectionTitle: e.target.value })
                  }
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Section Title: Kids Play Areas</label>
                <input
                  type="text"
                  value={localHomepage.playAreaSectionTitle || 'Kids Play Areas & Soft Play Zones'}
                  onChange={(e) =>
                    setLocalHomepage({ ...localHomepage, playAreaSectionTitle: e.target.value })
                  }
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: Review Moderation */}
      {activeTab === 'reviews' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-sans">User Reviews Moderation</h2>
              <p className="text-xs text-slate-500">
                Audit verified customer ratings, reviews, and delete inappropriate content.
              </p>
            </div>
            <div className="text-xs font-extrabold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl">
              {reviews.length} Total Reviews
            </div>
          </div>

          <div className="space-y-3">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <img
                      src={rev.userAvatar}
                      alt={rev.userName}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <span className="font-bold text-slate-900">{rev.userName}</span>
                    <span className="text-amber-500 font-bold flex items-center gap-0.5 ml-2">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {rev.rating} Stars
                    </span>
                    <span className="text-slate-400 text-[11px]">({rev.date})</span>
                  </div>
                  <p className="text-slate-700 italic">"{rev.comment}"</p>
                  <div className="text-[10px] text-slate-400 font-mono">Deal ID: {rev.dealId}</div>
                </div>

                <button
                  onClick={() => {
                    if (window.confirm('Delete this review?')) {
                      deleteReview(rev.id);
                      showToast.success('Review deleted.');
                    }
                  }}
                  className="self-end sm:self-center px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Business Modal */}
      {editingBiz && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 border border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900">Edit Business Partner</h3>
              <button
                onClick={() => setEditingBiz(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Business Name</label>
                <input
                  type="text"
                  value={editingBiz.name}
                  onChange={(e) => setEditingBiz({ ...editingBiz, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">City</label>
                  <select
                    value={editingBiz.city}
                    onChange={(e) => setEditingBiz({ ...editingBiz, city: e.target.value as City })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold"
                  >
                    {['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={editingBiz.category}
                    onChange={(e) => setEditingBiz({ ...editingBiz, category: e.target.value as Category })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold"
                  >
                    {['Kids Play Areas', 'Birthday Parties', 'Summer Camps', 'Workshops', 'Restaurants', 'Attractions', 'Hotels', 'Entertainment', 'Family Experiences'].map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={editingBiz.phone}
                  onChange={(e) => setEditingBiz({ ...editingBiz, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Email</label>
                <input
                  type="email"
                  value={editingBiz.email}
                  onChange={(e) => setEditingBiz({ ...editingBiz, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Physical Address</label>
                <input
                  type="text"
                  value={editingBiz.address}
                  onChange={(e) => setEditingBiz({ ...editingBiz, address: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  onClick={() => setEditingBiz(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    editBusiness(editingBiz);
                    showToast.success(`Business "${editingBiz.name}" updated!`);
                    setEditingBiz(null);
                  }}
                  className="px-5 py-2 bg-[#0C5CAB] hover:bg-[#094887] text-white font-extrabold rounded-xl shadow-md cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Deal Modal */}
      {editingDeal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 border border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900">Edit Deal</h3>
              <button
                onClick={() => setEditingDeal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Deal Title</label>
                <input
                  type="text"
                  value={editingDeal.title}
                  onChange={(e) => setEditingDeal({ ...editingDeal, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Original Price (AED)</label>
                  <input
                    type="number"
                    value={editingDeal.originalPrice}
                    onChange={(e) => {
                      const orig = Number(e.target.value);
                      const disc = editingDeal.discountPrice;
                      const pct = Math.round(((orig - disc) / orig) * 100);
                      setEditingDeal({ ...editingDeal, originalPrice: orig, discountPercent: Math.max(5, pct) });
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Discount Price (AED)</label>
                  <input
                    type="number"
                    value={editingDeal.discountPrice}
                    onChange={(e) => {
                      const disc = Number(e.target.value);
                      const orig = editingDeal.originalPrice;
                      const pct = Math.round(((orig - disc) / orig) * 100);
                      setEditingDeal({ ...editingDeal, discountPrice: disc, discountPercent: Math.max(5, pct) });
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-[#0C5CAB]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingDeal.description}
                  onChange={(e) => setEditingDeal({ ...editingDeal, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  onClick={() => setEditingDeal(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    editDeal(editingDeal);
                    showToast.success(`Deal "${editingDeal.title}" updated!`);
                    setEditingDeal(null);
                  }}
                  className="px-5 py-2 bg-[#0C5CAB] hover:bg-[#094887] text-white font-extrabold rounded-xl shadow-md cursor-pointer"
                >
                  Save Deal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: Backups & Rollback System */}
      {activeTab === 'backups' && (
        <AdminBackupManager
          sessionToken={sessionToken}
          adminEmail={adminEmail}
          adminSubRole={adminSubRole}
        />
      )}

      {/* TAB: Security Audit Logs */}
      {activeTab === 'audit-logs' && (
        <AdminAuditLogsManager
          sessionToken={sessionToken}
          adminSubRole={adminSubRole}
        />
      )}

      {/* TAB: RBAC Team Management */}
      {activeTab === 'rbac' && (
        <AdminRbacManager
          sessionToken={sessionToken}
          currentAdminEmail={adminEmail}
          currentAdminSubRole={adminSubRole}
        />
      )}

      {/* Admin Password Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-5 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-slate-900 text-amber-400 rounded-xl flex items-center justify-center font-bold">
                  <Lock className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-base font-sans text-slate-900">Admin Password Settings</h3>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Master Admin Email</label>
                <input
                  type="text"
                  readOnly
                  value={storedAdminEmail}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl p-3 font-semibold text-slate-600 cursor-not-allowed"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Managed internally inside SpoteraDeals application system.
                </span>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Set New Master Password</label>
                <input
                  type="password"
                  placeholder="Enter new master password (min 6 chars)"
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {settingsNotice && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-bold text-center">
                  {settingsNotice}
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    if (!newPasswordInput.trim() || newPasswordInput.length < 6) {
                      setSettingsNotice('Password must be at least 6 characters long.');
                      showToast.warning('Password must be at least 6 characters long.');
                      return;
                    }
                    changeAdminPassword(newPasswordInput);
                    setSettingsNotice('Master Admin password updated successfully!');
                    showToast.success('Master Admin password updated successfully!');
                    setNewPasswordInput('');
                  }}
                  className="px-5 py-2 bg-slate-900 hover:bg-black text-amber-300 font-extrabold rounded-xl shadow-md transition-all"
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

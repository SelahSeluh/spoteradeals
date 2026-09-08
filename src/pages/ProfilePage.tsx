import React, { useState } from 'react';
import {
  Calendar,
  Heart,
  Gift,
  MapPin,
  CreditCard,
  HelpCircle,
  Globe,
  ChevronRight,
  Pencil,
  Shield,
  ArrowRight,
  LogOut,
  X,
  Check,
  Phone,
  Mail,
  MessageCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { Language } from '../types';

export const ProfilePage: React.FC = () => {
  const {
    user,
    setUser,
    bookings,
    setActiveView,
    logout,
    language,
    setLanguage,
    isAdminAuthenticated,
    isLoggedIn,
    requireUserAuth,
  } = useApp();
  const { showToast } = useToast();

  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState(user.name || '');
  const [editEmail, setEditEmail] = useState(user.email || '');
  const [editPhone, setEditPhone] = useState(user.phone || '');
  const [editAddress, setEditAddress] = useState(user.address || 'Dubai Marina, Dubai, UAE');

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'EN' },
    { code: 'ar', label: 'AR' },
    { code: 'fr', label: 'FR' },
    { code: 'ru', label: 'RU' },
    { code: 'zh', label: 'ZH' },
  ];

  const handleLanguageCycle = () => {
    const codes = languages.map((l) => l.code);
    const currentIndex = codes.indexOf(language);
    const nextCode = codes[(currentIndex + 1) % codes.length];
    setLanguage(nextCode);
    showToast(`Language switched to ${nextCode.toUpperCase()}`, 'info');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUser((prev) => ({
      ...prev,
      name: editName.trim() || prev.name,
      email: editEmail.trim() || prev.email,
      phone: editPhone.trim() || prev.phone,
      address: editAddress.trim() || prev.address,
    }));
    setShowEditModal(false);
    showToast('Profile updated successfully', 'success');
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    setUser((prev) => ({
      ...prev,
      address: editAddress.trim() || prev.address,
    }));
    setShowAddressModal(false);
    showToast('Address saved locally on this device', 'success');
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
      showToast('Logged out of SpoteraDeals', 'info');
    }
  };

  const isAdmin =
    user.role === 'admin' ||
    isAdminAuthenticated ||
    user.email?.toLowerCase().includes('admin');

  const points = user.rewardsPoints ?? 120;
  const savedCount = user.savedDealIds ? user.savedDealIds.length : 0;
  const currentLangLabel =
    languages.find((l) => l.code === language)?.label || 'EN';

  const avatarUrl =
    user.avatar ||
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80';

  return (
    <div className="min-h-screen bg-[#F0F5FB] pb-28 pt-4 px-4 sm:px-6">
      <div className="max-w-xl mx-auto flex flex-col gap-3.5">
        {/* Page Header */}
        <div className="flex items-center justify-between min-h-[46px]">
          <h1 className="text-xl font-bold text-[#0D1B3E] tracking-tight">Profile</h1>
          <div className="w-10" />
        </div>

        {/* Profile Card (Royal Blue) */}
        <div className="rounded-[18px] bg-[#1A4FBF] p-4 text-white shadow-[0_8px_20px_rgba(26,79,191,0.22)] flex items-center justify-between">
          <div className="flex items-center gap-3.5 min-w-0">
            <img
              src={avatarUrl}
              alt={user.name || 'User profile'}
              className="w-[62px] h-[62px] rounded-[22px] object-cover border-[3px] border-[#86A9FF] shrink-0"
              loading="lazy"
            />
            <div className="flex flex-col gap-0.5 min-w-0">
              <h2 className="text-lg font-bold text-white truncate leading-tight">
                {user.name || 'Mariam Al Hashemi'}
              </h2>
              <p className="text-[11px] text-[#C9D8FF] truncate">
                {user.email || 'mariam.family@spoteradeals.ae'}
              </p>
              <div className="inline-flex items-center gap-1.5 self-start mt-1 px-2.5 py-1 rounded-full bg-white text-[#F5820A] shadow-xs">
                <Gift className="w-3.5 h-3.5 text-[#F5820A]" />
                <span className="text-[10px] font-bold text-[#F5820A]">{points} points</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setEditName(user.name || '');
              setEditEmail(user.email || '');
              setEditPhone(user.phone || '');
              setShowEditModal(true);
            }}
            aria-label="Edit profile"
            className="w-[38px] h-[38px] rounded-full bg-white text-[#1A4FBF] flex items-center justify-center shrink-0 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer ml-2"
          >
            <Pencil className="w-4 h-4" />
          </button>
        </div>

        {/* Section Title */}
        <h2 className="text-base font-bold text-[#0D1B3E] mt-1.5 px-0.5">Your Spotera</h2>

        {/* Menu Card */}
        <div className="bg-white rounded-[18px] border border-[#E7EBF2] shadow-xs divide-y divide-[#F0F5FB] overflow-hidden">
          {/* My Bookings */}
          <button
            onClick={() => setActiveView('bookings')}
            className="w-full min-h-[57px] px-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#EBF2FF] text-[#1A4FBF] flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold text-[#0D1B3E]">My Bookings</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#8D98AA]" />
          </button>

          {/* Favorites */}
          <button
            onClick={() => setActiveView('wishlist')}
            className="w-full min-h-[57px] px-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#EBF2FF] text-[#1A4FBF] flex items-center justify-center">
                <Heart className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold text-[#0D1B3E]">Favorites</span>
            </div>
            <div className="flex items-center gap-2">
              {savedCount > 0 && (
                <span className="text-xs font-bold text-[#5F6B82]">{savedCount}</span>
              )}
              <ChevronRight className="w-4 h-4 text-[#8D98AA]" />
            </div>
          </button>

          {/* Rewards */}
          <button
            onClick={() => setActiveView('rewards')}
            className="w-full min-h-[57px] px-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#EBF2FF] text-[#1A4FBF] flex items-center justify-center">
                <Gift className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold text-[#0D1B3E]">Rewards</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-[#FFF4EB] text-[#F5820A] text-[11px] font-bold">
                {points} pts
              </span>
              <ChevronRight className="w-4 h-4 text-[#8D98AA]" />
            </div>
          </button>

          {/* Address */}
          <button
            onClick={() => setShowAddressModal(true)}
            className="w-full min-h-[57px] px-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#EBF2FF] text-[#1A4FBF] flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold text-[#0D1B3E]">Address</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#8D98AA]" />
          </button>

          {/* Payment Methods */}
          <button
            onClick={() => setShowPaymentModal(true)}
            className="w-full min-h-[57px] px-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#EBF2FF] text-[#1A4FBF] flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold text-[#0D1B3E]">Payment Methods</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#8D98AA]" />
          </button>

          {/* Help & Support */}
          <button
            onClick={() => setShowHelpModal(true)}
            className="w-full min-h-[57px] px-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#EBF2FF] text-[#1A4FBF] flex items-center justify-center">
                <HelpCircle className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold text-[#0D1B3E]">Help & Support</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#8D98AA]" />
          </button>

          {/* Language */}
          <button
            onClick={handleLanguageCycle}
            className="w-full min-h-[57px] px-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#EBF2FF] text-[#1A4FBF] flex items-center justify-center">
                <Globe className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold text-[#0D1B3E]">Language</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#1A4FBF] bg-[#EBF2FF] px-2 py-0.5 rounded-full">
                {currentLangLabel}
              </span>
              <ChevronRight className="w-4 h-4 text-[#8D98AA]" />
            </div>
          </button>
        </div>

        {/* Admin Workspace Card (Shown if admin) */}
        {isAdmin && (
          <button
            onClick={() => setActiveView('admin')}
            className="w-full rounded-[18px] bg-white border border-[#E7EBF2] p-4 shadow-xs flex items-center justify-between hover:border-[#1A4FBF] transition-all cursor-pointer text-left"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#1A4FBF] text-white flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0D1B3E]">Admin workspace</h3>
                <p className="text-xs text-[#5F6B82] mt-0.5">
                  Manage deals, businesses & verify redemptions
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#1A4FBF]" />
          </button>
        )}

        {/* Stats Row */}
        <div className="bg-white rounded-[18px] border border-[#E7EBF2] p-4 shadow-xs flex items-center justify-around text-center">
          <button
            onClick={() => setActiveView('bookings')}
            className="flex-1 flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity"
          >
            <span className="text-base font-extrabold text-[#0D1B3E]">{bookings.length}</span>
            <span className="text-[11px] font-semibold text-[#5F6B82]">Bookings</span>
          </button>
          <div className="w-px h-7 bg-[#E7EBF2]" />
          <button
            onClick={() => setActiveView('rewards')}
            className="flex-1 flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity"
          >
            <span className="text-base font-extrabold text-[#0D1B3E]">{points}</span>
            <span className="text-[11px] font-semibold text-[#5F6B82]">Points</span>
          </button>
          <div className="w-px h-7 bg-[#E7EBF2]" />
          <button
            onClick={() => setActiveView('wishlist')}
            className="flex-1 flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity"
          >
            <span className="text-base font-extrabold text-[#0D1B3E]">{savedCount}</span>
            <span className="text-[11px] font-semibold text-[#5F6B82]">Saved</span>
          </button>
        </div>

        {/* Log Out Button */}
        <button
          onClick={handleLogout}
          className="w-full min-h-[50px] rounded-[18px] bg-white border border-[#E7EBF2] flex items-center justify-center gap-2 text-sm font-bold text-[#EF4444] hover:bg-red-50/50 transition-colors shadow-xs cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-[#EF4444]" />
          <span>Log Out</span>
        </button>

        {/* Footer Tagline */}
        <p className="text-center text-xs font-semibold text-[#8D98AA] mt-2 mb-4">
          SpoteraDeals · More Fun. More Together.
        </p>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[22px] max-w-sm w-full p-5 shadow-xl border border-[#E7EBF2] flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#0D1B3E]">Edit Profile</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1 rounded-full text-[#8D98AA] hover:text-[#0D1B3E] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="flex flex-col gap-3">
              <div>
                <label className="text-[11px] font-bold text-[#5F6B82] uppercase tracking-wider block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full h-10 px-3 rounded-[12px] bg-[#F5F7FA] border border-[#E7EBF2] text-xs font-semibold text-[#0D1B3E] focus:outline-none focus:border-[#1A4FBF]"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#5F6B82] uppercase tracking-wider block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full h-10 px-3 rounded-[12px] bg-[#F5F7FA] border border-[#E7EBF2] text-xs font-semibold text-[#0D1B3E] focus:outline-none focus:border-[#1A4FBF]"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#5F6B82] uppercase tracking-wider block mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="+971 50 123 4567"
                  className="w-full h-10 px-3 rounded-[12px] bg-[#F5F7FA] border border-[#E7EBF2] text-xs font-semibold text-[#0D1B3E] focus:outline-none focus:border-[#1A4FBF]"
                />
              </div>

              <div className="flex gap-2.5 mt-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 h-10 rounded-full border border-[#E7EBF2] text-xs font-bold text-[#5F6B82] hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-10 rounded-full bg-[#1A4FBF] text-xs font-bold text-white hover:bg-[#153FA0] cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Saved Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[22px] max-w-sm w-full p-5 shadow-xl border border-[#E7EBF2] flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#1A4FBF]" />
                <h3 className="text-base font-bold text-[#0D1B3E]">Saved Address</h3>
              </div>
              <button
                onClick={() => setShowAddressModal(false)}
                className="p-1 rounded-full text-[#8D98AA] hover:text-[#0D1B3E] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#5F6B82] leading-relaxed">
              Your saved address is stored locally on this device for convenient proximity sorting and deal discovery.
            </p>

            <form onSubmit={handleSaveAddress} className="flex flex-col gap-3">
              <div>
                <label className="text-[11px] font-bold text-[#5F6B82] uppercase tracking-wider block mb-1">
                  Primary UAE Address
                </label>
                <textarea
                  rows={3}
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  placeholder="Apartment, Street, Area, Emirate, UAE"
                  className="w-full p-3 rounded-[12px] bg-[#F5F7FA] border border-[#E7EBF2] text-xs font-semibold text-[#0D1B3E] focus:outline-none focus:border-[#1A4FBF] resize-none"
                />
              </div>

              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="flex-1 h-10 rounded-full border border-[#E7EBF2] text-xs font-bold text-[#5F6B82] hover:bg-slate-50 cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="flex-1 h-10 rounded-full bg-[#1A4FBF] text-xs font-bold text-white hover:bg-[#153FA0] cursor-pointer"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Methods Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[22px] max-w-sm w-full p-5 shadow-xl border border-[#E7EBF2] flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#1A4FBF]" />
                <h3 className="text-base font-bold text-[#0D1B3E]">Payment Methods</h3>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="p-1 rounded-full text-[#8D98AA] hover:text-[#0D1B3E] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#5F6B82] leading-relaxed">
              Payment is UI-only for the SpoteraDeals MVP. Your booking total is shown before confirmation, and instant passes can be verified at partner ticket counters.
            </p>

            <div className="flex flex-col gap-2.5">
              <div className="p-3 rounded-[14px] bg-[#F5F7FA] border border-[#E7EBF2] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center text-[10px] font-bold">
                    Pay
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0D1B3E]">Apple Pay & Cards</h4>
                    <p className="text-[10px] text-[#5F6B82]">Ready for fast checkout</p>
                  </div>
                </div>
                <Check className="w-4 h-4 text-[#10B981]" />
              </div>

              <div className="p-3 rounded-[14px] bg-[#F5F7FA] border border-[#E7EBF2] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#1A4FBF] text-white flex items-center justify-center text-[10px] font-bold">
                    Pass
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0D1B3E]">Pay at Partner Venue</h4>
                    <p className="text-[10px] text-[#5F6B82]">Show Spotera QR code</p>
                  </div>
                </div>
                <Check className="w-4 h-4 text-[#10B981]" />
              </div>
            </div>

            <button
              onClick={() => setShowPaymentModal(false)}
              className="w-full h-10 rounded-full bg-[#1A4FBF] text-xs font-bold text-white hover:bg-[#153FA0] cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Help & Support Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[22px] max-w-sm w-full p-5 shadow-xl border border-[#E7EBF2] flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#1A4FBF]" />
                <h3 className="text-base font-bold text-[#0D1B3E]">Help & Support</h3>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="p-1 rounded-full text-[#8D98AA] hover:text-[#0D1B3E] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#5F6B82] leading-relaxed">
              For assistance with your bookings or passes, have your booking reference ready and contact our customer care team or the partner venue shown on your ticket.
            </p>

            <div className="flex flex-col gap-2.5">
              <a
                href="https://wa.me/971503048978"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-[14px] bg-[#E8F8F5] border border-[#C5EFE8] flex items-center justify-between text-[#00B5A5] hover:bg-[#DCF5F0] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <MessageCircle className="w-5 h-5 text-[#25D366]" />
                  <div>
                    <h4 className="text-xs font-bold text-[#0D1B3E]">WhatsApp Support</h4>
                    <p className="text-[10px] text-[#5F6B82]">Instant chat with our UAE team</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#8D98AA]" />
              </a>

              <a
                href="tel:+971503048978"
                className="p-3 rounded-[14px] bg-[#F5F7FA] border border-[#E7EBF2] flex items-center justify-between hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Phone className="w-5 h-5 text-[#1A4FBF]" />
                  <div>
                    <h4 className="text-xs font-bold text-[#0D1B3E]">Call +971 50 304 8978</h4>
                    <p className="text-[10px] text-[#5F6B82]">Sunday – Friday 9am to 7pm</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#8D98AA]" />
              </a>
            </div>

            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full h-10 rounded-full bg-[#1A4FBF] text-xs font-bold text-white hover:bg-[#153FA0] cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

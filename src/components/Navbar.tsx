import React, { useState, useRef, useEffect } from 'react';
import {
  MapPin,
  Search,
  User,
  Heart,
  Bell,
  ChevronDown,
  Sparkles,
  Ticket,
  LogOut,
  LogIn,
  Globe,
  Check,
  X,
  Menu,
  Building2,
  HelpCircle,
  Compass,
  Crown,
  Calendar,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SpoteraLogo } from './SpoteraLogo';
import { City, Language } from '../types';

export const Navbar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    user,
    selectedCity,
    setSelectedCity,
    language,
    setLanguage,
    searchQuery,
    setSearchQuery,
    isLoggedIn,
    logout,
    t,
  } = useApp();

  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cityRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  const uaeEmirates: (City | 'all')[] = [
    'all',
    'Dubai',
    'Abu Dhabi',
    'Sharjah',
    'Ajman',
    'Ras Al Khaimah',
    'Fujairah',
    'Umm Al Quwain',
  ];

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'ar', label: 'العربية' },
    { code: 'zh', label: '中文' },
    { code: 'ru', label: 'Русский' },
    { code: 'fr', label: 'Français' },
    { code: 'am', label: 'አማርኛ' },
  ];

  const cleanNavDisplayName = React.useMemo(() => {
    const raw = (user.name || '').trim();
    if (!raw || ['google user', 'google', 'g', 'guest user'].includes(raw.toLowerCase())) {
      if (user.email) {
        const handle = user.email.split('@')[0].replace(/[._-]/g, ' ');
        return handle ? handle.charAt(0).toUpperCase() + handle.slice(1) : 'Member';
      }
      return 'Profile';
    }
    return raw;
  }, [user.name, user.email]);

  const navInitial = React.useMemo(() => {
    if (cleanNavDisplayName && cleanNavDisplayName !== 'Profile') {
      return cleanNavDisplayName.charAt(0).toUpperCase();
    }
    return 'U';
  }, [cleanNavDisplayName]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) {
        setCityDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const savedCount = user?.savedDealIds ? user.savedDealIds.length : 0;
  const currentLangObj = languages.find((l) => l.code === language) || languages[0];

  const navLinks = [
    { id: 'home', label: t('navHome') || 'Home' },
    { id: 'explore', label: t('navDeals') || 'Deals' },
    { id: 'family', label: t('familyExperiences') || 'Family Passes' },
    { id: 'categories', label: t('navCategories') || 'Categories' },
    { id: 'membership', label: t('navMembership') || 'VIP Pass' },
    { id: 'partners', label: t('navPartners') || 'For Partners' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-2xs font-sans select-none">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-6">
          
          {/* MOBILE: Left Hamburger Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-1 text-slate-700 hover:text-[#0D9CFD] rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* 1. BRAND LOGO */}
          <div className="flex items-center gap-2 shrink-0">
            <SpoteraLogo
              size="md"
              variant="light"
              showTagline={false}
              showUaeBadge={true}
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setActiveView('home');
              }}
            />
          </div>

          {/* 2. CENTER DESKTOP NAVIGATION LINKS */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = activeView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setActiveView(link.id as any);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs lg:text-sm font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                    isActive
                      ? 'text-[#0D9CFD] bg-blue-50/80 font-extrabold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* 3. RIGHT CONTROLS: VIP Pass CTA + Location Pill + User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* VIP Pass CTA Button */}
            <button
              type="button"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setActiveView('membership');
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-[#FD9302] to-[#F5820A] hover:from-[#e07f00] hover:to-[#df7203] text-white rounded-xl text-xs font-black shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Crown className="w-3.5 h-3.5 fill-white" />
              <span>Spotera VIP Pass</span>
            </button>

            {/* Location Selector Pill */}
            <div ref={cityRef} className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-[#0D9CFD] bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full transition-colors cursor-pointer shadow-2xs"
              >
                <MapPin className="w-3.5 h-3.5 text-[#FD9302] shrink-0" />
                <span className="capitalize">
                  {String(selectedCity).toLowerCase() === 'all' ? 'Dubai, UAE' : `${selectedCity}, UAE`}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {cityDropdownOpen && (
                <div className="absolute top-full right-0 mt-1.5 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Select Emirate Location
                  </div>
                  {uaeEmirates.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        setSelectedCity(c as any);
                        setCityDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs font-medium flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                        selectedCity.toLowerCase() === c.toLowerCase()
                          ? 'text-[#0D9CFD] font-bold bg-blue-50/60'
                          : 'text-slate-700'
                      }`}
                    >
                      <span className="capitalize">{c === 'all' ? 'All UAE' : `${c}, UAE`}</span>
                      {selectedCity.toLowerCase() === c.toLowerCase() && (
                        <Check className="w-3.5 h-3.5 text-[#0D9CFD]" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Wishlist Link */}
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setActiveView('wishlist');
              }}
              className="relative p-2 text-slate-600 hover:text-[#FD9302] hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
              title="Saved Deals"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {savedCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#FD9302] text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Language Selector Dropdown */}
            <div ref={langRef} className="relative hidden md:block">
              <button
                type="button"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1 p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                title="Change Language"
                aria-label="Language selection"
              >
                <Globe className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-bold uppercase">{currentLangObj.code}</span>
              </button>

              {langDropdownOpen && (
                <div className="absolute top-full right-0 mt-1.5 w-36 bg-white border border-slate-200 rounded-2xl shadow-xl py-1 z-50">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs font-semibold flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                        language === l.code ? 'text-[#0D9CFD] bg-blue-50/60 font-bold' : 'text-slate-700'
                      }`}
                    >
                      <span>{l.label}</span>
                      {language === l.code && <Check className="w-3.5 h-3.5 text-[#0D9CFD]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User Profile / Auth Button */}
            <div ref={profileRef} className="relative">
              {isLoggedIn ? (
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                  aria-label="Open User Menu"
                >
                  <div className="w-8 h-8 rounded-full bg-[#0D9CFD] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {navInitial}
                  </div>
                  <span className="hidden lg:inline text-xs font-bold text-slate-700 max-w-[100px] truncate">
                    {cleanNavDisplayName}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:inline" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveView('auth')}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              )}

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && isLoggedIn && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 divide-y divide-slate-100">
                  <div className="px-4 py-2.5">
                    <p className="text-xs font-bold text-slate-900 truncate">{cleanNavDisplayName}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email || 'Spotera Member'}</p>
                    <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-[#FD9302] text-[10px] font-black border border-amber-200">
                      <Crown className="w-3 h-3" />
                      <span>Spotera Member</span>
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setActiveView('profile');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>{t('navProfile') || 'My Profile'}</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveView('bookings');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                    >
                      <Ticket className="w-4 h-4 text-slate-400" />
                      <span>{t('navCoupons') || 'My Tickets & Passes'}</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveView('rewards');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-slate-400" />
                      <span>Rewards & Points</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveView('admin');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                    >
                      <Building2 className="w-4 h-4 text-slate-400" />
                      <span>{t('navAdmin') || 'Admin Portal'}</span>
                    </button>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t('logout') || 'Sign Out'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* MOBILE SLIDEOUT DRAWER MENU */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl p-5 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              {/* Drawer Header with Logo & Close button */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <SpoteraLogo
                  size="sm"
                  onClick={() => {
                    setActiveView('home');
                    setMobileMenuOpen(false);
                  }}
                />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile VIP Pass Banner */}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setActiveView('membership');
                }}
                className="w-full py-3 px-4 bg-gradient-to-r from-[#FD9302] to-[#F5820A] text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-sm"
              >
                <Crown className="w-4 h-4 fill-white" />
                <span>Get Spotera VIP Pass</span>
              </button>

              {/* Location Select */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Current UAE Location
                </label>
                <div className="relative">
                  <select
                    value={selectedCity}
                    onChange={(e) => {
                      setSelectedCity(e.target.value as any);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 outline-none"
                  >
                    {uaeEmirates.map((c) => (
                      <option key={c} value={c}>
                        {c === 'all' ? 'All UAE (Default)' : `${c}, UAE`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Nav Links */}
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => {
                      setActiveView(link.id as any);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold flex items-center justify-between ${
                      activeView === link.id
                        ? 'bg-blue-50 text-[#0D9CFD]'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{link.label}</span>
                    {activeView === link.id && (
                      <span className="w-2 h-2 rounded-full bg-[#0D9CFD]" />
                    )}
                  </button>
                ))}
              </div>

              {/* Partner Desk Link */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    setActiveView('partners');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs font-bold text-[#FD9302] hover:bg-amber-50 rounded-xl flex items-center gap-2"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Partner Desk (List Your Venue)</span>
                </button>
              </div>
            </div>

            {/* Bottom Auth */}
            <div className="pt-4 border-t border-slate-100">
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    setActiveView('profile');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4" />
                  <span>{t('navProfile') || 'View My Profile'}</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setActiveView('auth');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 bg-[#0D9CFD] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{t('login') || 'Sign In / Register'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

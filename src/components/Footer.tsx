import React from 'react';
import {
  Instagram,
  Facebook,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SpoteraLogo } from './SpoteraLogo';

export const Footer: React.FC = () => {
  const { setActiveView, setSelectedCategory, t, isRtl } = useApp();

  const handleCategoryNav = (catName: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedCategory(catName as any);
    setActiveView('explore');
  };

  return (
    <footer className="relative bg-[#071739] text-white font-sans overflow-hidden select-none border-t border-slate-800">
      
      {/* Subtle Skyline Glow Background (Desktop only) */}
      <div className="hidden md:block absolute inset-x-0 bottom-0 pointer-events-none opacity-10 overflow-hidden flex justify-center">
        <svg
          className="w-full max-w-6xl h-24 text-sky-400"
          viewBox="0 0 1200 120"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M 0 100 L 80 100 L 80 75 L 95 75 L 95 100 L 165 100 L 165 65 L 190 65 L 190 100" />
          <path d="M 240 100 L 240 40 C 260 40 280 55 280 85 C 280 95 275 100 270 100 Z" />
          <circle cx="420" cy="65" r="30" strokeDasharray="3 3" />
          <path d="M 600 5 L 602 5 L 606 40 L 610 65 L 616 100 L 584 100 L 590 65 L 594 40 Z" />
          <path d="M 720 100 L 720 35 L 735 20 L 735 100 Z" />
          <path d="M 850 100 L 850 50 L 870 50 L 870 100 Z" />
          <line x1="0" y1="100" x2="1200" y2="100" strokeWidth="1.5" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        
        {/* ================= DESKTOP FOOTER (COMPACT & SLEEK) ================= */}
        <div className="hidden md:grid md:grid-cols-12 gap-6 lg:gap-8 pb-8 border-b border-white/10">
          
          {/* Brand Col */}
          <div className="md:col-span-4 lg:col-span-5 space-y-3">
            <SpoteraLogo
              size="sm"
              variant="dark"
              showTagline={false}
              showUaeBadge={false}
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setActiveView('home');
              }}
            />
            <p className="text-xs text-slate-300 leading-relaxed max-w-xs">
              {t('taglineSub') || 'SpoteraDeals connects families and adults with verified deals, dining offers, attractions, and passes in AED.'}
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-2 pt-1">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-[#0D9CFD] text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Facebook"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-[#FD9302] text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Instagram"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-[#0D9CFD] text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="TikTok"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.3 6.3 0 0 0 1.86-4.48V8.71a8.31 8.31 0 0 0 4.91 1.63v-3.65z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Explore Links */}
          <div className="md:col-span-2 space-y-2.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">{t('exploreUae') || 'Explore'}</h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li>
                <button
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setActiveView('explore');
                  }}
                  className="hover:text-[#0D9CFD] transition-colors cursor-pointer"
                >
                  {t('navDeals') || 'Deals'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setActiveView('categories');
                  }}
                  className="hover:text-[#0D9CFD] transition-colors cursor-pointer"
                >
                  {t('navCategories') || 'Categories'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setActiveView('about');
                  }}
                  className="hover:text-[#0D9CFD] transition-colors cursor-pointer"
                >
                  {t('navAbout') || 'About Us'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setActiveView('contact');
                  }}
                  className="hover:text-[#0D9CFD] transition-colors cursor-pointer"
                >
                  {t('navContact') || 'Contact'}
                </button>
              </li>
            </ul>
          </div>

          {/* Partners Links */}
          <div className="md:col-span-2 space-y-2.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">{t('navPartners') || 'Partners'}</h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li>
                <button
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setActiveView('partners');
                  }}
                  className="hover:text-[#0D9CFD] transition-colors cursor-pointer"
                >
                  {t('navPartners') || 'List Your Business'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setActiveView('partners');
                  }}
                  className="hover:text-[#0D9CFD] transition-colors cursor-pointer"
                >
                  {t('partnerWithUs') || 'Partner With Us'}
                </button>
              </li>
            </ul>
          </div>

          {/* Help & Legal */}
          <div className="md:col-span-2 space-y-2.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">{t('navHelp') || 'Help'}</h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li>
                <button
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setActiveView('faq');
                  }}
                  className="hover:text-[#0D9CFD] transition-colors cursor-pointer"
                >
                  {t('navFaq') || 'FAQ'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setActiveView('terms');
                  }}
                  className="hover:text-[#0D9CFD] transition-colors cursor-pointer"
                >
                  {t('navTerms') || 'Terms & Conditions'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setActiveView('privacy');
                  }}
                  className="hover:text-[#0D9CFD] transition-colors cursor-pointer"
                >
                  {t('navPrivacy') || 'Privacy Policy'}
                </button>
              </li>
            </ul>
          </div>

          {/* App / Payments */}
          <div className="md:col-span-2 lg:col-span-1 space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">Payment</h4>
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="px-1.5 py-0.5 bg-white rounded text-[#1A1F71] font-black text-[9px]">VISA</span>
              <span className="px-1.5 py-0.5 bg-white rounded text-[#EB001B] font-black text-[9px]">Mastercard</span>
              <span className="px-1.5 py-0.5 bg-black text-white rounded font-bold text-[9px]">Pay</span>
            </div>
          </div>

        </div>

        {/* Desktop Bottom Bar */}
        <div className="hidden md:flex items-center justify-between pt-4 text-xs text-slate-400">
          <p>© 2026 SpoteraDeals. All rights reserved.</p>
          <div className="flex items-center gap-2 text-slate-400 text-[11px]">
            <span>Verified Deals</span>
            <span>•</span>
            <span>AED Pricing</span>
          </div>
        </div>


        {/* ================= MOBILE FOOTER (VERY COMPACT AS REQUESTED) ================= */}
        <div className="md:hidden space-y-3 pt-1 pb-1 text-center">
          {/* Compact Logo & Links row */}
          <div className="flex items-center justify-between">
            <SpoteraLogo
              size="xs"
              variant="dark"
              showTagline={false}
              showUaeBadge={false}
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setActiveView('home');
              }}
            />

            {/* Inline Quick Links */}
            <div className="flex items-center gap-3 text-[11px] text-slate-300 font-medium">
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setActiveView('explore');
                }}
                className="hover:text-[#0D9CFD] transition-colors"
              >
                {t('navDeals') || 'Deals'}
              </button>
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setActiveView('categories');
                }}
                className="hover:text-[#0D9CFD] transition-colors"
              >
                {t('navCategories') || 'Categories'}
              </button>
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setActiveView('about');
                }}
                className="hover:text-[#0D9CFD] transition-colors"
              >
                {t('navAbout') || 'About'}
              </button>
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setActiveView('contact');
                }}
                className="hover:text-[#0D9CFD] transition-colors"
              >
                {t('navContact') || 'Contact'}
              </button>
            </div>
          </div>

          {/* Socials & Copyright Row */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[10px] text-slate-400">
            <p>© 2026 SpoteraDeals. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-white"
                aria-label="Facebook"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-white"
                aria-label="Instagram"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-white"
                aria-label="TikTok"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.3 6.3 0 0 0 1.86-4.48V8.71a8.31 8.31 0 0 0 4.91 1.63v-3.65z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

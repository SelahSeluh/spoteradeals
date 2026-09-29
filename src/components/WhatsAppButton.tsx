import React, { useState, useRef, useEffect } from 'react';
import { Headphones, MessageSquare, Phone, Mail, X, CheckCircle2, ChevronRight, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const WhatsAppButton: React.FC = () => {
  const { footerConfig, setActiveView } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const rawPhone = footerConfig.contactPhone || '+971503048978';
  const cleanPhone = rawPhone.replace(/[^\d]/g, '');

  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    'Hello Spotera Deals UAE! I would like assistance with family offers and passes.'
  )}`;

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={popoverRef} className="fixed bottom-[74px] left-3 sm:left-4 md:bottom-6 md:left-6 z-40">
      {/* Support Popover Menu */}
      {isOpen && (
        <div className="absolute bottom-14 left-0 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 space-y-3 animate-scale-up z-50">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#0D9CFD]/10 flex items-center justify-center text-[#0D9CFD]">
                <Headphones className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Spotera Support</h4>
                <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  UAE Concierge Online
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] text-slate-600 leading-relaxed">
            Need help claiming a pass or booking a family experience? Choose how you'd like to reach us:
          </p>

          {/* Action Options */}
          <div className="space-y-2">
            {/* 1. WhatsApp Fast Inquiry */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-[#0D9CFD]/5 border border-slate-200 hover:border-[#0D9CFD]/40 rounded-xl transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <MessageSquare className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-900 group-hover:text-[#0D9CFD]">Chat on WhatsApp</div>
                  <div className="text-[10px] text-slate-500">+971 50 304 8978</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </a>

            {/* 2. Direct Call */}
            <a
              href={`tel:${cleanPhone}`}
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-blue-50/50 border border-slate-200 hover:border-blue-300 rounded-xl transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#0C5CAB] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-900 group-hover:text-[#0C5CAB]">Call Hotline</div>
                  <div className="text-[10px] text-slate-500">9 AM – 9 PM GST</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </a>

            {/* 3. Email Inquiries */}
            <a
              href="mailto:support@spoteradeals.com?subject=Spotera%20Deals%20Assistance"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-amber-50/50 border border-slate-200 hover:border-amber-300 rounded-xl transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#FD9302] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-900 group-hover:text-[#FD9302]">Email Support</div>
                  <div className="text-[10px] text-slate-500">support@spoteradeals.com</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>

          <div className="pt-1 text-center">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setActiveView('contact');
              }}
              className="text-[11px] font-bold text-[#0D9CFD] hover:underline flex items-center justify-center gap-1 mx-auto"
            >
              Open Help & Support Center <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Contact Spotera Support"
        title="Spotera Concierge & Support"
        className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-[#0C5CAB] to-[#0D9CFD] hover:from-[#0A4D92] hover:to-[#0C8CE0] text-white shadow-xl hover:shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center ring-2 ring-white/80 cursor-pointer group"
      >
        <Headphones className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white group-hover:rotate-6 transition-transform" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full animate-pulse" />
      </button>
    </div>
  );
};

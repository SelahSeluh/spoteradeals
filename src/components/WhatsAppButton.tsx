import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const WhatsAppButton: React.FC = () => {
  const { footerConfig } = useApp();

  const rawPhone = footerConfig.contactPhone || '+971503048978';
  const cleanPhone = rawPhone.replace(/[^\d]/g, '');

  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    'Hello SpoteraDeals! I would like to inquire about family activities and deals.'
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp with SpoteraDeals"
      title="Contact SpoteraDeals WhatsApp Support"
      className="fixed bottom-[76px] left-3 sm:left-4 md:bottom-6 md:left-6 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg hover:shadow-emerald-500/40 hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center ring-2 ring-white/60 group"
    >
      <MessageCircle className="w-6 h-6 text-white group-hover:rotate-6 transition-transform" />
      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-300 border-2 border-white rounded-full animate-pulse" />
    </a>
  );
};

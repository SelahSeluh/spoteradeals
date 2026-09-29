import React, { useState, useMemo } from 'react';
import {
  X,
  Check,
  Ticket,
  Calendar,
  Users,
  CreditCard,
  ChevronRight,
  Share2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { SpoteraLogo } from '../components/SpoteraLogo';
import { BookingQr } from '../components/BookingQr';

export const BookingConfirmPage: React.FC = () => {
  const { bookings, deals, selectedBookingId, setActiveView } = useApp();
  const { showToast } = useToast();

  const [showFullTicketModal, setShowFullTicketModal] = useState(false);

  const booking = useMemo(() => {
    if (selectedBookingId) {
      const found = bookings.find((b) => b.id === selectedBookingId);
      if (found) return found;
    }
    return bookings[bookings.length - 1] || null;
  }, [bookings, selectedBookingId]);

  const deal = useMemo(() => {
    if (!booking) return null;
    return deals.find((d) => d.id === booking.dealId) || deals[0];
  }, [booking, deals]);

  const handleShareTicket = async () => {
    if (!booking) return;
    const shareText = `SpoteraDeals Ticket: ${deal?.title || 'Family Activity'} — Reference: ${booking.bookingCode}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'SpoteraDeals Ticket',
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {
        // cancelled
      }
    } else {
      navigator.clipboard?.writeText(shareText);
      showToast('Ticket details copied to clipboard!', 'success');
    }
  };

  if (!booking) {
    return (
      <div className="min-h-screen bg-[#F7FAFD] text-[#0D1B3E] font-sans pb-16 flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-[#E2EDF9] p-8 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#0D9CFD] flex items-center justify-center mx-auto">
            <Ticket className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-[#0D1B3E]">No Booking Found</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            You do not have an active booking to display. Browse our verified family deals and activities across the UAE to book your passes.
          </p>
          <button
            onClick={() => setActiveView('explore')}
            className="w-full py-3 px-6 bg-[#0D9CFD] hover:bg-[#0B8AE0] text-white text-xs font-extrabold rounded-2xl shadow-xs transition-all cursor-pointer"
          >
            Explore Verified Deals
          </button>
        </div>
      </div>
    );
  }

  const bookingRef = booking.bookingCode;
  const dealTitle = deal?.title || booking.dealTitle || 'Family Activity';
  const displayDate = booking.date ? `${booking.date} · ${booking.timeSlot || '11:00'}` : 'Scheduled Experience';
  const guestsLabel = `${booking.childrenCount || 1} guests`;
  const paidPrice = booking.totalPrice || 0;

  return (
    <div className="min-h-screen bg-[#F7FAFD] text-[#0D1B3E] font-sans pb-16">
      <div className="max-w-md sm:max-w-lg lg:max-w-xl mx-auto px-4 sm:px-6 pt-3 sm:pt-6 space-y-4 sm:space-y-6">
        {/* 1. TOP BAR: Close "X" button on top-left */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => setActiveView('home')}
            aria-label="Close"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-[#E8EEF5] flex items-center justify-center text-[#0D1B3E] shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[2.2px]" />
          </button>
          <div className="w-9" />
        </div>

        {/* 2. CONFIRMATION HEADER: Big Green Checkmark Badge */}
        <div className="text-center flex flex-col items-center space-y-1.5 pt-1">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#10B981] text-white flex items-center justify-center shadow-lg shadow-[#10B981]/25">
            <Check className="w-9 h-9 sm:w-11 sm:h-11 stroke-[3px]" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-[#0D1B3E] tracking-tight mt-1">
            Booking Confirmed
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-[#8D98AA]">
            Your digital pass is ready for redemption
          </p>
        </div>

        {/* 3. PHYSICAL TICKET CONTAINER WITH CUTOUT NOTCHES & PERFORATION */}
        <div className="relative bg-white rounded-3xl border border-[#E2EDF9] p-5 sm:p-7 shadow-xs overflow-hidden">
          {/* Left & Right Perforation Cutouts */}
          <div className="absolute top-[52px] sm:top-[60px] -left-3.5 sm:-left-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#F7FAFD] border-r border-[#E2EDF9]" />
          <div className="absolute top-[52px] sm:top-[60px] -right-3.5 sm:-right-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#F7FAFD] border-l border-[#E2EDF9]" />

          {/* Top Row: SpoteraDeals Logo & Ref Code */}
          <div className="flex items-center justify-between px-1">
            <SpoteraLogo size="sm" variant="light" showTagline={false} />
            <span className="text-xs sm:text-sm font-bold text-[#1060E2] tracking-tight">
              Ref: {bookingRef}
            </span>
          </div>

          {/* Dotted Perforation Line */}
          <div className="my-4 sm:my-5 border-b-2 border-dashed border-slate-200" />

          {/* Centered QR Code */}
          <div className="py-2 flex flex-col items-center justify-center">
            <BookingQr value={bookingRef} />
            <p className="text-[10px] sm:text-xs text-[#8D98AA] font-semibold mt-2.5 text-center">
              Scan at entry gate or front desk
            </p>
          </div>
        </div>

        {/* 4. DETAILS SUMMARY LIST CARD */}
        <div className="bg-white rounded-2xl border border-[#E8EEF5] p-4 sm:p-5 shadow-2xs space-y-3">
          {/* Item 1: Deal Title */}
          <div className="flex items-center justify-between text-xs sm:text-sm font-medium text-[#0D1B3E]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#F0F6FE] text-[#1060E2] flex items-center justify-center shrink-0">
                <Ticket className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <span className="font-bold line-clamp-1">{dealTitle}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 ml-1" />
          </div>

          {/* Item 2: Date & Time */}
          <div className="flex items-center justify-between text-xs sm:text-sm font-medium text-[#0D1B3E]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#F0F6FE] text-[#1060E2] flex items-center justify-center shrink-0">
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <span>{displayDate}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
          </div>

          {/* Item 3: Guests */}
          <div className="flex items-center justify-between text-xs sm:text-sm font-medium text-[#0D1B3E]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#F0F6FE] text-[#1060E2] flex items-center justify-center shrink-0">
                <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <span>{guestsLabel}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
          </div>

          {/* Item 4: Paid Amount */}
          <div className="flex items-center justify-between text-xs sm:text-sm font-medium text-[#0D1B3E]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#F0F6FE] text-[#1060E2] flex items-center justify-center shrink-0">
                <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div className="flex items-center gap-1.5">
                <span>Paid:</span>
                <span className="font-black text-[#F5820A]">AED {paidPrice}</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
          </div>
        </div>

        {/* 5. ACTION BUTTONS */}
        <div className="space-y-2.5 pt-2">
          {/* View Ticket Primary Button */}
          <button
            onClick={() => setShowFullTicketModal(true)}
            className="w-full py-3.5 sm:py-4 rounded-2xl bg-[#1060E2] hover:bg-[#0C4EBD] text-white text-sm font-bold text-center transition-transform active:scale-95 shadow-md shadow-[#1060E2]/25 cursor-pointer"
          >
            View Ticket
          </button>

          {/* Share Ticket Secondary Button */}
          <button
            onClick={handleShareTicket}
            className="w-full py-3.5 sm:py-4 rounded-2xl bg-white border border-[#1060E2] text-[#1060E2] text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#F0F6FE] transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Ticket</span>
          </button>

          {/* Back Home Link */}
          <div className="text-center pt-2">
            <button
              onClick={() => setActiveView('home')}
              className="text-xs sm:text-sm font-bold text-[#1060E2] hover:underline cursor-pointer"
            >
              Back Home
            </button>
          </div>
        </div>
      </div>

      {/* FULL TICKET MODAL */}
      {showFullTicketModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 space-y-4 text-center">
            <div className="flex justify-end">
              <button
                onClick={() => setShowFullTicketModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <SpoteraLogo size="md" variant="light" showTagline={false} />
            <h3 className="text-lg font-black text-[#0D1B3E]">{dealTitle}</h3>
            <p className="text-xs text-[#5F6B82]">{displayDate} · {guestsLabel}</p>
            <div className="py-2">
              <BookingQr value={bookingRef} />
            </div>
            <p className="text-xs font-bold text-[#1060E2]">Ticket Reference: {bookingRef}</p>
            <button
              onClick={() => setShowFullTicketModal(false)}
              className="w-full py-3 rounded-2xl bg-[#1060E2] text-white text-xs font-bold"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

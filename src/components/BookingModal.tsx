import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  X,
  CalendarCheck,
  Calendar,
  Clock,
  Users,
  PackageCheck,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Copy,
  Check,
  Download,
  ShieldCheck,
  Building,
  Sparkles,
  Ticket,
} from 'lucide-react';
import { Deal, Booking } from '../types';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { getLocalizedTitle } from '../utils/i18nHelper';

interface BookingModalProps {
  deal: Deal | null;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ deal, onClose }) => {
  const { user, createBooking, setActiveView, language } = useApp();
  const { showToast } = useToast();

  const [step, setStep] = useState<'select' | 'review' | 'ticket'>('select');
  const [date, setDate] = useState<string>(() => {
    const tomorrow = new Date(Date.now() + 86400000);
    return tomorrow.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState<string>('10:00 AM - 12:00 PM');
  const [childrenCount, setChildrenCount] = useState<number>(2);
  const [selectedPkgIndex, setSelectedPkgIndex] = useState<number>(0);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const isSubmittingRef = useRef<boolean>(false);

  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [qrUrl, setQrUrl] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Close on Escape key or mobile back navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Generate high quality QR code upon booking confirmation
  useEffect(() => {
    if (confirmedBooking) {
      QRCode.toDataURL(confirmedBooking.bookingCode, {
        width: 280,
        margin: 2,
        color: {
          dark: '#0A2540',
          light: '#FFFFFF',
        },
      })
        .then((url) => setQrUrl(url))
        .catch((err) => console.error('QR Generation error:', err));
    }
  }, [confirmedBooking]);

  if (!deal) return null;

  const currentPkg = deal.packages[selectedPkgIndex] || {
    name: 'Standard Pass',
    price: deal.discountPrice,
    description: 'Standard Entry Pass',
    duration: 'Full Day Access',
  };

  const totalPrice = currentPkg.price * (childrenCount > 2 ? 1 + (childrenCount - 2) * 0.4 : 1);

  const timeSlots = [
    '10:00 AM - 12:00 PM',
    '12:30 PM - 02:30 PM',
    '03:00 PM - 05:00 PM',
    '05:30 PM - 07:30 PM',
    '08:00 PM - 10:00 PM',
  ];

  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('review');
  };

  const handleConfirmBooking = () => {
    if (isSubmittingRef.current || isSubmitting) return;

    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      const booking = createBooking(
        deal,
        date,
        timeSlot,
        childrenCount,
        currentPkg.name,
        Math.round(totalPrice)
      );

      setConfirmedBooking(booking);
      setStep('ticket');
      showToast.success('Reservation confirmed! Digital Ticket Pass issued.');
    } catch (err) {
      console.error(err);
      showToast.error('Could not complete reservation. Please try again.');
    } finally {
      setIsSubmitting(false);
      isSubmittingRef.current = false;
    }
  };

  const handleCopyCode = () => {
    if (!confirmedBooking) return;
    navigator.clipboard.writeText(confirmedBooking.bookingCode);
    setIsCopied(true);
    showToast.success('Booking reference copied to clipboard!');
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Activity Booking and Digital Pass"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-100 my-auto max-h-[92vh] flex flex-col font-sans">
        {/* ========================================================================= */}
        {/* TOP BAR / NAVIGATION (APPLE STYLE BACK & CLOSE, NO DEAD ENDS) */}
        {/* ========================================================================= */}
        <div className="bg-[#0C5CAB] text-white px-5 py-4 flex items-center justify-between border-b border-blue-600/50 shrink-0">
          <div className="flex items-center gap-2">
            {step === 'review' ? (
              <button
                type="button"
                onClick={() => setStep('select')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-100 hover:text-white bg-white/10 hover:bg-white/20 py-1.5 px-3 rounded-xl transition-all cursor-pointer min-h-[36px]"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Options</span>
              </button>
            ) : step === 'ticket' ? (
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-100 hover:text-white bg-white/10 hover:bg-white/20 py-1.5 px-3 rounded-xl transition-all cursor-pointer min-h-[36px]"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Deal</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <CalendarCheck className="w-4 h-4" />
                <span>Reserve Activity</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {step !== 'ticket' && (
              <span className="text-[11px] font-bold text-blue-200 bg-white/10 px-2.5 py-0.5 rounded-full">
                Step {step === 'select' ? '1 of 2' : '2 of 2'}
              </span>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
              aria-label="Close"
              title="Close window"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* STEP 1: SELECT PACKAGE, DATE, TIME & GUESTS */}
        {/* ========================================================================= */}
        {step === 'select' && (
          <form onSubmit={handleProceedToReview} className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                {getLocalizedTitle(deal, language)}
              </h2>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-[#0C5CAB]" />
                <span>{deal.businessName} • {deal.city}</span>
              </p>
            </div>

            {/* Package Options */}
            {deal.packages && deal.packages.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <PackageCheck className="w-4 h-4 text-[#0C5CAB]" />
                  Select Experience Pass
                </label>
                <div className="space-y-2">
                  {deal.packages.map((pkg, idx) => (
                    <div
                      key={pkg.id || idx}
                      onClick={() => setSelectedPkgIndex(idx)}
                      className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                        selectedPkgIndex === idx
                          ? 'border-[#0C5CAB] bg-blue-50/70 ring-2 ring-[#0C5CAB]/20'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-slate-900">{pkg.name}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{pkg.description}</div>
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <div className="font-black text-[#0C5CAB] text-sm">AED {pkg.price}</div>
                        <div className="text-[10px] text-slate-400 font-medium">{pkg.duration}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Date & Time Pickers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#0C5CAB]" />
                  Activity Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0C5CAB] min-h-[44px]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#0C5CAB]" />
                  Time Slot
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0C5CAB] min-h-[44px]"
                >
                  {timeSlots.map((ts) => (
                    <option key={ts} value={ts}>
                      {ts}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Attendees Count */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#0C5CAB]" />
                Number of Children / Guests
              </label>
              <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setChildrenCount(Math.max(1, childrenCount - 1))}
                  className="w-10 h-10 rounded-xl bg-white border border-slate-300 font-bold text-slate-800 hover:bg-slate-100 text-base cursor-pointer flex items-center justify-center transition-colors"
                  aria-label="Decrease attendees"
                >
                  -
                </button>
                <span className="font-black text-slate-900 text-sm min-w-[50px] text-center">
                  {childrenCount} {childrenCount === 1 ? 'Guest' : 'Guests'}
                </span>
                <button
                  type="button"
                  onClick={() => setChildrenCount(childrenCount + 1)}
                  className="w-10 h-10 rounded-xl bg-white border border-slate-300 font-bold text-slate-800 hover:bg-slate-100 text-base cursor-pointer flex items-center justify-center transition-colors"
                  aria-label="Increase attendees"
                >
                  +
                </button>
                <span className="text-[11px] text-slate-500 ml-auto">
                  (Includes accompanying adult entry)
                </span>
              </div>
            </div>

            {/* Price Preview & Next Button */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Estimated Total</span>
                <span className="text-xl font-black text-[#0C5CAB]">
                  AED {Math.round(totalPrice)}
                </span>
              </div>

              <button
                type="submit"
                className="py-3 px-6 bg-[#0C5CAB] hover:bg-[#094887] text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 transition-all cursor-pointer min-h-[44px]"
              >
                <span>Review Reservation</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: REVIEW & CONFIRM DETAILS (WITH DUPLICATE BOOKING PREVENTION) */}
        {/* ========================================================================= */}
        {step === 'review' && (
          <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
            <div>
              <span className="text-xs font-black text-[#0C5CAB] uppercase tracking-wider">Review Summary</span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                Confirm Your Family Booking
              </h3>
            </div>

            {/* Booking Summary Box */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-2.5">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Activity Deal</span>
                <span className="font-bold text-slate-900 text-right max-w-[200px] truncate">{getLocalizedTitle(deal, language)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Venue / Location</span>
                <span className="font-bold text-slate-800">{deal.businessName} ({deal.city})</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Pass Selected</span>
                <span className="font-bold text-slate-800">{currentPkg.name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Date & Time</span>
                <span className="font-bold text-slate-800">{date} • {timeSlot}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Party Size</span>
                <span className="font-bold text-slate-800">{childrenCount} Kids / Attendees</span>
              </div>
              <div className="flex justify-between pt-1 font-bold">
                <span className="text-slate-700">Total Price Payable at Venue</span>
                <span className="text-[#0C5CAB] text-base font-black">AED {Math.round(totalPrice)}</span>
              </div>
            </div>

            {/* Contact Details */}
            <div className="p-3.5 bg-blue-50/50 rounded-2xl border border-blue-100 text-xs space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-blue-900 font-bold">Primary Contact</span>
              <div className="font-bold text-slate-900">{user.name || 'Spotera Member'}</div>
              <div className="text-slate-500 flex items-center justify-between text-[11px]">
                <span>{user.email || 'Registered Member'}</span>
                <span>{user.phone || '+971 50 123 4567'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Instant confirmation. No booking fee. Free cancellation up to 24h prior.</span>
            </div>

            {/* Actions with Single-flight Duplicate Prevention */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep('select')}
                disabled={isSubmitting}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[44px]"
              >
                ← Edit Details
              </button>

              <button
                type="button"
                onClick={handleConfirmBooking}
                disabled={isSubmitting}
                className="py-3 px-4 bg-[#0C5CAB] hover:bg-[#094887] disabled:opacity-60 text-white rounded-xl text-xs font-black shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[44px]"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Issuing Pass...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Get Ticket</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: DIGITAL TICKET & QR CODE PASS (NEVER TRAP USER, CLEAR BACK & CLOSE) */}
        {/* ========================================================================= */}
        {step === 'ticket' && confirmedBooking && (
          <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
            {/* Top Confirmation Badge */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center shadow-xs border border-emerald-100">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                  Confirmed • Active Pass
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">
                  Spotera Activity Ticket
                </h3>
              </div>
            </div>

            {/* Apple Wallet Style Digital Ticket Pass */}
            <div className="ticket-stub border border-slate-200 rounded-3xl overflow-hidden bg-white shadow-md">
              {/* Ticket Header */}
              <div className="p-4 bg-gradient-to-r from-[#0C5CAB] to-[#0A4D92] text-white">
                <div className="flex items-center justify-between text-[11px] text-blue-200 font-bold mb-1">
                  <span>{deal.businessName}</span>
                  <span>{deal.city}, UAE</span>
                </div>
                <h4 className="text-sm font-black text-white leading-tight">
                  {getLocalizedTitle(deal, language)}
                </h4>
              </div>

              {/* Perforation Divider */}
              <div className="relative border-t border-dashed border-slate-300 my-0">
                <div className="absolute -top-2.5 -left-3 w-5 h-5 bg-slate-100 border-r border-slate-200 rounded-full" />
                <div className="absolute -top-2.5 -right-3 w-5 h-5 bg-slate-100 border-l border-slate-200 rounded-full" />
              </div>

              {/* Ticket Body */}
              <div className="p-4 space-y-4">
                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Date & Time</span>
                    <span className="font-black text-slate-900 block text-[11px]">
                      {confirmedBooking.date}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {confirmedBooking.timeSlot}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Package & Guests</span>
                    <span className="font-black text-slate-900 block text-[11px] truncate">
                      {confirmedBooking.packageSelected}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {confirmedBooking.childrenCount} Attendees
                    </span>
                  </div>
                </div>

                {/* QR Code Presentation Box */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-center space-y-2.5">
                  <div className="flex items-center justify-center">
                    {qrUrl ? (
                      <img
                        src={qrUrl}
                        alt="Booking QR Code Pass"
                        className="w-48 h-48 rounded-xl border border-slate-200 shadow-xs bg-white p-1"
                      />
                    ) : (
                      <div className="w-48 h-48 bg-slate-200 rounded-xl animate-pulse mx-auto" />
                    )}
                  </div>

                  {/* Booking Reference with Copy Action */}
                  <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-blue-200">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block text-left">Booking Reference</span>
                      <span className="font-mono text-sm font-black text-[#0C5CAB] tracking-wider">
                        {confirmedBooking.bookingCode}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#0C5CAB] rounded-lg text-xs font-bold flex items-center gap-1 transition-colors min-h-[32px] cursor-pointer"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  <p className="text-[11px] font-bold text-slate-600">
                    📲 Show this QR code at the venue cashier or entrance
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Actions: Close & Return to Deal, Go to Bookings, Print */}
            <div className="space-y-2 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer min-h-[44px]"
                >
                  Close & Back to Deal
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setActiveView('bookings');
                  }}
                  className="py-3 px-4 bg-[#0C5CAB] hover:bg-[#094887] text-white rounded-xl text-xs font-black shadow-sm transition-all cursor-pointer min-h-[44px] flex items-center justify-center gap-1.5"
                >
                  <Ticket className="w-4 h-4" />
                  <span>View in My Bookings</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => window.print()}
                className="w-full py-2.5 text-slate-500 hover:text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Print or Save Ticket PDF</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

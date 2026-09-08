import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import {
  X,
  CheckCircle2,
  Copy,
  Download,
  Building,
  ArrowLeft,
  Check,
  Ticket,
} from 'lucide-react';
import { Coupon } from '../types';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { getLocalizedTitle } from '../utils/i18nHelper';

interface CouponModalProps {
  coupon: Coupon | null;
  onClose: () => void;
}

export const CouponModal: React.FC<CouponModalProps> = ({ coupon, onClose }) => {
  const { setActiveView, t, deals, language } = useApp();
  const { showToast } = useToast();
  const [qrUrl, setQrUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const matchedDeal = coupon ? deals.find((d) => d.id === coupon.dealId) : null;
  const displayTitle = matchedDeal ? getLocalizedTitle(matchedDeal, language) : coupon?.dealTitle;

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (coupon) {
      QRCode.toDataURL(coupon.qrCodeData || coupon.code, {
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
  }, [coupon]);

  if (!coupon) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    showToast.success(t('toastCouponCopied') || 'Voucher code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Digital Coupon Voucher Pass"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-100 my-auto max-h-[92vh] flex flex-col font-sans">
        {/* Top Navigation Bar: Back & Close */}
        <div className="bg-[#0C5CAB] text-white px-5 py-4 flex items-center justify-between border-b border-blue-600/50 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-100 hover:text-white bg-white/10 hover:bg-white/20 py-1.5 px-3 rounded-xl transition-all cursor-pointer min-h-[36px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Deal</span>
          </button>

          <span className="text-[11px] font-extrabold text-amber-300 uppercase tracking-wider">
            Spotera Digital Pass
          </span>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
            aria-label="Close"
            title="Close window"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* Status Badge & Header */}
          <div className="text-center space-y-1.5">
            <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3" />
              Active Voucher • Ready to Redeem
            </span>
            <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
              {displayTitle}
            </h3>
            <p className="text-xs text-[#0C5CAB] font-bold flex items-center justify-center gap-1">
              <Building className="w-3.5 h-3.5" />
              <span>{coupon.businessName}</span>
            </p>
          </div>

          {/* Apple Wallet Style Ticket Pass */}
          <div className="ticket-stub border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
            {/* Perforated Divider */}
            <div className="relative border-t border-dashed border-slate-200 my-0">
              <div className="absolute -top-2 -left-2.5 w-4 h-4 bg-slate-50 border-r border-slate-200 rounded-full" />
              <div className="absolute -top-2 -right-2.5 w-4 h-4 bg-slate-50 border-l border-slate-200 rounded-full" />
            </div>

            {/* QR Code Presentation */}
            <div className="bg-slate-50 p-4 text-center space-y-3">
              <div className="flex items-center justify-center">
                {qrUrl ? (
                  <img
                    src={qrUrl}
                    alt="Coupon QR Code"
                    className="w-44 h-44 rounded-xl border border-slate-200 shadow-xs bg-white p-1"
                  />
                ) : (
                  <div className="w-44 h-44 bg-slate-200 rounded-xl animate-pulse mx-auto" />
                )}
              </div>

              {/* Unique Code with Copy Button */}
              <div className="flex items-center justify-between bg-white px-3.5 py-2 rounded-xl border border-blue-200 shadow-2xs">
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block text-left">Voucher Code</span>
                  <span className="font-mono text-sm font-black text-slate-900 tracking-wider">
                    {coupon.code}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#0C5CAB] rounded-lg text-xs font-bold flex items-center gap-1 transition-colors min-h-[32px] cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <p className="text-[11px] font-bold text-slate-700">
                📲 Show this QR code to the cashier at the venue to redeem
              </p>
            </div>
          </div>

          {/* Details & Expiry */}
          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 font-bold block text-[10px] uppercase">Claimed For</span>
              <span className="font-bold text-slate-800 truncate block text-[11px]">
                {coupon.userName || 'Spotera Member'}
              </span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 font-bold block text-[10px] uppercase">Valid Until</span>
              <span className="font-bold text-amber-700 block text-[11px]">{coupon.expiryDate}</span>
            </div>
          </div>

          {/* Redemption Note */}
          <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 text-[11px] text-blue-900 leading-relaxed">
            <strong className="font-bold">Instructions: </strong>
            {coupon.redemptionInstructions || 'Present this QR pass to reception/cashier upon arrival to enjoy your discounted rate.'}
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-1">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={onClose}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer min-h-[44px]"
              >
                Close & Return
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  setActiveView('bookings');
                }}
                className="py-3 px-4 bg-[#0C5CAB] hover:bg-[#094887] text-white rounded-xl text-xs font-black shadow-xs transition-all cursor-pointer min-h-[44px] flex items-center justify-center gap-1.5"
              >
                <Ticket className="w-4 h-4" />
                <span>My Bookings</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="w-full py-2 text-slate-500 hover:text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Print or Save Pass PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

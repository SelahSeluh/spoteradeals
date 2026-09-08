import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  ExternalLink,
  ShieldAlert,
  Building2,
  User,
  Ticket,
  Crown,
  Share2,
  Sparkles,
  Globe,
  Lock,
  QrCode,
  Users,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';

export const LinkShareModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { setActiveView, t } = useApp();
  const { showToast } = useToast();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Get current deployment origin
  const appOrigin = window.location.origin;
  const sharedAppOrigin = appOrigin.includes('ais-dev-') 
    ? appOrigin.replace('ais-dev-', 'ais-pre-')
    : appOrigin;

  const links = [
    {
      id: 'public-user',
      title: '1. SpoteraDeals.com — Customer Website',
      targetAudience: 'Share with Families, Parents & Social Media',
      description: 'Main public site for parents to discover play areas (Oktopus Park, KidZania, etc.), claim discounts, and book passes.',
      prettyDomain: 'https://SpoteraDeals.com',
      liveUrl: `${sharedAppOrigin}/#home`,
      view: 'home' as const,
      icon: Users,
      color: 'bg-blue-600 text-white',
      badge: '🌍 SHARE WITH PUBLIC',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
      isPublic: true,
    },
    {
      id: 'customer-pwa',
      title: '2. Customer App / PWA & Wallet Link',
      targetAudience: 'For Mobile Users & Saved Passports',
      description: 'Direct mobile app view where parents view saved digital QR vouchers, redeemed tickets, and offline passes.',
      prettyDomain: 'https://SpoteraDeals.com/#coupons',
      liveUrl: `${sharedAppOrigin}/#coupons`,
      view: 'coupons' as const,
      icon: Ticket,
      color: 'bg-purple-600 text-white',
      badge: '📱 CUSTOMER APP / PWA',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
      isPublic: true,
    },
    {
      id: 'admin-private',
      title: '3. Admin Dashboard Link (For You)',
      targetAudience: 'FOR YOU (PLATFORM OWNER / ADMIN ONLY)',
      description: 'Keep private! Access revenue analytics, approve vendor listings, publish new deals, and view redemption rosters.',
      prettyDomain: 'https://SpoteraDeals.com/#admin',
      liveUrl: `${sharedAppOrigin}/#admin`,
      view: 'admin' as const,
      icon: Lock,
      color: 'bg-amber-500 text-slate-950',
      badge: '🛡️ ADMIN ONLY (KEEP PRIVATE)',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300 font-black',
      isPublic: false,
    },
    {
      id: 'partner-venue',
      title: '4. Business / Partner Link',
      targetAudience: 'Share with Venue Managers & Reception Desk',
      description: 'Send to venue partners (e.g. Oktopus Park reception, Cheeky Monkeys) so front desk staff can scan customer QR codes on arrival.',
      prettyDomain: 'https://SpoteraDeals.com/#partners',
      liveUrl: `${sharedAppOrigin}/#partners`,
      view: 'partners' as const,
      icon: Building2,
      color: 'bg-emerald-600 text-white',
      badge: '🏢 SHARE WITH PARTNERS',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      isPublic: true,
    },
    {
      id: 'vip-membership',
      title: '5. VIP Family Passport Link',
      targetAudience: 'Promotional Passports Page',
      description: 'Direct link to purchase the Spotera VIP Pass (50% extra discounts & zero booking fees).',
      prettyDomain: 'https://SpoteraDeals.com/#membership',
      liveUrl: `${sharedAppOrigin}/#membership`,
      view: 'membership' as const,
      icon: Crown,
      color: 'bg-gradient-to-r from-amber-500 to-amber-600 text-white',
      badge: '👑 VIP PASSPORT',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      isPublic: true,
    },
  ];

  const handleCopy = (id: string, textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(id);
    showToast.success(t('toastInfoCopied'));
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex justify-between items-start sm:items-center relative border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-cyan-400 text-slate-950 flex items-center justify-center font-black">
                <Share2 className="w-4 h-4" />
              </div>
              <span className="text-cyan-400 font-extrabold text-xs uppercase tracking-widest">
                Spotera Link Guide & Access Hub
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-sans">Which Link To Share Where</h2>
            <p className="text-xs text-slate-300">
              Clean shortened links & live direct URLs for Public, Vendors, and Admin.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Instructions Banner */}
        <div className="bg-blue-900/90 text-white p-4 text-xs space-y-2 border-b border-blue-800">
          <div className="font-bold flex items-center gap-2 text-cyan-300">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>EXPLANATION OF LINKS:</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px] text-slate-200">
            <div className="bg-slate-900/60 p-2 rounded-xl border border-blue-400/30">
              <strong className="text-cyan-300">🌍 PUBLIC CUSTOMERS:</strong> Share Link #1 (Home Marketplace). Perfect for marketing!
            </div>
            <div className="bg-slate-900/60 p-2 rounded-xl border border-amber-400/30">
              <strong className="text-amber-300">🛡️ FOR YOU (ADMIN):</strong> Keep Link #2 private. It lets you manage deals & revenue.
            </div>
            <div className="bg-slate-900/60 p-2 rounded-xl border border-emerald-400/30">
              <strong className="text-emerald-300">🏢 FOR PLAY AREA VENUES:</strong> Send Link #3 to reception staff to scan QR codes.
            </div>
          </div>
        </div>

        {/* Links List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {links.map((link) => {
            const IconComp = link.icon;
            const isCopiedLive = copiedId === `${link.id}-live`;
            const isCopiedPretty = copiedId === `${link.id}-pretty`;

            return (
              <div
                key={link.id}
                className="p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:border-blue-300 transition-all space-y-3 group"
              >
                {/* Title line */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-xl ${link.color} flex items-center justify-center shrink-0 shadow-sm font-bold`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900">{link.title}</h3>
                      <p className="text-[11px] font-bold text-blue-700">{link.targetAudience}</p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${link.badgeColor} self-start sm:self-auto`}>
                    {link.badge}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-snug">{link.description}</p>

                {/* URL Displays */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  {/* Clean Shortened Display */}
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Clean Short Name</div>
                      <div className="font-mono font-bold text-slate-900 text-xs truncate">{link.prettyDomain}</div>
                    </div>
                    <button
                      onClick={() => handleCopy(`${link.id}-pretty`, link.prettyDomain)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] rounded-lg shrink-0 flex items-center gap-1 transition-all"
                    >
                      {isCopiedPretty ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{isCopiedPretty ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  {/* Live Direct URL */}
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-[9px] font-bold text-blue-600 uppercase tracking-wider">Live Direct App URL</div>
                      <div className="font-mono font-bold text-blue-600 text-xs truncate">{link.liveUrl}</div>
                    </div>
                    <button
                      onClick={() => handleCopy(`${link.id}-live`, link.liveUrl)}
                      className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-[10px] rounded-lg shrink-0 flex items-center gap-1 transition-all"
                    >
                      {isCopiedLive ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{isCopiedLive ? 'Copied!' : 'Copy Live'}</span>
                    </button>
                  </div>
                </div>

                {/* Action button bar */}
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => {
                      setActiveView(link.view);
                      onClose();
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-cyan-300 text-xs font-black flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <span>Launch View Now</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 text-center text-xs text-slate-600 flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-bold text-slate-900">
            <Sparkles className="w-4 h-4 text-amber-500" /> SpoteraDeals Verified Marketplace
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 font-bold text-xs rounded-xl text-white shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};


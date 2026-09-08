import React, { useState } from 'react';
import {
  Bell,
  Calendar,
  Wallet,
  TrendingUp,
  AlertTriangle,
  FileText,
  ChevronRight,
  QrCode,
  LayoutGrid,
  Tag,
  MoreHorizontal,
  Home,
  CheckCircle2,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { VendorQrScanner } from '../components/VendorQrScanner';

export const PartnerDashboard: React.FC = () => {
  const { setActiveView } = useApp();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'bookings' | 'deals' | 'more'>('dashboard');
  const [showScanner, setShowScanner] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Recent bookings matching Screenshot 4
  const [recentBookings, setRecentBookings] = useState([
    {
      id: 'bk_1',
      code: 'SPD-84213',
      title: '2 Kids Entry',
      time: '11:00',
      status: 'Awaiting',
      statusColor: 'bg-[#FFF3E8] text-[#F5820A] border-[#F5820A]/30',
    },
    {
      id: 'bk_2',
      code: 'SPD-84209',
      title: 'Family Pass',
      time: '10:30',
      status: 'Redeemed',
      statusColor: 'bg-[#ECFDF5] text-[#10B981] border-[#10B981]/30',
    },
    {
      id: 'bk_3',
      code: 'SPD-84201',
      title: '2 Kids Entry',
      time: '10:00',
      status: 'Redeemed',
      statusColor: 'bg-[#ECFDF5] text-[#10B981] border-[#10B981]/30',
    },
  ]);

  // Weekly bar chart data
  const weekDays = [
    { day: 'Mon', count: 12, heightPct: 29 },
    { day: 'Tue', count: 18, heightPct: 44 },
    { day: 'Wed', count: 15, heightPct: 36 },
    { day: 'Thu', count: 21, heightPct: 51 },
    { day: 'Fri', count: 34, heightPct: 83 },
    { day: 'Sat', count: 41, heightPct: 100 },
    { day: 'Sun', count: 28, heightPct: 68 },
  ];

  const handleToggleRedeem = (code: string) => {
    setRecentBookings((prev) =>
      prev.map((item) =>
        item.code === code
          ? {
              ...item,
              status: item.status === 'Redeemed' ? 'Awaiting' : 'Redeemed',
              statusColor:
                item.status === 'Redeemed'
                  ? 'bg-[#FFF3E8] text-[#F5820A] border-[#F5820A]/30'
                  : 'bg-[#ECFDF5] text-[#10B981] border-[#10B981]/30',
            }
          : item
      )
    );
    showToast(`Booking ${code} status updated!`, 'success');
  };

  return (
    <div className="min-h-screen bg-[#F7FAFD] text-[#0D1B3E] font-sans pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-6 space-y-5 sm:space-y-6">
        {/* 1. TOP HEADER: Good morning, Venue name, Published pill, Notification bell */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <div className="text-[11px] sm:text-xs font-semibold text-[#8D98AA]">Good morning</div>
            <div className="flex flex-wrap items-center gap-2 mt-0.5">
              <h1 className="text-base sm:text-xl font-bold text-[#0D1B3E] tracking-tight">
                AquaPlay Waterpark — Dubai Marina
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#ECFDF5] border border-[#10B981]/25 text-[10px] sm:text-xs font-bold text-[#10B981]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                Published & Active
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Quick Scan QR button on Desktop */}
            <button
              onClick={() => setShowScanner(true)}
              className="hidden sm:flex px-3.5 py-1.5 rounded-full bg-[#1060E2] text-white text-xs font-bold shadow-xs hover:bg-[#0C4EBD] transition-all items-center gap-1.5 cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Scan QR Pass</span>
            </button>

            {/* Switch to Customer Home button */}
            <button
              onClick={() => setActiveView('home')}
              className="px-3 py-1.5 rounded-full bg-white border border-[#E8EEF5] text-[#1060E2] text-xs font-bold shadow-2xs hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Return to Customer App"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Customer App</span>
            </button>

            {/* Bell */}
            <button
              aria-label="Notifications"
              className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-[#E8EEF5] flex items-center justify-center text-[#0D1B3E] shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2px]" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#EF4444] ring-2 ring-white" />
            </button>
          </div>
        </div>

        {/* 2. METRIC CARDS ROW: 2 cols on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {/* Card 1: Today's Bookings */}
          <div className="bg-white rounded-2xl border border-[#E8EEF5] p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#F0F6FE] text-[#1060E2] flex items-center justify-center">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-[11px] font-bold text-[#10B981] bg-[#ECFDF5] px-2 py-0.5 rounded-md">+22%</span>
            </div>
            <div className="mt-4">
              <div className="text-[11px] sm:text-xs font-semibold text-[#8D98AA]">Today's Bookings</div>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-xl sm:text-2xl font-black text-[#0D1B3E]">18</span>
                <span className="text-xs text-slate-400 font-medium">passes</span>
              </div>
            </div>
          </div>

          {/* Card 2: Revenue Today */}
          <div className="bg-white rounded-2xl border border-[#E8EEF5] p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#F0F6FE] text-[#1060E2] flex items-center justify-center">
                <Wallet className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <TrendingUp className="w-4 h-4 text-[#10B981]" />
            </div>
            <div className="mt-4">
              <div className="text-[11px] sm:text-xs font-semibold text-[#8D98AA]">Revenue Today</div>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-xl sm:text-2xl font-black text-[#0D1B3E]">AED 4,860</span>
              </div>
            </div>
          </div>

          {/* Card 3: Redemptions */}
          <div className="bg-white rounded-2xl border border-[#E8EEF5] p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#ECFDF5] text-[#10B981] flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-[11px] font-bold text-[#1060E2] bg-[#F0F6FE] px-2 py-0.5 rounded-md">83% Rate</span>
            </div>
            <div className="mt-4">
              <div className="text-[11px] sm:text-xs font-semibold text-[#8D98AA]">Checked In</div>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-xl sm:text-2xl font-black text-[#0D1B3E]">15 / 18</span>
              </div>
            </div>
          </div>

          {/* Card 4: Average Order Value */}
          <div className="bg-white rounded-2xl border border-[#E8EEF5] p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#FFF3E8] text-[#F5820A] flex items-center justify-center">
                <Tag className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-[11px] font-bold text-[#F5820A] bg-[#FFF8F0] px-2 py-0.5 rounded-md">Family Pick</span>
            </div>
            <div className="mt-4">
              <div className="text-[11px] sm:text-xs font-semibold text-[#8D98AA]">Avg Ticket Size</div>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-xl sm:text-2xl font-black text-[#0D1B3E]">AED 270</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3 & 4. TWO COLUMN DESKTOP GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          {/* LEFT: This Week Bar Chart & Notice Banner */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5">
            {/* THIS WEEK BAR CHART CARD */}
            <div className="bg-white rounded-2xl border border-[#E8EEF5] p-4 sm:p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs sm:text-sm font-bold text-[#0D1B3E] tracking-tight">This Week Performance</h3>
                <span className="text-[10px] sm:text-xs font-bold text-[#8D98AA]">169 Total Visits</span>
              </div>

              <div className="flex items-end justify-between gap-2 h-36 pt-4 px-2">
                {weekDays.map((item) => (
                  <div key={item.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <span className="text-[10px] sm:text-xs font-bold text-[#0D1B3E]">{item.count}</span>
                    <div
                      style={{ height: `${item.heightPct}%` }}
                      className={`w-full max-w-[32px] rounded-t-lg transition-all ${
                        item.day === 'Sat' ? 'bg-[#1060E2]' : 'bg-[#70A5F9]'
                      }`}
                    />
                    <span className="text-[10px] sm:text-xs font-semibold text-[#8D98AA]">{item.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* NOTICE BANNER: 'Weekend Splash Bundle' expires in 5 days */}
            <div className="bg-[#FFF8F0] rounded-2xl border border-[#FFE7CC] p-3.5 sm:p-4 shadow-2xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#FFF0E0] text-[#F5820A] flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-[#0D1B3E] truncate">
                  'Weekend Splash Bundle' expires in 5 days
                </span>
              </div>

              <button
                onClick={() => setShowReviewModal(true)}
                className="px-3 py-1.5 rounded-xl bg-[#F5820A] hover:bg-[#E07608] text-white text-[11px] sm:text-xs font-bold shrink-0 transition-transform active:scale-95 cursor-pointer shadow-2xs"
              >
                Review deal
              </button>
            </div>
          </div>

          {/* RIGHT: Recent Bookings & Mobile Scan Button */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl border border-[#E8EEF5] p-4 sm:p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#0D1B3E] tracking-tight">Recent Bookings</h3>
                <button
                  onClick={() => showToast('Displaying all 18 venue bookings for today', 'info')}
                  className="text-xs font-bold text-[#1060E2] hover:underline cursor-pointer"
                >
                  View All
                </button>
              </div>

              <div className="space-y-2.5">
                {recentBookings.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => handleToggleRedeem(b.code)}
                    className="bg-slate-50/70 hover:bg-slate-50 rounded-xl border border-[#E8EEF5] p-3 shadow-2xs flex items-center justify-between gap-2 cursor-pointer hover:border-[#1060E2]/30 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#F0F6FE] text-[#1060E2] flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#0D1B3E]">{b.code}</div>
                        <div className="text-[11px] font-medium text-[#8D98AA]">
                          {b.title} · {b.time}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${b.statusColor}`}>
                        {b.status}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Scan QR Action Button */}
            <div className="sm:hidden">
              <button
                onClick={() => setShowScanner(true)}
                className="w-full py-3.5 rounded-2xl bg-[#1060E2] hover:bg-[#0C4EBD] text-white text-sm font-bold flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-md shadow-[#1060E2]/25 cursor-pointer"
              >
                <QrCode className="w-4 h-4" />
                <span>Scan QR Pass</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 7. OWNER DASHBOARD BOTTOM NAVIGATION (Dashboard, Bookings, Deals, More) */}
      <nav
        aria-label="Owner Dashboard Tab Bar"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E8EEF5] py-2 px-3 pb-[max(0.6rem,env(safe-area-inset-bottom,12px))] shadow-[0_-4px_16px_rgba(0,0,0,0.04)] select-none"
      >
        <div className="max-w-md mx-auto flex items-center justify-around">
          {/* Tab 1: Dashboard */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className="flex-1 flex flex-col items-center justify-center py-1 cursor-pointer"
          >
            <LayoutGrid
              className={`w-[22px] h-[22px] transition-colors ${
                activeTab === 'dashboard' ? 'text-[#1060E2] stroke-[2.4px]' : 'text-[#8D98AA] stroke-[1.8px]'
              }`}
            />
            <span
              className={`text-[10px] mt-1 tracking-tight ${
                activeTab === 'dashboard' ? 'font-bold text-[#1060E2]' : 'font-medium text-[#8D98AA]'
              }`}
            >
              Dashboard
            </span>
          </button>

          {/* Tab 2: Bookings */}
          <button
            onClick={() => {
              setActiveTab('bookings');
              showToast('18 venue bookings scheduled for today', 'info');
            }}
            className="flex-1 flex flex-col items-center justify-center py-1 cursor-pointer"
          >
            <Calendar
              className={`w-[22px] h-[22px] transition-colors ${
                activeTab === 'bookings' ? 'text-[#1060E2] stroke-[2.4px]' : 'text-[#8D98AA] stroke-[1.8px]'
              }`}
            />
            <span
              className={`text-[10px] mt-1 tracking-tight ${
                activeTab === 'bookings' ? 'font-bold text-[#1060E2]' : 'font-medium text-[#8D98AA]'
              }`}
            >
              Bookings
            </span>
          </button>

          {/* Tab 3: Deals */}
          <button
            onClick={() => {
              setActiveTab('deals');
              showToast('Managing 3 published venue packages', 'info');
            }}
            className="flex-1 flex flex-col items-center justify-center py-1 cursor-pointer"
          >
            <Tag
              className={`w-[22px] h-[22px] transition-colors ${
                activeTab === 'deals' ? 'text-[#1060E2] stroke-[2.4px]' : 'text-[#8D98AA] stroke-[1.8px]'
              }`}
            />
            <span
              className={`text-[10px] mt-1 tracking-tight ${
                activeTab === 'deals' ? 'font-bold text-[#1060E2]' : 'font-medium text-[#8D98AA]'
              }`}
            >
              Deals
            </span>
          </button>

          {/* Tab 4: More */}
          <button
            onClick={() => {
              setActiveTab('more');
              showToast('Venue Settings & Payouts', 'info');
            }}
            className="flex-1 flex flex-col items-center justify-center py-1 cursor-pointer"
          >
            <MoreHorizontal
              className={`w-[22px] h-[22px] transition-colors ${
                activeTab === 'more' ? 'text-[#1060E2] stroke-[2.4px]' : 'text-[#8D98AA] stroke-[1.8px]'
              }`}
            />
            <span
              className={`text-[10px] mt-1 tracking-tight ${
                activeTab === 'more' ? 'font-bold text-[#1060E2]' : 'font-medium text-[#8D98AA]'
              }`}
            >
              More
            </span>
          </button>
        </div>
      </nav>

      {/* QR SCANNER MODAL */}
      {showScanner && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-[#0D1B3E]">Scan Customer Voucher</h3>
              <button
                onClick={() => setShowScanner(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <VendorQrScanner
              businessName="AquaPlay Waterpark"
              onClose={() => setShowScanner(false)}
              onRedeemedSuccess={() => {
                showToast('Voucher verified and redeemed successfully!', 'success');
                setShowScanner(false);
              }}
            />
          </div>
        </div>
      )}

      {/* REVIEW DEAL MODAL */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-base font-bold text-[#0D1B3E]">Weekend Splash Bundle</h3>
              <button
                onClick={() => setShowReviewModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              This bundle expires in 5 days on 12 Sep 2026. Would you like to extend it for another 30 days or update pricing?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  showToast('Deal extended by 30 days!', 'success');
                  setShowReviewModal(false);
                }}
                className="flex-1 py-3 rounded-2xl bg-[#1060E2] text-white text-xs font-bold"
              >
                Extend Deal
              </button>
              <button
                onClick={() => setShowReviewModal(false)}
                className="px-4 py-3 rounded-2xl bg-slate-100 text-slate-700 text-xs font-bold"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

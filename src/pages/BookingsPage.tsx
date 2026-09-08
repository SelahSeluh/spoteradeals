import React, { useState, useMemo, useCallback } from 'react';
import { Calendar, QrCode, ArrowLeft, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';

export const BookingsPage: React.FC = () => {
  const { bookings, deals, cancelBooking, setActiveView, setSelectedBookingId } = useApp();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');

  const tabs: { label: string; value: 'upcoming' | 'completed' | 'cancelled' }[] = [
    { label: 'Upcoming', value: 'upcoming' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' },
  ];

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      if (activeTab === 'upcoming') return booking.status === 'confirmed';
      return booking.status === activeTab;
    });
  }, [activeTab, bookings]);

  const getDeal = useCallback(
    (dealId: string) => {
      return deals.find((d) => d.id === dealId) || deals[0];
    },
    [deals]
  );

  const handleCancel = (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      cancelBooking(bookingId);
      showToast('Booking cancelled successfully', 'info');
    }
  };

  const handleViewQr = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setActiveView('booking-confirm');
  };

  return (
    <div className="min-h-screen bg-[#F0F5FB] pb-28 pt-4 px-4 sm:px-6">
      <div className="max-w-xl mx-auto flex flex-col gap-4">
        {/* Page Header */}
        <div className="flex items-center justify-between min-h-[46px]">
          <button
            onClick={() => setActiveView('profile')}
            aria-label="Go back to profile"
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#0D1B3E] shadow-xs border border-[#E7EBF2] hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold text-[#0D1B3E] tracking-tight">My Bookings</h1>
          <div className="w-10" />
        </div>

        {/* Tab Pills */}
        <div className="flex p-1 rounded-[14px] bg-white border border-[#E7EBF2] shadow-xs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`flex-1 py-2 rounded-[10px] text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#1A4FBF] text-white shadow-xs'
                    : 'text-[#5F6B82] hover:text-[#0D1B3E]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Bookings List */}
        {filteredBookings.length > 0 ? (
          <div className="flex flex-col gap-3.5">
            {filteredBookings.map((booking) => {
              const deal = getDeal(booking.dealId);
              return (
                <div
                  key={booking.id}
                  className="bg-white rounded-[18px] border border-[#E7EBF2] p-4 shadow-xs flex flex-col gap-3.5 transition-shadow hover:shadow-md"
                >
                  {/* Top: Image + Info */}
                  <div className="flex items-start gap-3.5">
                    <img
                      src={deal?.imageUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'}
                      alt={deal?.title || booking.dealTitle}
                      className="w-[72px] h-[72px] rounded-[14px] object-cover shrink-0 border border-slate-100"
                      loading="lazy"
                    />
                    <div className="flex-1 min-w-0">
                      <h2 className="text-sm font-bold text-[#0D1B3E] line-clamp-2 leading-tight">
                        {booking.dealTitle}
                      </h2>
                      <p className="text-[11px] text-[#5F6B82] mt-1">
                        {booking.date} · {booking.childrenCount || 1}{' '}
                        {(booking.childrenCount || 1) === 1 ? 'ticket' : 'tickets'}
                      </p>
                      <div className="flex items-center gap-1.5 mt-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            booking.status === 'confirmed'
                              ? 'bg-[#10B981]'
                              : booking.status === 'completed'
                              ? 'bg-[#F5820A]'
                              : 'bg-[#94A3B8]'
                          }`}
                        />
                        <span className="text-[11px] font-semibold capitalize text-[#0D1B3E]">
                          {booking.status === 'confirmed' ? 'Confirmed' : booking.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-[#F0F5FB]" />

                  {/* Bottom: Ref & Actions */}
                  <div className="flex items-center justify-between pt-0.5">
                    <span className="text-xs font-mono font-semibold text-[#5F6B82]">
                      Ref: {(booking.bookingCode || booking.id).slice(-8).toUpperCase()}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewQr(booking.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EBF2FF] text-[#1A4FBF] text-xs font-bold hover:bg-[#DCE7FC] transition-colors cursor-pointer"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>View QR</span>
                      </button>

                      {activeTab === 'upcoming' && (
                        <button
                          onClick={() => handleCancel(booking.id)}
                          className="px-2.5 py-1.5 rounded-full text-xs font-semibold text-[#EF4444] hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-[22px] border border-[#E7EBF2] p-8 text-center flex flex-col items-center justify-center gap-3 shadow-xs mt-4">
            <div className="w-14 h-14 rounded-2xl bg-[#EBF2FF] text-[#1A4FBF] flex items-center justify-center">
              <Calendar className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-[#0D1B3E] capitalize">
              No {activeTab} bookings
            </h3>
            <p className="text-xs text-[#5F6B82] max-w-xs leading-relaxed">
              {activeTab === 'upcoming'
                ? 'Book a family experience and it will appear here with your redemption QR.'
                : 'Your booking history will appear here once you start exploring UAE experiences.'}
            </p>
            <button
              onClick={() => setActiveView('explore')}
              className="mt-2 px-5 py-2.5 rounded-full bg-[#1A4FBF] text-white text-xs font-bold hover:bg-[#153FA0] transition-colors cursor-pointer"
            >
              Explore deals
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

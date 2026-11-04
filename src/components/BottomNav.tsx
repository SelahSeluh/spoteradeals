import {useDesignText} from './DesignPrimitives';
import React from 'react';
import { Home, Compass, Ticket, Heart, User, Users, Gift,Wallet } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BottomNav: React.FC = () => {
  const { activeView, setActiveView, user, isGuest, bookings, t } = useApp();

  const d=useDesignText();
  // Hide on deal-detail, bookings-confirm, partners and admin
  if (
    activeView === 'auth' ||
    activeView === 'partners' ||
    activeView === 'admin'
  ) {
    return null;
  }

  const savedCount = user?.savedDealIds ? user.savedDealIds.length : 0;
  const bookingsCount = bookings?.length || 0;

  const tabs = [
    {
      id: 'home',
      label: d('home'),
      icon: Home,
      isActive: activeView === 'home',
      onClick: () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setActiveView('home');
      },
    },
    {
      id: 'explore',
      label: d('explore'),
      icon: Compass,
      isActive: activeView === 'explore' || activeView === 'categories' || activeView === 'search',
      onClick: () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setActiveView('explore');
      },
    },
    {
      id: 'bookings',
      label: d('passes'),
      icon: Ticket,
      badge: bookingsCount > 0 ? bookingsCount : undefined,
      isActive: activeView === 'family' || activeView === 'bookings',
      onClick: () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setActiveView('bookings');
      },
    },
    {
      id: 'rewards',
      label: d('wallet'),
      icon: Wallet,
      badge: savedCount > 0 ? savedCount : undefined,
      isActive: activeView === 'rewards',
      onClick: () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setActiveView('rewards');
      },
    },
    {
      id: 'profile',
      label: d('profile'),
      icon: User,
      isActive: activeView === 'profile' || activeView === 'settings' || activeView === 'membership',
      onClick: () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setActiveView('profile');
      },
    },
  ];

  return (
    <nav
      aria-label="Spotera Tab Bar"
      data-testid="tab-bar"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 py-2 px-1 sm:px-3 pb-[max(0.6rem,env(safe-area-inset-bottom,12px))] shadow-[0_-4px_16px_rgba(0,0,0,0.06)] select-none"
    >
      <div className="max-w-md mx-auto grid grid-cols-5 items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = tab.isActive;

          return (
            <button
              key={tab.id}
              onClick={tab.onClick}
              aria-label={tab.label}
              aria-current={active ? 'page' : undefined}
              className="min-w-0 flex flex-col items-center justify-center py-1 px-0.5 cursor-pointer transition-transform active:scale-95 group"
            >
              <div className="relative">
                <Icon
                  className={`w-[22px] h-[22px] transition-colors ${
                    active ? 'text-[#ff7900] stroke-[2.4px]' : 'text-slate-400 stroke-[1.8px] group-hover:text-slate-600'
                  }`}
                />

                {Boolean(tab.badge && tab.badge > 0) && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-[16px] px-1 rounded-full bg-[#FF7417] text-white text-[9px] font-black flex items-center justify-center ring-2 ring-white">
                    {tab.badge}
                  </span>
                )}
              </div>

              <span
                className={`text-[9px] min-[375px]:text-[10px] mt-1 font-bold tracking-tight text-center leading-tight transition-colors ${
                  active ? 'text-[#ff7900]' : 'text-slate-500 group-hover:text-slate-700'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

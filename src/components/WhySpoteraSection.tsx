import React from 'react';
import {
  Tag,
  ShieldCheck,
  Ticket,
  HeartHandshake,
  Gift,
} from 'lucide-react';

export const WhySpoteraSection: React.FC = () => {
  const valueProps = [
    {
      id: 'prices',
      title: 'Best Prices',
      subtitle: 'Guaranteed',
      icon: Tag,
      iconColor: 'text-[#FD9302]',
      bgColor: 'bg-orange-50',
    },
    {
      id: 'trusted',
      title: 'Trusted',
      subtitle: 'Partners',
      icon: ShieldCheck,
      iconColor: 'text-[#0D9CFD]',
      bgColor: 'bg-blue-50',
    },
    {
      id: 'booking',
      title: 'Easy',
      subtitle: 'Booking',
      icon: Ticket,
      iconColor: 'text-[#FD9302]',
      bgColor: 'bg-orange-50',
    },
    {
      id: 'family',
      title: 'Family',
      subtitle: 'Friendly',
      icon: HeartHandshake,
      iconColor: 'text-[#0D9CFD]',
      bgColor: 'bg-blue-50',
    },
    {
      id: 'rewards',
      title: 'Earn',
      subtitle: 'Rewards',
      icon: Gift,
      iconColor: 'text-[#FD9302]',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="w-full bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-3 sm:p-4 shadow-xs select-none">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
        {valueProps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={`flex items-center gap-3 p-2 sm:px-3 ${
                idx === 4 ? 'col-span-2 sm:col-span-1 justify-center sm:justify-start' : ''
              }`}
            >
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${item.bgColor} flex items-center justify-center shrink-0`}
              >
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${item.iconColor}`} />
              </div>
              <div className="leading-tight">
                <div className="text-xs sm:text-sm font-black text-slate-900">{item.title}</div>
                <div className="text-[10px] sm:text-xs font-semibold text-slate-500">{item.subtitle}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

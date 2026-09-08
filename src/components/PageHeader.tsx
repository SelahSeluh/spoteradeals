import React from 'react';
import { ArrowLeft, Bell } from 'lucide-react';
import { BrandMark } from './BrandMark';

interface PageHeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  showBell?: boolean;
  onBellClick?: () => void;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightAction,
  showBell = false,
  onBellClick,
  className = '',
}) => {
  return (
    <header
      className={`sticky top-0 z-40 bg-[#F5F7FA]/95 backdrop-blur-md px-4 py-3 sm:px-6 transition-all ${className}`}
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between min-h-[44px]">
        {/* Left Side: Back button and/or Title / Brand */}
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={onBack}
              aria-label="Go Back"
              className="w-9 h-9 rounded-full bg-white border border-[#E7EBF2] shadow-xs flex items-center justify-center text-[#0D1B3E] hover:bg-[#E9F0FF] hover:text-[#1A4FBF] active:scale-95 transition-all cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <div>
            {title ? (
              <h1 className="text-[20px] font-bold text-[#0D1B3E] tracking-tight leading-tight">
                {title}
              </h1>
            ) : (
              <BrandMark />
            )}
            {subtitle && (
              <p className="text-[13px] text-[#5F6B82] font-medium leading-normal mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {rightAction}

          {showBell && (
            <button
              onClick={onBellClick}
              aria-label="Notifications"
              className="relative w-10 h-10 rounded-full bg-white border border-[#E7EBF2] shadow-xs flex items-center justify-center text-[#0D1B3E] hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Bell className="w-5 h-5 text-[#0D1B3E]" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#F5820A] rounded-full ring-2 ring-white" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

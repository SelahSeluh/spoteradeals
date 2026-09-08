import React from 'react';
import { Heart, Compass, Search, Ticket } from 'lucide-react';

interface EmptyStateProps {
  icon?: 'heart' | 'compass' | 'search' | 'ticket';
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'heart',
  title,
  description,
  actionText,
  onAction,
  className = '',
}) => {
  const renderIcon = () => {
    switch (icon) {
      case 'compass':
        return <Compass className="w-9 h-9 text-[#1A4FBF]" />;
      case 'search':
        return <Search className="w-9 h-9 text-[#1A4FBF]" />;
      case 'ticket':
        return <Ticket className="w-9 h-9 text-[#1A4FBF]" />;
      case 'heart':
      default:
        return <Heart className="w-9 h-9 text-[#1A4FBF]" />;
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center text-center px-7 py-12 select-none ${className}`}
    >
      <div className="w-[76px] h-[76px] rounded-[26px] bg-[#E9F0FF] flex items-center justify-center mb-[18px] shadow-xs">
        {renderIcon()}
      </div>
      <h3 className="text-[20px] font-bold text-[#0D1B3E] mb-2 tracking-tight">
        {title}
      </h3>
      <p className="text-[14px] text-[#5F6B82] leading-[21px] max-w-[300px] mb-[22px]">
        {description}
      </p>
      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="min-h-[46px] px-6 rounded-full bg-[#F5820A] hover:bg-[#e07505] active:scale-95 text-white font-bold text-[14px] flex items-center justify-center shadow-[0_4px_12px_rgba(245,130,10,0.3)] transition-all cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

import React from 'react';

interface SectionHeadingProps {
  title: string;
  action?: string;
  onAction?: () => void;
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  action = 'View all',
  onAction,
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-between min-h-[44px] ${className}`}>
      <h2 className="text-[18px] font-bold text-[#0D1B3E] tracking-tight">{title}</h2>
      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="flex items-center gap-1 min-h-[44px] text-xs font-bold text-[#1A4FBF] hover:opacity-80 active:scale-95 transition-all cursor-pointer"
        >
          <span>{action}</span>
          <span className="text-[#F5820A] text-lg font-bold leading-none">›</span>
        </button>
      )}
    </div>
  );
};

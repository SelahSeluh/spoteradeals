import React from 'react';

interface BrandMarkProps {
  className?: string;
  onClick?: () => void;
}

export const BrandMark: React.FC<BrandMarkProps> = ({ className = '', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`inline-flex items-baseline select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
      aria-label="SpoteraDeals"
    >
      <span className="text-[#1A4FBF] font-bold text-[23px] tracking-[-1.2px] lowercase leading-none">
        spotera
      </span>
      <span className="text-[#F5820A] font-bold text-[18px] ml-1 tracking-[-0.8px] lowercase leading-none">
        deals
      </span>
    </div>
  );
};

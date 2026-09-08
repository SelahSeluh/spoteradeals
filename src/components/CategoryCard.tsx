import React from 'react';
import { Compass } from 'lucide-react';

export interface CategoryInfo {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  imageUrl?: string;
  dealCount?: number;
}

interface CategoryCardProps {
  category: CategoryInfo;
  compact?: boolean;
  onPress?: () => void;
  className?: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  compact = false,
  onPress,
  className = '',
}) => {
  const defaultBg = category.color || '#1A4FBF';
  const defaultImg =
    category.imageUrl ||
    'https://images.unsplash.com/photo-1511882150382-421056c89033?auto=format&fit=crop&q=80&w=600';

  return (
    <div
      onClick={onPress}
      className={`rounded-2xl overflow-hidden bg-white shadow-[0_2px_10px_rgba(13,27,62,0.06)] border border-[#E7EBF2] hover:border-[#0C5CAB] transition-all cursor-pointer group select-none ${
        compact ? 'w-[124px] shrink-0' : 'w-full'
      } ${className}`}
    >
      <div className="h-[84px] relative bg-[#E9F0FF] overflow-hidden">
        <img
          src={defaultImg}
          alt={category.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            const target = e.currentTarget;
            if (!target.src.includes('photo-1511882150382')) {
              target.src =
                'https://images.unsplash.com/photo-1511882150382-421056c89033?auto=format&fit=crop&q=80&w=600';
            }
          }}
        />
        <div
          className="absolute left-[9px] bottom-[8px] w-[26px] h-[26px] rounded-lg flex items-center justify-center text-white shadow-xs"
          style={{ backgroundColor: defaultBg }}
        >
          <Compass className="w-3.5 h-3.5 text-white" />
        </div>
      </div>
      <div className="p-2.5">
        <h4 className="text-[12px] font-bold text-[#0D1B3E] line-clamp-1 group-hover:text-[#0C5CAB] transition-colors">
          {category.name}
        </h4>
        <p className="text-[10px] text-[#5F6B82] mt-0.5">
          {category.dealCount || 12} deals
        </p>
      </div>
    </div>
  );
};


import React from 'react';
import { Clock, X, Trash2, Sparkles, ArrowUpRight } from 'lucide-react';
import { SearchHistoryItem } from '../types';

interface SearchHistoryDropdownProps {
  history: SearchHistoryItem[];
  onSelectSearch: (query: string) => void;
  onRemoveSearch: (id: string) => void;
  onClearAll: () => void;
  popularSearches?: string[];
  isOpen: boolean;
  onClose?: () => void;
  className?: string;
  isRtl?: boolean;
}

const DEFAULT_POPULAR = [
  'Kids Play Areas Dubai',
  'AquaPlay Splash Pass',
  'Cheeky Monkeys Birthday',
  'Waterparks Abu Dhabi',
  'Family Brunch Offers',
  'Soft Play Sharjah',
];

export const SearchHistoryDropdown: React.FC<SearchHistoryDropdownProps> = ({
  history,
  onSelectSearch,
  onRemoveSearch,
  onClearAll,
  popularSearches = DEFAULT_POPULAR,
  isOpen,
  className = '',
  isRtl = false,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="spotera-search-history-dropdown"
      className={`absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-200/90 z-50 overflow-hidden transition-all duration-200 ${className}`}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Recent Searches Section */}
      {history.length > 0 ? (
        <div className="p-3 border-b border-slate-100">
          <div className="flex items-center justify-between px-2 pb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{isRtl ? 'عمليات البحث الأخيرة' : 'Recent Searches'}</span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClearAll();
              }}
              className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              <span>{isRtl ? 'مسح الكل' : 'Clear All'}</span>
            </button>
          </div>

          <div className="flex flex-col gap-0.5">
            {history.map((item) => (
              <div
                key={item.id}
                className="group flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
                onClick={() => onSelectSearch(item.query)}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0D9CFD] shrink-0" />
                  <span className="text-xs sm:text-sm font-medium text-slate-800 truncate">
                    {item.query}
                  </span>
                </div>
                <button
                  type="button"
                  aria-label={`Remove ${item.query} from history`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onRemoveSearch(item.id);
                  }}
                  className="p-1 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 opacity-70 group-hover:opacity-100 transition-opacity ml-2 shrink-0 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Popular Trending Suggestions Section */}
      <div className="p-3 bg-slate-50/70">
        <div className="flex items-center gap-1.5 px-2 pb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>{isRtl ? 'الأكثر بحثاً في الإمارات' : 'Trending in UAE'}</span>
        </div>
        <div className="flex flex-wrap gap-1.5 px-1 pt-1">
          {popularSearches.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => onSelectSearch(tag)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] sm:text-xs font-medium bg-white text-slate-700 border border-slate-200/80 hover:border-[#0D9CFD] hover:text-[#0D9CFD] hover:bg-blue-50/40 transition-all cursor-pointer shadow-2xs"
            >
              <span>{tag}</span>
              <ArrowUpRight className="w-3 h-3 text-slate-400" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

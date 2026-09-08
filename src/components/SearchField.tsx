import React, { useState, useRef, useEffect } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { SearchHistoryDropdown } from './SearchHistoryDropdown';
import { useSearchHistory } from '../hooks/useSearchHistory';
import { useApp } from '../context/AppContext';

interface SearchFieldProps {
  value: string;
  placeholder?: string;
  onChangeText?: (text: string) => void;
  onSubmit?: () => void;
  onPress?: () => void;
  className?: string;
  showHistory?: boolean;
}

export const SearchField: React.FC<SearchFieldProps> = ({
  value,
  placeholder = 'What are you looking for?',
  onChangeText,
  onSubmit,
  onPress,
  className = '',
  showHistory = true,
}) => {
  const { user, isRtl } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { history, addSearch, removeSearch, clearAll } = useSearchHistory(user?.id);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (value.trim()) addSearch(value.trim());
      setIsOpen(false);
      onSubmit?.();
    }
  };

  const handleSelectQuery = (q: string) => {
    onChangeText?.(q);
    addSearch(q);
    setIsOpen(false);
    onSubmit?.();
  };

  return (
    <div ref={containerRef} className={`relative ${className}`} dir={isRtl ? 'rtl' : 'ltr'}>
      <div
        onClick={onPress}
        className="min-h-[52px] h-[52px] bg-white rounded-[18px] px-4 flex items-center gap-2.5 border border-[#E7EBF2] shadow-[0_2px_8px_rgba(16,43,100,0.04)] overflow-hidden transition-all focus-within:border-[#0D9CFD] focus-within:ring-2 focus-within:ring-[#0D9CFD]/20"
      >
        <Search className="w-5 h-5 text-[#8D98AA] shrink-0" />
        <input
          type="text"
          value={value}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => onChangeText?.(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label={placeholder}
          className="flex-1 bg-transparent text-[13px] font-medium text-[#0D1B3E] placeholder-[#8D98AA] outline-hidden py-3"
        />
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (value.trim()) addSearch(value.trim());
            setIsOpen(false);
            onSubmit?.();
          }}
          aria-label="Search"
          className="h-[40px] w-[40px] rounded-xl bg-[#F5820A] hover:bg-[#e07505] active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer shrink-0"
        >
          <ArrowRight className="w-4 h-4 text-white rtl:rotate-180" />
        </button>
      </div>

      {showHistory && (
        <SearchHistoryDropdown
          isOpen={isOpen}
          history={history}
          onSelectSearch={handleSelectQuery}
          onRemoveSearch={removeSearch}
          onClearAll={clearAll}
          isRtl={isRtl}
        />
      )}
    </div>
  );
};


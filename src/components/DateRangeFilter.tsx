import React, { useState } from 'react';
import { Calendar, Sparkles, X, ChevronDown, Check, SunMedium } from 'lucide-react';
import { UaePublicHoliday, DateFilterPreset } from '../types';
import { getUaeWeekendRange } from '../lib/loyaltyAndHolidayDefaults';

interface DateRangeFilterProps {
  startDate: string;
  endDate: string;
  preset: DateFilterPreset;
  selectedHolidayId?: string;
  holidays: UaePublicHoliday[];
  onApplyFilter: (range: {
    startDate: string;
    endDate: string;
    preset: DateFilterPreset;
    selectedHolidayId?: string;
  }) => void;
  onClearFilter: () => void;
  resultsCount?: number;
}

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  startDate,
  endDate,
  preset,
  selectedHolidayId,
  holidays,
  onApplyFilter,
  onClearFilter,
  resultsCount,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showHolidayDropdown, setShowHolidayDropdown] = useState(false);
  const [customStart, setCustomStart] = useState(startDate);
  const [customEnd, setCustomEnd] = useState(endDate);

  const thisWeekend = getUaeWeekendRange(0);
  const nextWeekend = getUaeWeekendRange(1);

  const isFilterActive = preset !== 'all' || Boolean(startDate || endDate);

  const selectedHoliday = holidays.find((h) => h.id === selectedHolidayId);

  const handleSelectPreset = (p: DateFilterPreset) => {
    setShowHolidayDropdown(false);
    if (p === 'all') {
      onClearFilter();
      setIsExpanded(false);
    } else if (p === 'this_weekend') {
      onApplyFilter({
        startDate: thisWeekend.startDate,
        endDate: thisWeekend.endDate,
        preset: 'this_weekend',
      });
      setCustomStart(thisWeekend.startDate);
      setCustomEnd(thisWeekend.endDate);
    } else if (p === 'next_weekend') {
      onApplyFilter({
        startDate: nextWeekend.startDate,
        endDate: nextWeekend.endDate,
        preset: 'next_weekend',
      });
      setCustomStart(nextWeekend.startDate);
      setCustomEnd(nextWeekend.endDate);
    } else if (p === 'custom') {
      setIsExpanded(true);
    }
  };

  const handleSelectHoliday = (holiday: UaePublicHoliday) => {
    setShowHolidayDropdown(false);
    onApplyFilter({
      startDate: holiday.startDate,
      endDate: holiday.endDate,
      preset: 'holiday',
      selectedHolidayId: holiday.id,
    });
    setCustomStart(holiday.startDate);
    setCustomEnd(holiday.endDate);
  };

  const handleApplyCustomDates = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customStart && !customEnd) return;
    onApplyFilter({
      startDate: customStart,
      endDate: customEnd || customStart,
      preset: 'custom',
    });
    setIsExpanded(false);
  };

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-[#E7EBF2] shadow-xs p-3 sm:p-4 transition-all">
      {/* Top Presets Row */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap flex-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mr-1">
            <Calendar className="w-3.5 h-3.5 text-[#1A4FBF]" />
            <span className="hidden sm:inline">Dates:</span>
          </span>

          {/* Any Date / All */}
          <button
            type="button"
            onClick={() => handleSelectPreset('all')}
            className={`min-h-[34px] px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              preset === 'all' && !startDate
                ? 'bg-[#1A4FBF] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Anytime
          </button>

          {/* This Weekend */}
          <button
            type="button"
            onClick={() => handleSelectPreset('this_weekend')}
            className={`min-h-[34px] px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              preset === 'this_weekend'
                ? 'bg-[#F5820A] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <SunMedium className="w-3.5 h-3.5" />
            <span>This Weekend</span>
            <span className="text-[10px] opacity-80 hidden md:inline">
              ({formatDateDisplay(thisWeekend.startDate)} - {formatDateDisplay(thisWeekend.endDate)})
            </span>
          </button>

          {/* Next Weekend */}
          <button
            type="button"
            onClick={() => handleSelectPreset('next_weekend')}
            className={`min-h-[34px] px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              preset === 'next_weekend'
                ? 'bg-[#F5820A] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>Next Weekend</span>
            <span className="text-[10px] opacity-80 hidden md:inline">
              ({formatDateDisplay(nextWeekend.startDate)} - {formatDateDisplay(nextWeekend.endDate)})
            </span>
          </button>

          {/* UAE Public Holidays Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowHolidayDropdown(!showHolidayDropdown)}
              className={`min-h-[34px] px-3.5 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                preset === 'holiday'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {selectedHoliday ? selectedHoliday.name.split('(')[0].trim() : 'UAE Public Holidays'}
              </span>
              <ChevronDown className="w-3 h-3 ml-0.5" />
            </button>

            {showHolidayDropdown && (
              <div className="absolute top-full left-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-30 animate-in fade-in zoom-in-95">
                <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 flex items-center justify-between">
                  <span>Select UAE Holiday Period</span>
                  <span className="text-emerald-600">2026 / 2027</span>
                </div>
                <div className="max-h-60 overflow-y-auto space-y-1 p-1">
                  {holidays.map((h) => {
                    const isSelected = selectedHolidayId === h.id;
                    return (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => handleSelectHoliday(h)}
                        className={`w-full text-left p-2.5 rounded-xl text-xs transition-colors flex items-start justify-between ${
                          isSelected ? 'bg-emerald-50 text-emerald-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div>
                          <div className="font-bold flex items-center gap-1.5">
                            <span>{h.name}</span>
                            {h.isOfficial && (
                              <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full font-bold">
                                Official
                              </span>
                            )}
                          </div>
                          {h.nameAr && <div className="text-[11px] text-slate-400">{h.nameAr}</div>}
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {formatDateDisplay(h.startDate)} – {formatDateDisplay(h.endDate)}
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Custom Date Range Toggle */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className={`min-h-[34px] px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              preset === 'custom' || isExpanded
                ? 'bg-[#1A4FBF] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Custom Range</span>
          </button>
        </div>

        {/* Clear Filter button if active */}
        {isFilterActive && (
          <button
            type="button"
            onClick={onClearFilter}
            className="text-xs text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1 px-2.5 py-1 rounded-full hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
            title="Reset date filter"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear Dates</span>
          </button>
        )}
      </div>

      {/* Expandable Custom Date Range Selector */}
      {isExpanded && (
        <form
          onSubmit={handleApplyCustomDates}
          className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 items-end animate-in fade-in slide-in-from-top-2"
        >
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
              Start Date
            </label>
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1A4FBF] min-h-[38px]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
              End Date
            </label>
            <input
              type="date"
              value={customEnd}
              min={customStart}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1A4FBF] min-h-[38px]"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="flex-1 bg-[#1A4FBF] hover:bg-blue-800 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-xs transition-colors cursor-pointer min-h-[38px] flex items-center justify-center gap-1.5"
            >
              <span>Apply Dates</span>
            </button>
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 bg-slate-100 rounded-xl cursor-pointer min-h-[38px]"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Active Range Pill Display */}
      {isFilterActive && (
        <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Filtering deals available:</span>
            <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
              {startDate ? formatDateDisplay(startDate) : 'Any'}
              {endDate && endDate !== startDate ? ` – ${formatDateDisplay(endDate)}` : ''}
              {preset === 'this_weekend' ? ' (This Weekend)' : preset === 'next_weekend' ? ' (Next Weekend)' : selectedHoliday ? ` (${selectedHoliday.name})` : ''}
            </span>
          </div>

          {typeof resultsCount === 'number' && (
            <span className="text-[11px] font-bold text-[#1A4FBF]">
              {resultsCount} experience{resultsCount !== 1 ? 's' : ''} available
            </span>
          )}
        </div>
      )}
    </div>
  );
};

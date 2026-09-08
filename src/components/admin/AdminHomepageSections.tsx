import React from 'react';
import {
  Layers,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Sparkles,
  LayoutGrid,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { HomepageSection } from '../../types';

export const AdminHomepageSections: React.FC = () => {
  const { homepageConfig, reorderHomepageSections, toggleHomepageSection } = useApp();
  const { showToast } = useToast();

  const sections: HomepageSection[] = (
    homepageConfig.sections || [
      { id: 'hero', title: 'Hero Slideshow', enabled: true, order: 1 },
      { id: 'categories', title: 'Categories Quick Filter', enabled: true, order: 2 },
      { id: 'trending', title: 'Trending UAE Deals', subtitle: 'Popular limited-time offers with instant pass activation', enabled: true, order: 3 },
      { id: 'near-you', title: 'Deals Near You', subtitle: 'Discounts in your selected UAE Emirate & city area', enabled: true, order: 4 },
      { id: 'all-deals', title: 'All UAE Deals & Passes', subtitle: 'Complete catalog of verified experiences', enabled: true, order: 5 },
      { id: 'guest-cta', title: 'Guest Member CTA Banner', enabled: true, order: 6 },
    ]
  ).sort((a, b) => a.order - b.order);

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const list = [...sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    const reordered = list.map((item, idx) => ({ ...item, order: idx + 1 }));
    reorderHomepageSections(reordered);
    showToast('Homepage layout order saved.', 'info');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <LayoutGrid className="w-5 h-5 text-[#0D9CFD]" />
          <span>Homepage Sections & Layout Builder</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Toggle visibility and reorder the content sections displayed on the public landing page.
        </p>
      </div>

      <div className="space-y-3">
        {sections.map((sec, index) => (
          <div
            key={sec.id}
            className={`bg-white border rounded-2xl p-4 transition-all flex items-center justify-between gap-4 ${
              sec.enabled ? 'border-slate-200 shadow-xs' : 'border-slate-200 opacity-60 bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0D9CFD] flex items-center justify-center font-bold text-xs shrink-0">
                #{sec.order}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">{sec.title}</h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      sec.enabled ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {sec.enabled ? 'Visible' : 'Hidden'}
                  </span>
                </div>
                {sec.subtitle && (
                  <p className="text-xs text-slate-500 mt-0.5">{sec.subtitle}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
                <button
                  onClick={() => moveSection(index, 'up')}
                  disabled={index === 0}
                  className="p-1.5 text-slate-600 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
                  title="Move Up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => moveSection(index, 'down')}
                  disabled={index === sections.length - 1}
                  className="p-1.5 text-slate-600 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
                  title="Move Down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={() => {
                  toggleHomepageSection(sec.id);
                  showToast(sec.enabled ? 'Section hidden from homepage.' : 'Section visible on homepage.', 'info');
                }}
                className={`p-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  sec.enabled
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    : 'bg-slate-100 border-slate-200 text-slate-500'
                }`}
                title={sec.enabled ? 'Hide Section' : 'Show Section'}
              >
                {sec.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

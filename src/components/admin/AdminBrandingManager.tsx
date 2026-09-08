import React, { useState } from 'react';
import {
  Sparkles,
  Save,
  Check,
  ShieldCheck,
  Building,
  Mail,
  Phone,
  Coins,
  Paintbrush,
  Image,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { SiteBrandingConfig } from '../../types';

export const AdminBrandingManager: React.FC = () => {
  const { brandingConfig, updateBrandingConfig, footerConfig, updateFooterConfig } = useApp();
  const { showToast } = useToast();

  const [formData, setFormData] = useState<SiteBrandingConfig>(brandingConfig);
  const [footerData, setFooterData] = useState(footerConfig);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateBrandingConfig(formData);
    updateFooterConfig(footerData);
    showToast('Branding & global site settings updated successfully!', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Paintbrush className="w-5 h-5 text-[#0D9CFD]" />
          <span>Site Branding & Identity Settings</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure site name, logo overrides, UAE marketplace contact details, and brand colors.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Brand Name & Logo */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#0D9CFD]" />
            <span>Brand Identity</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Application / Brand Name</label>
              <input
                type="text"
                required
                value={formData.siteName}
                onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#0D9CFD]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Site Tagline</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#0D9CFD]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Custom Logo Image URL (Optional)</label>
            <input
              type="url"
              value={formData.customLogoUrl || ''}
              onChange={(e) => setFormData({ ...formData, customLogoUrl: e.target.value })}
              placeholder="Leave empty to use official SpoteraDeals SVG mark"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#0D9CFD]"
            />
            <p className="text-[11px] text-slate-400">
              When left blank, the app renders the official SpoteraDeals location pin, smile, and deal tag logo mark.
            </p>
          </div>
        </div>

        {/* Typography & Font Controls */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Paintbrush className="w-4 h-4 text-[#1060E2]" />
              <span>Global Typography & Font Architecture</span>
            </h3>
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Live CSS Variables
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Heading Font Family</label>
              <select
                value={formData.headingFont || 'Plus Jakarta Sans'}
                onChange={(e) => setFormData({ ...formData, headingFont: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#1060E2] cursor-pointer"
              >
                <option value="Plus Jakarta Sans">Plus Jakarta Sans (Modern Geometric, High-End)</option>
                <option value="Outfit">Outfit (Clean Architectural)</option>
                <option value="Poppins">Poppins (Friendly, Round Display)</option>
                <option value="Inter">Inter (Swiss Neutral & Balanced)</option>
                <option value="Montserrat">Montserrat (Bold Classic Geometric)</option>
                <option value="Playfair Display">Playfair Display (Editorial Serif)</option>
                <option value="Cairo">Cairo (Arabic & Latin Native)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Body Font Family</label>
              <select
                value={formData.bodyFont || 'Inter'}
                onChange={(e) => setFormData({ ...formData, bodyFont: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#1060E2] cursor-pointer"
              >
                <option value="Inter">Inter (Optimized for High UI Legibility)</option>
                <option value="Plus Jakarta Sans">Plus Jakarta Sans (Refined Modern)</option>
                <option value="Poppins">Poppins (Soft Friendly)</option>
                <option value="Outfit">Outfit (Crisp Geometric)</option>
                <option value="Cairo">Cairo (RTL & Multi-language)</option>
                <option value="system-ui">System UI Native</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Button / Action Font Family</label>
              <select
                value={formData.buttonFont || 'Plus Jakarta Sans'}
                onChange={(e) => setFormData({ ...formData, buttonFont: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#1060E2] cursor-pointer"
              >
                <option value="Plus Jakarta Sans">Plus Jakarta Sans (Strong Weight)</option>
                <option value="Outfit">Outfit (Punchy & Modern)</option>
                <option value="Poppins">Poppins (Bold Friendly)</option>
                <option value="Inter">Inter (Precise Compact)</option>
                <option value="Montserrat">Montserrat (Display Caps)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Heading Size Base</label>
              <select
                value={formData.headingFontSize || '1rem'}
                onChange={(e) => setFormData({ ...formData, headingFontSize: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#1060E2] cursor-pointer"
              >
                <option value="0.9375rem">Compact (0.9375rem / 15px)</option>
                <option value="1rem">Standard Balanced (1rem / 16px)</option>
                <option value="1.0625rem">Prominent (1.0625rem / 17px)</option>
                <option value="1.125rem">Large Display (1.125rem / 18px)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Body Size Base</label>
              <select
                value={formData.bodyFontSize || '0.9375rem'}
                onChange={(e) => setFormData({ ...formData, bodyFontSize: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#1060E2] cursor-pointer"
              >
                <option value="0.875rem">Compact (0.875rem / 14px)</option>
                <option value="0.9375rem">Standard Modern (0.9375rem / 15px)</option>
                <option value="1rem">Spacious High-Legibility (1rem / 16px)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Button Size Base</label>
              <select
                value={formData.buttonFontSize || '0.875rem'}
                onChange={(e) => setFormData({ ...formData, buttonFontSize: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#1060E2] cursor-pointer"
              >
                <option value="0.8125rem">Small Tight (0.8125rem / 13px)</option>
                <option value="0.875rem">Standard (0.875rem / 14px)</option>
                <option value="0.9375rem">Bold Prominent (0.9375rem / 15px)</option>
              </select>
            </div>
          </div>

          {/* Interactive Live Typography Preview Box */}
          <div className="p-4 bg-gradient-to-br from-slate-50 to-blue-50/40 rounded-xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Real-Time Typography Preview</span>
              <span className="text-[11px] text-slate-400">Heading: {formData.headingFont} • Body: {formData.bodyFont} • Button: {formData.buttonFont}</span>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
              <h4
                className="font-extrabold text-slate-900 leading-tight"
                style={{
                  fontFamily: formData.headingFont || 'Plus Jakarta Sans',
                  fontSize: formData.headingFontSize ? `calc(${formData.headingFontSize} * 1.35)` : '1.35rem',
                }}
              >
                Find Exactly What You Need across Dubai & UAE
              </h4>
              <p
                className="text-slate-600 leading-relaxed"
                style={{
                  fontFamily: formData.bodyFont || 'Inter',
                  fontSize: formData.bodyFontSize || '0.9375rem',
                }}
              >
                Tell us what you need. We connect you with vetted local suppliers, artisans, and exclusive deals from cafés, family play areas, and services.
              </p>
              <div className="pt-1 flex items-center gap-3">
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl text-white font-bold bg-[#1060E2] shadow-xs hover:bg-[#0A43A3] transition-all"
                  style={{
                    fontFamily: formData.buttonFont || 'Plus Jakarta Sans',
                    fontSize: formData.buttonFontSize || '0.875rem',
                  }}
                >
                  Post a Request
                </button>
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl text-[#0D1B3E] font-bold bg-slate-100 hover:bg-slate-200 transition-all"
                  style={{
                    fontFamily: formData.buttonFont || 'Plus Jakarta Sans',
                    fontSize: formData.buttonFontSize || '0.875rem',
                  }}
                >
                  Explore Deals Near Me
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Cover / Hero Media Selection */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Image className="w-4 h-4 text-[#FD9302]" />
            <span>Cover & Hero Media Configuration</span>
          </h3>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Hero Media Mode</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'slideshow', label: 'Image Slideshow', desc: 'Auto-rotating slides' },
                { id: 'single', label: 'Single Cover Image', desc: 'Fixed hero visual' },
                { id: 'video', label: 'Background Video', desc: 'Autoplay MP4 loop' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, heroMediaType: m.id as any })}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    (formData.heroMediaType || 'slideshow') === m.id
                      ? 'border-[#0D9CFD] bg-sky-50 text-[#0C5CAB]'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold">{m.label}</div>
                  <div className="text-[10px] text-slate-500">{m.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {formData.heroMediaType === 'single' && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Single Cover Image URL</label>
              <input
                type="url"
                value={formData.heroSingleImage || ''}
                onChange={(e) => setFormData({ ...formData, heroSingleImage: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#0D9CFD]"
              />
            </div>
          )}

          {formData.heroMediaType === 'video' && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Hero Video URL (MP4 / WebM)</label>
              <input
                type="url"
                value={formData.heroVideoUrl || ''}
                onChange={(e) => setFormData({ ...formData, heroVideoUrl: e.target.value })}
                placeholder="https://assets.mixkit.co/videos/preview/..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#0D9CFD]"
              />
            </div>
          )}
        </div>

        {/* Currency & Colors (Strict UAE compliance) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Coins className="w-4 h-4 text-[#FD9302]" />
            <span>Currency & Color Compliance</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Currency (Locked)</label>
              <input
                type="text"
                disabled
                value="AED (United Arab Emirates Dirham)"
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-600 cursor-not-allowed"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Primary Brand Color</label>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                <div className="w-5 h-5 rounded-md bg-[#0D9CFD] shadow-xs" />
                <span className="text-xs font-mono font-bold text-slate-800">#0D9CFD (Spotera Blue)</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Accent Brand Color</label>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                <div className="w-5 h-5 rounded-md bg-[#FD9302] shadow-xs" />
                <span className="text-xs font-mono font-bold text-slate-800">#FD9302 (Accent Orange)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Support & Contact Details */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#0D9CFD]" />
            <span>UAE Customer Support & Contact Info</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">WhatsApp / Support Phone</label>
              <input
                type="text"
                value={footerData.contactPhone || ''}
                onChange={(e) => setFooterData({ ...footerData, contactPhone: e.target.value })}
                placeholder="+971 50 304 8978"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#0D9CFD]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Support Email</label>
              <input
                type="email"
                value={footerData.contactEmail || ''}
                onChange={(e) => setFooterData({ ...footerData, contactEmail: e.target.value })}
                placeholder="support@spoteradeals.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#0D9CFD]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Copyright Text</label>
            <input
              type="text"
              value={footerData.copyrightText || ''}
              onChange={(e) => setFooterData({ ...footerData, copyrightText: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#0D9CFD]"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 bg-[#0D9CFD] hover:bg-[#0b8de5] text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs cursor-pointer transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Branding & Site Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};

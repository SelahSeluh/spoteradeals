import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Image as ImageIcon,
  Check,
  X,
  Layers,
  Save,
  Video,
  Film,
  Sliders,
  Type,
  Percent,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { HeroSlide, PromoMediaSlot } from '../../types';
import { PromoSlotRenderer } from '../PromoSlotRenderer';

export const AdminHeroManager: React.FC = () => {
  const {
    homepageConfig,
    updateHomepageConfig,
    addHeroSlide,
    editHeroSlide,
    deleteHeroSlide,
    reorderHeroSlides,
    toggleHeroSlide,
  } = useApp();
  const { showToast } = useToast();

  const [activeSubTab, setActiveSubTab] = useState<'promos' | 'slides'>('promos');

  // --- 1. HERO COVER & PROMOTIONAL SLOTS FORM STATE ---
  const [heroCoverData, setHeroCoverData] = useState({
    heroTitle: homepageConfig?.heroTitle || 'More Fun.',
    heroHighlightText: homepageConfig?.heroHighlightText || 'More Together.',
    heroSubtitle:
      homepageConfig?.heroSubtitle ||
      'Amazing deals for every family moment. Discover. Explore. Save More.',
    heroBadgeText: homepageConfig?.heroBadgeText || 'Spotera Deals • UAE Family Verified',
    discountBadgeTextTop: homepageConfig?.discountBadgeTextTop || 'UP TO',
    discountBadgePercent: homepageConfig?.discountBadgePercent || '50%',
    discountBadgeTextBottom: homepageConfig?.discountBadgeTextBottom || 'OFF',
  });

  const [slot1, setSlot1] = useState<PromoMediaSlot>(
    homepageConfig?.promoSlot1 || {
      type: 'image',
      imageUrl:
        'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=85',
      imageAlt: 'SpoteraDeals Happy Family in Dubai',
      slideshowImages: [
        'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=85',
        'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=85',
        'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1200&q=85',
      ],
      slideshowSpeedSeconds: 4,
      videoUrl: '',
    }
  );

  const [slot2, setSlot2] = useState<PromoMediaSlot>(
    homepageConfig?.promoSlot2 || {
      type: 'image',
      imageUrl:
        'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?auto=format&fit=crop&w=600&q=85',
      imageAlt: 'UAE Theme Park Attractions',
      slideshowImages: [
        'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?auto=format&fit=crop&w=600&q=85',
        'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=85',
      ],
      slideshowSpeedSeconds: 4,
      videoUrl: '',
    }
  );

  const [slot3, setSlot3] = useState<PromoMediaSlot>(
    homepageConfig?.promoSlot3 || {
      type: 'image',
      imageUrl:
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=85',
      imageAlt: 'Family Dining UAE',
      slideshowImages: [
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=85',
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=85',
      ],
      slideshowSpeedSeconds: 4,
      videoUrl: '',
    }
  );

  // Preset Collections for Fast 1-Click Selection
  const imagePresets = [
    {
      name: 'Dubai Family Waterpark',
      url: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=85',
    },
    {
      name: 'Rollercoaster & Theme Park',
      url: 'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?auto=format&fit=crop&w=600&q=85',
    },
    {
      name: 'Family Dining / Cafe',
      url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=85',
    },
    {
      name: 'Burj Khalifa Sunset',
      url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=85',
    },
    {
      name: 'Desert Safari Dune Bashing',
      url: 'https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=1200&q=85',
    },
    {
      name: 'Kids Trampoline & Soft Play',
      url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=85',
    },
  ];

  const videoPresets = [
    {
      name: 'Sample Family Fun (MP4)',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    },
    {
      name: 'Sample UAE Scenic Fun (MP4)',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    },
  ];

  const handleSaveCoverAndPromos = () => {
    updateHomepageConfig({
      ...homepageConfig,
      ...heroCoverData,
      promoSlot1: slot1,
      promoSlot2: slot2,
      promoSlot3: slot3,
    });
    showToast.success('Hero cover & 3 promotional slots updated live!');
  };

  // Helper for adding/removing slideshow image URLs
  const addSlideImage = (
    setter: React.Dispatch<React.SetStateAction<PromoMediaSlot>>,
    defaultUrl: string
  ) => {
    setter((prev) => ({
      ...prev,
      slideshowImages: [...(prev.slideshowImages || []), defaultUrl],
    }));
  };

  const removeSlideImage = (
    setter: React.Dispatch<React.SetStateAction<PromoMediaSlot>>,
    indexToRemove: number
  ) => {
    setter((prev) => ({
      ...prev,
      slideshowImages: (prev.slideshowImages || []).filter((_, i) => i !== indexToRemove),
    }));
  };

  const updateSlideImage = (
    setter: React.Dispatch<React.SetStateAction<PromoMediaSlot>>,
    indexToUpdate: number,
    val: string
  ) => {
    setter((prev) => {
      const list = [...(prev.slideshowImages || [])];
      list[indexToUpdate] = val;
      return { ...prev, slideshowImages: list };
    });
  };

  // --- 2. HERO SLIDES MANAGER STATE ---
  const slides: HeroSlide[] = homepageConfig.heroSlides || [];
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const [formData, setFormData] = useState<Omit<HeroSlide, 'id'>>({
    title: '',
    highlightText: '',
    subtitle: '',
    badgeText: 'Spotera Exclusive • UAE Deals',
    imageUrl: '',
    ctaText: 'Explore Deals',
    ctaLink: '#deals',
    targetView: 'explore',
    secondaryCtaText: 'Become VIP Pass Member',
    secondaryTargetView: 'auth',
    enabled: true,
    order: slides.length + 1,
  });

  const handleOpenAdd = () => {
    setFormData({
      title: 'Discover Iconic Dubai Deals &',
      highlightText: 'Family Adventures',
      subtitle: 'Instant discount passes for theme parks, indoor play areas, and top UAE venues.',
      badgeText: 'Spotera Verified • Dubai, UAE',
      imageUrl: imagePresets[0].url,
      ctaText: 'Explore UAE Passes',
      ctaLink: '#explore',
      targetView: 'explore',
      secondaryCtaText: 'Join VIP Family Pass',
      secondaryTargetView: 'auth',
      enabled: true,
      order: slides.length + 1,
    });
    setEditingSlide(null);
    setIsAddingNew(true);
  };

  const handleOpenEdit = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setFormData({
      title: slide.title,
      highlightText: slide.highlightText || '',
      subtitle: slide.subtitle,
      badgeText: slide.badgeText || '',
      imageUrl: slide.imageUrl,
      ctaText: slide.ctaText || 'Explore Deals',
      ctaLink: slide.ctaLink || '',
      targetView: slide.targetView || 'explore',
      secondaryCtaText: slide.secondaryCtaText || '',
      secondaryTargetView: slide.secondaryTargetView || 'auth',
      enabled: slide.enabled,
      order: slide.order,
    });
    setIsAddingNew(false);
  };

  const handleSaveSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.imageUrl) {
      showToast.error('Please provide at least a title and an image URL.');
      return;
    }

    if (editingSlide) {
      editHeroSlide({
        ...editingSlide,
        ...formData,
      });
      showToast.success('Hero slide updated successfully!');
    } else {
      addHeroSlide(formData);
      showToast.success('New hero slide added to homepage!');
    }

    setIsAddingNew(false);
    setEditingSlide(null);
  };

  const moveSlide = (index: number, direction: 'up' | 'down') => {
    const newSlides = [...slides];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSlides.length) return;
    const temp = newSlides[index];
    newSlides[index] = newSlides[targetIndex];
    newSlides[targetIndex] = temp;
    reorderHeroSlides(newSlides);
  };

  // Reusable Promotional Slot Form Control Component
  const renderSlotEditor = (
    title: string,
    slotNumber: 1 | 2 | 3,
    slotState: PromoMediaSlot,
    slotSetter: React.Dispatch<React.SetStateAction<PromoMediaSlot>>,
    frameAspect: string
  ) => {
    return (
      <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-[#0D9CFD] text-white text-[11px] font-black flex items-center justify-center">
                {slotNumber}
              </span>
              <span>{title}</span>
            </h4>
            <p className="text-[11px] text-slate-500">
              Beside &quot;Up to 50% Discount&quot; badge
            </p>
          </div>

          {/* Media Type Segmented Picker (Single Image / Slideshow / Video) */}
          <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
            <button
              type="button"
              onClick={() => slotSetter({ ...slotState, type: 'image' })}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                slotState.type === 'image'
                  ? 'bg-[#0D9CFD] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Image</span>
            </button>

            <button
              type="button"
              onClick={() => slotSetter({ ...slotState, type: 'slideshow' })}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                slotState.type === 'slideshow'
                  ? 'bg-[#FD9302] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Slideshow</span>
            </button>

            <button
              type="button"
              onClick={() => slotSetter({ ...slotState, type: 'video' })}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                slotState.type === 'video'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Video</span>
            </button>
          </div>
        </div>

        {/* Live Mini Preview */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
          <div className="sm:col-span-4 w-full aspect-video sm:aspect-square rounded-xl overflow-hidden border border-slate-300 bg-slate-900 shadow-inner relative">
            <PromoSlotRenderer slot={slotState} className="w-full h-full" />
          </div>

          <div className="sm:col-span-8 space-y-3">
            {/* TYPE: SINGLE IMAGE */}
            {slotState.type === 'image' && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">Image URL</label>
                <input
                  type="url"
                  value={slotState.imageUrl || ''}
                  onChange={(e) => slotSetter({ ...slotState, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-[#0D9CFD]"
                />

                <div className="pt-1">
                  <span className="text-[11px] font-bold text-slate-600 block mb-1">
                    Quick Preset Recommendations:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {imagePresets.map((preset, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => slotSetter({ ...slotState, imageUrl: preset.url })}
                        className="text-[10px] font-semibold bg-white hover:bg-blue-50 text-slate-700 hover:text-[#0D9CFD] px-2 py-1 rounded-md border border-slate-200 transition-colors cursor-pointer"
                      >
                        + {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-1">
                  <label className="block text-[11px] font-bold text-slate-600 mb-0.5">
                    Alt Text (Accessibility)
                  </label>
                  <input
                    type="text"
                    value={slotState.imageAlt || ''}
                    onChange={(e) => slotSetter({ ...slotState, imageAlt: e.target.value })}
                    placeholder="Describe image..."
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-hidden focus:border-[#0D9CFD]"
                  />
                </div>
              </div>
            )}

            {/* TYPE: SLIDESHOW */}
            {slotState.type === 'slideshow' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <label className="text-xs font-bold text-slate-700">
                    Slideshow Cycle Speed
                  </label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min={2}
                      max={15}
                      value={slotState.slideshowSpeedSeconds || 4}
                      onChange={(e) =>
                        slotSetter({
                          ...slotState,
                          slideshowSpeedSeconds: Math.max(2, parseInt(e.target.value, 10) || 4),
                        })
                      }
                      className="w-16 bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs text-center font-bold"
                    />
                    <span className="text-xs text-slate-500">sec</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">Slide Images</label>
                    <button
                      type="button"
                      onClick={() =>
                        addSlideImage(
                          slotSetter,
                          imagePresets[(slotState.slideshowImages?.length || 0) % imagePresets.length].url
                        )
                      }
                      className="text-[11px] font-bold text-[#0D9CFD] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Slide
                    </button>
                  </div>

                  {(slotState.slideshowImages || []).map((imgUrl, imgIdx) => (
                    <div key={imgIdx} className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400 w-4 text-center">
                        {imgIdx + 1}
                      </span>
                      <input
                        type="url"
                        value={imgUrl}
                        onChange={(e) => updateSlideImage(slotSetter, imgIdx, e.target.value)}
                        placeholder="Image URL"
                        className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-hidden focus:border-[#0D9CFD]"
                      />
                      <button
                        type="button"
                        onClick={() => removeSlideImage(slotSetter, imgIdx)}
                        disabled={(slotState.slideshowImages?.length || 0) <= 1}
                        className="p-1.5 text-slate-400 hover:text-rose-600 disabled:opacity-30 cursor-pointer"
                        title="Delete this slide"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TYPE: VIDEO */}
            {slotState.type === 'video' && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  Video URL (Direct MP4, WebM, or YouTube/Vimeo)
                </label>
                <input
                  type="url"
                  value={slotState.videoUrl || ''}
                  onChange={(e) => slotSetter({ ...slotState, videoUrl: e.target.value })}
                  placeholder="https://example.com/family-video.mp4 or YouTube link"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-[#0D9CFD]"
                />

                <div className="pt-1">
                  <span className="text-[11px] font-bold text-slate-600 block mb-1">
                    Sample Test Videos:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {videoPresets.map((vp, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => slotSetter({ ...slotState, videoUrl: vp.url })}
                        className="text-[10px] font-semibold bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-600 px-2 py-1 rounded-md border border-slate-200 transition-colors cursor-pointer"
                      >
                        + {vp.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-1">
                  <label className="block text-[11px] font-bold text-slate-600 mb-0.5">
                    Poster Image (shown before playback)
                  </label>
                  <input
                    type="url"
                    value={slotState.videoPoster || slotState.imageUrl || ''}
                    onChange={(e) => slotSetter({ ...slotState, videoPoster: e.target.value })}
                    placeholder="Poster image URL"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-hidden focus:border-[#0D9CFD]"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#FD9302]" />
            <span>Hero Cover, 50% Promo Slots & Media Manager</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure the 3 media slots beside &quot;Up to 50% Discount&quot;, hero titles, badge, and background slides from both phone and PC.
          </p>
        </div>

        {/* Sub-tab switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveSubTab('promos')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'promos'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cover & 3 Promo Slots
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('slides')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'slides'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Hero Carousel Slides ({slides.length})
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: COVER CONTENT & 3 PROMOTIONAL SLOTS BESIDE 50% DISCOUNT */}
      {/* ========================================================================= */}
      {activeSubTab === 'promos' && (
        <div className="space-y-6">
          {/* 1. COVER CONTENT (Headline, Subtitle, Slogan) */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Type className="w-4 h-4 text-[#0D9CFD]" />
                <span>Hero Cover Content & Headlines</span>
              </h3>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Live App Sync
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Headline Main Text
                </label>
                <input
                  type="text"
                  value={heroCoverData.heroTitle}
                  onChange={(e) =>
                    setHeroCoverData({ ...heroCoverData, heroTitle: e.target.value })
                  }
                  placeholder="e.g. More Fun."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:border-[#0D9CFD]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Headline Highlight Text (Orange Accent)
                </label>
                <input
                  type="text"
                  value={heroCoverData.heroHighlightText}
                  onChange={(e) =>
                    setHeroCoverData({ ...heroCoverData, heroHighlightText: e.target.value })
                  }
                  placeholder="e.g. More Together."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:border-[#FD9302]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">
                Hero Subtitle / Description
              </label>
              <textarea
                rows={2}
                value={heroCoverData.heroSubtitle}
                onChange={(e) =>
                  setHeroCoverData({ ...heroCoverData, heroSubtitle: e.target.value })
                }
                placeholder="Amazing deals for every family moment. Discover. Explore. Save More."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:border-[#0D9CFD]"
              />
            </div>

            {/* Discount Badge Customizer */}
            <div className="pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-2">
                <Percent className="w-3.5 h-3.5 text-[#FD9302]" />
                <span>Playful Discount Badge Text (Floating beside media)</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block mb-1">Top Label</span>
                  <input
                    type="text"
                    value={heroCoverData.discountBadgeTextTop}
                    onChange={(e) =>
                      setHeroCoverData({ ...heroCoverData, discountBadgeTextTop: e.target.value })
                    }
                    placeholder="UP TO"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-center font-bold text-slate-900"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block mb-1">Discount Value</span>
                  <input
                    type="text"
                    value={heroCoverData.discountBadgePercent}
                    onChange={(e) =>
                      setHeroCoverData({ ...heroCoverData, discountBadgePercent: e.target.value })
                    }
                    placeholder="50%"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-center font-bold text-[#FD9302]"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block mb-1">Bottom Label</span>
                  <input
                    type="text"
                    value={heroCoverData.discountBadgeTextBottom}
                    onChange={(e) =>
                      setHeroCoverData({ ...heroCoverData, discountBadgeTextBottom: e.target.value })
                    }
                    placeholder="OFF"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-center font-bold text-slate-900"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. THE THREE PROMOTIONAL SLOTS */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Film className="w-4 h-4 text-[#FD9302]" />
                  <span>The Three Promotional Slots (Image / Slideshow / Video)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Choose Single Image, Multiple-image Slideshow, or Video for each frame.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSaveCoverAndPromos}
                className="py-2.5 px-5 bg-gradient-to-r from-[#0C5CAB] to-[#0D9CFD] hover:from-[#0B5096] hover:to-[#0C8FE8] text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save All Promotional Media</span>
              </button>
            </div>

            {/* Slot 1: Main Scenic Frame */}
            {renderSlotEditor('Slot 1: Main Featured Frame (Large)', 1, slot1, setSlot1, 'aspect-[16/11]')}

            {/* Slot 2: Top-Right Circle Accent */}
            {renderSlotEditor('Slot 2: Top-Right Floating Circle Accent', 2, slot2, setSlot2, 'aspect-square')}

            {/* Slot 3: Bottom-Left Card Accent */}
            {renderSlotEditor('Slot 3: Bottom-Left Rounded Card Accent', 3, slot3, setSlot3, 'aspect-square')}

            {/* Bottom Save Action Button */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleSaveCoverAndPromos}
                className="w-full sm:w-auto py-3 px-6 bg-gradient-to-r from-[#0C5CAB] to-[#0D9CFD] hover:from-[#0B5096] hover:to-[#0C8FE8] active:scale-[0.99] text-white rounded-xl text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Hero Cover & 3 Promotional Slots</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: HERO CAROUSEL BACKGROUND SLIDES */}
      {/* ========================================================================= */}
      {activeSubTab === 'slides' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Hero Carousel Slides</h3>
              <p className="text-xs text-slate-500">
                Additional skyline banners and seasonal campaign banners.
              </p>
            </div>
            {!isAddingNew && !editingSlide && (
              <button
                onClick={handleOpenAdd}
                className="px-4 py-2 bg-[#0D9CFD] hover:bg-[#0C8FE8] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Hero Slide</span>
              </button>
            )}
          </div>

          {/* Add / Edit Slide Form */}
          {(isAddingNew || editingSlide) && (
            <form
              onSubmit={handleSaveSlide}
              className="bg-white border-2 border-[#0D9CFD]/30 p-5 rounded-2xl space-y-4 shadow-sm"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Edit className="w-4 h-4 text-[#0D9CFD]" />
                  <span>{editingSlide ? 'Edit Hero Slide' : 'Create New Hero Slide'}</span>
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingNew(false);
                    setEditingSlide(null);
                  }}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Slide Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-[#0D9CFD]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Highlight Text (Orange)</label>
                  <input
                    type="text"
                    value={formData.highlightText || ''}
                    onChange={(e) => setFormData({ ...formData, highlightText: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-[#0D9CFD]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Subtitle</label>
                <input
                  type="text"
                  required
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-[#0D9CFD]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Slide Image URL</label>
                <input
                  type="url"
                  required
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-[#0D9CFD]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingNew(false);
                    setEditingSlide(null);
                  }}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0D9CFD] hover:bg-[#0C8FE8] text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Save Slide
                </button>
              </div>
            </form>
          )}

          {/* Slide list */}
          <div className="space-y-3">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`bg-white border rounded-2xl p-4 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                  slide.enabled ? 'border-slate-200' : 'border-slate-200 opacity-60 bg-slate-50'
                }`}
              >
                <div className="flex items-start sm:items-center gap-4 w-full md:w-auto">
                  <div className="relative w-28 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200 shadow-xs">
                    <img
                      src={slide.imageUrl}
                      alt={slide.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1 right-1 bg-slate-900/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      #{index + 1}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          slide.enabled
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {slide.enabled ? 'Active Slide' : 'Hidden'}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                      {slide.title}{' '}
                      {slide.highlightText && (
                        <span className="text-[#0D9CFD]">{slide.highlightText}</span>
                      )}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-1 max-w-lg">{slide.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
                    <button
                      onClick={() => moveSlide(index, 'up')}
                      disabled={index === 0}
                      className="p-1.5 text-slate-600 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => moveSlide(index, 'down')}
                      disabled={index === slides.length - 1}
                      className="p-1.5 text-slate-600 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => toggleHeroSlide(slide.id)}
                    className="p-2 text-slate-600 hover:text-slate-900 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer"
                    title={slide.enabled ? 'Hide' : 'Show'}
                  >
                    {slide.enabled ? (
                      <Eye className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-slate-400" />
                    )}
                  </button>

                  <button
                    onClick={() => handleOpenEdit(slide)}
                    className="p-2 text-blue-600 hover:text-blue-800 bg-blue-50 rounded-lg border border-blue-100 cursor-pointer"
                    title="Edit Slide"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      if (slides.length <= 1) {
                        showToast.error('You must keep at least one hero slide.');
                        return;
                      }
                      deleteHeroSlide(slide.id);
                      showToast.info('Hero slide removed.');
                    }}
                    className="p-2 text-rose-600 hover:text-rose-800 bg-rose-50 rounded-lg border border-rose-100 cursor-pointer"
                    title="Delete Slide"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

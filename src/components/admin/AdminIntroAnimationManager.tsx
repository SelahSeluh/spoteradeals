import {uploadAdminMedia} from './MediaUploadField';
import React, { useState } from 'react';
import {
  Play,
  Save,
  RotateCcw,
  Sparkles,
  Upload,
  Globe,
  Sliders,
  Eye,
  CheckCircle2,
  Layers,
  Image as ImageIcon,
  Film,
  Palette,
  X,
  Plus,
  Trash2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { IntroAnimationConfig } from '../../types';
import { defaultIntroConfig } from '../../lib/defaultConfigs';
import { OpeningAnimation } from '../OpeningAnimation';

export const AdminIntroAnimationManager: React.FC = () => {
  const { introConfig, updateIntroConfig, publishIntroConfig } = useApp();
  const { showToast } = useToast();

  const [formData, setFormData] = useState<IntroAnimationConfig>(introConfig);
  const [isFullscreenPreview, setIsFullscreenPreview] = useState(false);
  const [simulatorKey, setSimulatorKey] = useState(0);
  const [isPublishing, setIsPublishing] = useState(false);
  const [newSlideUrl, setNewSlideUrl] = useState('');

  // Handle local state update
  const handleChange = <K extends keyof IntroAnimationConfig>(key: K, value: IntroAnimationConfig[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // Handle Solid Gradient nested changes
  const handleGradientChange = (field: keyof IntroAnimationConfig['solidGradient'], val: any) => {
    setFormData((prev) => ({
      ...prev,
      solidGradient: {
        ...prev.solidGradient,
        [field]: val,
      },
    }));
  };

  // Replay preview in simulator
  const handleReplaySimulator = () => {
    setSimulatorKey((k) => k + 1);
  };

  // Save draft locally
  const handleSaveDraft = () => {
    updateIntroConfig(formData);
    showToast('Intro animation settings saved to local draft!', 'success');
  };

  // Publish live to server
  const handlePublishLive = async () => {
    setIsPublishing(true);
    try {
      const ok = await publishIntroConfig(formData);
      if (ok) {
        showToast('Intro animation successfully published live to all users!', 'success');
      } else {
        showToast('Saved locally. Server sync will retry automatically.', 'info');
      }
    } catch (e) {
      showToast('Error publishing intro configuration', 'error');
    } finally {
      setIsPublishing(false);
    }
  };

  // Reset to default
  const handleResetDefaults = () => {
    if (confirm('Reset intro animation settings to original Spotera defaults?')) {
      setFormData(defaultIntroConfig);
      updateIntroConfig(defaultIntroConfig);
      setSimulatorKey((k) => k + 1);
      showToast('Intro animation reset to defaults.', 'info');
    }
  };

  // Add slideshow image
  const handleAddSlideImage = () => {
    if (!newSlideUrl.trim()) return;
    const current = formData.slideshowImages || [];
    setFormData((prev) => ({
      ...prev,
      slideshowImages: [...current, newSlideUrl.trim()],
    }));
    setNewSlideUrl('');
    showToast('Image added to slideshow', 'success');
  };

  const handleRemoveSlideImage = (idx: number) => {
    const current = formData.slideshowImages || [];
    setFormData((prev) => ({
      ...prev,
      slideshowImages: current.filter((_, i) => i !== idx),
    }));
  };

  const handleMoveSlide = (idx: number, direction: 'up' | 'down') => {
    const current = [...(formData.slideshowImages || [])];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= current.length) return;
    const temp = current[idx];
    current[idx] = current[targetIdx];
    current[targetIdx] = temp;
    setFormData((prev) => ({ ...prev, slideshowImages: current }));
  };

  // Handle file uploads (converts file to data URL)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, targetField: 'logo' | 'background' | 'slideshow' | 'video') => {
    const file = e.target.files?.[0];
    if (!file) return;

    void uploadAdminMedia(file).then(url=>{
      if(targetField==='logo')handleChange('logoUrl',url);
      else if(targetField==='background'){handleChange('backgroundImageUrl',url);handleChange('backgroundType','image')}
      else if(targetField==='video'){handleChange('videoUrl',url);handleChange('backgroundType','video')}
      else setFormData(prev=>({...prev,slideshowImages:[...(prev.slideshowImages||[]),url]}));
      showToast('Media uploaded. Save and publish to apply.','info');
    }).catch(error=>showToast(error.message,'error'));

  };

  return (
    <div className="space-y-6">
      {/* Fullscreen Preview Overlay */}
      {isFullscreenPreview && (
        <div className="fixed inset-0 z-[200]">
          <OpeningAnimation previewConfig={formData} onPreviewClose={() => setIsFullscreenPreview(false)} />
          <button
            type="button"
            onClick={() => setIsFullscreenPreview(false)}
            className="fixed top-5 left-5 z-[210] px-4 py-2 bg-black/60 hover:bg-black/80 text-white text-xs font-bold rounded-full border border-white/20 backdrop-blur-md flex items-center gap-1.5 cursor-pointer shadow-lg"
          >
            <X className="w-4 h-4" />
            <span>Close Preview</span>
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#FD9302]" />
            <h2 className="text-lg font-bold text-slate-900">Intro & Opening Animation CMS</h2>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                formData.enabled ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {formData.enabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Customize the entry splash screen: duration (1–10s), background modes (solid gradient with skyline, image, slideshow, video), logo placement, and multilingual slogans.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => setIsFullscreenPreview(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-800 hover:bg-slate-200 flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <Eye className="w-3.5 h-3.5 text-slate-600" />
            <span>Fullscreen Preview</span>
          </button>

          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-900 text-white flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            onClick={handlePublishLive}
            disabled={isPublishing}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0D9CFD] hover:bg-[#0B8AE0] text-white flex items-center gap-1.5 cursor-pointer shadow-xs transition-all disabled:opacity-50"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isPublishing ? 'Publishing...' : 'Publish Live'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Simulator on Left / Detailed Controls on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT: Live Interactive Mobile Simulator (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 sticky top-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-[#0D9CFD]" />
              <span>Live Phone Simulator</span>
            </h3>
            <button
              type="button"
              onClick={handleReplaySimulator}
              className="text-[11px] font-bold text-[#0D9CFD] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Replay Screen</span>
            </button>
          </div>

          {/* Simulator Box (iPhone 9:16 aspect ratio scaled) */}
          <div className="w-full max-w-[320px] mx-auto h-[560px] rounded-3xl border-4 border-slate-900 bg-black overflow-hidden shadow-2xl relative flex flex-col justify-between">
            {/* Phone Notch / Dynamic Island */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-900 rounded-full z-50 pointer-events-none" />

            <div key={simulatorKey} className="w-full h-full relative">
              <OpeningAnimation previewConfig={formData} onPreviewClose={handleReplaySimulator} />
            </div>
          </div>

          <div className="text-center pt-2">
            <p className="text-[11px] text-slate-500">
              Showing active settings with <span className="font-bold text-slate-700">{formData.durationSeconds}s</span> duration &{' '}
              <span className="font-bold text-slate-700">{formData.backgroundType}</span> background.
            </p>
          </div>
        </div>

        {/* RIGHT: Comprehensive Settings Form (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Activation & Duration */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#0D9CFD]" />
              <span>Timing & Animation Transitions</span>
            </h3>

            {/* Toggle Enable */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <label className="text-xs font-bold text-slate-800">Enable Intro Animation</label>
                <p className="text-[11px] text-slate-500">Shows opening branding screen when users first visit the app</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.enabled}
                  onChange={(e) => handleChange('enabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0D9CFD]"></div>
              </label>
            </div>

            {/* Duration Slider (1s to 10s) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">Display Duration: {formData.durationSeconds} Seconds</label>
                <span className="text-xs font-mono font-bold text-[#0D9CFD] px-2 py-0.5 rounded-md bg-blue-50">
                  {formData.durationSeconds}s
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={formData.durationSeconds}
                onChange={(e) => handleChange('durationSeconds', parseFloat(e.target.value))}
                className="w-full accent-[#0D9CFD] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>1s (Snappy)</span>
                <span>2s (Recommended)</span>
                <span>5s (Branded)</span>
                <span>10s (Cinema)</span>
              </div>
            </div>

            {/* Animation Style */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Entrance Animation Style</label>
              <select
                value={formData.animationStyle}
                onChange={(e) => handleChange('animationStyle', e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-[#0D9CFD]"
              >
                <option value="smooth-combined">Smooth Combined (Scale + Fade + Up)</option>
                <option value="fade-in">Classic Smooth Fade In</option>
                <option value="scale-in">Scale In / Pop Reveal</option>
                <option value="slide-up">Slide In from Bottom</option>
                <option value="logo-reveal">Cinematic Logo Zoom Reveal</option>
              </select>
            </div>
          </div>

          {/* Section 2: Background Type & Styling */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#FD9302]" />
              <span>Background Canvas & Media</span>
            </h3>

            {/* Background Type Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(
                [
                  { id: 'solid', label: 'Solid / Gradient', icon: Palette },
                  { id: 'image', label: 'Single Image', icon: ImageIcon },
                  { id: 'slideshow', label: 'Slideshow', icon: Layers },
                  { id: 'video', label: 'Video Clip', icon: Film },
                ] as const
              ).map((type) => {
                const Icon = type.icon;
                const isSelected = formData.backgroundType === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => handleChange('backgroundType', type.id)}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#0D9CFD] bg-blue-50/50 text-[#0D9CFD] shadow-xs'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{type.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Mode A: Solid Gradient Customizer */}
            {formData.backgroundType === 'solid' && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Gradient Colors (Vertical Blend)</span>
                  <div
                    className="w-16 h-5 rounded-md border border-slate-300"
                    style={{
                      backgroundImage: `linear-gradient(to right, ${formData.solidGradient.from}, ${formData.solidGradient.via}, ${formData.solidGradient.to})`,
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600">Top Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.solidGradient.from}
                        onChange={(e) => handleGradientChange('from', e.target.value)}
                        className="w-8 h-8 rounded border border-slate-300 cursor-pointer p-0"
                      />
                      <input
                        type="text"
                        value={formData.solidGradient.from}
                        onChange={(e) => handleGradientChange('from', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600">Middle Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.solidGradient.via}
                        onChange={(e) => handleGradientChange('via', e.target.value)}
                        className="w-8 h-8 rounded border border-slate-300 cursor-pointer p-0"
                      />
                      <input
                        type="text"
                        value={formData.solidGradient.via}
                        onChange={(e) => handleGradientChange('via', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600">Bottom Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.solidGradient.to}
                        onChange={(e) => handleGradientChange('to', e.target.value)}
                        className="w-8 h-8 rounded border border-slate-300 cursor-pointer p-0"
                      />
                      <input
                        type="text"
                        value={formData.solidGradient.to}
                        onChange={(e) => handleGradientChange('to', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <div>
                    <label className="text-xs font-bold text-slate-700">Display UAE Landmarks Skyline</label>
                    <p className="text-[11px] text-slate-500">Includes Burj Khalifa, Dubai Frame, Burj Al Arab silhouettes</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.solidGradient.showSkyline}
                    onChange={(e) => handleGradientChange('showSkyline', e.target.checked)}
                    className="w-4 h-4 accent-[#0D9CFD] cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Mode B: Single Image */}
            {formData.backgroundType === 'image' && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 animate-in fade-in">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Image URL</label>
                  <input
                    type="text"
                    value={formData.backgroundImageUrl || ''}
                    onChange={(e) => handleChange('backgroundImageUrl', e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-[#0D9CFD]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'background')} />
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      handleChange(
                        'backgroundImageUrl',
                        'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=1200'
                      )
                    }
                    className="text-[11px] text-[#0D9CFD] hover:underline"
                  >
                    Use Dubai Skyline Preset
                  </button>
                </div>
              </div>
            )}

            {/* Mode C: Slideshow */}
            {formData.backgroundType === 'slideshow' && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4 animate-in fade-in">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">
                    Slideshow Images ({(formData.slideshowImages || []).length})
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {(formData.slideshowImages || []).map((imgUrl, idx) => (
                      <div key={idx} className="relative h-24 rounded-lg overflow-hidden border border-slate-300 group bg-slate-900">
                        <img src={imgUrl} alt={`Slide ${idx}`} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute top-1 right-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {idx > 0 && (
                            <button
                              type="button"
                              onClick={() => handleMoveSlide(idx, 'up')}
                              title="Move Slide Left/Up"
                              className="p-1 bg-black/70 hover:bg-black text-white rounded cursor-pointer"
                            >
                              ↑
                            </button>
                          )}
                          {idx < (formData.slideshowImages || []).length - 1 && (
                            <button
                              type="button"
                              onClick={() => handleMoveSlide(idx, 'down')}
                              title="Move Slide Right/Down"
                              className="p-1 bg-black/70 hover:bg-black text-white rounded cursor-pointer"
                            >
                              ↓
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveSlideImage(idx)}
                            className="p-1 bg-red-600 text-white rounded cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="absolute bottom-1 left-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/60 text-white">
                          #{idx + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSlideUrl}
                    onChange={(e) => setNewSlideUrl(e.target.value)}
                    placeholder="Enter image URL to add..."
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-[#0D9CFD]"
                  />
                  <button
                    type="button"
                    onClick={handleAddSlideImage}
                    className="px-3 py-1.5 bg-[#0D9CFD] text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                  <label className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'slideshow')} />
                  </label>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Slide Interval: {formData.slideshowIntervalSeconds}s</label>
                  <input
                    type="range"
                    min="0.8"
                    max="4"
                    step="0.2"
                    value={formData.slideshowIntervalSeconds}
                    onChange={(e) => handleChange('slideshowIntervalSeconds', parseFloat(e.target.value))}
                    className="w-full accent-[#0D9CFD] cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Mode D: Video Clip */}
            {formData.backgroundType === 'video' && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 animate-in fade-in">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Video Clip URL (MP4 / WebM)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.videoUrl || ''}
                      onChange={(e) => handleChange('videoUrl', e.target.value)}
                      placeholder="https://...mp4"
                      className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-[#0D9CFD]"
                    />
                    <label className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1 cursor-pointer shrink-0">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Video</span>
                      <input type="file" accept="video/mp4,video/webm" className="hidden" onChange={(e) => handleFileUpload(e, 'video')} />
                    </label>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-medium text-slate-700">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.videoMuted}
                      onChange={(e) => handleChange('videoMuted', e.target.checked)}
                      className="w-4 h-4 accent-[#0D9CFD]"
                    />
                    <span>Start Muted</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.videoLoop}
                      onChange={(e) => handleChange('videoLoop', e.target.checked)}
                      className="w-4 h-4 accent-[#0D9CFD]"
                    />
                    <span>Loop Playback</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Brand Logo & Placement */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#0D9CFD]" />
              <span>Brand Logo & Dimensions</span>
            </h3>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl border border-slate-200 bg-slate-100 p-2 flex items-center justify-center shrink-0">
                <img
                  src={formData.logoUrl || '/spoteradeals-logo.png'}
                  alt="Logo Preview"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/spoteradeals-logo.png';
                  }}
                />
              </div>

              <div className="flex-1 space-y-1">
                <label className="text-xs font-bold text-slate-700">Logo Source URL</label>
                <input
                  type="text"
                  value={formData.logoUrl}
                  onChange={(e) => handleChange('logoUrl', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-[#0D9CFD]"
                />
              </div>

              <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'logo')} />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Logo Size</label>
                <select
                  value={formData.logoSize}
                  onChange={(e) => handleChange('logoSize', e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-[#0D9CFD]"
                >
                  <option value="small">Small (64px)</option>
                  <option value="medium">Medium (112px - Recommended)</option>
                  <option value="large">Large (144px)</option>
                  <option value="xlarge">Extra Large (192px)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Vertical Position</label>
                <select
                  value={formData.logoPosition}
                  onChange={(e) => handleChange('logoPosition', e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-[#0D9CFD]"
                >
                  <option value="center">Center Viewport (Balanced)</option>
                  <option value="upper-third">Upper-Third (Cinema Look)</option>
                  <option value="top">Top Anchored</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Slogan & Multilingual Text */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-500" />
              <span>Slogan & Multilingual Text</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>English Slogan (Default)</span>
                </label>
                <input
                  type="text"
                  value={formData.text}
                  onChange={(e) => handleChange('text', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-[#0D9CFD]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Arabic Slogan (العربية)</span>
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={formData.textAr || ''}
                  onChange={(e) => handleChange('textAr', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-[#0D9CFD]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span>French Slogan (Français)</span>
                </label>
                <input
                  type="text"
                  value={formData.textFr || ''}
                  onChange={(e) => handleChange('textFr', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-[#0D9CFD]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  <span>Russian Slogan (Русский)</span>
                </label>
                <input
                  type="text"
                  value={formData.textRu || ''}
                  onChange={(e) => handleChange('textRu', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-[#0D9CFD]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Font Family</label>
                <select
                  value={formData.fontFamily || 'Outfit'}
                  onChange={(e) => handleChange('fontFamily', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-[#0D9CFD]"
                >
                  <option value="Outfit">Outfit (Default Modern)</option>
                  <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
                  <option value="Poppins">Poppins</option>
                  <option value="Inter">Inter</option>
                  <option value="Montserrat">Montserrat</option>
                  <option value="Playfair Display">Playfair Display (Luxury)</option>
                  <option value="Cairo">Cairo (Arabic Optimized)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Font Weight</label>
                <select
                  value={formData.fontWeight || 'bold'}
                  onChange={(e) => handleChange('fontWeight', e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-[#0D9CFD]"
                >
                  <option value="normal">Normal (400)</option>
                  <option value="medium">Medium (500)</option>
                  <option value="semibold">Semibold (600)</option>
                  <option value="bold">Bold (700)</option>
                  <option value="extrabold">Extra Bold (800)</option>
                  <option value="black">Black (900)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Font Style</label>
                <select
                  value={formData.fontStyle || 'normal'}
                  onChange={(e) => handleChange('fontStyle', e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-[#0D9CFD]"
                >
                  <option value="normal">Normal</option>
                  <option value="italic">Italic</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Preset Size</label>
                <select
                  value={formData.textSize}
                  onChange={(e) => handleChange('textSize', e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-[#0D9CFD]"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium (Recommended)</option>
                  <option value="large">Large</option>
                  <option value="xlarge">Extra Large</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Text Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.textColor || '#FFE082'}
                    onChange={(e) => handleChange('textColor', e.target.value)}
                    className="w-8 h-8 rounded border border-slate-300 cursor-pointer p-0"
                  />
                  <input
                    type="text"
                    value={formData.textColor || '#FFE082'}
                    onChange={(e) => handleChange('textColor', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Brand Accent Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.accentColor || '#FD9302'}
                    onChange={(e) => handleChange('accentColor', e.target.value)}
                    className="w-8 h-8 rounded border border-slate-300 cursor-pointer p-0"
                  />
                  <input
                    type="text"
                    value={formData.accentColor || '#FD9302'}
                    onChange={(e) => handleChange('accentColor', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Text Animation</label>
                <select
                  value={formData.textAnimationStyle}
                  onChange={(e) => handleChange('textAnimationStyle', e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-[#0D9CFD]"
                >
                  <option value="fade-in">Fade In</option>
                  <option value="slide-up">Slide Up</option>
                  <option value="typewriter">Typewriter Style</option>
                  <option value="glow-pulse">Glow Pulse</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Custom Font Size (Optional px)</label>
                <input
                  type="number"
                  min="14"
                  max="60"
                  placeholder="Auto from preset"
                  value={formData.fontSizeCustom || ''}
                  onChange={(e) => handleChange('fontSizeCustom', e.target.value ? parseInt(e.target.value, 10) : undefined)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-1.5 text-xs text-slate-800 outline-none focus:border-[#0D9CFD]"
                />
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="text-xs text-slate-500 hover:text-red-600 font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Defaults</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-900 text-white flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Draft</span>
              </button>

              <button
                type="button"
                onClick={handlePublishLive}
                disabled={isPublishing}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#0D9CFD] hover:bg-[#0B8AE0] text-white flex items-center gap-1.5 cursor-pointer shadow-sm transition-all disabled:opacity-50"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isPublishing ? 'Publishing...' : 'Publish Live to App'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Copy,
  Check,
  Search,
  UploadCloud,
  X,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { MediaItem } from '../../types';

export const AdminMediaLibrary: React.FC = () => {
  const { mediaLibrary, addMediaItem, deleteMediaItem } = useApp();
  const { showToast } = useToast();

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [isAddingNew, setIsAddingNew] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newTag, setNewTag] = useState('General');

  const tags = ['all', 'Skyline', 'Theme Park', 'Food', 'Kids Play', 'Hotel', 'Branding'];

  const filteredMedia = mediaLibrary.filter((item) => {
    if (selectedTag !== 'all' && item.tag?.toLowerCase() !== selectedTag.toLowerCase()) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        (item.altText && item.altText.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    showToast('Image URL copied to clipboard!', 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newUrl) {
      showToast('Title and Image URL are required.', 'error');
      return;
    }

    addMediaItem({
      title: newTitle,
      url: newUrl,
      altText: newTitle,
      tag: newTag,
      category: 'uploaded',
    });

    showToast('Media item added to library!', 'success');
    setNewTitle('');
    setNewUrl('');
    setIsAddingNew(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setNewUrl(base64);
      if (!newTitle) setNewTitle(file.name.replace(/\.[^/.]+$/, ''));
      showToast('Image loaded from device. Ready to save!', 'info');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-[#0D9CFD]" />
            <span>Media & Asset Library</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Store, preview, copy URLs, and upload Dubai skyline images, logos, and deal banners.
          </p>
        </div>

        <button
          onClick={() => setIsAddingNew(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#0D9CFD] hover:bg-[#0b8de5] text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Media Asset</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search media by title..."
            className="w-full pl-9.5 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#0D9CFD]"
          />
        </div>

        {/* Tag Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar py-1">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer transition-colors capitalize ${
                selectedTag === tag
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredMedia.map((item) => (
          <div
            key={item.id}
            className="group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
          >
            {/* Image Container */}
            <div className="relative aspect-video bg-slate-100 overflow-hidden">
              <img
                src={item.url}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {item.tag && (
                <span className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                  {item.tag}
                </span>
              )}
            </div>

            {/* Content & Actions */}
            <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900 truncate" title={item.title}>
                  {item.title}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">{item.uploadedAt || 'Uploaded'}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-1">
                <button
                  onClick={() => handleCopyUrl(item.url, item.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#0D9CFD] text-[11px] font-bold cursor-pointer transition-colors"
                >
                  {copiedId === item.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === item.id ? 'Copied' : 'Copy URL'}</span>
                </button>

                <button
                  onClick={() => {
                    if (confirm(`Delete media asset "${item.title}"?`)) {
                      deleteMediaItem(item.id);
                      showToast('Media item deleted.', 'info');
                    }
                  }}
                  className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs cursor-pointer transition-colors"
                  title="Delete Asset"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Media Modal */}
      {isAddingNew && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Add Media Asset</h3>
                <p className="text-xs text-slate-500">Provide an image URL or upload directly.</p>
              </div>
              <button
                onClick={() => setIsAddingNew(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMedia} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Media Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Dubai Skyline Sunset Banner"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#0D9CFD]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Image Web URL</label>
                <input
                  type="url"
                  value={newUrl.startsWith('data:') ? '' : newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#0D9CFD]"
                />
              </div>

              {/* Upload local image */}
              <div className="border border-dashed border-slate-300 rounded-xl p-4 text-center space-y-2 bg-slate-50">
                <UploadCloud className="w-6 h-6 text-slate-400 mx-auto" />
                <p className="text-xs font-bold text-slate-700">Or pick from local computer</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#0D9CFD] file:text-white cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Category Tag</label>
                <select
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#0D9CFD]"
                >
                  <option value="Skyline">Skyline</option>
                  <option value="Theme Park">Theme Park</option>
                  <option value="Food">Food</option>
                  <option value="Kids Play">Kids Play</option>
                  <option value="Hotel">Hotel</option>
                  <option value="Branding">Branding</option>
                  <option value="General">General</option>
                </select>
              </div>

              {newUrl && (
                <div className="aspect-video w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-900">
                  <img src={newUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#0D9CFD] hover:bg-[#0b8de5] text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Add to Media Library
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

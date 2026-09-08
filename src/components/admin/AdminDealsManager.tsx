import React, { useState } from 'react';
import {
  Tag,
  Plus,
  Trash2,
  Edit,
  Copy,
  Eye,
  EyeOff,
  Flame,
  Star,
  Search,
  Check,
  X,
  MapPin,
  Building2,
  Calendar,
  Ticket,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { Deal, Category, City } from '../../types';

export const AdminDealsManager: React.FC = () => {
  const {
    deals,
    addDeal,
    editDeal,
    deleteDeal,
    duplicateDeal,
    togglePublishDeal,
    toggleFeaturedDeal,
    toggleTrendingDeal,
    businesses,
    categoriesList,
    locationsList,
  } = useApp();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'trending' | 'featured'>('all');

  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Omit<Deal, 'id' | 'rating' | 'reviewCount'>>({
    businessId: businesses[0]?.id || 'biz_1',
    businessName: businesses[0]?.name || 'Dubai Venue',
    title: '',
    description: '',
    category: 'Attractions',
    city: 'Dubai',
    location: 'Downtown Dubai',
    originalPrice: 150,
    discountPrice: 99,
    discountPercent: 34,
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    tags: ['Verified Pass', 'Instant Ticket'],
    expiryDate: '2026-12-31',
    isFeatured: false,
    isTrending: false,
    isPublished: true,
  });

  const filteredDeals = deals.filter((deal) => {
    if (selectedCategory !== 'all' && deal.category.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }
    if (selectedCity !== 'all' && deal.city.toLowerCase() !== selectedCity.toLowerCase()) {
      return false;
    }
    if (statusFilter === 'published' && deal.isPublished === false) return false;
    if (statusFilter === 'draft' && deal.isPublished !== false) return false;
    if (statusFilter === 'trending' && !deal.isTrending) return false;
    if (statusFilter === 'featured' && !deal.isFeatured) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        deal.title.toLowerCase().includes(q) ||
        deal.businessName.toLowerCase().includes(q) ||
        deal.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenAdd = () => {
    setFormData({
      businessId: businesses[0]?.id || 'biz_1',
      businessName: businesses[0]?.name || 'Dubai Venue',
      title: '',
      description: 'Exclusive family discount pass valid across partner venue in the UAE.',
      category: 'Attractions',
      city: 'Dubai',
      location: 'Downtown Dubai',
      originalPrice: 200,
      discountPrice: 120,
      discountPercent: 40,
      imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
      tags: ['Family Pass', 'Instant QR'],
      expiryDate: '2026-12-31',
      isFeatured: false,
      isTrending: false,
      isPublished: true,
    });
    setEditingDeal(null);
    setIsAddingNew(true);
  };

  const handleOpenEdit = (deal: Deal) => {
    setEditingDeal(deal);
    setFormData({
      businessId: deal.businessId,
      businessName: deal.businessName,
      title: deal.title,
      description: deal.description,
      category: deal.category,
      city: deal.city,
      location: deal.location,
      originalPrice: deal.originalPrice,
      discountPrice: deal.discountPrice,
      discountPercent: deal.discountPercent,
      imageUrl: deal.imageUrl,
      tags: deal.tags || [],
      expiryDate: deal.expiryDate,
      isFeatured: !!deal.isFeatured,
      isTrending: !!deal.isTrending,
      isPublished: deal.isPublished !== false,
    });
    setIsAddingNew(false);
  };

  const calculateDiscount = (orig: number, disc: number) => {
    if (orig <= 0) return 0;
    return Math.max(0, Math.min(100, Math.round(((orig - disc) / orig) * 100)));
  };

  const handlePriceChange = (orig: number, disc: number) => {
    const percent = calculateDiscount(orig, disc);
    setFormData((prev) => ({
      ...prev,
      originalPrice: orig,
      discountPrice: disc,
      discountPercent: percent,
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.businessName) {
      showToast('Deal title and business venue name are required.', 'error');
      return;
    }

    if (editingDeal) {
      editDeal({
        ...editingDeal,
        ...formData,
      });
      showToast('Deal updated successfully!', 'success');
    } else {
      addDeal(formData);
      showToast('New deal created and added to catalog!', 'success');
    }

    setIsAddingNew(false);
    setEditingDeal(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Tag className="w-5 h-5 text-[#0D9CFD]" />
            <span>Deals & Passes Management</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Create, edit, duplicate, publish/unpublish, and toggle trending status for all UAE deals.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 bg-[#0D9CFD] hover:bg-[#0b8de5] text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Deal</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, venue, emirate..."
              className="w-full pl-9.5 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#0D9CFD]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none cursor-pointer"
            >
              <option value="all">All Statuses ({deals.length})</option>
              <option value="published">Published</option>
              <option value="draft">Drafts / Hidden</option>
              <option value="trending">Trending (🔥)</option>
              <option value="featured">Featured (⭐)</option>
            </select>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categoriesList.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* City Filter */}
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none cursor-pointer"
            >
              <option value="all">All Emirates</option>
              {locationsList.map((l) => (
                <option key={l.id} value={l.name}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Deals Table / Cards */}
      <div className="space-y-3">
        {filteredDeals.map((deal) => {
          const isPub = deal.isPublished !== false;
          return (
            <div
              key={deal.id}
              className={`bg-white border rounded-2xl p-4 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                isPub ? 'border-slate-200 shadow-xs' : 'border-slate-200 opacity-60 bg-slate-50'
              }`}
            >
              {/* Left: Thumbnail & Info */}
              <div className="flex items-start sm:items-center gap-4 min-w-0">
                <div className="relative w-24 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                  <img
                    src={deal.imageUrl}
                    alt={deal.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-1 left-1 bg-[#FD9302] text-white text-[10px] font-black px-1.5 py-0.2 rounded">
                    -{deal.discountPercent}%
                  </span>
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isPub ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {isPub ? 'Published' : 'Hidden'}
                    </span>
                    {deal.isTrending && (
                      <span className="text-[10px] bg-orange-50 text-[#FD9302] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Flame className="w-3 h-3" /> Trending
                      </span>
                    )}
                    {deal.isFeatured && (
                      <span className="text-[10px] bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400" /> Featured
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400 font-bold">{deal.category}</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{deal.title}</h3>

                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1 text-slate-700 font-semibold">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" /> {deal.businessName}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {deal.city}
                    </span>
                    <span>•</span>
                    <span className="font-extrabold text-[#0D9CFD]">AED {deal.discountPrice}</span>
                    <span className="line-through text-slate-400">AED {deal.originalPrice}</span>
                  </div>
                </div>
              </div>

              {/* Right: Quick Actions */}
              <div className="flex items-center gap-1.5 self-end md:self-center shrink-0">
                {/* Toggle Trending */}
                <button
                  onClick={() => {
                    toggleTrendingDeal(deal.id);
                    showToast(deal.isTrending ? 'Removed from Trending.' : 'Marked as Trending on Homepage!', 'info');
                  }}
                  className={`p-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    deal.isTrending
                      ? 'bg-orange-50 border-orange-200 text-[#FD9302]'
                      : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600'
                  }`}
                  title="Toggle Trending"
                >
                  <Flame className="w-4 h-4" />
                </button>

                {/* Toggle Featured */}
                <button
                  onClick={() => {
                    toggleFeaturedDeal(deal.id);
                    showToast(deal.isFeatured ? 'Removed from Featured.' : 'Marked as Featured!', 'info');
                  }}
                  className={`p-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    deal.isFeatured
                      ? 'bg-amber-50 border-amber-200 text-amber-600'
                      : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600'
                  }`}
                  title="Toggle Featured"
                >
                  <Star className={`w-4 h-4 ${deal.isFeatured ? 'fill-amber-400' : ''}`} />
                </button>

                {/* Toggle Publish / Hidden */}
                <button
                  onClick={() => {
                    togglePublishDeal(deal.id);
                    showToast(isPub ? 'Deal hidden from public catalog.' : 'Deal published live!', 'info');
                  }}
                  className={`p-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    isPub
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      : 'bg-slate-100 border-slate-200 text-slate-500'
                  }`}
                  title={isPub ? 'Unpublish Deal' : 'Publish Deal'}
                >
                  {isPub ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>

                {/* Duplicate Deal */}
                <button
                  onClick={() => {
                    duplicateDeal(deal.id);
                    showToast(`Duplicated "${deal.title}".`, 'info');
                  }}
                  className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold cursor-pointer transition-colors"
                  title="Duplicate Deal"
                >
                  <Copy className="w-4 h-4" />
                </button>

                {/* Edit Deal */}
                <button
                  onClick={() => handleOpenEdit(deal)}
                  className="p-2 rounded-xl bg-blue-50 border border-blue-200 text-[#0D9CFD] hover:bg-blue-100 text-xs font-bold cursor-pointer transition-colors"
                  title="Edit Deal"
                >
                  <Edit className="w-4 h-4" />
                </button>

                {/* Delete Deal */}
                <button
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete "${deal.title}"?`)) {
                      deleteDeal(deal.id);
                      showToast('Deal deleted.', 'info');
                    }
                  }}
                  className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 text-xs font-bold cursor-pointer transition-colors"
                  title="Delete Deal"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Deal Modal */}
      {(isAddingNew || editingDeal) && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingDeal ? 'Edit Deal & Pass' : 'Create New UAE Deal'}
                </h3>
                <p className="text-xs text-slate-500">Configure pricing in AED, venue, image, and flags.</p>
              </div>
              <button
                onClick={() => {
                  setIsAddingNew(false);
                  setEditingDeal(null);
                }}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Title */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Deal Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Atlantis Aquaventure All-Day Waterpark Pass"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#0D9CFD]"
                />
              </div>

              {/* Venue & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Business / Venue Name</label>
                  <input
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    placeholder="e.g., Atlantis The Palm"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#0D9CFD]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#0D9CFD]"
                  >
                    {categoriesList.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* City & Specific Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Emirate Location</label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#0D9CFD]"
                  >
                    {locationsList.map((l) => (
                      <option key={l.id} value={l.name}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Specific Area / Address</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Palm Jumeirah, Dubai"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#0D9CFD]"
                  />
                </div>
              </div>

              {/* Pricing in AED */}
              <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Original Price (AED)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.originalPrice}
                    onChange={(e) => handlePriceChange(Number(e.target.value), formData.discountPrice)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-[#0D9CFD]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Discount Price (AED)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.discountPrice}
                    onChange={(e) => handlePriceChange(formData.originalPrice, Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-[#0D9CFD] outline-none focus:border-[#0D9CFD]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Calculated Discount</label>
                  <div className="w-full bg-orange-50 border border-orange-200 rounded-xl px-3 py-2 text-xs font-extrabold text-[#FD9302] flex items-center justify-center">
                    {formData.discountPercent}% OFF
                  </div>
                </div>
              </div>

              {/* Image URL */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Image URL</label>
                <input
                  type="url"
                  required
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#0D9CFD]"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Description & Inclusions</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the offer, valid days, package inclusions..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-[#0D9CFD]"
                />
              </div>

              {/* Flags */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="w-4 h-4 rounded text-[#0D9CFD]"
                  />
                  <span>Published Live</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isTrending}
                    onChange={(e) => setFormData({ ...formData, isTrending: e.target.checked })}
                    className="w-4 h-4 rounded text-[#FD9302]"
                  />
                  <span>Trending Banner (🔥)</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500"
                  />
                  <span>Featured Pass (⭐)</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingNew(false);
                    setEditingDeal(null);
                  }}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#0D9CFD] hover:bg-[#0b8de5] text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  {editingDeal ? 'Save Deal Changes' : 'Create Deal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  MapPin,
  Building2,
  X,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { LocationItem } from '../../types';

export const AdminLocationsManager: React.FC = () => {
  const {
    locationsList,
    addLocationItem,
    editLocationItem,
    deleteLocationItem,
    toggleLocationItem,
    deals,
  } = useApp();
  const { showToast } = useToast();

  const [editingLocation, setEditingLocation] = useState<LocationItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const [formData, setFormData] = useState<Omit<LocationItem, 'id'>>({
    name: '',
    nameAr: '',
    slug: '',
    enabled: true,
  });

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      nameAr: '',
      slug: '',
      enabled: true,
    });
    setEditingLocation(null);
    setIsAddingNew(true);
  };

  const handleOpenEdit = (loc: LocationItem) => {
    setEditingLocation(loc);
    setFormData({
      name: loc.name,
      nameAr: loc.nameAr || '',
      slug: loc.slug,
      enabled: loc.enabled,
    });
    setIsAddingNew(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      showToast('Location name is required.', 'error');
      return;
    }

    const slug = formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-');

    if (editingLocation) {
      editLocationItem({
        ...editingLocation,
        ...formData,
        slug,
      });
      showToast('Location updated successfully!', 'success');
    } else {
      addLocationItem({
        ...formData,
        slug,
      });
      showToast('New location created!', 'success');
    }

    setIsAddingNew(false);
    setEditingLocation(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#FD9302]" />
            <span>UAE Locations & Emirates Manager</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure the 7 UAE Emirates and regional hubs displayed across headers, deal filters, and maps.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 bg-[#0D9CFD] hover:bg-[#0b8de5] text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Location</span>
        </button>
      </div>

      {/* Locations Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {locationsList.map((loc) => {
          const dealCount = deals.filter(
            (d) => d.city.toLowerCase() === loc.name.toLowerCase()
          ).length;

          return (
            <div
              key={loc.id}
              className={`bg-white border rounded-2xl p-4 transition-all flex items-center justify-between gap-3 ${
                loc.enabled ? 'border-slate-200 shadow-xs' : 'border-slate-200 opacity-60 bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FD9302] flex items-center justify-center font-bold shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 truncate">{loc.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    {loc.nameAr && <span className="font-arabic">{loc.nameAr}</span>}
                    <span>•</span>
                    <span className="font-semibold text-slate-600">{dealCount} deals</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => {
                    toggleLocationItem(loc.id);
                    showToast(loc.enabled ? 'Location deactivated.' : 'Location activated.', 'info');
                  }}
                  className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                    loc.enabled
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      : 'bg-slate-100 border-slate-200 text-slate-500'
                  }`}
                  title={loc.enabled ? 'Disable Location' : 'Enable Location'}
                >
                  {loc.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => handleOpenEdit(loc)}
                  className="p-1.5 rounded-lg bg-blue-50 border border-blue-200 text-[#0D9CFD] hover:bg-blue-100 cursor-pointer"
                  title="Edit Location"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    if (confirm(`Delete location "${loc.name}"?`)) {
                      deleteLocationItem(loc.id);
                      showToast('Location deleted.', 'info');
                    }
                  }}
                  className="p-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 cursor-pointer"
                  title="Delete Location"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {(isAddingNew || editingLocation) && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingLocation ? 'Edit UAE Location' : 'Add New UAE Location'}
                </h3>
                <p className="text-xs text-slate-500">Configure Emirate or region details.</p>
              </div>
              <button
                onClick={() => {
                  setIsAddingNew(false);
                  setEditingLocation(null);
                }}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Location Name (English)</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Dubai, Abu Dhabi, Sharjah"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#0D9CFD]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Location Name (Arabic)</label>
                <input
                  type="text"
                  value={formData.nameAr}
                  onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                  placeholder="e.g., دبي, أبوظبي"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#0D9CFD]"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="loc_enabled"
                  checked={formData.enabled}
                  onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                  className="w-4 h-4 rounded text-[#0D9CFD] cursor-pointer"
                />
                <label htmlFor="loc_enabled" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Enable and show in location pickers & city filters
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingNew(false);
                    setEditingLocation(null);
                  }}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#0D9CFD] hover:bg-[#0b8de5] text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  {editingLocation ? 'Save Changes' : 'Create Location'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

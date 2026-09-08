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
  Utensils,
  Baby,
  Ticket,
  Palmtree,
  Compass,
  Gift,
  Hotel,
  Tag,
  X,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { CategoryItem } from '../../types';

export const AdminCategoriesManager: React.FC = () => {
  const {
    categoriesList,
    addCategoryItem,
    editCategoryItem,
    deleteCategoryItem,
    reorderCategories,
    toggleCategoryItem,
    deals,
  } = useApp();
  const { showToast } = useToast();

  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const [formData, setFormData] = useState<Omit<CategoryItem, 'id'>>({
    name: '',
    nameAr: '',
    slug: '',
    iconName: 'Sparkles',
    badge: '',
    enabled: true,
    displayOrder: (categoriesList?.length || 0) + 1,
  });

  const availableIcons = [
    { name: 'Sparkles', icon: Sparkles },
    { name: 'Utensils', icon: Utensils },
    { name: 'Baby', icon: Baby },
    { name: 'Ticket', icon: Ticket },
    { name: 'Palmtree', icon: Palmtree },
    { name: 'Compass', icon: Compass },
    { name: 'Hotel', icon: Hotel },
    { name: 'Gift', icon: Gift },
  ];

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      nameAr: '',
      slug: '',
      iconName: 'Sparkles',
      badge: '',
      enabled: true,
      displayOrder: (categoriesList?.length || 0) + 1,
    });
    setEditingCategory(null);
    setIsAddingNew(true);
  };

  const handleOpenEdit = (item: CategoryItem) => {
    setEditingCategory(item);
    setFormData({
      name: item.name,
      nameAr: item.nameAr || '',
      slug: item.slug,
      iconName: item.iconName || 'Sparkles',
      badge: item.badge || '',
      enabled: item.enabled,
      displayOrder: item.displayOrder,
    });
    setIsAddingNew(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      showToast('Category name is required.', 'error');
      return;
    }

    const slug = formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-');

    if (editingCategory) {
      editCategoryItem({
        ...editingCategory,
        ...formData,
        slug,
      });
      showToast('Category updated successfully!', 'success');
    } else {
      addCategoryItem({
        ...formData,
        slug,
      });
      showToast('New category created!', 'success');
    }

    setIsAddingNew(false);
    setEditingCategory(null);
  };

  const moveCategory = (index: number, direction: 'up' | 'down') => {
    const list = [...categoriesList];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    const reordered = list.map((item, idx) => ({ ...item, displayOrder: idx + 1 }));
    reorderCategories(reordered);
    showToast('Categories reordered.', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Tag className="w-5 h-5 text-[#0D9CFD]" />
            <span>Category Management</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Add, reorder, edit icons and promotional badges for category pills on the home page and filters.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 bg-[#0D9CFD] hover:bg-[#0b8de5] text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categoriesList.map((cat, index) => {
          const dealCount = deals.filter((d) => d.category.toLowerCase() === cat.name.toLowerCase()).length;
          return (
            <div
              key={cat.id}
              className={`bg-white border rounded-2xl p-4 transition-all flex items-center justify-between gap-3 ${
                cat.enabled ? 'border-slate-200 shadow-xs' : 'border-slate-200 opacity-60 bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0D9CFD] flex items-center justify-center font-bold shrink-0">
                  #{index + 1}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 truncate">{cat.name}</h3>
                    {cat.badge && (
                      <span className="text-[10px] bg-[#FD9302] text-white font-bold px-1.5 py-0.2 rounded-full">
                        {cat.badge}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    {cat.nameAr && <span className="font-arabic">{cat.nameAr}</span>}
                    <span>•</span>
                    <span className="font-semibold text-slate-600">{dealCount} active deals</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
                  <button
                    onClick={() => moveCategory(index, 'up')}
                    disabled={index === 0}
                    className="p-1 text-slate-600 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => moveCategory(index, 'down')}
                    disabled={index === categoriesList.length - 1}
                    className="p-1 text-slate-600 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => {
                    toggleCategoryItem(cat.id);
                    showToast(cat.enabled ? 'Category hidden from filters.' : 'Category enabled.', 'info');
                  }}
                  className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                    cat.enabled
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      : 'bg-slate-100 border-slate-200 text-slate-500'
                  }`}
                  title={cat.enabled ? 'Disable Category' : 'Enable Category'}
                >
                  {cat.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => handleOpenEdit(cat)}
                  className="p-1.5 rounded-lg bg-blue-50 border border-blue-200 text-[#0D9CFD] hover:bg-blue-100 cursor-pointer"
                  title="Edit Category"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    if (confirm(`Delete category "${cat.name}"?`)) {
                      deleteCategoryItem(cat.id);
                      showToast('Category deleted.', 'info');
                    }
                  }}
                  className="p-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 cursor-pointer"
                  title="Delete Category"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {(isAddingNew || editingCategory) && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingCategory ? 'Edit Category' : 'Create New Category'}
                </h3>
                <p className="text-xs text-slate-500">Configure name, Arabic translation, badge and icon.</p>
              </div>
              <button
                onClick={() => {
                  setIsAddingNew(false);
                  setEditingCategory(null);
                }}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Category Name (English)</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Kids Play Areas"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#0D9CFD]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Category Name (Arabic)</label>
                <input
                  type="text"
                  value={formData.nameAr}
                  onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                  placeholder="e.g., مناطق لعب الأطفال"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#0D9CFD]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Badge Label (Optional)</label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="e.g., Hot, Top Rated, 2-for-1"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#0D9CFD]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Icon Type</label>
                  <select
                    value={formData.iconName}
                    onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#0D9CFD]"
                  >
                    {availableIcons.map((i) => (
                      <option key={i.name} value={i.name}>
                        {i.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="cat_enabled"
                  checked={formData.enabled}
                  onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                  className="w-4 h-4 rounded text-[#0D9CFD] cursor-pointer"
                />
                <label htmlFor="cat_enabled" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Display and enable on Homepage filter bar
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingNew(false);
                    setEditingCategory(null);
                  }}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#0D9CFD] hover:bg-[#0b8de5] text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  {editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

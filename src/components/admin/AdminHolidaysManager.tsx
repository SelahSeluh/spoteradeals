import React, { useState } from 'react';
import { Calendar, Plus, Trash2, Edit, Save, CheckCircle2, Sparkles, X } from 'lucide-react';
import { UaePublicHoliday } from '../../types';
import { useToast } from '../../context/ToastContext';

interface AdminHolidaysManagerProps {
  holidays: UaePublicHoliday[];
  onUpdateHolidays: (holidays: UaePublicHoliday[]) => void;
}

export const AdminHolidaysManager: React.FC<AdminHolidaysManagerProps> = ({
  holidays,
  onUpdateHolidays,
}) => {
  const { showToast } = useToast();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<UaePublicHoliday | null>(null);

  const [formName, setFormName] = useState('');
  const [formNameAr, setFormNameAr] = useState('');
  const [formStart, setFormStart] = useState('');
  const [formEnd, setFormEnd] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formIsOfficial, setFormIsOfficial] = useState(true);

  const handleOpenAdd = () => {
    setEditingHoliday(null);
    setFormName('');
    setFormNameAr('');
    setFormStart('');
    setFormEnd('');
    setFormDesc('');
    setFormIsOfficial(true);
    setShowAddModal(true);
  };

  const handleOpenEdit = (h: UaePublicHoliday) => {
    setEditingHoliday(h);
    setFormName(h.name);
    setFormNameAr(h.nameAr || '');
    setFormStart(h.startDate);
    setFormEnd(h.endDate);
    setFormDesc(h.description || '');
    setFormIsOfficial(h.isOfficial ?? true);
    setShowAddModal(true);
  };

  const handleSaveHoliday = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formStart || !formEnd) {
      showToast('Please fill in holiday name, start date, and end date.', 'error');
      return;
    }

    if (editingHoliday) {
      const updated = holidays.map((h) =>
        h.id === editingHoliday.id
          ? {
              ...h,
              name: formName.trim(),
              nameAr: formNameAr.trim() || undefined,
              startDate: formStart,
              endDate: formEnd,
              description: formDesc.trim() || undefined,
              isOfficial: formIsOfficial,
            }
          : h
      );
      onUpdateHolidays(updated);
      showToast('UAE Public Holiday updated successfully!', 'success');
    } else {
      const newH: UaePublicHoliday = {
        id: `holiday_${Date.now()}`,
        name: formName.trim(),
        nameAr: formNameAr.trim() || undefined,
        startDate: formStart,
        endDate: formEnd,
        description: formDesc.trim() || undefined,
        isOfficial: formIsOfficial,
      };
      onUpdateHolidays([...holidays, newH]);
      showToast('New UAE Public Holiday period added!', 'success');
    }

    setShowAddModal(false);
  };

  const handleDeleteHoliday = (id: string, name: string) => {
    if (window.confirm(`Delete holiday period "${name}"?`)) {
      const updated = holidays.filter((h) => h.id !== id);
      onUpdateHolidays(updated);
      showToast(`Holiday "${name}" removed.`, 'info');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#1A4FBF]" />
            <span>UAE Public Holidays & Holiday Periods</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage official and festive UAE holiday periods used by customers to filter experiences on the Explore page.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="bg-[#1A4FBF] hover:bg-blue-800 text-white font-bold text-xs py-2.5 px-4 rounded-2xl shadow-xs transition-colors cursor-pointer flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Holiday Period</span>
        </button>
      </div>

      {/* Holidays List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {holidays.map((h) => (
          <div
            key={h.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between gap-4 hover:border-blue-300 transition-colors"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <span>{h.name}</span>
                    {h.isOfficial && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                        Official UAE
                      </span>
                    )}
                  </h3>
                  {h.nameAr && <div className="text-xs text-slate-400 font-medium">{h.nameAr}</div>}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(h)}
                    className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                    title="Edit Holiday"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteHoliday(h.id, h.name)}
                    className="p-1.5 rounded-xl hover:bg-rose-50 text-rose-600 transition-colors cursor-pointer"
                    title="Delete Holiday"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 text-xs flex items-center gap-2 text-slate-700">
                <Calendar className="w-4 h-4 text-[#1A4FBF] shrink-0" />
                <span className="font-bold text-slate-900">{h.startDate}</span>
                <span className="text-slate-400">until</span>
                <span className="font-bold text-slate-900">{h.endDate}</span>
              </div>

              {h.description && (
                <p className="text-xs text-slate-500 leading-relaxed">
                  {h.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {showAddModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm"
        >
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-base">
                {editingHoliday ? 'Edit UAE Holiday Period' : 'Add New UAE Holiday Period'}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveHoliday} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Holiday Name (English)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Eid Al Adha Holiday"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1A4FBF]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Arabic Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. إجازة عيد الأضحى المبارك"
                  value={formNameAr}
                  onChange={(e) => setFormNameAr(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1A4FBF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formStart}
                    onChange={(e) => setFormStart(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1A4FBF]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    required
                    min={formStart}
                    value={formEnd}
                    onChange={(e) => setFormEnd(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1A4FBF]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Description / Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Holiday highlights, public holiday notes..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1A4FBF]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="holidayOfficial"
                  checked={formIsOfficial}
                  onChange={(e) => setFormIsOfficial(e.target.checked)}
                  className="w-4 h-4 rounded text-[#1A4FBF] focus:ring-[#1A4FBF]"
                />
                <label htmlFor="holidayOfficial" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Official UAE Government Holiday
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#1A4FBF] hover:bg-blue-800 rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Holiday</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

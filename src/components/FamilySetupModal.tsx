import React, { useState } from 'react';
import { Users, Heart, Sparkles, X, Check, MapPin, Calendar, Camera, Plus, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { City, ChildInfo, FamilyProfile } from '../types';

interface FamilySetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FamilySetupModal: React.FC<FamilySetupModalProps> = ({ isOpen, onClose }) => {
  const { user, setUser, updateFamilyProfile, setSelectedCity, setActiveView, t } = useApp();
  const { showToast } = useToast();

  const [childrenCount, setChildrenCount] = useState<number>(user.familyProfile?.childrenCount || 2);
  const [children, setChildren] = useState<ChildInfo[]>(
    user.familyProfile?.children || [
      { id: '1', age: 4, name: 'Ayla' },
      { id: '2', age: 7, name: 'Zayn' },
    ]
  );
  const [preferredLocations, setPreferredLocations] = useState<City[]>(
    user.familyProfile?.preferredLocations || ['Dubai', 'Abu Dhabi']
  );
  const [interests, setInterests] = useState<string[]>(
    user.familyProfile?.interests || ['Indoor play', 'Swimming', 'Birthday parties', 'Family dining']
  );
  const [birthdayMonth, setBirthdayMonth] = useState<string>(user.familyProfile?.birthdayMonth || 'March');

  const allInterests = [
    { id: 'Indoor play', icon: '🎠', label: 'Indoor Play Areas' },
    { id: 'Swimming', icon: '🏊', label: 'Swimming & Waterparks' },
    { id: 'Sports', icon: '⚽', label: 'Sports & Active' },
    { id: 'Art', icon: '🎨', label: 'Art & Crafts' },
    { id: 'Games', icon: '🎮', label: 'Arcades & VR' },
    { id: 'Family dining', icon: '🍕', label: 'Family Dining' },
    { id: 'Birthday parties', icon: '🎂', label: 'Birthday Parties' },
    { id: 'Learning', icon: '📚', label: 'Science & Museums' },
    { id: 'Outdoor activities', icon: '🌳', label: 'Outdoor & Parks' },
    { id: 'Entertainment', icon: '🎬', label: 'Movies & Shows' },
  ];

  const uaeCities: City[] = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'];

  if (!isOpen) return null;

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const toggleCity = (city: City) => {
    setPreferredLocations((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]
    );
  };

  const handleAddChild = () => {
    const newChild: ChildInfo = { id: `child_${Date.now()}`, age: 5, name: '' };
    setChildren([...children, newChild]);
    setChildrenCount(children.length + 1);
  };

  const handleRemoveChild = (id: string) => {
    const updated = children.filter((c) => c.id !== id);
    setChildren(updated);
    setChildrenCount(updated.length);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const profile: FamilyProfile = {
      childrenCount,
      children,
      preferredActivities: interests,
      preferredLocations,
      interests,
      birthdayMonth,
    };
    updateFamilyProfile(profile);
    if (preferredLocations.length > 0) {
      setSelectedCity(preferredLocations[0]);
    }
    showToast.success(t('toastProfileUpdated'));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shadow-inner">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold font-sans">Setup Your Family Profile</h3>
              <p className="text-xs text-cyan-200">Personalize deals for your children & favorite UAE spots</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50">
          {/* Children Information */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
                <Users className="w-4 h-4 text-blue-600" />
                <span>Your Children ({children.length})</span>
              </div>

              <button
                type="button"
                onClick={handleAddChild}
                className="px-3 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Child
              </button>
            </div>

            <div className="space-y-3">
              {children.map((child, index) => (
                <div key={child.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                    #{index + 1}
                  </div>

                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Name (optional)"
                      value={child.name || ''}
                      onChange={(e) => {
                        const updated = children.map((c) => (c.id === child.id ? { ...c, name: e.target.value } : c));
                        setChildren(updated);
                      }}
                      className="text-xs bg-white border border-slate-200 rounded-lg p-2 font-medium"
                    />

                    <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold">
                      <span className="text-slate-400">Age:</span>
                      <select
                        value={child.age}
                        onChange={(e) => {
                          const updated = children.map((c) => (c.id === child.id ? { ...c, age: parseInt(e.target.value) } : c));
                          setChildren(updated);
                        }}
                        className="bg-transparent text-slate-900 focus:outline-none w-full cursor-pointer"
                      >
                        {Array.from({ length: 17 }, (_, i) => i + 1).map((a) => (
                          <option key={a} value={a}>{a} years old</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {children.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveChild(child.id)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Preferred UAE Cities */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
              <MapPin className="w-4 h-4 text-cyan-600" />
              <span>Where does your family spend time?</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {uaeCities.map((city) => {
                const isSelected = preferredLocations.includes(city);
                return (
                  <button
                    key={city}
                    type="button"
                    onClick={() => toggleCity(city)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all border ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/30'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {city}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Family Interests Grid */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
              <Heart className="w-4 h-4 text-rose-600" />
              <span>What activities do your kids love?</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {allInterests.map((item) => {
                const isSelected = interests.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleInterest(item.id)}
                    className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all border text-left ${
                      isSelected
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-blue-600 shadow-md'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white rounded-2xl text-sm font-black shadow-lg shadow-blue-600/30 transition-all active:scale-98"
          >
            Save Family Adventure Profile
          </button>
        </form>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  X,
  Send,
  Sparkles,
  Calendar,
  MapPin,
  Tag,
  DollarSign,
  Phone,
  FileText,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { City } from '../../types';

interface PostRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  initialCategory?: string;
}

export const PostRequestModal: React.FC<PostRequestModalProps> = ({
  isOpen,
  onClose,
  initialQuery = '',
  initialCategory = '',
}) => {
  const { postUserRequest, user, setActiveView } = useApp();
  const { showToast } = useToast();

  const [title, setTitle] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory || 'Food & Beverage');
  const [city, setCity] = useState<City>(user?.location || 'Dubai');
  const [district, setDistrict] = useState('');
  const [neededDate, setNeededDate] = useState('This week');
  const [budgetAED, setBudgetAED] = useState<string>('');
  const [details, setDetails] = useState('');
  const [contactName, setContactName] = useState(user?.name || '');
  const [contactPhone, setContactPhone] = useState(user?.phone || '');
  const [contactEmail, setContactEmail] = useState(user?.email || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  if (!isOpen) return null;

  const categories = [
    'Food & Beverage',
    'Kids & Family',
    'Home & Maintenance',
    'Events & Party',
    'Business & Wholesale',
    'Shopping',
    'Automotive',
    'Services & Wellness',
    'Something Else',
  ];

  const cities: City[] = [
    'Dubai',
    'Abu Dhabi',
    'Sharjah',
    'Ajman',
    'Ras Al Khaimah',
    'Fujairah',
    'Umm Al Quwain',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Please enter what you are looking for', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      postUserRequest({
        userId: user?.id || 'guest',
        userName: contactName || 'FindMe Customer',
        userPhone: contactPhone || '+971 50 000 0000',
        userEmail: contactEmail || 'customer@findme.ae',
        title: title.trim(),
        category,
        city,
        district: district.trim() || undefined,
        neededDate,
        budgetAED: budgetAED ? parseFloat(budgetAED) : undefined,
        details: details.trim() || title.trim(),
      });

      setIsSubmitting(false);
      setSubmittedSuccess(true);
      showToast('Your request has been posted! Vetted suppliers will review and send quotes.', 'success');
    } catch (err) {
      setIsSubmitting(false);
      showToast('Failed to submit request. Please try again.', 'error');
    }
  };

  const handleFinishAndTrack = () => {
    setSubmittedSuccess(false);
    onClose();
    setActiveView('requests');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {submittedSuccess ? (
          <div className="p-6 sm:p-8 text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
                Request Broadcasted
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-sans">
                We're on it!
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Your request <strong className="text-slate-900">"{title}"</strong> has been transmitted to verified businesses and suppliers in {city}. You will receive competitive quotes with pricing, availability, and delivery terms directly in your dashboard.
              </p>
            </div>

            <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100 text-left text-xs text-slate-700 space-y-1.5">
              <div className="font-bold text-[#1060E2] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>What happens next?</span>
              </div>
              <ul className="list-disc pl-4 space-y-1 text-slate-600">
                <li>Local suppliers review your details and requirements</li>
                <li>Multiple tailored quotes will appear in your Requests Hub</li>
                <li>Compare prices, read ratings, and choose the best offer or chat directly</li>
              </ul>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={handleFinishAndTrack}
                className="w-full sm:w-auto px-6 py-3 bg-[#1060E2] hover:bg-[#0A43A3] text-white font-bold rounded-xl text-sm transition-all shadow-md active:scale-95"
              >
                View My Requests & Quotes
              </button>
              <button
                type="button"
                onClick={() => {
                  setSubmittedSuccess(false);
                  onClose();
                }}
                className="w-full sm:w-auto px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition-all"
              >
                Back to Discovery
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-600 to-[#1060E2] text-white relative">
              <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/15 hover:bg-white/25 text-white transition-all cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Universal Discovery Sourcing</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
                Tell Us What You Need.
              </h2>
              <p className="text-blue-100 text-xs sm:text-sm mt-1">
                We'll match your request with vetted local businesses, suppliers, and artisans who provide competitive quotes.
              </p>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Request Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>What are you looking for? *</span>
                  <span className="text-[11px] font-normal text-slate-400">e.g., 300 croissants, AC repair, balloon backdrop</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 150 butter croissants for corporate event or AC deep cleaning"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 outline-none focus:border-[#1060E2] focus:bg-white transition-all"
                />
              </div>

              {/* Category & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-[#1060E2]" />
                    <span>Category</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-[#1060E2] cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#1060E2]" />
                    <span>Emirate / City</span>
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value as City)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-[#1060E2] cursor-pointer"
                  >
                    {cities.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* District & Urgency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Neighborhood / Area (Optional)</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="e.g. Downtown, Marina, Al Barsha"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#1060E2]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#1060E2]" />
                    <span>When do you need it?</span>
                  </label>
                  <select
                    value={neededDate}
                    onChange={(e) => setNeededDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-[#1060E2] cursor-pointer"
                  >
                    <option value="Urgent (Today)">Urgent (Today / ASAP)</option>
                    <option value="Tomorrow">Tomorrow</option>
                    <option value="This week">Within 3-5 days</option>
                    <option value="This weekend">This coming weekend</option>
                    <option value="Flexible">Flexible / Planning ahead</option>
                  </select>
                </div>
              </div>

              {/* Budget AED */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-[#F5820A]" />
                    <span>Estimated Budget (AED, Optional)</span>
                  </span>
                  <span className="text-[11px] text-slate-400">Leave blank for open bids</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={budgetAED}
                    onChange={(e) => setBudgetAED(e.target.value)}
                    placeholder="e.g. 1200"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-[#1060E2]"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-extrabold text-slate-400">
                    AED
                  </span>
                </div>
              </div>

              {/* Details & Specs */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-[#1060E2]" />
                  <span>Specific Requirements, Quantities or Preferences</span>
                </label>
                <textarea
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Give suppliers clear details: quantity, size, dietary requirements, preferred time slot, delivery location..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#1060E2] resize-none"
                />
              </div>

              {/* Contact Information */}
              <div className="pt-2 border-t border-slate-100">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Contact Information (For Supplier Quotes)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Your Name *"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#1060E2]"
                  />
                  <input
                    type="tel"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="Phone / WhatsApp *"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#1060E2]"
                  />
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="Email Address"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#1060E2]"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-[#1060E2] hover:bg-[#0A43A3] text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Posting Request...' : 'Post Request & Get Quotes'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Clock,
  CheckCircle2,
  DollarSign,
  Phone,
  MessageSquare,
  ChevronRight,
  ShieldCheck,
  Star,
  Truck,
  AlertCircle,
  Filter,
  ArrowRight,
  Send,
  Building2,
  Check,
  XCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { UserRequest, RequestQuote } from '../types';
import { PostRequestModal } from '../components/requests/PostRequestModal';

export const RequestsPage: React.FC = () => {
  const { userRequests, requestQuotes, acceptQuote, cancelUserRequest, setActiveView } = useApp();
  const { showToast } = useToast();

  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    userRequests.length > 0 ? userRequests[0].id : null
  );
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  const activeRequest = userRequests.find((r) => r.id === selectedRequestId) || userRequests[0] || null;
  const quotesForActiveRequest = activeRequest
    ? requestQuotes.filter((q) => q.requestId === activeRequest.id)
    : [];

  const filteredRequests = userRequests.filter((req) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'active') return req.status !== 'completed' && req.status !== 'cancelled';
    if (filterStatus === 'quoted') return req.quotesCount > 0;
    if (filterStatus === 'accepted') return req.status === 'accepted';
    return true;
  });

  const getStatusBadge = (status: UserRequest['status']) => {
    switch (status) {
      case 'request_sent':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" />
            <span>Matching Suppliers</span>
          </span>
        );
      case 'quote_received':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-[#1060E2] border border-blue-200">
            <Sparkles className="w-3 h-3" />
            <span>Quotes Received</span>
          </span>
        );
      case 'comparing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
            <Filter className="w-3 h-3" />
            <span>Comparing Quotes</span>
          </span>
        );
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            <span>Quote Accepted</span>
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <Check className="w-3 h-3" />
            <span>Completed</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-50 text-red-700 border border-red-200">
            <XCircle className="w-3 h-3" />
            <span>Cancelled</span>
          </span>
        );
      default:
        return null;
    }
  };

  const handleAcceptQuote = (quote: RequestQuote) => {
    acceptQuote(quote.id);
    showToast(`Accepted quote from ${quote.businessName}! Direct contact unlocked.`, 'success');
  };

  return (
    <div className="min-h-screen bg-[#F7FAFD] pb-24">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-[#0D1B3E] via-[#1060E2] to-[#1060E2] text-white">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>FindMe Requests & Quotes System</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight font-sans">
                Tell Us What You Need. We'll Find It.
              </h1>
              <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
                Post custom orders, wholesale inquiries, or emergency requests. Local businesses submit competitive bids directly to you.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsPostModalOpen(true)}
                className="px-5 py-3.5 bg-[#F5820A] hover:bg-[#E05700] text-white font-extrabold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-sm active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Post a New Request</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {userRequests.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-14 text-center space-y-5 max-w-xl mx-auto shadow-xs">
            <div className="w-16 h-16 bg-blue-50 text-[#1060E2] rounded-2xl flex items-center justify-center mx-auto">
              <Sparkles className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-xl font-bold text-slate-900">No requests posted yet</h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                Whether you need 200 pastries, AC maintenance, party balloon decor, or specific wholesale products, post a quick request and receive verified quotes.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsPostModalOpen(true)}
              className="px-6 py-3 bg-[#1060E2] hover:bg-[#0A43A3] text-white font-bold rounded-xl text-sm transition-all shadow-md active:scale-95 inline-flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Post Your First Request</span>
            </button>
          </div>
        ) : (
          /* Dual-Panel Layout: Request List + Quotes Workspace */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Panel: Request Cards List (lg:col-span-5) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>My Sourcing Requests</span>
                  <span className="text-xs bg-blue-100 text-[#1060E2] font-black px-2 py-0.5 rounded-full">
                    {userRequests.length}
                  </span>
                </h2>

                {/* Filter Selector */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700 font-semibold outline-none cursor-pointer"
                >
                  <option value="all">All Requests</option>
                  <option value="active">Active</option>
                  <option value="quoted">With Quotes</option>
                  <option value="accepted">Accepted</option>
                </select>
              </div>

              <div className="space-y-3">
                {filteredRequests.map((req) => {
                  const isSelected = activeRequest?.id === req.id;
                  const quotesCount = requestQuotes.filter((q) => q.requestId === req.id).length;

                  return (
                    <div
                      key={req.id}
                      onClick={() => setSelectedRequestId(req.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-white border-[#1060E2] ring-2 ring-blue-100 shadow-md'
                          : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          {req.category} • {req.city}
                        </span>
                        {getStatusBadge(req.status)}
                      </div>

                      <h3 className="font-extrabold text-slate-900 text-sm sm:text-base mt-2 line-clamp-2 leading-snug">
                        {req.title}
                      </h3>

                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {req.details}
                      </p>

                      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>Needed: {req.neededDate}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          {req.budgetAED && (
                            <span className="font-extrabold text-slate-900">
                              Budget: AED {req.budgetAED}
                            </span>
                          )}
                          <span className="font-black text-[#1060E2] bg-blue-50 px-2 py-0.5 rounded-md text-[11px]">
                            {quotesCount} {quotesCount === 1 ? 'quote' : 'quotes'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Panel: Active Request & Quotes Detail (lg:col-span-7) */}
            <div className="lg:col-span-7 space-y-6">
              {activeRequest ? (
                <div className="space-y-6">
                  {/* Selected Request Overview Card */}
                  <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg">
                          {activeRequest.category}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {activeRequest.city} {activeRequest.district ? `(${activeRequest.district})` : ''}
                        </span>
                      </div>
                      {getStatusBadge(activeRequest.status)}
                    </div>

                    <h2 className="text-lg sm:text-xl font-black text-slate-900 font-sans">
                      {activeRequest.title}
                    </h2>

                    <div className="p-3.5 bg-slate-50 rounded-xl text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {activeRequest.details}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-1">
                      <div className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-100">
                        <span className="text-slate-400 block text-[10px] font-bold uppercase">Needed By</span>
                        <span className="font-extrabold text-slate-900 mt-0.5 block">{activeRequest.neededDate}</span>
                      </div>
                      <div className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-100">
                        <span className="text-slate-400 block text-[10px] font-bold uppercase">Estimated Budget</span>
                        <span className="font-extrabold text-slate-900 mt-0.5 block">
                          {activeRequest.budgetAED ? `AED ${activeRequest.budgetAED}` : 'Open Quotes'}
                        </span>
                      </div>
                      <div className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-100">
                        <span className="text-slate-400 block text-[10px] font-bold uppercase">Contact Phone</span>
                        <span className="font-bold text-slate-800 mt-0.5 block truncate">{activeRequest.userPhone || 'Provided'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quotes Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#1060E2]" />
                        <span>Submitted Quotes & Offers</span>
                        <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-full">
                          {quotesForActiveRequest.length}
                        </span>
                      </h3>

                      <span className="text-xs text-slate-500 font-medium">
                        Compare price, delivery & ratings
                      </span>
                    </div>

                    {quotesForActiveRequest.length === 0 ? (
                      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
                        <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
                          <Clock className="w-6 h-6 animate-spin" />
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm">Matching with local suppliers...</h4>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                          We have alerted verified businesses in {activeRequest.city}. Typical responses arrive within a few minutes to a couple of hours.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {quotesForActiveRequest.map((quote) => {
                          const isAccepted = quote.status === 'accepted';

                          return (
                            <div
                              key={quote.id}
                              className={`bg-white rounded-2xl sm:rounded-3xl border p-5 sm:p-6 transition-all shadow-xs space-y-4 ${
                                isAccepted ? 'border-emerald-500 ring-2 ring-emerald-100 bg-emerald-50/20' : 'border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              {/* Quote Supplier Header */}
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-black text-slate-900 text-base">
                                      {quote.businessName}
                                    </h4>
                                    <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                      <ShieldCheck className="w-3 h-3 mr-0.5" />
                                      Verified Supplier
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                                    <span className="flex items-center text-amber-500 font-bold">
                                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
                                      {quote.businessRating}
                                    </span>
                                    <span>•</span>
                                    <span className="text-slate-600 font-medium">Ready: {quote.availability}</span>
                                  </div>
                                </div>

                                {/* Quoted Price */}
                                <div className="text-right shrink-0">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                    Quoted Price
                                  </span>
                                  <span className="text-xl sm:text-2xl font-black text-[#1060E2]">
                                    AED {quote.priceAED}
                                  </span>
                                </div>
                              </div>

                              {/* Key Terms Details */}
                              <div className="p-3.5 bg-slate-50 rounded-xl space-y-2 text-xs text-slate-700 border border-slate-100">
                                <p className="leading-relaxed font-medium text-slate-800">
                                  "{quote.notes}"
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px] text-slate-600">
                                  <div className="flex items-center gap-1.5">
                                    <Truck className="w-3.5 h-3.5 text-[#1060E2]" />
                                    <span><strong>Delivery:</strong> {quote.deliveryTerms}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5 text-[#1060E2]" />
                                    <span><strong>Timeline:</strong> {quote.completionTime}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                                <div className="flex items-center gap-3">
                                  <a
                                    href={`tel:${quote.businessPhone}`}
                                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all"
                                  >
                                    <Phone className="w-3.5 h-3.5" />
                                    <span>Call Supplier</span>
                                  </a>
                                  <a
                                    href={`https://wa.me/${quote.businessPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi, I received your quote on FindMe for "${activeRequest.title}".`)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all border border-emerald-200"
                                  >
                                    <MessageSquare className="w-3.5 h-3.5" />
                                    <span>WhatsApp</span>
                                  </a>
                                </div>

                                {isAccepted ? (
                                  <span className="px-4 py-2 bg-emerald-600 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-xs">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>Quote Accepted</span>
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleAcceptQuote(quote)}
                                    className="px-5 py-2.5 bg-[#1060E2] hover:bg-[#0A43A3] text-white font-extrabold text-xs rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                                  >
                                    <span>Accept This Quote</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>

      {/* Post Request Modal */}
      <PostRequestModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
      />
    </div>
  );
};

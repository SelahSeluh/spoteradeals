import React, { useState } from 'react';
import { MessageSquare, Send, X, ShieldCheck, CheckCircle2, Clock, User, Headphones } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';

interface SupportChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportChatModal: React.FC<SupportChatModalProps> = ({ isOpen, onClose }) => {
  const { user, supportMessages, addSupportMessage } = useApp();
  const { showToast } = useToast();
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    addSupportMessage(message, subject, user.role === 'partner' ? 'partner' : 'customer');
    setMessage('');
    setSentSuccess(true);
    showToast.success('Your message has been sent to Spotera Support Admin.');
    setTimeout(() => setSentSuccess(false), 4000);
  };

  const myMessages = supportMessages.filter((m) => m.userId === user.id || m.userEmail === user.email);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-cyan-300 shadow-md">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold font-sans">Spotera Direct Support</h3>
              <p className="text-[11px] text-cyan-200">Customer & Partner Help Desk • Direct to Admin</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form & Chat History */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1 bg-slate-50">
          {sentSuccess && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-extrabold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Your message has been sent to Spotera Support Admin. We will reply shortly!</span>
            </div>
          )}

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider">Send a Message to Admin</h4>
            
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Subject Category</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="General Inquiry">General Family Inquiry</option>
                <option value="Deal Redemption Help">Deal / Coupon Redemption Issue</option>
                <option value="Partner Listing Inquiry">Become a Partner Venue</option>
                <option value="Referral & Rewards">Referral & Rewards Question</option>
                <option value="Account & Profile">Account / Privacy Request</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Your Question or Message</label>
              <textarea
                rows={3}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we help your family today?"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-600/30 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Message to Spotera Support</span>
            </button>
          </form>

          {/* Previous Tickets / Messages */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider">Your Support Conversations ({myMessages.length})</h4>
            {myMessages.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No previous messages found.</p>
            ) : (
              <div className="space-y-3">
                {myMessages.map((msg) => (
                  <div key={msg.id} className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">{msg.subject}</span>
                      <span className="text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {msg.createdAt}
                      </span>
                    </div>

                    <p className="text-xs text-slate-800 font-medium">{msg.message}</p>

                    {msg.adminReply ? (
                      <div className="mt-2 p-2.5 bg-blue-50/80 border border-blue-200 rounded-xl text-xs text-blue-950 space-y-1">
                        <div className="flex items-center gap-1 font-bold text-[10px] text-blue-700">
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                          <span>Spotera Admin Reply:</span>
                        </div>
                        <p>{msg.adminReply}</p>
                      </div>
                    ) : (
                      <div className="text-[10px] text-amber-600 font-bold bg-amber-50 px-2 py-1 rounded-md inline-block">
                        Status: Pending Admin Response
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

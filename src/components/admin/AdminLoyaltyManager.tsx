import React, { useState } from 'react';
import { Award, Trophy, Star, ShieldCheck, Save, PlusCircle, CheckCircle2, Users } from 'lucide-react';
import { LoyaltyRuleConfig, LoyaltyTierConfig, User } from '../../types';
import { useToast } from '../../context/ToastContext';

interface AdminLoyaltyManagerProps {
  loyaltyRules: LoyaltyRuleConfig;
  loyaltyTiers: LoyaltyTierConfig;
  onUpdateRules: (rules: LoyaltyRuleConfig) => void;
  onUpdateTiers: (tiers: LoyaltyTierConfig) => void;
  onGrantPoints?: (targetEmail: string, points: number, reason: string) => void;
}

export const AdminLoyaltyManager: React.FC<AdminLoyaltyManagerProps> = ({
  loyaltyRules,
  loyaltyTiers,
  onUpdateRules,
  onUpdateTiers,
  onGrantPoints,
}) => {
  const { showToast } = useToast();

  const [rules, setRules] = useState<LoyaltyRuleConfig>(loyaltyRules);
  const [tiers, setTiers] = useState<LoyaltyTierConfig>(loyaltyTiers);

  // Grant Points Form State
  const [grantEmail, setGrantEmail] = useState('');
  const [grantPoints, setGrantPoints] = useState(150);
  const [grantReason, setGrantReason] = useState('VIP Goodwill / Loyalty Bonus');

  const handleSaveRules = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateRules(rules);
    showToast('Loyalty Point Rules updated successfully!', 'success');
  };

  const handleSaveTiers = (e: React.FormEvent) => {
    e.preventDefault();
    if (tiers.vipThreshold >= tiers.premiumThreshold) {
      showToast('VIP threshold must be lower than Premium threshold.', 'error');
      return;
    }
    onUpdateTiers(tiers);
    showToast('Membership Tier Thresholds updated successfully!', 'success');
  };

  const handleGrantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!grantEmail.trim()) {
      showToast('Please specify a member email address.', 'error');
      return;
    }
    if (grantPoints <= 0) {
      showToast('Points must be greater than zero.', 'error');
      return;
    }

    if (onGrantPoints) {
      onGrantPoints(grantEmail.trim().toLowerCase(), grantPoints, grantReason);
      showToast(`Granted ${grantPoints} points to ${grantEmail}!`, 'success');
      setGrantEmail('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span>Spotera Loyalty Points & VIP Membership Engine</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Configure how many points users earn from bookings, redemptions, referrals, and manage VIP/Premium thresholds.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Point Rules Configuration */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Award className="w-5 h-5 text-[#1A4FBF]" />
            <h3 className="font-bold text-slate-900 text-sm">Points Awarded Per Action</h3>
          </div>

          <form onSubmit={handleSaveRules} className="space-y-3.5">
            <div>
              <label className="text-xs font-bold text-slate-700 flex justify-between">
                <span>Completed Booking Pass</span>
                <span className="text-[#1A4FBF] font-black">{rules.bookingPoints} pts</span>
              </label>
              <input
                type="number"
                min="0"
                value={rules.bookingPoints}
                onChange={(e) => setRules({ ...rules, bookingPoints: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1A4FBF] mt-1"
              />
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Awarded once per unique booking reference upon completion
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 flex justify-between">
                <span>Deal / Coupon Voucher Redemption</span>
                <span className="text-[#1A4FBF] font-black">{rules.redemptionPoints} pts</span>
              </label>
              <input
                type="number"
                min="0"
                value={rules.redemptionPoints}
                onChange={(e) => setRules({ ...rules, redemptionPoints: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1A4FBF] mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 flex justify-between">
                <span>Points Per AED Spent on Purchases</span>
                <span className="text-[#1A4FBF] font-black">{rules.purchasePointsPerAED} pt / AED</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={rules.purchasePointsPerAED}
                onChange={(e) => setRules({ ...rules, purchasePointsPerAED: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1A4FBF] mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 flex justify-between">
                <span>Successful Friend Referral</span>
                <span className="text-[#1A4FBF] font-black">{rules.referralPoints} pts</span>
              </label>
              <input
                type="number"
                min="0"
                value={rules.referralPoints}
                onChange={(e) => setRules({ ...rules, referralPoints: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1A4FBF] mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 flex justify-between">
                <span>Promotional Campaign Activity</span>
                <span className="text-[#1A4FBF] font-black">{rules.promotionPoints} pts</span>
              </label>
              <input
                type="number"
                min="0"
                value={rules.promotionPoints}
                onChange={(e) => setRules({ ...rules, promotionPoints: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1A4FBF] mt-1"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-[#1A4FBF] hover:bg-blue-800 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Points Earning Rules</span>
              </button>
            </div>
          </form>
        </div>

        {/* Card 2: Membership Tier Thresholds */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Trophy className="w-5 h-5 text-[#F5820A]" />
              <h3 className="font-bold text-slate-900 text-sm">Membership Level Thresholds</h3>
            </div>

            <form onSubmit={handleSaveTiers} className="space-y-4">
              {/* VIP Threshold */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-900 flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                    <span>Spotera VIP Tier</span>
                  </span>
                  <span className="text-xs font-black text-[#F5820A]">
                    {tiers.vipThreshold} Points Required
                  </span>
                </div>
                <input
                  type="number"
                  min="100"
                  step="50"
                  value={tiers.vipThreshold}
                  onChange={(e) => setTiers({ ...tiers, vipThreshold: Number(e.target.value) })}
                  className="w-full bg-white border border-amber-200 rounded-xl p-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <span className="text-[10px] text-amber-800 block">
                  Members below this score are Bronze/Free members.
                </span>
              </div>

              {/* Premium VIP Threshold */}
              <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-purple-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-purple-600" />
                    <span>Spotera Premium VIP Tier</span>
                  </span>
                  <span className="text-xs font-black text-purple-700">
                    {tiers.premiumThreshold} Points Required
                  </span>
                </div>
                <input
                  type="number"
                  min="200"
                  step="50"
                  value={tiers.premiumThreshold}
                  onChange={(e) => setTiers({ ...tiers, premiumThreshold: Number(e.target.value) })}
                  className="w-full bg-white border border-purple-200 rounded-xl p-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <span className="text-[10px] text-purple-800 block">
                  Top tier members unlocking maximum discounts, concierge booking, and VIP partner passes.
                </span>
              </div>

              <button
                type="submit"
                className="w-full bg-[#F5820A] hover:bg-amber-600 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Tier Thresholds</span>
              </button>
            </form>
          </div>

          {/* Card 3: Grant Points Direct to User */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <PlusCircle className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-sm">Admin Manual Points Grant</h3>
            </div>

            <form onSubmit={handleGrantSubmit} className="space-y-2.5">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-0.5">
                  Member Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="customer@example.com"
                  value={grantEmail}
                  onChange={(e) => setGrantEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-0.5">
                    Points Amount
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={grantPoints}
                    onChange={(e) => setGrantPoints(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-0.5">
                    Reason / Note
                  </label>
                  <input
                    type="text"
                    value={grantReason}
                    onChange={(e) => setGrantReason(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-semibold"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Grant Points to Member</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

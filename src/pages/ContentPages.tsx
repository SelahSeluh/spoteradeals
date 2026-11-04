import {LocaleText} from '../components/LocaleText';
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, HelpCircle, ShieldCheck, FileText, CheckCircle2, Building2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SpoteraLogo } from '../components/SpoteraLogo';

export const AboutPage: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
    <div className="bg-gradient-to-r from-[#0C5CAB] via-[#1067BE] to-[#0A4D92] text-white p-8 rounded-3xl shadow-lg space-y-2">
      <div className="flex items-center gap-2 text-blue-100 font-bold text-xs uppercase tracking-widest">
        <span><LocaleText value={"Our Story"}/></span>
      </div>
      <h1 className="text-3xl font-black font-sans"><LocaleText value={"About SpoteraDeals"}/></h1>
      <p className="text-xs text-blue-100/90"><LocaleText value={"Connecting families across Dubai, Abu Dhabi, and the 7 Emirates with verified, memorable activities and exclusive savings."}/></p>
    </div>

    <div className="bg-white p-8 rounded-3xl border border-blue-100 shadow-sm space-y-6 text-xs text-slate-700 leading-relaxed">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <h2 className="text-base font-bold text-slate-900"><LocaleText value={"Empowering UAE Families to Make Lasting Memories"}/></h2>
        <SpoteraLogo size="sm" withIcon={true} />
      </div>

      <p><LocaleText value={"SpoteraDeals was founded with a single mission: to help parents discover high-quality, verified kids play areas, birthday venues, waterparks, summer camps, and family experiences across the United Arab Emirates at affordable prices."}/></p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
        <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100 space-y-1">
          <div className="font-extrabold text-[#0C5CAB] text-sm"><LocaleText value={"100% Verified"}/></div>
          <div className="text-slate-600"><LocaleText value={"All venues and activity providers are thoroughly inspected."}/></div>
        </div>
        <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100 space-y-1">
          <div className="font-extrabold text-emerald-600 text-sm"><LocaleText value={"Instant Digital Pass"}/></div>
          <div className="text-slate-600"><LocaleText value={"Claim free coupons with QR codes ready for immediate venue redemption."}/></div>
        </div>
        <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100 space-y-1">
          <div className="font-extrabold text-amber-600 text-sm"><LocaleText value={"7 Emirates Support"}/></div>
          <div className="text-slate-600"><LocaleText value={"Deals available in Dubai, Abu Dhabi, Sharjah, Ajman, RAK, and Fujairah."}/></div>
        </div>
      </div>
    </div>
  </div>
);

export const ContactPage: React.FC = () => {
  const { footerConfig } = useApp();
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setName('');
    setEmail('');
    setMessage('');
  };

  const hasAddress = Boolean(footerConfig.businessAddress && footerConfig.businessAddress.trim().length > 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="bg-gradient-to-r from-[#0C5CAB] via-[#1067BE] to-[#0A4D92] text-white p-8 rounded-3xl shadow-lg space-y-2">
        <span className="text-blue-100 font-bold text-xs uppercase tracking-widest"><LocaleText value={"Get in Touch"}/></span>
        <h1 className="text-3xl font-black font-sans"><LocaleText value={"Contact SpoteraDeals Support"}/></h1>
        <p className="text-xs text-blue-100/90"><LocaleText value={"Have questions about a deal, voucher claim, or business partnership? We are here to help!"}/></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-3xl border border-blue-100 shadow-sm space-y-4 text-xs">
          <h3 className="font-bold text-slate-900 text-sm"><LocaleText value={"Contact Information"}/></h3>
          <div className="space-y-3 text-slate-600">
            {hasAddress && (
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#0C5CAB] shrink-0 mt-0.5" />
                <span>{footerConfig.businessAddress}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#0C5CAB] shrink-0" />
              <span><LocaleText value={"+971 50 304 8978 (WhatsApp Support)"}/></span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#0C5CAB] shrink-0" />
              <span><LocaleText value={"support@spoteradeals.com"}/></span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="md:col-span-2 bg-white p-6 rounded-3xl border border-blue-100 shadow-sm space-y-4 text-xs">
          <h3 className="font-bold text-slate-900 text-sm"><LocaleText value={"Send Us a Message"}/></h3>
          {submitted && (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl font-bold"><LocaleText value={"Thank you! Your message has been sent. Our team will contact you shortly."}/></div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1"><LocaleText value={"Your Name"}/></label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold focus:ring-2 focus:ring-[#0C5CAB]"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1"><LocaleText value={"Email Address"}/></label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold focus:ring-2 focus:ring-[#0C5CAB]"
              />
            </div>
          </div>
          <div>
            <label className="font-bold text-slate-700 block mb-1"><LocaleText value={"Message"}/></label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold focus:ring-2 focus:ring-[#0C5CAB]"
            />
          </div>
          <button
            type="submit"
            className="py-3 px-6 bg-[#0C5CAB] hover:bg-[#094887] text-white font-bold rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all"
          >
            <Send className="w-4 h-4" />
            <span><LocaleText value={"Submit Message"}/></span>
          </button>
        </form>
      </div>
    </div>
  );
};

export const FaqPage: React.FC = () => {
  const faqs = [
    {
      q: 'How do I claim a coupon on SpoteraDeals?',
      a: 'Simply browse any deal and click "Claim Voucher". A digital pass with a unique QR code will be generated instantly and saved to your SpoteraDeals account wallet.',
    },
    {
      q: 'How do I redeem my coupon at the venue?',
      a: 'Show the QR code on your mobile screen to reception staff at the venue. They will scan or verify your code to apply the discount immediately.',
    },
    {
      q: 'What is the SpoteraDeals VIP Family Pass?',
      a: 'The SpoteraDeals VIP Pass offers extra member discounts, zero booking service fees, early access to summer camps, and exclusive birthday vouchers.',
    },
    {
      q: 'Can business partners list their activities on SpoteraDeals?',
      a: 'Yes! Venue owners and activity providers can sign up via the SpoteraDeals Partner Portal to list their deals and manage customer bookings.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="bg-gradient-to-r from-[#0C5CAB] via-[#1067BE] to-[#0A4D92] text-white p-8 rounded-3xl shadow-lg space-y-2">
        <span className="text-blue-100 font-bold text-xs uppercase tracking-widest flex items-center gap-1">
          <HelpCircle className="w-4 h-4" /><LocaleText value={"FAQ"}/></span>
        <h1 className="text-3xl font-black font-sans"><LocaleText value={"Frequently Asked Questions"}/></h1>
      </div>

      <div className="space-y-4">
        {faqs.map((f, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-blue-100 shadow-sm space-y-2">
            <h3 className="font-bold text-slate-900 text-sm">{f.q}</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const PrivacyPage: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
    <div className="bg-gradient-to-r from-[#0C5CAB] via-[#1067BE] to-[#0A4D92] text-white p-8 rounded-3xl shadow-lg space-y-2">
      <span className="text-blue-100 font-bold text-xs uppercase tracking-widest flex items-center gap-1">
        <ShieldCheck className="w-4 h-4" /><LocaleText value={"Legal"}/></span>
      <h1 className="text-3xl font-black font-sans"><LocaleText value={"Privacy Policy"}/></h1>
    </div>

    <div className="bg-white p-8 rounded-3xl border border-blue-100 shadow-sm space-y-4 text-xs text-slate-700 leading-relaxed font-medium">
      <p><LocaleText value={"At SpoteraDeals, we prioritize the privacy and security of UAE families. This Privacy Policy outlines how we handle user data."}/></p>
      <h3 className="font-bold text-slate-900 text-sm"><LocaleText value={"1. Information We Collect"}/></h3>
      <p><LocaleText value={"We collect personal information such as name, email, phone number, and city preferences when you create an account or claim coupons."}/></p>
      <h3 className="font-bold text-slate-900 text-sm"><LocaleText value={"2. Data Usage & Protection"}/></h3>
      <p><LocaleText value={"Your details are strictly used for issuing digital coupons, processing activity bookings, and sending deal notifications. We never sell your data to third parties."}/></p>
    </div>
  </div>
);

export const TermsPage: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
    <div className="bg-gradient-to-r from-[#0C5CAB] via-[#1067BE] to-[#0A4D92] text-white p-8 rounded-3xl shadow-lg space-y-2">
      <span className="text-blue-100 font-bold text-xs uppercase tracking-widest flex items-center gap-1">
        <FileText className="w-4 h-4" /><LocaleText value={"Terms"}/></span>
      <h1 className="text-3xl font-black font-sans"><LocaleText value={"Terms & Conditions"}/></h1>
    </div>

    <div className="bg-white p-8 rounded-3xl border border-blue-100 shadow-sm space-y-4 text-xs text-slate-700 leading-relaxed font-medium">
      <p><LocaleText value={"By using SpoteraDeals, you agree to comply with our marketplace terms and venue redemption rules."}/></p>
      <h3 className="font-bold text-slate-900 text-sm"><LocaleText value={"1. Coupon Redemption"}/></h3>
      <p><LocaleText value={"Coupons must be presented at partner venues before expiry. Venues reserve the right to verify QR code validity upon arrival."}/></p>
    </div>
  </div>
);

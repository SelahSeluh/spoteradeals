import React, { useState } from 'react';
import { MessageSquare, Star, Smartphone, Instagram, Mail, ArrowUpRight } from 'lucide-react';
import './WebDiscoverySections.css';

const androidUrl = import.meta.env.VITE_GOOGLE_PLAY_URL || '';
const iosUrl = import.meta.env.VITE_APP_STORE_URL || '';
const whatsappUrl = import.meta.env.VITE_WHATSAPP_URL || '';
const youtubeUrl = import.meta.env.VITE_YOUTUBE_URL || '';
const instagramUrl = 'https://www.instagram.com/spoteradealsae/';

export function isInstalledApp() {
  if (typeof window === 'undefined') return false;
  const native = Boolean((window as Window & { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor?.isNativePlatform?.());
  return native || window.matchMedia?.('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
}

export const StoreLinks: React.FC = () => {
  const [installed, setInstalled] = useState(isInstalledApp);
  React.useEffect(() => {
    const media = window.matchMedia('(display-mode: standalone)');
    const update = () => setInstalled(isInstalledApp());
    media.addEventListener?.('change', update);
    return () => media.removeEventListener?.('change', update);
  }, []);
  if (installed) return null;
  return <div className="spotera-store-links" aria-label="Mobile app availability">
    {androidUrl && <a href={androidUrl} target="_blank" rel="noopener noreferrer" className="spotera-store-link">Get it on Google Play <ArrowUpRight size={15}/></a>}
    {iosUrl && <a href={iosUrl} target="_blank" rel="noopener noreferrer" className="spotera-store-link">Download on the App Store <ArrowUpRight size={15}/></a>}
    {!androidUrl && !iosUrl && <span className="spotera-store-pending">Android and iOS apps are in preparation — store links will appear after launch.</span>}
  </div>;
};

export const SocialLinks: React.FC = () => <nav className="spotera-social" aria-label="SpoteraDeals social and contact links">
  <a href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="SpoteraDeals Instagram"><Instagram size={19}/> Instagram</a>
  <a href="mailto:support@spoteradeals.com" aria-label="Email SpoteraDeals support"><Mail size={19}/> Contact</a>
  {whatsappUrl && <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">WhatsApp</a>}
  {youtubeUrl && <a href={youtubeUrl} target="_blank" rel="noopener noreferrer">YouTube</a>}
</nav>;

export const WebDiscoverySections: React.FC = () => {
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(0);
  return <div className="spotera-web-sections">
    <section className="spotera-feedback-section" aria-labelledby="spotera-feedback-heading">
      <div className="spotera-section-intro"><span className="spotera-eyebrow"><MessageSquare size={17}/> Your voice matters</span><h2 id="spotera-feedback-heading">Help us make family days even better</h2><p>Found a great deal? Have a suggestion? Tell us what you would like to see next.</p></div>
      <form className="spotera-feedback-form" onSubmit={event => {
        event.preventDefault();
        const subject = encodeURIComponent('SpoteraDeals customer feedback');
        const body = encodeURIComponent('Rating: ' + (rating ? rating + '/5' : 'Not provided') + '\n\n' + message);
        window.location.href = 'mailto:support@spoteradeals.com?subject=' + subject + '&body=' + body;
      }}>
        <label htmlFor="spotera-feedback-text">Your feedback</label>
        <textarea id="spotera-feedback-text" required minLength={10} maxLength={1500} value={message} onChange={e=>setMessage(e.target.value)} placeholder="Share an idea, a review, or the deals you would love to find..." rows={4}/>
        <div className="spotera-feedback-bottom"><div className="spotera-rating" aria-label="Optional rating">{[1,2,3,4,5].map(n=><button key={n} type="button" aria-label={n + ' stars'} aria-pressed={rating===n} onClick={()=>setRating(n)}><Star size={21} fill={n<=rating?'currentColor':'none'}/></button>)}</div><button type="submit" className="spotera-feedback-send">Send feedback <ArrowUpRight size={16}/></button></div>
        <small>Opens your email app to send your feedback. Reviews are not published automatically.</small>
      </form>
    </section>
    <section className="spotera-app-promo" aria-labelledby="spotera-app-heading"><div><span className="spotera-eyebrow"><Smartphone size={17}/> Your next family adventure</span><h2 id="spotera-app-heading">SpoteraDeals, wherever you go</h2><p>Explore family-friendly offers, discover activities and keep your favorite experiences close. Our mobile apps are on the way.</p><StoreLinks/></div><div className="spotera-phone-preview" aria-hidden="true"><div className="spotera-phone-screen"><span>SpoteraDeals</span><strong>More fun.<br/>More together.</strong><div className="spotera-preview-cards"><i/><i/><i/></div></div></div></section>
  </div>;
};

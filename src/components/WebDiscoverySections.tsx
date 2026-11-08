import React, {useEffect, useState} from 'react';
import {Instagram, Mail, Star, Smartphone, Send, ArrowUpRight} from 'lucide-react';
import './WebDiscoverySections.css';

const androidUrl = import.meta.env.VITE_GOOGLE_PLAY_URL || '';
const iosUrl = import.meta.env.VITE_APP_STORE_URL || '';
const whatsappUrl = import.meta.env.VITE_WHATSAPP_URL || '';
const youtubeUrl = import.meta.env.VITE_YOUTUBE_URL || '';

export function isInstalledApp() {
  if (typeof window === 'undefined') return false;
  return Boolean((window as Window & {Capacitor?: {isNativePlatform?: () => boolean}}).Capacitor?.isNativePlatform?.())
    || Boolean(window.matchMedia?.('(display-mode: standalone)').matches)
    || (navigator as Navigator & {standalone?: boolean}).standalone === true;
}

export const StoreLinks: React.FC = () => {
  const [installed, setInstalled] = useState(isInstalledApp);
  useEffect(() => {
    const media = window.matchMedia('(display-mode: standalone)');
    const update = () => setInstalled(isInstalledApp());
    media.addEventListener?.('change', update);
    return () => media.removeEventListener?.('change', update);
  }, []);
  if (installed) return null;
  return <div className="spotera-store-links">
    {iosUrl ? <a href={iosUrl} target="_blank" rel="noopener noreferrer" className="spotera-store-link"><span className="spotera-store-mark">●</span><span><small>Download on the</small><strong>App Store</strong></span></a> : <div className="spotera-store-link spotera-store-disabled" title="App Store release pending"><span className="spotera-store-mark">●</span><span><small>Coming soon to the</small><strong>App Store</strong></span></div>}
    {androidUrl ? <a href={androidUrl} target="_blank" rel="noopener noreferrer" className="spotera-store-link"><span className="spotera-store-mark">▶</span><span><small>GET IT ON</small><strong>Google Play</strong></span></a> : <div className="spotera-store-link spotera-store-disabled" title="Google Play release pending"><span className="spotera-store-mark">▶</span><span><small>Coming soon to</small><strong>Google Play</strong></span></div>}
  </div>;
};

export const SocialLinks: React.FC = () => <nav className="spotera-social" aria-label="Social and support">
  <a href="https://www.instagram.com/spoteradealsae/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram size={19}/></a>
  <a href="mailto:support@spoteradeals.com" aria-label="Email support"><Mail size={19}/></a>
  {whatsappUrl && <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">WhatsApp</a>}
  {youtubeUrl && <a href={youtubeUrl} target="_blank" rel="noopener noreferrer">YouTube</a>}
</nav>;

const Feedback: React.FC = () => {
  const [rating,setRating] = useState(0);
  const [message,setMessage] = useState('');
  return <details className="spotera-feedback-panel">
    <summary><span><Star size={18}/> Share your experience or suggest a deal</span><ArrowUpRight size={17}/></summary>
    <form onSubmit={e=>{
      e.preventDefault();
      window.location.href='mailto:support@spoteradeals.com?subject='+encodeURIComponent('SpoteraDeals feedback')+'&body='+encodeURIComponent('Rating: '+(rating||'Not rated')+'/5\n\n'+message);
    }}>
      <label htmlFor="spotera-footer-feedback">Your feedback</label>
      <textarea id="spotera-footer-feedback" required minLength={10} maxLength={1500} rows={3} placeholder="What could we improve? What deals would you like?" value={message} onChange={e=>setMessage(e.target.value)}/>
      <div className="spotera-feedback-actions"><div className="spotera-rating" aria-label="Optional rating">{[1,2,3,4,5].map(n=><button type="button" key={n} onClick={()=>setRating(n)} aria-pressed={rating===n} aria-label={n+' stars'}><Star size={18} fill={n<=rating?'currentColor':'none'}/></button>)}</div><button className="spotera-feedback-submit" type="submit"><Send size={15}/> Send feedback</button></div>
      <small>Opens your email app. Feedback is private and not automatically published.</small>
    </form>
  </details>;
};

export const WebDiscoverySections: React.FC = () => {
  const [installed,setInstalled] = useState(isInstalledApp);
  useEffect(()=>{const media=window.matchMedia('(display-mode: standalone)');const update=()=>setInstalled(isInstalledApp());media.addEventListener?.('change',update);return()=>media.removeEventListener?.('change',update)},[]);
  if (installed || (typeof window!=='undefined' && window.self!==window.top)) return null;
  return <section className="spotera-footer-showcase" aria-label="SpoteraDeals app and community">
    <div className="spotera-footer-showcase-copy">
      <span className="spotera-footer-kicker"><Smartphone size={17}/> SPOTERADEALS ON THE GO</span>
      <h2>Your next family day out, right in your pocket.</h2>
      <p>Discover experiences, compare family-friendly offers and plan something memorable across the UAE.</p>
      <StoreLinks/>
      <Feedback/>
    </div>
    <div className="spotera-device-wrap" aria-label="Live preview of the SpoteraDeals website">
      <div className="spotera-device">
        <div className="spotera-device-notch"/>
        <iframe title="SpoteraDeals live homepage preview" src="/?spotera_preview=1" loading="lazy" tabIndex={-1} aria-hidden="true"/>
      </div>
      <span className="spotera-preview-caption">Live website preview · SpoteraDeals</span>
    </div>
  </section>;
};

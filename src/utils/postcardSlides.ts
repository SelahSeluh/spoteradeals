import type { Deal, HeroSlide, HomepageConfig } from '../types';
import {isOfferAvailable} from './offerAvailability';

export function safeMediaUrl(value?: string): string | undefined {
  if (!value || value.length > 3000) return;
  if (/^\/(?!\/)[^\\\s]*$/.test(value)) return value;
  try { const url = new URL(value); if (url.protocol === 'https:' && !url.username && !url.password) return url.href; } catch { /* invalid URL */ }
}

export function postcardSlides(config: HomepageConfig, deals: Deal[], now = Date.now()): HeroSlide[] {
  const available = deals.filter(d => isOfferAvailable(d, now));
  const custom = (config.heroSlides || []).filter(s => s.enabled && (safeMediaUrl(s.imageUrl) || (s.mediaType === 'video' && safeMediaUrl(s.videoUrl))) && (!s.dealId || available.some(d => d.id === s.dealId)))
    .sort((a,b) => Number(!!b.sponsored) - Number(!!a.sponsored) || a.order-b.order)
    .map(s => { const deal = available.find(d => d.id === s.dealId); return deal ? {...s, title:deal.title, imageUrl:deal.imageUrl || deal.images?.[0] || s.imageUrl} : s; });
  if (config.heroIncludeTopOffers === false) return custom.slice(0,10);
  const featured = [...available].sort((a,b) => Number(b.isFeatured)-Number(a.isFeatured) || (a.displayOrder ?? 999)-(b.displayOrder ?? 999) || b.rating-a.rating);
  return [...custom, ...featured.filter(d => !custom.some(s => s.dealId === d.id)).map((d,i) => ({
    id:`offer-${d.id}`, mediaType:d.videoUrl?'video' as const:'image' as const,videoUrl:d.videoUrl,dealId:d.id, title:d.title, subtitle:`${d.businessName} · ${d.city} · AED ${d.discountPrice}`, imageUrl:safeMediaUrl(d.imageUrl || d.images?.[0]) || '/places/skyline.jpg', buttonText:'View offer', enabled:true, order:i,
  }))].slice(0,10);
}

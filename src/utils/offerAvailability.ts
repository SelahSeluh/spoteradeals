import type {Deal} from '../types';

// Offer dates are UAE calendar dates, regardless of the visitor's time zone.
export function isOfferAvailable(deal: Pick<Deal, 'isPublished' | 'startDate' | 'expiryDate' | 'availability' | 'flashDealStartsAt' | 'flashDealExpiresAt'>, now = Date.now()): boolean {
  const today = new Date(now + 4 * 60 * 60 * 1000).toISOString().slice(0, 10);
  return deal.isPublished !== false &&
    (!deal.startDate || deal.startDate.slice(0, 10) <= today) &&
    (!deal.expiryDate || deal.expiryDate.slice(0, 10) >= today) &&
    (!deal.flashDealStartsAt || Date.parse(deal.flashDealStartsAt) <= now) &&
    (!deal.flashDealExpiresAt || Date.parse(deal.flashDealExpiresAt) > now) &&
    !['fully-booked', 'not-available'].includes(deal.availability || '');
}

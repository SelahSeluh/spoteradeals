import { Deal } from '../types';

export type FlashDealStatus = 'not_flash' | 'upcoming' | 'active' | 'expired';

export interface DealTimeState {
  status: FlashDealStatus;
  isActive: boolean;
  isUpcoming: boolean;
  isExpired: boolean;
  startTime: number | null;
  endTime: number | null;
  remainingMs: number;
}

/**
 * Returns exact start time timestamp in ms, or null if unconfigured
 */
export function getDealStartTime(deal: Deal): number | null {
  const startStr = deal.flashDealStartsAt || deal.startDate;
  if (!startStr) return null;
  const t = new Date(startStr).getTime();
  return isNaN(t) ? null : t;
}

/**
 * Returns exact expiration timestamp in ms, or null if unconfigured
 */
export function getDealEndTime(deal: Deal): number | null {
  const endStr = deal.flashDealExpiresAt || deal.expiryDate;
  if (!endStr) return null;
  const t = new Date(endStr).getTime();
  return isNaN(t) ? null : t;
}

/**
 * Evaluates the exact flash deal timing status against a given current time (defaults to Date.now()).
 * Prevents device manipulation where server time is known.
 */
export function getFlashDealStatus(deal: Deal, currentTime = Date.now()): DealTimeState {
  // If not flagged as flash deal and has no flashDealExpiresAt
  if (!deal.isFlashDeal && !deal.flashDealExpiresAt) {
    // Check regular expiration
    const regularEnd = deal.expiryDate ? new Date(deal.expiryDate).getTime() : NaN;
    const isExpired = !isNaN(regularEnd) && currentTime >= regularEnd;
    return {
      status: isExpired ? 'expired' : 'not_flash',
      isActive: !isExpired,
      isUpcoming: false,
      isExpired,
      startTime: null,
      endTime: isNaN(regularEnd) ? null : regularEnd,
      remainingMs: isNaN(regularEnd) ? 0 : Math.max(0, regularEnd - currentTime),
    };
  }

  const startTime = getDealStartTime(deal);
  const endTime = getDealEndTime(deal);

  // 1. Check if deal has a future start time (Upcoming)
  if (startTime !== null && currentTime < startTime) {
    return {
      status: 'upcoming',
      isActive: false,
      isUpcoming: true,
      isExpired: false,
      startTime,
      endTime,
      remainingMs: Math.max(0, startTime - currentTime),
    };
  }

  // 2. Check if expired
  if (endTime !== null && currentTime >= endTime) {
    return {
      status: 'expired',
      isActive: false,
      isUpcoming: false,
      isExpired: true,
      startTime,
      endTime,
      remainingMs: 0,
    };
  }

  // 3. Active flash deal: currentTime >= startTime (or no startTime) and currentTime < endTime
  const remainingMs = endTime !== null ? Math.max(0, endTime - currentTime) : 0;
  return {
    status: 'active',
    isActive: true,
    isUpcoming: false,
    isExpired: false,
    startTime,
    endTime,
    remainingMs,
  };
}

/**
 * Checks whether a deal can be redeemed or claimed based on exact timing rules.
 */
export function validateDealRedemption(deal: Deal, currentTime = Date.now()): {
  allowed: boolean;
  reason?: 'EXPIRED' | 'NOT_STARTED' | 'UNAVAILABLE';
  message?: string;
} {
  const timeState = getFlashDealStatus(deal, currentTime);

  if (timeState.isUpcoming) {
    return {
      allowed: false,
      reason: 'NOT_STARTED',
      message: 'This offer has not started yet. Redemption is not permitted prior to start time.',
    };
  }

  if (timeState.isExpired) {
    return {
      allowed: false,
      reason: 'EXPIRED',
      message: 'This flash deal has expired. Expired offers cannot be redeemed or claimed.',
    };
  }

  if (deal.availability === 'not-available' || deal.availability === 'fully-booked') {
    return {
      allowed: false,
      reason: 'UNAVAILABLE',
      message: 'This deal is currently fully booked or unavailable.',
    };
  }

  return { allowed: true };
}

/**
 * Checks whether a deal can be booked online based on exact timing rules.
 */
export function validateDealBooking(deal: Deal, currentTime = Date.now()): {
  allowed: boolean;
  reason?: 'EXPIRED' | 'NOT_STARTED' | 'UNAVAILABLE';
  message?: string;
} {
  return validateDealRedemption(deal, currentTime);
}

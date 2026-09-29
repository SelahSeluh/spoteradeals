import { Deal } from '../types';

export interface LatLng {
  lat: number;
  lng: number;
}

// Representative coordinates for UAE Cities & Popular Family Hub Districts
export const UAE_CITY_CENTERS: Record<string, LatLng> = {
  'Dubai': { lat: 25.1972, lng: 55.2744 },
  'Abu Dhabi': { lat: 24.4539, lng: 54.3773 },
  'Sharjah': { lat: 25.3463, lng: 55.4209 },
  'Ajman': { lat: 25.4052, lng: 55.5136 },
  'Ras Al Khaimah': { lat: 25.7895, lng: 55.9432 },
  'Fujairah': { lat: 25.1288, lng: 56.3265 },
  'Umm Al Quwain': { lat: 25.5647, lng: 55.5552 },
};

export const UAE_DISTRICT_CENTERS: Record<string, LatLng> = {
  // Dubai
  'Dubai Marina': { lat: 25.0805, lng: 55.1403 },
  'JBR': { lat: 25.0782, lng: 55.1332 },
  'Downtown Dubai': { lat: 25.1972, lng: 55.2744 },
  'Downtown': { lat: 25.1972, lng: 55.2744 },
  'Al Quoz': { lat: 25.1384, lng: 55.2348 },
  'Al Quoz Industrial 1': { lat: 25.1384, lng: 55.2348 },
  'Palm Jumeirah': { lat: 25.1124, lng: 55.1390 },
  'Jumeirah': { lat: 25.2048, lng: 55.2384 },
  'Deira': { lat: 25.2697, lng: 55.3095 },
  'Mirdif': { lat: 25.2155, lng: 55.4208 },
  'Dubai Hills': { lat: 25.1118, lng: 55.2415 },
  'Business Bay': { lat: 25.1862, lng: 55.2635 },
  'Al Barsha': { lat: 25.1112, lng: 55.2016 },
  'Arabian Ranches': { lat: 25.0531, lng: 55.2634 },
  'City Walk': { lat: 25.2078, lng: 55.2619 },
  'Festival City': { lat: 25.2228, lng: 55.3533 },

  // Abu Dhabi
  'Yas Island': { lat: 24.4926, lng: 54.6053 },
  'Saadiyat Island': { lat: 24.5369, lng: 54.4363 },
  'Corniche': { lat: 24.4686, lng: 54.3283 },
  'Al Reem Island': { lat: 24.4984, lng: 54.4068 },

  // Sharjah
  'Al Majaz': { lat: 25.3340, lng: 55.3853 },
  'Al Qasba': { lat: 25.3207, lng: 55.3752 },
  'Al Zahia': { lat: 25.3148, lng: 55.4665 },
};

/**
 * Deterministic jitter based on deal id string
 * Prevents multiple venue pins in the same district from completely overlapping.
 */
function getDeterministicOffset(id: string): { dLat: number; dLng: number } {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  const factor1 = ((hash % 1000) / 1000) - 0.5; // -0.5 to +0.5
  const factor2 = ((((hash >> 3) % 1000)) / 1000) - 0.5;

  return {
    dLat: factor1 * 0.012, // roughly +/- 600m
    dLng: factor2 * 0.014, // roughly +/- 700m
  };
}

/**
 * Resolve exact or mapped coordinates for any Deal
 */
export function getDealCoordinates(deal: Deal): LatLng {
  if (typeof deal.lat === 'number' && typeof deal.lng === 'number' && !isNaN(deal.lat) && !isNaN(deal.lng)) {
    return { lat: deal.lat, lng: deal.lng };
  }

  // Check district match
  if (deal.district && UAE_DISTRICT_CENTERS[deal.district]) {
    const base = UAE_DISTRICT_CENTERS[deal.district];
    const offset = getDeterministicOffset(deal.id);
    return {
      lat: Number((base.lat + offset.dLat).toFixed(5)),
      lng: Number((base.lng + offset.dLng).toFixed(5)),
    };
  }

  // Check district loose search
  if (deal.district) {
    const matchedKey = Object.keys(UAE_DISTRICT_CENTERS).find((k) =>
      deal.district?.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(deal.district?.toLowerCase() || '')
    );
    if (matchedKey) {
      const base = UAE_DISTRICT_CENTERS[matchedKey];
      const offset = getDeterministicOffset(deal.id);
      return {
        lat: Number((base.lat + offset.dLat).toFixed(5)),
        lng: Number((base.lng + offset.dLng).toFixed(5)),
      };
    }
  }

  // Check city match
  const cityBase = UAE_CITY_CENTERS[deal.city] || UAE_CITY_CENTERS['Dubai'];
  const offset = getDeterministicOffset(deal.id);
  return {
    lat: Number((cityBase.lat + offset.dLat * 1.8).toFixed(5)),
    lng: Number((cityBase.lng + offset.dLng * 1.8).toFixed(5)),
  };
}

/**
 * Haversine formula calculation for distance in kilometers
 */
export function calculateHaversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
}

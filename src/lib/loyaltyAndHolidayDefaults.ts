import { UaePublicHoliday, LoyaltyRuleConfig, LoyaltyTierConfig } from '../types';

export const defaultUaeHolidays: UaePublicHoliday[] = [
  {
    id: 'holiday_eid_al_fitr',
    name: 'Eid Al Fitr (Spring Holiday)',
    nameAr: 'عيد الفطر المبارك',
    startDate: '2026-03-20',
    endDate: '2026-03-24',
    description: 'UAE official public holiday celebrating Eid Al Fitr with family gatherings, dining, and festivities.',
    isOfficial: true,
  },
  {
    id: 'holiday_arafat_eid_al_adha',
    name: 'Arafat Day & Eid Al Adha',
    nameAr: 'وقفة عرفة وعيد الأضحى',
    startDate: '2026-05-26',
    endDate: '2026-05-29',
    description: 'Four-day UAE public holiday period for Arafat Day and Eid Al Adha celebrations.',
    isOfficial: true,
  },
  {
    id: 'holiday_islamic_new_year',
    name: 'Islamic New Year (Hijri 1448)',
    nameAr: 'رأس السنة الهجرية',
    startDate: '2026-06-16',
    endDate: '2026-06-16',
    description: 'Islamic Hijri New Year public holiday across the UAE.',
    isOfficial: true,
  },
  {
    id: 'holiday_prophet_birthday',
    name: "Prophet's Birthday (PBUH)",
    nameAr: 'المولد النبوي الشريف',
    startDate: '2026-08-25',
    endDate: '2026-08-25',
    description: "Official holiday marking the Prophet Mohammed's birthday.",
    isOfficial: true,
  },
  {
    id: 'holiday_national_day',
    name: 'UAE Commemoration & National Day (55th)',
    nameAr: 'عيد الاتحاد واليوم الوطني لدولة الإمارات',
    startDate: '2026-12-01',
    endDate: '2026-12-03',
    description: 'UAE National Day extended holiday celebration featuring fireworks, family attractions, and events.',
    isOfficial: true,
  },
  {
    id: 'holiday_winter_break',
    name: 'Winter School Break & New Year',
    nameAr: 'إجازة الشتاء ورأس السنة الميلادية',
    startDate: '2026-12-14',
    endDate: '2027-01-02',
    description: 'Peak UAE family holiday period for theme parks, desert adventures, and kids entertainment.',
    isOfficial: false,
  },
];

export const defaultLoyaltyRules: LoyaltyRuleConfig = {
  bookingPoints: 100,         // Points for completing an activity/venue booking
  redemptionPoints: 50,       // Points for claiming/redeeming a digital coupon/pass
  purchasePointsPerAED: 1,    // 1 point per 1 AED spent
  referralPoints: 250,        // Points for referring a friend who joins
  promotionPoints: 75,        // Points for participating in seasonal promotions
  reviewPoints: 30,           // Points for reviewing a visited business
};

export const defaultLoyaltyTiers: LoyaltyTierConfig = {
  vipThreshold: 1000,         // VIP member threshold (Points required for VIP)
  premiumThreshold: 2500,     // Premium VIP threshold (Points required for Premium)
};

/**
 * Helper to compute UAE Weekend Dates (Saturday & Sunday)
 * @param offsetWeeks 0 for This Weekend, 1 for Next Weekend
 */
export function getUaeWeekendRange(offsetWeeks = 0): { startDate: string; endDate: string } {
  const now = new Date();
  const day = now.getDay(); // 0 is Sunday, 6 is Saturday, 5 is Friday

  // Calculate days until upcoming Saturday (day 6)
  let daysUntilSat = (6 - day + 7) % 7;
  // If today is already Sunday (day 0), consider this weekend as current Sat/Sun
  if (day === 0 && offsetWeeks === 0) {
    daysUntilSat = -1; // yesterday was Saturday
  } else if (day === 6 && offsetWeeks === 0) {
    daysUntilSat = 0; // today is Saturday
  }

  daysUntilSat += offsetWeeks * 7;

  const sat = new Date(now);
  sat.setDate(now.getDate() + daysUntilSat);

  const sun = new Date(sat);
  sun.setDate(sat.getDate() + 1);

  const format = (d: Date) => d.toISOString().split('T')[0];

  return {
    startDate: format(sat),
    endDate: format(sun),
  };
}

import { Deal, Language } from '../types';
import { translations } from '../lib/translations';

export const SUPPORTED_LANGUAGES: Array<{
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
}> = [
  { code: 'en', name: 'English', nativeName: 'English (UAE)', flag: '🇦🇪', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية (الإمارات)', flag: '🇦🇪', dir: 'rtl' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', dir: 'ltr' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'zh', name: 'Chinese', nativeName: '中文 (普通话)', flag: '🇨🇳', dir: 'ltr' },
];

export function isRtlLang(lang: Language): boolean {
  return lang === 'ar';
}

/**
 * Clean fallback helper that guarantees no raw dot-notation keys are ever displayed.
 */
export function safeTranslate(key: string, lang: Language): string {
  if (!key) return '';
  const currentDict = translations[lang] || translations.en;
  if (currentDict && currentDict[key]) {
    return currentDict[key];
  }
  if (translations.en && translations.en[key]) {
    return translations.en[key];
  }
  // If the key is in camelCase or dot notation (e.g. 'deal.title' or 'promoHeadline'), convert to human-readable sentence
  const cleanKey = key.includes('.') ? key.split('.').pop() || key : key;
  return cleanKey
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

/**
 * Returns localized title for a deal based on user's active language
 */
export function getLocalizedTitle(deal: Deal, lang: Language): string {
  if (!deal) return '';
  if (lang === 'ar' && deal.title_ar?.trim()) return deal.title_ar;
  if (lang === 'ru' && deal.title_ru?.trim()) return deal.title_ru;
  if (lang === 'fr' && deal.title_fr?.trim()) return deal.title_fr;
  if (lang === 'zh' && deal.title_zh?.trim()) return deal.title_zh;
  return deal.title;
}

/**
 * Returns localized description for a deal based on user's active language
 */
export function getLocalizedDescription(deal: Deal, lang: Language): string {
  if (!deal) return '';
  if (lang === 'ar' && deal.description_ar?.trim()) return deal.description_ar;
  if (lang === 'ru' && deal.description_ru?.trim()) return deal.description_ru;
  if (lang === 'fr' && deal.description_fr?.trim()) return deal.description_fr;
  if (lang === 'zh' && deal.description_zh?.trim()) return deal.description_zh;
  return deal.description;
}

/**
 * Consistent UAE Currency formatter
 */
export function formatAED(amount: number): string {
  return `AED ${Math.round(amount).toLocaleString('en-US')}`;
}

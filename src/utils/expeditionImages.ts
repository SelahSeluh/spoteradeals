/** Category photos are fallbacks, never replacements for supplied venue imagery. */
export function expeditionImage(subject = ''): string {
  const text = subject.toLowerCase();
  if (/food|dining|restaurant|brunch|café|cafe|meal|coffee/.test(text)) return /coffee|café|cafe/.test(text) ? '/places/cafe.jpg' : '/places/dining.jpg';
  if (/water|splash|aqua|pool|beach|wadi/.test(text)) return '/places/coast.jpg';
  return '/places/skyline.jpg';
}
export function safeImageUrl(value: unknown): string | undefined {
  if (typeof value !== 'string') return;
  if (value.startsWith('/') && !value.startsWith('//')) return value;
  try { if (new URL(value).protocol === 'https:') return value; } catch { /* invalid */ }
}
export function expeditionCatalog<T extends {title?: string; name?: string; category?: string; imageUrl?: string; images?: string[]}>(items: T[]): T[] {
  return items.map(item => {
    const images = (Array.isArray(item.images) ? item.images : []).map(safeImageUrl).filter((url): url is string => Boolean(url));
    const image = safeImageUrl(item.imageUrl) || images[0] || expeditionImage(`${item.title || item.name || ''} ${item.category || ''}`);
    return {...item, imageUrl: image, images: images.length ? images : [image]};
  });
}

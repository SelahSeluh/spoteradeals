/** Representative category photography; these are not verified photographs of individual venues. */
export function expeditionImage(subject = ''): string {
  const text = subject.toLowerCase();
  if (/food|dining|restaurant|brunch|café|cafe|meal|coffee/.test(text)) return /coffee|café|cafe/.test(text) ? '/places/cafe.jpg' : '/places/dining.jpg';
  if (/water|splash|aqua|pool|beach|wadi|snow/.test(text)) return '/places/coast.jpg';
  return '/places/skyline.jpg';
}
export function expeditionCatalog<T extends {title?: string; name?: string; category?: string}>(items: T[]): T[] {
  return items.map(item => {
    const image = expeditionImage(`${item.title || item.name || ''} ${item.category || ''}`);
    return {...item, imageUrl: image, images: [image]};
  });
}

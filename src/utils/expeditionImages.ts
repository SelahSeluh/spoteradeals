/** Original, people-free scenery illustrations for the Pocket Expedition theme. */
export function expeditionImage(subject = ''): string {
  const text = subject.toLowerCase();
  if (/water|splash|aqua|pool|beach|wadi|snow/.test(text)) return '/expedition/waterpark.svg';
  if (/food|dining|restaurant|brunch|café|cafe|meal/.test(text)) return '/expedition/dining.svg';
  if (/outdoor|nature|park|kayak|mountain|desert|climb|rainforest|zoo/.test(text)) return '/expedition/outdoors.svg';
  return '/expedition/play.svg';
}
export function expeditionCatalog<T extends {title?: string; name?: string; category?: string}>(items: T[]): T[] {
  return items.map(item => {
    const image = expeditionImage(`${item.title || item.name || ''} ${item.category || ''}`);
    return {...item, imageUrl: image, images: [image]};
  });
}

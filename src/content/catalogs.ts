export interface TourPackage {
  id: string;
  category: string;
  duration: number;
  price: number;
  image: string;
  alt: string;
  durationMarkup: string;
  categoryLabel: string;
  title: string;
  ratingMarkup: string;
  highlights: string[];
  priceMarkup: string;
  linkMarkup: string;
  routeMap?: { name: string; coordinates: [number, number] }[];
  recommendedVehicles?: string[];
  itinerary?: { day: string; title: string; description: string }[];
}
export interface Vehicle {
  id: string;
  revealClass: string;
  image: string;
  alt: string;
  badge: string;
  name: string;
  specs: string[];
  priceMarkup: string;
  linkMarkup: string;
}
const packageModules = import.meta.glob('../data/packages/*.json', { eager: true });

export const tourPackages = Object.entries(packageModules).map(([path, mod]: [string, any]) => {
  const id = path.split('/').pop()?.replace('.json', '') || 'unknown';
  return {
    id,
    category: mod.category,
    duration: mod.duration,
    price: mod.price,
    image: mod.image,
    alt: mod.alt,
    durationMarkup: mod.durationMarkup,
    categoryLabel: mod.categoryLabel,
    title: mod.title,
    ratingMarkup: mod.ratingMarkup,
    highlights: mod.highlights,
    priceMarkup: mod.priceMarkup,
    linkMarkup: mod.linkMarkup,
    routeMap: mod.routeMap,
    recommendedVehicles: mod.recommendedVehicles,
    itinerary: mod.itinerary
  };
}) satisfies TourPackage[];
const vehicleModules = import.meta.glob('../data/vehicles/*.json', { eager: true });

export const vehicles = Object.values(vehicleModules).map((mod: any) => ({
  id: mod.id,
  revealClass: mod.revealClass,
  image: mod.image,
  alt: mod.alt,
  badge: mod.badge,
  name: mod.name,
  specs: mod.specs,
  priceMarkup: mod.priceMarkup,
  linkMarkup: mod.linkMarkup,
})).sort((a, b) => a.id.localeCompare(b.id)) satisfies Vehicle[];

function assertCatalog(items: Array<{ id: string; image: string; alt: string }>, name: string) {
  const ids = new Set<string>();
  for (const item of items) {
    if (!item.id || ids.has(item.id))
      throw new Error(`Duplicate or missing ${name} ID: ${item.id}`);
    if (!item.image.startsWith('images/') || !item.alt)
      throw new Error(`Invalid ${name} media: ${item.id}`);
    ids.add(item.id);
  }
}
assertCatalog(tourPackages, 'package');
assertCatalog(vehicles, 'vehicle');

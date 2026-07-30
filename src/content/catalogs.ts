export interface TourPackage {
  id: string;
  category: string;
  duration: number;
  durationLabel: string;
  price: number;
  priceSuffix: string;
  image: string;
  imageWidth: number;
  alt: string;
  categoryLabel: string;
  title: string;
  rating: number;
  reviewCount: number;
  highlights: string[];
  href: string;
  routeMap?: { name: string; coordinates: [number, number] }[];
  recommendedVehicles?: string[];
  itinerary?: { day: string; title: string; description: string }[];
}

export interface Vehicle {
  id: string;
  image: string;
  imageWidth: number;
  alt: string;
  badge: string;
  name: string;
  specs: string[];
  price: number;
  priceSuffix: string;
  href: string;
}

const packageImageWidths: Record<string, number> = {
  'cultural_triangle_explorer.webp': 872,
  'beach_paradise_retreat.webp': 1000,
  'wild_life_safari_adventure.webp': 1920,
  'hill_country_adventure.webp': 685,
  'honeymoon_special.webp': 800,
  'ancient_cities_and_heritage.webp': 1640,
  'complete_srilanka_experience.webp': 1920,
};

function basename(path: string) {
  return path.split('/').pop() || '';
}

const packageModules = import.meta.glob('../data/packages/*.json', { eager: true });

export const tourPackages = Object.entries(packageModules).map(([path, mod]: [string, any]) => {
  const id = path.split('/').pop()?.replace('.json', '') || 'unknown';
  const duration = Number(mod.duration);
  return {
    id,
    category: String(mod.category),
    duration,
    durationLabel: String(mod.durationLabel),
    price: Number(mod.price),
    priceSuffix: String(mod.priceSuffix),
    image: String(mod.image),
    imageWidth: packageImageWidths[basename(mod.image)] ?? 960,
    alt: String(mod.alt),
    categoryLabel: String(mod.categoryLabel),
    title: String(mod.title),
    rating: Number(mod.rating),
    reviewCount: Number(mod.reviewCount),
    highlights: Array.isArray(mod.highlights) ? mod.highlights.map(String) : [],
    href: `/packages/${id}.html`,
    routeMap: mod.routeMap,
    recommendedVehicles: mod.recommendedVehicles,
    itinerary: mod.itinerary,
  };
}) satisfies TourPackage[];

const vehicleModules = import.meta.glob('../data/vehicles/*.json', { eager: true });

export const vehicles = Object.values(vehicleModules)
  .map((mod: any) => ({
    id: String(mod.id),
    image: String(mod.image),
    imageWidth: 1024,
    alt: String(mod.alt),
    badge: String(mod.badge),
    name: String(mod.name),
    specs: Array.isArray(mod.specs) ? mod.specs.map(String).filter(Boolean) : [],
    price: Number(mod.price),
    priceSuffix: String(mod.priceSuffix),
    href: '/inquiry.html',
  }))
  .sort((a, b) => a.id.localeCompare(b.id)) satisfies Vehicle[];

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

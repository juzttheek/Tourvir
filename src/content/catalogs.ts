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
    recommendedVehicles: mod.recommendedVehicles
  };
}) satisfies TourPackage[];
export const vehicles = [
  {
    id: 'vehicle-1-comfortable-sedan',
    revealClass: 'vehicle-card reveal delay-1',
    image: 'images/vehicles/comfortable_sedan.webp',
    alt: 'Comfortable Sedan',
    badge: 'Popular',
    name: 'Comfortable Sedan',
    specs: [
      '\n                    <span class="vehicle-card__spec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg></span> 2-3 Passengers\n                  ',
      '\n                    <span class="vehicle-card__spec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><line x1="2" x2="22" y1="12" y2="12"></line><line x1="12" x2="12" y1="2" y2="22"></line><path d="m20 16-4-4 4-4"></path><path d="m4 8 4 4-4 4"></path><path d="m16 4-4 4-4-4"></path><path d="m8 20 4-4 4 4"></path></svg></span> Air Conditioned\n                  ',
      '\n                    <span class="vehicle-card__spec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg></span> 2 Large Bags\n                  ',
      '\n                    <span class="vehicle-card__spec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" x2="12.01" y1="20" y2="20"></line></svg></span> WiFi Available\n                  ',
    ],
    priceMarkup: '$90 <span>/day</span>',
    linkMarkup: '<a href="inquiry.html" class="btn btn--primary btn--sm">Reserve</a>',
  },
  {
    id: 'vehicle-2-luxury-sedan',
    revealClass: 'vehicle-card reveal delay-2',
    image: 'images/vehicles/luxury_sedan.webp',
    alt: 'Luxury Sedan',
    badge: 'VIP',
    name: 'Luxury Sedan',
    specs: [
      '\n                    <span class="vehicle-card__spec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg></span> 2-3 Passengers\n                  ',
      '\n                    <span class="vehicle-card__spec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><line x1="2" x2="22" y1="12" y2="12"></line><line x1="12" x2="12" y1="2" y2="22"></line><path d="m20 16-4-4 4-4"></path><path d="m4 8 4 4-4 4"></path><path d="m16 4-4 4-4-4"></path><path d="m8 20 4-4 4 4"></path></svg></span> Climate Control\n                  ',
      '\n                    <span class="vehicle-card__spec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg></span> 3 Large Bags\n                  ',
      '\n                    <span class="vehicle-card__spec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg></span> Premium Interior\n                  ',
    ],
    priceMarkup: '$150 <span>/day</span>',
    linkMarkup: '<a href="inquiry.html" class="btn btn--primary btn--sm">Reserve</a>',
  },
  {
    id: 'vehicle-3-mini-suv',
    revealClass: 'vehicle-card reveal delay-3',
    image: 'images/vehicles/mini_suv.webp',
    alt: 'Mini SUV',
    badge: 'Compact',
    name: 'Mini SUV',
    specs: [
      '\n                    <span class="vehicle-card__spec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg></span> 3-4 Passengers\n                  ',
      '\n                    <span class="vehicle-card__spec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><line x1="2" x2="22" y1="12" y2="12"></line><line x1="12" x2="12" y1="2" y2="22"></line><path d="m20 16-4-4 4-4"></path><path d="m4 8 4 4-4 4"></path><path d="m16 4-4 4-4-4"></path><path d="m8 20 4-4 4 4"></path></svg></span> Air Conditioned\n                  ',
      '\n                    <span class="vehicle-card__spec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg></span> 2 Large Bags\n                  ',
      '\n                    <span class="vehicle-card__spec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" x2="12.01" y1="20" y2="20"></line></svg></span> WiFi Available\n                  ',
    ],
    priceMarkup: '$100 <span>/day</span>',
    linkMarkup: '<a href="inquiry.html" class="btn btn--primary btn--sm">Reserve</a>',
  },
  {
    id: 'vehicle-4-suv',
    revealClass: 'vehicle-card reveal delay-4',
    image: 'images/vehicles/suv.webp',
    alt: 'SUV',
    badge: 'Adventure',
    name: 'SUV',
    specs: [
      '\n                    <span class="vehicle-card__spec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg></span> 4-5 Passengers\n                  ',
      '\n                    <span class="vehicle-card__spec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><line x1="2" x2="22" y1="12" y2="12"></line><line x1="12" x2="12" y1="2" y2="22"></line><path d="m20 16-4-4 4-4"></path><path d="m4 8 4 4-4 4"></path><path d="m16 4-4 4-4-4"></path><path d="m8 20 4-4 4 4"></path></svg></span> Air Conditioned\n                  ',
      '\n                    <span class="vehicle-card__spec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg></span> 3 Large Bags\n                  ',
      '\n                    <span class="vehicle-card__spec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg></span> Off-Road Ready\n                  ',
    ],
    priceMarkup: '$130 <span>/day</span>',
    linkMarkup: '<a href="inquiry.html" class="btn btn--primary btn--sm">Reserve</a>',
  },
  {
    id: 'vehicle-5-luxury-suv',
    revealClass: 'vehicle-card reveal delay-1',
    image: 'images/vehicles/luxury_suv.webp',
    alt: 'Luxury SUV',
    badge: 'Premium',
    name: 'Luxury SUV',
    specs: [
      '\n                    <span class="vehicle-card__spec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg></span> 5-6 Passengers\n                  ',
      '\n                    <span class="vehicle-card__spec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><line x1="2" x2="22" y1="12" y2="12"></line><line x1="12" x2="12" y1="2" y2="22"></line><path d="m20 16-4-4 4-4"></path><path d="m4 8 4 4-4 4"></path><path d="m16 4-4 4-4-4"></path><path d="m8 20 4-4 4 4"></path></svg></span> Climate Control\n                  ',
      '\n                    <span class="vehicle-card__spec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg></span> 4 Large Bags\n                  ',
      '\n                    <span class="vehicle-card__spec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg></span> Premium Interior\n                  ',
    ],
    priceMarkup: '$150 <span>/day</span>',
    linkMarkup: '<a href="inquiry.html" class="btn btn--primary btn--sm">Reserve</a>',
  },
  {
    id: 'vehicle-6-van',
    revealClass: 'vehicle-card reveal delay-2',
    image: 'images/vehicles/van.webp',
    alt: 'Van',
    badge: 'Family',
    name: 'Van',
    specs: [
      '\n                    <span class="vehicle-card__spec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg></span> 6-8 Passengers\n                  ',
      '\n                    <span class="vehicle-card__spec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><line x1="2" x2="22" y1="12" y2="12"></line><line x1="12" x2="12" y1="2" y2="22"></line><path d="m20 16-4-4 4-4"></path><path d="m4 8 4 4-4 4"></path><path d="m16 4-4 4-4-4"></path><path d="m8 20 4-4 4 4"></path></svg></span> Air Conditioned\n                  ',
      '\n                    <span class="vehicle-card__spec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg></span> 6 Large Bags\n                  ',
      '\n                    <span class="vehicle-card__spec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><rect width="20" height="15" x="2" y="7" rx="2" ry="2"></rect><polyline points="17 2 12 7 7 2"></polyline></svg></span> Entertainment\n                  ',
    ],
    priceMarkup: '$75 <span>/day</span>',
    linkMarkup: '<a href="inquiry.html" class="btn btn--primary btn--sm">Reserve</a>',
  },
  {
    id: 'vehicle-7-coach-bus',
    revealClass: 'vehicle-card reveal delay-3',
    image: 'images/vehicles/coach_bus.webp',
    alt: 'Coach Bus',
    badge: 'Groups',
    name: 'Coach Bus',
    specs: [
      '\n                    <span class="vehicle-card__spec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg></span> 20-40 Passengers\n                  ',
      '\n                    <span class="vehicle-card__spec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><line x1="2" x2="22" y1="12" y2="12"></line><line x1="12" x2="12" y1="2" y2="22"></line><path d="m20 16-4-4 4-4"></path><path d="m4 8 4 4-4 4"></path><path d="m16 4-4 4-4-4"></path><path d="m8 20 4-4 4 4"></path></svg></span> Air Conditioned\n                  ',
      '\n                    <span class="vehicle-card__spec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg></span> Large Storage\n                  ',
      '\n                    <span class="vehicle-card__spec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" x2="12" y1="19" y2="22"></line></svg></span> PA System\n                  ',
    ],
    priceMarkup: '$200 <span>/day</span>',
    linkMarkup: '<a href="inquiry.html" class="btn btn--primary btn--sm">Reserve</a>',
  },
  {
    id: 'vehicle-8-tuk-tuk-city-tour',
    revealClass: 'vehicle-card reveal delay-4',
    image: 'images/vehicles/tuk_tuk.webp',
    alt: 'Tuk-Tuk City Tour',
    badge: 'Fun',
    name: 'Tuk-Tuk City Tour',
    specs: [
      '\n                    <span class="vehicle-card__spec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg></span> 2 Passengers\n                  ',
      '\n                    <span class="vehicle-card__spec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M12.8 19.6A2 2 0 1 0 14 16H2"></path><path d="M17.5 8a2.5 2.5 0 1 1 2 4H2"></path><path d="M9.8 4.4A2 2 0 1 1 11 8H2"></path></svg></span> Open-Air\n                  ',
      '\n                    <span class="vehicle-card__spec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg></span> 1 Small Bag\n                  ',
      '\n                    <span class="vehicle-card__spec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path><circle cx="12" cy="13" r="3"></circle></svg></span> Photo-Ready\n                  ',
    ],
    priceMarkup: '$25 <span>/day</span>',
    linkMarkup: '<a href="inquiry.html" class="btn btn--primary btn--sm">Reserve</a>',
  },
] satisfies Vehicle[];

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
